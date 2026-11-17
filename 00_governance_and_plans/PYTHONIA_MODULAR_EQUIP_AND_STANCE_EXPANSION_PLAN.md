# Hero Kai: Scrolls of Pythonia — Universal Modular Paper-Doll, Socket Rig & Exhaustive 32-Stance Expansion Plan (v1.0)

**Target Workspace**: [`Kai Asset For RPG`](https://drive.google.com/drive/folders/1ampGrS0JM8joJjLeULudV8tKjfgFzzO2)
**Master Inventory & Checklist Ledger**: [`AGENT.md`](https://drive.google.com/file/d/1X9RdewZNnZrr0ug_hGT-9zWyrC3MqikM/view?usp=drivesdk)
**Canonical Source Vaults**: [`001_Kai_Assets`](https://drive.google.com/drive/folders/1vLC13sHopidqHhvoQZFQxuNWXLDC8gjg) · [`Story_Website` (Gold-Standard Hero Kai Reference)](https://drive.google.com/drive/folders/1y56ALXDfFmEL8FztXiMuLmyNA3xmCMcc) · [`02_Source_Assets/Characters` (Canonical Model Sheets)](https://drive.google.com/drive/folders/1l1-X7ZW7bPhSxn8WCUHB_P9yoWz-6JRp)
**Engine Subfolders**: [`01_character_genomes`](https://drive.google.com/drive/folders/1sQZ8BW_8RZcP76uJbnS46z0hClfXoKGd) · [`03_graphics_adapters`](https://drive.google.com/drive/folders/1zYLJtPGZ1cOAXfFR49Nm8yGkSD5fWyNr) · [`04_postprocess_and_acve`](https://drive.google.com/drive/folders/1ROmTrMNsgsEh3iu_pAOL_TunZbl-plS4) · [`05_generated_packs`](https://drive.google.com/drive/folders/1nG2O5g9LijALOEC7duNGyxiKbo8jJ7rU)

## 1. Executive Architecture: How to Equip Any Future Weapon, Outfit, or Accessory & Add Missing Actions with ZERO Base Regeneration

When building a full RPG across **Track A (128-Bit HD-2D)**, **Track B (Final Fantasy Tactics Isometric)**, and **Track C (Capybara Go! Chibi)**, two issues commonly force developers to regenerate character sheets repeatedly:
1. **Baked-In Equipment Problem**: If a sword, hammer, shield, or cloak is permanently painted into the character's hand/body in a sprite sheet, unlocking a new weapon or accessory requires regenerating the entire character sheet—risking facial or proportion drift.
2. **Missing Gameplay Stances Problem**: Standard 16-frame sheets cover basic walk and slash, but mid-development you discover the game needs **Jump Takeoff vs. Falling**, **2-Frame Alternating Ladder Climb**, **Empty-Handed Grip**, **Lifting/Pushing Quest Objects**, **Active Python IDE Typing Loop**, or a **Comical `SyntaxError` Spell Fizzle**.

To guarantee **100% compatibility with the 20 sheets already generated in [`05_generated_packs`](https://drive.google.com/drive/folders/1nG2O5g9LijALOEC7duNGyxiKbo8jJ7rU)** while eliminating future character re-generations, **Track D** introduces a **7-Layer Z-Index Compositing Stack**, a **9-Socket Bone/Anchor Rig (`universal_socket_rig_and_stance_schema.json`)**, and an **Exhaustive 32-Stance Action Taxonomy**.

### 1.1 The 7-Layer Z-Index Compositing Stack (Inside Every `256×256 px` Cell)

All existing and future `4×4` sheets (`1024×1024 px`, `256×256 px` per cell, bottom-center foot pivot `[0.5, 1.0]` for HD-2D, `[0.5, 0.88]` for FFT Isometric, `[0.5, 0.92]` for Capybara Go! Chibi) composite in 7 deterministic Z-layers:

| Z-Layer | Layer ID | What Renders on This Layer | Why It Eliminates Regeneration |
| :--- | :--- | :--- | :--- |
| **`Z=0`** | `SLOT_BACK_CAPE_AND_SCABBARD` | Back-slung scabbard (`IronSword`/`Wizard's Blade`), flowing cloak back, backpack, wicker basket, or fairy/boss wings | Swap back-mounted gear or wings independently behind the body |
| **`Z=1`** | `SLOT_OFFHAND_REAR` | Rear hand tool, lantern, or dual-wield weapon when angled behind the torso | Cleanly tucks behind the torso without manual masking |
| **`Z=2`** | `BASE_SOCKET_MANNEQUIN` | **Canonical Unarmed Character Body & Head** across the 32-Stance Matrix (hands drawn in clean closed/open socket grips with **NO baked-in weapon**) | **Generated ONCE per character—never regenerated when weapons, armor, or accessories change** |
| **`Z=3`** | `SLOT_TORSO_OUTFIT` | Transparent `4×4` paper-doll clothing/armor overlays (`Sage Hoodie`, `Moss Cloak`, `Silver Dwarven Steel Cuirass`, `Smelter Apron`, `Lotus Paladin Mantle`) | Fits pixel-for-pixel over `Z=2` across all 16 cell poses |
| **`Z=4`** | `SLOT_WAIST_AND_HIPS` | Belt buckles & asymmetric hip gear (`Tzu Chi Emerald Lotus Buckle #1F6A38`, `Right-Hip Plain Brown Satchel`, `Left-Hip 3-Potion Holster`, `Dwarven Tool Belt`) | Lets Kai upgrade belts, satchels, and potion counts dynamically |
| **`Z=5`** | `SLOT_HEAD_AND_NECK` | Hats, helmets, glasses, scarves & brooches (`Golden Crescent Brooch #D4AF37`, `Looma's Striped Scarf`, `Grimsby's Forge Goggles`, `SIGHT == Visor`, `# Mute Seal`) | Pinned to `ANCHOR_HEAD` and `ANCHOR_NECK` coordinates per frame |
| **`Z=6`** | `SLOT_MAINHAND_AND_SHIELD` | Modular weapons (`Swords`, `Hammers`, `Staves`, `Shuttles`) & front shields (`Sun-Aegis`) + `Z=7` slash trail VFX | Pinned to `ANCHOR_HAND_R (x, y, angle_deg)` and `ANCHOR_HAND_L (x, y, angle_deg)` |

### 1.2 The 9 Standardized Socket Anchor Points (Retrofitted to Existing Batches 1–4)

Every cell (`0..15`) in our `256×256 px` grid exposes 9 normalized socket coordinates `(dx, dy, angle_deg)` relative to the bottom-center foot pivot `[128, 240]`:

1. **`ANCHOR_FOOT_PIVOT` (`[128, 240]`, `0°`)**: Ground shadow, isometric tile diamond, and under-foot Python spell chant rings (`FMT03`, `B02_03`, `FFT_B01_05`).
2. **`ANCHOR_HAND_R_MAIN` (`[dx, dy, angle_deg]`)**: Primary weapon grip socket. Every modular weapon cutout is drawn with its **pommel/handle grip at `[64, 192]` (`[0.25, 0.75]`)** so rotating and translating the weapon to `ANCHOR_HAND_R_MAIN` snaps the hilt directly into Kai's, Blacksmith's, or Grimsby's fist!
3. **`ANCHOR_HAND_L_OFF` (`[dx, dy, angle_deg]`)**: Off-hand shield (`Sun-Aegis`), lantern, `Ancient Spellbook`, iron tongs, or potion vial socket.
4. **`ANCHOR_HEAD_TOP` (`[dx, dy, angle_deg]`)**: Helmets, wizard hats, circlets, forge goggles on forehead, and status icons (`Stun Stars`, `Level-Up Crown`).
5. **`ANCHOR_EYES_FACE` (`[dx, dy, angle_deg]`)**: Reading glasses (`Grandma Looma`), half-moon spectacles (`Great Wizard`), `Spell 10 SIGHT (==)` cyan-gold visor, and `Spell 7 (#)` cheek mute mark.
6. **`ANCHOR_NECK_CLASP` (`[dx, dy, angle_deg]`)**: Kai's golden crescent moon brooch (`#D4AF37`), Looma's striped woven scarf, and String's sky-blue bell / `str` crystal collar (`#3B8EA5`).
7. **`ANCHOR_CHEST_PAULDRON` (`[dx, dy, angle_deg]`)**: Segmented Dwarven Steel chestplate/pauldrons (`#D9E4EC`) and guild emblems.
8. **`ANCHOR_WAIST_HIP` (`[dx, dy, angle_deg]`)**: Center Tzu Chi lotus belt buckle (`#1F6A38`), right-hip plain brown satchel, and left-hip 3-potion holster (`#2ECC71`, `#E74C3C`, `#3A86FF`).
9. **`ANCHOR_BACK_MOUNT` (`[dx, dy, angle_deg]`)**: Diagonal oak scabbard, backpacks, wicker yarn baskets, and budding fairy wings (`#F7C852`).

## 2. Deep-Research Audit: The Complete 32-Stance Universal RPG Action Taxonomy (Zero Missed Actions)

By cross-referencing platformer physics (MapleStory / Hollow Knight), HD-2D RPGs (Octopath / Chrono Trigger), Tactical SRPGs (Final Fantasy Tactics), Auto-Battlers (Capybara Go!), and **Scrolls of Pythonia's** interactive coding curriculum (Chapters 1–11), below are the **32 Mandatory Character Stances & Actions**—highlighting the **14 critical game states that are usually missed** in basic sprite packs and are now locked into **Track D**:

### 2.1 Sheet Topology A — Basic, Platforming & World-Interaction Stances (States `01`–`16`)
| Cell # | Row / Col | Stance / Action Name | Game Engine Trigger & Keybind | Why It Is Essential (And Fits Existing Assets) |
| :--- | :--- | :--- | :--- | :--- |
| **Cell 0** | `R0, C0` | **01. Neutral Breathing Idle 1** | Default standing frame (`0.0s`) | Matches `FMT03` Cell 0 baseline (`[128, 240]`) |
| **Cell 1** | `R0, C1` | **02. Relaxed Breathing Idle 2 (Chest Rise / Blink)** | Idle loop frame (`0.5s`) | Keeps characters alive during dialogue & cutscenes |
| **Cell 2** | `R0, C2` | **03. Walk Stride Contact (Left Foot Forward)** | `A / D` or `Left / Right` | Seamless loop with `FMT03` & `B03` walk cycles |
| **Cell 3** | `R0, C3` | **04. Walk Stride Passing (Right Foot Forward)** | `A / D` or `Left / Right` | Seamless 4-frame walk cycle when paired with Idle/Contact |
| **Cell 4** | `R1, C0` | **05. Sprint / Dash Cycle 1 (20° Forward Lean)** | `Shift + A/D` | Fast traversal across multi-screen maps |
| **Cell 5** | `R1, C1` | **06. Sprint / Dash Cycle 2 (Full Stride Extension)** | `Shift + A/D` | Cloak streams horizontally for speed feedback |
| **Cell 6** | `R1, C2` | **07. Jump Squat / Takeoff Anticipation** *(NEW)* | `Spacebar` (Frame 1, `80ms`) | Essential for snappy jump feel and compressing the `B04_05` Mushroom Spring! |
| **Cell 7** | `R1, C3` | **08. Mid-Air Rising Jump Apex** | `Spacebar` (`vz > 0`) | Knees tucked, arms poised while ascending |
| **Cell 8** | `R2, C0` | **09. Mid-Air Falling / Gliding Descent** *(NEW)* | Airborne (`vz < 0`) | Prevents stiff "frozen statue" drops off sky-ledges (`Row 2` of `B04_05`) |
| **Cell 9** | `R2, C1` | **10. Landing Crouch / Shock Absorption** *(NEW)* | Ground impact (`100ms`) | Connects falling physics cleanly back to idle/run |
| **Cell 10** | `R2, C2` | **11. Rope / Ladder Climb — Left Hand High (Back)** | `W / S` on `B04_05` Rope Ladder | Frame 1 of alternating climb cycle |
| **Cell 11** | `R2, C3` | **12. Rope / Ladder Climb — Right Hand High (Back)** *(NEW)* | `W / S` on `B04_05` Rope Ladder | Frame 2 of alternating climb cycle (fixes single-frame sliding!) |
| **Cell 12** | `R3, C0` | **13. Interact / Reach Out Hand (`F` Key)** *(NEW)* | `F` near Chests (`B04_03`), Loom, or NPCs | Used for opening Ruby/Sapphire/Gold chests, pulling levers, and petting String |
| **Cell 13** | `R3, C1` | **14. Lift / Carry Heavy Object Overhead** *(NEW)* | Ch. 8 Harvest Crate / Ch. 9 Slag Bucket | Required for Master Grimsby's Ch. 9 Backbone Challenge (hauling coal/slag!) |
| **Cell 14** | `R3, C2` | **15. Push / Brace Against Heavy Object** *(NEW)* | Pushing `B04_04` Minecart or Stone Block | Required for dungeon block puzzles and minecart tracks |
| **Cell 15** | `R3, C3` | **16. Sit / Rest / Scrub Soot / Campfire Pose** *(NEW)* | Rest Node / Ch. 9 Brick Scrubbing | Used at campfires, benches, and scrubbing soot bricks in Ch. 9 |

### 2.2 Sheet Topology B — Socket-Ready Combat, Python Coding-IDE & Status Stances (States `17`–`32`)
| Cell # | Row / Col | Stance / Action Name | Game Engine Trigger & Keybind | Why It Is Essential (And Fits Existing Assets) |
| :--- | :--- | :--- | :--- | :--- |
| **Cell 0** | `R0, C0` | **17. Unarmed Combat Ready Stance (Socket Grip)** *(NEW)* | Battle Start (Weapon Socket `0°/45°`) | Right hand is drawn in a clean closed grip so **any modular weapon attaches cleanly** |
| **Cell 1** | `R0, C1` | **18. Unarmed Melee Wind-Up (Backswing Socket)** *(NEW)* | `P` Key Frame 1 (`ANCHOR_HAND_R` `0°`) | Universal wind-up pose for Swords, Hammers, Shuttles, or Staves |
| **Cell 2** | `R0, C2` | **19. Unarmed Melee Forward Slash (Mid-Swing Socket)** *(NEW)* | `P` Key Frame 2 (`ANCHOR_HAND_R` `90°`) | Universal forward swing pose for any socketed weapon |
| **Cell 3** | `R0, C3` | **20. Unarmed Heavy Overhead Smash (Crit Socket)** *(NEW)* | `P` Combo Finisher (`ANCHOR_HAND_R` `135°`) | Universal heavy cleave/hammer anvil strike pose |
| **Cell 4** | `R1, C0` | **21. Off-Hand Shield Block / Guard Brace** | Hold `S` / Guard (`ANCHOR_HAND_L`) | Fits `Sun-Aegis Shield`, `Oak Buckler`, or `Mirror Shield` |
| **Cell 5** | `R1, C1` | **22. Throw Potion / Dagger / Shuttle Release** *(NEW)* | `Q` / Item Throw | Used when tossing healing vials, daggers, or silk thread |
| **Cell 6** | `R1, C2` | **23. Python Coding-IDE "Thinking & Typing" Stance** *(NEW)* | **Active while student types code in IDE!** | Kai holds glowing Spellbook/Scroll and traces floating runes while player writes Python |
| **Cell 7** | `R1, C3` | **24. Python Spell Chant Loop (Aura Charge)** | `Run Code` / `E` Key Frame 1 | Connects to under-foot spell rings (`FFT_B01_05`) |
| **Cell 8** | `R2, C0` | **25. Python Spell Forward Release Burst** | `Run Code` Valid Execution (`print()`, `==`) | Fires spell beam / summons spirits |
| **Cell 9** | `R2, C1` | **26. `SyntaxError` / Spell Fizzle Comedy Reaction** *(NEW)* | **Triggered when student's Python code errors!** | Friendly puff of soot on cheeks + scratching head with a '?' rune—makes debugging fun! |
| **Cell 10** | `R2, C2` | **27. Drink Potion / Eat Vegetarian Bread Buff** *(NEW)* | Using `B04_04` / `CG_B07_03` Veg Food or Vial | Restores HP/Mana with warm golden-green sparkles |
| **Cell 11** | `R2, C3` | **28. Hit / Damage Recoil Stagger** | Taking enemy attack damage | Universal knockback frame |
| **Cell 12** | `R3, C0` | **29. Stunned / Glitch-Frozen / Tangled State** *(NEW)* | Hit by Boss Glitch Thorn or Mirage | Surrounded by flickering magenta/cyan glitch rings |
| **Cell 13** | `R3, C1` | **30. Critical Low-HP Panting on One Knee (`HP < 20%`)** *(NEW)* | Low HP warning state | Matches FFT & JRPG classic low-health kneel |
| **Cell 14** | `R3, C2` | **31. Knocked-Out (`KO`) Prone Defeated State** *(NEW)* | `HP == 0` | Essential for battle defeat / revival mechanics |
| **Cell 15** | `R3, C3` | **32. Level-Up / Stage Clear Victory Fanfare** | Quest / Boss Cleared | Raises main-hand socket high in triumph |

## 3. Master 8-Batch Modular Equipment, Accessories & Stance Expansion Schedule (`Track D: MOD_BATCH_01` to `MOD_BATCH_08` — 40 Sheets)

All 8 batches below are pre-compiled by [`03_graphics_adapters/modular_equipment_and_stance_compiler.py`](https://drive.google.com/drive/folders/1zYLJtPGZ1cOAXfFR49Nm8yGkSD5fWyNr) into `05_generated_packs/modular_batches_01_to_08_master_prompts.json` and tracked in [`AGENT.md`](https://drive.google.com/file/d/1X9RdewZNnZrr0ug_hGT-9zWyrC3MqikM/view?usp=drivesdk):

### Modular Batch 1 (`MOD_B01`): Hero Kai Socket-Ready Base Mannequins & Complete 32-Stance Matrix (5 Sheets)
| Sheet ID | Grid & Aspect | Target Genome & Anchor IDs | Exact 16-Cell (`4×4`) Content Breakdown |
| :--- | :--- | :--- | :--- |
| **`MOD_B01_01_KAI_SOCKET_MANNEQUIN_EXPLORATION_STANCES_4x4`** | `4×4` (`1:1`) | `kai` (`1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN`, `1w79QHXpZnVN4U04FNIylZp_TWF0cZMz9`) | **States `01–16` (Unarmed Socket-Ready Hero Kai in Base Cream Linen Undertunic `#F4EFE6` & Cuffed Boots `#6E4226`)**:<br>**Row 1**: Idle 1, Idle 2, Walk Contact, Walk Passing.<br>**Row 2**: Sprint 1, Sprint 2, **Jump Squat Takeoff**, **Mid-Air Rising Jump Apex**.<br>**Row 3**: **Mid-Air Falling Descent**, **Landing Crouch**, **Climb Left Hand Up**, **Climb Right Hand Up**.<br>**Row 4**: **`F`-Key Interact Reach**, **Lift/Carry Heavy Object Overhead**, **Push/Brace Heavy Block**, **Sit/Rest/Scrub Soot**. |
| **`MOD_B01_02_KAI_SOCKET_MANNEQUIN_COMBAT_AND_CODING_4x4`** | `4×4` (`1:1`) | `kai` (`1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN`, `1w79QHXpZnVN4U04FNIylZp_TWF0cZMz9`) | **States `17–32` (Unarmed Socket-Ready Hero Kai — Empty Closed Right-Hand Grip for Weapon Socketing)**:<br>**Row 1**: Unarmed Ready, Unarmed Wind-Up (`0°`), Unarmed Forward Swing (`90°`), Unarmed Overhead Smash (`135°`).<br>**Row 2**: Off-Hand Shield Brace, Throw Item/Dagger, **Python IDE Thinking/Typing Stance**, Spell Chant Loop.<br>**Row 3**: Spell Release Burst, **`SyntaxError` Smoke Fizzle Reaction**, **Eat Veg Bread / Drink Potion**, Hit Recoil.<br>**Row 4**: **Glitch-Stunned State**, **Critical Low-HP One-Knee Kneel**, **Prone KO Defeated**, Victory Fanfare. |
| **`MOD_B01_03_KAI_FFT_ISOMETRIC_SOCKET_MANNEQUIN_4x4`** | `4×4` (`1:1`) | `kai` (`1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN`) | **Track B (`2:1` Isometric `3.2H`) Unarmed Socket-Ready Mannequin for Hero Kai**:<br>**Row 1**: `SE` & `SW` Unarmed March & Walk.<br>**Row 2**: `NW` & `NE` Unarmed Back March & Elevation Jump.<br>**Row 3**: `SE` & `SW` Empty-Handed Weapon Swing (`0°/90°/135°`) & Shield Brace.<br>**Row 4**: Isometric IDE Coding Stance, `SyntaxError` Fizzle, Critical Kneel, Prone KO. |
| **`MOD_B01_04_KAI_CAPYBARA_CHIBI_SOCKET_MANNEQUIN_4x4`** | `4×4` (`1:1`) | `kai` (`1w79QHXpZnVN4U04FNIylZp_TWF0cZMz9`) | **Track C (`2.2H` Squishy Chibi) Unarmed Socket-Ready Mannequin for Hero Kai (facing right `->`)**:<br>**Row 1**: Bouncy Squish Idle, Stretch Idle, Waddle 1, Waddle 2.<br>**Row 2**: Empty-Handed Wind-Up, Forward Swing, Jumping Crit Pose, Throw Pose.<br>**Row 3**: Chibi IDE Coding Stance, 100-Rage Charge, `SyntaxError` Soot Puff, Veg Bread Chew.<br>**Row 4**: Saddle-Riding Base Pose (fits any Mount!), Hit Squash `><`, Dizzy KO, Victory Jump. |
| **`MOD_B01_05_CAST_IDE_CODING_AND_SYNTAX_ERROR_STANCES_4x4`** | `4×4` (`1:1`) | `string`, `wizard`, `grandma_looma`, `master_grimsby` | **16 Pedagogical Coding-IDE Companion Reactions (4 Characters × 4 States: `Watching Code Typing`, `Hint Pointing`, `SyntaxError Comedy Reaction`, `Code Pass Celebration`)**:<br>**Row 1**: Loyal Terrier String.<br>**Row 2**: The Great Wizard.<br>**Row 3**: Grandma Looma & Ch. 3 Blacksmith.<br>**Row 4**: Ch. 9 Master Grimsby & Baby Mantis Spell Guardian. |

### Modular Batch 2 (`MOD_B02`): Master Modular Weapons Arsenal — Swords, Hammers, Staves, Shields & Slash Trails (5 Sheets · 80 Cutouts)
*Every weapon row presents the weapon in **4 synchronized socket angles** (`Col 1: 0° Vertical Idle/Icon`, `Col 2: 45° Diagonal Ready`, `Col 3: 90° Horizontal Mid-Swing`, `Col 4: 135° Overhead Smash/Follow-Through`) with handle grip locked at `[0.25, 0.75]` on a pure `#FFFFFF` background for instant alpha extraction.*

| Sheet ID | Grid & Aspect | Compatible Characters | Exact 16-Cell (`4×4`) Weapon Cutout Inventory |
| :--- | :--- | :--- | :--- |
| **`MOD_B02_01_MODULAR_SWORDS_AND_BLADES_ARSENAL_4x4`** | `4×4` (`1:1`) | Hero Kai, Blacksmith, Master Grimsby | **Row 1**: Oak Training Sword (`Stage 0`).<br>**Row 2**: Two Broken Iron Sword Halves (`Ch. 1–2`) + Freshly Fused Gleaming `IronSword` (`Ch. 3+` with `+` weld glow).<br>**Row 3**: Master Grimsby's Balanced Glowing `Wizard's Blade` (`Ch. 9+` silver-cyan runic fuller).<br>**Row 4**: Mythic Emerald-Gold `Grand Weaver Lotus Blade` (`Ch. 11` endgame sword). |
| **`MOD_B02_02_MODULAR_HAMMERS_AND_FORGE_TOOLS_4x4`** | `4×4` (`1:1`) | Blacksmith, Master Grimsby, Hero Kai | **Row 1**: Ch. 3 Blacksmith's Heavy Rectangular Steel Forging Hammer (`#6D747E`) across 4 swing angles.<br>**Row 2**: Ch. 9 Master Grimsby's Octagonal Bronze-and-Steel Dwarven Rune Hammer (`+ - * /` glowing runes) across 4 swing angles.<br>**Row 3**: Forge Work Tools — Articulated Iron Tongs clamping glowing steel, Long-Handled Coal Shovel, Stiff Soot Scrubbing Brush, Dwarven Pickaxe.<br>**Row 4**: Mythic `int` Golem Earthbreaker Great-Maul across 4 swing angles. |
| **`MOD_B02_03_MODULAR_STAVES_SHUTTLES_AND_WANDS_4x4`** | `4×4` (`1:1`) | Great Wizard, Grandma Looma, NPCs, Hero Kai | **Row 1**: Great Wizard's Gnarled Oak Staff crowned with Floating Emerald Crystal Orb (`#2BD980`) across 4 cast angles.<br>**Row 2**: Grandma Looma's Smooth Carved Hardwood Boat Weaving Shuttle (`#8D5C34`) trailing glowing rainbow Comma (`,`) silk across 4 angles.<br>**Row 3**: Whispering Forest Bioluminescent Moss-Lantern Staff & Ghost Librarian's Giant Silver `#` Feather Quill.<br>**Row 4**: Signpost-Keeper's Brass Balance Lantern Staff & Purified Golden-Emerald Harmony Scepter. |
| **`MOD_B02_04_MODULAR_SHIELDS_SPELLBOOKS_AND_OFFHANDS_4x4`** | `4×4` (`1:1`) | Hero Kai, Blacksmith, Grimsby, Wizard | **Row 1**: Iron-Rimmed Oak Round Buckler (`Idle`, `Angled Guard`, `Front Block`, `Back-Slung`).<br>**Row 2**: Golden `Sun-Aegis Shield` (`Idle`, `Angled Guard`, `Radiant Sunburst Block`, `Back-Slung`).<br>**Row 3**: Dwarven Runic Steel Tower Shield & Highland Prismatic Mirror Shield (`Ch. 10`).<br>**Row 4**: Off-Hand Tools — Golden `Ancient Spellbook` (`Closed`, `Half-Open`, `Levitating Open`, `Glowing Rune Cast`) + Warm Brass Oil Lantern (`#F6B74B`). |
| **`MOD_B02_05_MODULAR_SLASH_ARCS_AND_SPELL_PROJECTILES_4x4`** | `4×4` (`1:1`) | All Combat Units | **Row 1**: 4 Melee Swing Arc Overlays (`Silver IronSword Arc`, `Orange + Fuse Flame Arc`, `Cyan-Gold Wizard's Blade Arc`, `Heavy Amber Hammer Shockwave`).<br>**Row 2**: 4 Ranged Projectiles (`Golden Python Rune Dagger`, `Emerald Wizard Orb Bolt`, `Rainbow Silk Comma Ribbon`, `Glowing Corked Potion Vial`).<br>**Row 3**: 4 Coding Operator Impact Bursts (`+ - * /` Arithmetic Sparks, `==` Cyan Truth Lens Flash, `:` Golden Colon Gate Beam, `#` Lavender Mute Bubble).<br>**Row 4**: 4 Status Overlays (`Sun-Aegis Hex Barrier`, `Dizzy KO Spiral Stars`, `SyntaxError Grey Smoke Puff`, `Golden Level-Up Pillar`). |

### Modular Batch 3 (`MOD_B03`): Master Modular Outfits, Armor Sets & Cloaks Paper-Doll Pack (5 Sheets · 80 Cutouts)
*Synchronized 16-cell paper-doll clothing/armor overlays (`Z=3`) that layer directly over the `Z=2` base mannequins.*

* **`MOD_B03_01_KAI_PAPERDOLL_HOODIE_AND_MOSS_CLOAK_4x4`**: Row 1–2: `Stage 0 Sage-Green Casual Hoodie (#7E9C78)` across 8 key exploration/combat poses; Row 3–4: `Stage 1/2 Deep Moss-Green Woolen Cloak (#345830)` across 8 key exploration/combat poses.
* **`MOD_B03_02_KAI_PAPERDOLL_FOREST_CAMO_AND_SCHOLAR_ROBE_4x4`**: Row 1–2: `Ch. 4 Whispering Woods Bioluminescent Leaf-Woven Cloak`; Row 3–4: `Ch. 7 Ancient Library Starlit Indigo-and-Silver Silent Scholar Robe`.
* **`MOD_B03_03_KAI_PAPERDOLL_SMELTER_APRON_AND_DWARVEN_ARMOR_4x4`**: Row 1–2: `Ch. 9 Scorched Leather Apprentice Smelter Apron (#7E4528) & Rolled Sleeves`; Row 3–4: `Stage 3 Gleaming Silver-Grey Segmented Dwarven Steel Chestplate, Pauldrons & Greaves (#D9E4EC)`.
* **`MOD_B03_04_KAI_PAPERDOLL_LOTUS_PALADIN_AND_SEER_MANTLE_4x4`**: Row 1–2: `Stage 4 Mythic Emerald-and-Gold Tzu Chi Lotus Arch-Paladin Mantle (#1F6A38 / #D4AF37)`; Row 3–4: `Ch. 10–11 Highland Truth-Seer Twilight Cloak`.
* **`MOD_B03_05_CAST_VARIANT_OUTFITS_STRING_BLACKSMITH_GRIMSBY_4x4`**: Row 1: **String** (`Moss Neckerchief`, `Looma's Rainbow Scarf`, `Dwarven Mini-Plate Barding`, `Academy Gold Ribbon`); Row 2: **Ch. 3 Blacksmith** (`Default Leather Apron`, `Ceremonial Guild Chainmail Hauberk`, `Mountain Bear-Fleece Travel Cloak`, `Master Forgeman Tunic`); Row 3: **Ch. 9 Master Grimsby** (`Default Runic Smelter Apron`, `Ceremonial Charcoal & Gold Fretwork Guild Coat`, `Deep Lava Tunnel Heavy Asbestos Fire-Cloak`, `Dwarven Champion Plate`); Row 4: **Grandma Looma & Great Wizard** (`Festival Shawl`, `High Archmage White-Gold Astral Mantle`).

### Modular Batch 4 (`MOD_B04`): Master Modular Accessories — Headwear, Glasses, Clasps, Belts, Satchels & Backpacks (5 Sheets · 80 Cutouts)
*Socket-ready accessory cutouts (`Z=0`, `Z=4`, `Z=5`) drawn at `Front`, `3/4 Right`, `Side Profile`, and `Back` angles.*

* **`MOD_B04_01_SOCKET_HEADWEAR_HELMETS_HATS_AND_CROWNS_4x4`**: (1–4) `Ch. 3 Blacksmith's 2-Horned Riveted Steel Helmet (#6E7885 / #DDD2BE)` in 4 angles; (5–8) `Great Wizard's Curved Indigo Pointed Hat (#23396C)` in 4 angles; (9–12) `Dwarven Steel Runic Helm & Whispering Forest Leaf Circlet`; (13–16) `Sunnybrook Straw Harvest Hat, Cozy Ear-Flap Cap, Academy Beret & Golden Crown of Harmony`.
* **`MOD_B04_02_SOCKET_EYEWEAR_GOGGLES_AND_FACE_RUNES_4x4`**: (1–4) `Grandma Looma's Round Wire Reading Glasses (#555A5E)` (On Nose & Hanging on Tan Leather Neck Cord); (5–8) `Great Wizard's Gold Half-Moon Spectacles`; (9–12) `Master Grimsby's Brass-Rimmed Ember Forge Goggles` (Over Eyes & Pushed onto Forehead Strap); (13–16) `Spell 10 SIGHT Glowing Cyan '==' Eyebrow Visor` & `Spell 7 '#' Silver Whisper Cheek Mark`.
* **`MOD_B04_03_SOCKET_NECKWEAR_BROOCHES_SCARVES_AND_COLLARS_4x4`**: (1–4) `Hero Kai's Golden Crescent Moon Cloak Brooch (#D4AF37)` at 4 angles; (5–8) `Grandma Looma's Colorful Striped Woven Pythonia Scarf` at 4 angles; (9–12) `String's Sky-Blue Bell Collar & Ch. 8 Glowing Cyan-Teal 'str' Crystal Collar (#3B8EA5)`; (13–16) `Emerald Lotus Pendant, Dwarven Brass Beard Rings (#D4A23C) & Warm Fur Collar`.
* **`MOD_B04_04_SOCKET_BELTS_BUCKLES_SATCHELS_AND_POTIONS_4x4`**: (1–4) `Hero Kai's Emerald-Green Tzu Chi Lotus & White Dharma Ship Belt Buckle (#1F6A38 / #C29B38)` at 4 angles; (5–8) `Right-Hip Plain Closed Brown Leather Satchel` (Idle, Bouncing, Open, Upgraded Gold-Trimmed Satchel); (9–12) `Left-Hip 3-Slot Leather Potion Holster` (`Full: Emerald #2ECC71 + Ruby #E74C3C + Sapphire #3A86FF`, `2 Vials`, `1 Vial`, `Empty Holster`); (13–16) `Master Grimsby's Brass Caliper & Chalk Smithing Belt` + `Scroll Tube Holster`.
* **`MOD_B04_05_SOCKET_BACKPACKS_SCABBARDS_AND_WINGS_4x4`**: (1–4) `Diagonal Laurel-Vine Carved Oak Back Scabbard` (`With IronSword Hilt`, `With Wizard's Blade Hilt`, `Empty Scabbard`, `Front Baldric Strap`); (5–8) `Traveler's Canvas Backpack with Rolled Blanket & Hanging Brass Lantern`; (9–12) `Grandma Looma's Wicker Rainbow Yarn Basket & Sunnybrook Harvest Basket`; (13–16) `Baby Mantis Pale-Gold Budding Fairy Wings (#F7C852)` & `Floating 4-Spirit Elemental Halo`.

### Modular Batch 5 (`MOD_B05`): Companion & Mentor Missing Stance Expansion (5 Sheets)
* **`MOD_B05_01_STRING_COMPLETE_MISSING_STANCES_4x4`**: Swimming dog-paddle, climbing into Kai's backpack for rope ladders, carrying a scroll/key in mouth, tugging lever, scared hide behind Kai, `SyntaxError` head-tilt, low-HP whimper crouch, and belly-up nap.
* **`MOD_B05_02_GREAT_WIZARD_COMPLETE_MISSING_STANCES_4x4`**: Seated meditation, writing in the Ancient Spellbook, examining a bug glitch with magnifying lens, handing item to Kai, `SyntaxError` beard-puff, shield dome, low-HP staff kneel, and starlight ascend.
* **`MOD_B05_03_GRANDMA_LOOMA_COMPLETE_MISSING_STANCES_4x4`**: Seated at her oak floor loom pedaling & throwing the boat shuttle, measuring cloth, pouring herbal tea, hugging Kai & String, shocked reaction, and low-HP support kneel.
* **`MOD_B05_04_BLACKSMITH_CH03_COMPLETE_MISSING_STANCES_4x4`**: Pumping the stone forge leather bellows, quenching red-hot IronSword in the steam barrel (`B04_04`), wiping brow, testing blade sharpness, arm-wrestling / hearty belly laugh, and defensive anvil brace.
* **`MOD_B05_05_MASTER_GRIMSBY_CH09_COMPLETE_MISSING_STANCES_4x4`**: Inspecting Kai's scrubbed soot bricks with a stern squint, shoveling glowing coal into the runic smelter, riding the dwarven iron minecart (`B04_04`), fitting the silver Dwarven Steel chestplate onto Kai's shoulders, and booming proud thumbs-up.

### Modular Batch 6 (`MOD_B06`): Regional Bosses & Minions Missing Stance Expansion (5 Sheets)
* **`MOD_B06_01_ACT1_BOSSES_SPAWN_PHASE2_AND_PURIFIED_4x4`**: Ambush spawn, 50% HP Enrage aura, Python-Spell weakness stun, and **Purified Peaceful State** (after Kai solves their code bug!) for `BOSS_01` Thorn-Brute, `BOSS_03` Slag Construct, `BOSS_04` Bramble-Stag, and `BOSS_06` Red Shadow Beast.
* **`MOD_B06_02_ACT2_BOSSES_SPAWN_PHASE2_AND_PURIFIED_4x4`**: Ambush spawn, 50% HP Enrage aura, Python-Spell weakness stun, and Purified/Approved State for `BOSS_08` Magma Cinder-Golem, `BOSS_10` Mirage Doppelganger, and `BOSS_11` Crossroads Stone Arbiter.
* **`MOD_B06_03_BUG_KING_COMPLETE_MISSING_STANCES_4x4`**: Sitting menacingly on the Dark Obsidian Throne (`B04_03`), summoning corrupted syntax beetles, absorbing a fizzled `SyntaxError`, recoiling from each of the 11 Python Spells, and kneeling inside the weaving silk cocoon.
* **`MOD_B06_04_FIELD_MINIONS_LOCOMOTION_AND_PURIFIED_4x4`**: Full 4-state loops (`Walk/Hop`, `Attack`, `Stunned/Hit`, `Purified Cute Friend`) for the Mushroom Spore-Imp, Crystal Cavern Bat, Soot-Sprite Ember Imp, and Corrupted Syntax Beetle.
* **`MOD_B06_05_SLEEPING_RED_DRAGON_AND_GUARDIANS_STATES_4x4`**: Sleeping Red Dragon (`ENV_R06`) — Deep Snoring Sleep (curling smoke), One Eye Cracking Open (when player forgets `#` comment!), Waking Roar (if loud!), and Peacefully Tucking Tail Aside to open the Bronze Library Doors when `#` is cast!

### Modular Batch 7 (`MOD_B07`): Interactive Python Coding-Mechanic & Visual Puzzle Overlays (5 Sheets)
* **`MOD_B07_01_PYTHON_VARIABLE_CONTAINERS_AND_LABELS_4x4`**: Visual wooden/crystal "Variable Boxes" (`=`) that open, store values (`100`, `50`, `10`, `"IronSword"`), swap values, and glow when assigned.
* **`MOD_B07_02_STRING_FUSE_AND_COMMA_WEAVE_CONNECTORS_4x4`**: Visual `+` forge-weld clamps, `,` rainbow silk spacer ribbons, and quote-mark (`" "`) scroll brackets that physically snap words/items together on screen.
* **`MOD_B07_03_ARITHMETIC_FORGE_AND_DATA_TYPE_CONVERTERS_4x4`**: Visual `+`, `-`, `*`, `/` dwarven anvil rune hammers and `str()`, `int()`, `float()`, `bool()` crystal alchemy funnels.
* **`MOD_B07_04_COMPARISON_SIGHT_LENS_AND_BOOLEAN_GATES_4x4`**: Visual `==`, `>`, `<`, `!=` twin balance scales, Truth Lens magnifying glass (`TRUE` emerald checkmark vs. `FALSE` ruby cross), and shattering mirage glass overlays.
* **`MOD_B07_05_CONDITIONAL_INDENTATION_AND_LOOP_TRACKS_4x4`**: Visual `if :`, `elif :`, `else :` golden gate dials, 4-Space Indentation (`    `) glowing footsteps, and minecart loop tracks.

### Modular Batch 8 (`MOD_B08`): Cross-Track Modular Gear Sync (FFT Isometric & Capybara Go! Chibi Cutouts) (5 Sheets)
* **`MOD_B08_01_FFT_ISOMETRIC_MODULAR_WEAPONS_AND_SHIELDS_4x4`**: `2:1` Isometric (`SE/SW/NW/NE`) socket cutouts of all primary Swords, Hammers, Staves, Shuttles, and Shields for Track B.
* **`MOD_B08_02_FFT_ISOMETRIC_MODULAR_HEADWEAR_AND_ARMOR_4x4`**: `2:1` Isometric (`SE/SW/NW/NE`) socket cutouts of all Helmets, Hats, Goggles, Brooches, Pauldrons, and Capes for Track B.
* **`MOD_B08_03_CAPYBARA_CHIBI_MODULAR_WEAPONS_AND_SHIELDS_4x4`**: `2.2H` Chibi vector-gouache socket cutouts of all Swords, Hammers, Staves, Shuttles, and Shields for Track C.
* **`MOD_B08_04_CAPYBARA_CHIBI_MODULAR_HATS_OUTFITS_AND_BAGS_4x4`**: `2.2H` Chibi vector-gouache socket cutouts of all Hats, Glasses, Scarves, Brooches, Tzu Chi Buckles, Satchels, and 3-Potion Bulbs for Track C.
* **`MOD_B08_05_MASTER_PAPERDOLL_CALIBRATION_AND_ANCHOR_CHART_4x4`**: Master visual calibration grid showing the 9 colour-coded socket anchors (`ANCHOR_HAND_R`, `ANCHOR_HAND_L`, `ANCHOR_HEAD`, `ANCHOR_NECK`, `ANCHOR_WAIST`, `ANCHOR_BACK`, `ANCHOR_FOOT`) across HD-2D (`4.2H`), FFT Isometric (`3.2H`), and Capybara Go! Chibi (`2.2H`).
