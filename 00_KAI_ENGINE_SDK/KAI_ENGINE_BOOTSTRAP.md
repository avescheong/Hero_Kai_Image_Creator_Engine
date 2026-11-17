# Hero Kai Character DNA & Sprite SDK — Bootstrap Contract (KAI_ENGINE_BOOTSTRAP.md)

- Canonical Workspace: Kai Asset For RPG (1ampGrS0JM8joJjLeULudV8tKjfgFzzO2)

- SDK Folder: 00_KAI_ENGINE_SDK (1l6OYPCS0hk1iDTFpgzyoI1atZA0X8tS3)

- Production Baseline: 140 / 140 Sprite Sheets (2,213 cells) CANONICAL_SEALED in 05_generated_packs (01_RPG, 02_SRPG, 03_Capybara)

- Latest Governance Handover: 00_governance_and_plans/HANDOVER_CURRENT.md (CHK-PYTHONIA-V2-SEALED-140-20261117)

## 1. Mandatory Rules for Any AI Agent or Developer

- Zero Freehand Prompting Rule: NEVER write ad-hoc image generation prompts for Hero Kai from memory. ALWAYS compile prompts deterministically using kai_prompt_and_rig_compiler.py reading kai_canonical_genome_v4.json.

- Code Compositing Before AI Generation:

- Need Kai holding a new weapon, wearing a new cloak/armor, or equipped with new accessories? DO NOT call image_gen on Kai. Use kai_paperdoll_compositor.py to composite modular cutouts (MOD_B02–MOD_B04) onto the sealed unarmed socket mannequins (MOD_B01_01–MOD_B01_04).

- Need Kai casting a new magic spell? Generate only the transparent spell VFX (Z=7) on #FFFFFF and composite it over Kai's sealed casting stances (States 24–25 in MOD_B01_02 or FMT03).

- Mandatory Visual Conditioning (image_references): Whenever a genuinely new Hero Kai pose or 16:9 storybook scene must be generated, ALWAYS pass these canonical Drive references:

- 1A04-hA0n5mlEKk1QZzvj0pxD-BEMFsZN (001. Turnaround.png)

- 1w79QHXpZnVN4U04FNIylZp_TWF0cZMz9 (hero-kai.webp)

- 11uLgREBOxwLToTChhHSeVE1AKzUxVy1k (003. Equipment Callout.png)

- Mandatory 11-Gate Post-Processing (acve_kai_verifier_v3.py): Every generated or composited sheet MUST pass acve_kai_verifier_v3.py (Gate 0 caption clean, Gate 3B surgical interior white-island strip preserving #F4EFE6 cream tunic, Gate 8A–8E per-cell anatomical ROI hex audit, Gate 9 Lab palette clamping, and Gate 10 bilateral hip asymmetry check).

## 2. Quick-Start CLI Commands

### A. Compile a Deterministic Job Ticket

python3 00_KAI_ENGINE_SDK/kai_prompt_and_rig_compiler.py \

--genome 00_KAI_ENGINE_SDK/kai_canonical_genome_v4.json \

--track track_c_chibi \

--outfit adventure_ironsword \

--action "Casting Water & Lightning Python spells across 16 cells" \

--out tickets/kai_job_ticket.json

### B. Composite Sealed Mannequin + Modular Gear / VFX (0% AI Drift)

python3 00_KAI_ENGINE_SDK/kai_paperdoll_compositor.py \

--base 05_generated_packs/01_RPG/MOD_B01_02_KAI_SOCKET_MANNEQUIN_COMBAT_AND_CODING_4x4.png \

--overlay 05_generated_packs/01_RPG/MOD_B03_01_KAI_PAPERDOLL_HOODIE_AND_MOSS_CLOAK_4x4.png \

--overlay 05_generated_packs/01_RPG/MOD_B02_01_MODULAR_SWORDS_AND_BLADES_ARSENAL_4x4.png \

--out output/KAI_COMPOSITED_4x4.png

### C. Verify & Auto-Clean Any Hero Kai 4×4 Sheet (11 Gates)

python3 00_KAI_ENGINE_SDK/acve_kai_verifier_v3.py \

--input output/KAI_COMPOSITED_4x4.png \

--output output/KAI_VERIFIED_4x4.png \

--genome 00_KAI_ENGINE_SDK/kai_canonical_genome_v4.json \

--clean-captions \

--strip-islands \

--clamp-palette


