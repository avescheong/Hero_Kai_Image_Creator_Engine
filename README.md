# Hero Kai: Scrolls of Pythonia — Capybara Go! Edition

> **A playable educational RPG prototype (v5.3.0) where kids explore 12 magical chapters, command Final Fantasy–style tactical battles, learn real Python programming, and build character through kindness — paving the way for the upcoming _Kids Game Creator Studio_.**

---

## 🎮 What Is This Game About?

**Hero Kai: Scrolls of Pythonia — Capybara Go! Edition** blends two beloved RPG styles into one cozy, story-driven browser adventure built for young players (ages 8–12) and families:

1. **60-Day Roguelite Marching Adventure** *(inspired by Capybara Go!)*
   Click **NEXT DAY** to march alongside **Hero Kai**, his loyal golden-tan terrier **String**, and the **Baby Praying Mantis Spell Guardian** across **12 Chapters × 60 Days** of hand-crafted realms — from *The Silent Village* and *The Loom Forest* to *The Dragon's Library* and *Core of the Void Serpent*. Along the road, discover Treasure Chests, Energy Orbs, Lucky Spin Wheels, Skill Drafts, Wise Mentors, and 100% Vegetarian Campfire Feasts.

2. **Final Fantasy–Style Manual Tactical Battle Deck (`v5.3.0`)**
   When monsters or chapter bosses block the path, combat shifts into a **two-pane Royal-Blue Tactical Command Deck** (with a 1-click **Auto-Battle** toggle whenever you want to sit back and watch):
   - **Read Enemy Intents (`NEXT:`):** See what the enemy is preparing on stage before choosing your move.
   - **Exploit `WEAK!` Elements:** Pick from **12 Pythonic Magic Schools** (Water, Fire, Ice, Lightning, Wind, Nature, Starlight, Earth, Lotus Purify, Chrono, Shadow `# Mute`, and Special Overdrive) to trigger **Weakness Breaks** (`1.35×` damage & `-1` boss stagger).
   - **Full Tactical Toolkit:** Choose **Attack**, **Magic**, **Heal** (plant-based provisions), **Defend** (`+140 Shield`, `50%` damage reduction & Aegis Shield Bash counter), **Taunt** (`+35 Rage`, `1.40×` enemy vulnerability, boosted `2.60×` Rhythm Parry), or **Allies / 100% Rage Limit Break** — plus interactive **Golden Colon `:` Rhythm Parries** and pet tag-ins (`[Q] String`, `[E] Mantis`).

---

## 🌱 Where Does It Originate From?

This project grew out of the **Scrolls of Pythonia** universe and the **`Hero Kai`** character & pixel-art engine created to make coding feel like stepping into an illustrated storybook rather than memorizing dry syntax.

- **Rooted in Multi-Track Pixel Craft:** Built atop the **16-FPS** Chibi & HD-2D sprite ecosystem (`01_Sealed_Chibi_Assets` & `02_New_Combat_and_Magic_VFX`), preserving consistent character design, clean transparent sprite frames, and modular armor/companion overlays.
- **Curriculum-First Design:** Originally authored as an 11-to-12-chapter interactive Python learning journey, then evolved into a modular HTML5 roguelite (`04_Modular_Game_Build`) paired with a companion encyclopedia (**PythoniaDB Community Wiki** in `05_Kai_Wikipedia`).
- **Play-Tested With Kids in Mind:** Every mechanic — from Tutorial Step-by-Step coaching in Chapter 1, to slower readable **Sakuga** animations (`0.75x Story`, `1.0x Sakuga`, `1.4x Turbo`), to zoomable skill-tree sprite previews — was refined so children can *see*, *understand*, and *enjoy* every battle beat.

---

## 🧠 How This Game Helps Your Child Learn & Grow

### 1. Real Python Programming — Learned Naturally While Playing
Python is woven directly into the world's magic, weapons, skills, and bosses — kids use real syntax to solve **Python Gates**, cast spells in the **Spell-Forge IDE**, and even **Hack Boss AI**:

| Chapter Range | Core Python Concepts Learned | In-Game Application |
| :--- | :--- | :--- |
| **Ch. 1–2** | `print()`, Syntax, Variables (`shuttle = "Gold"`) | Restore muted village signs & weave broken forest bridges |
| **Ch. 3–4** | `int`, `float`, Arithmetic (`300 * 4`), Strings (`"SUN" + "AEGIS"`) | Temper blades at the Iron Outpost & bind `pet_name = "String"` |
| **Ch. 5–6** | `input()`, Type Casting (`int("42")`), Booleans (`is_pure == True`) | Raise river floodgates & unlock Lotus Purify in The Dragon's Library |
| **Ch. 7–8** | Conditionals (`if / elif / else`), Logic (`and/or/not`), `# Comments` | Route crystal prisms & **comment out** a dragon's rage spell (`# dragon.rage()`) |
| **Ch. 9–10** | `for` Loops (`range(5)`), `while` Loops & `break` | Synchronize forge hammer strikes & break infinite mirage loops |
| **Ch. 11–12** | Lists (`runes.sort()`), Functions (`def ultimate():`) | Unleash the final Scrolls of Pythonia Grand Seal |

### 2. Strategic Thinking & Focus (Not Mindless Clicking)
- **Cause & Effect:** Reading an enemy's `NEXT:` attack telegraph teaches children to *pause, observe, and respond* (Defending heavy slams, Taunting to charge Limit Break, or picking a `WEAK!` elemental spell).
- **Build Planning:** Choosing across **4 Skill Tree Branches** (*Starlight Caster `print`*, *Solar Forge Striker `int`*, *Chrono Loop & Dagger `for`*, and *Tzu Chi Lotus Guardian `True`*) encourages reading tooltips, comparing stats, and experimenting safely (skills can be refunded and rebuilt anytime).

### 3. Compassion, Resilience & Calm Values
- **12 Bilingual Jing Si Wisdom Scrolls:** Visiting the **Compassionate Lotus Shrine** shares gentle reflections in both Chinese and English (*e.g., "Life's truest masterpiece is the courage to rise gracefully after every fall"*) while cleansing debuffs.
- **100% Vegetarian / Plant-Based Adventure Economy:** Campfire stamina meals feature Steamed Vegetable Bao, Plant-Based Nasi Lemak, Cantonese Salt-Steamed Orange (盐蒸橙子), and Grandma Looma's Herbal Tea — and defeated corrupted foes are **purified** rather than destroyed.

---

## ✨ What Makes This Prototype Special?

- **Zero-Framework, Open & Readable Source Code:** Built cleanly with vanilla **HTML5 Canvas**, **CSS3**, and **11 modular JavaScript files** (zero build tools, bundlers, or Node.js required). Parents, teachers, and curious kids can open the code and see exactly how a real game engine works.
- **226 Sealed 16-FPS Sprite & Biome Assets:** Includes `42` Hero/Paper-Doll sheets, `50` VFX sheets, `62` Enemy/Boss/NPC/Pet/Mount sheets, `50` Expression-Link sheets, `12` Status/Portrait sheets, and `10` 16:9 parallax biomes.
- **Non-Linear "Sakuga" Animation Director & 8-Layer Z-Sandwich Stage:** Frames speed up on impact with brief anime-style hit-stops and slow down on recovery so combat feels weighty and expressive without overlapping clutter.
- **Built-In Learning & Safety Tools:** Includes **Chapter 1 Interactive Tutorial Coaching**, **Teacher Sandbox Mode** (unlock all chapters & gear to test lessons), **Live 16-FPS Skill Animation Zoom Modal**, **Web Audio Chiptune SFX**, **Bestiary Duel Simulator**, and a built-in **11-Check `🩺 Self-Test` Diagnostics Suite**.
- **Two-Way Companion Wiki (`05_Kai_Wikipedia`):** Syncs saves and builds directly with the kid-friendly **PythoniaDB** encyclopedia via `localStorage`.

---

## 🚀 Roadmap: From Prototype to _Kids Game Creator Studio_ (Coming Soon!)

> **This repository is a living prototype — the stepping stone to a bigger dream.**

While **Hero Kai: Scrolls of Pythonia** lets children *play and learn* today, it is specifically architected as the foundation for an upcoming **Kids Game Creator Studio**:

- **Learn by Building the Game They Love:** Instead of abstract coding exercises, kids will be able to open a kid-friendly Game Creator Studio modeled directly on this prototype.
- **Step-by-Step Guided Creation:** Young creators will design their own chapters, place heroes, mentors, and props onto visual grids, snap together **16-FPS animations**, customize enemies and weaknesses, write real Python scripts for spells and boss behaviors, and test their own creations immediately on stage.
- **Playable Prototype -> Teaching Blueprint:** Every modular file in `04_Modular_Game_Build/` (config manifests, sprite engine, VFX renderer, battle menu, story runner, tutorial director) is already separated into clean responsibilities so future Creator Studio lessons can teach kids one building block at a time while keeping it fun!

---

## 📂 Repository Structure

```text
Hero_Kai_Capybara_GO/
├── 00_Governance_and_Blueprints/   # Curriculum, asset wiring specs, architecture docs & handover logs
├── 01_Sealed_Chibi_Assets/         # Core 16-FPS sprite sheets, manifests & Jing Si aphorisms
├── 02_New_Combat_and_Magic_VFX/    # Combat VFX, status overlays, hollow-rim shields & 16:9 biomes
├── 03_Inspector_and_Dashboards/    # Asset inspection & visual verification dashboards
├── 04_Modular_Game_Build/          # 🎮 Playable v5.3.0 HTML5/CSS/JS Game Prototype
│   ├── index.html                  # Main game entry point
│   ├── capybara_studio_v4_2.css    # Studio & Final Fantasy battle deck styles
│   ├── config_and_manifests_v4_2.js# 226-asset manifest, 12 chapters, skills, pets & weaknesses
│   ├── sprite_16fps_engine_v4_2.js # Sakuga 16-FPS animator & 8-layer stage compositor
│   ├── vfx_particle_renderer_v4_2.js # Combat VFX, shields, healing & taunt/defend bursts
│   ├── ff_battle_menu_v5.js        # Final Fantasy two-pane manual battle deck & Auto-Battle toggle
│   ├── combat_event_chain_v4_2.js  # Turn resolver, parries, Weakness Breaks & 60-day story loop
│   ├── spell_chain_and_boss_hack_v5.js # Spell-Forge IDE & Boss AI Hacking
│   ├── crossroads_and_stamina_v5.js# Stamina & crossroads encounter logic
│   ├── audio_and_passport_v5.js    # Web Audio chiptune synthesizer & Achievement Passport
│   ├── equipment_and_pets_drawer_v4_2.js # Gear, 4-branch Skill Tree, Magic, Pets/Mounts & Atlas
│   ├── tutorial_director_v5.js     # Step-by-step Ch.1 Tutorial Coach & 11-check Self-Test
│   ├── main_v4_2.js                # Bootstrapper, preloader, keyboard hotkeys & UI bindings
│   └── assets/                     # Game runtime sprites & 16:9 biome backdrops
└── 05_Kai_Wikipedia/               # 📚 PythoniaDB Community Wiki & Interactive Database
```

*(Note: Branch `Kai_Capybara_GO` tracks the active playable game build; branch `Kai_Capybara_Go_Community_Wiki` hosts the standalone Community Wiki deployment.)*

---

## ▶️ How to Play Locally (Quick Start)

Because modern browsers restrict local `Canvas` sprite reading and asset loading over `file://` URLs, start any lightweight static HTTP server (such as Python's built-in server):

```bash
# 1. Clone the repository on the playable branch
git clone -b Kai_Capybara_GO https://github.com/avescheong/Hero_Kai_Image_Creator_Engine.git
cd Hero_Kai_Image_Creator_Engine

# 2. Start a local web server in the game folder
python -m http.server 8080 --directory 04_Modular_Game_Build
```

Then open **`http://localhost:8080/index.html`** in your browser!

To browse the companion **PythoniaDB Community Wiki** at the same time, serve the repository root instead:

```bash
python -m http.server 8080
```
- **Game:** `http://localhost:8080/04_Modular_Game_Build/index.html`
- **Community Wiki:** `http://localhost:8080/05_Kai_Wikipedia/index.html`

### Basic Controls
- `Space` — Advance to Next Day (outside combat)
- `1`–`6` — Choose Final Fantasy Battle Deck commands during your turn (`Backspace` / `Escape` returns from sub-menus)
- `Q` / `E` — Trigger **String** (Sonic Bark) or **Baby Mantis** (Dawn Blossom Heal) companion tag skills
- **UI Buttons:** Switch between Manual & **Auto-Battle**, toggle **Sakuga Pacing**, open **Spell-Forge IDE**, inspect **16-FPS Skills & Magic**, or enable **Teacher Sandbox Mode (`🧪 Sandbox`)** in the top HUD.

---

*Built with care for young learners, future game makers, and families.*
