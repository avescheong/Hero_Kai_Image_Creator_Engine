#!/usr/bin/env python3
"""
Universal Modular Paper-Doll, Socket Rig & 32-Stance Expansion Compiler (`modular_equipment_and_stance_compiler.py`)
Compiles deterministic prompts for Track D (`MOD_BATCH_01` through `MOD_BATCH_08` — 40 sheets total)
into `05_generated_packs/modular_batches_01_to_08_master_prompts.json`.
"""
import argparse
import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PACKS_DIR = REPO_ROOT / "05_generated_packs" / "01_RPG"

STYLE_HEADER = (
    "High-precision 2D hand-drawn fantasy RPG modular game asset sprite sheet, Studio Ghibli and Akira Toriyama "
    "Dragon Quest storybook aesthetic, crisp clean dark sepia-charcoal ink outlines (#3E2B23), vibrant soft "
    "watercolor and cel-shaded gouache colors, consistent studio lighting on a solid pure flat white background (#FFFFFF), "
    "16 evenly spaced cells arranged in 4 rows by 4 columns, completely text-free, no words, no numbers, no labels, "
    "no grid lines, no watermarks."
)

GLOBAL_NEG = (
    "photorealistic, 3D render, CGI, octane render, unreal engine, modern clothing, jeans, sneakers, sunglasses, "
    "cyberpunk, grimdark, horror, bloody, gore, grotesque, distorted anatomy, extra limbs, blurry, low resolution, "
    "screenshot artifacts, crop marks, watermark, text, words, numbers, captions, labels, grid lines, Ember pet, "
    "non-vegetarian meat food"
)

MODULAR_BATCHES = {
    "MOD_BATCH_01_SOCKET_MANNEQUINS_AND_32_STANCE_MATRIX": {
        "MOD_B01_01_KAI_SOCKET_MANNEQUIN_EXPLORATION_STANCES_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN",
                "1w79QHXpZnVN4U04FNIylZp_TWF0cZMz9"
            ],
            "prompt": (
                f"{STYLE_HEADER} Subject in all 16 cells is unarmed socket-ready 11yo Hero Kai (4.0 heads tall, neat tousled sandy golden-blonde hair #D7A84B, expressive cobalt-blue eyes #3B6EA8, wearing base unbleached cream linen tunic #F4EFE6 and trousers tucked into brown leather cuffed boots #6E4226, empty hands with no held weapons so modular items can be socketed in code). "
                "First row (Basic Locomotion): (1) neutral breathing idle 1, (2) relaxed town idle 2 with gentle blink, (3) walk stride left foot forward, (4) walk stride right foot forward. "
                "Second row (Sprint & Jump Takeoff): (5) sprint cycle 1 leaning forward, (6) sprint cycle 2 full stride, (7) deep jump squat takeoff anticipation, (8) mid-air rising jump apex with knees tucked. "
                "Third row (Fall, Land & Alternating Climb): (9) mid-air falling descent pose, (10) soft landing crouch shock absorption, (11) back-view rope ladder climb with left hand high, (12) back-view rope ladder climb with right hand high. "
                "Fourth row (World & Quest Interactions): (13) reaching right hand forward to interact or open a chest, (14) lifting and carrying a heavy object overhead with both hands, (15) leaning forward pushing a heavy stone block or minecart, (16) sitting peacefully cross-legged resting. "
                "Completely text-free, no labels anywhere."
            ),
            "negative_prompt": f"{GLOBAL_NEG}, held sword, held staff, held shield"
        },
        "MOD_B01_02_KAI_SOCKET_MANNEQUIN_COMBAT_AND_CODING_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN",
                "1w79QHXpZnVN4U04FNIylZp_TWF0cZMz9"
            ],
            "prompt": (
                f"{STYLE_HEADER} Subject in all 16 cells is unarmed socket-ready 11yo Hero Kai (4.0 heads tall, neat tousled sandy golden-blonde hair #D7A84B, cobalt-blue eyes #3B6EA8, wearing moss-green cloak #345830 with gold crescent brooch #D4AF37, cream tunic #F4EFE6, green Tzu Chi lotus belt buckle #1F6A38, right-hip brown satchel, left-hip 3-potion holster, with EMPTY closed right-hand socket grip so any modular weapon attaches cleanly). "
                "First row (Empty-Handed Weapon Socket Poses): (1) combat ready stance with empty closed right-hand grip at 45 degrees, (2) melee wind-up backswing pose with empty right-hand grip at 0 degrees vertical, (3) forward melee slash pose with empty right-hand grip extended at 90 degrees horizontal, (4) heavy overhead smash pose with empty right-hand grip at 135 degrees. "
                "Second row (Defense, Throw & Python Coding-IDE Loop): (5) off-hand shield guard brace with left forearm raised forward, (6) forward item/dagger throwing release pose, (7) Python Coding-IDE thinking and typing stance tracing glowing floating runes in mid-air while concentrating, (8) Python spell chant loop raising glowing hand with golden floor aura. "
                "Third row (Spell Release, SyntaxError Fizzle, Item Buff & Hit): (9) thrusting palm forward unleashing a spell burst, (10) comical SyntaxError spell fizzle reaction with harmless puff of grey soot on cheeks and scratching head with a crooked smile, (11) happily eating golden vegetarian honey-bread with green healing sparkles, (12) hit recoil stagger pose. "
                "Fourth row (Status & KO States): (13) stunned and frozen inside flickering magenta-cyan glitch rings, (14) critical low-HP panting on one knee, (15) knocked-out KO lying flat prone on the ground, (16) triumphant level-up victory fanfare pose. "
                "Completely text-free, no labels anywhere."
            ),
            "negative_prompt": f"{GLOBAL_NEG}, baked sword blade in hand"
        },
        "MOD_B01_03_KAI_FFT_ISOMETRIC_SOCKET_MANNEQUIN_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN"],
            "prompt": f"{STYLE_HEADER} 16 Final Fantasy Tactics 2:1 dimetric isometric (30-degree pitch, 45-degree yaw, 3.2 heads tall) unarmed socket-ready mannequin frames of Hero Kai across SE, SW, NW, NE march, walk, empty-handed weapon swing (0/90/135 deg), shield brace, IDE coding stance, SyntaxError soot puff, critical kneel, and prone KO.",
            "negative_prompt": f"{GLOBAL_NEG}, baked sword blade in hand"
        },
        "MOD_B01_04_KAI_CAPYBARA_CHIBI_SOCKET_MANNEQUIN_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1w79QHXpZnVN4U04FNIylZp_TWF0cZMz9"],
            "prompt": f"{STYLE_HEADER} 16 Capybara Go! style squishy 2.2-head chibi unarmed socket-ready mannequin frames of Hero Kai facing right: bouncy idle, waddle walk, empty-handed weapon swing, IDE coding stance, SyntaxError soot puff, saddle-riding pose for mounts, hit squash, and dizzy KO.",
            "negative_prompt": f"{GLOBAL_NEG}, baked sword blade in hand"
        },
        "MOD_B01_05_CAST_IDE_CODING_AND_SYNTAX_ERROR_STANCES_4x4": {
            "character_id": "supporting_npcs_and_spirits",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1gfiJ7wHYfGRs_1t6ortYVeQXNBJk2iMm",
                "1vmgAMIFU-HSW5NpkXsxv2kfLmdtjFZGB",
                "1czQvpJyQ3jO6sA2HrIo55BtCkMOSW252",
                "17okHXa0zAJVZnjrB_UGrSKk5WwkneNd2"
            ],
            "prompt": (
                f"{STYLE_HEADER} 16 companion coding-IDE feedback sprites arranged in 4 rows by 4 columns (Col 1: Watching Player Type Code Attentively, Col 2: Offering Helpful Hint Gesture, Col 3: Comical SyntaxError Soot-Puff Reaction, Col 4: Code Success Celebration Cheer). "
                "Row 1: scruffy golden-tan terrier String (#D89B4C). "
                "Row 2: The Great Wizard in curved indigo hat (#23396C) and silver beard. "
                "Row 3: Grandma Looma (#A89F8D nape bun, ochre blouse) and Ch. 3 Blacksmith (2-horned steel helmet, silver 3-braid beard). "
                "Row 4: Ch. 9 Master Grimsby (hatless, fiery ginger-orange twin-forked beard with brass rings) and Baby Praying Mantis Spell Guardian (#2ECC71). "
                "Completely text-free, no labels anywhere."
            ),
            "negative_prompt": GLOBAL_NEG
        }
    },
    "MOD_BATCH_02_MODULAR_WEAPONS_SHIELDS_AND_VFX_ARSENAL": {
        "MOD_B02_01_MODULAR_SWORDS_AND_BLADES_ARSENAL_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN"],
            "prompt": (
                f"{STYLE_HEADER} 4x4 modular RPG weapon cutout sheet showing 4 canonical swords across 4 synchronized rotation angles from left to right (Col 1: 0-degree vertical icon/idle, Col 2: 45-degree diagonal ready, Col 3: 90-degree horizontal mid-slash, Col 4: 135-degree follow-through cleave, handle grip cleanly visible). "
                "Row 1: Stage 0 carved oak wooden practice sword. "
                "Row 2: Ch. 3 freshly fused gleaming steel IronSword with warm golden '+' weld rune on the crossguard (plus broken two-piece sword state in Col 1). "
                "Row 3: Ch. 9 Master Grimsby's finely balanced glowing silver-cyan Dwarven Wizard's Blade. "
                "Row 4: Ch. 11 Mythic Emerald-and-Gold Tzu Chi Lotus Grand Weaver Paladin Blade. "
                "Completely text-free, no hands holding the hilts, pure standalone weapon cutouts on #FFFFFF."
            ),
            "negative_prompt": f"{GLOBAL_NEG}, hands gripping hilt, character body"
        },
        "MOD_B02_02_MODULAR_HAMMERS_AND_FORGE_TOOLS_4x4": {
            "character_id": "master_grimsby",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1s0Fl8NRWPCc0LcyWU0hgnP__x9Noc5HN",
                "17okHXa0zAJVZnjrB_UGrSKk5WwkneNd2"
            ],
            "prompt": (
                f"{STYLE_HEADER} 4x4 modular RPG hammer and forge tool cutout sheet (standalone weapon/tool cutouts on #FFFFFF, no hands). "
                "Row 1: Ch. 3 Iron Outpost Blacksmith's heavy rectangular forged steel smithing hammer (#6D747E on hardwood shaft #8A623E) across 4 swing angles (0, 45, 90, 135 degrees). "
                "Row 2: Ch. 9 Master Grimsby's octagonal bronze-and-steel Dwarven Rune Hammer inlaid with glowing golden math runes across 4 swing angles (0, 45, 90, 135 degrees). "
                "Row 3: 4 Modular Quest & Forge Tools — articulated iron blacksmith tongs clamping a glowing orange steel bar, heavy iron coal shovel, stiff wooden soot-scrubbing brush, and dwarven mining pickaxe. "
                "Row 4: Mythic rune-carved mossy granite 'int' Golem Earthbreaker Great-Maul across 4 swing angles. "
                "Completely text-free, no labels anywhere."
            ),
            "negative_prompt": f"{GLOBAL_NEG}, hands gripping shaft, character body"
        },
        "MOD_B02_03_MODULAR_STAVES_SHUTTLES_AND_WANDS_4x4": {
            "character_id": "wizard",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1vmgAMIFU-HSW5NpkXsxv2kfLmdtjFZGB",
                "1czQvpJyQ3jO6sA2HrIo55BtCkMOSW252"
            ],
            "prompt": (
                f"{STYLE_HEADER} 4x4 modular RPG staves, weaving shuttles, and magical implements cutout sheet (standalone item cutouts on #FFFFFF, no hands). "
                "Row 1: The Great Wizard's gnarled oak staff (#6B442A) crowned with a floating emerald crystal orb (#2BD980) across 4 angles (0, 45, 90, 135 degrees). "
                "Row 2: Grandma Looma's smooth carved hardwood boat weaving shuttle (#8D5C34) wound with glowing rainbow silk thread across 4 angles. "
                "Row 3: Whispering Forest bioluminescent mossy lantern staff (2 angles) and Ghost Librarian's giant glowing silver '#' feather quill (2 angles). "
                "Row 4: Hooded Signpost-Keeper's brass balance lantern staff (2 angles) and Purified Golden-Emerald Dawn Harmony Scepter (2 angles). "
                "Completely text-free, no labels anywhere."
            ),
            "negative_prompt": f"{GLOBAL_NEG}, hands gripping staff, character body"
        },
        "MOD_B02_04_MODULAR_SHIELDS_SPELLBOOKS_AND_OFFHANDS_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN"],
            "prompt": (
                f"{STYLE_HEADER} 4x4 modular RPG off-hand shields, spellbooks, and lanterns cutout sheet (standalone item cutouts on #FFFFFF, no hands). "
                "Row 1: Iron-rimmed oak round buckler in 4 views (Front Icon, 3/4 Angled Ready, Side Profile Block, Back-Slung View). "
                "Row 2: Golden Sun-Aegis Shield with embossed sun emblem in 4 views (Front Icon, 3/4 Angled Ready, Radiant Golden Block Glow, Back-Slung View). "
                "Row 3: Gleaming silver Dwarven Steel Runic Tower Shield (2 views) and Highland Prismatic Mirror-Glass Shield (2 views). "
                "Row 4: Golden leather-bound Ancient Spellbook (Closed, Half-Open, Levitating Open with Glowing Pages, Rainbow Spell Burst) and Warm Brass Oil Lantern (#F6B74B). "
                "Completely text-free, no labels anywhere."
            ),
            "negative_prompt": GLOBAL_NEG
        },
        "MOD_B02_05_MODULAR_SLASH_ARCS_AND_SPELL_PROJECTILES_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1w79QHXpZnVN4U04FNIylZp_TWF0cZMz9"],
            "prompt": (
                f"{STYLE_HEADER} 4x4 modular RPG weapon swing trail arcs, spell projectiles, and status VFX overlay sheet on pure #FFFFFF white background. "
                "Row 1: 4 crescent weapon slash trail arcs (gleaming silver-white IronSword slash arc, fiery orange forge-spark slash arc, luminous cyan-gold Wizard's Blade slash arc, heavy amber-gold hammer impact shockwave). "
                "Row 2: 4 flying projectiles (golden Python rune throwing dagger, glowing emerald wizard orb bolt, rainbow silk weaving ribbon wave, glowing green healing potion splash). "
                "Row 3: 4 Python operator magic bursts (golden arithmetic forge sparks, glowing cyan double-line truth eye flash, golden vertical colon gate beam, lavender whisper mute bubble). "
                "Row 4: 4 character status overlays (golden hexagonal Sun-Aegis barrier dome, spinning yellow dizzy KO stars, comical grey SyntaxError smoke puff, radiant emerald-gold level-up aura pillar). "
                "Completely text-free, no labels anywhere."
            ),
            "negative_prompt": GLOBAL_NEG
        }
    },
    "MOD_BATCH_03_MODULAR_OUTFITS_ARMOR_AND_CLOAKS_PACK": {
        "MOD_B03_01_KAI_PAPERDOLL_HOODIE_AND_MOSS_CLOAK_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN"],
            "prompt": f"{STYLE_HEADER} 4x4 standalone modular paper-doll clothing and cloak overlay cutouts (no head, no skin, no hands — pure wearable garment cutouts on #FFFFFF) for Hero Kai: Rows 1-2 Stage 0 sage-green pullover hoodie (#7E9C78) and olive trousers (#4E5848) across 8 poses (Front, Side Walk 1, Side Walk 2, Back, Jump, Swing, Crouch, Climb); Rows 3-4 Stage 1/2 deep moss-green woolen cloak (#345830) and cream linen tunic (#F4EFE6) across the exact same 8 poses.",
            "negative_prompt": f"{GLOBAL_NEG}, human face, head, hands, skin"
        },
        "MOD_B03_02_KAI_PAPERDOLL_FOREST_CAMO_AND_SCHOLAR_ROBE_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN"],
            "prompt": f"{STYLE_HEADER} 4x4 standalone modular paper-doll garment cutouts (no head, no hands, no skin) on #FFFFFF: Rows 1-2 Whispering Forest bioluminescent leaf-woven camo cloak across 8 poses; Rows 3-4 Ancient Library starlit indigo-and-silver silent scholar robe across 8 poses.",
            "negative_prompt": f"{GLOBAL_NEG}, human face, head, hands, skin"
        },
        "MOD_B03_03_KAI_PAPERDOLL_SMELTER_APRON_AND_DWARVEN_ARMOR_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1iOM8JakVlEd5WvAroAx30BTwlXmSV2Ae"],
            "prompt": f"{STYLE_HEADER} 4x4 standalone modular paper-doll armor and apron cutouts (no head, no hands, no skin) on #FFFFFF: Rows 1-2 Ch. 9 scorched russet-leather dwarven apprentice smelter apron (#7E4528) over rolled crimson sleeves across 8 poses; Rows 3-4 Stage 3 gleaming silver-grey segmented Dwarven Steel chestplate, shoulder pauldrons, and greaves (#D9E4EC) layered over moss-green cloak across 8 poses.",
            "negative_prompt": f"{GLOBAL_NEG}, human face, head, hands, skin"
        },
        "MOD_B03_04_KAI_PAPERDOLL_LOTUS_PALADIN_AND_SEER_MANTLE_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1iOM8JakVlEd5WvAroAx30BTwlXmSV2Ae"],
            "prompt": f"{STYLE_HEADER} 4x4 standalone modular paper-doll endgame armor cutouts (no head, no hands, no skin) on #FFFFFF: Rows 1-2 Stage 4 Mythic emerald-and-gold Tzu Chi lotus trimmed Arch-Paladin battle mantle (#1F6A38 / #D4AF37) over silver cuirass across 8 poses; Rows 3-4 Ch. 10-11 Highland Truth-Seer twilight-violet & gold mantle across 8 poses.",
            "negative_prompt": f"{GLOBAL_NEG}, human face, head, hands, skin"
        },
        "MOD_B03_05_CAST_VARIANT_OUTFITS_STRING_BLACKSMITH_GRIMSBY_4x4": {
            "character_id": "master_grimsby",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1BXXuk_rC5BFBGSLx6YJ9btBhUjSIBbZL",
                "1ZCN7_0BUoV3TeEeky6hsFW1NWTXpfTke"
            ],
            "prompt": f"{STYLE_HEADER} 4x4 standalone modular outfit & barding cutouts for companions on #FFFFFF: Row 1 String puppy barding (Moss Neckerchief, Looma's Rainbow Scarf, Dwarven Mini-Steel Barding, Academy Gold Ribbon); Row 2 Ch. 3 Blacksmith outfits (Soot-Stained Leather Apron, Ceremonial Chainmail Hauberk, Mountain Bear-Fleece Cape, Guild Vest); Row 3 Ch. 9 Master Grimsby outfits (Runic Smelter Apron #7E4528, Ceremonial Charcoal & Gold Fretwork Guild Coat, Deep Lava Heavy Asbestos Fire-Cloak, Dwarven Champion Plate); Row 4 Grandma Looma & Great Wizard festival/astral mantles.",
            "negative_prompt": f"{GLOBAL_NEG}, human face, head, skin"
        }
    },
    "MOD_BATCH_04_MODULAR_ACCESSORIES_HEADWEAR_AND_BAGS": {
        "MOD_B04_01_SOCKET_HEADWEAR_HELMETS_HATS_AND_CROWNS_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1s0Fl8NRWPCc0LcyWU0hgnP__x9Noc5HN",
                "1vmgAMIFU-HSW5NpkXsxv2kfLmdtjFZGB"
            ],
            "prompt": f"{STYLE_HEADER} 4x4 standalone modular headwear, helmet, and hat cutouts on #FFFFFF (4 angles per row: Front, 3/4 Right, Side Profile, Back): Row 1 Ch. 3 Blacksmith's domed riveted steel helmet (#6E7885) with 2 upward-curving ivory horns (#DDD2BE); Row 2 Great Wizard's tall curved royal-indigo wizard hat (#23396C) with gold band (#E6A832); Row 3 Dwarven Steel crested battle helm (2 views) & Whispering Forest glowing leaf circlet (2 views); Row 4 Sunnybrook straw harvest hat, cozy winter ear-flap cap, Academy scholar beret, and Golden Crown of Harmony.",
            "negative_prompt": f"{GLOBAL_NEG}, head, face, hair"
        },
        "MOD_B04_02_SOCKET_EYEWEAR_GOGGLES_AND_FACE_RUNES_4x4": {
            "character_id": "grandma_looma",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1czQvpJyQ3jO6sA2HrIo55BtCkMOSW252",
                "17okHXa0zAJVZnjrB_UGrSKk5WwkneNd2"
            ],
            "prompt": f"{STYLE_HEADER} 4x4 standalone modular eyewear, forge goggles, and magical face visor cutouts on #FFFFFF: Row 1 Grandma Looma's small round wire reading glasses (#555A5E) in Front, 3/4, Side, and Hanging on Tan Leather Neck Cord; Row 2 Great Wizard's gold wire-rim half-moon spectacles in 4 angles; Row 3 Master Grimsby's brass-rimmed ember-tinted dwarven forge goggles (Over Eyes Front, Over Eyes 3/4, Pushed Up on Leather Forehead Strap, Side); Row 4 Spell 10 SIGHT glowing cyan-gold parallel-line visor (2 views) & Spell 7 glowing silver '#' whisper emblem (2 views).",
            "negative_prompt": f"{GLOBAL_NEG}, human face, head"
        },
        "MOD_B04_03_SOCKET_NECKWEAR_BROOCHES_SCARVES_AND_COLLARS_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN",
                "1BXXuk_rC5BFBGSLx6YJ9btBhUjSIBbZL"
            ],
            "prompt": f"{STYLE_HEADER} 4x4 standalone modular neck clasps, scarves, and pet collars cutouts on #FFFFFF: Row 1 Hero Kai's golden crescent moon cloak brooch (#D4AF37) in 4 angles; Row 2 Grandma Looma's colorful striped hand-woven Pythonia scarf in 4 angles; Row 3 String's sky-blue collar with gold bell (2 views) and Ch. 8 brown leather collar with glowing cyan-teal 'str' crystal shard (#3B8EA5, 2 views); Row 4 Emerald-Gold Tzu Chi lotus neck talisman, Master Grimsby's engraved golden-brass beard rings (#D4A23C), and warm fur collar.",
            "negative_prompt": GLOBAL_NEG
        },
        "MOD_B04_04_SOCKET_BELTS_BUCKLES_SATCHELS_AND_POTIONS_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": ["1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN"],
            "prompt": f"{STYLE_HEADER} 4x4 standalone modular belts, buckles, hip satchels, and potion holsters cutouts on #FFFFFF: Row 1 Hero Kai's brown leather belt with the emerald-green Tzu Chi lotus and white Dharma ship medallion buckle (#1F6A38 / #C29B38) in 4 angles; Row 2 Right-Hip plain closed rectangular brown leather satchel (Idle, Motion Bounce, Open Flap, Gold-Trimmed Master Satchel); Row 3 Left-Hip 3-slot leather potion holster with corked round glass vials (All 3 Vials: Emerald #2ECC71 + Ruby #E74C3C + Sapphire #3A86FF, 2 Vials Remaining, 1 Vial Remaining, Empty 3-Slot Holster); Row 4 Master Grimsby's brass-riveted smithing tool belt with calipers/tongs and diagonal chest baldric strap.",
            "negative_prompt": GLOBAL_NEG
        },
        "MOD_B04_05_SOCKET_BACKPACKS_SCABBARDS_AND_WINGS_4x4": {
            "character_id": "kai",
            "aspect_ratio": "1:1",
            "grid_layout": "4x4",
            "reference_drive_ids": [
                "1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN",
                "1zt8MH43UqReQ0NLRo6ZpH6aB2cYXW7Qw"
            ],
            "prompt": f"{STYLE_HEADER} 4x4 standalone modular back-slot scabbards, backpacks, baskets, and wings cutouts on #FFFFFF: Row 1 Hero Kai's diagonal laurel-vine carved oak back scabbard (With IronSword Hilt, With Glowing Wizard's Blade Hilt, Empty Scabbard Back View, Empty Scabbard Side View); Row 2 Adventurer's canvas backpack with rolled green blanket and hanging brass oil lantern in 4 angles; Row 3 Grandma Looma's wicker basket of rainbow yarn spools (2 views) & Sunnybrook wooden harvest backpack crate (2 views); Row 4 Baby Mantis Spell Guardian's translucent pale-gold budding fairy wing petals (#F7C852, 2 views) & Bug King's translucent magenta-veined insectoid wings (2 views).",
            "negative_prompt": GLOBAL_NEG
        }
    }
}

def main() -> None:
    parser = argparse.ArgumentParser(description="Compile Track D modular equipment & 32-stance prompts.")
    parser.add_argument(
        "--out",
        type=Path,
        default=PACKS_DIR / "modular_batches_01_to_08_master_prompts.json",
    )
    args = parser.parse_args()
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(MODULAR_BATCHES, indent=2), encoding="utf-8")
    print(f"Wrote {args.out} ({args.out.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
