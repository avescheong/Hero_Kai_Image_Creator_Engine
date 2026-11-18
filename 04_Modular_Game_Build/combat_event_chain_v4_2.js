// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// combat_event_chain_v4_1.js (Phase 3: School Coefficients, Gear/Skill-Tree Stats, 100% Rage Ultimate, Rhythm Parry & 12 Boss Gates)
window.GameState = {
  chapter: 1, day: 1, maxDays: 60, gold: 120, gems: 25, stamina: 20, maxStamina: 20,
  level: 1, xp: 0, xpNext: 100, skillSparks: 4, pacingMode: "sakuga", autoMarch: false,
  inCombat: false, awaitingChoice: false, parryWindowOpen: false, parriedThisTurn: false,
  activeSchool: "starlight", activeWeapon: "ironsword", activeArmor: "moss_cloak",
  activePet: "string", activeMount: "none", activeActionSheet: null,
  heroActionState: "KAI_ACT_01", heroActionUntil: 0,
  unlockedNodes: ["st_1"], draftedSkills: [], petLevel: 1, overclockDays: 0,
  collectedScrolls: [1], activeStreetPickup: null, propCollected: false, petBondedToday: false,
  heroStatus: "none", cureTaps: 0,
  hero: { hp: 850, maxHp: 850, atk: 105, shield: 90, rage: 0, crit: 27, combo: 20, dr: 25, skillDmg: 125 },
  enemy: null, roadsideNpc: null, defeatedIds: []
};

window.StoryEngine = {
  autoTimer: null,

  getCurrentChapter() {
    const cfg = window.CAPYBARA_CONFIG;
    return cfg.CHAPTERS[(window.GameState.chapter - 1) % cfg.CHAPTERS.length];
  },

  toggleAutoMarch() {
    const st = window.GameState;
    st.autoMarch = !st.autoMarch;
    const btn = document.getElementById("btn-auto");
    if (btn) {
      btn.textContent = st.autoMarch ? "⏸️ Auto: ON" : "▶️ Auto: OFF";
      btn.classList.toggle("active-auto", st.autoMarch);
    }
    if (st.autoMarch) {
      this.scheduleAutoMarch();
    } else if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
  },

  scheduleAutoMarch() {
    if (this.autoTimer) clearTimeout(this.autoTimer);
    const st = window.GameState;
    if (!st.autoMarch) return;
    const modal = document.getElementById("modal-backdrop");
    const modalOpen = modal && !modal.classList.contains("hidden");
    const waitMs = st.pacingMode === "turbo" ? 650 : (st.pacingMode === "slow" ? 1600 : 1050);
    this.autoTimer = setTimeout(() => {
      if (!st.autoMarch) return;
      if (!st.inCombat && !st.awaitingChoice && (!modal || modal.classList.contains("hidden"))) {
        this.advanceDay();
      }
      this.scheduleAutoMarch();
    }, modalOpen ? 1000 : waitMs);
  },

  recalcHeroStats(preserveHpRatio = true) {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    const w = (cfg.WEAPONS_DB && cfg.WEAPONS_DB[st.activeWeapon]) || { atk: 45, crit: 12, combo: 20, skillDmg: 25, dr: 10 };
    const a = (cfg.ARMORS_DB && cfg.ARMORS_DB[st.activeArmor]) || { hp: 350, shield: 90, dr: 15 };
    const p = cfg.SPIRIT_PETS.find(x => x.id === st.activePet) || { atk: 25, crit: 20, shield: 60 };
    const m = cfg.MOUNTS.find(x => x.id === st.activeMount) || { hp: 0, shield: 0, crit: 5, dr: 0 };

    let tHp = 0, tAtk = 0, tShield = 0, tCrit = 0, tCombo = 0, tSkill = 0, tDr = 0;
    (cfg.SKILL_TREES_DB || []).forEach(br => {
      br.nodes.forEach(nd => {
        if ((st.unlockedNodes || []).includes(nd.id)) {
          tHp += nd.hp || 0; tAtk += nd.atk || 0; tShield += nd.shield || 0;
          tCrit += nd.crit || 0; tCombo += nd.combo || 0; tSkill += nd.skillDmg || 0; tDr += nd.dr || 0;
        }
      });
    });

    (st.draftedSkills || []).forEach(sid => {
      const sk = (cfg.ROGUELITE_SKILLS_DB || []).find(x => x.id === sid);
      if (sk) {
        tHp += sk.hp || 0; tAtk += sk.atk || 0; tShield += sk.shield || 0;
        tCrit += sk.crit || 0; tCombo += sk.combo || 0; tSkill += sk.skillDmg || 0; tDr += sk.dr || 0;
      }
    });

    const petBonusMult = 1 + ((st.petLevel || 1) - 1) * 0.25;
    const ocCrit = (st.overclockDays || 0) > 0 ? 15 : 0;
    const ocSkill = (st.overclockDays || 0) > 0 ? 35 : 0;

    const ratio = st.hero.maxHp > 0 ? (st.hero.hp / st.hero.maxHp) : 1;
    st.hero.maxHp = 500 + (st.level - 1) * 60 + a.hp + (m.hp || 0) + tHp;
    st.hero.hp = preserveHpRatio ? Math.max(1, Math.min(st.hero.maxHp, Math.round(st.hero.maxHp * ratio))) : st.hero.maxHp;
    st.hero.atk = 45 + (st.level - 1) * 4 + w.atk + Math.round((p.atk || 0) * petBonusMult) + tAtk;
    st.hero.crit = Math.min(95, 15 + w.crit + (p.crit || 0) + (m.crit || 0) + tCrit + ocCrit);
    st.hero.combo = Math.min(90, 10 + w.combo + tCombo);
    st.hero.skillDmg = 100 + w.skillDmg + tSkill + ocSkill;
    st.hero.dr = Math.min(75, a.dr + (m.dr || 0) + tDr);
    st.hero.baseShield = a.shield + Math.round((p.shield || 0) * petBonusMult) + (m.shield || 0) + tShield;
    st.hero.shield = Math.max(st.hero.shield || 0, st.hero.baseShield);
  },

  advanceDay() {
    const st = window.GameState;
    if (st.inCombat || st.awaitingChoice) return;
    st.roadsideNpc = null;
    st.activeActionSheet = null;
    st.propCollected = false;
    st.petBondedToday = false;

    if ((st.overclockDays || 0) > 0) {
      st.overclockDays--;
      if (st.overclockDays === 0) this.recalcHeroStats(true);
    }

    if (st.day >= st.maxDays) {
      if (st.chapter < 12) {
        st.chapter++;
        st.day = 1;
        st.skillSparks += 3;
        st.gems = (st.gems || 0) + 10;
        if (!st.collectedScrolls.includes(st.chapter)) st.collectedScrolls.push(st.chapter);
        const nextCh = this.getCurrentChapter();
        window.Sprite16FPSEngine.setHeroAction("KAI_ACT_18", 1600);
        window.VfxRenderer.triggerProp("EXP_LINK_47", "NEXT CHAPTER!");
        window.AppUI.log(`🌈 <strong>Unlocked ${nextCh.name}!</strong> +3 Skill Sparks, +10 Star Gems &amp; Jing Si Wisdom Scroll #${st.chapter}!`, "event");
        window.AppUI.refreshVitals();
        window.SaveManager.saveToLocal();
      } else {
        window.Sprite16FPSEngine.setHeroAction("KAI_ACT_18", 2200);
        window.VfxRenderer.triggerProp("VFX_MISC_50", "VICTORY!");
        window.AppUI.log("👑 <strong>All 12 Chapters Cleared!</strong> Hero Kai purified the Citadel of the Core!", "event");
      }
      return;
    }

    st.day++;
    const cv = document.getElementById("game-canvas");
    const cw = cv ? cv.width : 960;
    const ch = cv ? cv.height : 300;
    window.Sprite16FPSEngine.spawnOneShot("VFX_MISC_47", cw * 0.25, ch * 0.84, 0.50);

    // Spawn a visible interactive street pickup on the road (65% chance)
    const pickups = window.CAPYBARA_CONFIG.STREET_PICKUPS_V4_2 || [];
    if (pickups.length > 0 && Math.random() < 0.65) {
      const p = pickups[Math.floor(Math.random() * pickups.length)];
      st.activeStreetPickup = {
        key: p.key, label: p.label, gold: p.gold, hp: p.hp,
        rx: 0.44 + Math.random() * 0.24, ry: 0.72
      };
    } else {
      st.activeStreetPickup = null;
    }

    const chObj = this.getCurrentChapter();
    const gate = window.CAPYBARA_CONFIG.PYTHON_GATES.find(g => g.day === st.day);

    if (gate) {
      this.triggerPythonGate(gate);
    } else if (st.day === 15) {
      this.triggerSpecialNpc(chObj.npc);
    } else if (st.day === 20) {
      this.startCombat(chObj.d20, true, "Day-20 Mini-Boss");
    } else if (st.day === 40) {
      this.startCombat(chObj.d40, true, "Day-40 Elite Gatekeeper");
    } else if (st.day === 60) {
      this.triggerChapterBossGate(chObj);
    } else {
      const roll = Math.random();
      if (roll < 0.36) this.startCombat(chObj.minion, false, "Field Minion");
      else if (roll < 0.50) this.triggerChestMimicOrSanctuary();
      else if (roll < 0.64) this.triggerSpecialNpc(chObj.npc);
      else if (roll < 0.78) this.triggerWheel();
      else if (roll < 0.90) this.triggerCampfire();
      else this.triggerTrapOrDummy();
    }
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
  },

  triggerChapterBossGate(chObj) {
    const st = window.GameState;
    const bossGate = (window.CAPYBARA_CONFIG.CHAPTER_BOSS_GATES || {})[st.chapter];
    if (!bossGate) {
      this.startCombat(chObj.d60, true, "Day-60 Chapter End-Boss");
      return;
    }
    st.awaitingChoice = true;
    window.VfxRenderer.triggerMangaCutIn("boss");
    window.AppUI.log(`👑 <strong>Day-60 Boss Python Gate (Ch.${st.chapter}):</strong> ${bossGate.prompt}<br><code>${bossGate.code}</code>`, "boss");
    window.AppUI.setChoices(bossGate.options.map(opt => ({
      label: opt,
      fn: () => {
        const solved = opt === bossGate.answer;
        st.awaitingChoice = false;
        window.AppUI.setChoices([]);
        this.startCombat(chObj.d60, true, "Day-60 Chapter End-Boss", solved);
      }
    })));
  },

  triggerPythonGate(gate) {
    const st = window.GameState;
    st.awaitingChoice = true;
    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_09", 2000);
    window.VfxRenderer.triggerProp("VFX_MISC_41", "PYTHON GATE");
    window.AppUI.log(`🐍 <strong>Python Gate (Day ${st.day}):</strong> ${gate.prompt}<br><code>${gate.code}</code>`, "python");
    window.AppUI.setChoices([
      {
        label: "💻 Open Python Spell-Forge IDE",
        fn: () => window.DrawerUI.openCodeForgeModal(gate)
      },
      ...gate.options.map(opt => ({
        label: opt,
        fn: () => {
          if (opt === gate.answer) {
            st.gold += 100; st.skillSparks += 2; st.hero.rage = Math.min(100, st.hero.rage + 30);
            st.overclockDays = Math.max(st.overclockDays || 0, 5);
            this.recalcHeroStats(true);
            window.VfxRenderer.triggerCodeTrace(gate.lessonRing || "EXP_LINK_43");
            window.AppUI.log(`✅ <strong>Correct!</strong> ${gate.reward} (+2 Skill Sparks &amp; 5-Day Python Overclock!)`, "event");
          } else {
            window.Sprite16FPSEngine.setHeroAction("KAI_ACT_05", 1400);
            window.VfxRenderer.triggerHitCallout("dodge", "DODGED!");
            window.AppUI.log("❌ Close! Kai dodges past safely (+15 Gold). Open Spell-Forge IDE anytime to practice!", "event");
            st.gold += 15;
          }
          st.awaitingChoice = false; window.AppUI.setChoices([]); window.AppUI.refreshVitals();
        }
      }))
    ]);
  },

  triggerSpecialNpc(npcId) {
    const st = window.GameState;
    const npc = window.CAPYBARA_CONFIG.SPECIAL_NPCS.find(n => n.id === npcId) || window.CAPYBARA_CONFIG.SPECIAL_NPCS[0];
    st.awaitingChoice = true;
    st.roadsideNpc = { sheetId: npc.id, name: npc.name, isBoss: false, animRow: 1 };
    const stageProps = (window.CAPYBARA_CONFIG.STAGE_LOCKED_PROPS_V4_2 || {})[st.chapter] || ["VFX_MISC_26"];
    const propKey = stageProps[0];
    window.AppUI.log(`🤝 <strong>Roadside Encounter — ${npc.name}</strong> (${npc.role}): Offers <em>${npc.buff}</em>!`, "event");
    window.AppUI.setChoices([{
      label: `✨ Accept ${npc.name}'s Blessing`,
      fn: () => {
        st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + Math.round(st.hero.maxHp * 0.25));
        st.hero.shield += 80;
        st.gold += 45;
        st.heroStatus = "none";
        window.VfxRenderer.triggerProp(propKey, "BLESSED!");
        window.AppUI.log(`🌟 Received <strong>${npc.buff}</strong>!`, "event");
        st.awaitingChoice = false; st.roadsideNpc = null; window.AppUI.setChoices([]); window.AppUI.refreshVitals();
      }
    }]);
  },

  triggerChestMimicOrSanctuary() {
    const st = window.GameState;
    if (Math.random() < 0.5) {
      st.awaitingChoice = true;
      st.roadsideNpc = { sheetId: "ENM_BOSS_57", name: "Corrupted Bug Hive", isBoss: false, animRow: 0 };
      window.AppUI.log("🪲 <strong>Corrupted Bug Hive!</strong> Purify it to rescue trapped woodland critters:", "python");
      window.AppUI.setChoices([{
        label: "🌸 Cast Lotus Purify",
        fn: () => {
          st.roadsideNpc.animRow = 3;
          st.gems += 5; st.xp += 50;
          window.Sprite16FPSEngine.setHeroAction("KAI_ACT_09", 1400);
          window.VfxRenderer.triggerLotusPurification();
          window.AppUI.log("🐇 <strong>Critters Rescued!</strong> +5 Star Gems & +50 XP.", "event");
          st.awaitingChoice = false; window.AppUI.setChoices([]); window.AppUI.refreshVitals();
        }
      }]);
    } else {
      this.startCombat("ENM_BOSS_58", false, "Surprise Chest Mimic");
    }
  },

  triggerTrapOrDummy() {
    const st = window.GameState;
    const isDummy = Math.random() < 0.5;
    st.roadsideNpc = {
      sheetId: isDummy ? "ENM_BOSS_61" : "ENM_BOSS_60",
      name: isDummy ? "Academy Training Dummy" : "Coding Hazard Trap",
      isBoss: false, animRow: 1
    };
    window.Sprite16FPSEngine.setHeroAction(isDummy ? "KAI_CMB_01" : "KAI_ACT_04", 1500);
    st.xp += 35; st.hero.rage = Math.min(100, st.hero.rage + 15);
    window.AppUI.log(isDummy ? "🎯 <strong>Training Dummy Combo!</strong> +35 XP & +15 Rage." : "⚙️ <strong>Disarmed Coding Hazard Trap!</strong> +35 XP & +15 Rage.", "event");
  },

  triggerWheel() {
    const st = window.GameState;
    st.awaitingChoice = true;
    window.VfxRenderer.triggerProp("VFX_MISC_21", "WHEEL OF FORTUNE");
    window.AppUI.log("🎡 <strong>Roadside Wheel of Fortune!</strong> Spin the 16-FPS wheel:", "event");
    window.AppUI.setChoices([{
      label: "🎡 Spin Wheel!",
      fn: () => {
        const isGold = Math.random() < 0.5;
        if (isGold) { st.gold += 75; st.hero.rage = Math.min(100, st.hero.rage + 25); }
        else { st.hero.shield += 140; }
        window.VfxRenderer.triggerHitCallout("combo");
        window.AppUI.log(`✨ Wheel landed on <strong>${isGold ? "+75 Gold & +25 Rage" : "+140 Hollow Shield"}</strong>!`, "event");
        st.awaitingChoice = false; window.AppUI.setChoices([]); window.AppUI.refreshVitals();
      }
    }]);
  },

  triggerCampfire() {
    const st = window.GameState;
    st.awaitingChoice = true;
    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_11", 2200);
    window.VfxRenderer.triggerProp("VFX_MISC_22", "VEGGIE CAMPFIRE");
    window.AppUI.log("🍲 <strong>100% Plant-Based Campfire Rest:</strong> Choose a vegetarian provision:", "event");
    window.AppUI.setChoices(window.CAPYBARA_CONFIG.VEG_PROVISIONS.slice(0, 2).map(food => ({
      label: `🥬 ${food.name}`,
      fn: () => {
        const healAmt = Math.round(st.hero.maxHp * food.hpPct);
        st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + healAmt);
        st.hero.rage = Math.min(100, st.hero.rage + food.rage);
        if (food.cleanse) st.heroStatus = "none";
        window.Sprite16FPSEngine.setHeroAction("KAI_ACT_11", 1600);
        window.Sprite16FPSEngine.spawnFloatingText(`+${healAmt} HP`, 270, 200, "#4ade80", 1.1);
        window.VfxRenderer.triggerProp("VFX_MISC_38", "+HP!");
        window.AppUI.log(`🌿 Ate <strong>${food.name}</strong> — ${food.desc}`, "event");
        st.awaitingChoice = false; window.AppUI.setChoices([]); window.AppUI.refreshVitals();
      }
    })));
  },

  triggerParry() {
    const st = window.GameState;
    if (!st.inCombat || !st.parryWindowOpen || st.parriedThisTurn) return false;
    st.parriedThisTurn = true;
    st.parryWindowOpen = false;
    st.activeActionSheet = "KAI_CMB_05";
    st.hero.rage = Math.min(100, st.hero.rage + 25);
    window.VfxRenderer.triggerHitCallout("true_py", "PARRY COUNTER!");
    if (st.enemy) {
      const counterDmg = Math.round(st.hero.atk * 1.80);
      st.enemy.hp -= counterDmg;
      this.applyBossStaggerDamage(1);
      window.Sprite16FPSEngine.spawnFloatingText(`-${counterDmg} PARRY!`, 700, 175, "#34d399", 1.2);
      window.AppUI.log(`🛡️ <strong>PERFECT COLON : PARRY!</strong> Blocked hit &amp; countered with <code>KAI_CMB_05</code> for <strong>${counterDmg}</strong> DMG!`, "magic");
    }
    window.AppUI.refreshVitals();
    return true;
  },

  applyBossStaggerDamage(pips = 1) {
    const st = window.GameState;
    if (!st.enemy || !st.enemy.isBoss || st.enemy.staggered) return;
    st.enemy.staggerPips = Math.max(0, (st.enemy.staggerPips ?? 3) - pips);
    if (st.enemy.staggerPips === 0) {
      st.enemy.staggered = true;
      st.enemy.frozen = true;
      window.VfxRenderer.triggerMangaCutIn("shatter");
      window.Sprite16FPSEngine.spawnFloatingText("💥 ARMOR BROKEN! 1.75× DMG", 690, 130, "#38bdf8", 1.25);
      window.AppUI.log(`💥 <strong>BOSS ARMOR BROKEN!</strong> ${st.enemy.name} is Staggered (EXP_LINK_36 + 40) — takes 1.75× DMG &amp; skips next attack!`, "boss");
    }
  },

  tapCureStatus() {
    const st = window.GameState;
    if (st.heroStatus === "none") return;
    st.cureTaps = (st.cureTaps || 0) + 1;
    if (st.cureTaps >= 3) {
      st.heroStatus = "none";
      st.cureTaps = 0;
      window.VfxRenderer.triggerLotusPurification();
      window.AppUI.log("🌸 <strong>Status Cured!</strong> Tapped 3× to break free early!", "event");
      window.AppUI.refreshVitals();
    } else {
      window.AppUI.log(`👆 Tap to Cure (${st.cureTaps}/3)...`, "python");
    }
  },

  startCombat(sheetId, isBoss, tierLabel, gateSolved = false) {
    const st = window.GameState;
    this.recalcHeroStats(true);
    const meta = window.CAPYBARA_CONFIG.ENEMY_CATALOG[sheetId] || { name: "Glitch Construct", bug: "SyntaxError" };
    st.inCombat = true;
    st.roadsideNpc = null;
    st.activeStreetPickup = null;
    st.hero.shield = Math.max(st.hero.shield, st.hero.baseShield || 90);
    const effectiveCh = Math.max(st.chapter, meta.ch || 1);
    const effectiveDay = (tierLabel === "Bestiary Duel" && isBoss) ? Math.max(st.day, 32) : st.day;
    const scale = 1 + (effectiveCh - 1) * 0.45 + effectiveDay * 0.08;
    const baseHp = isBoss ? ((st.day === 60 || tierLabel === "Bestiary Duel") ? 1150 : 620) : 210;
    const baseAtk = isBoss ? (st.day === 60 ? 38 : 26) : 16;
    const maxHp = Math.round(baseHp * scale);
    st.enemy = {
      sheetId, name: meta.name, bug: meta.bug,
      hp: maxHp, maxHp: maxHp,
      atk: Math.round(baseAtk * scale),
      isBoss, staggerPips: isBoss ? 3 : 0, staggered: false,
      burnTurns: 0, frozen: false, silenced: false
    };
    if (gateSolved) {
      const shatterDmg = Math.round(st.hero.atk * 2.5);
      st.enemy.hp -= shatterDmg;
      this.applyBossStaggerDamage(2);
      window.VfxRenderer.triggerMangaCutIn("shatter");
      window.AppUI.log(`💥 <strong>Python Gate Solved!</strong> Shattered ${st.enemy.name}'s barrier for <strong>${shatterDmg}</strong> DMG!`, "magic");
    } else if (isBoss) {
      window.VfxRenderer.triggerProp("VFX_MISC_42", "BOSS WARNING!");
    }
    window.AppUI.log(`⚔️ <strong>Day ${st.day} [${tierLabel}]:</strong> ${st.enemy.name} (<code>${st.enemy.bug}</code>) appeared!`, isBoss ? "boss" : "combat");
    const turnMs = st.pacingMode === "slow" ? 1650 : (st.pacingMode === "turbo" ? 750 : 1200);
    setTimeout(() => this.runTurn(), turnMs);
  },

  runTurn() {
    const st = window.GameState;
    if (!st.inCombat || !st.enemy) return;
    const cfg = window.CAPYBARA_CONFIG;

    // 1. Check 100% Rage Grand Ouroboros Seal Ultimate!
    let school = cfg.MAGIC_SCHOOLS.find(s => s.id === st.activeSchool) || cfg.MAGIC_SCHOOLS[0];
    let isUltimate = false;
    if (st.hero.rage >= 100) {
      school = cfg.MAGIC_SCHOOLS.find(s => s.id === "special") || school;
      st.hero.rage = 0;
      isUltimate = true;
      window.VfxRenderer.triggerMangaCutIn("rage");
    }

    st.activeActionSheet = school.kaiSheet;
    const critChance = (st.hero.crit + (school.critBonus || 0)) / 100;
    const isCrit = Math.random() < critChance;
    const spellScale = (st.hero.skillDmg || 100) / 100;
    const staggerMult = st.enemy.staggered ? 1.75 : 1.0;
    let dmg = Math.round(st.hero.atk * (school.atkPct || 1.8) * spellScale * (isCrit ? 1.8 : 1.0) * staggerMult);

    // Echo Clone double-cast (Chrono) or Combo proc
    if (school.statusEffect === "echo_clone" && Math.random() < 0.50) {
      dmg = Math.round(dmg * 1.5);
      window.AppUI.log("⏳ <strong>Chrono Echo Clone!</strong> Spell echoed for 1.5× DMG!", "magic");
    } else if (Math.random() * 100 < st.hero.combo) {
      dmg = Math.round(dmg * 1.35);
      window.VfxRenderer.triggerHitCallout("combo", "COMBO ×1.35!");
    }

    st.enemy.hp -= dmg;
    if (isUltimate || isCrit) {
      this.applyBossStaggerDamage(isUltimate ? 2 : 1);
    }
    if (!isUltimate) st.hero.rage = Math.min(100, st.hero.rage + (school.rageGain || 20));
    if (school.shieldGain) st.hero.shield += school.shieldGain;
    if (school.healPct) st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + Math.round(st.hero.maxHp * school.healPct));
    if (school.statusEffect === "cleanse_all" || school.statusEffect === "cleanse_burn" || school.statusEffect === "cleanse_silence") {
      st.heroStatus = "none";
    }
    if (school.statusEffect === "burn") st.enemy.burnTurns = 3;
    if (school.statusEffect === "freeze" && Math.random() < 0.40) st.enemy.frozen = true;
    if (school.statusEffect === "silence") st.enemy.silenced = true;

    // Burn DoT tick
    if (st.enemy.burnTurns > 0) {
      const burnDmg = Math.round(st.hero.atk * 0.35);
      st.enemy.hp -= burnDmg;
      st.enemy.burnTurns--;
    }

    window.VfxRenderer.triggerSchoolCast(school.id);
    const isRangedSpell = ["starlight", "lightning", "water"].includes(school.id) || st.activeWeapon === "flying_dagger";
    window.VfxRenderer.triggerHitCallout(isUltimate ? "boom" : (isCrit ? "crit" : (isRangedSpell ? "bang" : "pow")), `-${dmg}${isCrit ? " CRIT!" : ""}`);
    window.AppUI.log(`✨ ${isUltimate ? "<strong>[100% RAGE ULTIMATE]</strong> " : ""}Kai casts <strong>${school.name}</strong> (<code>${school.py}</code>) for <strong>${dmg}</strong> ${isCrit ? "CRIT!" : "DMG"}`, "magic");

    // Check Enemy Defeat
    if (st.enemy.hp <= 0) {
      const defeated = st.enemy;
      if (!st.defeatedIds.includes(defeated.sheetId)) st.defeatedIds.push(defeated.sheetId);
      st.inCombat = false; st.enemy = null; st.activeActionSheet = null; st.parryWindowOpen = false;
      const goldGain = defeated.isBoss ? 140 : 45;
      const xpGain = defeated.isBoss ? 100 : 50;
      const gemGain = defeated.isBoss ? 5 : 1;
      st.gold += goldGain; st.xp += xpGain; st.gems = (st.gems || 0) + gemGain;
      let leveledUp = false;
      while (st.xp >= st.xpNext) {
        st.level++; st.xp -= st.xpNext; st.skillSparks += 2;
        leveledUp = true;
        this.recalcHeroStats(false);
        window.Sprite16FPSEngine.setHeroAction("KAI_ACT_18", 1800);
        window.VfxRenderer.triggerProp("EXP_LINK_46", "LEVEL UP!");
      }
      if (!leveledUp) window.Sprite16FPSEngine.setHeroAction("KAI_ACT_16", 1500);
      window.VfxRenderer.triggerLotusPurification();
      window.Sprite16FPSEngine.spawnFloatingText(`+${goldGain}G  +${gemGain}💎`, 700, 210, "#fde68a", 1.15);
      window.AppUI.log(`🌸 <strong>Purified ${defeated.name}!</strong> +${goldGain} Gold, +${gemGain} Star Gems &amp; +${xpGain} XP.`, "event");
      window.AppUI.refreshVitals();
      window.SaveManager.saveToLocal();
      if ((leveledUp || defeated.isBoss) && window.DrawerUI && window.DrawerUI.openSkillDraftModal) {
        setTimeout(() => {
          window.DrawerUI.openSkillDraftModal(leveledUp ? `Level ${st.level} Level-Up Draft` : `${defeated.name} Victory Draft`);
        }, 550);
      }
      return;
    }

    // Enemy Turn (with Freeze, Stagger Recovery, Silence, Rhythm Parry & DR)
    if (st.enemy.frozen) {
      st.enemy.frozen = false;
      if (st.enemy.staggered) {
        st.enemy.staggered = false;
        st.enemy.staggerPips = 3;
      }
      window.AppUI.log(`❄️ <strong>${st.enemy.name} is Staggered/Frozen!</strong> Skips its attack!`, "event");
    } else {
      st.parryWindowOpen = true;
      st.parriedThisTurn = false;
      window.AppUI.refreshVitals();
      setTimeout(() => {
        if (!st.inCombat || !st.enemy) return;
        st.parryWindowOpen = false;
        if (st.parriedThisTurn) {
          window.AppUI.refreshVitals();
          return;
        }
        const mat = (window.CAPYBARA_CONFIG.CHAPTER_STATUS_MATRIX_V4_2 || {})[st.chapter] || { status: "poison", projRow: 1 };
        window.VfxRenderer.triggerEnemyProjectile(mat.projRow);
        window.VfxRenderer.triggerHitCallout("bang");
        const raw = st.enemy.silenced ? Math.round(st.enemy.atk * 0.5) : st.enemy.atk;
        st.enemy.silenced = false;
        const mitigated = Math.max(3, Math.round(raw * (1 - (st.hero.dr || 0) / 100)));
        const afterShield = Math.max(0, mitigated - st.hero.shield);
        st.hero.shield = Math.max(0, st.hero.shield - mitigated);
        st.hero.hp = Math.max(1, st.hero.hp - afterShield);
        if (afterShield > 0) {
          window.Sprite16FPSEngine.setHeroAction("KAI_ACT_17", 700);
          window.Sprite16FPSEngine.spawnFloatingText(`-${afterShield} HP`, 270, 200, "#ef4444", 1.1);
          if (Math.random() < 0.22) {
            st.heroStatus = mat.status;
            st.cureTaps = 0;
          }
        }
        window.AppUI.refreshVitals();
      }, st.pacingMode === 'slow' ? 1100 : (st.pacingMode === 'turbo' ? 500 : 750));
    }

    window.AppUI.refreshVitals();
    const nextTurnMs = st.pacingMode === "slow" ? 1900 : (st.pacingMode === "turbo" ? 850 : 1380);
    setTimeout(() => this.runTurn(), nextTurnMs);
  }
};
