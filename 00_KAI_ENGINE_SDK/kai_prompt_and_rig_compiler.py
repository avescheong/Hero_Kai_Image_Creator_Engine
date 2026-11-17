#!/usr/bin/env python3
"""
Hero Kai & Pythonia Multi-Character Deterministic Prompt & Socket Ticket Compiler
(`kai_prompt_and_rig_compiler.py`)
Reads `01_character_genomes/<character_id>_genome.json` or `kai_canonical_genome_v4.json`
and compiles a signed, reference-locked JSON job ticket for Track A (HD-2D), Track B (FFT Isometric),
Track C (Capybara Go! Chibi), or Storybook 16:9 across ANY registered Pythonia character.
"""

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any, Dict, List, Optional

SDK_DIR = Path(__file__).resolve().parent
REPO_ROOT = SDK_DIR.parent
GENOMES_DIR = REPO_ROOT / "01_character_genomes"
DEFAULT_GENOME = SDK_DIR / "kai_canonical_genome_v4.json"
REF_MAP_PATH = REPO_ROOT / "02_reference_anchors" / "drive_id_to_local_path_map.json"

TRACK_STYLES = {
    "track_a_hd2d": ("style_core_game_asset", "1:1", "4x4", "4.0H HD-2D proportions"),
    "track_b_fft": ("style_core_fft", "1:1", "4x4", "3.2H FFT 2:1 isometric tactical proportions"),
    "track_c_chibi": ("style_core_chibi", "1:1", "4x4", "2.2H Capybara Go! squishy chibi proportions (1.6x magnified insignia)"),
    "storybook_16x9": ("style_core_game_asset", "16:9", "1x1", "storybook proportions"),
}

KAI_OUTFIT_LOCKS = {
    "modern_bedroom_casual": "comfortable 11yo kid attire: sage-green pullover sweater (#7E9C78) over cream tee, dark olive trousers (#4E5848), NO cloak, NO sword, NO potions",
    "apprentice_wooden_sword": "moss-green woolen cloak (#345830), golden crescent brooch (#D4AF37), cream linen tunic (#F4EFE6), Tzu Chi lotus medallion buckle (#1F6A38), right-hip plain brown satchel (#7E4B2B), left-hip 3-potion holster (#2ECC71, #E74C3C, #3A86FF), wooden training sword on back",
    "adventure_ironsword": "moss-green woolen cloak (#345830), golden crescent brooch (#D4AF37), cream linen tunic (#F4EFE6), Tzu Chi lotus medallion buckle (#1F6A38), right-hip plain brown satchel (#7E4B2B), left-hip 3-potion holster (#2ECC71, #E74C3C, #3A86FF), forged steel IronSword in carved oak back scabbard",
    "dwarven_steel_armor": "silver-grey segmented Dwarven Steel chestplate and pauldrons (#D9E4EC) over moss-green cloak (#345830) and cream tunic (#F4EFE6), golden crescent brooch (#D4AF37), Tzu Chi lotus buckle (#1F6A38), right-hip satchel, left-hip 3-potion holster, Wizard's Blade",
}


def load_drive_id_map() -> Dict[str, str]:
    if REF_MAP_PATH.exists():
        data = json.loads(REF_MAP_PATH.read_text(encoding="utf-8"))
        return data.get("drive_id_to_local_path", {})
    return {}


def resolve_genome_path(character_id: Optional[str], genome_path: Optional[Path]) -> Path:
    if genome_path is not None:
        return genome_path
    if not character_id or character_id == "kai":
        if (GENOMES_DIR / "kai_genome.json").exists():
            return GENOMES_DIR / "kai_genome.json"
        return DEFAULT_GENOME
    if character_id in {"supporting_npcs", "supporting_npcs_and_spirits"}:
        return GENOMES_DIR / "supporting_npcs_genome.json"
    candidate = GENOMES_DIR / f"{character_id}_genome.json"
    if candidate.exists():
        return candidate
    for p in sorted(GENOMES_DIR.glob("*_genome.json")):
        data = json.loads(p.read_text(encoding="utf-8"))
        if data.get("character_id") == character_id or data.get("group_id") == character_id:
            return p
    raise FileNotFoundError(f"No genome JSON found for character '{character_id}' in {GENOMES_DIR}")


def _collect_references(genome: Dict[str, Any], track: str, drive_map: Dict[str, str]) -> Dict[str, List[str]]:
    drive_ids: List[str] = []
    local_paths: List[str] = []
    refs = genome.get("reference_drive_ids", {})
    local_map = genome.get("local_reference_paths", {})

    def add_ref(did: Optional[str], lpath: Optional[str] = None) -> None:
        if did and did not in drive_ids:
            drive_ids.append(did)
        resolved = lpath or (drive_map.get(did) if did else None)
        if resolved and resolved not in local_paths:
            local_paths.append(resolved)

    if isinstance(refs, dict):
        # Prioritize primary turnaround/master anchors first
        priority_keys = [
            "master_turnaround_4view",
            "turnaround_4view",
            "master_reference",
            "master_sheet",
            "storybook_portrait_gold",
            "story_website_cast",
            "equipment_callout",
            "turnaround_and_equipment",
            "turnaround_callout_expressions",
        ]
        for k in priority_keys:
            if k in refs:
                add_ref(refs[k], local_map.get(k))
        if genome.get("character_id") == "kai":
            track_mannequin_key = {
                "track_c_chibi": "sealed_mannequin_chibi",
                "track_b_fft": "sealed_mannequin_fft_iso",
            }.get(track, "sealed_mannequin_hd2d_combat")
            if track_mannequin_key in refs:
                add_ref(refs[track_mannequin_key], local_map.get(track_mannequin_key))
        if not drive_ids:
            for k, v in refs.items():
                add_ref(v, local_map.get(k))
    elif isinstance(refs, list):
        for did in refs:
            add_ref(did)

    if isinstance(local_map, dict):
        for lp in local_map.values():
            if lp and lp not in local_paths and len(local_paths) < 4:
                local_paths.append(lp)

    return {"drive_ids": drive_ids, "local_paths": local_paths}


def _resolve_outfit_tokens(genome: Dict[str, Any], outfit: str) -> tuple[str, str]:
    cid = genome.get("character_id", "")
    # 1. Check genome's outfits_and_progression_stages
    stages = genome.get("outfits_and_progression_stages", {})
    if outfit in stages:
        st = stages[outfit]
        return st.get("prompt_tokens", ""), st.get("stage_negative_tokens", "")
    # 2. Check genome's progression_states (e.g., string)
    pstates = genome.get("progression_states", {})
    if outfit in pstates:
        ps = pstates[outfit]
        return ps.get("prompt_tokens", ""), ps.get("negative_tokens", "")
    # 3. Check Kai legacy lookup
    if cid == "kai" and outfit in KAI_OUTFIT_LOCKS:
        return KAI_OUTFIT_LOCKS[outfit], ""
    # 4. Fallback to default invariant summary from Genome v4.0
    if outfit == "default":
        inv = genome.get("asymmetric_equipment_invariants", {}).get("summary_prompt_tokens")
        if not inv:
            inv = genome.get("visual_locks", {}).get("prompt_tokens", "")
        return inv, ""
    available = list(stages.keys()) + list(pstates.keys()) + (list(KAI_OUTFIT_LOCKS.keys()) if cid == "kai" else [])
    raise ValueError(f"Unsupported outfit '{outfit}' for '{cid}'. Choose 'default' or one of: {sorted(set(available))}")


def compile_ticket(
    genome_path: Path,
    track: str,
    outfit: str,
    action_description: str,
) -> Dict[str, Any]:
    genome = json.loads(genome_path.read_text(encoding="utf-8"))
    if track not in TRACK_STYLES:
        raise ValueError(f"Unsupported track '{track}'. Choose from: {list(TRACK_STYLES.keys())}")

    style_key, aspect, grid, prop_note = TRACK_STYLES[track]
    dna = genome.get("shared_art_dna", {})
    style_hdr = dna.get(style_key) or dna.get("style_core_game_asset", "")
    face_hair = genome.get("facial_and_hair_locks", {}).get("summary_prompt_tokens") or genome.get("visual_locks", {}).get("prompt_tokens", "")
    outfit_lock, stage_neg = _resolve_outfit_tokens(genome, outfit)
    neg_list = genome.get("negative_disambiguation_locks", {}).get("must_never_have", [])
    neg = ", ".join(neg_list) if neg_list else genome.get("character_negative_Lock", "")

    positive_prompt = (
        f"{style_hdr}. "
        f"Subject: {face_hair} ({prop_note}). "
        f"Outfit & Equipment Invariant Lock: {outfit_lock}. "
        f"Action / Sheet Layout ({grid}): {action_description}. "
        f"Completely text-free, no words, no numbers, no labels, no grid lines."
    )

    drive_map = load_drive_id_map()
    refs = _collect_references(genome, track, drive_map)

    neg_parts = [
        "photorealistic, 3D render, CGI, blurry, watermark, text, labels, grid lines",
        neg,
        stage_neg,
    ]
    negative_prompt = ", ".join(p for p in neg_parts if p)

    ticket = {
        "sdk_version": "3.1.0-portable",
        "character_id": genome.get("character_id", "unknown"),
        "canonical_name": genome.get("canonical_name", ""),
        "archetype_class": genome.get("archetype_class", ""),
        "track": track,
        "outfit": outfit,
        "aspect_ratio": aspect,
        "grid_layout": grid,
        "mandatory_local_reference_paths": refs["local_paths"],
        "mandatory_image_references_drive_ids": refs["drive_ids"],
        "positive_prompt": positive_prompt,
        "negative_prompt": negative_prompt,
        "palette_hex_locks": genome.get("palette_hex_locks", []),
    }
    digest = hashlib.sha256(json.dumps(ticket, sort_keys=True).encode("utf-8")).hexdigest()
    ticket["ticket_sha256"] = digest
    return ticket


def main() -> None:
    parser = argparse.ArgumentParser(description="Compile deterministic Pythonia character generation ticket.")
    parser.add_argument("--character", default=None, help="Character ID in 01_character_genomes/ (e.g. kai, string, wizard, blacksmith, master_grimsby, bug_king)")
    parser.add_argument("--genome", type=Path, default=None, help="Explicit path to genome JSON")
    parser.add_argument("--track", default="track_a_hd2d", choices=list(TRACK_STYLES.keys()))
    parser.add_argument("--outfit", default=None, help="Outfit/stage ID (defaults to adventure_ironsword for kai, else default)")
    parser.add_argument("--action", required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()

    gpath = resolve_genome_path(args.character, args.genome)
    genome = json.loads(gpath.read_text(encoding="utf-8"))
    outfit = args.outfit or ("adventure_ironsword" if genome.get("character_id") == "kai" else "default")

    ticket = compile_ticket(gpath, args.track, outfit, args.action)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(ticket, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Compiled signed ticket for '{ticket['character_id']}': {args.out} (sha256={ticket['ticket_sha256'][:12]}...)")


if __name__ == "__main__":
    main()
