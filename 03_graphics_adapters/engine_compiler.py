#!/usr/bin/env python3
"""
Multi-Format Graphics Adapter & Prompt Compiler for Kai Asset For RPG (v3.0 Canon).
Reads `01_character_genomes/*.json` and compiles lossless, resolution-adaptive prompts
and reference locks across all 5 graphics formats:
1. `storybook_16x9` (16:9 Widescreen Integrated Storybook Spread)
2. `portrait_1x1` (1:1 512x512 RPG Dialogue Bust & 8-Emotion / 8-Phoneme Sheet)
3. `hd2d_4x4` (1:1 1024x1024 4x4 Side-View Action & Paper-Doll Sprite Sheet)
4. `srpg_tactical_4x4` (1:1 1024x1024 4x4 Isometric/Top-Down 12x8 Tactical Grid Unit Sheet)
5. `turnaround_16x9` (16:9 Orthographic 4-View Model Sheet & Equipment Callout)
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional

GENOMES_DIR = Path(__file__).resolve().parent.parent / "01_character_genomes"


class CharacterConsistencyEngine:
    def __init__(self, genomes_dir: Optional[Path] = None):
        self.genomes_dir = genomes_dir or GENOMES_DIR
        self.genomes: Dict[str, Dict[str, Any]] = {}
        self._load_all()

    def _load_all(self) -> None:
        for p in sorted(self.genomes_dir.glob("*_genome.json")):
            data = json.loads(p.read_text(encoding="utf-8"))
            cid = data.get("character_id") or data.get("group_id")
            if cid:
                self.genomes[cid] = data

    def compile_hero_kai_multi_format_batch(self) -> Dict[str, Dict[str, Any]]:
        """
        Compiles the 5-format Pilot Test Batch for Hero Kai (`kai`) locking:
        - Proportions (4.2H storybook / 3.8H HD-2D / 3.3H SRPG tactical)
        - Neat tousled honey-blonde hair (#D7A84B) & slate-blue eyes (#3B6EA8)
        - Moss-green cloak (#345830) + golden crescent clasp (#D4AF37)
        - Green Tzu Chi Dharma ship & lotus medallion belt buckle (#1F6A38 / #C29B38)
        - Strict hip asymmetry (plain closed brown satchel on Kai's right hip; 3-potion holster [emerald, ruby, sapphire] on Kai's left hip)
        """
        kai = self.genomes["kai"]
        dna = kai["shared_art_dna"]
        neg_base = f"{dna['global_negative_prompt']}, {kai['character_negative_Lock']}"

        return {
            "FMT01_KAI_TURNAROUND_AND_INSIGNIA_16x9": {
                "format_id": "turnaround_16x9",
                "aspect_ratio": "16:9",
                "outfit_stage": "adventure_ironsword",
                "reference_drive_ids": [
                    kai["canonical_drive_references"]["master_turnaround_4view"]["drive_id"],
                    kai["canonical_drive_references"]["storybook_portrait_gold"]["drive_id"],
                    kai["canonical_drive_references"]["equipment_callout"]["drive_id"]
                ],
                "prompt": (
                    f"{dna['style_core_game_asset']}. "
                    "Professional animation studio 4-VIEW CHARACTER TURNAROUND SHEET on clean pure flat white background (#FFFFFF) "
                    "showing 4 symmetrical full-body views aligned on a shared bottom baseline from left to right: "
                    "(1) Front View, (2) 3/4 View, (3) Side Profile View, (4) Back View. "
                    "Subject: Hero Kai, an 11-year-old boy hero adventurer matching the compact 4.2-head child-hero proportions in the attached reference sheets — "
                    "short neat tousled sandy golden-blonde hair (#D7A84B) with soft layered forehead bangs, large expressive cobalt-slate blue eyes (#3B6EA8) with crisp white catchlights, "
                    "round rosy youthful cheeks, wearing deep moss-green woolen cloak (#345830) fastened at the collarbone by a golden crescent moon brooch (#D4AF37), "
                    "unbleached warm cream double-breasted linen tunic (#F4EFE6) with small dark wooden buttons, matching cream linen trousers (#EDE8DE) tucked into wide folded-cuff brown leather riding boots (#6E4226), "
                    "laced brown leather forearm bracers, diagonal brown leather chest baldric slanting from right shoulder to left hip, "
                    "brown leather belt centered with the emerald-green Tzu Chi lotus and white Dharma ship medallion buckle (#1F6A38 / #C29B38), "
                    "strictly on Kai's OWN right hip hangs 1 plain closed rectangular brown leather satchel (no potions on satchel), "
                    "strictly on Kai's OWN left hip hangs a 3-slot leather holster with 3 corked round glass potion vials (emerald green #2ECC71, ruby red #E74C3C, sapphire blue #3A86FF), "
                    "and a gleaming forged steel IronSword carried diagonally across his back in a laurel-vine carved oak scabbard (hilt over right shoulder). "
                    "clean composition, text-free, no labels, no watermarks."
                ),
                "negative_prompt": neg_base
            },
            "FMT02_KAI_STORYBOOK_PROGRESSION_SPREAD_16x9": {
                "format_id": "storybook_16x9",
                "aspect_ratio": "16:9",
                "outfit_stage": "dwarven_steel_armor",
                "reference_drive_ids": [
                    kai["canonical_drive_references"]["storybook_armor_ch11_s04"]["drive_id"],
                    kai["canonical_drive_references"]["storybook_cloak_ch03_s02"]["drive_id"],
                    kai["canonical_drive_references"]["master_turnaround_4view"]["drive_id"]
                ],
                "prompt": (
                    f"{dna['style_core_storybook']}. "
                    "16:9 widescreen integrated storybook illustration in the sunlit Dawn Sanctuary of Pythonia. "
                    "Foreground & Midground: 11-year-old Hero Kai (4.2 heads tall compact child-hero build, neat tousled honey-blonde hair #D7A84B, warm cobalt-blue eyes #3B6EA8) "
                    "kneeling on ancient mossy flagstones wearing his burnished silver-grey segmented Dwarven Steel chestplate and shoulder pauldrons (#D9E4EC) layered over his deep moss-green woolen cloak (#345830) "
                    "with the golden crescent moon clasp (#D4AF37) at his neck, cream linen tunic and trousers (#F4EFE6) tucked into steel-trimmed cuffed brown leather boots, "
                    "emerald-green Tzu Chi lotus and Dharma ship belt medallion (#1F6A38), plain closed brown satchel on his right hip, 3-potion holster (emerald, ruby, sapphire glass vials) on his left hip, "
                    "and his gleaming Wizard's Blade in its vine-carved back scabbard. "
                    "Beside Kai's knee stands his loyal scruffy golden-tan terrier puppy String (#D89B4C with cream muzzle #F5E6CC) wearing a moss-green neckerchief and brown leather collar with a glowing cyan-teal 'str' crystal shard (#3B8EA5), "
                    "while the tiny 32cm luminous spring-emerald Baby Praying Mantis Spell Guardian (#2ECC71) with big warm golden-emerald eyes and pale-gold fairy wing buds bows politely amid golden dawn motes. "
                    "clean composition, text-free, no labels, no watermarks."
                ),
                "negative_prompt": neg_base
            },
            "FMT03_KAI_HD2D_LOCOMOTION_AND_COMBAT_4x4": {
                "format_id": "hd2d_4x4",
                "aspect_ratio": "1:1",
                "outfit_stage": "adventure_ironsword",
                "grid_layout": "4x4",
                "reference_drive_ids": [
                    kai["canonical_drive_references"]["master_turnaround_4view"]["drive_id"],
                    kai["canonical_drive_references"]["running_turnaround"]["drive_id"],
                    kai["canonical_drive_references"]["storybook_portrait_gold"]["drive_id"]
                ],
                "prompt": (
                    f"{dna['style_core_game_asset']}. "
                    "Precision 4x4 2D side-view RPG character animation sprite sheet (16 evenly spaced full-body frames in 4 rows by 4 columns on a pure flat #FFFFFF white background, zero grid lines, zero text, generous margin around every frame so no sword tip or cloak hem is cropped). "
                    "Subject in all 16 frames: Hero Kai (11yo boy hero, 4.0 heads tall HD-2D game proportions, neat tousled sandy golden-blonde hair #D7A84B, cobalt-blue eyes #3B6EA8, moss-green cloak #345830 with enlarged clear golden crescent clasp #D4AF37, cream tunic and trousers #F4EFE6, green Tzu Chi lotus belt buckle #1F6A38, brown right-hip satchel, left-hip 3-potion holster with red/blue/green vials, brown cuffed boots). "
                    "Row 1 (Frames 1-4): Side-view Idle breathing & Walk cycle striding right. "
                    "Row 2 (Frames 5-8): Dynamic Sprint leaning forward (Shift+D), Jump upward (Space), Crouch Guard (S), and Ladder Climb back-view (W). "
                    "Row 3 (Frames 9-12): Drawing and swinging his gleaming steel IronSword in a 4-frame melee slash arc (P key). "
                    "Row 4 (Frames 13-16): Holding open his glowing golden Ancient Spellbook and casting a radiant emerald-cyan Python spell orb forward (E key). "
                    "All 16 frames anchored to a uniform bottom-center foot baseline. clean composition, text-free, no labels, no watermarks."
                ),
                "negative_prompt": f"{neg_base}, grid lines, boxes, frame numbers, cropped sword, cut off feet, background scenery"
            },
            "FMT04_KAI_PAPERDOLL_WARDROBE_PROGRESSION_4x4": {
                "format_id": "hd2d_4x4",
                "aspect_ratio": "1:1",
                "outfit_stage": "multi_outfit_matrix",
                "grid_layout": "4x4",
                "reference_drive_ids": [
                    kai["canonical_drive_references"]["master_turnaround_4view"]["drive_id"],
                    kai["canonical_drive_references"]["wardrobe_variants"]["drive_id"],
                    kai["canonical_drive_references"]["storybook_armor_ch11_s04"]["drive_id"]
                ],
                "prompt": (
                    f"{dna['style_core_game_asset']}. "
                    "Precision 4x4 2D RPG paper-doll equipment progression sprite sheet (16 evenly spaced full-body frames in 4 rows by 4 columns on a pure flat #FFFFFF white background, zero grid lines, zero text). "
                    "Every row shows the exact same 11-year-old Hero Kai (4.0 heads tall, neat tousled honey-blonde hair #D7A84B, cobalt-blue eyes #3B6EA8) across 4 synchronized poses from left to right: "
                    "Col 1 = Heroic Idle Stance, Col 2 = Running Forward Stride, Col 3 = Melee Weapon Swing, Col 4 = Ladder Climb / Spell Cast. "
                    "Row 1 (Stage 0 Starter Hoodie): Wearing sage-green casual pullover hoodie (#7E9C78) and dark olive trousers (#4E5848). "
                    "Row 2 (Stage 1/2 Standard Adventurer Cloak): Wearing deep moss-green cloak (#345830) with gold crescent brooch (#D4AF37), cream tunic/pants (#F4EFE6), green Tzu Chi belt buckle (#1F6A38), 3 hip potions, wielding fused IronSword. "
                    "Row 3 (Stage 3 Dwarven Steel Armor): Wearing burnished silver-grey segmented Dwarven Steel chestplate and pauldrons (#D9E4EC) over moss-green cloak and cream tunic, Tzu Chi buckle, 3 hip potions, wielding glowing Wizard's Blade. "
                    "Row 4 (Stage 4 Master Lotus Mantle & Forge Hammer): Wearing radiant emerald-and-gold lotus trimmed battle mantle (#1F6A38 / #D4AF37) over reinforced steel cuirass, wielding Master Grimsby's Dwarven Rune Forge Hammer. "
                    "clean composition, text-free, no labels, no watermarks."
                ),
                "negative_prompt": f"{neg_base}, grid lines, text labels, cropped limbs, mismatched face"
            },
            "FMT05_KAI_DIALOGUE_EXPRESSIONS_AND_SRPG_UNIT_4x4": {
                "format_id": "portrait_and_tactical_4x4",
                "aspect_ratio": "1:1",
                "outfit_stage": "adventure_ironsword_and_sight",
                "grid_layout": "4x4",
                "reference_drive_ids": [
                    kai["canonical_drive_references"]["storybook_portrait_gold"]["drive_id"],
                    kai["canonical_drive_references"]["expressions_phonemes_props"]["drive_id"],
                    kai["canonical_drive_references"]["master_turnaround_4view"]["drive_id"]
                ],
                "prompt": (
                    f"{dna['style_core_game_asset']}. "
                    "Precision 4x4 RPG character expression bust & isometric SRPG tactical unit sheet (16 evenly spaced cells in 4 rows by 4 columns on pure flat #FFFFFF white background, zero grid lines, zero text). "
                    "Subject: 11-year-old Hero Kai (neat tousled sandy golden-blonde hair #D7A84B, cobalt-blue eyes #3B6EA8, moss-green cloak #345830 with gold crescent brooch #D4AF37, cream tunic #F4EFE6, green Tzu Chi lotus buckle #1F6A38, back IronSword hilt over right shoulder). "
                    "Row 1 (Cells 1-4 Dialogue Busts): (1) Warm Determined Smile, (2) Joyful Beaming Laugh, (3) Curious Thinking Gaze, (4) Surprised Wonder. "
                    "Row 2 (Cells 5-8 Dialogue Busts): (5) Empathetic Caring Expression, (6) Brave Battle Cry, (7) Hushed Library Whisper with glowing '#' Mute Mark on left cheek, (8) Awakened Spell 10 SIGHT Mode with eyes flaring bright cyan-gold and eyebrows glowing as parallel '==' lines. "
                    "Row 3 (Cells 9-12 SRPG Isometric Tactical Unit - Standard Cloak): Compact 3.4-head isometric 12x8 grid unit in (9) SE Idle, (10) SW Idle, (11) NE Back-View, (12) Isometric Sword Slash. "
                    "Row 4 (Cells 13-16 SRPG Isometric Tactical Unit - Dwarven Steel Armor): Compact 3.4-head isometric unit wearing silver Dwarven Steel chestplate & pauldrons over green cloak in (13) SE Guard, (14) Sun Aegis Shield Block, (15) Spellbook Cast, (16) Victory Pose. "
                    "clean composition, text-free, no labels, no watermarks."
                ),
                "negative_prompt": f"{neg_base}, speech bubbles, letters, numbers, grid lines"
            }
        }


if __name__ == "__main__":
    engine = CharacterConsistencyEngine()
    batch = engine.compile_hero_kai_multi_format_batch()
    out_manifest = Path(__file__).resolve().parent.parent / "05_generated_packs" / "01_RPG" / "hero_kai_pilot_batch_prompts.json"
    out_manifest.parent.mkdir(parents=True, exist_ok=True)
    out_manifest.write_text(json.dumps(batch, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Loaded {len(engine.genomes)} character genome files and compiled {len(batch)} multi-format test prompts.")
