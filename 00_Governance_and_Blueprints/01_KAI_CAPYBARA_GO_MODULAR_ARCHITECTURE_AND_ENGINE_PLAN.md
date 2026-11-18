# 01 — Kai_Capybara_GO Modular Architecture & Engine Blueprint (v4.2)
## 1. Architectural Philosophy
Kai_Capybara_GO uses a decoupled, non-monolithic HTML5/CSS/JS architecture in 04_Modular_Game_Build/ (1TmUjoF3S6JsbKG1zpOBIg9XGUZHreeUP) so every subsystem loads deterministically with zero black-screen failures.

## 2. Canonical Directory & Module Tree (04_Modular_Game_Build/)
`
04_Modular_Game_Build/
├── index_v4_2.html                        # Dual-viewport shell (Top Stage Canvas + Bottom Log/HUD + Modals)
├── css/
│   ├── capybara_studio.css                # 9-slice parchment/dark themes, choice chips, drawers
│   └── animations.css                     # UI badge popups, card flip transitions, damage shake keyframes
├── js/
│   ├── main_v4_2.js                       # Bootstrapper, asset preloader, 60fps rAF loop, canvas click hit-testing
│   ├── config_and_manifests_v4_2.js       # 4x4 (256x256) lookup tables, 12 Magic Schools, 64+ Skills, Gear & Veg Food DB
│   ├── state_and_save_v4_2.js             # Reactive GameState, localStorage auto-save, JSON Export/Import, Wiki Bridge
│   ├── stage_parallax_engine_v4_2.js      # 1280x720 4-layer biome scroller, lighting states, 8-layer Z-Sandwich rig
│   ├── sprite_16fps_engine_v4_2.js        # 16-FPS Sakuga non-linear frame clock, bottom-center pivot (0.5, 1.0)
│   ├── combat_event_chain_v4_2.js         # Deterministic turn-based event-chain resolver, Parry (KAI_CMB_06), Status Matrix
│   ├── vfx_particle_renderer_v4_2.js      # Bezier trajectories, translucent Z=1/Z=7 shields, hit callouts, AoE runes
│   ├── day60_story_engine_v4_2.js         # 11-Chapter x 60-Day scheduler, stage-locked props, Jing Si Shrine buffs
│   ├── python_code_terminal_v4_2.js       # Interactive Python mini-challenges (unlocks Chests, Walls, Boss Weaknesses)
│   ├── roguelite_draft_modal_v4_2.js      # 3-Card Skill Draft (VFX_MISC_31–34)
│   └── equipment_and_pets_drawer_v4_2.js  # Paper-Doll MOD_B08_04 4-Tier Armor, String/Mantis pets, 05_Kai_Wikipedia import
└── assets/
├── status/                            # 7 recovered status sheets from 99_Archive (KAI_STATUS_* + KAICAM_STATUS)
└── ...                                # Symlinked or copied from 01_Sealed_Chibi_Assets & 02_New_Combat_and_Magic_VFX
`
## 3. Core Rendering & Timing Contracts
### 3.1 8-Layer Z-Sandwich Compositing Order (Per Frame)
- Z=0 (Biome & Ground): BIOME_01..10_16x9.png parallax layers + ground AoE runes (MAGIC_B03_*).
- Z=1 (Back Aura / Ground Pool): Translucent status pools (EXP_LINK_14 Poison Pool) & back-half magic rings rendered at globalAlpha = 0.72 behind Kai.
- Z=2 (Stage Props & Pickups): Stage-locked roadside props (VFX_MISC_22–26) & clickable street pickups (VFX_MISC_29, 30, 48).
- Z=3 (Characters & Pets): Hero Kai (KAI_ACT_*, KAI_CMB_*, KAI_MAG_*, or KAI_STATUS_* when afflicted), String (#D89B4C), Baby Mantis (#2ECC71), and ENM_BOSS_*.
- Z=4 (Paper-Doll Socket Overlays): MOD_B08_04 4-tier armor/weapon overlays + EXP_LINK_16 subtle cheek band-aid when Bleeding.
- Z=5 (Front Orbit & Status Overlays): EXP_LINK_17 Fire-only Burn Orbit Ring, EXP_LINK_18 Frost Rim, EXP_LINK_15 Silence/Confuse halos.
- Z=6 (Projectiles & Weapon Arcs): ENM_BOSS_59 archetype projectiles, CG_VFX_01–02, MAGIC_B02_*.
- Z=7 (Foreground Callouts & HUD Cam): VFX_MISC_01–04 (CRITICAL!, POW!, BANG!, BOOM!) + top-left EXP_LINK_21 / KAICAM_STATUS medallion.
### 3.2 Sakuga Non-Linear Frame Pacing
Instead of a flat 62.5 ms tick across all 16 frames, sprite_16fps_engine uses variable hold weights:

- Frames 01–04 (Anticipation): 55 ms/frame (coiled wind-up)
- Frames 05–08 (Impact / Strike): 42 ms/frame with +18 ms hit-stop freeze on Frame 06/07
- Frames 09–12 (Follow-Through): 65 ms/frame
- Frames 13–16 (Recovery): 75 ms/frame easing back to Idle
### 3.3 05_Kai_Wikipedia JSON Bridge
state_and_save_v4_2.js and equipment_and_pets_drawer_v4_2.js support 1-click JSON import/export compatible with 05_Kai_Wikipedia (19Jcq4Zku3OrD9a6nv_CBKrP-oWtl0zL8) so students can port their Skill Tree and Loadout between the wiki and the playable build.
