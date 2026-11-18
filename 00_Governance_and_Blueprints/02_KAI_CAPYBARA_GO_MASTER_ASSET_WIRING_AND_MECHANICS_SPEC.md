# 11 — Kai_Capybara_GO Asset Wiring & v4.2 Mechanics Specification
- Workspace SSOT: Kai_Capybara_GO (1a7u7CiM1Bjo8XEY1iOIyFkRC9H6z_qi0)
- Date: 2026-11-18
- Baseline Engine: Modular Build v4.1.4 (04_Modular_Game_Build) -> Target v4.2

## 1. Asset Standardization & Promotion Summary
- 55/55 Hero Kai Face/Hair Standardization:

  - Promoted 54 approved regenerated sheets (KAI_ACT_01–18, KAI_CMB_01–06, KAI_MAG_01–16, EXP_LINK_01–10, 22, 24, 49, 50) from Regen into 02_New_Combat_and_Magic_VFX (1qwdW_7AJ0b7FN8NQRB_KzlSX82cnsSvL).
  - Regenerated EXP_LINK_21_WORLD_MAP_PATH_DISCOVERY_16F_4x4.png (HUD Kai-Cam Portrait medallions) with beveled mahogany-and-gold frames and full cell-corner BFS alpha stripping (1024x1024 RGBA, 21.08% alpha, 16/16 cells, ACVE PASS).
  - Archived 63 superseded/duplicate files non-destructively into 99_Archive (19QJ6UAbpFfx5iBd6NdM5xW43MpeMjI3d).

- Important Naming Separation (Status Expressions vs. Lesson Mechanics):

  - Because the 55-sheet regen batch used EXP_LINK_01–10 and 22 for Python lesson & campfire sheets, the 6 original Hero Kai Status Expression sheets and HUD Kai-Cam Status Portrait sheet in 99_Archive are mapped as dedicated keys for v4.2:
    - KAI_STATUS_BLEED (EXP_LINK_01_KAI_STATUS_BLEED_SCRATCH_BANDAID_WINCE_16F_4x4.png, 17PqpUhPoLcWaezD2mV1Z2XS0SzCvJ3ca)
    - KAI_STATUS_POISON (EXP_LINK_02_KAI_STATUS_POISON_GREEN_QUEASY_NAUSEA_16F_4x4.png, 1DSvvj84dNZqjK4ScuoFCVRUcZ0b8tDlv)
    - KAI_STATUS_CONFUSE (EXP_LINK_03_KAI_STATUS_CONFUSE_DIZZY_SPIRAL_EYES_16F_4x4.png, 1nBM4thY8R7ts-BW8Bpe8aF6neSa2BlFM)
    - KAI_STATUS_FREEZE (EXP_LINK_04_KAI_STATUS_FREEZE_SHIVER_CHATTER_BREATH_16F_4x4.png, 1-iASyzH295gAzzVbbBB3MDmikYaWaVKE)
    - KAI_STATUS_BURN (EXP_LINK_05_KAI_STATUS_STUN_STARS_AND_BURN_SOOT_COUGH_16F_4x4.png, 1QztLOc28i52v4j1UDk-dH3-VAtpOai1v)
    - KAI_STATUS_SILENCE (EXP_LINK_06_KAI_STATUS_SILENCE_HASH_ZIPPER_MUTE_16F_4x4.png, 1tIUWwueu_vtdvDbcRaSvvt5LsdNf8VAE)
    - KAICAM_STATUS (EXP_LINK_22_HUD_KAICAM_PORTRAIT_BLEED_POISON_CONFUSE_FREEZE_16F_4x4.png, 1TiHoitwPBcCj85fIFpvW0vdPeS5tOj24)

## 2. What Was Wired in v4.1.4 vs. What v4.2 Wires
### A. Comic Hit Callouts (VFX_MISC_01–04) — APPROVED
- v4.1.4 Gap: VFX_MISC_01–04 were mapped in vfx_particle_renderer_v4_1.js but omitted from embedded_sprites_v4_1.json (so nothing drew in Canvas), and bang was never called in combat_event_chain_v4_1.js.
- v4.2 Wiring: Embed all 4 sheets in Canvas and trigger:
  - VFX_MISC_01 (CRITICAL!): isCrit === true
  - VFX_MISC_02 (POW!): Normal melee (ironsword, forge_hammer, twin_blade)
  - VFX_MISC_03 (BANG!): Ranged spells (flying_dagger, starlight, lightning, water) & enemy projectile impacts
  - VFX_MISC_04 (BOOM!): 100% Rage KAI_MAG_16 Ultimate, fire Meteor, Day-60 Boss Shatter
### B. Stage-Locked Roadside Props & Clickable Street Pickups — APPROVED
- Biome-Locked Props:
  - VFX_MISC_25 (Wishing Well): Ch. 1 & Ch. 6 (20 Gold -> random HP/Shield/Rage blessing)
  - VFX_MISC_26 (Lotus Shrine): Ch. 1 & Ch. 5 (cleanse debuffs + +80 Shield)
  - VFX_MISC_24 (Grandma Looma's Loom): Ch. 2 & Ch. 4 (weave Python variables for +5% DR)
  - VFX_MISC_23 (Forge Anvil): Ch. 3 & Ch. 9 (spawns on stage during 🔨 Forge or roadside temper)
  - VFX_MISC_22 (Veggie Campfire): Ch. 2, 4, 7, 8 (triggers KAI_ACT_11 + VFX_MISC_38)
- Clickable Street Pickups: Spawn VFX_MISC_30 (Crate/Barrel), VFX_MISC_48 (Heart/Mana/Gold Orbs), or VFX_MISC_29 (Bounce Spring) on the road during exploration; clicking them awards Gold/HP/Day-skip with VFX_MISC_35 coin fountain.
### C. Per-Status Enemy Attacks, ENM_BOSS_59 Projectiles & Afflictions — VALIDATED
- 3-Step Combat Rule:
  - Telegraph: Every 2nd Minion turn (every Boss turn) opens EXP_LINK_27 Golden Colon : Parry Window.
  - Parry Check: Success blocks 100% DMG, 0% status, and counters with KAI_CMB_06 (180% ATK).
  - Unparried Hit: Fires chapter-matched ENM_BOSS_59 projectile + VFX_MISC_03 (BANG!) and applies the chapter's signature status (silence Ch. 1/6, poison Ch. 2/5, burn Ch. 3/8, bleed Ch. 4/9, freeze Ch. 7/11, confuse Ch. 10/12).
- Per-Status Hero Visuals: Every status simultaneously swaps Hero Kai's body (KAI_STATUS_*), Z-layer overlay (EXP_LINK_14–18), and HUD Kai-Cam (KAICAM_STATUS).
### D. Remaining Unwired Assets Queued for v4.2+
- Track D Paper-Doll (MOD_B01_04, MOD_B08_03–05): Overlay 4-Tier Armor cloaks/hats on Kai.
- Hero Action State Machine (KAI_ACT_01, 03–18): Idle in town, Sprint in Turbo, Dodge on Python Gate skip, Potion/Bao on heal, Pet String/Mantis on click, Chest open, Level-Up.
- Gacha & Boss Stagger (VFX_MISC_31–34, 40 + EXP_LINK_35–42, 48–50 + ENM_BOSS_62): 3-Card Roguelike Skill Draft, Pet Egg Hatching, Boss 3-pip Armor Break, and Chapter Finale High-Five.

## 7. Universal Sprite Sheet & ACVE v3.0 Technical Standards
- Grid & Dimensions: Every 16-FPS sheet is 1024×1024 px RGBA PNG, 4×4 uniform grid (256×256 px per cell), bottom-center pivot (0.5, 1.0).
- Background & Alpha: Generated on #FFFFFF and stripped via cell-corner BFS flood-fill + enclosed-island cleaning (acve_sprite_tool.py --strip-bg --strip-islands --grid 4x4 --verify), ensuring 0 enclosed white corners (critical for circular medallions like EXP_LINK_21 and overlays like EXP_LINK_16/17).
- 12 Canonical Magic Schools & Hex Palettes:
  - Water: #00B4D8 / #0077B6 / #CAF0F8
  - Fire: #FF4500 / #FF8C00 / #FFD700
  - Ice: #48CAE4 / #ADE8F4 / #FFFFFF
  - Lightning: #F72585 / #FEE440 / #00F5D4
  - Wind: #52B788 / #95D5B2 / #D8F3DC
  - Nature: #2D6A4F / #74C69D / #F4A261
  - Starlight: #7209B7 / #4CC9F0 / #FFD166
  - Special / Ouroboros: #D4AF37 / #7C3AED / #FEF08A
  - Earth: #8B5A2B / #C28840 / #FDE68A
  - Lotus (Jing Si): #1F6A38 / #F472B6 / #FEF3C7
  - Chrono: #0F766E / #2DD4BF / #CCFBF1
  - Comment (# Silence/Code): #334155 / #94A3B8 / #E2E8F0
