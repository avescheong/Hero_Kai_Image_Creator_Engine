#!/usr/bin/env python3
"""
Builds `02_inspector_and_tools/assets_catalog.js` from:
- `00_governance_and_plans/CANONICAL_SEAL_140_SHEETS_MANIFEST.json`
- Companion frame atlas JSONs in `05_generated_packs/`
- Character genomes in `01_character_genomes/*_genome.json`
- `01_character_genomes/universal_character_onboarding_schema_v2.json`

This enables `02_inspector_and_tools/ANIMATED_ASSET_DASHBOARD.html` to run
at full 1024x1024 resolution both via `file://` double-click and via HTTP.
"""

import json
from pathlib import Path
from typing import Any, Dict, List

TOOLS_DIR = Path(__file__).resolve().parent
REPO_ROOT = TOOLS_DIR.parent
MANIFEST_PATH = REPO_ROOT / "00_governance_and_plans" / "CANONICAL_SEAL_140_SHEETS_MANIFEST.json"
GENOMES_DIR = REPO_ROOT / "01_character_genomes"
SCHEMA_V2_PATH = GENOMES_DIR / "universal_character_onboarding_schema_v2.json"
OUT_JS = TOOLS_DIR / "assets_catalog.js"


def infer_tags(sid: str, track: str) -> List[str]:
    u = sid.upper()
    tags: List[str] = []
    if "KAI" in u or u.startswith("FMT"):
        tags.append("Hero Kai")
    if "STRING" in u:
        tags.append("String")
    if "WIZARD" in u:
        tags.append("Great Wizard")
    if "LOOMA" in u:
        tags.append("Grandma Looma")
    if "BLACKSMITH" in u:
        tags.append("Blacksmith (Ch.3)")
    if "GRIMSBY" in u:
        tags.append("Master Grimsby (Ch.9)")
    if "BUG_KING" in u:
        tags.append("Bug King")
    if "GUARDIAN" in u or "MANTIS" in u:
        tags.append("Spell Guardian")
    if any(k in u for k in ("NPC", "SPIRIT", "CAST", "DRAGON", "SUPPORTING", "PETS", "EGGS")):
        tags.append("NPCs & Spirits")
    if any(k in u for k in ("BOSS", "MINION")):
        tags.append("Bosses & Minions")
    if u.startswith("MOD_") and not any(x in u for x in ("MANNEQUIN", "MISSING_STANCES")):
        tags.append("Modular Gear & VFX")
    if any(k in u for k in ("ENV_", "BIOME", "CHESTS", "FORGE", "TREES", "ROADSIDE", "BANNER", "UI", "ICONS", "CARD_FRAMES", "CURSORS", "CUTIN", "FOOD", "GACHA", "TOKENS", "POPUPS", "CALIBRATION")):
        tags.append("Environments & UI")
    if not tags:
        tags.append("Modular Gear & VFX" if "Track D" in track else "Hero Kai")
    return tags


def build_catalog() -> Dict[str, Any]:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    sheets: List[Dict[str, Any]] = []

    for folder, info in manifest.get("game_type_folders", {}).items():
        for s in info.get("sheets", []):
            sid = s["sheet_id"]
            comp_rel = s.get("companion_json")
            comp_data: Dict[str, Any] = {}
            if comp_rel and (REPO_ROOT / comp_rel).exists():
                comp_data = json.loads((REPO_ROOT / comp_rel).read_text(encoding="utf-8"))

            grid = comp_data.get("grid") or {}
            dims = comp_data.get("dimensions") or {}
            cols = int(grid.get("columns", 1 if "16x9" in sid and "FMT02" in sid else (4 if "4x4" in sid or "16x9" in sid else 1)))
            rows = int(grid.get("rows", 4 if "4x4" in sid else 1))
            w = int(dims.get("w", 1024 if cols == 4 and rows == 4 else 1376))
            h = int(dims.get("h", 1024 if cols == 4 and rows == 4 else 768))
            frames_compact = [
                {
                    "i": f.get("frame_index", idx),
                    "r": f.get("row", idx // cols),
                    "c": f.get("col", idx % cols),
                    "b": [
                        f.get("content_bbox", {}).get("x", 0),
                        f.get("content_bbox", {}).get("y", 0),
                        f.get("content_bbox", {}).get("w", 0),
                        f.get("content_bbox", {}).get("h", 0),
                    ],
                    "px": f.get("opaque_pixels", 0),
                }
                for idx, f in enumerate(comp_data.get("frames", []))
            ]

            sheets.append({
                "id": sid,
                "folder": folder,
                "track": s["track"],
                "src": f"../{s['file']}",
                "cols": cols,
                "rows": rows,
                "w": w,
                "h": h,
                "kb": round(s.get("bytes", 0) / 1024.0, 1),
                "alpha_pct": comp_data.get("transparency_pct", s.get("transparency_pct")),
                "occupied": comp_data.get("occupied_cells", f"{cols * rows}/{cols * rows}"),
                "sha256": s.get("sha256", ""),
                "tags": infer_tags(sid, s["track"]),
                "frames": frames_compact,
            })

    characters: List[Dict[str, Any]] = []
    for gp in sorted(GENOMES_DIR.glob("*_genome.json")):
        g = json.loads(gp.read_text(encoding="utf-8"))
        local_refs = [f"../{v}" for v in g.get("local_reference_paths", {}).values()]
        characters.append({
            "id": g.get("character_id", gp.stem),
            "name": g.get("canonical_name", ""),
            "chinese_name": g.get("chinese_name", ""),
            "role": g.get("role", ""),
            "archetype": g.get("archetype_class", ""),
            "proportions": g.get("physical_proportions", {}),
            "palette": g.get("palette_hex_locks", []),
            "face_hair": g.get("facial_and_hair_locks", {}).get("summary_prompt_tokens", ""),
            "equipment": g.get("asymmetric_equipment_invariants", {}).get("summary_prompt_tokens", ""),
            "must_never_have": g.get("negative_disambiguation_locks", {}).get("must_never_have", []),
            "refs": local_refs,
        })

    schema_v2 = json.loads(SCHEMA_V2_PATH.read_text(encoding="utf-8"))
    lut_32 = schema_v2.get("per_frame_kinematic_socket_lut_32_stances", {})
    stance_names = [k for k in lut_32.keys() if k != "description"]

    return {
        "generated_at": "2026-11-17T21:17:00+08:00",
        "total_sheets": len(sheets),
        "sheets": sheets,
        "characters": characters,
        "archetypes": schema_v2.get("body_archetype_classes", {}),
        "lut_32": lut_32,
        "stance_names": stance_names,
    }


def main() -> None:
    catalog = build_catalog()
    js_payload = "window.PYTHONIA_ASSETS_CATALOG = " + json.dumps(catalog, ensure_ascii=False) + ";\n"
    OUT_JS.write_text(js_payload, encoding="utf-8")
    print(f"Wrote {OUT_JS} ({OUT_JS.stat().st_size / 1024:.1f} KB) covering {catalog['total_sheets']} sheets & {len(catalog['characters'])} characters.")


if __name__ == "__main__":
    main()
