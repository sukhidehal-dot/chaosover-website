// Chaos Over — main app: lays all marks onto the design canvas

const { useState } = React;

const SectionHeader = ({ eyebrow, title, body }) => (
  <div style={{ maxWidth: 720, marginBottom: 4 }}>
    <div style={{
      fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
      letterSpacing: '0.24em', textTransform: 'uppercase',
      color: CO_INK, background: CO_SIGNAL, padding: '3px 7px', display: 'inline-block', marginBottom: 8,
    }}>{eyebrow}</div>
    <div style={{
      fontFamily: '"Archivo Black", sans-serif', fontSize: 30,
      letterSpacing: '-0.025em', lineHeight: 1, color: CO_INK,
    }}>{title}</div>
    {body && (
      <div style={{
        fontFamily: '"Space Grotesk", sans-serif', fontSize: 14,
        lineHeight: 1.45, color: '#3b362d', marginTop: 10, maxWidth: 640,
      }}>{body}</div>
    )}
  </div>
);

// Wrap any content in a centered frame (artboard interior)
const Frame = ({ children, bg = CO_BONE, pad = 24, align = 'center' }) => (
  <div style={{
    width: '100%', height: '100%', background: bg, padding: pad, boxSizing: 'border-box',
    display: 'flex', alignItems: align, justifyContent: 'center',
  }}>{children}</div>
);

// Caption strip used inside artboards
const ABNote = ({ children }) => (
  <div style={{
    position: 'absolute', left: 18, bottom: 14,
    fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
    letterSpacing: '0.16em', textTransform: 'uppercase',
    color: CO_INK, opacity: 0.55, pointerEvents: 'none',
  }}>{children}</div>
);

// ────────────────────────────────────────────────────────────────────────────
// Playground composition — its strike/colors come from the live tweaks panel.

const PLAYGROUND_GRADIENTS = {
  petal: `
    radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
    radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
    #f9f3ea
  `,
  sunrise: `
    radial-gradient(110% 90% at 88% 8%, #ffe1cf 0%, rgba(255,225,207,0) 62%),
    radial-gradient(110% 90% at 8% 95%, #e8dcf2 0%, rgba(232,220,242,0) 62%),
    #f7f1e5
  `,
  botanical: `
    radial-gradient(120% 90% at 10% 10%, #d9efe1 0%, rgba(217,239,225,0) 60%),
    radial-gradient(120% 90% at 92% 92%, #f8dde0 0%, rgba(248,221,224,0) 60%),
    #f9f4e7
  `,
  champagne: `
    radial-gradient(120% 90% at 0% 0%, #fbeede 0%, rgba(251,238,222,0) 62%),
    radial-gradient(120% 90% at 100% 100%, #f3e2c8 0%, rgba(243,226,200,0) 62%),
    #fbf6ea
  `,
  sunset: `
    radial-gradient(120% 90% at 0% 0%, #ffe0d4 0%, rgba(255,224,212,0) 60%),
    radial-gradient(120% 90% at 100% 50%, #f8d3df 0%, rgba(248,211,223,0) 60%),
    radial-gradient(120% 90% at 50% 100%, #efd9ef 0%, rgba(239,217,239,0) 60%),
    #faf2e8
  `,
  charcoal: `linear-gradient(180deg, #23232a 0%, #23232a 100%)`,
};

const StrikePlayground = ({ t, width = 960, height = 600 }) => {
  const INKC = '#1c1822';
  const LIME = '#C8FF3D';
  const onDark = t.gradient === 'charcoal';
  const ink = onDark ? '#F2EDE3' : INKC;
  const strikeColor = t.strikeColor === 'lime' ? LIME : ink;
  const overColor   = t.overColor   === 'lime' ? LIME : ink;
  const dotColor    = t.dotColor    === 'lime' ? LIME : ink;
  return (
    <div style={{
      width, height,
      background: PLAYGROUND_GRADIENTS[t.gradient] || PLAYGROUND_GRADIENTS.petal,
      color: ink, fontFamily: '"Space Grotesk", sans-serif',
      padding: 44, boxSizing: 'border-box', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: LIME, display: 'inline-block', boxShadow: `0 0 0 1.5px ${ink}` }} />
          ⚙ Strike Playground
        </div>
        <span>Open Tweaks → adjust live</span>
      </div>

      <div style={{
        fontFamily: '"Big Shoulders Display", sans-serif',
        fontWeight: 900, fontSize: 200, lineHeight: 0.84, letterSpacing: '-0.02em',
      }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          CHAOS
          <div style={{
            position: 'absolute',
            left: '-6%', right: '-6%',
            top: `${t.strikeTop}%`,
            height: t.strikeThickness,
            background: strikeColor,
            transform: `translateY(-50%) rotate(${t.strikeAngle}deg)`,
            transformOrigin: 'center center',
          }} />
        </div>
        <div style={{ color: overColor, display: 'flex', alignItems: 'baseline' }}>
          OVER<span style={{ color: dotColor }}>.</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.65 }}>
        <span>angle {t.strikeAngle}° · top {t.strikeTop}% · thick {t.strikeThickness}px</span>
        <span>strike:{t.strikeColor} · over:{t.overColor} · dot:{t.dotColor}</span>
      </div>
    </div>
  );
};

const App = () => {
  const [t, setTweak] = useTweaks(window.CO_TWEAKS || {
    strikeAngle: 15, strikeTop: 50, strikeThickness: 16,
    strikeColor: 'ink', overColor: 'ink', dotColor: 'lime', gradient: 'petal',
  });
  return (
    <>
      <TweaksPanel title="Tweaks · Strike">
        <TweakSection label="Diagonal Strike" />
        <TweakSlider label="Angle" value={t.strikeAngle} min={-45} max={45} unit="°"
                     onChange={v => setTweak('strikeAngle', v)} />
        <TweakSlider label="Vertical position" value={t.strikeTop} min={20} max={80} unit="%"
                     onChange={v => setTweak('strikeTop', v)} />
        <TweakSlider label="Thickness" value={t.strikeThickness} min={2} max={36} unit="px"
                     onChange={v => setTweak('strikeThickness', v)} />
        <TweakRadio  label="Strike colour" value={t.strikeColor} options={['ink', 'lime']}
                     onChange={v => setTweak('strikeColor', v)} />
        <TweakSection label="Wordmark" />
        <TweakRadio  label="OVER colour"   value={t.overColor}   options={['ink', 'lime']}
                     onChange={v => setTweak('overColor', v)} />
        <TweakRadio  label="Dot colour"    value={t.dotColor}    options={['ink', 'lime']}
                     onChange={v => setTweak('dotColor', v)} />
        <TweakSection label="Background" />
        <TweakSelect label="Gradient" value={t.gradient}
                     options={['petal', 'sunrise', 'botanical', 'champagne', 'sunset', 'charcoal']}
                     onChange={v => setTweak('gradient', v)} />
      </TweaksPanel>
      <DesignCanvas>
    {/* ────────────────── INTRO ───────────────── */}
    <DCSection id="intro" title="Chaos Over — Brand v0.1" subtitle="A fresh identity exploration. Founder-led B2B commercial strategy.">
      <DCArtboard id="intro-statement" label="Brief" width={760} height={520}>
        <div style={{
          width: '100%', height: '100%', background: CO_BONE, color: CO_INK,
          padding: 44, boxSizing: 'border-box',
          fontFamily: '"Space Grotesk", sans-serif',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', opacity: 0.55 }}>
            <span>BRIEF / 001</span><span>CHAOS OVER · BRAND</span><span>2026</span>
          </div>
          <div>
            <div style={{
              fontFamily: '"Big Shoulders Display", sans-serif', fontWeight: 800,
              fontSize: 96, lineHeight: 0.82, letterSpacing: '-0.02em',
            }}>
              From chaos,<br/>a <span style={{ background: CO_SIGNAL, color: CO_INK, padding: '0 0.06em', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>commercial</span><br/>engine.
            </div>
            <div style={{ marginTop: 22, maxWidth: 560, fontSize: 15, lineHeight: 1.5 }}>
              The system below explores a new identity for an intelligent commercial-strategy
              consultancy. Type leans blocky and geometric; marks pivot on the chaos→order
              transformation. Six symbol directions, six wordmarks, full lockups, and
              applied posters / web / collateral.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.65 }}>
            <span>↓ Marks</span><span>·</span><span>Wordmarks</span><span>·</span><span>Lockups</span><span>·</span><span>Applications</span>
          </div>
        </div>
      </DCArtboard>

      <DCArtboard id="intro-palette" label="Palette + Type" width={520} height={520}>
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* swatches */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', flex: '0 0 30%' }}>
            {[
              ['Ink', CO_INK, CO_BONE],
              ['Bone', CO_BONE, CO_INK],
              ['Signal', CO_SIGNAL, CO_INK],
              ['Cobalt', CO_COBALT, CO_BONE],
              ['Mist', CO_MIST, CO_INK],
            ].map(([name, bg, fg]) => (
              <div key={name} style={{ background: bg, color: fg, padding: 12, fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <span>{name}</span>
                <span style={{ opacity: 0.7 }}>{bg.toUpperCase()}</span>
              </div>
            ))}
          </div>
          {/* type */}
          <div style={{ background: CO_BONE, color: CO_INK, padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 44, lineHeight: 0.9, letterSpacing: '-0.03em' }}>Archivo Black</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, marginTop: 4 }}>Display / Wordmark</div>
            </div>
            <div>
              <div style={{ fontFamily: '"Big Shoulders Display", sans-serif', fontWeight: 800, fontSize: 56, lineHeight: 0.9, letterSpacing: '-0.01em' }}>Big Shoulders Display</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, marginTop: 4 }}>Editorial / Posters</div>
            </div>
            <div>
              <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 22, fontWeight: 500 }}>Space Grotesk — Aa Bb Cc 1234</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14 }}>JetBrains Mono — fn(chaos) → order;</div>
            </div>
          </div>
        </div>
      </DCArtboard>
    </DCSection>

    {/* ────────────────── SYMBOL MARKS ───────────────── */}
    <DCSection id="marks" title="01 · Symbol Marks" subtitle="Six iconographic directions. Each frames the chaos → order idea differently.">
      <DCArtboard id="m1" label="01 · Bracket" width={300} height={300}>
        <Frame><MarkBracket size={220} /></Frame>
      </DCArtboard>
      <DCArtboard id="m2" label="02 · Pivot" width={300} height={300}>
        <Frame><MarkPivot size={220} /></Frame>
      </DCArtboard>
      <DCArtboard id="m3" label="03 · Stack" width={300} height={300}>
        <Frame><MarkStack size={240} /></Frame>
      </DCArtboard>
      <DCArtboard id="m4" label="04 · Aperture" width={300} height={300}>
        <Frame><MarkAperture size={220} /></Frame>
      </DCArtboard>
      <DCArtboard id="m5" label="05 · Monogram CO" width={300} height={300}>
        <Frame><MarkMonogram size={200} /></Frame>
      </DCArtboard>
      <DCArtboard id="m6" label="06 · Lever" width={300} height={300}>
        <Frame><MarkLever size={200} /></Frame>
      </DCArtboard>

      {/* Inverse on ink */}
      <DCArtboard id="m1d" label="01 · Bracket (inv)" width={300} height={300}>
        <Frame bg={CO_INK}><MarkBracket size={220} fg={CO_BONE} bg={CO_INK} /></Frame>
      </DCArtboard>
      <DCArtboard id="m2d" label="02 · Pivot (signal)" width={300} height={300}>
        <Frame bg={CO_SIGNAL}><MarkPivot size={220} fg={CO_INK} bg={CO_SIGNAL} /></Frame>
      </DCArtboard>
      <DCArtboard id="m3d" label="03 · Stack (inv)" width={300} height={300}>
        <Frame bg={CO_INK}><MarkStack size={240} fg={CO_BONE} bg={CO_INK} /></Frame>
      </DCArtboard>
      <DCArtboard id="m4d" label="04 · Aperture (signal)" width={300} height={300}>
        <Frame bg={CO_SIGNAL}><MarkAperture size={220} fg={CO_INK} bg={CO_SIGNAL} /></Frame>
      </DCArtboard>
      <DCArtboard id="m5d" label="05 · Monogram (inv)" width={300} height={300}>
        <Frame bg={CO_INK}><MarkMonogram size={200} fg={CO_BONE} bg={CO_INK} /></Frame>
      </DCArtboard>
      <DCArtboard id="m6d" label="06 · Lever (cobalt)" width={300} height={300}>
        <Frame bg={CO_COBALT}><MarkLever size={200} fg={CO_BONE} bg={CO_COBALT} /></Frame>
      </DCArtboard>
    </DCSection>

    {/* ────────────────── WORDMARKS ───────────────── */}
    <DCSection id="wordmarks" title="02 · Wordmarks" subtitle="Typographic logos. Different fonts, different attitudes — pick a lane.">
      <DCArtboard id="w1" label="A · Lines (Pensacola / Le Turtle)" width={760} height={360}>
        <div style={{ width: '100%', height: '100%' }}><WordmarkLines width={760} /></div>
      </DCArtboard>

      <DCArtboard id="w2" label="B · Stacked Block" width={420} height={420}>
        <div style={{ width: '100%', height: '100%' }}><WordmarkStacked width={420} /></div>
      </DCArtboard>

      <DCArtboard id="w3" label="C · Multi-stroke Outline" width={760} height={300}>
        <div style={{ width: '100%', height: '100%' }}><WordmarkOutline width={760} /></div>
      </DCArtboard>

      <DCArtboard id="w4" label="D · Bracketed" width={620} height={320}>
        <div style={{ width: '100%', height: '100%' }}><WordmarkBracket width={620} /></div>
      </DCArtboard>

      <DCArtboard id="w5" label="E · Mono / Engineering" width={760} height={240}>
        <div style={{ width: '100%', height: '100%' }}><WordmarkMono width={760} /></div>
      </DCArtboard>

      <DCArtboard id="w6" label="F · Override · 15° diagonal" width={760} height={400}>
        <div style={{ width: '100%', height: '100%' }}><WordmarkOverride width={760} angle={15} /></div>
      </DCArtboard>

      <DCArtboard id="w6a" label="F · Override · 8° gentle" width={760} height={400}>
        <div style={{ width: '100%', height: '100%' }}><WordmarkOverride width={760} angle={8} /></div>
      </DCArtboard>

      <DCArtboard id="w6b" label="F · Override · 24° aggressive" width={760} height={400}>
        <div style={{ width: '100%', height: '100%' }}><WordmarkOverride width={760} angle={24} /></div>
      </DCArtboard>

      <DCArtboard id="w6c" label="F · Override · thicker strike" width={760} height={400}>
        <div style={{ width: '100%', height: '100%' }}><WordmarkOverride width={760} angle={15} strikePct={0.11} /></div>
      </DCArtboard>

      <DCArtboard id="w7" label="G · Cross (two strikes, +) ★ new" width={760} height={420}>
        <div style={{ width: '100%', height: '100%' }}><WordmarkCross width={760} /></div>
      </DCArtboard>

      <DCArtboard id="w7b" label="G · Cross — on bone" width={760} height={420}>
        <div style={{ width: '100%', height: '100%' }}><WordmarkCross width={760} bg={CO_BONE} fg={CO_INK} accent={CO_INK} /></div>
      </DCArtboard>

      <DCArtboard id="w7c" label="G · Cross — yellow ground" width={760} height={420}>
        <div style={{ width: '100%', height: '100%' }}><WordmarkCross width={760} bg={CO_SIGNAL} fg={CO_INK} accent={CO_INK} /></div>
      </DCArtboard>
    </DCSection>

    {/* ────────────────── TYPE STUDIES ───────────────── */}
    <DCSection id="type" title="03b · Type Studies" subtitle="Same statement, fourteen typefaces. Modern, blocky, slab, futuristic. Pick the lane and we'll commit.">
      <DCArtboard id="t01" label="Big Shoulders · current" width={540} height={360}>
        <TypeStudy fontFamily='"Big Shoulders Display", sans-serif' fontName="Big Shoulders Display" classification="Tall · Condensed · Geometric Sans" weight={900} size={88} />
      </DCArtboard>
      <DCArtboard id="t02" label="Archivo Black" width={540} height={360}>
        <TypeStudy fontFamily='"Archivo Black", sans-serif' fontName="Archivo Black" classification="Heavy · Geometric Sans" weight={400} size={80} letterSpacing="-0.03em" />
      </DCArtboard>
      <DCArtboard id="t03" label="Unbounded" width={540} height={360}>
        <TypeStudy fontFamily='"Unbounded", sans-serif' fontName="Unbounded" classification="Modern · Geometric · Blocky" weight={900} size={62} letterSpacing="-0.01em" />
      </DCArtboard>
      <DCArtboard id="t04" label="Bungee" width={540} height={360}>
        <TypeStudy fontFamily='"Bungee", sans-serif' fontName="Bungee" classification="Urban · Blocky · Signage" weight={400} size={64} letterSpacing="0" />
      </DCArtboard>
      <DCArtboard id="t05" label="Bungee Inline" width={540} height={360}>
        <TypeStudy fontFamily='"Bungee Inline", sans-serif' fontName="Bungee Inline" classification="Outline · Blocky · Signage" weight={400} size={64} letterSpacing="0" />
      </DCArtboard>
      <DCArtboard id="t06" label="Orbitron" width={540} height={360}>
        <TypeStudy fontFamily='"Orbitron", sans-serif' fontName="Orbitron" classification="Futuristic · Geometric · Sci-fi" weight={900} size={62} letterSpacing="-0.005em" />
      </DCArtboard>
      <DCArtboard id="t07" label="Rubik Mono One" width={540} height={360}>
        <TypeStudy fontFamily='"Rubik Mono One", monospace' fontName="Rubik Mono One" classification="Wide · Monospaced · Blocky" weight={400} size={48} letterSpacing="0" />
      </DCArtboard>
      <DCArtboard id="t08" label="Bagel Fat One" width={540} height={360}>
        <TypeStudy fontFamily='"Bagel Fat One", sans-serif' fontName="Bagel Fat One" classification="Super-bold · Round · Display" weight={400} size={78} letterSpacing="-0.02em" />
      </DCArtboard>
      <DCArtboard id="t09" label="Titan One" width={540} height={360}>
        <TypeStudy fontFamily='"Titan One", serif' fontName="Titan One" classification="Chunky · Slab Serif · Display" weight={400} size={72} letterSpacing="-0.02em" />
      </DCArtboard>
      <DCArtboard id="t10" label="Roboto Slab · 900" width={540} height={360}>
        <TypeStudy fontFamily='"Roboto Slab", serif' fontName="Roboto Slab 900" classification="Modern · Slab Serif" weight={900} size={78} letterSpacing="-0.025em" />
      </DCArtboard>
      <DCArtboard id="t11" label="Young Serif" width={540} height={360}>
        <TypeStudy fontFamily='"Young Serif", serif' fontName="Young Serif" classification="Modern · Blocky · Serif" weight={400} size={80} letterSpacing="-0.02em" />
      </DCArtboard>
      <DCArtboard id="t12" label="Major Mono Display" width={540} height={360}>
        <TypeStudy fontFamily='"Major Mono Display", monospace' fontName="Major Mono Display" classification="Futuristic · Mono · Caps" weight={400} size={62} letterSpacing="0.02em" />
      </DCArtboard>
      <DCArtboard id="t13" label="Anybody · 900" width={540} height={360}>
        <TypeStudy fontFamily='"Anybody", sans-serif' fontName="Anybody" classification="Variable · Blocky · Geometric" weight={900} size={72} letterSpacing="-0.01em" />
      </DCArtboard>
      <DCArtboard id="t14" label="Saira Stencil One" width={540} height={360}>
        <TypeStudy fontFamily='"Saira Stencil One", sans-serif' fontName="Saira Stencil One" classification="Stencil · Display · Industrial" weight={400} size={72} letterSpacing="-0.015em" />
      </DCArtboard>
    </DCSection>

    {/* ────────────────── SOFT HUE STUDIES ───────────────── */}
    <DCSection id="soft" title="03c · Soft Hue Studies" subtitle="Original font system on pale, layered gradient grounds. Softer brand temperature — calmer, more premium.">
      <DCArtboard id="s01" label="Peach · Cream · Lavender" width={640} height={460}>
        <SoftStudy name="Sunrise" no="01"
          gradient={`
            radial-gradient(110% 90% at 88% 8%, #ffe1cf 0%, rgba(255,225,207,0) 62%),
            radial-gradient(110% 90% at 8% 95%, #e8dcf2 0%, rgba(232,220,242,0) 62%),
            #f7f1e5
          `} />
      </DCArtboard>

      <DCArtboard id="s02" label="Mint · Cream · Blush" width={640} height={460}>
        <SoftStudy name="Botanical" no="02"
          gradient={`
            radial-gradient(120% 90% at 10% 10%, #d9efe1 0%, rgba(217,239,225,0) 60%),
            radial-gradient(120% 90% at 92% 92%, #f8dde0 0%, rgba(248,221,224,0) 60%),
            #f9f4e7
          `} />
      </DCArtboard>

      <DCArtboard id="s03" label="Lavender · Pink · Cream" width={640} height={460}>
        <SoftStudy name="Petal" no="03"
          gradient={`
            radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
            radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
            #f9f3ea
          `} />
      </DCArtboard>

      <DCArtboard id="s04" label="Sky · Cream · Peach" width={640} height={460}>
        <SoftStudy name="Horizon" no="04"
          gradient={`
            radial-gradient(120% 90% at 12% 12%, #d9e6f3 0%, rgba(217,230,243,0) 62%),
            radial-gradient(120% 90% at 92% 92%, #ffe1cf 0%, rgba(255,225,207,0) 62%),
            #f7f2e7
          `} />
      </DCArtboard>

      <DCArtboard id="s05" label="Pistachio · Cream · Blush" width={640} height={460}>
        <SoftStudy name="Orchard" no="05"
          gradient={`
            radial-gradient(120% 100% at 85% 15%, #e6efcd 0%, rgba(230,239,205,0) 62%),
            radial-gradient(120% 100% at 10% 90%, #f7dde1 0%, rgba(247,221,225,0) 60%),
            #f8f3e6
          `} />
      </DCArtboard>

      <DCArtboard id="s06" label="Sand · Pink · Lilac" width={640} height={460}>
        <SoftStudy name="Desert" no="06"
          gradient={`
            radial-gradient(100% 90% at 0% 0%, #f4e8d2 0%, rgba(244,232,210,0) 60%),
            radial-gradient(120% 90% at 100% 100%, #ecdef4 0%, rgba(236,222,244,0) 60%),
            radial-gradient(80% 80% at 60% 50%, #fbe3e0 0%, rgba(251,227,224,0) 60%),
            #f8f1e5
          `} />
      </DCArtboard>

      <DCArtboard id="s07" label="Steel · Cream · Sage" width={640} height={460}>
        <SoftStudy name="Calm Tech" no="07"
          gradient={`
            radial-gradient(110% 80% at 90% 10%, #d8e3e7 0%, rgba(216,227,231,0) 62%),
            radial-gradient(110% 80% at 8% 92%, #dde6cf 0%, rgba(221,230,207,0) 62%),
            #f4efe2
          `} />
      </DCArtboard>

      <DCArtboard id="s08" label="Cool Pearl" width={640} height={460}>
        <SoftStudy name="Pearl" no="08"
          gradient={`
            radial-gradient(120% 90% at 10% 0%, #dfe6f3 0%, rgba(223,230,243,0) 60%),
            radial-gradient(120% 90% at 90% 100%, #e7dff0 0%, rgba(231,223,240,0) 60%),
            #f3f1ec
          `} />
      </DCArtboard>

      <DCArtboard id="s09" label="Champagne · all-warm" width={640} height={460}>
        <SoftStudy name="Champagne" no="09"
          gradient={`
            radial-gradient(120% 90% at 0% 0%, #fbeede 0%, rgba(251,238,222,0) 62%),
            radial-gradient(120% 90% at 100% 100%, #f3e2c8 0%, rgba(243,226,200,0) 62%),
            #fbf6ea
          `} />
      </DCArtboard>

      <DCArtboard id="s10" label="Sunset Wash" width={640} height={460}>
        <SoftStudy name="Sunset" no="10"
          gradient={`
            radial-gradient(120% 90% at 0% 0%, #ffe0d4 0%, rgba(255,224,212,0) 60%),
            radial-gradient(120% 90% at 100% 50%, #f8d3df 0%, rgba(248,211,223,0) 60%),
            radial-gradient(120% 90% at 50% 100%, #efd9ef 0%, rgba(239,217,239,0) 60%),
            #faf2e8
          `} />
      </DCArtboard>

      {/* The soft system applied to a real composition: hero block */}
      <DCArtboard id="s-hero" label="Soft hero · in context" width={960} height={600}>
        <div style={{
          width: '100%', height: '100%',
          background: `
            radial-gradient(110% 90% at 88% 8%, #ffe1cf 0%, rgba(255,225,207,0) 62%),
            radial-gradient(110% 90% at 8% 95%, #e8dcf2 0%, rgba(232,220,242,0) 62%),
            #f7f1e5
          `,
          color: '#1c1822', fontFamily: '"Space Grotesk", sans-serif',
          padding: 40, boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1c1822', display: 'inline-block' }}></span>
              Chaos Over — Commercial Strategy
            </div>
            <span>An intelligent practice</span>
          </div>
          <div>
            <div style={{ fontFamily: '"Big Shoulders Display", sans-serif', fontWeight: 800, fontSize: 124, lineHeight: 0.82, letterSpacing: '-0.02em' }}>
              From chaos,<br/>a commercial<br/>engine<span style={{ color: '#1c1822' }}>.</span>
            </div>
            <div style={{ marginTop: 22, maxWidth: 540, fontSize: 16, lineHeight: 1.45, opacity: 0.85 }}>
              We work with founder-led B2B businesses to build the system —
              the offer, the pricing, the pipeline — that compounds without you.
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6 }}>
            <span>chaosover.co</span>
            <span>Book a diagnostic →</span>
          </div>
        </div>
      </DCArtboard>
    </DCSection>

    {/* ────────────────── SOFT × TITAN ONE ───────────────── */}
    <DCSection id="soft-titan" title="03d · Soft Hues × Titan One" subtitle="Same soft gradient system, swapped to the chunky slab serif. More editorial, more 'magazine cover'.">
      <DCArtboard id="st01" label="Sunrise · Titan One" width={640} height={460}>
        <SoftStudy name="Sunrise · Titan" no="01"
          fontFamily='"Titan One", serif' weight={400} size={0.16} letterSpacing="-0.02em"
          gradient={`
            radial-gradient(110% 90% at 88% 8%, #ffe1cf 0%, rgba(255,225,207,0) 62%),
            radial-gradient(110% 90% at 8% 95%, #e8dcf2 0%, rgba(232,220,242,0) 62%),
            #f7f1e5
          `} />
      </DCArtboard>

      <DCArtboard id="st02" label="Botanical · Titan One" width={640} height={460}>
        <SoftStudy name="Botanical · Titan" no="02"
          fontFamily='"Titan One", serif' weight={400} size={0.16} letterSpacing="-0.02em"
          gradient={`
            radial-gradient(120% 90% at 10% 10%, #d9efe1 0%, rgba(217,239,225,0) 60%),
            radial-gradient(120% 90% at 92% 92%, #f8dde0 0%, rgba(248,221,224,0) 60%),
            #f9f4e7
          `} />
      </DCArtboard>

      <DCArtboard id="st03" label="Petal · Titan One" width={640} height={460}>
        <SoftStudy name="Petal · Titan" no="03"
          fontFamily='"Titan One", serif' weight={400} size={0.16} letterSpacing="-0.02em"
          gradient={`
            radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
            radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
            #f9f3ea
          `} />
      </DCArtboard>

      <DCArtboard id="st04" label="Champagne · Titan One" width={640} height={460}>
        <SoftStudy name="Champagne · Titan" no="04"
          fontFamily='"Titan One", serif' weight={400} size={0.16} letterSpacing="-0.02em"
          gradient={`
            radial-gradient(120% 90% at 0% 0%, #fbeede 0%, rgba(251,238,222,0) 62%),
            radial-gradient(120% 90% at 100% 100%, #f3e2c8 0%, rgba(243,226,200,0) 62%),
            #fbf6ea
          `} />
      </DCArtboard>

      <DCArtboard id="st05" label="Sunset · Titan One" width={640} height={460}>
        <SoftStudy name="Sunset · Titan" no="05"
          fontFamily='"Titan One", serif' weight={400} size={0.16} letterSpacing="-0.02em"
          gradient={`
            radial-gradient(120% 90% at 0% 0%, #ffe0d4 0%, rgba(255,224,212,0) 60%),
            radial-gradient(120% 90% at 100% 50%, #f8d3df 0%, rgba(248,211,223,0) 60%),
            radial-gradient(120% 90% at 50% 100%, #efd9ef 0%, rgba(239,217,239,0) 60%),
            #faf2e8
          `} />
      </DCArtboard>

      <DCArtboard id="st-hero" label="Soft × Titan One · hero" width={960} height={600}>
        <div style={{
          width: '100%', height: '100%',
          background: `
            radial-gradient(110% 90% at 88% 8%, #ffe1cf 0%, rgba(255,225,207,0) 62%),
            radial-gradient(110% 90% at 8% 95%, #e8dcf2 0%, rgba(232,220,242,0) 62%),
            #f7f1e5
          `,
          color: '#1c1822', fontFamily: '"Space Grotesk", sans-serif',
          padding: 40, boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1c1822', display: 'inline-block' }}></span>
              Chaos Over — Commercial Strategy
            </div>
            <span>An intelligent practice</span>
          </div>
          <div>
            <div style={{ fontFamily: '"Titan One", serif', fontWeight: 400, fontSize: 92, lineHeight: 0.92, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              From chaos,<br/>a commercial<br/>engine<span>.</span>
            </div>
            <div style={{ marginTop: 22, maxWidth: 540, fontSize: 16, lineHeight: 1.45, opacity: 0.85 }}>
              We work with founder-led B2B businesses to build the system —
              the offer, the pricing, the pipeline — that compounds without you.
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6 }}>
            <span>chaosover.co</span>
            <span>Book a diagnostic →</span>
          </div>
        </div>
      </DCArtboard>
    </DCSection>

    {/* ────────────────── HYBRID — LAVENDER + STRIKE + LIME OVER ───────────────── */}
    <DCSection id="hybrid" title="03e · Lavender × Strike × Lime OVER" subtitle="Soft Petal gradient ground. Big Shoulders. Diagonal strike through CHAOS, OVER set in acid lime.">
      <DCArtboard id="h-play" label="◉ Strike Playground · live (Tweaks toolbar →)" width={960} height={600}>
        <StrikePlayground t={t} />
      </DCArtboard>

      <DCArtboard id="h-hero" label="Hero · ink strike · lime OVER" width={960} height={600}>
        <div style={{
          width: '100%', height: '100%',
          background: `
            radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
            radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
            #f9f3ea
          `,
          color: '#1c1822', fontFamily: '"Space Grotesk", sans-serif',
          padding: 44, boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* eyebrow */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1c1822', display: 'inline-block' }} />
              Commercial Strategy
            </div>
            <span>Petal × Strike × Lime</span>
          </div>

          {/* wordmark — CHAOS w/ diagonal strike, OVER. in acid lime */}
          <div style={{
            fontFamily: '"Big Shoulders Display", sans-serif',
            fontWeight: 900,
            fontSize: 200,
            lineHeight: 0.84,
            letterSpacing: '-0.02em',
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              CHAOS
              <div style={{
                position: 'absolute',
                left: '-6%', right: '-6%',
                top: '50%',
                height: 16,
                background: '#1c1822',
                transform: 'translateY(-50%) rotate(-15deg)',
                transformOrigin: 'center center',
              }} />
            </div>
            <div style={{ color: '#C8FF3D', display: 'flex', alignItems: 'baseline' }}>
              OVER<span style={{ color: '#1c1822' }}>.</span>
            </div>
          </div>

          {/* footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.65 }}>
            <span>Founder-led B2B</span>
            <span>chaosover.co</span>
          </div>
        </div>
      </DCArtboard>

      <DCArtboard id="h-hero-lime-strike" label="Hero · lime strike · lime OVER" width={960} height={600}>
        <div style={{
          width: '100%', height: '100%',
          background: `
            radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
            radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
            #f9f3ea
          `,
          color: '#1c1822', fontFamily: '"Space Grotesk", sans-serif',
          padding: 44, boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8FF3D', border: '1.5px solid #1c1822', display: 'inline-block' }} />
              Commercial Strategy
            </div>
            <span>Petal × Lime strike</span>
          </div>

          <div style={{
            fontFamily: '"Big Shoulders Display", sans-serif',
            fontWeight: 900,
            fontSize: 200,
            lineHeight: 0.84,
            letterSpacing: '-0.02em',
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              CHAOS
              <div style={{
                position: 'absolute',
                left: '-6%', right: '-6%',
                top: '50%',
                height: 16,
                background: '#C8FF3D',
                transform: 'translateY(-50%) rotate(-15deg)',
                transformOrigin: 'center center',
              }} />
            </div>
            <div style={{ color: '#C8FF3D', display: 'flex', alignItems: 'baseline' }}>
              OVER<span style={{ color: '#1c1822' }}>.</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.65 }}>
            <span>Founder-led B2B</span>
            <span>chaosover.co</span>
          </div>
        </div>
      </DCArtboard>

      {/* Wordmark-only, compact */}
      <DCArtboard id="h-wm" label="Wordmark only · ink strike" width={640} height={460}>
        <div style={{
          width: '100%', height: '100%',
          background: `
            radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
            radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
            #f9f3ea
          `,
          padding: 40, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: '"Big Shoulders Display", sans-serif',
            fontWeight: 900, fontSize: 132, lineHeight: 0.84, letterSpacing: '-0.02em', color: '#1c1822',
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              CHAOS
              <div style={{
                position: 'absolute', left: '-6%', right: '-6%', top: '50%',
                height: 11, background: '#1c1822',
                transform: 'translateY(-50%) rotate(-15deg)',
              }} />
            </div>
            <div style={{ color: '#C8FF3D' }}>
              OVER<span style={{ color: '#1c1822' }}>.</span>
            </div>
          </div>
        </div>
      </DCArtboard>

      <DCArtboard id="h-wm-lime" label="Wordmark only · lime strike" width={640} height={460}>
        <div style={{
          width: '100%', height: '100%',
          background: `
            radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
            radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
            #f9f3ea
          `,
          padding: 40, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: '"Big Shoulders Display", sans-serif',
            fontWeight: 900, fontSize: 132, lineHeight: 0.84, letterSpacing: '-0.02em', color: '#1c1822',
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              CHAOS
              <div style={{
                position: 'absolute', left: '-6%', right: '-6%', top: '50%',
                height: 11, background: '#C8FF3D',
                transform: 'translateY(-50%) rotate(-15deg)',
              }} />
            </div>
            <div style={{ color: '#C8FF3D' }}>
              OVER<span style={{ color: '#1c1822' }}>.</span>
            </div>
          </div>
        </div>
      </DCArtboard>

      {/* —— REVERSED STRIKE · INK OVER · LIME FULL-STOP —— */}
      <DCArtboard id="h-hero-rev" label="Hero · reverse strike · ink OVER · lime dot" width={960} height={600}>
        <div style={{
          width: '100%', height: '100%',
          background: `
            radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
            radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
            #f9f3ea
          `,
          color: '#1c1822', fontFamily: '"Space Grotesk", sans-serif',
          padding: 44, boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8FF3D', display: 'inline-block' }} />
              Commercial Strategy
            </div>
            <span>Petal × Reverse · Ink OVER · Lime dot</span>
          </div>

          <div style={{
            fontFamily: '"Big Shoulders Display", sans-serif',
            fontWeight: 900, fontSize: 200, lineHeight: 0.84, letterSpacing: '-0.02em',
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              CHAOS
              <div style={{
                position: 'absolute',
                left: '-6%', right: '-6%',
                top: '50%',
                height: 16,
                background: '#1c1822',
                transform: 'translateY(-50%) rotate(15deg)',
                transformOrigin: 'center center',
              }} />
            </div>
            <div style={{ color: '#1c1822', display: 'flex', alignItems: 'baseline' }}>
              OVER<span style={{ color: '#C8FF3D' }}>.</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.65 }}>
            <span>Founder-led B2B</span>
            <span>chaosover.co</span>
          </div>
        </div>
      </DCArtboard>

      <DCArtboard id="h-hero-rev-lime" label="Hero · reverse lime strike · ink OVER · lime dot" width={960} height={600}>
        <div style={{
          width: '100%', height: '100%',
          background: `
            radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
            radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
            #f9f3ea
          `,
          color: '#1c1822', fontFamily: '"Space Grotesk", sans-serif',
          padding: 44, boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8FF3D', display: 'inline-block' }} />
              Commercial Strategy
            </div>
            <span>Petal × Reverse · Lime strike</span>
          </div>

          <div style={{
            fontFamily: '"Big Shoulders Display", sans-serif',
            fontWeight: 900, fontSize: 200, lineHeight: 0.84, letterSpacing: '-0.02em',
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              CHAOS
              <div style={{
                position: 'absolute',
                left: '-6%', right: '-6%',
                top: '50%',
                height: 16,
                background: '#C8FF3D',
                transform: 'translateY(-50%) rotate(15deg)',
                transformOrigin: 'center center',
              }} />
            </div>
            <div style={{ color: '#1c1822', display: 'flex', alignItems: 'baseline' }}>
              OVER<span style={{ color: '#C8FF3D' }}>.</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.65 }}>
            <span>Founder-led B2B</span>
            <span>chaosover.co</span>
          </div>
        </div>
      </DCArtboard>

      <DCArtboard id="h-wm-rev" label="Wordmark · reverse · ink OVER · lime dot" width={640} height={460}>
        <div style={{
          width: '100%', height: '100%',
          background: `
            radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
            radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
            #f9f3ea
          `,
          padding: 40, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: '"Big Shoulders Display", sans-serif',
            fontWeight: 900, fontSize: 132, lineHeight: 0.84, letterSpacing: '-0.02em', color: '#1c1822',
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              CHAOS
              <div style={{
                position: 'absolute', left: '-6%', right: '-6%', top: '50%',
                height: 11, background: '#1c1822',
                transform: 'translateY(-50%) rotate(15deg)',
              }} />
            </div>
            <div style={{ color: '#1c1822' }}>
              OVER<span style={{ color: '#C8FF3D' }}>.</span>
            </div>
          </div>
        </div>
      </DCArtboard>

      <DCArtboard id="h-wm-rev-lime" label="Wordmark · reverse · lime strike" width={640} height={460}>
        <div style={{
          width: '100%', height: '100%',
          background: `
            radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
            radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
            #f9f3ea
          `,
          padding: 40, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: '"Big Shoulders Display", sans-serif',
            fontWeight: 900, fontSize: 132, lineHeight: 0.84, letterSpacing: '-0.02em', color: '#1c1822',
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              CHAOS
              <div style={{
                position: 'absolute', left: '-6%', right: '-6%', top: '50%',
                height: 11, background: '#C8FF3D',
                transform: 'translateY(-50%) rotate(15deg)',
              }} />
            </div>
            <div style={{ color: '#1c1822' }}>
              OVER<span style={{ color: '#C8FF3D' }}>.</span>
            </div>
          </div>
        </div>
      </DCArtboard>

      {/* —— SILHOUETTE: figure pushing through the gradient (membrane effect) —— */}
      <DCArtboard id="h-silhouette" label="Hero · figure pushing through · locked tweaks" width={1080} height={680}>
        <div style={{
          width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
          fontFamily: '"Space Grotesk", sans-serif',
          background: `
            radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
            radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
            #f9f3ea
          `,
        }}>
          {/* Layer 1 — figure behind the membrane: heavily blurred body + head */}
          <svg viewBox="0 0 1080 680" preserveAspectRatio="xMidYMid slice"
               style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <filter id="bigBlur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="36" />
              </filter>
              <filter id="armBlur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="22" />
              </filter>
              <filter id="handBlur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <radialGradient id="handShade" cx="50%" cy="40%" r="60%">
                <stop offset="0%"  stopColor="#222025" stopOpacity="0.92" />
                <stop offset="65%" stopColor="#3a353f" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#3a353f" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Body + head — very blurred, mid-gray, low opacity */}
            <g filter="url(#bigBlur)" fill="#42394a" opacity="0.34">
              {/* head */}
              <ellipse cx="540" cy="200" rx="92" ry="108" />
              {/* shoulders + torso (one big rounded shape) */}
              <ellipse cx="540" cy="560" rx="360" ry="260" />
              {/* neck merge */}
              <rect x="490" y="270" width="100" height="120" />
            </g>

            {/* Arms — extending out toward where hands press */}
            <g filter="url(#armBlur)" fill="#3a323e" opacity="0.42">
              {/* left arm angled up-out */}
              <ellipse cx="320" cy="380" rx="190" ry="48" transform="rotate(-18 320 380)" />
              {/* right arm */}
              <ellipse cx="760" cy="380" rx="190" ry="48" transform="rotate(18 760 380)" />
            </g>
          </svg>

          {/* Layer 2 — Membrane overlay: re-paint of the gradient on top, semi-transparent.
              Sits ABOVE the body so the figure looks "behind the fabric". */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
              radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
              #f9f3ea
            `,
            opacity: 0.62,
            mixBlendMode: 'normal',
            pointerEvents: 'none',
          }} />

          {/* Layer 3 — Hands: pop through the membrane (above the overlay).
              Lower blur + radial shading = appears more "in focus" / nearer to viewer. */}
          <svg viewBox="0 0 1080 680" preserveAspectRatio="xMidYMid slice"
               style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <filter id="handBlur2" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            {/* left hand-print: palm + spread fingers (5 simple ovals) */}
            <g filter="url(#handBlur2)" opacity="0.78">
              <g transform="translate(170 380)">
                <ellipse cx="0" cy="0" rx="50" ry="62" fill="url(#handShade)" />
                {/* fingers */}
                <ellipse cx="-36" cy="-58" rx="11" ry="28" transform="rotate(-22 -36 -58)" fill="url(#handShade)" />
                <ellipse cx="-14" cy="-72" rx="11" ry="32" transform="rotate(-8 -14 -72)" fill="url(#handShade)" />
                <ellipse cx="10"  cy="-72" rx="11" ry="34" transform="rotate(6 10 -72)" fill="url(#handShade)" />
                <ellipse cx="32"  cy="-62" rx="11" ry="28" transform="rotate(20 32 -62)" fill="url(#handShade)" />
                <ellipse cx="-46" cy="-10" rx="14" ry="22" transform="rotate(-55 -46 -10)" fill="url(#handShade)" />
              </g>
            </g>
            {/* right hand: mirror */}
            <g filter="url(#handBlur2)" opacity="0.78">
              <g transform="translate(910 380)">
                <ellipse cx="0" cy="0" rx="50" ry="62" fill="url(#handShade)" />
                <ellipse cx="36" cy="-58" rx="11" ry="28" transform="rotate(22 36 -58)" fill="url(#handShade)" />
                <ellipse cx="14" cy="-72" rx="11" ry="32" transform="rotate(8 14 -72)" fill="url(#handShade)" />
                <ellipse cx="-10" cy="-72" rx="11" ry="34" transform="rotate(-6 -10 -72)" fill="url(#handShade)" />
                <ellipse cx="-32" cy="-62" rx="11" ry="28" transform="rotate(-20 -32 -62)" fill="url(#handShade)" />
                <ellipse cx="46" cy="-10" rx="14" ry="22" transform="rotate(55 46 -10)" fill="url(#handShade)" />
              </g>
            </g>
          </svg>

          {/* Layer 4 — Wordmark, using the locked tweak values */}
          <div style={{
            position: 'absolute', inset: 0,
            padding: 56, boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            color: '#1c1822',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.75 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8FF3D', display: 'inline-block', boxShadow: '0 0 0 1.5px #1c1822' }} />
                Commercial Strategy
              </div>
              <span>Push through</span>
            </div>

            <div style={{
              fontFamily: '"Big Shoulders Display", sans-serif',
              fontWeight: 900, fontSize: 220, lineHeight: 0.84, letterSpacing: '-0.02em',
            }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                CHAOS
                <div style={{
                  position: 'absolute',
                  left: '-6%', right: '-6%',
                  top: '72%',
                  height: 6,
                  background: '#C8FF3D',
                  transform: 'translateY(-50%) rotate(-39deg)',
                  transformOrigin: 'center center',
                }} />
              </div>
              <div style={{ color: '#1c1822', display: 'flex', alignItems: 'baseline' }}>
                OVER<span style={{ color: '#C8FF3D' }}>.</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7 }}>
              <span>Founder-led B2B</span>
              <span>chaosover.co</span>
            </div>
          </div>
        </div>
      </DCArtboard>

      {/* Same composition but with hands more pulled-in / pressing toward center,
          and stronger shading so it reads as "stretched fabric" */}
      <DCArtboard id="h-silhouette-press" label="Hero · figure pressing in · stronger" width={1080} height={680}>
        <div style={{
          width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
          fontFamily: '"Space Grotesk", sans-serif',
          background: `
            radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
            radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
            #f9f3ea
          `,
        }}>
          {/* Body — heavier blur, slightly off-center */}
          <svg viewBox="0 0 1080 680" preserveAspectRatio="xMidYMid slice"
               style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <filter id="bb2" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="42" />
              </filter>
              <filter id="ab2" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="20" />
              </filter>
              <filter id="hb2" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" />
              </filter>
              <radialGradient id="handShade2" cx="50%" cy="40%" r="60%">
                <stop offset="0%"  stopColor="#1a181d" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#39343d" stopOpacity="0.62" />
                <stop offset="100%" stopColor="#39343d" stopOpacity="0" />
              </radialGradient>
              {/* radial light around hands to suggest "stretched outward" */}
              <radialGradient id="stretch" cx="50%" cy="50%" r="50%">
                <stop offset="0%"  stopColor="#000" stopOpacity="0" />
                <stop offset="70%" stopColor="#000" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g filter="url(#bb2)" fill="#3b313e" opacity="0.4">
              <ellipse cx="540" cy="180" rx="86" ry="100" />
              <ellipse cx="540" cy="540" rx="380" ry="270" />
              <rect x="494" y="260" width="92" height="120" />
            </g>
            <g filter="url(#ab2)" fill="#332b36" opacity="0.45">
              <ellipse cx="350" cy="360" rx="180" ry="46" transform="rotate(-12 350 360)" />
              <ellipse cx="730" cy="360" rx="180" ry="46" transform="rotate(12 730 360)" />
            </g>
            {/* stretch rings around where hands push (still behind membrane) */}
            <ellipse cx="240" cy="370" rx="180" ry="180" fill="url(#stretch)" />
            <ellipse cx="840" cy="370" rx="180" ry="180" fill="url(#stretch)" />
          </svg>

          {/* Membrane overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
              radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
              #f9f3ea
            `,
            opacity: 0.58,
            pointerEvents: 'none',
          }} />

          {/* Hands — sharper, more "pressed" */}
          <svg viewBox="0 0 1080 680" preserveAspectRatio="xMidYMid slice"
               style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <g filter="url(#hb2)" opacity="0.88">
              <g transform="translate(240 370)">
                <ellipse cx="0" cy="0" rx="56" ry="68" fill="url(#handShade2)" />
                <ellipse cx="-38" cy="-64" rx="12" ry="32" transform="rotate(-25 -38 -64)" fill="url(#handShade2)" />
                <ellipse cx="-14" cy="-78" rx="12" ry="36" transform="rotate(-8 -14 -78)" fill="url(#handShade2)" />
                <ellipse cx="10"  cy="-80" rx="12" ry="38" transform="rotate(6 10 -80)" fill="url(#handShade2)" />
                <ellipse cx="34"  cy="-68" rx="12" ry="32" transform="rotate(22 34 -68)" fill="url(#handShade2)" />
                <ellipse cx="-52" cy="-14" rx="16" ry="24" transform="rotate(-55 -52 -14)" fill="url(#handShade2)" />
              </g>
              <g transform="translate(840 370)">
                <ellipse cx="0" cy="0" rx="56" ry="68" fill="url(#handShade2)" />
                <ellipse cx="38" cy="-64" rx="12" ry="32" transform="rotate(25 38 -64)" fill="url(#handShade2)" />
                <ellipse cx="14" cy="-78" rx="12" ry="36" transform="rotate(8 14 -78)" fill="url(#handShade2)" />
                <ellipse cx="-10" cy="-80" rx="12" ry="38" transform="rotate(-6 -10 -80)" fill="url(#handShade2)" />
                <ellipse cx="-34" cy="-68" rx="12" ry="32" transform="rotate(-22 -34 -68)" fill="url(#handShade2)" />
                <ellipse cx="52" cy="-14" rx="16" ry="24" transform="rotate(55 52 -14)" fill="url(#handShade2)" />
              </g>
            </g>
          </svg>

          {/* Wordmark */}
          <div style={{
            position: 'absolute', inset: 0,
            padding: 56, boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            color: '#1c1822',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.75 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8FF3D', display: 'inline-block', boxShadow: '0 0 0 1.5px #1c1822' }} />
                Commercial Strategy
              </div>
              <span>Stronger membrane</span>
            </div>
            <div style={{
              fontFamily: '"Big Shoulders Display", sans-serif',
              fontWeight: 900, fontSize: 220, lineHeight: 0.84, letterSpacing: '-0.02em',
            }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                CHAOS
                <div style={{
                  position: 'absolute',
                  left: '-6%', right: '-6%',
                  top: '72%',
                  height: 6,
                  background: '#C8FF3D',
                  transform: 'translateY(-50%) rotate(-39deg)',
                  transformOrigin: 'center center',
                }} />
              </div>
              <div style={{ color: '#1c1822', display: 'flex', alignItems: 'baseline' }}>
                OVER<span style={{ color: '#C8FF3D' }}>.</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7 }}>
              <span>Founder-led B2B</span>
              <span>chaosover.co</span>
            </div>
          </div>
        </div>
      </DCArtboard>
    </DCSection>

    {/* ────────────────── 03f · DUO + GLASS ───────────────── */}
    <DCSection id="duo-glass" title="03f · Duo + Glass" subtitle="Refined hybrid: two-tone diffuse gradient (calmer than 03e Petal), with abstract glass-material shapes layered in. Built to drive the parallax web background.">

      {/* Reusable: a duo-tone background with N glass abstract shapes,
          wordmark composed on top. All sizes parametric so the same recipe
          can be reused across artboards. */}
      {(() => {
        // Define glass shape recipes once, render later inside each artboard.
        // Each shape has: id, x/y vw/vh, size, blur, opacity, tint, shape (circle|pill|capsule|shard).
        // We pass `scene` to vary the recipes between artboards.
        const GLASS_SCENES = {
          lavender_calm: {
            bg: `radial-gradient(120% 100% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 64%), #f6f1e6`,
            shapes: [
              { x: -8,  y: 6,   size: 380, blur: 50, op: 0.55, tint: '#c8b6e6', kind: 'circle' },
              { x: 60,  y: -12, size: 520, blur: 60, op: 0.42, tint: '#b9a4d9', kind: 'circle' },
              { x: 35,  y: 70,  size: 260, blur: 28, op: 0.62, tint: '#d9c8f0', kind: 'circle' },
              { x: 78,  y: 58,  size: 200, blur: 14, op: 0.72, tint: '#e2d2f3', kind: 'pill' },
              { x: 15,  y: 42,  size: 110, blur: 4,  op: 0.85, tint: '#efe2fb', kind: 'circle' },
            ],
          },
          peach_calm: {
            bg: `radial-gradient(120% 100% at 8% 95%, #ffd9c2 0%, rgba(255,217,194,0) 64%), #f8f1e3`,
            shapes: [
              { x: 70,  y: -8,  size: 460, blur: 60, op: 0.5,  tint: '#f4b794', kind: 'circle' },
              { x: -6,  y: 50,  size: 360, blur: 44, op: 0.55, tint: '#f7c9a8', kind: 'circle' },
              { x: 30,  y: 75,  size: 240, blur: 22, op: 0.62, tint: '#fad7bf', kind: 'pill' },
              { x: 56,  y: 28,  size: 140, blur: 8,  op: 0.8,  tint: '#fde2cf', kind: 'circle' },
            ],
          },
          mint_calm: {
            bg: `radial-gradient(120% 100% at 6% 8%, #d6ecde 0%, rgba(214,236,222,0) 64%), #f4f0e2`,
            shapes: [
              { x: 65,  y: 8,   size: 460, blur: 60, op: 0.48, tint: '#9ed6b3', kind: 'circle' },
              { x: -10, y: 55,  size: 380, blur: 44, op: 0.5,  tint: '#b9e0c8', kind: 'circle' },
              { x: 38,  y: 78,  size: 220, blur: 20, op: 0.6,  tint: '#caead8', kind: 'pill' },
              { x: 22,  y: 24,  size: 120, blur: 6,  op: 0.78, tint: '#d9f0e3', kind: 'circle' },
            ],
          },
          sky_calm: {
            bg: `radial-gradient(120% 100% at 95% 5%, #d6e3f0 0%, rgba(214,227,240,0) 64%), #f3f0e4`,
            shapes: [
              { x: -6,  y: 6,   size: 420, blur: 56, op: 0.5,  tint: '#9eb9d6', kind: 'circle' },
              { x: 60,  y: 60,  size: 360, blur: 38, op: 0.5,  tint: '#b6c8df', kind: 'circle' },
              { x: 38,  y: 22,  size: 180, blur: 14, op: 0.7,  tint: '#cad8e8', kind: 'pill' },
              { x: 76,  y: 18,  size: 96,  op: 0.86, blur: 4,  tint: '#dee7f0', kind: 'circle' },
            ],
          },
          champagne_calm: {
            bg: `radial-gradient(120% 100% at 0% 0%, #f5e3c6 0%, rgba(245,227,198,0) 64%), #faf3e3`,
            shapes: [
              { x: 70,  y: -10, size: 480, blur: 60, op: 0.45, tint: '#e8c89a', kind: 'circle' },
              { x: -10, y: 50,  size: 380, blur: 44, op: 0.48, tint: '#edd2ab', kind: 'circle' },
              { x: 34,  y: 70,  size: 240, blur: 22, op: 0.55, tint: '#f0dab9', kind: 'pill' },
              { x: 56,  y: 30,  size: 130, blur: 6,  op: 0.78, tint: '#f4e2c8', kind: 'circle' },
            ],
          },
          duo_parallax_preview: {
            // Same as lavender_calm but with one shape marked as 'near' (sharp).
            bg: `radial-gradient(120% 100% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 64%), #f6f1e6`,
            shapes: [
              { x: -10, y: 4,   size: 420, blur: 70, op: 0.5,  tint: '#b9a4d9', kind: 'circle', depth: 'far' },
              { x: 62,  y: 0,   size: 540, blur: 80, op: 0.42, tint: '#c8b6e6', kind: 'circle', depth: 'far' },
              { x: 30,  y: 58,  size: 280, blur: 28, op: 0.62, tint: '#d9c8f0', kind: 'circle', depth: 'mid' },
              { x: 78,  y: 62,  size: 210, blur: 14, op: 0.74, tint: '#e2d2f3', kind: 'pill',   depth: 'mid' },
              { x: 14,  y: 38,  size: 116, blur: 3,  op: 0.92, tint: '#f5e8ff', kind: 'circle', depth: 'near' },
              { x: 88,  y: 38,  size: 64,  blur: 0,  op: 1.0,  tint: '#ffffff', kind: 'circle', depth: 'near', highlight: true },
            ],
          },
        };

        const GlassShape = ({ s, frameW = 1080, frameH = 680 }) => {
          const w = s.size;
          const h = s.kind === 'pill' ? s.size * 0.36 : (s.kind === 'capsule' ? s.size * 0.5 : s.size);
          const borderRadius = s.kind === 'pill' || s.kind === 'capsule' ? 9999 : '50%';
          // Convert vw/vh-ish placement (we treat x/y as % of frame here)
          const px = (s.x / 100) * frameW;
          const py = (s.y / 100) * frameH;
          // Glass gradient: bright top-left highlight, soft tint body, slightly darker base.
          const grad = s.highlight
            ? `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 30%, ${s.tint}00 75%)`
            : `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.6) 0%, ${s.tint} 35%, ${s.tint} 65%, ${shadeHex(s.tint, -8)} 100%)`;
          return (
            <div style={{
              position: 'absolute',
              left: px, top: py,
              width: w, height: h,
              borderRadius,
              background: grad,
              filter: `blur(${s.blur}px)`,
              opacity: s.op,
              // Subtle inner highlight + shadow for glass feel (only when blur is small)
              boxShadow: s.blur <= 10
                ? `inset 1.5px 2px 4px rgba(255,255,255,0.55), inset -2px -3px 8px rgba(28,24,34,0.06), 0 8px 24px rgba(28,24,34,0.06)`
                : 'none',
            }} />
          );
        };

        // Tiny inline hex shader (avoids importing util libs)
        function shadeHex(hex, percent) {
          const f = parseInt(hex.slice(1), 16);
          const t = percent < 0 ? 0 : 255;
          const p = Math.abs(percent) / 100;
          const R = f >> 16, G = (f >> 8) & 0xff, B = f & 0xff;
          const r = Math.round((t - R) * p) + R;
          const g = Math.round((t - G) * p) + G;
          const b = Math.round((t - B) * p) + B;
          return `#${(0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        }

        // Lockup composition (CHAOS strike OVER. — locked: -39° / 72% / 6px / lime strike / ink OVER / lime dot)
        const Lockup = ({ size = 200 }) => (
          <div style={{
            fontFamily: '"Big Shoulders Display", sans-serif',
            fontWeight: 900, fontSize: size, lineHeight: 0.84, letterSpacing: '-0.02em',
            color: '#1c1822',
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              CHAOS
              <div style={{
                position: 'absolute',
                left: '-6%', right: '-6%',
                top: '72%',
                height: 6,
                background: '#C8FF3D',
                transform: 'translateY(-50%) rotate(-39deg)',
                transformOrigin: 'center center',
              }} />
            </div>
            <div style={{ color: '#1c1822', display: 'flex', alignItems: 'baseline' }}>
              OVER<span style={{ color: '#C8FF3D' }}>.</span>
            </div>
          </div>
        );

        // Glass stage primitive: bg + shapes + lockup + meta strips
        const GlassStage = ({ scene = 'lavender_calm', w = 1080, h = 680, sizeMul = 1, withMeta = true, label }) => {
          const cfg = GLASS_SCENES[scene];
          return (
            <div style={{
              width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
              background: cfg.bg,
              fontFamily: '"Space Grotesk", sans-serif',
            }}>
              {/* shape layer */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {cfg.shapes.map((s, i) => <GlassShape key={i} s={s} frameW={w} frameH={h} />)}
              </div>

              {/* content layer */}
              <div style={{
                position: 'absolute', inset: 0,
                padding: 44, boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                color: '#1c1822',
              }}>
                {withMeta && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.65 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8FF3D', display: 'inline-block', boxShadow: '0 0 0 1.5px #1c1822' }} />
                      Commercial Strategy
                    </div>
                    <span>{label || scene}</span>
                  </div>
                )}
                <Lockup size={200 * sizeMul} />
                {withMeta && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.65 }}>
                    <span>Founder-led B2B</span>
                    <span>chaosover.co</span>
                  </div>
                )}
              </div>
            </div>
          );
        };

        return (
          <>
            {/* Five 2-tone glass studies */}
            <DCArtboard id="dg-lavender" label="A · Lavender duo + glass" width={1080} height={680}>
              <GlassStage scene="lavender_calm" w={1080} h={680} label="Lavender · Calm" />
            </DCArtboard>

            <DCArtboard id="dg-peach" label="B · Peach duo + glass" width={1080} height={680}>
              <GlassStage scene="peach_calm" w={1080} h={680} label="Peach · Calm" />
            </DCArtboard>

            <DCArtboard id="dg-mint" label="C · Mint duo + glass" width={1080} height={680}>
              <GlassStage scene="mint_calm" w={1080} h={680} label="Mint · Calm" />
            </DCArtboard>

            <DCArtboard id="dg-sky" label="D · Sky duo + glass" width={1080} height={680}>
              <GlassStage scene="sky_calm" w={1080} h={680} label="Sky · Calm" />
            </DCArtboard>

            <DCArtboard id="dg-champagne" label="E · Champagne duo + glass" width={1080} height={680}>
              <GlassStage scene="champagne_calm" w={1080} h={680} label="Champagne · Calm" />
            </DCArtboard>

            {/* Parallax preview — labels each shape by its intended depth tier */}
            <DCArtboard id="dg-parallax-preview" label="◉ Parallax depth preview (annotated)" width={1280} height={780}>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <GlassStage scene="duo_parallax_preview" w={1280} h={780} label="Parallax preview · 3 depth tiers" />
                {/* Overlay tier labels */}
                <div style={{
                  position: 'absolute', left: 44, top: 96,
                  display: 'flex', gap: 10, alignItems: 'center',
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: '#1c1822', opacity: 0.55,
                }}>
                  <div style={{ width: 26, height: 26, background: '#b9a4d9', borderRadius: '50%', filter: 'blur(8px)', opacity: 0.7 }} />
                  Far · scrolls slow
                </div>
                <div style={{
                  position: 'absolute', left: 44, top: 132,
                  display: 'flex', gap: 10, alignItems: 'center',
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: '#1c1822', opacity: 0.65,
                }}>
                  <div style={{ width: 26, height: 26, background: '#d9c8f0', borderRadius: '50%', filter: 'blur(3px)' }} />
                  Mid · scrolls med
                </div>
                <div style={{
                  position: 'absolute', left: 44, top: 168,
                  display: 'flex', gap: 10, alignItems: 'center',
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: '#1c1822', opacity: 0.85,
                }}>
                  <div style={{ width: 26, height: 26, background: 'radial-gradient(circle at 30% 25%, #fff 0%, #f5e8ff 60%)', borderRadius: '50%', boxShadow: 'inset 1px 1.5px 3px rgba(255,255,255,0.6), inset -1.5px -2px 6px rgba(28,24,34,0.08)' }} />
                  Near · scrolls fast / hero plane
                </div>
              </div>
            </DCArtboard>

            {/* Comparison: 03e Petal vs 03f Lavender · same lockup, different bg */}
            <DCArtboard id="dg-vs-petal" label="VS 03e · Petal (3-color)" width={640} height={460}>
              <div style={{
                width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
                background: `
                  radial-gradient(110% 90% at 95% 5%, #e6dcf3 0%, rgba(230,220,243,0) 60%),
                  radial-gradient(110% 90% at 5% 95%, #fbe2e9 0%, rgba(251,226,233,0) 60%),
                  #f9f3ea
                `,
                padding: 36, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: '"Big Shoulders Display", sans-serif',
                fontWeight: 900, fontSize: 132, lineHeight: 0.84, letterSpacing: '-0.02em', color: '#1c1822',
              }}>
                <div>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    CHAOS
                    <div style={{ position: 'absolute', left: '-6%', right: '-6%', top: '72%', height: 6, background: '#C8FF3D', transform: 'translateY(-50%) rotate(-39deg)' }} />
                  </div>
                  <div>OVER<span style={{ color: '#C8FF3D' }}>.</span></div>
                </div>
                <div style={{ position: 'absolute', bottom: 10, left: 14, fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.45 }}>
                  03e · 3 colors · no glass
                </div>
              </div>
            </DCArtboard>

            <DCArtboard id="dg-vs-lavender" label="VS 03f · Lavender (2-color + glass)" width={640} height={460}>
              <GlassStage scene="lavender_calm" w={640} h={460} sizeMul={0.66} withMeta={false} />
              <div style={{ position: 'absolute', bottom: 10, left: 14, fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.45 }}>
                03f · 2 colors · glass shapes
              </div>
            </DCArtboard>
          </>
        );
      })()}
    </DCSection>

    {/* ────────────────── LOCKUPS ───────────────── */}
    <DCSection id="lockups" title="03 · Lockups" subtitle="Symbol + wordmark + descriptor. The everyday signature.">
      <DCArtboard id="l1" label="Pivot + wordmark" width={540} height={300}>
        <div style={{ width: '100%', height: '100%' }}><Lockup width={540} mark="pivot" /></div>
      </DCArtboard>
      <DCArtboard id="l2" label="Bracket + wordmark" width={540} height={300}>
        <div style={{ width: '100%', height: '100%' }}><Lockup width={540} mark="bracket" /></div>
      </DCArtboard>
      <DCArtboard id="l3" label="Aperture + wordmark" width={540} height={300}>
        <div style={{ width: '100%', height: '100%' }}><Lockup width={540} mark="aperture" /></div>
      </DCArtboard>
      <DCArtboard id="l4" label="Stack + wordmark · inv" width={540} height={300}>
        <div style={{ width: '100%', height: '100%' }}><Lockup width={540} mark="stack" bg={CO_INK} fg={CO_BONE} /></div>
      </DCArtboard>
      <DCArtboard id="l5" label="Monogram + wordmark · signal" width={540} height={300}>
        <div style={{ width: '100%', height: '100%' }}><Lockup width={540} mark="monogram" bg={CO_SIGNAL} fg={CO_INK} accent={CO_INK} /></div>
      </DCArtboard>
      <DCArtboard id="l6" label="Lever + wordmark" width={540} height={300}>
        <div style={{ width: '100%', height: '100%' }}><Lockup width={540} mark="lever" /></div>
      </DCArtboard>
    </DCSection>

    {/* ────────────────── APPLICATIONS ───────────────── */}
    <DCSection id="apps" title="04 · In the Wild" subtitle="How the system holds up across surfaces.">
      <DCArtboard id="p1" label="Editorial poster" width={540} height={760}>
        <div style={{ width: '100%', height: '100%' }}><PosterEditorial width={540} height={760} /></div>
      </DCArtboard>

      <DCArtboard id="p2" label="Colour poster" width={540} height={760}>
        <div style={{ width: '100%', height: '100%' }}><PosterColor width={540} height={760} /></div>
      </DCArtboard>

      <DCArtboard id="p3" label="Stamp / badge" width={400} height={400}>
        <Frame bg={CO_BONE} pad={20}><StampBadge size={360} /></Frame>
      </DCArtboard>

      <DCArtboard id="p4" label="Business cards" width={540} height={340}>
        <Frame bg="#e9e3d5" pad={10}><BusinessCard width={520} height={320} /></Frame>
      </DCArtboard>

      <DCArtboard id="p5" label="Web hero" width={960} height={600}>
        <div style={{ width: '100%', height: '100%' }}><WebHero width={960} height={600} /></div>
      </DCArtboard>

      <DCArtboard id="p6" label="Method book spread" width={880} height={560}>
        <div style={{ width: '100%', height: '100%' }}><CollateralSpread width={880} height={560} /></div>
      </DCArtboard>
    </DCSection>

    {/* ────────────────── COLOUR STUDIES ───────────────── */}
    <DCSection id="colours" title="05 · Colour Studies" subtitle="Same brand, twelve accents. Top half = colour as ground; bottom half = colour as fill against charcoal. Compare and pick your lane.">
      <DCArtboard id="c01" label="Luminous Yellow · current" width={460} height={580}>
        <ColorStudy name="Luminous" hex="#E8FF1A" sub="Energetic · arresting · 'highlighter'" />
      </DCArtboard>
      <DCArtboard id="c02" label="Acid Lime" width={460} height={580}>
        <ColorStudy name="Acid Lime" hex="#C8FF3D" sub="Fresh · tech-forward · softer pop" />
      </DCArtboard>
      <DCArtboard id="c03" label="Chartreuse" width={460} height={580}>
        <ColorStudy name="Chartreuse" hex="#9FE642" sub="Confident · grown-up green" />
      </DCArtboard>
      <DCArtboard id="c04" label="Electric Mint" width={460} height={580}>
        <ColorStudy name="Mint" hex="#5FE8C2" sub="Modern · calm · fintech-adjacent" />
      </DCArtboard>
      <DCArtboard id="c05" label="Sky Blue" width={460} height={580}>
        <ColorStudy name="Sky" hex="#7CC4FF" sub="Considered · sky-clean · soft" />
      </DCArtboard>
      <DCArtboard id="c06" label="Cobalt" width={460} height={580}>
        <ColorStudy name="Cobalt" hex="#2F4DFF" sub="Intelligent · financial · classic" />
      </DCArtboard>
      <DCArtboard id="c07" label="Lavender" width={460} height={580}>
        <ColorStudy name="Lavender" hex="#B8A8FF" sub="Premium · contemporary · soft-tech" />
      </DCArtboard>
      <DCArtboard id="c08" label="Magenta" width={460} height={580}>
        <ColorStudy name="Magenta" hex="#FF3DB5" sub="Bold · distinctive · contrarian" />
      </DCArtboard>
      <DCArtboard id="c09" label="Coral" width={460} height={580}>
        <ColorStudy name="Coral" hex="#FF6B5A" sub="Warm · human · friendly" />
      </DCArtboard>
      <DCArtboard id="c10" label="Hot Orange" width={460} height={580}>
        <ColorStudy name="Hot Orange" hex="#FF5B1F" sub="Urgent · arresting · the original" />
      </DCArtboard>
      <DCArtboard id="c11" label="Amber / Mustard" width={460} height={580}>
        <ColorStudy name="Amber" hex="#E8A93D" sub="Warm · sophisticated · editorial" />
      </DCArtboard>
      <DCArtboard id="c12" label="Tomato Red" width={460} height={580}>
        <ColorStudy name="Tomato" hex="#E63946" sub="Confident · canonical · serious" />
      </DCArtboard>
      <DCArtboard id="c13" label="Sage" width={460} height={580}>
        <ColorStudy name="Sage" hex="#BFD68A" sub="Calm · considered · long-term" />
      </DCArtboard>
      <DCArtboard id="c14" label="Bone (no accent)" width={460} height={580}>
        <ColorStudy name="Mono" hex="#F2EDE3" sub="No accent · stark · all type" />
      </DCArtboard>
    </DCSection>

    {/* ────────────────── NOTES ───────────────── */}
    <DCSection id="notes" title="Next" subtitle="A few places to push next.">
      <DCArtboard id="next" label="Notes" width={760} height={400}>
        <div style={{
          width: '100%', height: '100%', background: CO_BONE, color: CO_INK,
          padding: 36, boxSizing: 'border-box',
          fontFamily: '"Space Grotesk", sans-serif',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{ display: 'inline-block', background: CO_SIGNAL, color: CO_INK, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '3px 7px' }}>NEXT MOVES</div>
          <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 28, letterSpacing: '-0.025em', lineHeight: 1 }}>
            Pick a lane, then push it.
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, fontSize: 14 }}>
            <li>Choose 1–2 symbol marks to develop into a final SVG with proper kerning + sizes.</li>
            <li>Pick the wordmark direction — Lines (most editorial), Bracket (most ownable), or Override (most provocative).</li>
            <li>Lock the palette — is Signal Orange the primary accent, or do we go Cobalt for more "intelligent / financial"?</li>
            <li>Commission the display typeface (custom Big Shoulders cut?) for a real signature wordmark.</li>
            <li>Build out: pitch-deck template, proposal template, LinkedIn banner, notebook system.</li>
          </ul>
        </div>
      </DCArtboard>
    </DCSection>
  </DesignCanvas>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
