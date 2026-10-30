import { google, sheets_v4 } from "googleapis";
import nodemailer from "nodemailer";
import { businessEmail, customerEmail } from "./email-templates";
import type { OrderInput } from "./order-schema";
import { DELIVERY_FEES, PRODUCT } from "./product";

export type StoredOrder = OrderInput & {
  orderId: string;
  timestamp: string;
  unitPrice: number;
  deliveryFee: number;
  total: number;
  deliveryZoneLabel: string;
};

const HEADERS = ["Order ID", "Date & Time", "Customer Name", "Phone Number", "Email Address", "Province", "District", "Municipality / City", "Full Address", "Delivery Zone", "Product Name", "Quantity", "Price Per Piece", "Delivery Fee", "Total Price", "Payment Method", "Order Status", "Customer Notes", "Submission Key"];

const COLUMN_WIDTHS = [150, 175, 180, 135, 220, 145, 130, 180, 280, 175, 190, 90, 130, 125, 135, 160, 135, 240, 240];

const NAVY = { red: 20 / 255, green: 45 / 255, blue: 78 / 255 };
const WHITE = { red: 1, green: 1, blue: 1 };
const LIGHT_GRAY = { red: 243 / 255, green: 245 / 255, blue: 249 / 255 };

const STATUS_STYLES = [
  { value: "New Order", foregroundColor: { red: 194 / 255, green: 65 / 255, blue: 12 / 255 }, backgroundColor: { red: 1, green: 237 / 255, blue: 213 / 255 } },
  { value: "Confirmed", foregroundColor: { red: 29 / 255, green: 78 / 255, blue: 216 / 255 }, backgroundColor: { red: 219 / 255, green: 234 / 255, blue: 254 / 255 } },
  { value: "Packed", foregroundColor: { red: 109 / 255, green: 40 / 255, blue: 217 / 255 }, backgroundColor: { red: 237 / 255, green: 233 / 255, blue: 254 / 255 } },
  { value: "Shipped", foregroundColor: { red: 14 / 255, green: 116 / 255, blue: 144 / 255 }, backgroundColor: { red: 207 / 255, green: 250 / 255, blue: 254 / 255 } },
  { value: "Delivered", foregroundColor: { red: 21 / 255, green: 128 / 255, blue: 61 / 255 }, backgroundColor: { red: 220 / 255, green: 252 / 255, blue: 231 / 255 } },
  { value: "Cancelled", foregroundColor: { red: 185 / 255, green: 28 / 255, blue: 28 / 255 }, backgroundColor: { red: 254 / 255, green: 226 / 255, blue: 226 / 255 } },
] as const;

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function sheetsClient() {
  const email = required("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const key = required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");
  const auth = new google.auth.JWT({ email, key, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  return google.sheets({ version: "v4", auth });
}

async function prepareOrderSheet(sheets: sheets_v4.Sheets, spreadsheetId: string, tab: string) {
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets(properties(sheetId,title),bandedRanges(bandedRangeId),conditionalFormats(ranges))",
  });
  let sheet = spreadsheet.data.sheets?.find(item => item.properties?.title === tab);

  if (!sheet?.properties?.sheetId) {
    const created = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          addSheet: {
            properties: {
              title: tab,
              gridProperties: { rowCount: 1000, columnCount: HEADERS.length, frozenRowCount: 1 },
            },
          },
        }],
      },
    });
    const sheetId = created.data.replies?.[0]?.addSheet?.properties?.sheetId;
    if (sheetId === undefined || sheetId === null) throw new Error("Unable to create the order sheet.");
    sheet = { properties: { sheetId, title: tab }, bandedRanges: [] };
  }

  const sheetId = sheet.properties?.sheetId;
  if (sheetId === undefined || sheetId === null) throw new Error("Unable to identify the order sheet.");
  const quotedTab = `'${tab.replace(/'/g, "''")}'`;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${quotedTab}!A1:S1`,
    valueInputOption: "RAW",
    requestBody: { values: [HEADERS] },
  });

  const requests: sheets_v4.Schema$Request[] = [
    ...(sheet.bandedRanges || []).flatMap(range => range.bandedRangeId === undefined ? [] : [{ deleteBanding: { bandedRangeId: range.bandedRangeId } }]),
    ...(sheet.conditionalFormats || []).flatMap((rule, index) => {
      const managesStatusColumn = rule.ranges?.some(range => range.startRowIndex === 1 && range.startColumnIndex === 16 && range.endColumnIndex === 17);
      return managesStatusColumn ? [{ deleteConditionalFormatRule: { sheetId, index } }] : [];
    }).reverse(),
    {
      updateSheetProperties: {
        properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
        fields: "gridProperties.frozenRowCount",
      },
    },
    {
      addBanding: {
        bandedRange: {
          range: { sheetId, startRowIndex: 0, startColumnIndex: 0, endColumnIndex: HEADERS.length },
          rowProperties: {
            headerColor: NAVY,
            firstBandColor: WHITE,
            secondBandColor: LIGHT_GRAY,
          },
        },
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: HEADERS.length },
        cell: {
          userEnteredFormat: {
            textFormat: { bold: true, foregroundColor: WHITE, fontSize: 11 },
            horizontalAlignment: "CENTER",
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
          },
        },
        fields: "userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, startColumnIndex: 0, endColumnIndex: HEADERS.length },
        cell: { userEnteredFormat: { verticalAlignment: "MIDDLE", wrapStrategy: "WRAP", textFormat: { bold: false, foregroundColor: NAVY, fontSize: 10 } } },
        fields: "userEnteredFormat(verticalAlignment,wrapStrategy,textFormat)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, startColumnIndex: 11, endColumnIndex: 12 },
        cell: { userEnteredFormat: { numberFormat: { type: "NUMBER", pattern: "0" }, horizontalAlignment: "CENTER" } },
        fields: "userEnteredFormat(numberFormat,horizontalAlignment)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, startColumnIndex: 12, endColumnIndex: 15 },
        cell: { userEnteredFormat: { numberFormat: { type: "NUMBER", pattern: "\"Rs.\" #,##0" }, horizontalAlignment: "RIGHT" } },
        fields: "userEnteredFormat(numberFormat,horizontalAlignment)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, startColumnIndex: 14, endColumnIndex: 15 },
        cell: { userEnteredFormat: { textFormat: { bold: true, foregroundColor: NAVY } } },
        fields: "userEnteredFormat.textFormat",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, startColumnIndex: 16, endColumnIndex: 17 },
        cell: { userEnteredFormat: { horizontalAlignment: "CENTER", textFormat: { bold: true, foregroundColor: NAVY } } },
        fields: "userEnteredFormat(horizontalAlignment,textFormat)",
      },
    },
    {
      setDataValidation: {
        range: { sheetId, startRowIndex: 1, startColumnIndex: 16, endColumnIndex: 17 },
        rule: {
          condition: { type: "ONE_OF_LIST", values: ["New Order", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].map(userEnteredValue => ({ userEnteredValue })) },
          strict: true,
          showCustomUi: true,
        },
      },
    },
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 },
        properties: { pixelSize: 44 },
        fields: "pixelSize",
      },
    },
    ...COLUMN_WIDTHS.map((pixelSize, index): sheets_v4.Schema$Request => ({
      updateDimensionProperties: {
        range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 },
        properties: { pixelSize },
        fields: "pixelSize",
      },
    })),
    ...STATUS_STYLES.map(({ value, foregroundColor, backgroundColor }, index): sheets_v4.Schema$Request => ({
      addConditionalFormatRule: {
        index,
        rule: {
          ranges: [{ sheetId, startRowIndex: 1, startColumnIndex: 16, endColumnIndex: 17 }],
          booleanRule: {
            condition: { type: "TEXT_EQ", values: [{ userEnteredValue: value }] },
            format: { backgroundColor, textFormat: { bold: true, foregroundColor } },
          },
        },
      },
    })),
  ];

  await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } });
  return { quotedTab, sheetId };
}

async function formatAppendedOrderRow(sheets: sheets_v4.Sheets, spreadsheetId: string, sheetId: number, rowIndex: number) {
  const range = { sheetId, startRowIndex: rowIndex, endRowIndex: rowIndex + 1 };
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: { ...range, startColumnIndex: 0, endColumnIndex: HEADERS.length },
            cell: { userEnteredFormat: { verticalAlignment: "MIDDLE", wrapStrategy: "WRAP", textFormat: { bold: false, foregroundColor: NAVY, fontSize: 10 } } },
            fields: "userEnteredFormat(verticalAlignment,wrapStrategy,textFormat)",
          },
        },
        {
          repeatCell: {
            range: { ...range, startColumnIndex: 11, endColumnIndex: 12 },
            cell: { userEnteredFormat: { numberFormat: { type: "NUMBER", pattern: "0" }, horizontalAlignment: "CENTER" } },
            fields: "userEnteredFormat(numberFormat,horizontalAlignment)",
          },
        },
        {
          repeatCell: {
            range: { ...range, startColumnIndex: 12, endColumnIndex: 15 },
            cell: { userEnteredFormat: { numberFormat: { type: "NUMBER", pattern: "\"Rs.\" #,##0" }, horizontalAlignment: "RIGHT" } },
            fields: "userEnteredFormat(numberFormat,horizontalAlignment)",
          },
        },
        {
          repeatCell: {
            range: { ...range, startColumnIndex: 14, endColumnIndex: 15 },
            cell: { userEnteredFormat: { textFormat: { bold: true, foregroundColor: NAVY } } },
            fields: "userEnteredFormat.textFormat",
          },
        },
        {
          repeatCell: {
            range: { ...range, startColumnIndex: 16, endColumnIndex: 17 },
            cell: { userEnteredFormat: { horizontalAlignment: "CENTER", textFormat: { bold: true, foregroundColor: NAVY } } },
            fields: "userEnteredFormat(horizontalAlignment,textFormat)",
          },
        },
      ],
    },
  });
}

export async function saveOrder(order: StoredOrder, submissionKey: string) {
  const spreadsheetId = required("GOOGLE_SHEET_ID");
  const tab = process.env.GOOGLE_SHEET_TAB_NAME?.trim() || "Induction_Orders";
  const sheets = sheetsClient();
  const { quotedTab, sheetId } = await prepareOrderSheet(sheets, spreadsheetId, tab);
  const existing = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${quotedTab}!A:S` });
  const rows = existing.data.values || [];
  const duplicate = rows.slice(1).find(row => row[18] === submissionKey);
  if (duplicate) return { duplicate: true, orderId: String(duplicate[0]) };
  const appended = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${quotedTab}!A:S`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [[order.orderId, order.timestamp, order.fullName, order.phone, order.email, order.province, order.district, order.city, order.address, order.deliveryZoneLabel, PRODUCT.name, order.quantity, order.unitPrice, order.deliveryFee, order.total, "Cash On Delivery", "New Order", order.notes || "", submissionKey]] },
  });
  const appendedRow = appended.data.updates?.updatedRange?.match(/![A-Z]+(\d+):[A-Z]+\d+$/)?.[1];
  if (appendedRow) await formatAppendedOrderRow(sheets, spreadsheetId, sheetId, Number(appendedRow) - 1);
  return { duplicate: false, orderId: order.orderId };
}

export function createStoredOrder(input: OrderInput): StoredOrder {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)?.value || "";
  const dateKey = `${get("year")}${get("month")}${get("day")}`;
  const timestamp = `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")} NPT`;
  const deliveryFee = DELIVERY_FEES[input.deliveryZone];
  return { ...input, productName: PRODUCT.name, paymentMethod: "Cash On Delivery", orderId: `VM-${dateKey}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`, timestamp, unitPrice: PRODUCT.unitPrice, deliveryFee, total: input.quantity * PRODUCT.unitPrice + deliveryFee, deliveryZoneLabel: input.deliveryZone === "inside" ? "Inside Kathmandu Valley" : "Outside Kathmandu Valley" };
}

export async function sendOrderEmails(order: StoredOrder) {
  const host = required("SMTP_HOST");
  const port = Number(required("SMTP_PORT"));
  const user = required("SMTP_USER");
  const pass = required("SMTP_PASS");
  const business = required("BUSINESS_EMAIL");
  const from = required("EMAIL_FROM");
  const brand = process.env.BRAND_NAME?.trim() || "VoltMart Nepal";
  const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  const [businessResult, customerResult] = await Promise.allSettled([
    transporter.sendMail({ from: `${brand} <${from}>`, to: business, replyTo: order.email, subject: `[${brand}] New Induction Chulo Order — ${order.orderId}`, html: businessEmail(order, brand) }),
    transporter.sendMail({ from: `${brand} <${from}>`, to: order.email, replyTo: business, subject: `Your Order Has Been Received - ${brand}`, html: customerEmail(order, brand, business) }),
  ]);
  const failures = [businessResult, customerResult].filter(r => r.status === "rejected");
  if (failures.length) console.error("Order stored but one or more order emails failed", failures.map(f => f.status === "rejected" ? f.reason : null));
  return { sent: failures.length === 0, failedCount: failures.length };
}
