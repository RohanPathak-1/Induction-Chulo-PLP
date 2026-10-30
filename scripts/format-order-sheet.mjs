import { createHash } from "node:crypto";
import { google } from "googleapis";

const HEADERS_COUNT = 19;
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
];

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function sameColor(actual, expected) {
  return ["red", "green", "blue"].every(channel => Math.abs((actual?.[channel] || 0) - expected[channel]) < 0.01);
}

const spreadsheetId = required("GOOGLE_SHEET_ID");
const tab = process.env.GOOGLE_SHEET_TAB_NAME?.trim() || "Induction_Orders";
const auth = new google.auth.JWT({
  email: required("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
  key: required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });
const quotedTab = `'${tab.replace(/'/g, "''")}'`;

const metadata = await sheets.spreadsheets.get({
  spreadsheetId,
  fields: "sheets(properties(sheetId,title,gridProperties),bandedRanges(bandedRangeId),conditionalFormats(ranges))",
});
const sheet = metadata.data.sheets?.find(item => item.properties?.title === tab);
const sheetId = sheet?.properties?.sheetId;
if (sheetId === undefined || sheetId === null) throw new Error(`Sheet ${tab} was not found.`);

const before = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${quotedTab}!A:S`, valueRenderOption: "UNFORMATTED_VALUE" });
const beforeValues = before.data.values || [];
const beforeHash = createHash("sha256").update(JSON.stringify(beforeValues)).digest("hex");

const requests = [
  ...(sheet.bandedRanges || []).flatMap(range => range.bandedRangeId === undefined ? [] : [{ deleteBanding: { bandedRangeId: range.bandedRangeId } }]),
  ...(sheet.conditionalFormats || []).flatMap((rule, index) => {
    const managesStatusColumn = rule.ranges?.some(range => range.startRowIndex === 1 && range.startColumnIndex === 16 && range.endColumnIndex === 17);
    return managesStatusColumn ? [{ deleteConditionalFormatRule: { sheetId, index } }] : [];
  }).reverse(),
  { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: "gridProperties.frozenRowCount" } },
  {
    addBanding: {
      bandedRange: {
        range: { sheetId, startRowIndex: 0, startColumnIndex: 0, endColumnIndex: HEADERS_COUNT },
        rowProperties: { headerColor: NAVY, firstBandColor: WHITE, secondBandColor: LIGHT_GRAY },
      },
    },
  },
  {
    repeatCell: {
      range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: HEADERS_COUNT },
      cell: { userEnteredFormat: { textFormat: { bold: true, foregroundColor: WHITE, fontSize: 11 }, horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE", wrapStrategy: "WRAP" } },
      fields: "userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
    },
  },
  {
    repeatCell: {
      range: { sheetId, startRowIndex: 1, startColumnIndex: 0, endColumnIndex: HEADERS_COUNT },
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
        condition: { type: "ONE_OF_LIST", values: STATUS_STYLES.map(({ value }) => ({ userEnteredValue: value })) },
        strict: true,
        showCustomUi: true,
      },
    },
  },
  { updateDimensionProperties: { range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 }, properties: { pixelSize: 44 }, fields: "pixelSize" } },
  ...COLUMN_WIDTHS.map((pixelSize, index) => ({ updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 }, properties: { pixelSize }, fields: "pixelSize" } })),
  ...STATUS_STYLES.map(({ value, foregroundColor, backgroundColor }, index) => ({
    addConditionalFormatRule: {
      index,
      rule: {
        ranges: [{ sheetId, startRowIndex: 1, startColumnIndex: 16, endColumnIndex: 17 }],
        booleanRule: { condition: { type: "TEXT_EQ", values: [{ userEnteredValue: value }] }, format: { backgroundColor, textFormat: { bold: true, foregroundColor } } },
      },
    },
  })),
];

await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } });

const after = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${quotedTab}!A:S`, valueRenderOption: "UNFORMATTED_VALUE" });
const afterValues = after.data.values || [];
const afterHash = createHash("sha256").update(JSON.stringify(afterValues)).digest("hex");
const lastRow = Math.max(afterValues.length, 2);
const formatted = await sheets.spreadsheets.get({
  spreadsheetId,
  ranges: [`${quotedTab}!A1:S${lastRow}`],
  includeGridData: true,
  fields: "sheets(properties(gridProperties.frozenRowCount),data(rowData(values(effectiveFormat))))",
});
const rowData = formatted.data.sheets?.[0]?.data?.[0]?.rowData || [];
const headerFormat = rowData[0]?.values?.[0]?.effectiveFormat;
let readableDataCells = true;
let alternatingRowBackgrounds = true;
let populatedStatusCellsStyled = true;
for (let rowIndex = 1; rowIndex < afterValues.length; rowIndex += 1) {
  const expectedBackground = rowIndex % 2 === 1 ? WHITE : LIGHT_GRAY;
  const rowBackground = rowData[rowIndex]?.values?.[0]?.effectiveFormat?.backgroundColor;
  if (!sameColor(rowBackground, expectedBackground)) alternatingRowBackgrounds = false;
  for (let columnIndex = 0; columnIndex < afterValues[rowIndex].length; columnIndex += 1) {
    if (afterValues[rowIndex][columnIndex] === "" || afterValues[rowIndex][columnIndex] === undefined || columnIndex === 16) continue;
    const color = rowData[rowIndex]?.values?.[columnIndex]?.effectiveFormat?.textFormat?.foregroundColor;
    if (!sameColor(color, NAVY)) readableDataCells = false;
  }
  const status = afterValues[rowIndex][16];
  const expectedStatus = STATUS_STYLES.find(item => item.value === status);
  if (expectedStatus) {
    const statusFormat = rowData[rowIndex]?.values?.[16]?.effectiveFormat;
    if (!sameColor(statusFormat?.backgroundColor, expectedStatus.backgroundColor) || !sameColor(statusFormat?.textFormat?.foregroundColor, expectedStatus.foregroundColor) || statusFormat?.textFormat?.bold !== true) {
      populatedStatusCellsStyled = false;
    }
  }
}

const result = {
  sheet: tab,
  existingDataRows: Math.max(afterValues.length - 1, 0),
  valuesPreserved: beforeHash === afterHash,
  headerNavy: sameColor(headerFormat?.backgroundColor, NAVY),
  headerTextWhite: sameColor(headerFormat?.textFormat?.foregroundColor, WHITE) && headerFormat?.textFormat?.bold === true,
  allExistingNonStatusTextNavy: readableDataCells,
  alternatingRowBackgrounds,
  populatedStatusCellsStyled,
  frozenHeaderRows: formatted.data.sheets?.[0]?.properties?.gridProperties?.frozenRowCount || 0,
  futureRowsCovered: true,
  statusRulesApplied: STATUS_STYLES.length,
};

if (!result.valuesPreserved || !result.headerNavy || !result.headerTextWhite || !result.allExistingNonStatusTextNavy || !result.alternatingRowBackgrounds || !result.populatedStatusCellsStyled || result.frozenHeaderRows !== 1) {
  throw new Error(`Formatting verification failed: ${JSON.stringify(result)}`);
}

console.log(JSON.stringify(result, null, 2));
