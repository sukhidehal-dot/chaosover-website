// POST /api/send-chaos-scan-overview
//
// Receives { email } from the "Download Diagnostics Overview" form on the
// Chaos Scan section, and emails that person an overview of the Chaos Scan
// via Resend (https://resend.com).
//
// SETUP:
//   1. Set env vars in Netlify site settings → Environment variables:
//        RESEND_API_KEY  = re_xxxxxxxxxxxxxxxxxxxx   (from resend.com/api-keys)
//        SCAN_FROM_EMAIL = "Chaos Over <hello@chaosover.co.uk>"  (verified domain)
//        SCAN_BCC_EMAIL  = hello@chaosover.co.uk     (optional — notified of each lead)
//   2. Verify your sending domain in Resend (DNS records).
//   3. Deploy. The form posts here automatically via the /api/ redirect.

const { Resend } = require('resend');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (e) { body = {}; }
  const email = (body.email ? String(body.email) : '').trim();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'A valid email address is required.' })
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: process.env.SCAN_FROM_EMAIL || 'Chaos Over <hello@chaosover.co.uk>',
      to: email,
      bcc: process.env.SCAN_BCC_EMAIL || undefined,
      subject: 'Your Chaos Scan overview',
      html: overviewEmailHtml(),
      text: overviewEmailText(),
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Resend send failed:', err);
    return { statusCode: 502, body: JSON.stringify({ error: 'Could not send the email. Please try again.' }) };
  }
};

function overviewEmailHtml() {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f9f3ea;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1c1822;">
  <div style="max-width:560px;margin:0 auto;padding:40px 28px;">

    <div style="font-family:'Arial Black',Helvetica,sans-serif;font-weight:900;font-size:22px;letter-spacing:-0.5px;">
      Chaos<span style="color:#9bcf2e;">/</span>Over<span style="color:#9bcf2e;">.</span>
    </div>

    <div style="height:32px;"></div>

    <p style="font-size:17px;line-height:1.7;color:#1c1822;margin:0 0 20px;">
      Hey — thanks for getting in touch.
    </p>

    <p style="font-size:17px;line-height:1.7;color:#1c1822;margin:0 0 20px;">
      Here's all the details for the Chaos Scan. Take a look and if you've got any questions,
      you can book 15 minutes in my calendar and we can go through it together.
    </p>

    <div style="margin:32px 0;">
      <a href="https://docs.google.com/document/d/1Fq3foOzkKTqP73NU1HFhD0hUGBClzM0chuK3vDAQ8D4/edit?tab=t.0"
         style="display:inline-block;background:#c8ff3d;color:#1c1822;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;padding:15px 26px;border-radius:999px;">
        View the Chaos Scan overview &rarr;
      </a>
    </div>

    <div style="margin:16px 0 32px;">
      <a href="https://www.cal.eu/sukhi-dehal-nsd3n9/15min?"
         style="display:inline-block;background:#1c1822;color:#f9f3ea;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;padding:15px 26px;border-radius:999px;">
        Book 15 minutes &rarr;
      </a>
    </div>

    <p style="font-size:13px;line-height:1.6;color:#7a7484;border-top:1px solid #e0d9c9;padding-top:18px;margin-top:32px;">
      Chaos Over &middot; Commercial strategy for agency founders &middot; London, UK<br>
      You're receiving this because you requested the Chaos Scan overview at chaosover.co.uk.
    </p>

  </div>
</body>
</html>`;
}

function overviewEmailText() {
  return [
    'Chaos Over. — Chaos Scan overview',
    '',
    'Hey — thanks for getting in touch.',
    '',
    "Here's all the details for the Chaos Scan. Take a look and if you've got any questions, you can book 15 minutes in my calendar and we can go through it together.",
    '',
    'View the Chaos Scan overview:',
    'https://docs.google.com/document/d/1Fq3foOzkKTqP73NU1HFhD0hUGBClzM0chuK3vDAQ8D4/edit?tab=t.0',
    '',
    'Book 15 minutes:',
    'https://www.cal.eu/sukhi-dehal-nsd3n9/15min?',
    '',
    'Chaos Over · Commercial strategy for agency founders · London, UK',
  ].join('\n');
}
