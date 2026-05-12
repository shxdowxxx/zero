---
session_id: SIZ-20260512-2334
date: 2026-05-12
time: 23:34 UTC
project: Zero (Unblocked Platform)
agent: SessionCloseoutAgent
current_phase: Phase 1 — Visual Design & UI
---

# Gemini Context — Zero Project

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
Zero has no remote repository and no backup. Creating a GitHub repo should be the first
priority at the start of any new session if it has not yet been done.

## Current Visual Design (as of 2026-05-12)
- **Background:** Pure `#000` — dead black, not near-black.
- **Palette:** Monochrome only. No purple, no blue, no neon color accents whatsoever.
- **Glass system:** 5 CSS custom properties drive every surface:
  `--glass-bg`, `--glass-bg-hover`, `--glass-border`, `--glass-border-hover`, `--glass-high`
  All components use `backdrop-filter: blur()` + semi-transparent white fill + subtle white border.
- **Text hierarchy:** `#fff` (primary) → `rgba(255,255,255,.82)` (secondary) → `rgba(255,255,255,.28)` (muted)
- **Fonts:** Inter (primary body), JetBrains Mono (monospace/labels)
- **CTAs:** White fill + black text, pill shape — only solid elements allowed
- **School splash:** Solid white intentionally — must pass as a real school platform

## Design Rules (Non-Negotiable)
1. No color accents. The director explicitly rejected purple, blue, and neon palettes.
   Any design change must stay within white, silver, and black only.
2. All new surfaces must use the existing glass CSS variables. No solid dark panels.
3. Font is Inter. Do not introduce alternate fonts without director approval.
4. Proxy requires HTTPS — service workers do not work on `file://`.
5. Use the Agentiz inline-iframe proxy pattern. Never navigate the top-level page for proxy.

## Proxy Stack Reference (Proven in Agentiz)
- UV v3.2.10 + epoxy-transport v3.0.1 + bare-mux v2.1.9 (all from jsDelivr)
- Railway bare server: `https://balanced-amazement-production-c715.up.railway.app/`
- UV config uses `Ultraviolet.codec.xor` — not any KoopBin alias
- All proxy navigation via inline iframe — never `window.location.href`

## Outstanding Blockers (as of 2026-05-12)
- No GitHub repo (no backup)
- No S3 deployment (proxy untested — needs HTTPS)
- UV proxy not confirmed working end-to-end in browser
