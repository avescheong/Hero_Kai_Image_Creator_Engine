# Hero Kai: Scrolls of Pythonia — Future Character Expansion, Gap Audit & Zero-Regeneration Governance Blueprint (v2.0)

**Workspace Root (`Kai Asset For RPG`)**: [`https://drive.google.com/drive/folders/1ampGrS0JM8joJjLeULudV8tKjfgFzzO2`](https://drive.google.com/drive/folders/1ampGrS0JM8joJjLeULudV8tKjfgFzzO2)
**Master Continuity Ledger (`AGENT.md`)**: [`https://drive.google.com/file/d/1xiNHc2fJyZfQwkxSea_-UQoNqJEeqSpz/view?usp=drivesdk`](https://drive.google.com/file/d/1xiNHc2fJyZfQwkxSea_-UQoNqJEeqSpz/view?usp=drivesdk)
**Canonical Source Vaults**: [`001_Kai_Assets`](https://drive.google.com/drive/folders/1vLC13sHopidqHhvoQZFQxuNWXLDC8gjg) · [`Story_Website`](https://drive.google.com/drive/folders/1y56ALXDfFmEL8FztXiMuLmyNA3xmCMcc) · [`02_Source_Assets/Characters`](https://drive.google.com/drive/folders/1l1-X7ZW7bPhSxn8WCUHB_P9yoWz-6JRp)
**New v2.0 Engine Upgrades Installed in Drive**:
- [`01_character_genomes/universal_character_onboarding_schema_v2.json`](https://drive.google.com/file/d/1NWculsPec9osEWn8HyAERdXkeF2DG76k/view?usp=drivesdk)
- [`03_graphics_adapters/new_character_onboarding_compiler.py`](https://drive.google.com/file/d/14vDfJGO7D6lPTcBDGyrHd4WrQUbS43Ru/view?usp=drivesdk)
- [`04_postprocess_and_acve/acve_sprite_tool_v2.py`](https://drive.google.com/file/d/11BJHJHRxblgivpo1DriFdEhMtSqMNHST/view?usp=drivesdk)
- [`05_generated_packs/sample_lyra_mvc_5_sheet_manifest.json`](https://drive.google.com/file/d/11RKGD0kjga6G1WSmWThs5vZzjfgC49EY/view?usp=drivesdk)

## 1. Executive Audit of Our 140-Sheet Baseline & The 8 Structural Gaps Identified for Future Expansion

With all **140 / 140 sheets** (`2,213` individual sprite/tile/icon cells) generated and ACVE-verified across **Track A (HD-2D)**, **Track D (Modular Paper-Doll & 32-Stance Matrix)**, **Track B (FFT Isometric SRPG)**, and **Track C (Capybara Go! Chibi Auto-Battler)**, a forensic audit of the current codebase in [`Kai Asset For RPG`](https://drive.google.com/drive/folders/1ampGrS0JM8joJjLeULudV8tKjfgFzzO2) surfaced **8 structural gaps** that would cause asset drift or force redundant regenerations when you add new characters, new chapters (e.g., Loops, Functions, Lists, Classes), or new gear in the future:

| Gap ID | What Exists Today (v1.0 Baseline) | Why It Creates Friction When Expanding | The v2.0 Architectural Solution (Installed Today) |
| :--- | :--- | :--- | :--- |
| **GAP-01: Single-Stance Socket Coordinates** | [`universal_socket_rig_and_stance_schema.json`](https://drive.google.com/file/d/1YyA2wSn5tGJAF5-kTS9U86LDPllIPVHx/view?usp=drivesdk) defines static `(x, y)` socket coordinates only for `Cell 0` (Neutral Idle) of Hero Kai's `4.0H` HD-2D body. | During Sprint (`18°` lean), Jump Apex (`y-20px`), Crouch (`y+18px`), or Prone KO (`90°` horizontal), a static weapon or hat socket floats away from the character's hand/head. | **32-Stance Per-Frame Kinematic Socket LUT (`[dx, dy, d_angle_deg]`)** in [`universal_character_onboarding_schema_v2.json`](https://drive.google.com/file/d/1NWculsPec9osEWn8HyAERdXkeF2DG76k/view?usp=drivesdk) so every attached weapon/hat/cloak follows all 32 poses automatically. |
| **GAP-02: Single Body Proportion Rig** | Socket coordinates were calibrated only for Hero Kai (`140 cm`, `4.0H` Child Hero). | Adding a stout dwarf (`Master Grimsby`), a tall elder (`Great Wizard`), a quadruped pet (`String`), or a 6-limbed raid boss (`Bug King`) causes modular gear to misalign. | **5 Standardized Body Archetype Classes (`ARCHETYPE_A` to `ARCHETYPE_E`)** with pre-calibrated Track A (`HD-2D`), Track B (`FFT`), and Track C (`Chibi`) socket rigs. |
| **GAP-03: Bundled Secondary NPCs** | 8 zone NPCs (`Barnaby`, `Little Girl`, `Forest Spirit`, `Ghost Librarian`, `Goblin`, etc.) are bundled inside [`supporting_npcs_genome.json`](https://drive.google.com/file/d/1R4V0pStjAc5WiAUB68Vb7ZuBaaLLM-Hz/view?usp=drivesdk) with only 4 poses per NPC. | If any secondary NPC (or a new student character) is promoted to a playable companion or party member, they lack an unarmed 32-stance socket mannequin. | **5-Sheet Minimum Viable Character (`MVC`) Onboarding Standard**: Any new playable/companion character is onboarded in **strictly 5 sheets** and reuses 100% of existing modular weapons/armor/icons. |
| **GAP-04: Ad-Hoc Sibling Disambiguation** | Only `Ch. 3 Blacksmith` vs. `Ch. 9 Master Grimsby` and `Bug King` have explicit negative disambiguation locks in [`AGENT.md`](https://drive.google.com/file/d/1xiNHc2fJyZfQwkxSea_-UQoNqJEeqSpz/view?usp=drivesdk). | When adding a 2nd young mage, a 2nd forest spirit, or a new dwarven apprentice, AI generators blend their hair, hats, or beards with existing cast members. | **Mandatory `negative_disambiguation_locks` (`must_never_have`) Field** in Genome v4.0, enforced by [`new_character_onboarding_compiler.py`](https://drive.google.com/file/d/14vDfJGO7D6lPTcBDGyrHd4WrQUbS43Ru/view?usp=drivesdk). |
| **GAP-05: Ad-Hoc Caption Stripping** | During Batches `FFT_B05`, `CG_B04`, `CG_B05`, and `CG_B08`, `image_gen` added small text labels under cells that required custom one-off `scipy.ndimage` scripts before running `acve_sprite_tool.py`. | Running `acve_sprite_tool.py` directly on a captioned sheet lets captions pass Gate 4 occupancy and bake into the final transparent PNG. | **Gate 0 Integrated Connected-Component Caption Stripper (`--clean-captions`)** built directly into [`acve_sprite_tool_v2.py`](https://drive.google.com/file/d/11BJHJHRxblgivpo1DriFdEhMtSqMNHST/view?usp=drivesdk). |
| **GAP-06: Missing Palette Hex Verification** | [`acve_sprite_tool.py`](https://drive.google.com/file/d/1BCXxJ6rZz3RrAfntLkSIwJG1r3w5A3Jf/view?usp=drivesdk) docstring mentions signature color cluster checks, but the v1.0 code only checks `RGBA`, dimensions, BFS alpha, and cell occupancy. | A generated sheet could drift in hair color, eye color, or cloak hex and still pass all 7 structural gates. | **Gate 8 Genome Signature Hex Delta-E Audit (`--hex`)** in [`acve_sprite_tool_v2.py`](https://drive.google.com/file/d/11BJHJHRxblgivpo1DriFdEhMtSqMNHST/view?usp=drivesdk) verifying each locked `#RRGGBB` cluster inside opaque pixels. |
| **GAP-07: Cross-Track Facing & Mirroring Drift** | Track A/D & Track C player units face **Right (`->`)**, Track C Event NPCs & Bosses face **Left (`<-`)**, and Track B FFT uses 4 isometric diagonals (`SE, SW, NW, NE`). | Without a formal facing rule per role, newly added characters get generated facing the wrong direction for auto-battler or tactical encounters. | **Deterministic Role-to-Facing Matrix** locked into the compiler (`PLAYER_PARTY -> Right`, `EVENT_NPC / BOSS -> Left`, `FFT_UNIT -> SE/SW/NE/NW`). |
| **GAP-08: Drive Version Sprawl** | Uploading updated `AGENT.md` files via `drive:create_file` created 18 historical `AGENT.md` copies in [`Kai Asset For RPG`](https://drive.google.com/drive/folders/1ampGrS0JM8joJjLeULudV8tKjfgFzzO2), plus stale section sub-headers (`45 Sheets`, `85 Completed`). | Future agents searching Drive by title `AGENT.md` can accidentally read an older 20-sheet or 45-sheet snapshot and regenerate completed batches. | **Canonical Pointer & Archive Sweep Rule**: `AGENT.md` headers synchronized to `140 / 140` across all sections, with a mandatory rule to resolve the latest file by `modifiedTime` or canonical ID. |

## 2. The 5-Stage Zero-Regeneration Character Onboarding Protocol (How to Add Any Future Character in 5 Sheets, Not 25)

Previously, creating a full multi-track presence for a main character like Hero Kai spanned ~25 sheets because early batches baked different weapons and outfits directly into the character sprites. Under our **Modular Socket Architecture (`Track D`)**, **you never regenerate weapons (`MOD_B02`), armor overlays (`MOD_B03`), accessories (`MOD_B04`), or cross-track gear cutouts (`MOD_B08`) when adding a new character**.

Every new character added to *Scrolls of Pythonia* follows a deterministic **5-Stage, 5-Sheet Minimum Viable Character (`MVC`) Pipeline**:

### Stage 1 — Author `<character_id>_genome.json` (Genome v4.0 Contract)
Create one JSON file in [`01_character_genomes`](https://drive.google.com/drive/folders/1sQZ8BW_8RZcP76uJbnS46z0hClfXoKGd) containing all **10 mandatory fields**:
1. `schema_version`: `"4.0.0"`
2. `character_id`: snake_case unique ID (e.g., `"lyra_syntax_archivist"`)
3. `canonical_name`: Formal English & Chinese display title
4. `archetype_class`: Assigned from the **5 Standardized Body Archetype Classes** (`ARCHETYPE_A_CHILD_HERO`, `ARCHETYPE_B_STOUT_ARTISAN_ELDER`, `ARCHETYPE_C_TALL_MENTOR_BRAWLER`, `ARCHETYPE_D_QUADRUPED_OR_SPRITE_PET`, `ARCHETYPE_E_MULTI_LIMB_COLOSSAL_BOSS`)
5. `reference_drive_ids`: Google Drive File IDs of the character's canonical turnaround sheet (plus Hero Kai scale anchor `1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN`)
6. `physical_proportions`: Exact `age_years`, `stature_cm`, and head ratios across Track A (`4.0H`), Track B (`3.2H`), and Track C (`2.2H`)
7. `facial_and_hair_locks`: Immutable hair silhouette, eye hex, skin hex, and facial accessories
8. `asymmetric_equipment_invariants`: Base undertunic/collar/hip-slot rules (drawn unarmed so hands remain open/closed socket grips)
9. `negative_disambiguation_locks`: Explicit `must_never_have` array listing visual traits belonging to sibling characters (e.g., *"never include 2-horned steel helmet [reserved for Ch. 3 Blacksmith]"*, *"never include tall pointed indigo hat [reserved for Great Wizard]"*)
10. `palette_hex_locks`: 4 to 6 exact `#RRGGBB` hex codes verified by Gate 8 of `acve_sprite_tool_v2.py`

### Stage 2 — Compile the 5-Sheet MVC Prompt Manifest (`new_character_onboarding_compiler.py`)
Run [`03_graphics_adapters/new_character_onboarding_compiler.py`](https://drive.google.com/file/d/14vDfJGO7D6lPTcBDGyrHd4WrQUbS43Ru/view?usp=drivesdk) against the new genome JSON. It validates all 10 fields and outputs the exact **5-Sheet Minimum Viable Character (`MVC`) Pack**:

| MVC Sheet Slot | Aspect & Grid | Target Track & Proportions | What It Contains & Why 5 Sheets Suffice for the Entire Game |
| :--- | :---: | :--- | :--- |
| **`MVC_01_<ID>_CANONICAL_TURNAROUND_AND_INSIGNIA_16x9`** | `16:9` (`4×1`) | Master Reference Anchor | `Front`, `3/4`, `Side`, and `Back` orthographic views on `#FFFFFF`. Uploaded to Drive first and passed in `image_references` for `MVC_02`–`MVC_05` so zero facial drift occurs. |
| **`MVC_02_<ID>_SOCKET_MANNEQUIN_EXPLORATION_STANCES_4x4`** | `1:1` (`4×4`) | Track A / D (`HD-2D`) | **Unarmed Socket-Ready Base Mannequin — States `01–16`**: Idle 1–2, Walk L/R, Sprint 1–2, Jump Squat, Rising Apex, Falling Descent, Landing Crouch, Rope Climb L/R, `F`-Interact, Lift Overhead, Push Block, Sit/Rest. |
| **`MVC_03_<ID>_SOCKET_MANNEQUIN_COMBAT_AND_CODING_4x4`** | `1:1` (`4×4`) | Track A / D (`HD-2D`) | **Unarmed Socket-Ready Base Mannequin — States `17–32`**: Empty-Handed Ready, Wind-Up (`0°`), Slash (`90°`), Smash (`135°`), Shield Brace, Throw, **Python IDE Typing Loop**, Spell Chant, Spell Burst, **`SyntaxError` Fizzle**, Eat Veg Food, Hit, Glitch-Stun, Low-HP Kneel, Prone KO, Victory. |
| **`MVC_04_<ID>_FFT_ISOMETRIC_SOCKET_MANNEQUIN_4x4`** | `1:1` (`4×4`) | Track B (`FFT 2:1 Isometric`) | **Unarmed `2:1` Isometric Socket Mannequin**: `SE/SW/NE/NW` 4-directional idle & march, tile elevation jump, empty-handed isometric weapon swing (`0°/90°/135°`), shield guard, spell chant, kneel, and KO. |
| **`MVC_05_<ID>_CAPYBARA_CHIBI_SOCKET_MANNEQUIN_AND_EMOTES_4x4`** | `1:1` (`4×4`) | Track C (`Capybara Go! Chibi`) | **Unarmed `2.2H` Squishy Chibi Socket Mannequin**: Squish/stretch idle, waddle 1–2, empty-handed swing, crit leap, 100-Rage charge, **universal mount-saddle riding pose** (fits all 4 mounts in `CG_B01_03`!), hit squash, KO, and 4 circular HUD sticker emotes. |

### Stage 3 — Zero-Regeneration Equipment Binding via the 5 Body Archetype Rigs
Once those 5 sheets are generated, the new character **immediately inherits**:
- All **80 HD-2D modular weapons, hammers, staves, shields, spellbooks, and slash arcs** from `MOD_B02_01`–`MOD_B02_05`
- All **80 paper-doll outfits, cloaks, and armor overlays** from `MOD_B03_01`–`MOD_B03_05` (scaled by the archetype's torso bounding box)
- All **80 headwear, eyewear, brooches, belts, satchels, potions, and backpacks** from `MOD_B04_01`–`MOD_B04_05`
- All **64 FFT Isometric & Capybara Go! Chibi modular gear cutouts** from `MOD_B08_01`–`MOD_B08_04`
- All **4 Chibi Mounts** (`Mushroom`, `int Boulder Golem`, `Cloud-Stag`, `Crimson Library Dragon`) via Cell 8 (`Universal Mount-Saddle Pose`) of `MVC_05`

## 3. The 5 Standardized Body Archetype Classes & Per-Frame Kinematic Socket LUT

To prevent floating weapons or misaligned hats when characters of different heights perform dynamic actions, [`01_character_genomes/universal_character_onboarding_schema_v2.json`](https://drive.google.com/file/d/1NWculsPec9osEWn8HyAERdXkeF2DG76k/view?usp=drivesdk) standardizes **5 Body Archetype Classes** inside the `256×256 px` cell:

| Archetype Class ID | Stature Range | Head Ratios (`HD-2D` / `FFT` / `Chibi`) | Pixel Height in `256×256` Cell | Base `ANCHOR_HAND_R_MAIN` `(x, y, deg)` | Base `ANCHOR_HEAD_TOP` `(x, y)` | Assigned Pythonia Cast & Future Roles |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **`ARCHETYPE_A_CHILD_HERO`** | `115–145 cm` | `4.0H` / `3.2H` / `2.2H` | `158 px` / `144 px` / `148 px` | `(162, 148, 45°)` | `(128, 82)` | `kai`, `little_girl`, `lyra_syntax_archivist`, future student mages |
| **`ARCHETYPE_B_STOUT_ARTISAN_ELDER`** | `95–162 cm` | `3.6H` / `3.0H` / `2.1H` | `152 px` / `140 px` / `146 px` | `(168, 152, 45°)` | `(128, 88)` | `master_grimsby`, `grandma_looma`, `barnaby_baker`, `goblin_thief` |
| **`ARCHETYPE_C_TALL_MENTOR_BRAWLER`** | `165–195 cm` | `4.8H` / `3.5H` / `2.3H` | `192 px` / `164 px` / `160 px` | `(172, 132, 45°)` | `(128, 48)` | `wizard`, `blacksmith`, `forest_spirit`, `ghost_librarian`, `signpost_keeper` |
| **`ARCHETYPE_D_QUADRUPED_OR_SPRITE_PET`** | `35–75 cm` | `2.2H` / `2.0H` / `1.8H` | `96 px` / `92 px` / `118 px` | Neck Collar: `(146, 184, 15°)` | `(152, 148)` | `string`, `spell_guardian`, `str`, `int`, `float`, `bool` spirits |
| **`ARCHETYPE_E_MULTI_LIMB_COLOSSAL_BOSS`** | `220–480 cm` | `5.5H` / `4.0H` / `2.8H` | `224 px` / `204 px` / `196 px` | Upper Scythe: `(188, 96, 30°)` · Lower Hand: `(176, 138, 45°)` | `(128, 28)` | `bug_king` (6-limb hexapod lock), `sleeping_red_dragon`, `BOSS_01`–`BOSS_11` |

For every frame `f` (`0..31`) in the 32-stance matrix, the game renderer computes the exact socket position deterministically:

$$\text{Socket}(f) = \text{ArchetypeBaseAnchor} + \text{KinematicLUT}[f]$$

## 4. Upgraded 9-Gate ACVE v2.0 Verification Standard (`acve_sprite_tool_v2.py`)

Every new sheet generated in future expansions must pass all **9 deterministic gates** in [`04_postprocess_and_acve/acve_sprite_tool_v2.py`](https://drive.google.com/file/d/11BJHJHRxblgivpo1DriFdEhMtSqMNHST/view?usp=drivesdk):

1. **Gate 0 (`gate_0_caption_clean`)**: Connected-component glyph stripper (`--clean-captions`) removes any stray AI-generated caption letters (`bh <= 26`, `area <= 3500`) in the top/bottom cell margins before alpha extraction.
2. **Gate 1 (`gate_1_rgba_format`)**: Enforces 4-channel `RGBA` PNG output.
3. **Gate 2 (`gate_2_dimension_lock`)**: Enforces exact modulo grid division (`1024×1024` for `4×4` sheets = `256×256 px` per cell).
4. **Gate 3 (`gate_3_bfs_alpha_preserved_interior`)**: Border-seeded BFS flood-fill converts outer `#FFFFFF` background to `(0, 0, 0, 0)` while preserving **100% of interior white/cream pixels** (`#F4EFE6` tunic, `#F2F4F7` beard, eye catchlights).
5. **Gate 4 (`gate_4_grid_occupancy`)**: Verifies `16/16` occupied cells (`opaque_pixels > 50`) and audits cell borders (`border_bleed_pixels`) to catch cross-gutter weapon/wing clipping.
6. **Gate 5 (`gate_5_bottom_center_pivot`)**: Locks `[0.5, 1.0]` bottom-center foot pivot metadata and bounding boxes per cell.
7. **Gate 6 (`gate_6_horizontal_seam_continuity`)**: Optional left/right edge pixel delta check for parallax biome strips (`CG_B08_01`–`02`).
8. **Gate 7 (`gate_7_sha256_sealed`)**: Emits companion `.json` frame atlas and cryptographic SHA-256 hash.
9. **Gate 8 (`gate_8_genome_hex_lock`)**: Verifies that every required hex color in `palette_hex_locks` (`--hex #D7A84B #3B6EA8 ...`) is physically present within `RGB Euclidean distance <= 42.0` inside the opaque pixels.

## 5. Future Curriculum Expansion Roadmap (Chapters 12–16: Loops, Functions, Lists & OOP)

When you expand *Scrolls of Pythonia* beyond Chapter 11 (`if / elif / else`), **zero existing character or biome sheets need to be regenerated**. New Python concepts plug in purely as modular overlays (`MOD_B07` extension) + 5-sheet MVC character packs:

| Future Chapter | Python Concept | New Visual Mechanic Overlay (1 Sheet in `MOD_B07` Style) | New Mentor / Boss Onboarding (5-Sheet `MVC` Pack Only) |
| :--- | :--- | :--- | :--- |
| **Ch. 12: Clockwork Conservatory** | `for item in sequence:` (For-Loops) | Rotating Brass Gear-Wheel Conveyor & Iterator Stepping Stones (`4×4` prop overlay) | **Chronos the Clockmaker** (`ARCHETYPE_B`, 5-sheet MVC pack) |
| **Ch. 13: Echoing Lighthouse** | `while condition:` (While-Loops & `break`) | Perpetual Beacon Prism Beam & Loop-Breaker Lever (`4×4` prop overlay) | **The Infinite Ouroboros Construct** (`ARCHETYPE_E`, 5-sheet MVC pack) |
| **Ch. 14: Guild of Blueprints** | `def spell_name(param):` & `return` (Functions) | Reusable Glowing Blueprint Stamp Press & Parameter Funnel (`4×4` prop overlay) | **Lyra the Syntax Archivist** (`ARCHETYPE_A`, pre-compiled in [`sample_lyra_mvc_5_sheet_manifest.json`](https://drive.google.com/file/d/11RKGD0kjga6G1WSmWThs5vZzjfgC49EY/view?usp=drivesdk)) |
| **Ch. 15: Grand Caravan Depot** | `list = [a, b, c]` & `.append()` (Lists & Indexing `[0]`) | Coupling Minecart Train Cars labeled `[0], [1], [2]` (`4×4` prop overlay) | **Caravan Master Tarek** (`ARCHETYPE_C`, 5-sheet MVC pack) |
