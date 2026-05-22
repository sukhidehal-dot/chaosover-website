// Chaos Over — brand mark + wordmark + lockup components
// All marks render at their natural size; the artboard sets the frame.

// ────────────────────────────────────────────────────────────────────────────
// Shared atoms

// Palette v0.2 — charcoal replaces near-black; luminous yellow replaces orange
const INK = '#23232A';      // dark warm charcoal
const BONE = '#F2EDE3';     // warm off-white
const SIGNAL = '#C8FF3D';   // Acid Lime (was luminous yellow #E8FF1A — keep variable name)
const COBALT = '#1E48F0';
const SAGE = '#B8C66A';
const MIST = '#D9D2C2';

const MetaTag = ({ children, color = INK, bg = 'transparent' }) => (
  <span style={{
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontSize: 10,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color, background: bg,
    padding: bg === 'transparent' ? 0 : '3px 7px',
    border: bg === 'transparent' ? 'none' : 'none',
    borderRadius: bg === 'transparent' ? 0 : 999,
    whiteSpace: 'nowrap',
  }}>{children}</span>
);

// ────────────────────────────────────────────────────────────────────────────
// SYMBOL MARKS — the iconographic side of the system

// 01 · The Bracket — containment. Chaos contained, then resolved.
const MarkBracket = ({ size = 220, fg = INK, bg = BONE }) => {
  const s = size;
  const stroke = s * 0.06;
  return (
    <svg viewBox="0 0 100 100" width={s} height={s} style={{ background: bg, display: 'block' }}>
      {/* outer bracket */}
      <path d={`M 22 18 L 12 18 L 12 82 L 22 82`} fill="none" stroke={fg} strokeWidth={stroke} />
      <path d={`M 78 18 L 88 18 L 88 82 L 78 82`} fill="none" stroke={fg} strokeWidth={stroke} />
      {/* interior — C + O as solid blocks */}
      <text x="50" y="65" textAnchor="middle"
        style={{ font: '900 44px "Archivo Black", "Arial Black", sans-serif', fill: fg, letterSpacing: '-0.04em' }}>
        CO
      </text>
    </svg>
  );
};

// 02 · The Pivot — X→+ : chaos rotated 45° becomes order.
const MarkPivot = ({ size = 220, fg = INK, bg = BONE, angle = 22 }) => {
  const s = size;
  return (
    <svg viewBox="0 0 100 100" width={s} height={s} style={{ background: bg, display: 'block' }}>
      <g transform={`rotate(${angle} 50 50)`}>
        <rect x="44" y="14" width="12" height="72" fill={fg} />
        <rect x="14" y="44" width="72" height="12" fill={fg} />
      </g>
      <circle cx="50" cy="50" r="3" fill={bg} />
    </svg>
  );
};

// 03 · The Stack — scattered tick marks resolve to a baseline.
const MarkStack = ({ size = 220, fg = INK, bg = BONE }) => (
  <svg viewBox="0 0 120 100" width={size} height={size * (100/120)} style={{ background: bg, display: 'block' }}>
    {/* scattered top */}
    <line x1="14" y1="18" x2="14" y2="32" stroke={fg} strokeWidth="6" />
    <line x1="32" y1="14" x2="32" y2="38" stroke={fg} strokeWidth="6" />
    <line x1="50" y1="22" x2="50" y2="30" stroke={fg} strokeWidth="6" />
    <line x1="68" y1="12" x2="68" y2="36" stroke={fg} strokeWidth="6" />
    <line x1="86" y1="20" x2="86" y2="28" stroke={fg} strokeWidth="6" />
    <line x1="104" y1="16" x2="104" y2="34" stroke={fg} strokeWidth="6" />
    {/* resolved baseline */}
    <line x1="10" y1="62" x2="110" y2="62" stroke={fg} strokeWidth="6" />
    {/* ordered ticks below */}
    <line x1="22" y1="62" x2="22" y2="86" stroke={fg} strokeWidth="6" />
    <line x1="40" y1="62" x2="40" y2="86" stroke={fg} strokeWidth="6" />
    <line x1="58" y1="62" x2="58" y2="86" stroke={fg} strokeWidth="6" />
    <line x1="76" y1="62" x2="76" y2="86" stroke={fg} strokeWidth="6" />
    <line x1="94" y1="62" x2="94" y2="86" stroke={fg} strokeWidth="6" />
  </svg>
);

// 04 · The Aperture — a precision target. Look through the chaos.
const MarkAperture = ({ size = 220, fg = INK, bg = BONE }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ background: bg, display: 'block' }}>
    <circle cx="50" cy="50" r="38" fill="none" stroke={fg} strokeWidth="5" />
    <circle cx="50" cy="50" r="22" fill="none" stroke={fg} strokeWidth="5" />
    <circle cx="50" cy="50" r="6" fill={fg} />
    <line x1="50" y1="4" x2="50" y2="20" stroke={fg} strokeWidth="5" />
    <line x1="50" y1="80" x2="50" y2="96" stroke={fg} strokeWidth="5" />
    <line x1="4" y1="50" x2="20" y2="50" stroke={fg} strokeWidth="5" />
    <line x1="80" y1="50" x2="96" y2="50" stroke={fg} strokeWidth="5" />
  </svg>
);

// 05 · Monogram CO — a single closed letterform built on a strict grid.
const MarkMonogram = ({ size = 220, fg = INK, bg = BONE }) => {
  const s = size;
  return (
    <svg viewBox="0 0 120 100" width={s * (120/100)} height={s} style={{ background: bg, display: 'block' }}>
      {/* C — open arc constructed from rect cutouts */}
      <path d="M 50 12 L 12 12 L 12 88 L 50 88 L 50 70 L 30 70 L 30 30 L 50 30 Z" fill={fg} />
      {/* O — concentric squares */}
      <path d="M 58 12 L 108 12 L 108 88 L 58 88 Z M 76 30 L 90 30 L 90 70 L 76 70 Z" fill={fg} fillRule="evenodd" />
    </svg>
  );
};

// 06 · The Lever — a fulcrum/pivot. The job of strategy is leverage.
const MarkLever = ({ size = 220, fg = INK, bg = BONE }) => (
  <svg viewBox="0 0 120 100" width={size * (120/100)} height={size} style={{ background: bg, display: 'block' }}>
    {/* bar */}
    <rect x="10" y="46" width="100" height="10" fill={fg} transform="rotate(-12 60 51)" />
    {/* fulcrum triangle */}
    <polygon points="48,60 72,60 60,82" fill={fg} />
    {/* dot loads */}
    <circle cx="20" cy="28" r="6" fill={fg} />
    <rect x="92" y="20" width="14" height="14" fill={fg} />
  </svg>
);

// ────────────────────────────────────────────────────────────────────────────
// WORDMARKS

// W1 · Tall condensed multi-line — Pensacola/Le Turtle vibe
const WordmarkLines = ({ width = 720, fg = INK, bg = INK, ink = BONE }) => (
  <div style={{
    width, padding: '60px 48px', background: bg, color: ink,
    fontFamily: '"Big Shoulders Display", "Oswald", sans-serif',
    fontWeight: 800, letterSpacing: '-0.005em',
    boxSizing: 'border-box',
  }}>
    <div style={{
      fontSize: width * 0.21, lineHeight: 0.84,
      WebkitTextStroke: `2px ${ink}`,
      color: 'transparent',
      backgroundImage: `repeating-linear-gradient(0deg, ${ink} 0, ${ink} 3px, transparent 3px, transparent 8px)`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
    }}>CHAOS</div>
    <div style={{ fontSize: width * 0.21, lineHeight: 0.84, color: ink }}>OVER.</div>
  </div>
);

// W2 · Stacked blocky — Catapulta / Maze influence
const WordmarkStacked = ({ width = 380, fg = INK, bg = BONE }) => (
  <div style={{
    width, padding: '32px 36px', background: bg, color: fg,
    fontFamily: '"Archivo Black", "Arial Black", sans-serif',
    letterSpacing: '-0.04em', lineHeight: 0.82,
    boxSizing: 'border-box',
  }}>
    <div style={{ fontSize: width * 0.38 }}>CHA</div>
    <div style={{ fontSize: width * 0.38 }}>OS/</div>
    <div style={{ fontSize: width * 0.38, background: SIGNAL, color: INK, display: 'inline-block', padding: '0 0.06em' }}>OVR</div>
  </div>
);

// W3 · Multi-stroke outline — Le Turtle / Onk inspired parallel lines
const WordmarkOutline = ({ width = 720, fg = INK, bg = BONE }) => (
  <div style={{
    width, padding: '60px 48px', background: bg,
    fontFamily: '"Unbounded", "Big Shoulders Display", sans-serif',
    fontWeight: 800, boxSizing: 'border-box',
  }}>
    <div style={{
      fontSize: width * 0.13, letterSpacing: '0.02em', lineHeight: 1,
      color: 'transparent',
      WebkitTextStroke: `1px ${fg}`,
      textShadow: `3px 0 0 ${fg}80, -3px 0 0 ${fg}80, 6px 0 0 ${fg}40, -6px 0 0 ${fg}40`,
    }}>CHAOS OVER</div>
    <div style={{
      marginTop: 18, height: 1, background: fg,
    }} />
    <div style={{
      marginTop: 14, fontFamily: '"JetBrains Mono", monospace',
      fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: fg,
    }}>Commercial · Strategy · Systems</div>
  </div>
);

// W4 · Bracketed — square-bracket containment around CHAOS
const WordmarkBracket = ({ width = 720, fg = INK, bg = BONE, accent = INK }) => (
  <div style={{
    width, padding: '52px 44px', background: bg, color: fg,
    fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.03em', lineHeight: 0.92,
    boxSizing: 'border-box',
  }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, fontSize: width * 0.14 }}>
      <span style={{ color: accent, fontWeight: 400, fontFamily: 'inherit' }}>[</span>
      <span>CHAOS</span>
      <span style={{ color: accent, fontWeight: 400 }}>]</span>
    </div>
    <div style={{ fontSize: width * 0.14, marginTop: 4 }}>OVER<span style={{ color: accent }}>.</span></div>
  </div>
);

// W5 · Wide mono caps — engineering / blueprint feel
const WordmarkMono = ({ width = 720, fg = INK, bg = BONE }) => (
  <div style={{
    width, padding: '64px 48px', background: bg, color: fg,
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    boxSizing: 'border-box',
  }}>
    <div style={{ fontSize: width * 0.08, fontWeight: 700, letterSpacing: '0.04em', lineHeight: 1.05 }}>
      CHAOS_OVER<span style={{ background: SIGNAL, color: INK, padding: '0 4px' }}>;</span>
    </div>
    <div style={{ marginTop: 22, display: 'flex', gap: 28, fontSize: 11, opacity: 0.7, letterSpacing: '0.18em' }}>
      <span>FN(CHAOS) → ORDER</span>
      <span>EST. 2024</span>
      <span>UK</span>
    </div>
  </div>
);

// W6 · The Override — "CHAOS" with a confident diagonal strike, "OVER" stamped,
// a bone full-stop seals it. Angle is configurable so you can dial drama.
const WordmarkOverride = ({
  width = 720,
  fg = BONE,
  bg = INK,
  accent = SIGNAL,
  angle = 15,
  strikePct = 0.07,
}) => {
  const fontSize = width * 0.22;
  const strikeH = fontSize * strikePct;
  return (
    <div style={{
      width, padding: '64px 56px', background: bg, color: fg,
      fontFamily: '"Big Shoulders Display", sans-serif',
      fontWeight: 900, letterSpacing: '-0.01em',
      boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
    }}>
      {/* CHAOS + diagonal strike */}
      <div style={{ position: 'relative', display: 'inline-block', fontSize, lineHeight: 0.88 }}>
        CHAOS
        <div style={{
          position: 'absolute',
          left: `-14%`, right: `-14%`,
          top: '50%',
          height: strikeH,
          background: accent,
          transform: `translateY(-50%) rotate(${-angle}deg)`,
          transformOrigin: 'center center',
        }} />
      </div>
      {/* OVER. — accent word, bone full-stop */}
      <div style={{ fontSize, lineHeight: 0.88, marginTop: 4 }}>
        <span style={{ color: accent }}>OVER</span><span style={{ color: fg }}>.</span>
      </div>
    </div>
  );
};

// W7 · The Cross — two perpendicular strikes form a +, "cancelling" CHAOS into order
// Defaults to dark surface so luminous yellow can sing.
const WordmarkCross = ({ width = 720, fg = BONE, bg = INK, accent = SIGNAL, strokePct = 0.055 }) => {
  // Same-weight horizontal + vertical bars over the word, forming a +.
  // We render the wordmark, then overlay two bars positioned by absolute %.
  const strokeH = Math.round(width * strokePct);     // bar thickness
  return (
    <div style={{
      width, padding: '56px 48px', background: bg, color: fg,
      fontFamily: '"Big Shoulders Display", sans-serif',
      fontWeight: 900, letterSpacing: '-0.005em',
      boxSizing: 'border-box', position: 'relative',
    }}>
      <div style={{
        position: 'relative', display: 'inline-block',
        fontSize: width * 0.24, lineHeight: 0.88,
      }}>
        CHAOS
        {/* horizontal strike — through the middle of the word */}
        <div style={{
          position: 'absolute', left: '-4%', right: '-4%',
          top: '50%', height: strokeH,
          background: accent, transform: 'translateY(-50%)',
        }} />
        {/* vertical strike — same weight, dropped through the O */}
        <div style={{
          position: 'absolute', top: '-14%', bottom: '-14%',
          left: '52%', width: strokeH,
          background: accent, transform: 'translateX(-50%)',
        }} />
      </div>
      <div style={{ fontSize: width * 0.24, lineHeight: 0.88, marginTop: 4 }}>
        OVER<span style={{ color: accent }}>.</span>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// LOCKUPS — symbol + wordmark + tagline

const Lockup = ({ width = 520, bg = BONE, fg = INK, accent, mark = 'pivot' }) => {
  // Yellow disappears on bone — only use SIGNAL as accent on dark surfaces.
  const a = accent ?? (bg === BONE ? INK : SIGNAL);
  const Mark = { bracket: MarkBracket, pivot: MarkPivot, stack: MarkStack, aperture: MarkAperture, monogram: MarkMonogram, lever: MarkLever }[mark];
  return (
    <div style={{
      width, padding: '40px 36px', background: bg, color: fg,
      fontFamily: '"Space Grotesk", sans-serif',
      boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Mark size={68} fg={fg} bg={bg} />
        <div style={{
          fontFamily: '"Archivo Black", sans-serif',
          fontSize: 32, lineHeight: 0.9, letterSpacing: '-0.03em',
        }}>
          CHAOS<br />OVER<span style={{ color: a }}>.</span>
        </div>
      </div>
      <div style={{ height: 1, background: fg, opacity: 0.2 }} />
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.7,
      }}>
        Commercial Strategy — for founder-led B2B
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// POSTERS / APPLICATIONS

// P1 · Editorial poster — full-bleed display
const PosterEditorial = ({ width = 540, height = 760 }) => (
  <div style={{
    width, height, background: INK, color: BONE,
    fontFamily: '"Big Shoulders Display", sans-serif',
    padding: 32, boxSizing: 'border-box',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em', opacity: 0.6 }}>
      <span>CO/01</span>
      <span>FILE — COMMERCIAL ENGINE</span>
      <span>2026</span>
    </div>
    <div>
      <div style={{ fontSize: 26, fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.04em', color: SIGNAL, marginBottom: 6 }}>
        FN(CHAOS) →
      </div>
      <div style={{ fontWeight: 900, fontSize: 150, lineHeight: 0.82, letterSpacing: '-0.02em' }}>
        CHAOS
      </div>
      <div style={{ fontWeight: 900, fontSize: 150, lineHeight: 0.82, letterSpacing: '-0.02em', color: SIGNAL }}>
        OVER.
      </div>
      <div style={{ marginTop: 22, fontFamily: '"Space Grotesk", sans-serif', fontSize: 14, lineHeight: 1.35, maxWidth: '70%', opacity: 0.85 }}>
        We build commercial engines for founder-led B2B companies. Less hustle. More compound.
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <MarkPivot size={56} fg={BONE} bg={INK} />
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em', opacity: 0.6, textAlign: 'right' }}>
        chaosover.co<br />a commercial strategy<br />practice
      </div>
    </div>
  </div>
);

// P2 · Business card — front + back
const BusinessCard = ({ width = 520, height = 320 }) => (
  <div style={{ width, height, display: 'flex', gap: 16 }}>
    <div style={{
      flex: 1, background: BONE, color: INK, padding: 22, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      fontFamily: '"Space Grotesk", sans-serif',
    }}>
      <MarkPivot size={36} fg={INK} bg={BONE} angle={22} />
      <div>
        <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 28, letterSpacing: '-0.03em', lineHeight: 0.9 }}>
          CHAOS<br />OVER<span style={{ color: INK }}>.</span>
        </div>
        <div style={{ display: 'inline-block', background: SIGNAL, color: INK, fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 10, padding: '3px 6px' }}>
          Commercial Strategy
        </div>
      </div>
    </div>
    <div style={{
      flex: 1, background: INK, color: BONE, padding: 22, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      fontFamily: '"Space Grotesk", sans-serif',
    }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.2em', opacity: 0.55 }}>
        CARD / 002
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 18 }}>Sam Holder</div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>Founder · Strategist</div>
        <div style={{ marginTop: 14, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.1em', lineHeight: 1.7 }}>
          sam@chaosover.co<br />+44 20 0000 0000
        </div>
      </div>
    </div>
  </div>
);

// P3 · Big colour-block poster
const PosterColor = ({ width = 540, height = 760 }) => (
  <div style={{
    width, height, background: SIGNAL, color: INK,
    fontFamily: '"Archivo Black", sans-serif',
    padding: 36, boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `repeating-linear-gradient(45deg, transparent 0 22px, rgba(14,14,12,.05) 22px 23px)`,
    }} />
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.2em' }}>
      <span>NO. 02</span><span>POSTER</span>
    </div>
    <div style={{ position: 'relative', marginTop: 30 }}>
      <div style={{ fontSize: 100, lineHeight: 0.84, letterSpacing: '-0.04em' }}>BUILD<br/>A COM-<br/>MERCIAL<br/>ENGINE.</div>
    </div>
    <div style={{ position: 'absolute', left: 36, right: 36, bottom: 36, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: 13, lineHeight: 1.3, maxWidth: 220 }}>
        Not another agency.<br />Not another playbook.<br />A system you actually run.
      </div>
      <div style={{
        fontFamily: '"Archivo Black", sans-serif', fontSize: 24, lineHeight: 0.85, textAlign: 'right',
      }}>
        CHAOS<br />OVER.
      </div>
    </div>
  </div>
);

// P4 · Web hero mock
const WebHero = ({ width = 960, height = 600 }) => (
  <div style={{
    width, height, background: BONE, color: INK,
    fontFamily: '"Space Grotesk", sans-serif',
    display: 'flex', flexDirection: 'column',
    boxSizing: 'border-box', overflow: 'hidden',
  }}>
    {/* navbar */}
    <div style={{
      padding: '20px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: `1px solid ${INK}22`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <MarkPivot size={24} fg={INK} bg={BONE} angle={22} />
        <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 16, letterSpacing: '-0.02em' }}>
          CHAOS&nbsp;OVER<span style={{ color: INK }}>.</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 26, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        <span>Work</span><span>Method</span><span>Notes</span><span>Contact</span>
      </div>
    </div>
    {/* hero */}
    <div style={{ flex: 1, padding: '44px 36px', display: 'flex', gap: 36 }}>
      <div style={{ flex: 1.4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'inline-block', background: SIGNAL, color: INK, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 18, padding: '4px 8px' }}>
            Commercial strategy for founder-led B2B
          </div>
          <div style={{
            fontFamily: '"Big Shoulders Display", sans-serif', fontWeight: 800,
            fontSize: 96, lineHeight: 0.86, letterSpacing: '-0.015em',
          }}>
            Trade hustle<br/>for a system<br/>that <span style={{ background: SIGNAL, color: INK, padding: '0 0.05em', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>compounds.</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button style={{
            background: INK, color: BONE, border: 0, padding: '14px 22px', borderRadius: 0,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer',
          }}>Book a diagnostic →</button>
          <button style={{
            background: 'transparent', color: INK, border: `1.5px solid ${INK}`, padding: '14px 22px', borderRadius: 0,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer',
          }}>The method</button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{
          flex: 1, background: INK, color: BONE, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em', opacity: 0.6 }}>01 / DIAGNOSE</div>
          <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 32, lineHeight: 0.95, letterSpacing: '-0.03em' }}>
            Map the<br/>engine.
          </div>
        </div>
        <div style={{
          flex: 1, background: SIGNAL, color: INK, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em', opacity: 0.75 }}>02 / REBUILD</div>
          <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 32, lineHeight: 0.95, letterSpacing: '-0.03em' }}>
            Install the<br/>system.
          </div>
        </div>
      </div>
    </div>
  </div>
);

// P5 · Stamp / badge — circular
const StampBadge = ({ size = 360, fg = INK, bg = BONE }) => {
  const id = 'arc-stamp';
  return (
    <div style={{ width: size, height: size, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <path id={id} d="M 100 100 m -78 0 a 78 78 0 1 1 156 0 a 78 78 0 1 1 -156 0" />
        </defs>
        <circle cx="100" cy="100" r="92" fill="none" stroke={fg} strokeWidth="1.5" />
        <circle cx="100" cy="100" r="86" fill="none" stroke={fg} strokeWidth="0.8" />
        <text style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.32em', fill: fg }}>
          <textPath href={`#${id}`} startOffset="0">
            FN(CHAOS)→ORDER · COMMERCIAL STRATEGY · EST. 2024 · UK · FN(CHAOS)→ORDER · 
          </textPath>
        </text>
      </svg>
      <div style={{ textAlign: 'center' }}>
        <MarkPivot size={size * 0.18} fg={fg} bg={bg} />
        <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: size * 0.11, lineHeight: 0.88, letterSpacing: '-0.03em', marginTop: 10 }}>
          CHAOS<br/>OVER.
        </div>
      </div>
    </div>
  );
};

// P6 · Notebook / collateral spread
const CollateralSpread = ({ width = 880, height = 560 }) => (
  <div style={{ width, height, display: 'flex', background: '#1a1a17' }}>
    {/* Left page: dark + huge type */}
    <div style={{
      flex: 1, background: INK, color: BONE, padding: 32, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      fontFamily: '"Space Grotesk", sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', opacity: 0.5 }}>
        <span>METHOD.001</span><span>CH.01</span>
      </div>
      <div>
        <div style={{ fontFamily: '"Big Shoulders Display", sans-serif', fontWeight: 800, fontSize: 110, lineHeight: 0.82, letterSpacing: '-0.02em' }}>
          MAP<br/>THE<br/>NOISE.
        </div>
        <div style={{ marginTop: 18, maxWidth: 280, lineHeight: 1.4, fontSize: 13, opacity: 0.8 }}>
          Most founder-led companies don't have a pipeline problem.
          They have a clarity problem. We start by drawing the picture.
        </div>
      </div>
    </div>
    {/* Right page: bone + index */}
    <div style={{
      flex: 1, background: BONE, color: INK, padding: 32, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      fontFamily: '"JetBrains Mono", monospace',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '0.22em', opacity: 0.6 }}>
        <span>INDEX</span><span>P.02</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, fontSize: 13, letterSpacing: '0.05em' }}>
        {[
          ['01', 'Map the noise', '04'],
          ['02', 'Find the lever', '12'],
          ['03', 'Stand up the engine', '24'],
          ['04', 'Make it run without you', '36'],
          ['05', 'Compound', '48'],
        ].map(([n, t, p], i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '40px 1fr 40px',
            padding: '14px 0', borderTop: `1px solid ${INK}22`, alignItems: 'baseline',
          }}>
            <span style={{ opacity: 0.5 }}>{n}</span>
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em' }}>{t}</span>
            <span style={{ opacity: 0.5, textAlign: 'right' }}>{p}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 22, lineHeight: 0.9, letterSpacing: '-0.03em' }}>
          CHAOS<br/>OVER<span style={{ color: INK }}>.</span>
        </div>
        <MarkPivot size={36} fg={INK} bg={BONE} angle={22} />
      </div>
    </div>
  </div>
);

// Export to window for the main script
// ────────────────────────────────────────────────────────────────────────────
// COLOUR STUDIES — same lockup, swap the accent, see how it lands.

// One color study card: shows the brand both ways (accent as ground, accent as type)
const ColorStudy = ({ name, hex, sub, width = 460, height = 580 }) => (
  <div style={{
    width, height, display: 'flex', flexDirection: 'column',
    background: INK, color: BONE,
    fontFamily: '"Space Grotesk", sans-serif',
    boxSizing: 'border-box', overflow: 'hidden',
  }}>
    {/* TOP: accent as ground, charcoal type */}
    <div style={{
      flex: 1, background: hex, color: INK,
      padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em', opacity: 0.6, textTransform: 'uppercase' }}>
        <span>Accent / Ground</span>
        <span>{hex.toUpperCase()}</span>
      </div>
      <div style={{
        fontFamily: '"Big Shoulders Display", sans-serif', fontWeight: 900,
        fontSize: 64, lineHeight: 0.85, letterSpacing: '-0.02em',
      }}>
        CHAOS<br/>OVER.
      </div>
    </div>
    {/* BOTTOM: charcoal ground, accent as highlight + type swatch */}
    <div style={{
      flex: 1, background: INK, color: BONE,
      padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
        <div style={{ display: 'inline-block', background: hex, color: INK, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '4px 8px' }}>
          {name}
        </div>
        <div style={{ width: 26, height: 26, background: hex, borderRadius: '50%' }} />
      </div>
      <div style={{
        fontFamily: '"Big Shoulders Display", sans-serif', fontWeight: 800,
        fontSize: 52, lineHeight: 0.86, letterSpacing: '-0.015em', position: 'relative',
      }}>
        <span style={{ display: 'inline-block', position: 'relative' }}>
          CHAOS
          {/* yellow-style cross strike */}
          <span style={{ position: 'absolute', left: '-4%', right: '-4%', top: '50%', height: 6, background: hex, transform: 'translateY(-50%)' }} />
          <span style={{ position: 'absolute', top: '-14%', bottom: '-14%', left: '52%', width: 6, background: hex, transform: 'translateX(-50%)' }} />
        </span>
        <br/>
        OVER<span style={{ color: hex }}>.</span>
      </div>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55 }}>
        {sub}
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// TYPE STUDIES — same lockup, swap the typeface, see how it lands.
const TypeStudy = ({
  fontFamily,
  fontName,
  classification,
  lines = ['CHAOS', 'OVER.'],
  weight = 900,
  size = 78,
  letterSpacing = '-0.02em',
  lineHeight = 0.86,
  case: textCase = 'uppercase',
  italic = false,
  width = 540, height = 360,
  inv = false,
  noStrike = false,
}) => {
  const bg = inv ? SIGNAL : INK;
  const fg = inv ? INK : BONE;
  const strikeColor = inv ? INK : SIGNAL;
  return (
    <div style={{
      width, height, background: bg, color: fg,
      padding: 28, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      fontFamily: '"Space Grotesk", sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* head */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            display: 'inline-block', background: strikeColor, color: INK,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '3px 7px',
          }}>
            {fontName}
          </div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
            marginTop: 8, opacity: 0.55,
          }}>{classification}</div>
        </div>
      </div>

      {/* sample — multiple lines, strike applied to first line */}
      <div style={{
        fontFamily,
        fontWeight: weight,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: size,
        lineHeight,
        letterSpacing,
        textTransform: textCase,
      }}>
        {lines.flatMap((line, i) => {
          const el = (
            <div key={`l${i}`} style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ display: 'block' }}>{line}</div>
              {!noStrike && i === 0 && (
                <div style={{
                  position: 'absolute',
                  left: '-6%', right: '-6%',
                  top: '50%',
                  height: Math.max(6, size * 0.08),
                  background: strikeColor,
                  transform: 'translateY(-50%) rotate(-15deg)',
                  transformOrigin: 'center center',
                }} />
              )}
            </div>
          );
          return i === 0 ? [el] : [<br key={`br${i}`} />, el];
        })}
      </div>

      {/* spec footer */}
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
        opacity: 0.55, display: 'flex', justifyContent: 'space-between',
      }}>
        <span>Commercial Strategy · Founder-led B2B</span>
        <span>↘ display</span>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// SOFT STUDIES — same wordmark on subtle hue-gradient grounds.
// Inspired by the `edge` reference: pale, layered radial blobs over a cream base.

const SoftStudy = ({
  name, no, gradient,
  fontFamily = '"Big Shoulders Display", sans-serif',
  weight = 900,
  size = 0.21,                  // as fraction of width
  letterSpacing = '-0.02em',
  ink = '#1c1822',              // softer than pure charcoal — slight plum
  accent,                       // optional: small accent dot color
  width = 640, height = 460,
}) => (
  <div style={{
    width, height, background: gradient, color: ink,
    fontFamily: '"Space Grotesk", sans-serif',
    padding: 32, boxSizing: 'border-box',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    position: 'relative', overflow: 'hidden',
  }}>
    {/* eyebrow */}
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em',
      textTransform: 'uppercase', opacity: 0.55,
    }}>
      <span>{name}</span>
      <span>Soft / {no}</span>
    </div>
    {/* wordmark */}
    <div style={{
      fontFamily, fontWeight: weight, fontSize: width * size,
      lineHeight: 0.84, letterSpacing,
    }}>
      CHAOS<br/>OVER<span style={{ color: accent || ink }}>.</span>
    </div>
    {/* footer */}
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em',
      textTransform: 'uppercase', opacity: 0.6,
    }}>
      <span>Commercial Strategy · Founder-led B2B</span>
      <span>©2026</span>
    </div>
  </div>
);

Object.assign(window, {
  SoftStudy, ColorStudy, TypeStudy,
  MarkBracket, MarkPivot, MarkStack, MarkAperture, MarkMonogram, MarkLever,
  WordmarkLines, WordmarkStacked, WordmarkOutline, WordmarkBracket, WordmarkMono, WordmarkOverride, WordmarkCross,
  Lockup,
  PosterEditorial, BusinessCard, PosterColor, WebHero, StampBadge, CollateralSpread,
  MetaTag,
  CO_INK: INK, CO_BONE: BONE, CO_SIGNAL: SIGNAL, CO_COBALT: COBALT, CO_SAGE: SAGE, CO_MIST: MIST,
});
