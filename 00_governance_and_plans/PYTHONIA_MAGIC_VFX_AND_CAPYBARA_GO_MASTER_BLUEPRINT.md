# Hero Kai: Scrolls of Pythonia — Hero Magic Casting, AoE VFX & Capybara Go! Master Blueprint

## 1. Canonical 140-Sheet Seal & 05_generated_packs Game-Type Organization

All 140 approved sprite sheets (and their companion slice-coordinate & ACVE audit .json files) inside 05_generated_packs have been formally sealed under CANONICAL_SEAL_140_SHEETS_MANIFEST.json (SHA-256: a48728258019da5ec445597bb59a73be654aa54c58e3bdfae7057f95a47f1dbc) in 00_governance_and_plans and organized into three dedicated game-type folders:

| Game-Type Folder | Drive Folder Link | Track Coverage | Sealed PNG Sheets | Companion & Audit JSONs | Total Files |

| :--- | :--- | :--- | :--- | :--- | :--- |

| 01_RPG | 01_RPG | Track A (FMT01–FMT05, B02_01–B04_05: 20 HD-2D Core Sheets) + Track D (MOD_B01_01–MOD_B08_05: 40 Paper-Doll & Socket Equipment Sheets) | 60 | 78 | 138 |

| 02_SRPG | 02_SRPG | Track B (FFT_B01_01–FFT_B08_05: 40 Final Fantasy Tactics 3/4 Isometric Tactical SRPG Sheets) | 40 | 49 | 89 |

| 03_Capybara | 03_Capybara | Track C (CG_B01_01–CG_B08_05: 40 Capybara Go! 2-Head-Tall Chibi Roguelite Adventure Sheets) | 40 | 49 | 89 |

| 99_ARCHIVE_SUPERSEDED | 99_ARCHIVE_SUPERSEDED | All pre-cleanup superseded PNGs (24 Round 1 + 13 Round 2 + 6 Track A duplicates) & prior handover/dashboard versions | 43 (Archived) | — | 45 |

## 2. Read-Only Audit of 001_Kai_Assets & Cross-Project Reuse Map

A complete read-only audit of 001_Kai_Assets identified nine top-level asset repositories and existing magic/VFX packs that can be directly referenced or upgraded for the new Magic Casting, AoE, and Capybara Go! builds:

| Folder / Sub-Repository | Drive Link | Key Existing Assets & Contents | Reuse Role for Magic & Capybara Go! |

| :--- | :--- | :--- | :--- |

| Root Governance & CLI Engine | 001_Kai_Assets | AGENT.md, HANDOVER.md, ASSET_STUDIO_PLAN.md, GEMINI.md, app.py, kai_cli.py | Canonical DNA locks (Zero Ember, String terrier #D89B4C, 100% Vegetarian, Hexapod Bug King, Blacksmith Disambiguation) |

| 000. Tzu Chi Hero Kai Character Bible | 000. Tzu Chi Hero Kai Character Bible | 001. Turnaround.png, 002. Turn around Running .png, 003. Equipment Callout.png, 003. Turn Around Sitting.png, Different Outfit.png | Base proportion & navy hoodie/gold-trim palette reference (#1B365D, #F4C430) |

| 01_Bibles_and_Docs | 01_Bibles_and_Docs | Character_Bibles, Canonical_Story_v3 (ENVIRONMENT_LIBRARY_MASTER_BLUEPRINT.md, JingsiAphorism.txt, specs), Style_Guides, World_Lore | 11-Chapter Python curriculum & Jing Si Aphorism wisdom scroll text pool for Roadside Shrine / Mentor events |

| 02_Source_Assets | 02_Source_Assets | Characters (Kai, Wizard, Spell_Guardian, Blacksmith, Bug_King), Shared_Cast, Logos_and_Insignia, Props_and_Items | Visual reference anchors (image_references) for deterministic AI sprite generation |

| Kai_RPG (VFX & HUD Packs) | Kai_RPG | 05_UI_HUD_and_VFX: VFX_Spells_01_to_06_additive.png, VFX_Spells_07_to_11_additive.png, UI_01_FF_9Slice_HUD_Skin_transparent.png, UI_04_100_Item_Icon_Atlas_transparent.png | Additive spell VFX (Ch. 1–11), 9-slice dialogue frames, and 100-item icon atlas |

| Kai_Game_Design_Project | Kai_Game_Design_Project | assets: kai_elemental_magic_cast_4x4.png, kai_elemental_sword_swings_4x4.png, kai_all_armors_climbing_4x4.png, kai_twinblades_all_armors_4x4.png, string_companion_full_4x4.png | Prototype 4x4 elemental casting & elemental sword swings; serves as baseline reference to expand into dedicated multi-elemental casting & AoE sheets |

| Kai Asset For RPG (Active Workspace) | Kai Asset For RPG | 00_governance_and_plans, 01_character_anchors, 02_inspector_and_tools, 05_generated_packs (01_RPG, 02_SRPG, 03_Capybara), 99_ARCHIVE_SUPERSEDED | Active SSOT repository with all 140 sealed sprite sheets |

## 3. Hero Magic Casting & Area-of-Damage (AoE) Master Blueprint (12 Elemental & Pythonic Schools)

To support HD-2D RPG, Isometric SRPG, and Capybara Go! Chibi combat simultaneously, Hero Kai's magic system is architected into 8 Core Elemental/Special Schools (the 7 requested elements + Special Attack) plus 4 Recommended Pythonic/Tactical Schools that tie elemental magic directly to Python programming concepts and Tzu Chi lore.

### 3.1 Complete 12-School Magic Casting, Projectile & AoE Specification Matrix

| # | Element / School | Python / Lore Binding | Primary Hex Palette | Hero Casting Animation (4-Frame Cycle: Wind-Up → Chant → Release → Recovery) | Single-Target / Projectile VFX (4 Frames) | Area-of-Damage (AoE) / Ground Zone VFX (8 Frames: Spawn → Erupt → Lingering DoT/Buff → Fade) | Status / Secondary Effect |

| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |

| 1 | Water (Hydro Stream) | stream.read() / Riverbank Flow (Ch. 5) | #00B4D8 Cyan, #0077B6 Deep Azure, #CAF0F8 Foam White | R1C1–C4: Hands draw a fluid tai-chi circle at waist → water orb levitates between palms → forward double-palm surge → mist dissipation | High-pressure spiral water lance & bouncing bubble volley with droplet trail | Whirlpool Vortex & Tidal Geyser (3x3 Tiles): Spinning cerulean whirlpool pulls enemies inward (Pull 1 tile), erupting into a towering water geyser with splashing foam rings | Soaked / Wet (-20% Speed; amplifies Lightning & Ice freeze chance by +50%) |

| 2 | Fire (Solar Forge) | int * int / Dwarven Smelter Flame (Ch. 3 & Ch. 8) | #FF4500 Vermilion, #FF8C00 Amber, #FFD700 Core Gold | R2C1–C4: Fist clenches at chest with ember swirl → overhead ignition arc → explosive forward punch/staff thrust → heat shimmer recoil | Blazing fireball comet & twin dragon-flame wave skimming the ground | Meteor Pillar & Magma Crater (3x3 / Cross AoE): Descending solar meteor cracks the ground into a glowing lava grid that ticks Burn DoT every turn | Burn DoT (40% ATK fire damage per turn for 3 turns, stacks up to 5x) |

| 3 | Ice (Glacial Cryo) | tuple() / Immutable Frost Lock (Ch. 7 Crystal Cave) | #48CAE4 Glacial Blue, #ADE8F4 Diamond Ice, #FFFFFF Frost Spark | R3C1–C4: Breath frost mist → crisp finger-snap / vertical staff tap on ground → crystalline frost ring expands from boots → poised stance | Triple icicle shard barrage & Icy Bubble orb that splits on impact | Glacial Spike Field & Blizzard Dome (3x3 Diamond AoE): Jagged translucent ice spires erupt sequentially from center outward, encasing targets in hexagonal frost prisms | Chilled / Freeze CC (1-turn action lock; shatters for +35% bonus physical/hammer damage) |

| 4 | Lightning (Volt Surge) | async / await / High-Speed Execution | #F72585 Plasma Violet, #FEE440 Electric Gold, #00F5D4 Arc Cyan | R4C1–C4: Crackling static arcs around hair/hoodie trim → skyward index-finger/blade point → instantaneous thunderbolt call-down →ionized afterglow | Chain lightning arc jumping up to 4 targets & Bolt Dagger high-velocity dart | Thunderstorm Ion Cage & Sky Pillar (4x4 / Screen AoE): Dark storm cloud forms overhead, dropping 5 staggered vertical lightning pillars that leave electrified ground arcs | Shock / Paralyze (15% stun micro-interrupt + triggers chain arc to adjacent enemies) |

| 5 | Wind (Gale Zephyr) | range(start, stop, step) / Highland Gust (Ch. 6 & Ch. 10) | #52B788 Aero Mint, #95D5B2 Pale Jade, #D8F3DC Razor White | R1C1–C4: Agile crouch with swirling leaf vortex → spinning 360° upward slash/cast → twin vacuum crescent release → featherlight landing | Boomerang wind blades & piercing sonic air-arrow | Cyclone Tempest & Updraft Funnel (3x3 AoE): Translucent emerald tornado lifts enemies airborne, dealing multi-hit slicing damage and knocking back 1–2 tiles | Knockback / Evade Up (Pushes enemies back; grants caster +20% Dodge / Tailwind Haste) |

| 6 | Nature (Botanical Vine) | list.append() / Whispering Woods & Loom Forest (Ch. 2 & Ch. 4) | #2D6A4F Forest Emerald, #74C69D Sprout Green, #F4A261 Blossom Gold | R2C1–C4: Kneeling palm touch to earth → glowing vine runes climb arms → upward open-palm bloom → floating petal/leaf aura | Razor leaf storm & seed pod catapult that sprouts on hit | Briar Entangle Grid & Canopy Sanctuary (3x3 AoE): Thick thorned roots erupt from soil to snare enemies while blooming golden flowers heal allies inside the zone | Root / Entangle (0 Movement for 2 turns) + Regen (+8% Max HP per turn to allies) |

| 7 | Starlight (Celestial Astral) | print() / Starlight Valley & Great Wizard Mastery (Ch. 1 & Ch. 11) | #7209B7 Cosmic Indigo, #4CC9F0 Starlight Cyan, #FFD166 Star Gold | R3C1–C4: Levitates 8px off ground with golden constellation halo → both arms raised to cosmos → constellation sigil locks overhead → starlight beam projection | Homing shooting-star missiles & astral prism ray | Supernova Constellation Array (5x5 / Full-Room AoE): Geometric 8-point constellation lines draw across the floor, followed by a rain of radiant starlight comets and a cosmic shockwave | Starlight Reveal & True Damage (Purifies corruption, dispels stealth/illusions, ignores 50% DEF) |

| 8 | Special Attack (Pythonic Overdrive / Twin-Blade Limit Break) | def ultimate_combo(): / Sun Aegis + Twin-Blade + String Synergy | #F4C430 Sovereign Gold, #00F5D4 Cyan Rune, #E63946 Crimson | R4C1–C4: Twin-blade cross-charge with Sun Aegis crest flash → hyper-speed afterimage dash → 6-slash omnidirectional syntax wheel → heroic sheath pose while explosion triggers behind | Phantom Sword Chi barrage + String (#D89B4C) golden sonic bark wave + Baby Mantis (#2ECC71) emerald crescent | Scrolls of Pythonia Grand Seal (Full-Screen Ultimate AoE): Giant golden Python Ouroboros magic circle expands beneath all enemies, erupting in a pillar of cyan/gold code runes | Armor Break + 100% Crit (-30% Enemy DEF for 3 turns, guaranteed Critical Strike) |

| 9 | Earth / Geo (Recommended #1) | int() / Stone Arbiter & Mountain Wall Builder (A5–A7 / P5–P7) | #B08968 Terracotta, #7F5539 Basalt Brown, #FFB703 Topaz Crystal | Stomp & Raise: Heavy boot stomp cracks ground →雙拳 (double fist) uppercut lifts tectonic block → forward hurl | Hurling boulder & crystal stalagmite lance | Tectonic Wall & Seismic Quake (Row/Column AoE): Raises destructible stone walls (A5–A7 / P5–P7) or triggers a 3-wave ground fissure that stuns grounded foes | Petrify / Bulwark (+35% Physical DEF barrier to caster; 20% Stun on grounded foes) |

| 10 | Light / Lotus Purify (Recommended #2) | bool == True / Tzu Chi Compassionate Lotus Sanctuary | #FFCAD4 Lotus Pink, #FFF3B0 Warm Ivory, #FFD166 Halo Gold | Lotus Mudra: Serene palms-together bow → golden 8-petal lotus blooms beneath feet → gentle outward wave of warm light | Purifying lotus petal beam (harms only glitch/corruption, heals living allies) | Sanctuary of Kindness (4x4 Aura AoE): Giant translucent pink-and-gold lotus opens on the battlefield, cleansing all debuffs and converting defeated glitch minions into purified spirits | Cleanse + Pacify + Shield (Removes Poison/Confuse/Burn; grants 25% Max HP Lotus Barrier) |

| 11 | Chrono / Loop Time (Recommended #3) | for i in range(n): / while True: Temporal Echo | #00BBF9 Chrono Blue, #9B5DE5 Violet Clockwork, #F15BB5 Echo Magenta | Clockwork Trace: Finger traces a glowing clock face in air → holographic afterimage clone steps out of Kai → synchronized double-cast | Rewinding boomerang gear & Echo Clone double-strike | Time-Dilation Loop Zone (3x3 AoE): Floating golden clockwork gears and for/while rings spin on the ground; allies inside act twice (Double Combo), enemies move at 0.5x speed | Haste / Multi-Cast (+1 Combo) on allies; Slow / Time-Stop on enemies |

| 12 | Shadow / Comment Mute (Recommended #4) | # comment_out / Stealth & Glitch Debugger | #3A0CA3 Deep Indigo, #4361EE Neon Blue, #ADB5BD Ghost Silver | Hash Slash: Finger draws a glowing # hash symbol across lips/blade → body turns semi-transparent # ghost → silent blink-step strike | Silencing # shuriken & shadow tether dart | Comment-Out Null Zone (# 3x3 AoE): Translucent grey-indigo code block (# muted) drops over enemies, locking their active spell casting and muting boss buffs | Silence + Blind (Enemies cannot cast active/rage skills for 2 turns; -30% accuracy) |

### 3.2 Recommended Sprite Sheet Layout for Hero Magic Casting & AoE Pack (MAGIC_B01 to MAGIC_B03 — 15 Sheets, 1024×1024, 4x4 Grid, 256×256 Cells)

To keep memory footprint low and frame slicing 100% deterministic (row * 256, col * 256), we structure the new Hero Magic & AoE expansion into 3 Batches (15 Sheets total):

- Batch MAGIC_B01 (5 Sheets — Hero Kai Casting Stances Across Game Modes):

- MAGIC_B01_01_KAI_HD2D_ELEMENTAL_CASTING_WATER_FIRE_ICE_LIGHTNING_4x4.png: Rows 1–4 = 4-frame casting cycles (Wind-Up, Chant Aura, Release, Follow-Through) for Water, Fire, Ice, Lightning.

- MAGIC_B01_02_KAI_HD2D_ELEMENTAL_CASTING_WIND_NATURE_STARLIGHT_SPECIAL_4x4.png: Rows 1–4 = 4-frame casting cycles for Wind, Nature, Starlight, Special Attack Overdrive.

- MAGIC_B01_03_KAI_HD2D_PYTHONIC_CASTING_EARTH_LOTUS_CHRONO_COMMENT_4x4.png: Rows 1–4 = 4-frame casting cycles for Earth (int), Lotus Purify (True), Chrono Loop (for/while), Shadow Mute (#).

- MAGIC_B01_04_KAI_CHIBI_ELEMENTAL_CASTING_ALL_8_CORE_SCHOOLS_4x4.png: Capybara Go! 2-head-tall Chibi Kai 2-frame cast + release poses across all 8 Core Schools (16 cells).

- MAGIC_B01_05_KAI_ISOMETRIC_SRPG_ELEMENTAL_CHANT_AND_SUMMON_4x4.png: FFT Isometric Kai 4-direction elemental chant, staff raise, twin-blade limit break, and lotus prayer stances (16 cells).

- Batch MAGIC_B02 (5 Sheets — Elemental Projectiles, Beams & Sword/Weapon Infusions):

- MAGIC_B02_01_PROJECTILES_WATER_FIRE_ICE_LIGHTNING_4x4.png: 4-frame animated projectiles (Launch, In-Flight 1, In-Flight 2, Directional Impact Burst) for Water, Fire, Ice, Lightning.

- MAGIC_B02_02_PROJECTILES_WIND_NATURE_STARLIGHT_SPECIAL_4x4.png: 4-frame animated projectiles for Wind, Nature, Starlight, Special Attack Sword Chi.

- MAGIC_B02_03_PROJECTILES_EARTH_LOTUS_CHRONO_COMMENT_4x4.png: 4-frame animated projectiles for Earth Boulder/Spike, Lotus Petal Beam, Chrono Gear, # Mute Shuriken.

- MAGIC_B02_04_ELEMENTAL_WEAPON_SLASH_ARCS_PART1_4x4.png: 2-frame crescent slash + 2-frame elemental trail for Water, Fire, Ice, Lightning infused sword/staff/hammer swings.

- MAGIC_B02_05_ELEMENTAL_WEAPON_SLASH_ARCS_PART2_4x4.png: 2-frame crescent slash + 2-frame elemental trail for Wind, Nature, Starlight, Special Limit Break.

- Batch MAGIC_B03 (5 Sheets — Multi-Tile Area of Damage (AoE) Eruptions & Ground Zones):

- MAGIC_B03_01_AOE_ZONES_WATER_WHIRLPOOL_AND_FIRE_METEOR_4x4.png: Row 1–2 = Water (4-frame Whirlpool ground decal + 4-frame Geyser eruption); Row 3–4 = Fire (4-frame Magma Crater decal + 4-frame Meteor Pillar blast).

- MAGIC_B03_02_AOE_ZONES_ICE_BLIZZARD_AND_LIGHTNING_STORM_4x4.png: Row 1–2 = Ice (4-frame Frost Ring + 4-frame Glacial Spire eruption); Row 3–4 = Lightning (4-frame Ion Cage decal + 4-frame Sky Thunderbolt pillars).

- MAGIC_B03_03_AOE_ZONES_WIND_TEMPEST_AND_NATURE_BRIAR_4x4.png: Row 1–2 = Wind (4-frame Updraft ring + 4-frame Cyclone funnel); Row 3–4 = Nature (4-frame Root Snare grid + 4-frame Blooming Canopy heal aura).

- MAGIC_B03_04_AOE_ZONES_STARLIGHT_SUPERNOVA_AND_SPECIAL_SEAL_4x4.png: Row 1–2 = Starlight (4-frame Constellation floor array + 4-frame Comet shower); Row 3–4 = Special Attack (4-frame Golden Python Ouroboros seal + 4-frame Omnislash pillar).

- MAGIC_B03_05_AOE_ZONES_EARTH_LOTUS_CHRONO_COMMENT_4x4.png: 4-frame AoE ground & eruption sequences for Earth Quake/Wall, Lotus Sanctuary, Chrono Clockwork Zone, and Shadow # Null Zone.

## 4. Deep Research: Capybara Go! Animation Systems & Level Architecture

Based on primary analysis of Habby's Capybara Go! mechanics across the MeowDB Capybara Go Skills Database (1,133 Skills), MeowDB Star Staff Ultimate Build Guide, Capybara Go! Wiki: Stats and Effects, Capybara Go! Wiki: Skills Tier List, Capybara Go! Wiki: Equipment, MrGuider Capybara Go Skills List, Pocket Gamer Capybara Go Tier List, and Reddit r/CapybaraGoGame Stat Clarifications, Capybara Go! achieves high visual satisfaction on a lightweight 2D canvas by combining simple 2-head-tall squash-and-stretch chibi characters with layered, high-frequency procedural + sprite-sheet combat VFX triggered via an Event-Chain Combat Engine.

### 4.1 How Capybara Go! Structures Combat Animations (Why It Feels So Juicy)

In Capybara Go! (MeowDB Skills Database; Capybara Go! Wiki: Skills Tier List), a single player turn is rarely just one swing—it is an automated visual chain reaction:

- Base Action: Hero steps forward (squash 1.15x width, 0.88x height → stretch lunge) and performs a Basic Attack (or Rage Attack when Rage reaches 100).

- Weapon Archetype Proc:

- Whisperer / Shadow Lance / Dagger Build (Capybara Go! Wiki: Equipment): Every Basic or Crit attack spawns 2–6 spinning Flying Daggers (Rage Dagger, Poison Dagger, Bolt Dagger, Ice Dagger, Angel Dagger) that arc from behind the hero's shoulder into the enemy with crisp metallic trails.

- Skysplitter / Blade of Justice / Sword Chi Build (MeowDB Skills Database): Basic and Combo attacks launch crescent Sword Chi (Sword Aura) waves across the ground and call down vertical Falling Sword / Light Spear lances from the top of the screen.

- Star Staff / Bishop Staff / Elemental Mage Build (MeowDB Star Staff Guide): Casts Bolt / Super Bolt (vertical sky lightning), Fire Strike / Dragon Flame (ground flame pillar + Burn stacks), and Icy Spike (ground crystal eruption + Freeze lock).

- Mushroom Hammer / Durian Hammer / Counter Build (Pocket Gamer Tier List): Generates a Golden Shield Bubble on attack/turn start, absorbs enemy hits with a metallic CLANG ripple, and triggers an immediate Counter Hammer Slam with Piggy Strike Stun stars.

- Combo / Counter / Pet Follow-Up:

- If Combo Rate triggers (x2, x3, x4), a comic "COMBO x2!" badge pops above Kai while he immediately executes a rapid follow-up strike.

- Every 3 Combos (with Skill Shield trait), a cyan hexagonal Skill Shield flashes around Kai (MeowDB Skills Database).

- After the hero's action, Pets (String & Baby Mantis), Mounts, and Artifacts fire their own independent mini-animations in sequence.

### 4.2 Complete Capybara Go! Attack, Defense, Casting & Status Effect Asset Matrix

Below is the exact breakdown of what we already have sealed in 03_Capybara (03_Capybara Folder) versus the new dedicated animation sheets (CG_VFX_B01 & CG_VFX_B02) we should generate so every Capybara Go! attack, defense, casting, and status effect (Poison, Confuse, Burn, Freeze, Stun, Bleed, Silence, Rage) is fully animated:

| Animation Category | Specific Capybara Go! Visual Mechanics (MeowDB / Wiki) | Existing Sealed Assets in 03_Capybara | New Dedicated Animation Frames to Build (CG_VFX Pack) |

| :--- | :--- | :--- | :--- |

| 1. Flying Dagger Volleys (SkillPhysicalDagger) | Spinning daggers launched from hero's back in curved Bezier arcs: Basic Dagger (silver), Rage Dagger (crimson-gold), Poison/Smelly Dagger (toxic green drip), Ice Dagger (frost cyan), Bolt Dagger (electric yellow), Angel/Lotus Dagger (healing pink-gold) | Static icons in CG_B06_03 (link) | CG_VFX_01_DAGGER_AND_SPEAR_ARSENAL_4x4.png: 6 Dagger types × 2 frames (In-Flight Spin + Ribbon Trail, Target Pierce Splash) + Light Spear sky lance + Zhanxian Flying Knife relic |

| 2. Sword Chi & Falling Swords (SkillPhysicalSword Chi) | Ground-skimming crescent energy waves (Basic Sword Chi, Rage Sword Chi, Super Sword Chi) + vertical sky-falling giant spectral greatswords (Sword Rain / Falling Sword) | Basic slash in CG_B01_01 (link) | CG_VFX_02_SWORD_CHI_AND_WEAPON_WAVES_4x4.png: 4-frame Basic Cyan Sword Chi, 4-frame Crimson-Gold Rage Sword Chi, 4-frame Vertical Falling Greatsword Rain, 4-frame Hammer Earthquake Shockwave |

| 3. Defense, Shields, Counter & Dodge | HP Shield Bubble (translucent gold dome), Skill Shield (cyan hexagonal barrier triggered every 3 combos), Sun Aegis Block (physical shield parry flash), Counter-Attack Trigger (red-gold crosshair flash + counter swing), Drunken Fist Dodge (ghostly afterimage mirage + "MISS!" puff) | Base shield icon in CG_B07_01 (link) | CG_VFX_03_DEFENSE_SHIELDS_COUNTER_AND_DODGE_4x4.png: Row 1 = Golden Shield Bubble (Spawn, Idle Pulse, Absorb Ripple, Shatter); Row 2 = Cyan Hex Skill Shield (4 frames); Row 3 = Counter-Attack Flash & Parry (4 frames); Row 4 = Dodge Mirage Afterimage & Smoke Puff (4 frames) |

| 4. Crowd-Control & DoT Status Effects (Poison, Confuse, Burn, Freeze, Stun, Bleed, Silence, Rage) | Looping overhead/body status overlays on Chibi units (Capybara Go! Wiki: Stats and Effects): / • Poison: Rising toxic green bubbles + skull icon + purple-green body tint / • Confuse / Dizzy: Swirling magenta/yellow spiral vortex + ? marks + wobbly stars / • Stun (Piggy Strike): Orbiting golden stars + mini dizzy bird / • Freeze (Icy Spike): Translucent ice block encasing unit + frost breath / • Burn (Dragon Flame): Stacking flame tongues (1x–5x badge) around waist / • Bleed / Glitch Leak: Red-magenta pixel sparks dripping / • Silence (# Mute): Glowing # padlock over mouth/head / • Rage Full (100/100): Blazing golden-crimson super-saiyan aura + steam puff | Emote stickers in CG_B01_05 (link) | CG_VFX_04_STATUS_EFFECTS_POISON_CONFUSE_CC_4x4.png: 2-frame looping animations × 8 status effects: / • R1C1–C2: Poison (bubbling green venom cloud + skull) / • R1C3–C4: Confuse (swirling purple-gold hypnosis spiral + ?) / • R2C1–C2: Stun (orbiting golden stars) / • R2C3–C4: Freeze (encasing crystal ice block + shatter) / • R3C1–C2: Burn (looping fire ring + stack embers) / • R3C3–C4: Bleed / Glitch (crimson-magenta pixel sparks) / • R4C1–C2: Silence (# syntax padlock) / • R4C3–C4: Rage 100% Aura (blazing golden-crimson flame aura) |

| 5. Chibi Elemental Strikes (Bolt, Fire Strike, Icy Spike, Nature, Water, Starlight) | Fast 2-to-4-frame chibi-proportioned impact effects that land directly on the right-side enemy slot during auto-battles | Python ultimates in CG_B01_04 (link) | CG_VFX_05_CHIBI_ELEMENTAL_STRIKES_AND_COMBO_POPUPS_4x4.png: 2-frame impact bursts for Sky Bolt, Dragon Flame Pillar, Icy Spike Eruption, Water Geyser, Wind Tornado, Lotus Heal, plus "COMBO x2/x3!", "COUNTER!", "CRIT!", and "DODGE!" comic popups |

### 4.3 Deep Research: What Assets Are Needed to Build a Complete Capybara Go! Level / Game?

In Habby's Capybara Go! (Lancaric UA & Core Loop Case Study; Reddit r/CapybaraGoGame Helpful Advice), the screen is divided into Two Synchronized Halves (Top 45% = 2D Auto-March & Combat Stage; Bottom 55% = Interactive 60-Day Text Adventure Log & Action Controls).

Here is the complete inventory of every asset layer required to build a full playable Capybara Go! chapter level, cross-checked against what we already have in 03_Capybara and what remains to be wired:

| Level / Stage Subsystem | Required Asset Components for a Complete Level | Status in 03_Capybara (1HrvKxJ4-1_sYTEi8slzBU6hRinIHoOD2) | Exact Sealed Sheet IDs Ready for Build |

| :--- | :--- | :--- | :--- |

| 1. Top-Screen Parallax Biome Stage (11 Chapters) | • Scrolling ground road strip, mid-ground trees/rocks, far-ground mountains/sky / • Day / Dusk / Night / Boss-Warning lighting states across all 11 Pythonia Chapters (Ch. 1 Silent Village → Ch. 11 Citadel of the Core) | 100% READY | CG_B08_01_TOP_SCREEN_BIOME_BANNERS_ACT1_CH01_TO_CH06_4x4.png / CG_B08_02_TOP_SCREEN_BIOME_BANNERS_ACT2_CH07_TO_CH11_4x4.png |

| 2. Chibi Hero Rig, Armor Skins & Mounts | • Chibi Hero Kai (Idle, Bouncy Walk, Basic Slash, Staff Cast, Bow/Dagger Throw, Hit, KO, Victory) / • 4-Tier Armor Skins (Novice Hoodie, Forest Camo, Dwarven Armor, Lotus Paladin) / • 4 Rideable Mounts ( Mountain Goat,  Runic Boar,  Crystal Turtle,  Starlight Cloud) | 100% READY | CG_B01_01_CHIBI_KAI_AUTO_MARCH_AND_COMBAT_4x4.png / CG_B01_02_CHIBI_KAI_4TIER_EQUIPMENT_PROGRESSION_4x4.png / CG_B01_03_CHIBI_KAI_MOUNT_RIDING_PROGRESSION_4x4.png / MOD_B08_03 & MOD_B08_04 (Modular Chibi Gear) |

| 3. 3-Slot Pet Companion Auto-Battlers | • Slot 1: String (#D89B4C golden-tan terrier — bark wave, dig treasure, heal lick) / • Slot 2: Baby Praying Mantis Spell Guardian (#2ECC71 — wind scythe, emerald barrier) / • Slot 3: 4 Shapeshift Spirit Pets (Forest Deer, River Otter, Ember Fox, Starlight Owl) + Pet Eggs & Gacha | 100% READY | CG_B02_01_CHIBI_STRING_BEAN_PET_AUTO_BATTLER_4x4.png / CG_B02_02_CHIBI_SPELL_GUARDIAN_MANTIS_PET_4x4.png / CG_B02_03_CHIBI_FOUR_SHAPESHIFT_SPIRIT_PETS_4x4.png / CG_B02_05_CHIBI_PET_EGGS_GACHAPON_AND_SYNERGY_4x4.png |

| 4. 60-Day Roadside Encounter Props & Choice Events | • Campfire Rest (roasting 100% vegetarian skewers / herbal tea for +30% HP) / • Lucky Spin Wheel (Gold / Skill / Stamina) / • Angel / Lotus Shrine vs. Glitch Altar (Risk/Reward choice) / • Blacksmith Forge Anvil (Ch. 3 Horned-Helm Blacksmith & Ch. 9 Hatless Ginger Master Grimsby weapon upgrade) / • Grandma Looma Tea & Weaving Stall + Great Wizard Starlight Mentor / • Treasure Chests (Wooden, Silver, Golden, Celestial) & Directional Signposts | 100% READY | CG_B08_03_ROADSIDE_DAY_EVENT_ENCOUNTER_PROPS_4x4.png / CG_B02_04_CHIBI_GREAT_WIZARD_EVENT_MENTOR_4x4.png / CG_B03_01_CHIBI_GRANDMA_LOOMA_WEAVING_EVENT_4x4.png / CG_B03_02_CHIBI_BLACKSMITH_CH03_FORGE_EVENT_4x4.png / CG_B03_03_CHIBI_MASTER_GRIMSBY_CH09_DWARF_EVENT_4x4.png / CG_B03_04 & CG_B03_05 (Village & Forest NPCs) |

| 5. Minion Waves (Days 1–59) & Chapter Bosses (Days 10/20/30/40/50/60) | • Field Minions: Glitch Slimes, Syntax Bats, Thorn Sprouts, Rust Beetles, Shadow Wolves, Cinder Imps / • Act 1 Mini-Bosses & Bosses: Glitch Thorn Brute (Ch. 1), Rust Slag Construct (Ch. 3), Shadow Bramble Stag (Ch. 4), Creeping Red Shadow Beast (Ch. 6) / • Act 2 Bosses & Final Boss: Magma Cinder Golem (Ch. 8), Highland Mirage Doppelganger (Ch. 10), Crossroads Stone Arbiter (Ch. 11), Hexapod Bug King Phase 1 & Phase 2 Overlord + Purified Golden Cocoon → Baby Mantis | 100% READY | CG_B04_05_CHIBI_ACT1_FIELD_MINIONS_SQUAD_4x4.png / CG_B04_01, CG_B04_02, CG_B04_03, CG_B04_04 / CG_B05_01, CG_B05_02, CG_B05_03, CG_B05_04, CG_B05_05 |

| 6. 3-Card Roguelite Draft Modal & Skill Icons | • 4 Rarity Card Frames: Common (Grey/Green), Rare (Blue), Epic (Purple), Legendary/Mythic (Gold/Red) / • 64 Skill Icons: 32 Python Spell Icons (Ch. 1–11) + 16 Capybara Combat Tech Icons (Dagger, Sword Chi, Rage, Bolt, Flame, Ice, Shield, Combo, Counter) + 16 Pet/Mount Passive Icons | 100% READY | CG_B06_05_ROGUELITE_SKILL_CARD_FRAMES_AND_RARITY_BORDERS_4x4.png / CG_B06_01, CG_B06_02, CG_B06_03, CG_B06_04 |

| 7. 6-Slot Equipment Loadout, 100% Vegetarian Stamina Food & Gacha Economy | • 6 Equipment Slots: Weapon, Armor, Ring 1, Ring 2, Accessory 1, Accessory 2 + Mount Tokens & Artifacts / • 100% Vegetarian Provisions: Steamed Vegetable Bao, Plant-Based Nasi Lemak, Herbal Ginseng Tea, Salt-Steamed Orange (盐蒸橙子), Chickpea Falafel Wrap, Golden Lotus Soup | 100% READY | CG_B07_01_WEAPONS_AND_SHIELDS_LOADOUT_ICONS_4x4.png / CG_B07_02_ARMOR_CLOAKS_AND_INSIGNIA_ACCESSORIES_4x4.png / CG_B07_03_VEGETARIAN_STAMINA_FOOD_AND_POTIONS_4x4.png / CG_B07_04 & CG_B07_05 |

| 8. Bottom-Screen Text Log UI, "NEXT DAY" Button & Combat VFX | • 9-Slice Parchment/Dark-Mode Event Log Panel, Big Green "NEXT DAY" pill button, 1x/2x/3x Speed toggle, HP/XP/Rage bars, Day progress bar (Day 1 → Day 60) / • Animated Combat VFX: Flying Daggers, Sword Chi, Shields, Counter/Dodge, Poison/Confuse/Burn/Freeze/Stun loops | UI 100% READY / VFX EXPANSION (5 Sheets) PLANNED | CG_B08_04_BOTTOM_SCREEN_TEXT_LOG_AND_BUTTON_UI_KIT_4x4.png / CG_B08_05_COMBAT_VFX_DAMAGE_POPUPS_AND_VICTORY_BANNERS_4x4.png / + New CG_VFX_01 to CG_VFX_05 (5 Sheets) |

## 5. Step-by-Step Execution Plan for Next Phase

### Phase A — Generate the 20 New VFX & Magic Sprite Sheets (4 Batches × 5 Sheets)

All new sheets will be generated at 1024×1024 (4x4 grid, 256×256 cells), processed through the ACVE v2.0 + Surgical White-Island Strip Pipeline, and staged in an interactive HTML Decision Dashboard for your one-click inspection:

- Batch 1 (CG_VFX_01 to CG_VFX_05 — 5 Sheets → 03_Capybara):

- CG_VFX_01_DAGGER_AND_SPEAR_ARSENAL_4x4.png (Basic, Rage, Poison, Ice, Bolt, Lotus Daggers + Light Spear + Flying Knife Relic)

- CG_VFX_02_SWORD_CHI_AND_WEAPON_WAVES_4x4.png (Basic Sword Chi, Rage Sword Chi, Falling Sword Rain, Hammer Quake)

- CG_VFX_03_DEFENSE_SHIELDS_COUNTER_AND_DODGE_4x4.png (Golden HP Shield Bubble, Cyan Hex Skill Shield, Counter Flash, Dodge Mirage)

- CG_VFX_04_STATUS_EFFECTS_POISON_CONFUSE_CC_4x4.png (Poison bubbles/skull, Confuse spiral/?, Stun stars, Freeze ice block, Burn embers, Bleed/Glitch sparks, # Silence lock, Rage 100% aura)

- CG_VFX_05_CHIBI_ELEMENTAL_STRIKES_AND_COMBO_POPUPS_4x4.png (Chibi Bolt, Flame Pillar, Icy Spike, Water Geyser, Wind Tornado, Lotus Heal + Combo/Counter/Crit popups)

- Batch 2 (MAGIC_B01_01 to MAGIC_B01_05 — 5 Sheets → 01_RPG / 02_SRPG / 03_Capybara):

- Hero Kai casting animations across all 12 Elemental & Pythonic Schools (Water, Fire, Ice, Lightning, Wind, Nature, Starlight, Special Attack, Earth, Lotus Purify, Chrono Loop, Shadow # Mute).

- Batch 3 (MAGIC_B02_01 to MAGIC_B02_05 — 5 Sheets → 01_RPG):

- Directional projectiles, beams, and elemental weapon slash arcs across all 12 Schools.

- Batch 4 (MAGIC_B03_01 to MAGIC_B03_05 — 5 Sheets → 01_RPG & 02_SRPG):

- Multi-tile Area-of-Damage (AoE) ground runes, lingering zones, and full-screen ultimate eruptions across all 12 Schools.

### Phase B — Build the Modular Pythonia Capybara Go! HTML5 Game Studio (03_Capybara)

Following the user:interactive-game-studio-architect blueprint (index.html + css/capybara.css + js/config.js + js/stage_engine.js + js/combat_vfx.js + js/roguelite_draft.js):

- Top-Screen Canvas Engine: Parallax biome scroller (CG_B08_01/02), bouncy Chibi Kai + Mount + 3 Pets (String, Baby Mantis, Spirit Pet), roadside prop encounters (CG_B08_03), and high-juice Event-Chain Combat (Flying Daggers, Sword Chi, Lightning Bolts, Shield Bubbles, and Poison/Confuse/Freeze/Burn status overlays).

- Bottom-Screen 60-Day Text Adventure & Python Challenge Log:

- "NEXT DAY" button advances Day 1 → Day 60 with dynamic narrative logs, Roadside Choice Chips (Campfire, Blacksmith, Grandma Looma, Wizard Shrine), and Python Mini-Code Challenges at Roadside Terminals/Boss Gates that grant bonus 3-Card Roguelite Skill Drafts (CG_B06_01–05).

- Save/Load & 6-Slot Equipment Drawer: Full JSON Save/Load state persistence, 6-slot equipment drawer (Weapon, Armor, 2 Rings, 2 Accessories), and 100% vegetarian food stamina system (CG_B07_01–05).
