# GitHub Copilot Instructions — Hero_Kai_Image_Engine

Read `AGENT.md` and `HANDOVER_CURRENT.md` at the repository root before suggesting code or generating character assets.

Key non-negotiable rules:
1. All character prompts must be compiled deterministically from `01_character_genomes/*.json` via `python kai_engine_cli.py compile-ticket` or `onboard-mvc` — never freehand prompts.
2. All equipment/outfit/VFX additions should composite existing modular sheets (`MOD_B02`–`MOD_B04`, `MOD_B08`) onto sealed mannequins (`MOD_B01`) via `python kai_engine_cli.py composite`.
3. Visual generations must condition on local reference images in `02_reference_anchors/` (resolved automatically in compiled tickets under `mandatory_local_reference_paths`).
4. Post-process and verify every sheet via `python kai_engine_cli.py verify --clean-captions --strip-islands`.
5. Keep all scripts portable using `Path(__file__).resolve().parent` relative paths (never hardcode `/working_dir/` or drive-letter-specific cloud paths).
