---
session_id: SIZ-20260512-2334
date: 2026-05-12
time: 23:34 UTC
project: Zero (Unblocked Platform)
agent: SessionCloseoutAgent
current_phase: Phase 1 — Visual Design & UI
---

# Claude Context — Zero Project

## What Zero Is
Zero is a school filter-bypassing entertainment platform. It provides:
- Browser proxy (UV v3 stack)
- Cloud gaming (Raccoon Game streaming + Lumin SDK fallback)
- Movies (TMDB API + multi-source player)
- Music (Spotify OAuth + playback)
- Videos (YouTube embed)
- Profile and settings

Stack: Vanilla HTML/CSS/JS, no framework, no build step.

## File Locations
- **Windows path:** `C:\Users\itzzz\zero\`
- **WSL path:** `/mnt/c/Users/itzzz/zero/`
- Key files: `index.html`, `style.css`, `app.js`, `sw.js`, `manifest.json`
- Original monolith backup: `indexz.html` (keep until all features confirmed working)
- Context docs: `/home/itzzzshxdow/zero/context/` and `/home/itzzzshxdow/zero/summaries/`
  (tracked in the home git repo, not inside the Windows path)

## No GitHub Repo Yet
Zero has no remote repository. There is no backup. The first priority at the start of any
new session should be asking whether a GitHub repo has been created. If not, create one.

## Current Visual Design (as of 2026-05-12)
- **Background:** Pure `#000` — dead black, not near-black.
- **Palette:** Monochrome only. No purple, no blue, no neon color accents.
- **Glass system:** 5 CSS vars — `--glass-bg`, `--glass-bg-hover`, `--glass-border`,
  `--glass-border-hover`, `--glass-high`. Every surface uses `backdrop-filter: blur()` +
  semi-transparent white fill + subtle white border.
- **Text scale:** `#fff` → `rgba(255,255,255,.82)` → `rgba(255,255,255,.28)`
- **Fonts:** Inter (primary), JetBrains Mono (mono labels)
- **Primary CTAs:** White fill + black text, pill shape
- **School splash:** Intentionally solid white — must look like a real school platform

## What Claude Should Know Before Starting Work

1. **Never add color accents.** The director explicitly rejected purple/blue/neon. If a
   design suggestion involves any color other than white, silver, or black — do not do it.
2. **Glass = the design language.** Every new surface must use the existing glass CSS vars.
   Do not introduce solid dark panels without glass treatment.
3. **Font is Inter.** Do not introduce new fonts without explicit director approval.
4. **Proxy requires HTTPS.** Service workers will not register on `file://`. Always test on
   S3 or GitHub Pages.
5. **Use the Agentiz proxy pattern.** UV v3 + epoxy-transport v3.0.1 + bare-mux v2.1.9 +
   Railway bare server. Inline iframe view — never navigate the top-level page away.
   Railway URL: `https://balanced-amazement-production-c715.up.railway.app/`
6. **Read all three main files together.** `index.html`, `style.css`, and `app.js` must all
   be read before making any changes. They are tightly coupled.

## Proxy Stack Reference (Proven in Agentiz)
- UV v3.2.10 from jsDelivr
- epoxy-transport **v3.0.1** (fixes `headers is not iterable` — do NOT use v2 or KoopBin fork)
- bare-mux v2.1.9
- UV config: `Ultraviolet.codec.xor` (not `AppCodec`)
- SW pattern: `UVServiceWorker`, `sw.route()`, `sw.fetch()`
- Never use `window.location.href` for proxy navigation — inline iframe only
- `sw.bareClient` must be explicitly set to Railway URL

## Outstanding Blockers (as of 2026-05-12)
- No GitHub repo (no backup — critical)
- No S3 deployment (no HTTPS — proxy untested)
- UV proxy end-to-end not confirmed working in browser
- School splash white style must stay intact through future CSS changes
