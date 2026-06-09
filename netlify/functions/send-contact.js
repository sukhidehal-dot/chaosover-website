// POST /api/contact
//
// Receives contact form submissions from avinyr.html and emails them
// to hello@chaosover.co.uk via Resend.

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

  const name    = (body.name    || '').trim();
  const agency  = (body.agency  || '').trim();
  const email   = (body.email   || '').trim();
  const problem = (body.problem || '').trim();
  const notes   = (body.notes   || '').trim();

  if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Name and a valid email address are required.' })
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from   = process.env.SCAN_FROM_EMAIL || 'Chaos Over <hello@chaosover.co.uk>';
  const to     = process.env.CONTACT_TO_EMAIL || 'hello@chaosover.co.uk';

  try {
    await resend.emails.send({
      from,
      to,
      reply_to: email,
      subject: `New enquiry from ${name} — ${agency || 'no agency given'}`,
      html: notificationHtml({ name, agency, email, problem, notes }),
      text: notificationText({ name, agency, email, problem, notes }),
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Resend contact send failed:', err);
    return { statusCode: 502, body: JSON.stringify({ error: 'Could not send. Please try again.' }) };
  }
};

function notificationHtml({ name, agency, email, problem, notes }) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;background:#f9f3ea;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1c1822;">
  <div style="max-width:560px;margin:0 auto;padding:40px 28px;">

    <div style="font-family:'Arial Black',Helvetica,sans-serif;font-weight:900;font-size:22px;letter-spacing:-0.5px;">
      Chaos<span style="color:#9bcf2e;">/</span>Over<span style="color:#9bcf2e;">.</span>
    </div>

    <div style="display:inline-block;background:#c8ff3d;color:#1c1822;font-weight:700;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:6px 10px;margin:24px 0 20px;">
      New enquiry
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.6;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e0d9c9;color:#7a7484;width:130px;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Name</td>
        <td style="padding:10px 0;border-bottom:1px solid #e0d9c9;font-weight:600;">${esc(name)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e0d9c9;color:#7a7484;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Agency</td>
        <td style="padding:10px 0;border-bottom:1px solid #e0d9c9;">${esc(agency) || '—'}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e0d9c9;color:#7a7484;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #e0d9c9;"><a href="mailto:${esc(email)}" style="color:#1c1822;">${esc(email)}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e0d9c9;color:#7a7484;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Problem</td>
        <td style="padding:10px 0;border-bottom:1px solid #e0d9c9;">${esc(problem) || '—'}</td>
      </tr>
      ${notes ? `<tr>
        <td style="padding:10px 0;color:#7a7484;font-size:11px;letter-spacing:1px;text-transform:uppercase;vertical-align:top;">Notes</td>
        <td style="padding:10px 0;">${esc(notes)}</td>
      </tr>` : ''}
    </table>

    <div style="margin-top:28px;">
      <a href="mailto:${esc(email)}"
         style="display:inline-block;background:#1c1822;color:#f9f3ea;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;padding:14px 24px;border-radius:999px;">
        Reply to ${esc(name)} &rarr;
      </a>
    </div>

  </div>
</body>
</html>`;
}

function notificationText({ name, agency, email, problem, notes }) {
  return [
    'CHAOS OVER. — New enquiry',
    '',
    `Name:    ${name}`,
    `Agency:  ${agency || '—'}`,
    `Email:   ${email}`,
    `Problem: ${problem || '—'}`,
    notes ? `Notes:   ${notes}` : '',
    '',
    `Reply: mailto:${email}`,
  ].filter(l => l !== null).join('\n');
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
