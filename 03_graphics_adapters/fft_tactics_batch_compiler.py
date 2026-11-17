#!/usr/bin/env python3
"""
Final Fantasy Tactics (FFT) Isometric SRPG Multi-Batch Prompt Compiler (`fft_tactics_batch_compiler.py`)
Reads `01_character_genomes/*.json` and compiles deterministic, zero-drift prompts for all 8 FFT Batches
(FFT_B01 through FFT_B08 — 40 sheets total) into `05_generated_packs/fft_batches_01_to_08_master_prompts.json`.
"""
import argparse
import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PACKS_DIR = REPO_ROOT / "05_generated_packs" / "02_SRPG"

FFT_YOSHIDA_HEADER = (
    "Masterpiece Final Fantasy Tactics (War of the Lions / Akihiko Yoshida) and Studio Ghibli tactical RPG "
    "character art illustration, expressive tapered dark sepia-charcoal ink linework (#3B271E) with delicate "
    "cross-hatching on cloth folds and armor, warm aged vellum and cel-shaded gouache watercolor palette, "
    "solid pure flat white background (#FFFFFF), clean composition, completely text-free, no words, no numbers, "
    "no labels, no grid lines, no watermarks."
)

FFT_ISO_UNIT_HEADER = (
    "High-precision Final Fantasy Tactics (FFT) 2:1 dimetric isometric tactical RPG unit sprite sheet "
    "(30-degree elevated top-down pitch, 45-degree diagonal yaw rotation), Akihiko Yoshida and Dragon Quest "
    "hand-inked sepia-charcoal outlines (#3B271E) with rich cel-shaded gouache colors, compact 3.2-head "
    "isometric tactical proportions with 1.35x enlarged readable weapons and boots anchored to a [0.5, 0.88] "
    "diamond tile foot pivot on a solid pure flat white background (#FFFFFF), 16 evenly spaced sprites arranged "
    "in 4 rows by 4 columns, completely text-free, no words, no numbers, no labels, no grid lines, no watermarks."
)

FFT_DIORAMA_HEADER = (
    "High-precision Final Fantasy Tactics (FFT) 2:1 dimetric isometric stepped-elevation voxel diorama terrain "
    "and prop sprite sheet (30-degree elevated top-down pitch, 45-degree diagonal diamond blocks), crisp dark "
    "sepia-charcoal ink outlines (#3B271E), rich hand-painted gouache and watercolor textures on a solid pure "
    "flat white background (#FFFFFF), 16 evenly spaced isometric terrain/prop blocks arranged in 4 rows by 4 columns, "
    "completely text-free, no words, no numbers, no labels, no grid lines, no watermarks."
)

GLOBAL_NEG = (
    "photorealistic, 3D render, CGI, octane render, unreal engine, flat side-scroller ortho view, modern clothing, "
    "jeans, sneakers, sunglasses, cyberpunk, grimdark, horror, bloody, gore, grotesque, distorted anatomy, extra limbs, "
    "blurry, low resolution, screenshot artifacts, crop marks, watermark, text, words, numbers, captions, labels, "
    "grid lines, Ember pet, non-vegetarian meat food"
)

KAI_LOCK = (
    "11yo boy hero Hero Kai, neat tousled sandy golden-blonde hair (#D7A84B) with soft forehead bangs, expressive "
    "cobalt-slate blue eyes (#3B6EA8), deep moss-green woolen cloak (#345830) fastened by a golden crescent moon "
    "brooch (#D4AF37), unbleached cream linen tunic (#F4EFE6) and trousers tucked into brown leather cuffed boots (#6E4226), "
    "emerald-green Tzu Chi lotus and Dharma ship belt medallion (#1F6A38), plain closed brown satchel on his right hip, "
    "and 3-slot potion holster (emerald #2ECC71, ruby #E74C3C, sapphire #3A86FF glass vials) on his left hip"
)

FFT_MASTER_BATCHES = {
    "FFT_BATCH_01_HERO_KAI_JOB_CLASSES_AND_ISOMETRIC_PACK": {
        "FFT_B01_01_KAI_YOSHIDA_JOB_CLASSES_AND_PORTRAITS_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN",
                "1w79QHXpZnVN4U04FNIylZp_TWF0cZMz9",
                "1iOM8JakVlEd5WvAroAx30BTwlXmSV2Ae"
            ],
            "prompt": (
                f"{FFT_YOSHIDA_HEADER} Precision 4x4 Final Fantasy Tactics Job Class progression and portrait sheet (16 cells in 4 rows by 4 columns). "
                f"Subject in all cells is {KAI_LOCK}. "
                "First row of 4 cells (Full-Body Akihiko Yoshida 3/4 Standing Tactical Job Figures): "
                "(1) Job 1 Novice Coder in sage-green hoodie (#7E9C78) holding wooden practice sword; "
                "(2) Job 2 Squire of Pythonia in moss-green cloak (#345830) with gold crescent brooch (#D4AF37), cream tunic (#F4EFE6), Tzu Chi belt medallion, and gleaming IronSword; "
                "(3) Job 3 Dwarven Rune Knight wearing burnished silver Dwarven Steel chestplate and pauldrons (#D9E4EC) over moss-green cloak wielding glowing Wizard's Blade and Sun-Aegis Shield; "
                "(4) Job 4 Grand Weaver Arch-Paladin in emerald-and-gold lotus battle mantle (#1F6A38 / #D4AF37) wielding Master Grimsby's Dwarven Rune Hammer and glowing Ancient Spellbook. "
                "Second row of 4 cells: 4 framed aged-vellum Final Fantasy Tactics status menu shoulder-up portraits corresponding to the 4 Job Classes above. "
                "Third row of 4 cells: 4 dynamic diagonal battle spell-chant cut-in portrait busts (determined smile, brave sword cry, '#' hushed library whisper mark, and awakened '==' cyan-gold Sight eyes). "
                "Fourth row of 4 cells: 4 floating isometric Final Fantasy Tactics Job Mastery crystals and job crest emblems (Novice Scroll Emblem, Squire IronSword Crest, Dwarven Steel Shield Crest, Grand Weaver Golden Lotus Crystal). "
                "Completely text-free, no labels anywhere."
            ),
            "negative_prompt": GLOBAL_NEG
        },
        "FFT_B01_02_KAI_SQUIRE_ISOMETRIC_4DIR_LOCOMOTION_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN",
                "1sVun5VQnKvsRJw4kzSH4ZwLmwEor6VQb"
            ],
            "prompt": (
                f"{FFT_ISO_UNIT_HEADER} Subject in all 16 isometric frames is Squire {KAI_LOCK}, carrying his gleaming IronSword in its diagonal back scabbard. "
                "First row of 4 sprites (South-East SE Front-Right Isometric Diagonal Facing): (1) SE FFT march-in-place idle frame 1, (2) SE FFT march-in-place idle frame 2 with swinging arms, (3) SE isometric walking stride, (4) SE high-arcing elevation tile jump. "
                "Second row of 4 sprites (South-West SW Front-Left Isometric Diagonal Facing): (5) SW FFT march-in-place idle frame 1, (6) SW FFT march-in-place idle frame 2, (7) SW isometric walking stride, (8) SW high-arcing elevation tile jump. "
                "Third row of 4 sprites (North-West NW Back-Left Isometric Diagonal Facing showing moss-green cloak back and diagonal back scabbard): (9) NW march-in-place idle 1, (10) NW march-in-place idle 2, (11) NW isometric walk stride, (12) NW elevation tile jump. "
                "Fourth row of 4 sprites (North-East NE Back-Right Isometric Diagonal Facing): (13) NE march-in-place idle 1, (14) NE march-in-place idle 2, (15) NE isometric walk stride, (16) NE elevation tile jump. "
                "Completely text-free, no labels anywhere."
            ),
            "negative_prompt": GLOBAL_NEG
        },
        "FFT_B01_03_KAI_SQUIRE_ISOMETRIC_COMBAT_CHANT_KO_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN",
                "1w79QHXpZnVN4U04FNIylZp_TWF0cZMz9"
            ],
            "prompt": (
                f"{FFT_ISO_UNIT_HEADER} Subject in all 16 isometric frames is Squire {KAI_LOCK}. "
                "First row of 4 sprites (SE Isometric Melee & Defense): (1) SE drawing gleaming IronSword wind-up, (2) SE diagonal overhead sword slash arc, (3) SE glowing orange '+' Fuse Swordskill impact strike, (4) SE raising golden Sun-Aegis shield in defensive guard crouch. "
                "Second row of 4 sprites (SW Isometric Melee & Item): (5) SW IronSword wind-up, (6) SW sweeping horizontal slash, (7) SW tossing a glowing emerald healing potion vial, (8) SW agile sidestep evasion pose. "
                "Third row of 4 sprites (FFT Python Spell Chant & Release): (9) SE kneeling spell chant loop 1 holding open golden Ancient Spellbook with glowing magic circle under feet, (10) SE standing spell chant loop 2 with floating golden orbs, (11) SE thrusting hand forward to release radiant emerald-cyan spell beam, (12) NW back-view spell cast. "
                "Fourth row of 4 sprites (FFT Damage, Critical Low-HP Kneel, KO & Victory): (13) SE hit recoil stagger, (14) SE FFT critical low-HP state kneeling on one knee panting, (15) SE knocked-out KO state lying flat prone along the isometric tile angle with a floating golden revival crystal above, (16) SE triumphant victory pose raising IronSword high. "
                "Completely text-free, no labels anywhere."
            ),
            "negative_prompt": GLOBAL_NEG
        },
        "FFT_B01_04_KAI_DWARVEN_KNIGHT_ISOMETRIC_PACK_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1iOM8JakVlEd5WvAroAx30BTwlXmSV2Ae",
                "1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN"
            ],
            "prompt": (
                f"{FFT_ISO_UNIT_HEADER} Subject in all 16 isometric frames is Tier 3 Dwarven Rune Knight {KAI_LOCK}, wearing burnished silver-grey segmented Dwarven Steel chestplate and shoulder pauldrons (#D9E4EC) layered over his moss-green cloak (#345830). "
                "First row of 4 sprites: (1) SE armored march-in-place idle, (2) SE armored walk stride, (3) SW armored march-in-place idle, (4) SW armored walk stride. "
                "Second row of 4 sprites: (5) NW back-left armored idle showing silver pauldrons and moss cloak, (6) NW armored walk stride, (7) NE back-right armored idle, (8) NE armored high elevation jump. "
                "Third row of 4 sprites: (9) SE glowing Wizard's Blade wind-up, (10) SE radiant golden-cyan Swordskill cleave, (11) SW wielding Master Grimsby's octagonal Dwarven Rune Hammer smash, (12) SE Sun-Aegis shield wall block. "
                "Fourth row of 4 sprites: (13) SE awakened '==' Sight spell chant with glowing cyan-gold eyes and floor ring, (14) SE armored hit stagger, (15) SE armored critical low-HP one-knee kneel, (16) SE armored prone KO state on isometric angle. "
                "Completely text-free, no labels anywhere."
            ),
            "negative_prompt": GLOBAL_NEG
        },
        "FFT_B01_05_TACTICAL_TILE_CURSORS_AND_SPELL_RINGS_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1w79QHXpZnVN4U04FNIylZp_TWF0cZMz9"],
            "prompt": (
                f"{FFT_DIORAMA_HEADER} Precision 4x4 Final Fantasy Tactics isometric battlefield UI markers, diamond tile cursors, and spell VFX sprite sheet (16 cells in 4 rows by 4 columns). "
                "First row of 4 sprites (2:1 Isometric Diamond Grid Tile Highlight Cursors): (1) glowing cobalt-blue movement range diamond tile cursor, (2) glowing crimson-red attack target diamond tile cursor, (3) glowing amber-gold AoE spell target diamond tile cursor with corner brackets, (4) glowing emerald-green healing target diamond tile cursor. "
                "Second row of 4 sprites (Isometric Under-Foot Spell Chant Magic Rings): (5) golden sunlight spell chant ring with floating light motes, (6) fiery orange forge-spark spell ring with anvil runes, (7) sapphire-and-ruby crystal vault spell ring, (8) luminous cyan truth-eye logic spell ring. "
                "Third row of 4 sprites (FFT Battlefield Status & Spoils Markers): (9) ornate floating golden bevelled active-unit turn pointer arrow, (10) isometric wooden spoils treasure chest drop, (11) floating faceted golden-amber FFT unit revival crystal, (12) floating crimson countdown heart crystal. "
                "Fourth row of 4 sprites (Isometric Combat Impact VFX): (13) golden-white diagonal sword slash shockwave arc, (14) molten orange hammer impact crater burst, (15) rainbow silk healing weave spiral aura, (16) emerald dawn harmony pillar of light. "
                "Completely text-free, no labels anywhere."
            ),
            "negative_prompt": GLOBAL_NEG
        }
    },
    "FFT_BATCH_02_STRING_AND_GREAT_WIZARD_ISOMETRIC_PACK": {
        "FFT_B02_01_STRING_ISOMETRIC_4DIR_LOCOMOTION_4x4": {
            "character_id": "string",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1gfiJ7wHYfGRs_1t6ortYVeQXNBJk2iMm", "1BXXuk_rC5BFBGSLx6YJ9btBhUjSIBbZL"],
            "prompt": f"{FFT_ISO_UNIT_HEADER} 16 isometric frames of String (~32cm scruffy golden-tan terrier puppy #D89B4C, cream muzzle #F5E6CC, moss-green neckerchief #345830) across SE, SW, NW, NE march-in-place, trot, and elevation tile leap.",
            "negative_prompt": GLOBAL_NEG
        },
        "FFT_B02_02_STRING_TELEPATHIC_STR_COMBAT_AND_KO_4x4": {
            "character_id": "string",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1gfiJ7wHYfGRs_1t6ortYVeQXNBJk2iMm", "1BXXuk_rC5BFBGSLx6YJ9btBhUjSIBbZL"],
            "prompt": f"{FFT_ISO_UNIT_HEADER} 16 isometric frames of Ch. 8 Awakened String with glowing cyan-teal 'str' collar crystal (#3B8EA5): sonic bark, digging item find, telepathic aura wave, low-HP crouch, curled sleep KO, and 4 Yoshida portraits.",
            "negative_prompt": GLOBAL_NEG
        },
        "FFT_B02_03_GREAT_WIZARD_ISOMETRIC_4DIR_LOCOMOTION_4x4": {
            "character_id": "wizard",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1vmgAMIFU-HSW5NpkXsxv2kfLmdtjFZGB", "1wdIcGEGsdqN48H9l4R08Z7mNw8482GNM"],
            "prompt": f"{FFT_ISO_UNIT_HEADER} 16 isometric frames of The Great Wizard (curved indigo hat #23396C, waist-length silver beard #F2F4F7, celestial cobalt robes, oak staff with emerald orb #2BD980) across SE, SW, NW, NE march, robe-stride, and levitation hop.",
            "negative_prompt": GLOBAL_NEG
        },
        "FFT_B02_04_GREAT_WIZARD_ISOMETRIC_CHANT_AND_STARLIGHT_4x4": {
            "character_id": "wizard",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1vmgAMIFU-HSW5NpkXsxv2kfLmdtjFZGB", "1wdIcGEGsdqN48H9l4R08Z7mNw8482GNM"],
            "prompt": f"{FFT_ISO_UNIT_HEADER} 16 isometric frames of The Great Wizard: staff sweep, floating scroll chant loop, emerald orb beam cast, Ch. 6 emerald starlight dissolution farewell, critical kneel, prone KO, and 4 Yoshida portraits.",
            "negative_prompt": GLOBAL_NEG
        },
        "FFT_B02_05_HERO_PARTY_FFT_CUTIN_BANNERS_AND_SIGILS_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1w79QHXpZnVN4U04FNIylZp_TWF0cZMz9", "1vmgAMIFU-HSW5NpkXsxv2kfLmdtjFZGB"],
            "prompt": f"{FFT_YOSHIDA_HEADER} 16 cells of Akihiko Yoshida diagonal tactical skill cut-in busts and isometric dual-tech summon sigils for Hero Kai, String, and The Great Wizard.",
            "negative_prompt": GLOBAL_NEG
        }
    },
    "FFT_BATCH_03_CRAFTSMEN_AND_GUARDIANS_ISOMETRIC_PACK": {
        "FFT_B03_01_GRANDMA_LOOMA_ISOMETRIC_WEAVER_BARD_4x4": {
            "character_id": "grandma_looma",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1czQvpJyQ3jO6sA2HrIo55BtCkMOSW252", "1mUKdoCGTrm94t43RHnANbTkxQO-BBgkp"],
            "prompt": f"{FFT_ISO_UNIT_HEADER} 16 isometric frames of Grandma Looma (ash-silver low nape bun #A89F8D, ochre botanical blouse #C9965B, olive vest/skirt #7B6B4F, cream apron #EDE4CE, neck-cord glasses, hardwood boat shuttle) across SE/SW/NW/NE march, rainbow silk Comma weave chant, lantern heal, critical kneel, and 4 Yoshida portraits.",
            "negative_prompt": GLOBAL_NEG
        },
        "FFT_B03_02_BLACKSMITH_CH03_ISOMETRIC_FORGEMAN_4x4": {
            "character_id": "blacksmith",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1s0Fl8NRWPCc0LcyWU0hgnP__x9Noc5HN", "1_udSLS2q2t3KSmENXYAJ40ugLh3ZMqen"],
            "prompt": f"{FFT_ISO_UNIT_HEADER} 16 isometric frames of Ch. 3 Iron Outpost Blacksmith (MANDATORY domed riveted steel helmet #6E7885 with 2 upward-curving ivory horns #DDD2BE, massive silver-white 3-braid beard #C8CDD2, scarred bare muscular arms, sleeveless olive tunic #58635A, brown leather apron #8A5A36) across SE/SW/NW/NE march, heavy hammer slam, Fuse (+) anvil strike, critical kneel, and 4 Yoshida portraits.",
            "negative_prompt": f"{GLOBAL_NEG}, hatless, fiery orange beard, red beard"
        },
        "FFT_B03_03_MASTER_GRIMSBY_CH09_ISOMETRIC_RUNESMITH_4x4": {
            "character_id": "master_grimsby",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["17okHXa0zAJVZnjrB_UGrSKk5WwkneNd2", "1ZCN7_0BUoV3TeEeky6hsFW1NWTXpfTke"],
            "prompt": f"{FFT_ISO_UNIT_HEADER} 16 isometric frames of Ch. 9 Master Grimsby (MANDATORY HATLESS head with NO horned helmet, blazing fiery ginger-orange twin-forked beard #C94A29-#E07A38 banded with brass rings #D4A23C, steel shoulder pauldrons #D9E4EC, rolled crimson sleeves #8E3524, runic smelter apron #7E4528) across SE/SW/NW/NE march, octagonal Dwarven rune hammer strike, Dwarven armor buff, critical kneel, and 4 Yoshida portraits.",
            "negative_prompt": f"{GLOBAL_NEG}, horned helmet, Viking helmet, silver beard, white beard"
        },
        "FFT_B03_04_SPELL_GUARDIAN_ISOMETRIC_CELESTIAL_4x4": {
            "character_id": "spell_guardian",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1zt8MH43UqReQ0NLRo6ZpH6aB2cYXW7Qw", "1zkW0vPzEDy96LYBNz3AVYIxT2NGarMzX"],
            "prompt": f"{FFT_ISO_UNIT_HEADER} 16 isometric frames of Baby Praying Mantis Spell Guardian (32cm chibi emerald mantis #2ECC71, huge warm emerald-gold eyes, pale-gold budding fairy wings #F7C852) across SE/SW/NW/NE hover-march, obsidian shell emergence, Dawn Harmony AoE blessing, polite bow, and 4 Yoshida portraits.",
            "negative_prompt": GLOBAL_NEG
        },
        "FFT_B03_05_FOUR_SHAPESHIFT_SPIRITS_ISOMETRIC_4x4": {
            "character_id": "supporting_npcs_and_spirits",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1zt8MH43UqReQ0NLRo6ZpH6aB2cYXW7Qw"],
            "prompt": f"{FFT_ISO_UNIT_HEADER} 16 isometric tactical summon unit frames for the 4 Shapeshift Spirits: Row 1 str Scroll Spirit (#F6C863/#3B8EA5), Row 2 int Stone Golem (#7E7872/#F4D068), Row 3 float Water Droplet (#4EA8DE), Row 4 bool Truth Gem (#2ECC71/#E74C3C) in SE Idle, SW Move, Tactical Skill Cast, and NW Back-View.",
            "negative_prompt": GLOBAL_NEG
        }
    }
}

def main() -> None:
    parser = argparse.ArgumentParser(description="Compile Track B FFT Isometric SRPG prompts.")
    parser.add_argument(
        "--out",
        type=Path,
        default=PACKS_DIR / "fft_batches_01_to_08_master_prompts.json",
    )
    args = parser.parse_args()
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(FFT_MASTER_BATCHES, indent=2), encoding="utf-8")
    print(f"Wrote {args.out} ({args.out.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
