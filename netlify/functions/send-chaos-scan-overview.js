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

    <div style="display:inline-block;background:#c8ff3d;color:#1c1822;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:7px 12px;margin:28px 0 18px;">
      Chaos Scan
    </div>

    <h1 style="font-size:30px;line-height:1.1;margin:0 0 18px;letter-spacing:-0.5px;">
      Find what's actually broken — before you spend time fixing the wrong thing.
    </h1>

    <p style="font-size:16px;line-height:1.6;color:#3a3640;margin:0 0 16px;">
      Thanks for asking for the overview. Here's what the Chaos Scan is and what it does for you.
    </p>

    <h2 style="font-size:18px;margin:28px 0 8px;">What it is</h2>
    <p style="font-size:16px;line-height:1.6;color:#3a3640;margin:0 0 16px;">
      A half-day to full-day working session — structured, practical and honest. We go through your
      proposition, your pipeline, your positioning, your proof, and how demand really happens in your
      business. You come out with a Chaos Score, a clear view of where the friction is, and a
      prioritised set of things to fix.
    </p>

    <h2 style="font-size:18px;margin:28px 0 8px;">What's included</h2>
    <ul style="font-size:16px;line-height:1.7;color:#3a3640;margin:0 0 16px;padding-left:20px;">
      <li>Commercial health diagnostic across 8 key areas</li>
      <li>Client &amp; lost-client interviews — why they chose you, or didn't</li>
      <li>Pipeline and founder-dependency mapping</li>
      <li>Signal Score rating, with score bands</li>
      <li>Priority action plan for the next 90 days</li>
      <li>Written summary and recommended next step</li>
    </ul>

    <h2 style="font-size:18px;margin:28px 0 8px;">What it does for you</h2>
    <p style="font-size:16px;line-height:1.6;color:#3a3640;margin:0 0 24px;">
      It's the one thing that makes everything after it faster and more accurate. Instead of guessing,
      you get a clear, honest picture of where growth is leaking — and exactly what to do about it next.
    </p>

    <div style="margin:28px 0;">
      <a href="https://chaosover.co.uk/#contact"
         style="display:inline-block;background:#1c1822;color:#f9f3ea;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;padding:15px 26px;border-radius:999px;">
        Book a 15-min call &rarr;
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
    'CHAOS OVER. — Chaos Scan overview',
    '',
    "Find what's actually broken — before you spend time fixing the wrong thing.",
    '',
    'WHAT IT IS',
    'A half-day to full-day working session — structured, practical and honest. We go through your proposition, pipeline, positioning, proof, and how demand really happens in your business. You come out with a Chaos Score, a clear view of where the friction is, and a prioritised set of things to fix.',
    '',
    "WHAT'S INCLUDED",
    '- Commercial health diagnostic across 8 key areas',
    "- Client & lost-client interviews — why they chose you, or didn't",
    '- Pipeline and founder-dependency mapping',
    '- Signal Score rating, with score bands',
    '- Priority action plan for the next 90 days',
    '- Written summary and recommended next step',
    '',
    'WHAT IT DOES FOR YOU',
    "It's the one thing that makes everything after it faster and more accurate. Instead of guessing, you get a clear, honest picture of where growth is leaking — and exactly what to do about it next.",
    '',
    'Book a 15-min call: https://chaosover.co.uk/#contact',
    '',
    'Chaos Over · Commercial strategy for agency founders · London, UK',
  ].join('\n');
}
