# Export Chaos Chart

_Started 2026-05-21 17:00 UTC_

---

## User

Can you export the Chaos Over Primary Stacked on Bone as a JPEG so I can import it into a document?

## User

Based on the ChaosOver brand book, create me a landing page for ChaosOver in full branding with subtle movements in the background. It should just say the name of the company, ChaosOver, and a subtle, almost cryptic tagline.

## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: write_file]_

_[tool: done]_

Landing page is up at `websites-v3/Landing.html` — full ChaosOver branding (stacked wordmark with the –39° lime strikes, the lime dot, JetBrains meta strip and footer) on the bone ground.

Subtle motion:
- Two oversized radial gradient layers drift + breathe on opposing 38s / 52s loops behind everything
- Fine SVG grain shimmers in tiny steps
- The wordmark rises in, then the lime strikes draw across, then the dot pops and softly breathes
- Slight mouse parallax on the hero (±5px, damped) so it feels anchored but alive

Tagline: **"The pattern was always there."** — cryptic, on-brand. Easy to swap if you want something else (a few alternates I considered: *"Notice the pattern."* / *"Something was already running."* / *"Order, on purpose."*).

_[tool: fork_verifier_agent]_

Human: [Auto-continued: please continue]

## User

Can you create this file as a downloadable zip, so the HTML, any CSS and JavaScript associated with it, so I can upload to a host.

## Assistant

_[tool: run_script]_

_[tool: present_fs_item_for_download]_

Zipped and ready above. Contains:

- `index.html` — the landing page
- `co-soft.css` — brand tokens it depends on

Fonts load from Google Fonts CDN, so just upload both files to your host root and it'll work.

