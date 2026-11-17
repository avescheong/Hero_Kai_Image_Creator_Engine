# Hero Kai & Scrolls of Pythonia — Portable Autonomous Image Engine (`Hero_Kai_Image_Engine`)

A self-contained, GitHub-ready character consistency, prompt compilation, modular paper-doll compositing, and sprite verification engine for **Hero Kai: Scrolls of Pythonia**.

Open this folder in any AI agent workspace (Antigravity, Gemini CLI, Claude Code, Cursor, or Copilot), and the agent automatically inherits all locked character DNA, negative sibling-disambiguation rules, local reference sheets, and ACVE verification gates via [`AGENT.md`](AGENT.md) without needing repeated explanation.

---

## Key Highlights

- **140 / 140 Sealed Production Sprite Sheets (`2,213` Verified Cells)** across 4 game formats:
  - `05_generated_packs/01_RPG/`: **60 sheets** (20 Track A HD-2D Core + 40 Track D Modular Paper-Doll & 32-Stance Socket Rig)
  - `05_generated_packs/02_SRPG/`: **40 sheets** (Track B *Final Fantasy Tactics* `2:1` Isometric SRPG)
  - `05_generated_packs/03_Capybara/`: **40 sheets** (Track C *Capybara Go!* `2.2H` Chibi Roguelite Auto-Battler)
- **10 Unified Genome v4.0 Character Locks (`01_character_genomes/`)**:
  - `kai`, `string`, `wizard`, `grandma_looma`, `blacksmith`, `master_grimsby`, `bug_king`, `spell_guardian`, `supporting_npcs_and_spirits`, and `lyra_syntax_archivist` (Ch. 14 5-Sheet MVC pilot).
- **Offline Portable Reference Anchors (`02_reference_anchors/`)**:
  - Original turnaround sheets, equipment callouts, Storybook cast portraits/scenes, size comparison chart, Tzu Chi emblem, and Character Bibles bundled locally with `drive_id_to_local_path_map.json`.
- **Zero-Regeneration Modular Paper-Doll Architecture**:
  - Composite 240+ modular weapons, outfits, hats, scarves, belts, backpacks, and VFX onto sealed unarmed mannequins (`MOD_B01_01`–`MOD_B01_04`) using `kai_engine_cli.py composite`.
- **11-Gate ACVE v3.0 Post-Processing (`acve_kai_verifier_v3.py` & `acve_sprite_tool_v2.py`)**:
  - Automatic caption stripping, border-seeded BFS alpha extraction (preserving interior cream/white pixels like Kai's `#F4EFE6` tunic and Wizard's `#F2F4F7` beard), enclosed white-island stripping, anatomical ROI checks, and SHA-256 sealing — works out of the box with `Pillow` + `numpy` (no `scipy` required).

---

## Quick Start

### 1. Install Minimal Dependencies
```bash
pip install -r requirements.txt
```

### 2. Verify Portable Engine Integrity
```bash
python kai_engine_cli.py status
python kai_engine_cli.py list-characters
```

### 3. Inspect Locked DNA & Local Reference Images for Any Character
```bash
python kai_engine_cli.py character-info --id kai
python kai_engine_cli.py character-info --id master_grimsby
```

### 4. Compile a Deterministic, Signed Generation Ticket
```bash
python kai_engine_cli.py compile-ticket \
  --character kai \
  --track track_c_chibi \
  --outfit adventure_ironsword \
  --action "Casting Water Hydro Stream spell across 16 cells" \
  --out tickets/kai_water_ticket.json
```

### 5. Onboard a Brand-New Character in Strictly 5 Sheets (Zero Gear Regeneration)
```bash
python kai_engine_cli.py onboard-mvc \
  --genome lyra_syntax_archivist \
  --out tickets/lyra_mvc_5_sheet_manifest.json
```

### 6. Composite Modular Gear onto Sealed Mannequins (0% AI Drift)
```bash
python kai_engine_cli.py composite \
  --base 05_generated_packs/01_RPG/MOD_B01_02_KAI_SOCKET_MANNEQUIN_COMBAT_AND_CODING_4x4.png \
  --overlay 05_generated_packs/01_RPG/MOD_B03_01_KAI_PAPERDOLL_HOODIE_AND_MOSS_CLOAK_4x4.png \
  --overlay 05_generated_packs/01_RPG/MOD_B02_01_MODULAR_SWORDS_AND_BLADES_ARSENAL_4x4.png \
  --out output/KAI_COMPOSITED_4x4.png
```

### 7. Verify & Auto-Clean Generated or Composited Sprite Sheets
```bash
python kai_engine_cli.py verify \
  --input output/KAI_COMPOSITED_4x4.png \
  --output output/KAI_VERIFIED_4x4.png \
  --character kai \
  --clean-captions \
  --strip-islands
```

---

## Interactive Visual Tools (`02_inspector_and_tools/`)

Launch the live server with one command (or double-click the HTML files directly):
```bash
python kai_engine_cli.py dashboard
```
- [`02_inspector_and_tools/ANIMATED_ASSET_DASHBOARD.html`](02_inspector_and_tools/ANIMATED_ASSET_DASHBOARD.html) — Full-Resolution Live Animated Gallery (`140/140` sheets), Row/FPS Loop Inspector with ACVE BBox overlay, 32-Stance Paper-Doll Rig, 10 Character DNA cards, and Playable 16×8 RPG Stage.
- [`02_inspector_and_tools/PYTHONIA_ASSET_DASHBOARD_V2.html`](02_inspector_and_tools/PYTHONIA_ASSET_DASHBOARD_V2.html) — 140-Sheet Approval Gallery, Live 32-Stance Kinematic Socket Rig Simulator, and Gap Audit.
- [`02_inspector_and_tools/PYTHONIA_SPRITE_AND_ANIMATION_INSPECTOR.html`](02_inspector_and_tools/PYTHONIA_SPRITE_AND_ANIMATION_INSPECTOR.html) — Interactive Sprite Atlas Player & 16×8 RPG Test Stage.

---

## Repository Layout

- [`AGENT.md`](AGENT.md) — Canonical AI & developer governance rules
- [`HANDOVER_CURRENT.md`](HANDOVER_CURRENT.md) — Current checkpoint & next milestones
- [`ASSET_INVENTORY_INDEX.md`](ASSET_INVENTORY_INDEX.md) — Complete folder & track index
- [`kai_engine_cli.py`](kai_engine_cli.py) — Unified CLI entrypoint
- `00_KAI_ENGINE_SDK/` — Hero Kai v4.0 genome, ticket compiler, compositor, ACVE v3.0 verifier
- `00_governance_and_plans/` — Architectural blueprints & 140-sheet seal manifest
- `01_character_genomes/` — 10 unified v4.0 character genomes & 32-stance socket schemas
- `02_reference_anchors/` — Self-contained local turnaround sheets, cast portraits, bibles & Drive ID map
- `02_inspector_and_tools/` — HTML5 interactive dashboard & sprite inspector
- `03_graphics_adapters/` — Multi-track batch prompt compilers (Tracks A, B, C, D & v2.0 MVC)
- `04_postprocess_and_acve/` — ACVE v1.0 & v2.0 verifiers
- `05_generated_packs/` — 140 sealed PNG sheets + JSON atlases (`01_RPG/`, `02_SRPG/`, `03_Capybara/`)
