# CLAUDE.md — Autonomous Character Consistency & Image Engine Instructions

Always follow [`AGENT.md`](AGENT.md) as the Single Source of Truth for this repository:

- **Zero Freehand Prompting**: Never improvise prompts for Hero Kai or any Pythonia character. Compile deterministic SHA-256 signed job tickets with `python kai_engine_cli.py compile-ticket --character <id> --track <track> --action "..." --out <path>` or 5-sheet MVC packs with `python kai_engine_cli.py onboard-mvc --genome <id> --out <path>`.
- **Inspect Character DNA**: Run `python kai_engine_cli.py list-characters` or `python kai_engine_cli.py character-info --id <id>` before any task.
- **Composite Modular Gear First**: Use `python kai_engine_cli.py composite` with `05_generated_packs/01_RPG/MOD_B01_*` mannequins and `MOD_B02`–`MOD_B04` / `MOD_B08` cutouts instead of regenerating base sprites.
- **Mandatory Visual Anchors**: Always attach the files in `mandatory_local_reference_paths` (`02_reference_anchors/`) to any image generation call.
- **Mandatory Verification**: Run `python kai_engine_cli.py verify --input <in.png> --output <out.png> --character <id> --clean-captions --strip-islands` after generating or compositing any sheet.
- **Verify Repository State**: Run `python kai_engine_cli.py status`.
