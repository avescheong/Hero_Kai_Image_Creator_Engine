# ANTIGRAVITY HANDOVER — Kai_Capybara_GO (v4.2 FINAL RELEASED)
Notice: All enemies face LEFT toward Hero Kai (ENM_BOSS_06 and ENM_BOSS_01 flipped per-cell, flipX = false default in sprite_16fps_engine_v4_2.js).
Project: Hero Kai: Scrolls of Pythonia — Capybara Go! Edition (Kai_Capybara_GO)
Handoff Date: 2026-11-18
Canonical Asset Seal: 55/55 Hero Kai 16-FPS Sheets SEALED (incl. alpha-cleaned EXP_LINK_21) · 280 Total PNGs Verified

## 1. Folder Structure (When Downloaded Locally)
`
Kai_Capybara_GO/
├── 01_Sealed_Chibi_Assets/         # 48 PNGs (Track C CG_B01..B08 + Track D Paper-Doll MOD_B01/B08)
├── 02_New_Combat_and_Magic_VFX/    # 202 16-FPS 4x4 PNGs (1024x1024) + 10 Biomes (1280x720) + 20 Base VFX
├── 03_Inspector_and_Dashboards/    # HTML Review Dashboards (incl. MASTER_ASSET_REVIEW_DASHBOARD.html)
└── 99_Archive/                     # Superseded originals + KAI_STATUS_01..06 & EXP_LINK_22 status sheets
`
## 2. Critical Asset Notes for Antigravity
- Sprite Sheet Standard: Every 16-FPS sheet in 02_New_Combat_and_Magic_VFX is 1024x1024 RGBA (4x4 grid, 256x256 per cell, bottom-center (0.5, 1.0) pivot).
- EXP_LINK_21 Alpha Fix: EXP_LINK_21_WORLD_MAP_PATH_DISCOVERY_16F_4x4.png (SHA-256 f09207b8...) has been cell-corner BFS alpha-stripped so circular portrait medallions render cleanly with transparent corners.
- Status Expression Sheets (Recover from 99_Archive into assets/status/): When wiring v4.2 status afflictions, copy these 7 sheets from 99_Archive/ into 04_Modular_Game_Build/assets/status/ so they don't collide with EXP_LINK_01–10 lesson sheets:
  - KAI_STATUS_BLEED <- EXP_LINK_01_KAI_STATUS_BLEED_SCRATCH_BANDAID_WINCE_16F_4x4.png
  - KAI_STATUS_POISON <- EXP_LINK_02_KAI_STATUS_POISON_GREEN_QUEASY_NAUSEA_16F_4x4.png
  - KAI_STATUS_CONFUSE <- EXP_LINK_03_KAI_STATUS_CONFUSE_DIZZY_SPIRAL_EYES_16F_4x4.png
  - KAI_STATUS_FREEZE <- EXP_LINK_04_KAI_STATUS_FREEZE_SHIVER_CHATTER_BREATH_16F_4x4.png
  - KAI_STATUS_BURN <- EXP_LINK_05_KAI_STATUS_STUN_STARS_AND_BURN_SOOT_COUGH_16F_4x4.png
  - KAI_STATUS_SILENCE <- EXP_LINK_06_KAI_STATUS_SILENCE_HASH_ZIPPER_MUTE_16F_4x4.png
  - KAICAM_STATUS <- EXP_LINK_22_HUD_KAICAM_PORTRAIT_BLEED_POISON_CONFUSE_FREEZE_16F_4x4.png
- Regenerated Status Overlay Sheets: EXP_LINK_16 is the small hair band-aid + crimson drops (rendered at kaiY - 28) and EXP_LINK_17 is the small top-of-head fire flame (rendered at kaiY - 56). Both have been regenerated and ACVE alpha-cleaned in 02_New_Combat_and_Magic_VFX.

## 3. v4.2 Implementation Checklist (Next Build)
- [COMPLETED IN v4.2] Embed & Wire Comic Hit Callouts (VFX_MISC_01–04):
  - Add VFX_MISC_01 (CRITICAL!), 02 (POW!), 03 (BANG!), 04 (BOOM!) to embedded_sprites.
  - In combat_event_chain, call triggerHitCallout("bang") on ranged spells (flying_dagger, starlight, lightning, water) and enemy projectile hits.
- [COMPLETED IN v4.2] Stage-Locked Props & Clickable Street Pickups:
  - Lock VFX_MISC_25 (Well) to Ch. 1/6, 26 (Lotus Shrine) to Ch. 1/5, 24 (Loom) to Ch. 2/4, 23 (Anvil) to Ch. 3/9, 22 (Campfire) to Ch. 2/4/7/8.
  - Add canvas click hit-testing in main / sprite_16fps_engine for street pickups (VFX_MISC_30 Crate, 48 Energy Orbs, 29 Bounce Spring).
- [COMPLETED IN v4.2] Per-Status Enemy Attacks & Affliction Matrix:
  - Replace the flat 22% random status in combat_event_chain_v4_1.js with chapter-archetype statuses (silence Ch. 1/6, poison Ch. 2/5, burn Ch. 3/8, bleed Ch. 4/9, freeze Ch. 7/11, confuse Ch. 10/12).
  - Map ENM_BOSS_59 projectile rows per archetype, wire KAI_CMB_06 on successful triggerParry(), and render the matching KAI_STATUS_* + EXP_LINK_14–18 + KAICAM_STATUS layers.
- Remaining Unwired Pools:
  - Wire KAI_ACT_01, 03–18 action states, Track D Paper-Doll 4-Tier Armor (MOD_B08_04), Gacha 3-Card Skill Draft (VFX_MISC_31–34), and Boss 3-pip Stagger (EXP_LINK_36, 40).
- Final Local Verification Step: Ensure status expression sheets are copied into assets/status/ and perform local playtesting via python3 -m http.server 8080 for Antigravity verification.

## 4. Verification Commands
`
node --check 04_Modular_Game_Build/js/*.js
python3 -m http.server 8080  # Test modular build locally with all 212+ PNGs
`
