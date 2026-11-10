/**
 * The Damac Global: inquiry receiver for Google Sheets.
 *
 * SETUP (one time):
 *  1. Create a Google Sheet. Copy its ID from the URL (between /d/ and /edit).
 *  2. Extensions > Apps Script. Paste this file as Code.gs and save.
 *  3. Project Settings > Script Properties, add:
 *       SHARED_SECRET   = a long random string (32+ characters)
 *       SPREADSHEET_ID  = the Sheet ID from step 1 (optional if the script is bound to the sheet)
 *  4. Deploy > New deployment > type: Web app
 *       Execute as: Me
 *       Who has access: Anyone
 *     Copy the Web app URL (ends in /exec).
 *  5. In the website's .env set:
 *       SHEETS_WEBHOOK_URL=<Web app URL>
 *       SHEETS_SHARED_SECRET=<same value as SHARED_SECRET>
 *
 * The website server calls this endpoint server-to-server. The browser never
 * sees the shared secret.
 */

const SHEET_NAME = 'Inquiries';
const HEADERS = [
  'Received (UTC)',
  'Record ID',
  'Submission ID',
  'Type',
  'Name',
  'Email',
  'Phone',
  'Services',
  'Budget',
  'Package',
  'Message',
];

/** Receives JSON posted by the website API route. */
function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const body = JSON.parse(raw);
    const props = PropertiesService.getScriptProperties();
    const expected = props.getProperty('SHARED_SECRET');

    if (!expected) {
      return json_({ ok: false, error: 'SHARED_SECRET script property is not set.' });
    }
    if (!body.secret || !constantTimeEquals_(String(body.secret), expected)) {
      return json_({ ok: false, error: 'Unauthorized.' });
    }

    const row = body.row || {};
    const sheet = getSheet_();

    if (row.submissionId && submissionExists_(sheet, String(row.submissionId))) {
      return json_({ ok: true, duplicate: true });
    }

    sheet.appendRow([
      safe_(row.receivedAt),
      safe_(row.recordId),
      safe_(row.submissionId),
      safe_(row.kind),
      safe_(row.name),
      safe_(row.email),
      safe_(row.phone),
      safe_(row.services),
      safe_(row.budget),
      safe_(row.packageChoice),
      safe_(row.message),
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/** Simple health check: open the Web app URL in a browser to confirm deployment. */
function doGet() {
  return json_({ ok: true, service: 'The Damac Global inquiry receiver' });
}

/**
 * Prevents spreadsheet formula injection. Values beginning with = + - @ or a
 * tab/carriage return are stored as plain text by prefixing an apostrophe.
 */
function safe_(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SPREADSHEET_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

/** Returns true if the submission reference is already present in column C. */
function submissionExists_(sheet, submissionId) {
  const last = sheet.getLastRow();
  if (last < 2) return false;
  const ids = sheet.getRange(2, 3, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === submissionId) return true;
  }
  return false;
}

/** Compares secrets without leaking length or early-exit timing. */
function constantTimeEquals_(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
