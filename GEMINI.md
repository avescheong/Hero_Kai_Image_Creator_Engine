# GEMINI.md — Autonomous Character Consistency & Image Engine Instructions

Before generating, compositing, editing, or reviewing ANY Hero Kai or Pythonia character image, sprite sheet, or game asset in this repository:

1. **Read [`AGENT.md`](AGENT.md) and [`HANDOVER_CURRENT.md`](HANDOVER_CURRENT.md) first.**
2. **NEVER write freehand image generation prompts from memory.** Run `python kai_engine_cli.py compile-ticket ...` or `python kai_engine_cli.py onboard-mvc ...` reading `01_character_genomes/*.json`.
3. **Code Compositing Before AI Generation:** Never regenerate a character base sheet just to swap weapons, armor, hats, cloaks, or spell VFX — use `python kai_engine_cli.py composite ...` against sealed unarmed mannequins in `05_generated_packs/01_RPG/MOD_B01_*.png`.
4. **Always Condition on Local Visual References:** Pass every image listed in `mandatory_local_reference_paths` (under `02_reference_anchors/`) when generating genuinely new poses or scenes.
5. **Always Verify via ACVE:** Run `python kai_engine_cli.py verify --clean-captions --strip-islands` on every generated or composited sheet.
6. **Strict Disambiguation & Global Exclusions:**
   - Ch. 3 `blacksmith` = 2-horned steel helmet + silver 3-braid beard + sleeveless arms.
   - Ch. 9 `master_grimsby` = strictly HATLESS + fiery ginger twin-forked beard with brass rings + steel pauldrons + crimson rolled sleeves.
   - `bug_king` = strictly 6 limbs (4 arms + 2 legs).
   - `kai` = right-hip plain closed brown satchel (0 potions); left-hip 3-potion holster (`#2ECC71`, `#E74C3C`, `#3A86FF`); green Tzu Chi lotus medallion buckle.
   - Zero `"Ember"` pet; 100% vegetarian food only.
