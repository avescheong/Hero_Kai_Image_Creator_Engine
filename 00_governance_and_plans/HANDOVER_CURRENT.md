# Hero Kai: Scrolls of Pythonia — Current Handover (`HANDOVER_CURRENT.md`)

- **Checkpoint ID**: `CHK-PYTHONIA-V2-PORTABLE-GITHUB-20261117`
- **Previous Seal Baseline**: `CHK-PYTHONIA-V2-SEALED-140-20261117`
- **Repository Root**: `Hero_Kai_Image_Engine` (Portable Autonomous Multi-Character Image Consistency Engine)
- **Canonical Seal Status**: **140 / 140 Sprite Sheets (`2,213` Cells) APPROVED & CANONICAL_SEALED** (ACVE v2.0 PASS, 37 sheets surgically white-spot stripped across Rounds 1 & 2, 0 enclosed background white islands remaining).
- **Seal Manifest**: [`00_governance_and_plans/CANONICAL_SEAL_140_SHEETS_MANIFEST.json`](CANONICAL_SEAL_140_SHEETS_MANIFEST.json)

---

## 1. Verified State of This Portable Engine

1. **All 4 Production Tracks (`140 / 140` Sheets, `2,213` Cells)** are sealed and organized by game type in `05_generated_packs/`:
   - `05_generated_packs/01_RPG/`: **60 sealed PNG sheets** (`20` Track A HD-2D Core + `40` Track D Modular Paper-Doll & Socket Equipment) + `78` companion/audit JSONs (`138` files).
   - `05_generated_packs/02_SRPG/`: **40 sealed PNG sheets** (Track B Final Fantasy Tactics `2:1` Isometric Tactical SRPG) + `49` companion/audit JSONs (`89` files).
   - `05_generated_packs/03_Capybara/`: **40 sealed PNG sheets** (Track C *Capybara Go!* `2.2H` Chibi Roguelite Auto-Battler) + `49` companion/audit JSONs (`89` files).
2. **All Character Genomes Upgraded to Schema v4.0 (`01_character_genomes/`)**:
   - Unified v4.0 + v3.0 backward-compatible JSON genomes for `kai`, `string`, `wizard`, `grandma_looma`, `blacksmith`, `master_grimsby`, `bug_king`, `spell_guardian`, `supporting_npcs_and_spirits`, and `lyra_syntax_archivist`.
   - Zero-Regeneration 5-Body-Archetype & 32-Stance Kinematic Socket LUT in `01_character_genomes/universal_character_onboarding_schema_v2.json`.
3. **Self-Contained Local Reference Anchors (`02_reference_anchors/`)**:
   - Canonical turnaround sheets, equipment callouts, Storybook cast portraits/stage scenes, size comparison chart, Tzu Chi lotus emblem, and Character Bibles bundled locally with `02_reference_anchors/drive_id_to_local_path_map.json`.
4. **Autonomous CLI & Portable SDK (`kai_engine_cli.py`, `00_KAI_ENGINE_SDK/`, `03_graphics_adapters/`, `04_postprocess_and_acve/`)**:
   - Single-command workflow (`status`, `list-characters`, `character-info`, `compile-ticket`, `onboard-mvc`, `composite`, `verify`).
   - All `/working_dir/...` hardcoded paths removed; `scipy`-free pure-NumPy connected-components fallback built into `acve_kai_verifier_v3.py` and `acve_sprite_tool_v2.py`.
5. **Interactive HTML5 Visual Tools (`02_inspector_and_tools/`)**:
   - `PYTHONIA_ASSET_DASHBOARD_V2.html` (140-sheet gallery + live 32-stance socket rig simulator).
   - `PYTHONIA_SPRITE_AND_ANIMATION_INSPECTOR.html` (interactive atlas player & 16×8 RPG test stage).

---

## 2. Recommended Next Execution Milestones

1. **Pilot Test the v2.0 5-Sheet MVC Pipeline on a New Character (`Lyra the Syntax Archivist`)**:
   - Run `python kai_engine_cli.py onboard-mvc --genome lyra_syntax_archivist --out tickets/lyra_mvc_manifest.json` (or inspect `05_generated_packs/01_RPG/sample_lyra_mvc_5_sheet_manifest.json`).
   - Generate `MVC_01` (`16:9` turnaround) first, lock it as the visual anchor, then generate `MVC_02`–`MVC_05` (`4x4` HD-2D Exploration, HD-2D Combat/Coding, FFT Isometric, Capybara Chibi) and verify via `python kai_engine_cli.py verify --clean-captions --strip-islands`.
2. **Execute Phase A of `00_governance_and_plans/PYTHONIA_MAGIC_VFX_AND_CAPYBARA_GO_MASTER_BLUEPRINT.md`**:
   - **Batch 1 (`CG_VFX_01`–`CG_VFX_05`)**: 5 *Capybara Go!* Chibi combat VFX sheets (Flying Daggers/Spears, Sword Chi/Falling Swords, Defense Shields/Counter/Dodge, Status Effect loops, Chibi Elemental Strikes).
   - **Batches 2–4 (`MAGIC_B01`–`MAGIC_B03`)**: 15 Hero Magic Casting, Projectile, and Multi-Tile AoE sheets across all 12 Elemental & Pythonic Schools.
3. **Retro-Check Supporting NPCs (`supporting_npcs_genome.json`) & Wire 32-Stance LUT into Game Engines**:
   - Promote secondary NPCs (e.g., *Grandma Looma*, *Spell Guardian*) to Tier 2 (`MVC-2`) or Tier 1 (`MVC-5`) playable companions as needed.
   - Consume `01_character_genomes/universal_character_onboarding_schema_v2.json` in `Hero_Kai_Mini_Project_PYGameStudio` and *Capybara Go!* web builds.
