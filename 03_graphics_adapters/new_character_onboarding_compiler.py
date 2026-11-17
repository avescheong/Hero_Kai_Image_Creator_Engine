#!/usr/bin/env python3
"""
Universal New Character Onboarding & 5-Sheet MVC Prompt Compiler (`new_character_onboarding_compiler.py`)
Validates any new character genome `<character_id>_genome.json` against the 10-Field Genome v4.0 Contract
(including Negative Sibling Disambiguation Locks and Body Archetype Class A-E) and compiles the 5-Sheet
Minimum Viable Character (MVC) Pack across Track A/D (HD-2D 32-Stance Socket Mannequin), Track B (FFT Isometric),
and Track C (Capybara Go! Chibi) so the new character can immediately equip all 240+ existing modular cutouts
in `MOD_B02`, `MOD_B03`, `MOD_B04`, and `MOD_B08` with ZERO re-generation of existing assets.
"""

import argparse
import hashlib
import json
from pathlib import Path
from typing import Dict, Any, List

REQUIRED_GENOME_V4_FIELDS = [
    "schema_version",
    "character_id",
    "canonical_name",
    "archetype_class",
    "reference_drive_ids",
    "physical_proportions",
    "facial_and_hair_locks",
    "asymmetric_equipment_invariants",
    "negative_disambiguation_locks",
    "palette_hex_locks"
]

VALID_ARCHETYPES = {
    "ARCHETYPE_A_CHILD_HERO",
    "ARCHETYPE_B_STOUT_ARTISAN_ELDER",
    "ARCHETYPE_C_TALL_MENTOR_BRAWLER",
    "ARCHETYPE_D_QUADRUPED_OR_SPRITE_PET",
    "ARCHETYPE_E_MULTI_LIMB_COLOSSAL_BOSS"
}

STYLE_HEADERS = {
    "TURNAROUND": (
        "Masterpiece 2D fantasy RPG character model turnaround sheet on a clean 4x1 horizontal layout (16:9 aspect ratio) "
        "with pure solid flat white background (#FFFFFF), Studio Ghibli and Akira Toriyama Dragon Quest storybook aesthetic, "
        "crisp dark sepia-charcoal ink outlines (#3E2B23), vibrant cel-shaded gouache colors, showing 1. Front View, "
        "2. 3/4 View, 3. Side Profile View, 4. Back View, completely text-free, no words, no numbers, no labels, no grid lines."
    ),
    "TRACK_A_HD2D": (
        "High-precision 2D hand-drawn fantasy RPG modular game asset sprite sheet, Studio Ghibli and Akira Toriyama "
        "Dragon Quest storybook aesthetic, crisp clean dark sepia-charcoal ink outlines (#3E2B23), vibrant soft watercolor "
        "and cel-shaded gouache colors on a solid pure flat white background (#FFFFFF), 16 evenly spaced cells arranged in "
        "4 rows by 4 columns, completely text-free, no words, no numbers, no labels, no grid lines, no watermarks."
    ),
    "TRACK_B_FFT": (
        "Final Fantasy Tactics (FFT / Akihiko Yoshida) 32-bit isometric tactical SRPG unit sprite sheet on a clean 4x4 grid "
        "with pure solid flat white background (#FFFFFF), 2:1 isometric diamond projection, 3.2-head tactical proportions, "
        "crisp dark pixel outlines, rich 32-bit shading, zero gridlines, zero text, zero labels, zero numbers."
    ),
    "TRACK_C_CHIBI": (
        "High-precision Capybara Go! (Habby) style 2D chibi roguelite auto-battler RPG game asset sprite sheet, adorable "
        "squishy 2.2-head mochi-bean chibi proportions with big expressive glossy eyes, rosy cheek blushes, bold smooth "
        "rounded dark cocoa-espresso outer ink contour lines (#34221A), vibrant soft cel-shaded vector-gouache colors on "
        "a solid pure flat white background (#FFFFFF), 16 evenly spaced sprites in 4 rows by 4 columns, completely text-free."
    )
}

GLOBAL_NEGATIVE = (
    "photorealistic, 3D render, CGI, modern clothing, jeans, sneakers, sunglasses, cyberpunk, grimdark, horror, gore, "
    "extra limbs, blurry, watermark, text, words, numbers, captions, labels, grid lines, Ember pet, non-vegetarian meat food"
)


def validate_genome_v4(genome: Dict[str, Any]) -> List[str]:
    errors: List[str] = []
    for field in REQUIRED_GENOME_V4_FIELDS:
        if field not in genome:
            errors.append(f"Missing required Genome v4.0 field: '{field}'")
    arch = genome.get("archetype_class", "")
    if arch not in VALID_ARCHETYPES:
        errors.append(f"Invalid archetype_class '{arch}'. Must be one of: {sorted(VALID_ARCHETYPES)}")
    hexes = genome.get("palette_hex_locks", [])
    if not isinstance(hexes, list) or len(hexes) < 4:
        errors.append("palette_hex_locks must contain at least 4 canonical #RRGGBB hex strings for Gate 8 verification.")
    neg_locks = genome.get("negative_disambiguation_locks", {})
    if not isinstance(neg_locks, dict) or "must_never_have" not in neg_locks:
        errors.append("negative_disambiguation_locks must define 'must_never_have' list to prevent sibling/mentor visual bleed.")
    return errors


def _normalize_ref_list(raw_refs: Any) -> List[str]:
    if isinstance(raw_refs, dict):
        return [str(v) for v in raw_refs.values() if v]
    if isinstance(raw_refs, list):
        return [str(v) for v in raw_refs if v]
    return []


def compile_mvc_5_sheet_prompts(genome: Dict[str, Any]) -> Dict[str, Any]:
    cid = genome["character_id"].upper()
    name = genome["canonical_name"]
    refs = _normalize_ref_list(genome.get("reference_drive_ids"))
    local_refs = _normalize_ref_list(genome.get("local_reference_paths"))
    locks = genome["facial_and_hair_locks"].get("summary_prompt_tokens", "")
    invariants = genome["asymmetric_equipment_invariants"].get("summary_prompt_tokens", "")
    must_never = ", ".join(genome["negative_disambiguation_locks"].get("must_never_have", []))
    neg_prompt = f"{GLOBAL_NEGATIVE}, {must_never}" if must_never else GLOBAL_NEGATIVE

    core_desc = f"{name} ({locks}; {invariants}; STRICT DISAMBIGUATION: never include {must_never})"

    sheets = {
        f"MVC_01_{cid}_CANONICAL_TURNAROUND_AND_INSIGNIA_16x9": {
            "character_id": genome["character_id"],
            "archetype_class": genome["archetype_class"],
            "aspect_ratio": "16:9",
            "grid_layout": "4x1",
            "reference_drive_ids": refs,
            "local_reference_paths": local_refs,
            "expected_hex_locks": genome["palette_hex_locks"],
            "prompt": f"{STYLE_HEADERS['TURNAROUND']} Subject: {core_desc}. 4 orthographic views from left to right: (1) Front view, (2) 3/4 view, (3) Side profile view, (4) Back view. Completely text-free.",
            "negative_prompt": neg_prompt
        },
        f"MVC_02_{cid}_SOCKET_MANNEQUIN_EXPLORATION_STANCES_4x4": {
            "character_id": genome["character_id"],
            "archetype_class": genome["archetype_class"],
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": refs,
            "local_reference_paths": local_refs,
            "expected_hex_locks": genome["palette_hex_locks"],
            "prompt": (
                f"{STYLE_HEADERS['TRACK_A_HD2D']} Unarmed socket-ready base mannequin of {core_desc} with empty hands "
                "for modular weapon socketing across States 01-16: Row 1: Idle 1, Idle 2 blink, Walk Left, Walk Right. "
                "Row 2: Sprint 1, Sprint 2, Jump Squat Takeoff, Rising Jump Apex. Row 3: Mid-Air Falling Descent, "
                "Landing Crouch, Rope Climb Left Hand High (back view), Rope Climb Right Hand High (back view). "
                "Row 4: F-Key Interact Reach, Lift/Carry Heavy Object Overhead, Push/Brace Block, Sit/Rest. Text-free."
            ),
            "negative_prompt": neg_prompt
        },
        f"MVC_03_{cid}_SOCKET_MANNEQUIN_COMBAT_AND_CODING_4x4": {
            "character_id": genome["character_id"],
            "archetype_class": genome["archetype_class"],
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": refs,
            "local_reference_paths": local_refs,
            "expected_hex_locks": genome["palette_hex_locks"],
            "prompt": (
                f"{STYLE_HEADERS['TRACK_A_HD2D']} Unarmed socket-ready base mannequin of {core_desc} with closed right-hand "
                "socket grip (no baked-in weapon) across States 17-32: Row 1: Unarmed Combat Ready, Melee Wind-Up (0 deg), "
                "Forward Slash Swing (90 deg), Heavy Overhead Smash (135 deg). Row 2: Off-Hand Shield Brace, Throw Item, "
                "Python IDE Thinking & Typing Loop, Python Spell Chant Loop. Row 3: Spell Release Burst, SyntaxError Soot "
                "Puff Fizzle Reaction, Eat Vegetarian Honey-Bread Buff, Hit Recoil. Row 4: Glitch-Stunned, Critical Low-HP "
                "One-Knee Kneel, Prone KO Defeated, Level-Up Victory Fanfare. Completely text-free."
            ),
            "negative_prompt": neg_prompt
        },
        f"MVC_04_{cid}_FFT_ISOMETRIC_SOCKET_MANNEQUIN_4x4": {
            "character_id": genome["character_id"],
            "archetype_class": genome["archetype_class"],
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": refs,
            "local_reference_paths": local_refs,
            "expected_hex_locks": genome["palette_hex_locks"],
            "prompt": (
                f"{STYLE_HEADERS['TRACK_B_FFT']} Unarmed socket-ready 2:1 isometric tactical unit of {core_desc}: "
                "Row 1: SE front-right idle, SW front-left idle, NE back-right idle, NW back-left idle. "
                "Row 2: SE march 1, SE march 2, NW back march, isometric tile jump. "
                "Row 3: SE empty-handed weapon swing (0 deg, 90 deg, 135 deg), off-hand shield guard. "
                "Row 4: Isometric Python spell chant, SyntaxError fizzle, critical low-HP kneel, prone KO. Text-free."
            ),
            "negative_prompt": neg_prompt
        },
        f"MVC_05_{cid}_CAPYBARA_CHIBI_SOCKET_MANNEQUIN_AND_EMOTES_4x4": {
            "character_id": genome["character_id"],
            "archetype_class": genome["archetype_class"],
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": refs,
            "local_reference_paths": local_refs,
            "expected_hex_locks": genome["palette_hex_locks"],
            "prompt": (
                f"{STYLE_HEADERS['TRACK_C_CHIBI']} Unarmed 2.2-head squishy chibi socket mannequin of {core_desc}: "
                "Row 1: Bouncy squish idle, stretch idle, auto-march waddle 1, waddle 2. "
                "Row 2: Empty-handed wind-up, forward swing, jumping crit pose, 100-Rage spell chant. "
                "Row 3: Universal mount-saddle riding pose, eating vegetarian honey-bread, hit squash '><', dizzy KO. "
                "Row 4: 4 die-cut circular HUD sticker emotes (happy grin, shocked reaction, thoughtful IDE coding, victory thumbs-up). Text-free."
            ),
            "negative_prompt": neg_prompt
        }
    }
    return {
        "compiler": "new_character_onboarding_compiler.py v2.0",
        "character_id": genome["character_id"],
        "canonical_name": name,
        "archetype_class": genome["archetype_class"],
        "local_reference_paths": local_refs,
        "total_mvc_sheets": 5,
        "reuses_existing_modular_cutouts": [
            "MOD_B02_01..05 (80 Weapons, Hammers, Staves, Shields & Slash VFX)",
            "MOD_B03_01..05 (80 Paper-Doll Outfits, Cloaks & Armor Overlays)",
            "MOD_B04_01..05 (80 Hats, Glasses, Brooches, Belts, Satchels & Backpacks)",
            "MOD_B08_01..04 (64 FFT Isometric & Capybara Go! Chibi Gear Cutouts)"
        ],
        "sheets": sheets
    }


SAMPLE_NEW_CHARACTER_GENOME = {
    "schema_version": "4.0.0",
    "character_id": "lyra_syntax_archivist",
    "canonical_name": "Lyra the Syntax Archivist",
    "archetype_class": "ARCHETYPE_A_CHILD_HERO",
    "reference_drive_ids": ["1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN"],
    "physical_proportions": {"age_years": 12, "stature_cm": 142, "head_ratio_hd2d": 4.0},
    "facial_and_hair_locks": {
        "summary_prompt_tokens": "12yo apprentice archivist girl, braided twilight-indigo hair (#2D3A6E) with silver-quill hairpins (#D9E4EC), warm amber-gold eyes (#F4D068) behind half-frame brass reading spectacles (#D4A23C)"
    },
    "asymmetric_equipment_invariants": {
        "summary_prompt_tokens": "unbleached cream linen scholar undertunic (#F4EFE6), teal-emerald sash (#3B8EA5), right-hip scroll tube quiver, left-hip brass inkwell pouch"
    },
    "negative_disambiguation_locks": {
        "must_never_have": [
            "tall pointed wizard hat (reserved for Great Wizard)",
            "spectral translucent ghost body (reserved for Ghost Librarian)",
            "blonde tousled hair (reserved for Hero Kai)"
        ]
    },
    "palette_hex_locks": ["#2D3A6E", "#F4D068", "#F4EFE6", "#3B8EA5", "#D4A23C"]
}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--genome", help="Path to <character_id>_genome.json (defaults to built-in Lyra dry-run)")
    parser.add_argument("--out", help="Output path for compiled 5-sheet MVC prompt manifest JSON")
    args = parser.parse_args()

    if args.genome:
        genome_data = json.loads(Path(args.genome).read_text(encoding="utf-8"))
    else:
        genome_data = SAMPLE_NEW_CHARACTER_GENOME

    errs = validate_genome_v4(genome_data)
    if errs:
        raise SystemExit("Genome v4.0 Validation Failed:\n" + "\n".join(errs))

    compiled = compile_mvc_5_sheet_prompts(genome_data)
    if args.out:
        Path(args.out).write_text(json.dumps(compiled, indent=2), encoding="utf-8")
        print(f"Compiled 5-Sheet MVC Pack for '{genome_data['character_id']}' -> {args.out}")
    else:
        print(json.dumps({k: v for k, v in compiled.items() if k != "sheets"}, indent=2))
        print("Sheet IDs:", list(compiled["sheets"].keys()))
