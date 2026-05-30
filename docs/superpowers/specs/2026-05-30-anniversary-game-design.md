# 6 Years of Us — Anniversary Game Design

**Date:** 2026-05-30
**Type:** Browser-based 2D platformer (gift for Mae from Jez)
**Engine:** Phaser.js 3
**Art:** Kenney New Platformer Pack + custom SVG sprites

---

## Overview

A short 2D platformer love story telling the 6-year journey of Jez and Mae — a WLW couple who met online during COVID. The game alternates between playable platformer levels and animated cutscenes, ending on a cliffhanger proposal moment. Runs entirely in the browser, shareable as a link.

---

## Characters

### Jez (Player 1)

- **Style:** Kenney astronaut blob — round body, dark helmet ring, small dot eyes, smile
- **Color:** Pink (`#FF6B9D`)
- **Accessory:** Pink bow on top of helmet
- **Role:** Primary playable character in solo levels

### Mae (Player 2)

- **Style:** Identical Kenney blob
- **Color:** Purple (`#A855F7`)
- **Accessory:** Star on top of helmet
- **Role:** Goal/companion in early levels; co-playable in later levels

---

## Gameplay Loop

Each chapter is one of three types:

- **Cutscene** — animated HTML overlay, auto-plays, click/tap to advance panels
- **Playable** — Phaser.js level: run, jump, collect items, reach the goal
- **Cliffhanger** — special final cutscene with dramatic reveal

Between chapters: a chapter select / world map screen showing progress dots.

---

## Chapters

### Chapter 1 — Quarantine Quest *(Cutscene)*

- Two glowing screens in a dark room, chat bubbles floating between them
- Hearts appear as messages arrive
- Tone: cozy, warm, nostalgic
- Setting: 2020, COVID, online

### Chapter 2 — First Flight *(Playable)*

- Jez runs through an airport level (moving walkways as platforms)
- Collect: boarding passes, heart stickers
- Goal: reach Mae at the arrivals gate holding a welcome sign
- Setting: Mindanao → Manila airport

### Chapter 3 — The Baguio Quest *(Playable)*

- Both characters run together — Jez is player-controlled, Mae follows as an AI companion
- Environment: pine forest, mountain paths, Burnham Park boating area
- Collect: strawberries, flowers (Baguio staples)
- Tone: bright, adventurous — the "first quest"
- Setting: Baguio City

### Chapter 4 — Long Distance *(Cutscene)*

- Animated map of the Philippines
- Two blinking dots: Manila and Mindanao
- Love letters and emoji float slowly between the dots
- A days-apart counter ticks up
- Setting: LDR period after Baguio

### Chapter 5 — The Grind *(Playable)*

- Auto-runner: Jez on left half, Mae on right half of screen
- Each collects coins, dodges bills and stress clouds
- Shared "Manila Fund" progress bar at top fills as coins collected
- Level ends when bar is full
- Setting: working hard, saving money

### Chapter 6 — Manila, Finally *(Playable)*

- City platformer level: apartments, food stalls, date spots
- Both characters run together through the city
- Collect: apartment keys, ramen bowls, shared memory photos
- Longest and most varied level — the "everyday quest" chapter
- Setting: Manila, living together

### Chapter 7 — A Blink of an Eye *(Cutscene)*

- Six memory "frames" flash by, one per year
- Heart counter ticks up: 1 → 2 → 3 → 4 → 5 → 6
- Sparkles fill the screen
- Final text: "And just like that…"
- Setting: present day, 6-year anniversary

### Chapter 8 — The Final Quest *(Cliffhanger)*

- Golden glowing level, mysterious atmosphere
- Mae walks toward a glowing chest at the end
- Chest opens — a ring slowly floats out, spinning
- Music swells, screen fades to black
- Text appears: `???` then `To be continued…`
- Setting: Year 7 — unknown

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Game engine | Phaser.js 3 |
| Cutscene overlays | Vanilla JS + HTML/CSS |
| Art assets | Kenney New Platformer Pack (CC0) |
| Custom sprites | SVG (Jez & Mae blobs) |
| Deployment | Static files — no backend, open `index.html` or host on any static host |
| State | In-memory (no save needed — short game, ~10 min playthrough) |

---

## Screen Flow

```text
Title Screen
    ↓
Chapter 1 (Cutscene)
    ↓
Chapter 2 (Playable)
    ↓
Chapter 3 (Playable)
    ↓
Chapter 4 (Cutscene)
    ↓
Chapter 5 (Playable)
    ↓
Chapter 6 (Playable)
    ↓
Chapter 7 (Cutscene)
    ↓
Chapter 8 (Cliffhanger)
    ↓
Black screen — "To be continued…"
```

---

## Art & Audio

- **Tiles/backgrounds:** Kenney New Platformer Pack (grass, city, mountain, airport variants)
- **Characters:** Custom SVG blobs (Jez pink, Mae purple)
- **Music:** Royalty-free chiptune/lofi tracks per chapter mood (upbeat for playable, slow for cutscenes)
- **SFX:** Kenney Audio pack (jump, collect, complete)

---

## Out of Scope

- Save/load system
- Mobile touch controls (desktop keyboard first)
- Multiplayer / two-controller co-op
- Backend / leaderboards
