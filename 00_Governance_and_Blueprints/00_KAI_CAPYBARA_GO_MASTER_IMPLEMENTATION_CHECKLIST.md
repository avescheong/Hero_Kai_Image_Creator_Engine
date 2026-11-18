# 00 — Kai_Capybara_GO Master Implementation Checklist (v1.0 -> v4.2)
- Project: Hero Kai: Scrolls of Pythonia — Capybara Go! Edition (Kai_Capybara_GO)
- Authority: HA-L5-CHL (Cheong Hon Loong)
- Active SSOT Root: Kai_Capybara_GO (1a7u7CiM1Bjo8XEY1iOIyFkRC9H6z_qi0)
- Read-Only Upstream: 001_Kai_Assets (1vLC13sHopidqHhvoQZFQxuNWXLDC8gjg) — NEVER mutate or delete.

## Phase 0–3: Foundation, 202+ Asset Production & v4.1.4 Build (COMPLETED)
- CHK-0.1–0.5: Initialized Kai_Capybara_GO canonical folder tree (00–05, 99_Archive), copied 102 base sealed files into 01_Sealed_Chibi_Assets, and sealed agent.md.
- CHK-1.1–1.20: Generated & ACVE-verified 20 base combat/magic VFX sheets (CG_VFX_01–05, MAGIC_B01–B03).
- CHK-2.1–2.6: Built & verified modular HTML5/CSS/JS game engine (v1.0 -> v4.1.4) in 04_Modular_Game_Build.
- CHK-3.1–3.8: Expanded to 202 16-FPS 4x4 sheets (3,232 frames) + 10 1280x720 BIOME_01..10 backdrops (KAI_ACT_01–18, KAI_CMB_01–06, KAI_MAG_01–16, VFX_MISC_01–50, ENM_BOSS_01–60 + 61–62, EXP_LINK_01–50).
- CHK-3.9: Regenerated & ACVE-sealed all 55 Hero Kai 16-FPS sheets matching CG_B01_01 face/hair; cell-corner BFS alpha-stripped EXP_LINK_21 (f09207b8...); regenerated EXP_LINK_16 (subtle cheek band-aid) and EXP_LINK_17 (fire-only burn orbit ring).
- CHK-3.10: Consolidated 00_Governance_and_Blueprints into this 6-document build-ready suite and archived superseded snapshots to 99_Archive.

## Phase 4: v4.2 Asset Wiring, Mechanics & Polish (READY FOR BUILD)
- CHK-4.1 — Comic Hit Callouts (VFX_MISC_01–04):
  - Embed VFX_MISC_01 (CRITICAL!), 02 (POW!), 03 (BANG!), 04 (BOOM!) in config_and_manifests.
  - Wire triggerHitCallout() in combat_event_chain (ranged spells & enemy projectiles -> BANG!, melee crits -> CRITICAL!, heavy slams -> POW!, Rage/AoE -> BOOM!).
- CHK-4.2 — Stage-Locked Props & Clickable Street Pickups:
  - Lock VFX_MISC_25 (Wishing Well -> Ch. 1, 6), 26 (Lotus Shrine -> Ch. 1, 5), 24 (Loom -> Ch. 2, 4), 23 (Forge Anvil -> Ch. 3, 9), 22 (Campfire -> Ch. 2, 4, 7, 8).
  - Add canvas click hit-testing in main / sprite_16fps_engine for street pickups (VFX_MISC_30 Crate, 48 Energy Orbs, 29 Bounce Spring).
- CHK-4.3 — Per-Status Enemy Attack Matrix & Status Expressions:
  - Replace the flat 22% random status in combat_event_chain_v4_1.js with the Chapter-Archetype Affliction Matrix (Silence Ch. 1/6, Poison Ch. 2/5, Burn Ch. 3/8, Bleed Ch. 4/9, Freeze Ch. 7/11, Confuse Ch. 10/12).
  - Map ENM_BOSS_59 projectile rows per archetype, wire KAI_CMB_06 on successful triggerParry(), and render matching KAI_STATUS_* + EXP_LINK_14–18 + KAICAM_STATUS layers.
  - Recover the 7 status sheets (KAI_STATUS_BLEED/POISON/CONFUSE/FREEZE/BURN/SILENCE + KAICAM_STATUS) from 99_Archive into 04_Modular_Game_Build/assets/status/.
- CHK-4.4 — Remaining Unwired Pools:
  - Wire KAI_ACT_01, 03–18 action states, Track D Paper-Doll 4-Tier Armor (MOD_B08_04), Gacha 3-Card Skill Draft (VFX_MISC_31–34), and Boss 3-Pip Stagger (EXP_LINK_36, 40).
- CHK-4.5 — Build Verification:
  - Run node --check 04_Modular_Game_Build/js/*.js (0 syntax errors).
  - Serve via python3 -m http.server 8080 and verify 0 console errors, 0 missing asset 404s, and working Day 1–60 + Boss + Python Terminal flows.
