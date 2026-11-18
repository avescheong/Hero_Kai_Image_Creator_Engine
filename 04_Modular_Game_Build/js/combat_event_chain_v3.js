window.GameState = {
  day: 1, maxDays: 60, gold: 120, gems: 25, stamina: 20, maxStamina: 20,
  level: 1, xp: 0, xpNext: 100, speed: 1, autoPlay: false,
  inCombat: false, awaitingChoice: false, activeSchool: "starlight",
  hero: { hp: 500, maxHp: 500, atk: 42, shield: 0, rage: 0 },
  skills: [], enemy: null
};

window.StoryEngine = {
  advanceDay() {
    const st = window.GameState;
    if (st.inCombat || st.awaitingChoice) return;
    if (st.day >= st.maxDays) {
      window.VfxRenderer.triggerProp("VFX_MISC_50", "VICTORY!");
      window.AppUI.log("👑 <strong>Day 60 Complete!</strong> You conquered the Citadel of the Core!", "event");
      return;
    }
    st.day++;
    window.Sprite16FPSEngine.spawnOneShot("VFX_MISC_47", 200, 250, 0.55);
    const gate = window.CAPYBARA_CONFIG.PYTHON_GATES.find(g => g.day === st.day);
    if (gate) {
      st.awaitingChoice = true;
      window.VfxRenderer.triggerProp("VFX_MISC_41", "PYTHON GATE");
      window.AppUI.log(`🐍 <strong>Python Gate (Day ${st.day}):</strong> ${gate.prompt}<br><code>${gate.code}</code>`, "python");
      window.AppUI.setChoices(gate.options.map(opt => ({
        label: opt,
        fn: () => {
          if (opt === gate.answer) {
            st.gold += 100; st.hero.atk = Math.round(st.hero.atk * 1.25);
            window.VfxRenderer.triggerProp("VFX_MISC_50", "GATE UNLOCKED!");
            window.AppUI.log(`✅ <strong>Correct!</strong> Unlocked reward: ${gate.reward}.`, "event");
          } else {
            window.VfxRenderer.triggerHitCallout("dodge");
            window.AppUI.log("❌ Not quite! Kai slips through safely (+10 Gold).", "event");
          }
          st.awaitingChoice = false; window.AppUI.setChoices([]); window.AppUI.refreshVitals();
        }
      })));
      window.AppUI.refreshVitals();
      return;
    }

    const roll = Math.random();
    if (st.day % 15 === 0) {
      this.startCombat(true);
    } else if (roll < 0.42) {
      this.startCombat(false);
    } else if (roll < 0.62) {
      this.triggerWheel();
    } else if (roll < 0.80) {
      this.triggerCampfire();
    } else {
      this.triggerChestOrEgg();
    }
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
  },

  triggerWheel() {
    const st = window.GameState;
    st.awaitingChoice = true;
    window.VfxRenderer.triggerProp("VFX_MISC_06", "WHEEL OF FORTUNE");
    window.AppUI.log("🎡 <strong>Roadside Wheel of Fortune!</strong> Spin the 16-FPS wheel for a blessing:", "event");
    window.AppUI.setChoices([{
      label: "🎡 Spin Wheel!",
      fn: () => {
        const prize = Math.random() < 0.5 ? "+60 Gold & +20 Rage" : "+120 Golden Shield";
        if (prize.includes("Gold")) { st.gold += 60; st.hero.rage = Math.min(100, st.hero.rage + 20); }
        else { st.hero.shield += 120; }
        window.VfxRenderer.triggerHitCallout("combo");
        window.AppUI.log(`✨ Wheel landed on <strong>${prize}</strong>!`, "event");
        st.awaitingChoice = false; window.AppUI.setChoices([]); window.AppUI.refreshVitals();
      }
    }]);
  },

  triggerCampfire() {
    const st = window.GameState;
    st.awaitingChoice = true;
    window.VfxRenderer.triggerProp("VFX_MISC_08", "CAMPFIRE");
    window.AppUI.log("🍲 <strong>Plant-Based Campfire Rest:</strong> Choose a 100% vegetarian provision:", "event");
    window.AppUI.setChoices(window.CAPYBARA_CONFIG.VEG_PROVISIONS.slice(0, 2).map(food => ({
      label: `🥬 ${food.name}`,
      fn: () => {
        st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + Math.round(st.hero.maxHp * food.hpPct));
        st.hero.rage = Math.min(100, st.hero.rage + food.rage);
        window.VfxRenderer.triggerProp("VFX_MISC_48", "+HP!");
        window.AppUI.log(`🌿 Ate <strong>${food.name}</strong> — ${food.desc}`, "event");
        st.awaitingChoice = false; window.AppUI.setChoices([]); window.AppUI.refreshVitals();
      }
    })));
  },

  triggerChestOrEgg() {
    const st = window.GameState;
    const isEgg = Math.random() < 0.45;
    window.VfxRenderer.triggerProp(isEgg ? "VFX_MISC_12" : "VFX_MISC_11", isEgg ? "PET EGG!" : "CHEST!");
    st.gold += 45; st.xp += 35;
    if (st.xp >= st.xpNext) { st.level++; st.xp -= st.xpNext; st.hero.maxHp += 50; st.hero.hp = st.hero.maxHp; }
    window.AppUI.log(isEgg ? "🥚 <strong>Mystic Pet Egg Hatched!</strong> +45 Gold & +35 XP." : "🧰 <strong>Golden Treasure Chest!</strong> +45 Gold & +35 XP.", "event");
  },

  startCombat(isBoss) {
    const st = window.GameState;
    st.inCombat = true;
    const scale = 1 + st.day * 0.08;
    st.enemy = {
      name: isBoss ? "Chapter Guardian Boss" : "Glitch Thorn Slime",
      hp: Math.round((isBoss ? 360 : 140) * scale),
      atk: Math.round((isBoss ? 32 : 16) * scale),
      isBoss
    };
    if (isBoss) window.VfxRenderer.triggerProp("VFX_MISC_42", "BOSS WARNING!");
    window.AppUI.log(`⚔️ <strong>Day ${st.day} Encounter:</strong> ${st.enemy.name} appeared!`, "combat");
    this.runTurn();
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
      st.inCombat = false; st.enemy = null;
      st.gold += 35; st.xp += 45;
      if (st.xp >= st.xpNext) { st.level++; st.xp -= st.xpNext; st.hero.maxHp += 50; st.hero.hp = st.hero.maxHp; }
      window.AppUI.log("🏆 <strong>Victory!</strong> +35 Gold & +45 XP.", "event");
      window.AppUI.refreshVitals();
      return;
    }

    const edmg = Math.max(4, st.enemy.atk - Math.min(st.hero.shield, st.enemy.atk));
    st.hero.shield = Math.max(0, st.hero.shield - st.enemy.atk);
    st.hero.hp = Math.max(1, st.hero.hp - edmg);
    window.AppUI.refreshVitals();
    setTimeout(() => this.runTurn(), Math.round(650 / st.speed));
  }
};
