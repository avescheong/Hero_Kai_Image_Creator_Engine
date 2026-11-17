# 🪲 The Bug King — Official Character & Consistency Bible
*Pythonia Storybook & Game Boss Production Reference*

---

## 1. Character Overview & Concept

**The Bug King** is an imposing, regal insectoid sovereign and arcane sorcerer in the *Pythonia* universe. Crafted in the same crisp hand-drawn ink-and-watercolor fantasy RPG style as **Hero Kai** and the **Great Wizard**, he serves as a formidable boss encounter or ancient rival ruler across storybooks and games.

- **Species / Form**: Anthropomorphic Praying Mantis / Chitinous Sovereign
- **Proportions**: 7.0–7.5 heads tall in upright regal posture; also capable of low, predatory crouching stalks
- **Signature Aura**: Regal menace, tactical precision, ancient purple-and-gold sorcery

---

## 2. Canonical Anatomy (CRITICAL INVARIANT)

To prevent AI models from defaulting to standard human anatomy, every Bug King prompt enforces his **6-limbed hexapod structure**:

| Body Part | Specification |
| :--- | :--- |
| **Head & Eyes** | Angular triangular mantis head with dark chitin faceplates, segmented mandibles, and **large bulging oval chartreuse/lime-green compound eyes** (`#9EE875`) that glow softly (brightening to yellow-green during magic) |
| **Crown & Antennae** | Sharp jagged **5-pointed dark iron crown** centered between **two long slender backward-curving antennae** |
| **Upper Arms (2)** | Large, heavily serrated praying-mantis **raptorial scythe-arms** with spiky forearms and curved talon claws emerging from the shoulder pauldrons |
| **Lower Arms (2)** | Two slender articulated insectoid-humanoid arms emerging below the shoulders, primarily used for gripping his spear-staff and weaving arcane gestures |
| **Legs (2) & Abdomen** | Two armored digitigrade insectoid legs ending in clawed feet; elongated **segmented mantis abdomen** extending behind the hips |

---

## 3. Armor, Weaponry & Magic Signature

### A. Obsidian Chitin Royal Regalia
1. **Armored Collar & Pauldrons**: High flared upright collar framing the head, paired with layered dark charcoal-bronze chitin shoulder pauldrons (`#3A3537` / `#5B524E`).
2. **Segmented Chestplate & Tabard**: Interlocking thoracic chitin plates bearing a **diamond crest at the sternum**, with a long vertical center tabard hanging between the legs and dark border trim.
3. **Royal Split Cloak**: Long ankle-length dark slate-olive/charcoal mantle draped behind the shoulders.

### B. Signature Weapon: The Forked Crescent Spear-Staff
- **Shaft**: Long slender dark metallic/chitin polearm shaft with a pointed butt ferrule.
- **Tip**: Distinctive **two-pronged forked crescent / tuning-fork spearhead** curving inward around a hollow center gap.

### C. Arcane Magic VFX Signature
- **Colors**: Swirling **amethyst-purple (`#8F58C9`)** intertwined with **luminous golden-amber (`#F3C86A`)** energy ribbons and floating glowing golden runes.
- **Channeling**: Either summoning a hovering **purple energy orb** between his raised upper mantis claws, or sweeping his forked spear-staff to unleash a **purple-and-gold rune vortex**.

---

## 4. Production Modes: Storybook vs. Game Boss Assets

- **📖 Storybook Mode**: Towering boss confrontations against Hero Kai (`kai_vs_bug_king`), brooding on an ancient chitin throne, or unleashing purple-gold rune storms in shadowy ruins.
- **🎮 Game Asset Mode**:
  - **Game Sprite / Cutout**: Full-body isolated pose on pure `#FFFFFF` white background (ready for `GameAssetProcessor` transparent PNG extraction).
  - **Game Dialogue Portrait**: Intense chest-up RPG boss dialogue bust highlighting his 5-pointed crown, glowing lime compound eyes, and flared collar.
  - **Game Action Sprite Sheet**: Multi-frame boss animation sheet (Idle with Staff, Stalking Crouch, Scythe Lunge, Channeling Purple Orb, Rune Vortex Attack).
  - **Multi-Pose Sheet Slicer**: Since `Bug_King_Master_Sheet.png` already contains 8 distinct poses on white canvas, use `python kai_cli.py slice-sheet` (or the Streamlit **🎮 Game Asset Prep Tool**) to extract all 8 poses into individual transparent PNG game sprites!

---

## 5. Canonical Invariants (DOs and DON'Ts)

| ✅ ALWAYS DO | ❌ NEVER DO |
| :--- | :--- |
| Keep all **4 arms (2 serrated mantis scythe-arms + 2 lower arms) + 2 clawed legs** | Do NOT draw him with only 2 human arms |
| Keep the **luminous pale lime-green compound eyes** (`#9EE875`) | Do NOT change his eyes to red, orange, or blank black |
| Keep the **5-pointed dark iron crown** between **2 slender antennae** | Do NOT turn his crown into shiny gold or remove the antennae |
| Keep the **two-pronged forked crescent spear-staff** | Do NOT replace his forked spear with a generic sword, club, or scythe |
| Keep **amethyst-purple & gold rune magic** | Do NOT use realistic 3D CGI bug gore/slime or sci-fi cybernetics |


---

## 6. Canonical Story v3.0 Lore & Finale Continuity
- **Origin**: Formerly Pythonia's gentle **Steward of Order**, corrupted when careless shortcuts and tangled broken code encrusted him into a dark armored monarch who locked away the Eleven Ancient Spells.
- **Climax Zone (`ENV_R11` — Citadel of Core Throne Room)**: Pulls Kai and String underground after the Final Crossroads gate opens. Kai uses Dwarven Steel Armor (`ENV_R08`), String's telepathic `str` speed, `#` comments, `type()` checks, `hp` math, comparisons, and `if / elif / else` tactics—and uses his glowing `==` SIGHT eyes to shatter the corrupted shell.
- **Awakening**: Cracking the dark shell reveals the true **Baby Praying Mantis Spell Guardian** (`~35 cm`), restoring balance to Pythonia.
