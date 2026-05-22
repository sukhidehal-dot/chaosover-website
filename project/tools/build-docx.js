// Build a real .docx (Office Open XML) file for Google Docs upload.
// Pure-JS zip + OOXML — no external libs.

// ---------- CRC32 ----------
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c >>> 0;
  }
  return t;
})();
function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = (c >>> 8) ^ crcTable[(c ^ bytes[i]) & 0xff];
  return (c ^ 0xffffffff) >>> 0;
}

// ---------- Zip builder (stored, no compression) ----------
function buildZip(files) {
  const enc = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const now = new Date();
  const dosTime = ((now.getHours() & 0x1f) << 11) | ((now.getMinutes() & 0x3f) << 5) | ((now.getSeconds() / 2) & 0x1f);
  const dosDate = (((now.getFullYear() - 1980) & 0x7f) << 9) | (((now.getMonth() + 1) & 0xf) << 5) | (now.getDate() & 0x1f);

  for (const f of files) {
    const nameBytes = enc.encode(f.name);
    const data = typeof f.data === "string" ? enc.encode(f.data) : f.data;
    const crc = crc32(data);

    const lh = new Uint8Array(30 + nameBytes.length);
    const dv = new DataView(lh.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 0, true);
    dv.setUint16(8, 0, true);
    dv.setUint16(10, dosTime, true);
    dv.setUint16(12, dosDate, true);
    dv.setUint32(14, crc, true);
    dv.setUint32(18, data.length, true);
    dv.setUint32(22, data.length, true);
    dv.setUint16(26, nameBytes.length, true);
    dv.setUint16(28, 0, true);
    lh.set(nameBytes, 30);
    localParts.push(lh, data);

    const ch = new Uint8Array(46 + nameBytes.length);
    const cd = new DataView(ch.buffer);
    cd.setUint32(0, 0x02014b50, true);
    cd.setUint16(4, 20, true);
    cd.setUint16(6, 20, true);
    cd.setUint16(8, 0, true);
    cd.setUint16(10, 0, true);
    cd.setUint16(12, dosTime, true);
    cd.setUint16(14, dosDate, true);
    cd.setUint32(16, crc, true);
    cd.setUint32(20, data.length, true);
    cd.setUint32(24, data.length, true);
    cd.setUint16(28, nameBytes.length, true);
    cd.setUint16(30, 0, true);
    cd.setUint16(32, 0, true);
    cd.setUint16(34, 0, true);
    cd.setUint16(36, 0, true);
    cd.setUint32(38, 0, true);
    cd.setUint32(42, offset, true);
    ch.set(nameBytes, 46);
    centralParts.push(ch);

    offset += lh.length + data.length;
  }

  const centralSize = centralParts.reduce((a, p) => a + p.length, 0);
  const centralOffset = offset;

  const eocd = new Uint8Array(22);
  const ed = new DataView(eocd.buffer);
  ed.setUint32(0, 0x06054b50, true);
  ed.setUint16(4, 0, true);
  ed.setUint16(6, 0, true);
  ed.setUint16(8, files.length, true);
  ed.setUint16(10, files.length, true);
  ed.setUint32(12, centralSize, true);
  ed.setUint32(16, centralOffset, true);
  ed.setUint16(20, 0, true);

  const all = [...localParts, ...centralParts, eocd];
  const total = all.reduce((a, p) => a + p.length, 0);
  const out = new Uint8Array(total);
  let pp = 0;
  for (const part of all) { out.set(part, pp); pp += part.length; }
  return out;
}

// ---------- OOXML helpers ----------
const W_NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function r(opts) {
  const t = opts.text == null ? "" : opts.text;
  const props = [];
  if (opts.bold) props.push("<w:b/><w:bCs/>");
  if (opts.italic) props.push("<w:i/>");
  if (opts.caps) props.push("<w:caps/>");
  if (opts.font) props.push(`<w:rFonts w:ascii="${opts.font}" w:hAnsi="${opts.font}" w:cs="${opts.font}"/>`);
  if (opts.size) props.push(`<w:sz w:val="${opts.size}"/><w:szCs w:val="${opts.size}"/>`);
  if (opts.color) props.push(`<w:color w:val="${opts.color}"/>`);
  if (opts.shd) props.push(`<w:shd w:val="clear" w:color="auto" w:fill="${opts.shd}"/>`);
  if (opts.spacing) props.push(`<w:spacing w:val="${opts.spacing}"/>`);
  if (opts.highlight) props.push(`<w:highlight w:val="${opts.highlight}"/>`);
  const rPr = props.length ? `<w:rPr>${props.join("")}</w:rPr>` : "";
  return `<w:r>${rPr}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
}

function pageBreak() {
  return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
}

function p(runs, pPrOpts) {
  const opts = pPrOpts || {};
  const props = [];
  if (opts.align) props.push(`<w:jc w:val="${opts.align}"/>`);
  if (opts.spaceBefore != null || opts.spaceAfter != null || opts.line) {
    let sp = "<w:spacing";
    if (opts.spaceBefore != null) sp += ` w:before="${opts.spaceBefore}"`;
    if (opts.spaceAfter != null) sp += ` w:after="${opts.spaceAfter}"`;
    if (opts.line != null) sp += ` w:line="${opts.line}" w:lineRule="auto"`;
    sp += "/>";
    props.push(sp);
  }
  if (opts.indent) props.push(`<w:ind w:left="${opts.indent}"/>`);
  if (opts.shd) props.push(`<w:shd w:val="clear" w:color="auto" w:fill="${opts.shd}"/>`);
  if (opts.keepNext) props.push("<w:keepNext/>");
  if (opts.borderBottom) props.push('<w:pBdr><w:bottom w:val="single" w:sz="8" w:color="1C1822"/></w:pBdr>');
  const pPr = props.length ? `<w:pPr>${props.join("")}</w:pPr>` : "";
  const runStr = Array.isArray(runs) ? runs.join("") : runs;
  return `<w:p>${pPr}${runStr}</w:p>`;
}

function tc(content, opts) {
  opts = opts || {};
  const w = opts.width ? `<w:tcW w:w="${opts.width}" w:type="dxa"/>` : "";
  const shd = opts.shd ? `<w:shd w:val="clear" w:color="auto" w:fill="${opts.shd}"/>` : "";
  const span = opts.gridSpan ? `<w:gridSpan w:val="${opts.gridSpan}"/>` : "";
  const vAlign = opts.vAlign ? `<w:vAlign w:val="${opts.vAlign}"/>` : "";
  const borders = opts.noBorders
    ? '<w:tcBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/></w:tcBorders>'
    : "";
  const content2 = Array.isArray(content) ? content.join("") : content;
  return `<w:tc><w:tcPr>${w}${span}${shd}${vAlign}${borders}</w:tcPr>${content2}</w:tc>`;
}

function tr(cells, opts) {
  opts = opts || {};
  const trPr = opts.height ? `<w:trPr><w:trHeight w:val="${opts.height}"/></w:trPr>` : "";
  return `<w:tr>${trPr}${cells.join("")}</w:tr>`;
}

function table(rows, opts) {
  opts = opts || {};
  const tblW = opts.width ? `<w:tblW w:w="${opts.width}" w:type="dxa"/>` : '<w:tblW w:w="5000" w:type="pct"/>';
  const bcol = opts.borderColor || "C9C5B8";
  const borders = opts.noBorders
    ? '<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>'
    : `<w:tblBorders><w:top w:val="single" w:sz="4" w:color="${bcol}"/><w:left w:val="single" w:sz="4" w:color="${bcol}"/><w:bottom w:val="single" w:sz="4" w:color="${bcol}"/><w:right w:val="single" w:sz="4" w:color="${bcol}"/><w:insideH w:val="single" w:sz="4" w:color="${bcol}"/><w:insideV w:val="single" w:sz="4" w:color="${bcol}"/></w:tblBorders>`;
  const layout = '<w:tblLayout w:type="fixed"/>';
  return `<w:tbl><w:tblPr>${tblW}${borders}${layout}</w:tblPr>${rows.join("")}</w:tbl>`;
}

// ---------- Brand colors / fonts ----------
const INK = "1C1822";
const INK_SOFT = "5C5664";
const LIME = "C8FF3D";
const LIME_SOFT = "EAF8C0";
const LIME_DOT = "8FBF1A"; // readable lime for the period "."

const FONT_DISPLAY = "Oswald";
const FONT_BODY = "Inter";
const FONT_MONO = "Roboto Mono";

// ---------- Content shorthands ----------
const mono = (text, opts) => r(Object.assign({ text, font: FONT_MONO, size: 16, color: INK_SOFT }, opts || {}));
const monoUpper = (text, opts) => mono(String(text).toUpperCase(), opts);
const display = (text, size, opts) => r(Object.assign({ text, font: FONT_DISPLAY, size: size || 72, bold: true, color: INK }, opts || {}));
const inlineLime = (text, size, opts) => r(Object.assign({ text, font: FONT_DISPLAY, size: size || 72, bold: true, color: INK, shd: LIME }, opts || {}));
const body14 = (text, opts) => r(Object.assign({ text, font: FONT_BODY, size: 22, color: INK }, opts || {}));
const lead = (text, opts) => r(Object.assign({ text, font: FONT_BODY, size: 24, color: "3D3845" }, opts || {}));
const bodyBold = (text, opts) => r(Object.assign({ text, font: FONT_BODY, size: 22, color: INK, bold: true }, opts || {}));

const h1 = (parts, opts) => p(parts, Object.assign({ align: "left", spaceBefore: 120, spaceAfter: 200, keepNext: true }, opts || {}));
const h3 = (parts, opts) => p(parts, Object.assign({ align: "left", spaceBefore: 280, spaceAfter: 120, keepNext: true }, opts || {}));
const para = (parts, opts) => p(parts, Object.assign({ spaceAfter: 140, line: 320 }, opts || {}));

const metaStrip = (left, right) => p([
  mono(left),
  r({ text: "\t", font: FONT_MONO }),
  mono(right)
], { borderBottom: true, spaceAfter: 200, align: "left" });

// ---------- Build body ----------
const body = [];

// ====== PAGE 1 — COVER ======
body.push(p([
  mono("CO/24-08  •  PROPOSAL  •  CHAOS SCAN"),
  r({ text: "          ", font: FONT_MONO }),
  r({ text: "CHAOS OVER.", font: FONT_DISPLAY, bold: true, size: 22, color: INK })
], { borderBottom: true, spaceAfter: 600 }));

body.push(p([r({ text: "CHAOS SCAN", font: FONT_MONO, bold: true, size: 18, color: INK, shd: LIME })], { spaceAfter: 360 }));

body.push(p([display("Find what's", 144)], { spaceAfter: 0 }));
body.push(p([display("actually broken.", 144)], { spaceAfter: 400 }));

body.push(p([
  r({ text: "A half-day diagnostic for ", font: FONT_DISPLAY, bold: true, size: 44, color: INK }),
  r({ text: "Eightty3 Creative", font: FONT_DISPLAY, bold: true, size: 44, color: INK }),
  r({ text: ". Before you spend the next quarter fixing the wrong thing.", font: FONT_DISPLAY, bold: true, size: 44, color: INK })
], { spaceAfter: 600, line: 240 }));

body.push(table([
  tr([
    tc([
      p([monoUpper("Prepared for")], { spaceAfter: 80 }),
      p([r({ text: "Eightty3 Creative", font: FONT_DISPLAY, bold: true, size: 32, color: INK })], { spaceAfter: 40 }),
      p([body14("Attn: Founder / MD", { color: INK_SOFT })])
    ], { width: 4500, noBorders: true }),
    tc([
      p([monoUpper("Prepared by")], { spaceAfter: 80 }),
      p([
        r({ text: "Sukhi Dehal · Chaos Over", font: FONT_DISPLAY, bold: true, size: 32, color: INK }),
        r({ text: ".", font: FONT_DISPLAY, bold: true, size: 32, color: LIME_DOT })
      ], { spaceAfter: 40 }),
      p([body14("21 August 2026  ·  v1.0", { color: INK_SOFT })])
    ], { width: 4500, noBorders: true })
  ])
], { width: 9000, noBorders: true }));

body.push(pageBreak());

// ====== PAGE 2 — BRIEF + APPROACH ======
body.push(metaStrip("[ Section 01 / The brief ]", "CO/24-08"));

body.push(h1([
  display("Where we think you are", 80),
  r({ text: ".", font: FONT_DISPLAY, bold: true, size: 80, color: LIME_DOT })
]));

body.push(para([
  lead("From our first conversation: "),
  r({ text: "Eightty3 is good at the work and growing on reputation", font: FONT_BODY, size: 24, color: INK, shd: "FFF8C4" }),
  lead(". The team is 22 people. Revenue is up year-on-year. But the pipeline is uneven, three names sit at the centre of every new opportunity, and the proposition has quietly stretched to mean too many things to too many clients.")
]));

body.push(para([
  body14("That is not a brand problem or a talent problem. It is a commercial system problem. Most agencies hit it between 20 and 50 people. It does not fix itself, and it gets harder the longer it runs.")
]));

body.push(h3([display("What we are proposing", 36)]));
body.push(para([body14("One day. Five of us in a room. A structured, honest diagnostic that goes through your proposition, pipeline, positioning, proof and how demand actually happens for Eightty3 today — not the version of it on the website.")]));
body.push(para([body14("The output is not a deck. It is a clear picture of what is broken, what is working, and the two or three changes that will move things the most in the next quarter. You leave the day with a plan you can actually run.")]));

body.push(h3([display("Our approach", 36)]));

const approachCell = (lbl, title, desc) => tc([
  p([monoUpper(lbl, { color: INK_SOFT })], { spaceAfter: 100 }),
  p([r({ text: title, font: FONT_DISPLAY, bold: true, size: 28, color: INK })], { spaceAfter: 100, line: 240 }),
  p([body14(desc, { color: "3D3845" })])
], { width: 3000, shd: "F5EFE1", vAlign: "top" });

body.push(table([
  tr([
    approachCell("01 / Prepare", "Read the room before we walk in.", "A pre-read questionnaire, a 30-minute call with the commercial lead, and a quiet review of your last 12 proposals — won and lost."),
    approachCell("02 / Diagnose", "One day. The whole leadership team.", "Workshop in five passes — Proposition, Pipeline, Positioning, Proof, Process. Direct, practical, no theatre. Lunch included."),
    approachCell("03 / Report back", "A short doc. A 90-min playback.", "Within 10 working days: a written findings doc and a working session to agree the two or three moves worth making first.")
  ])
], { width: 9000, borderColor: "D5D1C4" }));

body.push(pageBreak());

// ====== PAGE 3 — SCOPE + TIMELINE ======
body.push(metaStrip("[ Section 02 / Scope & timeline ]", "CO/24-08"));

body.push(h1([
  display("What's in. ", 80),
  inlineLime("What's out", 80),
  r({ text: ".", font: FONT_DISPLAY, bold: true, size: 80, color: LIME_DOT })
]));

body.push(para([lead("Chaos Scan is a fixed diagnostic engagement. It is deliberately not a transformation programme. Anything beyond the diagnostic moves into a separate Engine Build engagement, if and when you decide it is the right next step.")]));

const scopeHead = (text) => p([r({ text, font: FONT_MONO, size: 16, color: INK_SOFT })], { spaceAfter: 0 });
const scopeBody = (text, prefix, prefixColor) => p([
  prefix ? r({ text: prefix, font: FONT_DISPLAY, bold: true, size: 22, color: prefixColor || LIME_DOT }) : "",
  body14((prefix ? " " : "") + text)
], { spaceAfter: 0, line: 280 });

body.push(table([
  tr([
    tc([scopeHead("WORKSTREAM")], { width: 2700, shd: "F5EFE1", vAlign: "center" }),
    tc([scopeHead("INCLUDED")], { width: 3200, shd: "F5EFE1", vAlign: "center" }),
    tc([scopeHead("OUT OF SCOPE")], { width: 3100, shd: "F5EFE1", vAlign: "center" })
  ], { height: 400 }),
  tr([
    tc([p([bodyBold("Proposition")])], { width: 2700, vAlign: "top" }),
    tc([scopeBody("Review of current proposition, audit of last 12 proposals, sharper articulation tested in the room.", "→", LIME_DOT)], { width: 3200, vAlign: "top" }),
    tc([scopeBody("A new brand identity, new naming, new visual identity, copywriting beyond the proposition statement.", "×", "C1453F")], { width: 3100, vAlign: "top" })
  ]),
  tr([
    tc([p([bodyBold("Pipeline")])], { width: 2700, vAlign: "top" }),
    tc([scopeBody("Review of inbound, outbound, referral and partner channels. Pipeline health snapshot. Conversion rates by stage.", "→", LIME_DOT)], { width: 3200, vAlign: "top" }),
    tc([scopeBody("CRM implementation, sales hiring, building or running outbound campaigns on your behalf.", "×", "C1453F")], { width: 3100, vAlign: "top" })
  ]),
  tr([
    tc([p([bodyBold("Positioning")])], { width: 2700, vAlign: "top" }),
    tc([scopeBody("Where you sit in the market today vs. where the work is most valuable. The one shift worth making.", "→", LIME_DOT)], { width: 3200, vAlign: "top" }),
    tc([scopeBody("Competitor teardowns, market sizing reports, or anything that requires a research firm.", "×", "C1453F")], { width: 3100, vAlign: "top" })
  ]),
  tr([
    tc([p([bodyBold("Proof")])], { width: 2700, vAlign: "top" }),
    tc([scopeBody("Audit of case studies, testimonials, and the proof points you reach for in pitches.", "→", LIME_DOT)], { width: 3200, vAlign: "top" }),
    tc([scopeBody("Producing new case studies, photography, design or video assets.", "×", "C1453F")], { width: 3100, vAlign: "top" })
  ]),
  tr([
    tc([p([bodyBold("Output")])], { width: 2700, vAlign: "top" }),
    tc([scopeBody("Findings document (10–14 pages), 90-minute playback session with leadership, recommendations memo.", "→", LIME_DOT)], { width: 3200, vAlign: "top" }),
    tc([scopeBody("A glossy strategy deck. Ongoing implementation support (see Engine Build).", "×", "C1453F")], { width: 3100, vAlign: "top" })
  ])
], { width: 9000, borderColor: "D5D1C4" }));

body.push(h3([display("Timeline", 36)]));

const tlHead = (text) => tc([p([r({ text, font: FONT_MONO, size: 14, color: INK_SOFT })])], { width: 1280, shd: "F5EFE1", vAlign: "center" });
const tlName = (text) => tc([p([body14(text, { bold: true })])], { width: 2000, vAlign: "center" });
const tlBar = (color, txtColor, text, width, span) => tc([
  p([r({ text, font: FONT_MONO, size: 12, color: txtColor })], { shd: color, spaceAfter: 0 })
], { width: width || 1280, shd: color, gridSpan: span || 1, vAlign: "center" });
const tlEmpty = (count) => tc([p([])], { width: 1280, gridSpan: count || 1 });

body.push(table([
  tr([
    tlName(" "),
    tlHead("WK 1"),
    tlHead("WK 2"),
    tlHead("WK 3"),
    tlHead("WK 4"),
    tlHead("WK 5")
  ], { height: 320 }),
  tr([
    tlName("Pre-read & prep call"),
    tlEmpty(1),
    tlBar(LIME_SOFT, INK, "PREP"),
    tlEmpty(3)
  ]),
  tr([
    tlName("Proposal review"),
    tlEmpty(1),
    tlBar(LIME_SOFT, INK, "READ", 2560, 2),
    tlEmpty(2)
  ]),
  tr([
    tlName("Workshop day"),
    tlEmpty(2),
    tlBar(LIME, INK, "★ DIAGNOSTIC"),
    tlEmpty(2)
  ]),
  tr([
    tlName("Write-up"),
    tlEmpty(3),
    tlBar(INK, "F4EEE2", "FINDINGS DOC", 2560, 2)
  ]),
  tr([
    tlName("Playback session"),
    tlEmpty(5),
    tlBar(LIME, INK, "★ 90 MIN")
  ])
], { width: 9400, borderColor: "D5D1C4" }));

body.push(para([
  r({ text: "★ Workshop and playback dates to be confirmed against the leadership team calendar. Five working weeks end-to-end is typical.", font: FONT_BODY, size: 20, color: INK_SOFT })
], { spaceBefore: 160 }));

body.push(pageBreak());

// ====== PAGE 4 — TEAM + PRICE ======
body.push(metaStrip("[ Section 03 / Team & investment ]", "CO/24-08"));

body.push(h1([
  display("Who's in ", 80),
  inlineLime("the room", 80),
  r({ text: ".", font: FONT_DISPLAY, bold: true, size: 80, color: LIME_DOT })
]));

body.push(para([lead("Chaos Scan is run by the senior team, not delegated. You get the founder in the workshop, in the write-up, and in the playback.")]));

const bioCell = (name, role, desc) => tc([
  p([r({ text: name, font: FONT_DISPLAY, bold: true, size: 28, color: INK })], { spaceAfter: 60 }),
  p([monoUpper(role, { color: INK })], { spaceAfter: 100 }),
  p([body14(desc, { color: "3D3845" })])
], { width: 4500, shd: "F5EFE1", vAlign: "top" });

body.push(table([
  tr([
    bioCell("Sukhi Dehal", "Founder · Lead", "20+ years building, scaling and exiting a digital product agency. Runs the workshop, writes the findings, presents the playback. The one accountable name on this engagement."),
    bioCell("Associate Operator", "Pipeline & positioning", "Joins for the workshop day to keep the room moving and capture in real time. Former agency commercial lead. Will not talk over the founder.")
  ]),
  tr([
    bioCell("Analyst", "Proposal review", "Off-stage. Reviews your last 12 proposals and surfaces win/loss patterns the day needs. Confidential, signed NDA, never the contact you deal with."),
    bioCell("Eightty3 leadership", "From your side", "We need four to six people in the room: founder/MD, commercial/new business lead, head of strategy or planning, head of delivery. No juniors. No observers.")
  ])
], { width: 9000, borderColor: "D5D1C4" }));

body.push(h3([display("Investment", 36)]));

body.push(table([
  tr([
    tc([
      p([monoUpper("Chaos Scan · Diagnostic workshop", { color: INK_SOFT })], { spaceAfter: 100 }),
      p([r({ text: "One-off engagement, all-in.", font: FONT_DISPLAY, bold: true, size: 36, color: INK })], { spaceAfter: 120, line: 240 }),
      p([body14("Includes pre-read, proposal review, full-day workshop, findings document and playback session. Travel within central London included. No hidden fees, no day-rate extensions.", { color: "3D3845" })], { spaceAfter: 160 }),
      p([
        r({ text: "[ One-off fee ]   ", font: FONT_MONO, size: 16, color: INK, shd: LIME_SOFT }),
        r({ text: "   [ 50% on signature · 50% on playback ]", font: FONT_MONO, size: 16, color: INK_SOFT })
      ])
    ], { width: 5800, shd: "F5EFE1", vAlign: "center" }),
    tc([
      p([r({ text: "£4,700", font: FONT_DISPLAY, bold: true, size: 96, color: INK })], { align: "right", spaceAfter: 80 }),
      p([r({ text: "+ VAT  ·  GBP", font: FONT_MONO, size: 16, color: INK_SOFT })], { align: "right" })
    ], { width: 3200, shd: "F5EFE1", vAlign: "center" })
  ])
], { width: 9000, borderColor: "A29D8E" }));

body.push(para([lead("If, after the Chaos Scan, you decide to move into Engine Build with us, the £4,700 is credited in full against the first month of that engagement. No pressure to take that step on the day.")], { spaceBefore: 280 }));

body.push(pageBreak());

// ====== PAGE 5 — TERMS ======
body.push(metaStrip("[ Section 04 / Terms ]", "CO/24-08"));

body.push(h1([
  display("The short, plain ", 80),
  inlineLime("version", 80),
  r({ text: ".", font: FONT_DISPLAY, bold: true, size: 80, color: LIME_DOT })
]));

body.push(para([lead("We try to keep this short. The full MSA sits behind it if you would like to see it — happy to send across before signature.")]));

const term = (num, title, text) => {
  return [
    p([
      r({ text: `0${num}   `, font: FONT_MONO, size: 16, color: INK_SOFT }),
      r({ text: String(title).toUpperCase(), font: FONT_DISPLAY, bold: true, size: 22, color: INK, spacing: "40" })
    ], { spaceBefore: 220, spaceAfter: 60, keepNext: true }),
    para([body14(text, { color: "3D3845" })], { spaceAfter: 60 })
  ].join("");
};

body.push(term(1, "Fee & payment", "£4,700 + VAT, fixed. Invoiced in two halves: 50% on signature of this proposal, 50% on completion of the playback session. Payable within 14 days of invoice date, BACS."));
body.push(term(2, "Reschedule", "If the workshop day needs to move with more than 7 working days notice, no charge. Within 7 days, 25% of the fee is non-refundable to cover prep already done."));
body.push(term(3, "Confidentiality", "Everything shared in the workshop, the proposals reviewed and the findings doc is treated as confidential. An NDA can be signed separately if your standard policy requires it."));
body.push(term(4, "IP & outputs", "The findings document and recommendations are yours, in full, on payment of the final invoice. Frameworks, methods and templates used in the workshop remain ours."));
body.push(term(5, "What we do not do", "We do not take a commission on any work that comes out of the Scan. We do not introduce or take referral fees from third-party suppliers. We do not sign exclusivity."));
body.push(term(6, "Cancellation", "Either party may end the engagement in writing at any time. If cancelled before the workshop, 25% of the fee is retained for prep. After the workshop, the full fee is due."));
body.push(term(7, "Governing law", "This proposal, once signed, is governed by the laws of England and Wales. Any dispute we will first try to resolve over a coffee. Failing that, English courts."));

body.push(pageBreak());

// ====== PAGE 6 — ACCEPTANCE ======
body.push(metaStrip("[ Section 05 / Acceptance ]", "CO/24-08"));

body.push(h1([
  display("Yes. ", 80),
  inlineLime("Let's start.", 80)
]));

body.push(para([lead("Sign below to confirm the scope, fee and terms in this proposal. We will issue the first invoice the same day and book the workshop date in your calendar within 48 hours.")]));

const sigField = (label, value, placeholder) => [
  p([monoUpper(label, { color: INK_SOFT })], { spaceBefore: 100, spaceAfter: 40 }),
  p([r({ text: value || " ", font: FONT_BODY, size: 22, color: placeholder ? "999999" : INK })], { borderBottom: true, spaceAfter: 60 })
].join("");

const sigBox = (preLabel, signed, fields) => tc([
  p([monoUpper(preLabel, { color: INK_SOFT })], { spaceAfter: 200 }),
  p([r({ text: signed || " ", font: "Caveat", size: 56, color: "1A73E8" })], { spaceAfter: 40, borderBottom: true }),
  p([monoUpper("Signature", { color: "999999" })], { spaceAfter: 200 }),
  ...fields
], { width: 4500, vAlign: "top" });

body.push(table([
  tr([
    sigBox("On behalf of Eightty3 Creative", null, [
      sigField("Name", null, true),
      sigField("Role", null, true),
      sigField("Date", null, true)
    ]),
    sigBox("On behalf of Chaos Over.", "Sukhi Dehal", [
      sigField("Name", "Sukhi Dehal"),
      sigField("Role", "Founder, Chaos Over"),
      sigField("Date", "21 / 08 / 2026")
    ])
  ])
], { width: 9000, borderColor: "D5D1C4" }));

body.push(table([
  tr([
    tc([
      p([monoUpper("After signature", { color: "A6A0AE" })], { spaceAfter: 80 }),
      p([r({ text: "We will be in your calendar within 48 hours.", font: FONT_DISPLAY, bold: true, size: 32, color: "F4EEE2" })], { spaceAfter: 100, line: 240 }),
      p([r({ text: "First invoice issued same day. Pre-read questionnaire sent the day after. Workshop within four weeks of signature.", font: FONT_BODY, size: 22, color: "D1CBC0" })])
    ], { width: 6000, shd: "1C1822", vAlign: "center" }),
    tc([
      p([
        r({ text: "Chaos", font: FONT_DISPLAY, bold: true, size: 32, color: "F4EEE2" }),
        r({ text: "/", font: FONT_DISPLAY, bold: true, size: 32, color: "C8FF3D" }),
        r({ text: "Over", font: FONT_DISPLAY, bold: true, size: 32, color: "F4EEE2" }),
        r({ text: ".", font: FONT_DISPLAY, bold: true, size: 32, color: "C8FF3D" })
      ], { align: "right", spaceAfter: 80 }),
      p([monoUpper("chaosover.co.uk", { color: "A6A0AE" })], { align: "right" })
    ], { width: 3000, shd: "1C1822", vAlign: "center" })
  ])
], { width: 9000, borderColor: "1C1822" }));

// ---------- Assemble XML parts ----------
const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document ${W_NS}>
  <w:body>
    ${body.join("\n")}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
      <w:cols w:space="708"/>
      <w:docGrid w:linePitch="360"/>
    </w:sectPr>
  </w:body>
</w:document>`;

const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;

const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

const documentRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>
</Relationships>`;

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles ${W_NS}>
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Inter" w:hAnsi="Inter" w:cs="Inter"/>
        <w:sz w:val="22"/>
        <w:szCs w:val="22"/>
        <w:lang w:val="en-GB"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="120" w:line="320" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
  </w:style>
</w:styles>`;

const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings ${W_NS}>
  <w:zoom w:percent="100"/>
  <w:defaultTabStop w:val="720"/>
  <w:characterSpacingControl w:val="doNotCompress"/>
  <w:compat>
    <w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/>
  </w:compat>
</w:settings>`;

const fontTableXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:fonts ${W_NS}>
  <w:font w:name="Inter"><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/></w:font>
  <w:font w:name="Oswald"><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/></w:font>
  <w:font w:name="Roboto Mono"><w:charset w:val="00"/><w:family w:val="modern"/><w:pitch w:val="fixed"/></w:font>
  <w:font w:name="Caveat"><w:charset w:val="00"/><w:family w:val="script"/><w:pitch w:val="variable"/></w:font>
</w:fonts>`;

const coreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Chaos Scan · Proposal · Eightty3 Creative</dc:title>
  <dc:creator>Sukhi Dehal · Chaos Over</dc:creator>
  <cp:lastModifiedBy>Chaos Over</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-08-21T09:00:00Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">2026-08-21T09:00:00Z</dcterms:modified>
</cp:coreProperties>`;

const appXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
  <Application>Chaos Over</Application>
</Properties>`;

const files = [
  { name: "[Content_Types].xml", data: contentTypesXml },
  { name: "_rels/.rels", data: relsXml },
  { name: "word/_rels/document.xml.rels", data: documentRelsXml },
  { name: "word/document.xml", data: documentXml },
  { name: "word/styles.xml", data: stylesXml },
  { name: "word/settings.xml", data: settingsXml },
  { name: "word/fontTable.xml", data: fontTableXml },
  { name: "docProps/core.xml", data: coreXml },
  { name: "docProps/app.xml", data: appXml }
];

const zipBytes = buildZip(files);
log("docx size:", zipBytes.length, "bytes");
log("paragraphs in body:", body.length);

const blob = new Blob([zipBytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
await saveFile("websites-v3/Chaos Scan Proposal.docx", blob);
log("saved.");
