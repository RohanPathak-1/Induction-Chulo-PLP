# VoltMart Nepal — Induction Chulo Sales Funnel

A production-oriented Cash on Delivery funnel built with Next.js App Router, TypeScript, Tailwind CSS, Google Sheets, and SMTP email. It includes:

- `/` — bilingual product landing page with gallery, pricing, FAQ, trust content, and order form
- `/checkout` — focused checkout experience
- `/thank-you` — order confirmation page
- `POST /api/order` — validated server-side order workflow

> The API never reports a successful order unless Google Sheets has accepted the row. If storage is unconfigured or unavailable, the customer remains on the form and sees a retry/contact message.

## Recommended stack and order flow

1. The customer selects quantity and delivery zone in the browser.
2. The checkout sends form data and a unique idempotency key to `POST /api/order`.
3. The server validates every field, checks the delivery-zone/district combination, and recalculates all prices. Frontend totals are never trusted.
4. Google Sheets is checked for a duplicate submission key. A new order is appended with an order ID, Nepal-time timestamp, Cash on Delivery payment type, and `New Order` status.
5. Only after the row is stored, the server attempts the business notification and customer confirmation emails.
6. The browser receives success and redirects to `/thank-you`. If email delivery fails after storage, the stored order is preserved and the server logs the notification issue.

## Local setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site URL; use `http://localhost:3000` locally |
| `FRONTEND_URL` | Exact allowed browser origin; no trailing slash |
| `BRAND_NAME` | Website/email brand name |
| `BUSINESS_EMAIL` | Receives new-order notifications |
| `EMAIL_FROM` | Authenticated sender address used in the From header |
| `GOOGLE_SHEET_ID` | ID from the Google Sheet URL |
| `GOOGLE_SHEET_TAB_NAME` | Sheet tab, default `Induction_Orders` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google service-account email |
| `GOOGLE_PRIVATE_KEY` | Private key with escaped newlines (`\n`) |
| `SMTP_HOST` | SMTP host, e.g. `smtp.gmail.com` |
| `SMTP_PORT` | Usually `587` (STARTTLS) or `465` (secure) |
| `SMTP_USER` | SMTP account username |
| `SMTP_PASS` | SMTP password or Gmail App Password |
| `EMAIL_SERVICE_API_KEY` | Reserved for a future API-based email provider; not currently used |

Never commit `.env.local`.

## Google Sheets configuration

1. Create a Google Spreadsheet and rename its tab to `Induction_Orders` (or set another value in `GOOGLE_SHEET_TAB_NAME`).
2. Add these headers to row 1, in this exact order. The application can also add them automatically when the tab is empty:

   `Order ID`, `Date & Time`, `Customer Name`, `Phone Number`, `Email Address`, `Province`, `District`, `Municipality / City`, `Full Address`, `Delivery Zone`, `Product Name`, `Quantity`, `Price Per Piece`, `Delivery Fee`, `Total Price`, `Payment Method`, `Order Status`, `Customer Notes`, `Submission Key`

3. In Google Cloud Console, create/select a project, enable **Google Sheets API**, create a **Service Account**, and generate a JSON key.
4. Copy `client_email` to `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `private_key` to `GOOGLE_PRIVATE_KEY`. In Vercel, paste the full private key; escaped `\n` characters are supported.
5. Share the spreadsheet with the service-account email and grant **Editor** access.
6. Get the spreadsheet ID from `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit` and set `GOOGLE_SHEET_ID`.
7. In the sheet, select row 1 and choose **Data → Create a filter**.
8. Select the `Order Status` column, choose **Data → Data validation → Dropdown**, and add:
   - New Order
   - Order Confirmed
   - Order Ongoing
   - Delivered
   - Cancelled

The hidden `Submission Key` value supports retry-safe duplicate detection. Do not remove that column.

## Gmail / SMTP configuration

For Gmail SMTP:

1. Enable 2-Step Verification on the sending Google account.
2. Create a Google **App Password** for Mail.
3. Configure:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-authenticated-gmail@gmail.com
SMTP_PASS=your-16-character-app-password
EMAIL_FROM=your-authenticated-gmail@gmail.com
BUSINESS_EMAIL=rohanpathaknep2025@gmail.com
```

`EMAIL_FROM` must be an address authorized by the SMTP provider. The customer email uses `BUSINESS_EMAIL` as Reply-To; the business notification uses the customer's address as Reply-To.

## Testing the complete order process

1. Fill every environment variable and restart the dev server.
2. Open the Google Sheet and keep it visible.
3. Submit one test order using an email inbox you can check.
4. Confirm the form shows a loading state and cannot be clicked twice.
5. Confirm a new row appears with the correct Nepal-time timestamp, quantity, delivery fee, total, `Cash On Delivery`, and `New Order`.
6. Confirm the business inbox receives a subject beginning `[VoltMart Nepal] New Induction Chulo Order`.
7. Confirm the customer inbox receives `Your Order Has Been Received - VoltMart Nepal`.
8. Confirm the browser reaches `/thank-you` with the correct order ID, quantity, and total.
9. Test validation: an inside-Valley order with a non-Valley district should be rejected; a malformed email or phone should be rejected.
10. Temporarily use an invalid Sheet ID and verify the UI does **not** show success or redirect.

Run production checks:

```bash
npm run typecheck
npm run build
```

## Deploying to Vercel

1. Push this project to a Git repository.
2. Import the repository in Vercel and select the Next.js preset.
3. Add every production environment variable under **Project Settings → Environment Variables**.
4. Set `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` to the final HTTPS domain, without a trailing slash for `FRONTEND_URL`.
5. Deploy, then repeat the complete-order test above against the production URL.
6. Review Vercel Function logs if a stored order reports an email notification warning.

The route handler explicitly uses the Node.js runtime because Nodemailer and the Google SDK need it.

## Easily editable content

- Product pricing/name: `lib/product.ts`
- Landing-page copy: `app/page.tsx`
- FAQ content: `components/Faq.tsx`
- Order fields: `components/OrderForm.tsx`
- Server validation: `lib/order-schema.ts`
- Email layouts: `lib/email-templates.ts`
- Product images: `public/products/`

## Still pending from the owner

- Confirmation of the exact product model. The supplied photos visibly show multiple brands and both single/double configurations, so they should not be treated as one verified SKU without confirmation.
- Verified model specifications (power rating, modes, protections, dimensions, included items, warranty, and manufacturer guidance).
- Google Sheet ID, final tab name, service-account email, and private key.
- Authenticated SMTP sender and password/API credentials.
- Confirmation that Cash on Delivery is operational for this business before accepting live traffic.
- Official logo and verified customer reviews with permission.
- Confirmed delivery timeline and whether the support number has WhatsApp enabled.

Do not launch paid ads or accept live orders until the exact product imagery/model, Cash on Delivery availability, Google Sheets write, and both emails have been tested successfully.
