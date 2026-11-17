#!/usr/bin/env python3
"""
Hero Kai & Pythonia Portable Image Engine CLI (`kai_engine_cli.py`)
Single autonomous entrypoint for inspecting character DNA, verifying the 140 sealed
sprite packs, compiling deterministic generation tickets, onboarding new characters
in 5-sheet MVC packs, compositing modular paper-doll gear, and running ACVE verification.
"""

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any, Dict, List

REPO_ROOT = Path(__file__).resolve().parent
SDK_DIR = REPO_ROOT / "00_KAI_ENGINE_SDK"
GENOMES_DIR = REPO_ROOT / "01_character_genomes"
ANCHORS_DIR = REPO_ROOT / "02_reference_anchors"
ADAPTERS_DIR = REPO_ROOT / "03_graphics_adapters"
ACVE_DIR = REPO_ROOT / "04_postprocess_and_acve"
MANIFEST_PATH = REPO_ROOT / "00_governance_and_plans" / "CANONICAL_SEAL_140_SHEETS_MANIFEST.json"

for _p in (str(SDK_DIR), str(ADAPTERS_DIR), str(ACVE_DIR)):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import kai_prompt_and_rig_compiler as rig_compiler
import kai_paperdoll_compositor as compositor
import acve_kai_verifier_v3 as acve_v3
import acve_sprite_tool_v2 as acve_v2
import new_character_onboarding_compiler as mvc_compiler


def _load_all_genomes() -> List[Dict[str, Any]]:
    genomes = []
    for p in sorted(GENOMES_DIR.glob("*_genome.json")):
        data = json.loads(p.read_text(encoding="utf-8"))
        data["_file"] = p.name
        data["_path"] = str(p)
        genomes.append(data)
    return genomes


def cmd_status(args: argparse.Namespace) -> int:
    # 1. Validate all genomes
    genomes = _load_all_genomes()
    genome_errors: Dict[str, List[str]] = {}
    for g in genomes:
        errs = mvc_compiler.validate_genome_v4(g)
        if errs:
            genome_errors[g["_file"]] = errs

    # 2. Verify local reference anchor map
    ref_map_path = ANCHORS_DIR / "drive_id_to_local_path_map.json"
    ref_missing: List[str] = []
    ref_total = 0
    if ref_map_path.exists():
        mapping = json.loads(ref_map_path.read_text(encoding="utf-8")).get("drive_id_to_local_path", {})
        ref_total = len(mapping)
        for did, rel in mapping.items():
            if not (REPO_ROOT / rel).exists():
                ref_missing.append(f"{did} -> {rel}")
    else:
        ref_missing.append("Missing 02_reference_anchors/drive_id_to_local_path_map.json")

    # 3. Verify all 140 sealed sheets against manifest
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    pack_stats: Dict[str, Dict[str, int]] = {}
    sheet_missing: List[str] = []
    sha_mismatch: List[str] = []
    total_manifest = 0
    total_present = 0

    for folder, info in manifest.get("game_type_folders", {}).items():
        present = 0
        sheets = info.get("sheets", [])
        for s in sheets:
            total_manifest += 1
            fp = REPO_ROOT / s["file"]
            if fp.exists() and fp.stat().st_size > 0:
                present += 1
                total_present += 1
                if args.verify_sha:
                    actual_sha = hashlib.sha256(fp.read_bytes()).hexdigest()
                    if actual_sha != s.get("sha256"):
                        sha_mismatch.append(s["file"])
            else:
                sheet_missing.append(s["file"])
        pack_stats[folder] = {"present": present, "expected": len(sheets)}

    report = {
        "engine_root": str(REPO_ROOT),
        "genomes": {
            "total": len(genomes),
            "valid_v4": len(genomes) - len(genome_errors),
            "errors": genome_errors,
        },
        "reference_anchors": {
            "mapped_entries": ref_total,
            "missing_targets": len(ref_missing),
        },
        "sealed_packs": {
            "total_present": total_present,
            "total_expected": total_manifest,
            "by_folder": pack_stats,
            "missing_files": sheet_missing,
            "sha256_mismatches": sha_mismatch,
        },
    }
    print(json.dumps(report, indent=2))
    if genome_errors or ref_missing or sheet_missing or sha_mismatch:
        return 1
    return 0


def cmd_list_characters(_args: argparse.Namespace) -> int:
    genomes = _load_all_genomes()
    rows = []
    for g in genomes:
        cid = g.get("character_id") or g.get("group_id")
        outfits = list(g.get("outfits_and_progression_stages", {}).keys()) or list(g.get("progression_states", {}).keys()) or ["default"]
        rows.append({
            "character_id": cid,
            "canonical_name": g.get("canonical_name", ""),
            "archetype_class": g.get("archetype_class", ""),
            "palette_hex_locks": g.get("palette_hex_locks", []),
            "outfits_or_states": outfits,
            "must_never_have": g.get("negative_disambiguation_locks", {}).get("must_never_have", []),
        })
    print(json.dumps({"total_characters": len(rows), "characters": rows}, indent=2, ensure_ascii=False))
    return 0


def cmd_character_info(args: argparse.Namespace) -> int:
    gpath = rig_compiler.resolve_genome_path(args.id, None)
    data = json.loads(gpath.read_text(encoding="utf-8"))
    out = {
        "genome_file": str(gpath.relative_to(REPO_ROOT)),
        "character_id": data.get("character_id"),
        "canonical_name": data.get("canonical_name"),
        "chinese_name": data.get("chinese_name"),
        "role": data.get("role"),
        "archetype_class": data.get("archetype_class"),
        "physical_proportions": data.get("physical_proportions"),
        "facial_and_hair_locks": data.get("facial_and_hair_locks"),
        "asymmetric_equipment_invariants": data.get("asymmetric_equipment_invariants"),
        "negative_disambiguation_locks": data.get("negative_disambiguation_locks"),
        "palette_hex_locks": data.get("palette_hex_locks"),
        "local_reference_paths": data.get("local_reference_paths", {}),
        "reference_drive_ids": data.get("reference_drive_ids", {}),
    }
    print(json.dumps(out, indent=2, ensure_ascii=False))
    return 0


def cmd_compile_ticket(args: argparse.Namespace) -> int:
    gpath = rig_compiler.resolve_genome_path(args.character, args.genome)
    genome = json.loads(gpath.read_text(encoding="utf-8"))
    outfit = args.outfit or ("adventure_ironsword" if genome.get("character_id") == "kai" else "default")
    ticket = rig_compiler.compile_ticket(gpath, args.track, outfit, args.action)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(ticket, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({
        "status": "compiled",
        "character_id": ticket["character_id"],
        "track": ticket["track"],
        "outfit": ticket["outfit"],
        "output": str(args.out),
        "ticket_sha256": ticket["ticket_sha256"],
        "local_references_count": len(ticket["mandatory_local_reference_paths"]),
        "local_references": ticket["mandatory_local_reference_paths"],
    }, indent=2, ensure_ascii=False))
    return 0


def cmd_onboard_mvc(args: argparse.Namespace) -> int:
    raw = Path(args.genome)
    if raw.exists():
        gpath = raw
    else:
        gpath = rig_compiler.resolve_genome_path(args.genome, None)
    genome_data = json.loads(gpath.read_text(encoding="utf-8"))
    errs = mvc_compiler.validate_genome_v4(genome_data)
    if errs:
        print("Genome v4.0 Validation Failed:\n" + "\n".join(errs), file=sys.stderr)
        return 1
    compiled = mvc_compiler.compile_mvc_5_sheet_prompts(genome_data)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(compiled, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({
        "status": "compiled_mvc_5_sheets",
        "character_id": compiled["character_id"],
        "archetype_class": compiled["archetype_class"],
        "output": str(args.out),
        "sheet_ids": list(compiled["sheets"].keys()),
        "local_reference_paths": compiled.get("local_reference_paths", []),
    }, indent=2, ensure_ascii=False))
    return 0


def cmd_composite(args: argparse.Namespace) -> int:
    out = compositor.composite_sheets(
        args.base,
        args.overlay,
        args.out,
        head_lock_path=args.lock_head,
        head_offset=(args.head_dx, args.head_dy),
    )
    print(json.dumps({
        "status": "composited",
        "output": str(out),
        "overlays": len(args.overlay),
        "head_locked": args.lock_head is not None,
    }, indent=2))
    return 0


def cmd_verify(args: argparse.Namespace) -> int:
    gpath = rig_compiler.resolve_genome_path(args.character, args.genome)
    res = acve_v3.verify_and_process(
        args.input,
        args.output,
        gpath,
        grid_spec=args.grid,
        clean_captions=args.clean_captions,
        strip_islands=args.strip_islands,
        clamp_palette=args.clamp_palette,
    )
    genome = json.loads(gpath.read_text(encoding="utf-8"))
    hex_locks = genome.get("palette_hex_locks", [])
    if hex_locks:
        from PIL import Image
        hex_audit = acve_v2.verify_palette_hex_locks(Image.open(args.output), hex_locks)
        res["palette_hex_audit"] = hex_audit
        res["gates"]["gate_8_genome_hex_lock"] = all(hex_audit.values())

    print(json.dumps({k: v for k, v in res.items() if k != "cells"}, indent=2))
    return 0


def cmd_dashboard(args: argparse.Namespace) -> int:
    import functools
    import http.server
    import webbrowser

    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(REPO_ROOT))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    url = f"http://127.0.0.1:{args.port}/02_inspector_and_tools/ANIMATED_ASSET_DASHBOARD.html"
    print(f"Serving Hero_Kai_Image_Engine Animated Dashboard at: {url}")
    print("Press Ctrl+C to stop.")
    if not args.no_open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped dashboard server.")
    finally:
        server.server_close()
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="kai_engine_cli.py",
        description="Hero Kai & Pythonia Portable Multi-Character Image Engine CLI",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p_status = sub.add_parser("status", help="Verify genomes, local reference anchors, and all 140 sealed sheets.")
    p_status.add_argument("--verify-sha", action="store_true", help="Also verify SHA-256 of all 140 PNG files.")
    p_status.set_defaults(func=cmd_status)

    p_list = sub.add_parser("list-characters", help="List all registered characters and disambiguation locks.")
    p_list.set_defaults(func=cmd_list_characters)

    p_info = sub.add_parser("character-info", help="Print full locked DNA and local reference paths for one character.")
    p_info.add_argument("--id", required=True, help="Character ID (e.g., kai, string, wizard, blacksmith, master_grimsby, bug_king)")
    p_info.set_defaults(func=cmd_character_info)

    p_ticket = sub.add_parser("compile-ticket", help="Compile a deterministic, signed generation job ticket.")
    p_ticket.add_argument("--character", default="kai", help="Character ID in 01_character_genomes/")
    p_ticket.add_argument("--genome", type=Path, default=None, help="Optional explicit path to a genome JSON")
    p_ticket.add_argument("--track", default="track_a_hd2d", choices=list(rig_compiler.TRACK_STYLES.keys()))
    p_ticket.add_argument("--outfit", default=None)
    p_ticket.add_argument("--action", required=True)
    p_ticket.add_argument("--out", type=Path, required=True)
    p_ticket.set_defaults(func=cmd_compile_ticket)

    p_mvc = sub.add_parser("onboard-mvc", help="Compile a 5-Sheet Minimum Viable Character (MVC) prompt manifest.")
    p_mvc.add_argument("--genome", required=True, help="Character ID or path to <character>_genome.json")
    p_mvc.add_argument("--out", type=Path, required=True)
    p_mvc.set_defaults(func=cmd_onboard_mvc)

    p_comp = sub.add_parser("composite", help="Composite modular cutouts onto an unarmed socket mannequin PNG.")
    p_comp.add_argument("--base", type=Path, required=True)
    p_comp.add_argument("--overlay", type=Path, action="append", default=[])
    p_comp.add_argument("--lock-head", type=Path, default=None)
    p_comp.add_argument("--head-dx", type=int, default=0)
    p_comp.add_argument("--head-dy", type=int, default=0)
    p_comp.add_argument("--out", type=Path, required=True)
    p_comp.set_defaults(func=cmd_composite)

    p_ver = sub.add_parser("verify", help="Run 11-Gate ACVE v3.0 cleaner & verifier on a sprite sheet.")
    p_ver.add_argument("--input", type=Path, required=True)
    p_ver.add_argument("--output", type=Path, required=True)
    p_ver.add_argument("--character", default="kai")
    p_ver.add_argument("--genome", type=Path, default=None)
    p_ver.add_argument("--grid", default="4x4")
    p_ver.add_argument("--clean-captions", action="store_true")
    p_ver.add_argument("--strip-islands", action="store_true")
    p_ver.add_argument("--clamp-palette", action="store_true")
    p_ver.set_defaults(func=cmd_verify)

    p_dash = sub.add_parser("dashboard", help="Serve and open the Full Animated Assets Dashboard in browser.")
    p_dash.add_argument("--port", type=int, default=8765)
    p_dash.add_argument("--no-open", action="store_true")
    p_dash.set_defaults(func=cmd_dashboard)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    raise SystemExit(args.func(args))


if __name__ == "__main__":
    main()
