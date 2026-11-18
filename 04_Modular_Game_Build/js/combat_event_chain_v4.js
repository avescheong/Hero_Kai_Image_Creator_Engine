window.GameState = {
  chapter: 1, day: 1, maxDays: 60, gold: 120, gems: 25, stamina: 20, maxStamina: 20,
  level: 1, xp: 0, xpNext: 100, speed: 1, inCombat: false, awaitingChoice: false,
  activeSchool: "starlight", activePet: "string", activeMount: "none",
  hero: { hp: 500, maxHp: 500, atk: 45, shield: 0, rage: 0 },
  enemy: null, roadsideNpc: null, defeatedIds: []
};

window.StoryEngine = {
  getCurrentChapter() {
    const cfg = window.CAPYBARA_CONFIG;
    return cfg.CHAPTERS[(window.GameState.chapter - 1) % cfg.CHAPTERS.length];
  },

  advanceDay() {
    const st = window.GameState;
    if (st.inCombat || st.awaitingChoice) return;
    st.roadsideNpc = null;

    if (st.day >= st.maxDays) {
      if (st.chapter < 12) {
        st.chapter++;
        st.day = 1;
        const nextCh = this.getCurrentChapter();
        window.VfxRenderer.triggerProp("VFX_MISC_41", "NEXT CHAPTER!");
        window.AppUI.log(`🌈 <strong>Unlocked ${nextCh.name}!</strong> Day reset to 1/60.`, "event");
        window.AppUI.refreshVitals();
        window.SaveManager.saveToLocal();
      } else {
        window.VfxRenderer.triggerProp("VFX_MISC_50", "VICTORY!");
        window.AppUI.log("👑 <strong>All 12 Chapters Cleared!</strong> Hero Kai purified the Citadel of the Core!", "event");
      }
      return;
    }

    st.day++;
    window.Sprite16FPSEngine.spawnOneShot("VFX_MISC_47", 240, 340, 0.50);
    const chObj = this.getCurrentChapter();

    // Fixed Milestone Days: 10/30/50 Python Gates, 15 Special NPC, 20 Mini-Boss, 40 Elite, 60 Chapter End-Boss
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
      this.startCombat(chObj.d60, true, "Day-60 Chapter End-Boss");
    } else {
      const roll = Math.random();
      if (roll < 0.36) {
        this.startCombat(chObj.minion, false, "Field Minion");
      } else if (roll < 0.50) {
        this.triggerChestMimicOrSanctuary();
      } else if (roll < 0.64) {
        this.triggerSpecialNpc(chObj.npc);
      } else if (roll < 0.78) {
        this.triggerWheel();
      } else if (roll < 0.90) {
        this.triggerCampfire();
      } else {
        this.triggerTrapOrDummy();
      }
    }
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
  },

  triggerPythonGate(gate) {
    const st = window.GameState;
    st.awaitingChoice = true;
    window.VfxRenderer.triggerProp("VFX_MISC_41", "PYTHON GATE");
    window.AppUI.log(`🐍 <strong>Python Gate (Day ${st.day}):</strong> ${gate.prompt}<br><code>${gate.code}</code>`, "python");
    window.AppUI.setChoices(gate.options.map(opt => ({
      label: opt,
      fn: () => {
        if (opt === gate.answer) {
          st.gold += 100; st.hero.atk = Math.round(st.hero.atk * 1.2);
          window.VfxRenderer.triggerProp("VFX_MISC_50", "UNLOCKED!");
          window.AppUI.log(`✅ <strong>Correct!</strong> ${gate.reward}`, "event");
        } else {
          window.VfxRenderer.triggerHitCallout("dodge");
          window.AppUI.log("❌ Close! Kai dodges past safely (+15 Gold).", "event");
          st.gold += 15;
        }
        st.awaitingChoice = false; window.AppUI.setChoices([]); window.AppUI.refreshVitals();
      }
    })));
  },

  triggerSpecialNpc(npcId) {
    const st = window.GameState;
    const npc = window.CAPYBARA_CONFIG.SPECIAL_NPCS.find(n => n.id === npcId) || window.CAPYBARA_CONFIG.SPECIAL_NPCS[0];
    st.awaitingChoice = true;
    st.roadsideNpc = { sheetId: npc.id, name: npc.name, isBoss: false, animRow: 1 };
    window.AppUI.log(`🤝 <strong>Roadside Encounter — ${npc.name}</strong> (${npc.role}): Offers <em>${npc.buff}</em>!`, "event");
    window.AppUI.setChoices([{
      label: `✨ Accept ${npc.name}'s Blessing`,
      fn: () => {
        st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + Math.round(st.hero.maxHp * 0.25));
        st.hero.shield += 80;
        st.hero.atk += 5;
        st.gold += 45;
        window.VfxRenderer.triggerProp("VFX_MISC_26", "BLESSED!");
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
      isBoss: false,
      animRow: 1
    };
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
        window.AppUI.log(`✨ Wheel landed on <strong>${isGold ? "+75 Gold & +25 Rage" : "+140 Golden Shield"}</strong>!`, "event");
        st.awaitingChoice = false; window.AppUI.setChoices([]); window.AppUI.refreshVitals();
      }
    }]);
  },

  triggerCampfire() {
    const st = window.GameState;
    st.awaitingChoice = true;
    window.VfxRenderer.triggerProp("VFX_MISC_22", "VEGGIE CAMPFIRE");
    window.AppUI.log("🍲 <strong>100% Plant-Based Campfire Rest:</strong> Choose a vegetarian provision:", "event");
    window.AppUI.setChoices(window.CAPYBARA_CONFIG.VEG_PROVISIONS.slice(0, 2).map(food => ({
      label: `🥬 ${food.name}`,
      fn: () => {
        st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + Math.round(st.hero.maxHp * food.hpPct));
        st.hero.rage = Math.min(100, st.hero.rage + food.rage);
        window.VfxRenderer.triggerProp("VFX_MISC_38", "+HP!");
        window.AppUI.log(`🌿 Ate <strong>${food.name}</strong> — ${food.desc}`, "event");
        st.awaitingChoice = false; window.AppUI.setChoices([]); window.AppUI.refreshVitals();
      }
    })));
  },

  startCombat(sheetId, isBoss, tierLabel) {
    const st = window.GameState;
    const meta = window.CAPYBARA_CONFIG.ENEMY_CATALOG[sheetId] || { name: "Glitch Construct", bug: "SyntaxError" };
    st.inCombat = true;
    st.roadsideNpc = null;
    const scale = 1 + (st.chapter - 1) * 0.35 + st.day * 0.06;
    const baseHp = isBoss ? (st.day === 60 ? 460 : 280) : 130;
    const baseAtk = isBoss ? (st.day === 60 ? 34 : 24) : 15;
    st.enemy = {
      sheetId,
      name: meta.name,
      bug: meta.bug,
      hp: Math.round(baseHp * scale),
      atk: Math.round(baseAtk * scale),
      isBoss
    };
    if (isBoss) window.VfxRenderer.triggerProp("VFX_MISC_42", "BOSS WARNING!");
    window.AppUI.log(`⚔️ <strong>Day ${st.day} [${tierLabel}]:</strong> ${st.enemy.name} (<code>${st.enemy.bug}</code>) appeared!`, isBoss ? "boss" : "combat");
    setTimeout(() => this.runTurn(), Math.round(450 / st.speed));
  },

  runTurn() {
    const st = window.GameState;
    if (!st.inCombat || !st.enemy) return;
    const isCrit = Math.random() < 0.35;
    const dmg = Math.round(st.hero.atk * (isCrit ? 1.8 : 1.0));
    st.enemy.hp -= dmg;
    st.hero.rage = Math.min(100, st.hero.rage + 25);
    window.VfxRenderer.triggerSchoolCast(st.activeSchool);
    window.VfxRenderer.triggerHitCallout(isCrit ? "crit" : "pow");
    window.AppUI.log(`✨ Kai casts <strong>${st.activeSchool}</strong> for <strong>${dmg}</strong> ${isCrit ? "CRIT!" : "DMG"}`, "magic");

    if (st.enemy.hp <= 0) {
      const defeated = st.enemy;
      if (!st.defeatedIds.includes(defeated.sheetId)) st.defeatedIds.push(defeated.sheetId);
      st.inCombat = false; st.enemy = null;
      const goldGain = defeated.isBoss ? 120 : 40;
      const xpGain = defeated.isBoss ? 90 : 45;
      st.gold += goldGain; st.xp += xpGain;
      while (st.xp >= st.xpNext) { st.level++; st.xp -= st.xpNext; st.hero.maxHp += 60; st.hero.hp = st.hero.maxHp; st.hero.atk += 4; }
      window.VfxRenderer.triggerLotusPurification();
      window.AppUI.log(`🌸 <strong>Purified ${defeated.name}!</strong> +${goldGain} Gold & +${xpGain} XP.`, "event");
      window.AppUI.refreshVitals();
      window.SaveManager.saveToLocal();
      return;
    }

    window.VfxRenderer.triggerEnemyProjectile();
    const edmg = Math.max(4, st.enemy.atk - Math.min(st.hero.shield, st.enemy.atk));
    st.hero.shield = Math.max(0, st.hero.shield - st.enemy.atk);
    st.hero.hp = Math.max(1, st.hero.hp - edmg);
    window.AppUI.refreshVitals();
    setTimeout(() => this.runTurn(), Math.round(620 / st.speed));
  }
};
