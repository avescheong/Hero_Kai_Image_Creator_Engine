window.StoryEngine = {
  advanceDay() {
    const st = window.GameState;
    if (st.inCombat || st.awaitingChoice) return;
    if (st.day >= st.maxDays) {
      window.AppUI.log("🎉 <strong>Chapter 1 Complete!</strong> You purified the Silent Village!", "event");
      return;
    }
    st.day++;
    st.hero.shield = 60; // Turn-1 Guardian Ring shield refresh
    window.StageEngine.clearRoadsideProp();
    window.AppUI.refreshVitals();

    // Check Python Code Gate Days (10, 30, 50)
    const gate = window.CAPYBARA_CONFIG.PYTHON_GATES.find(g => g.day === st.day);
    if (gate) {
      window.PythonTerminal.openGate(gate);
      return;
    }

    // Day 60 Chapter Boss
    if (st.day === 60) {
      window.CombatEngine.startBattle({
        name: "Glitch Thorn Brute (Day 60 Boss)",
        sheetKey: "BOSS_01", row: 0, size: 195,
        hp: 750, maxHp: 750, atk: 34, xp: 200, gold: 300,
        status: {}
      });
      return;
    }

    // Day 20 / 40 Mid-Chapter Elite
    if (st.day === 20 || st.day === 40) {
      window.CombatEngine.startBattle({
        name: "Hexapod Glitch Swarm",
        sheetKey: "BUG_KING", row: 0, size: 175,
        hp: 380, maxHp: 380, atk: 24, xp: 100, gold: 120,
        status: {}
      });
      return;
    }

    // Roll Random Day Event: 50% Combat, 30% Roadside Campfire/Shrine, 20% Treasure Chest
    const roll = Math.random();
    if (roll < 0.50) {
      const mRow = Math.floor(Math.random() * 4);
      window.CombatEngine.startBattle({
        name: ["Glitch Slime", "Syntax Bat", "Thorn Sprout", "Rust Beetle"][mRow],
        sheetKey: "MINIONS_ACT1", row: mRow, size: 140,
        hp: 130 + st.day * 5, maxHp: 130 + st.day * 5, atk: 14 + Math.floor(st.day * 0.35),
        xp: 45, gold: 30, status: {}
      });
    } else if (roll < 0.80) {
      st.awaitingChoice = true;
      window.StageEngine.setRoadsideProp(0, 0); // Campfire
      window.AppUI.log(`🔥 <strong>Day ${st.day} Campfire & Tea Stall:</strong> Grandma Looma offers 100% vegetarian provisions.`, "event");
      window.AppUI.setChoices([
        { label: "🥬 Eat Veggie Bao (+35% HP)", fn: () => this.resolveCampfire("bao") },
        { label: "🍊 Salt-Steamed Orange (+50 Rage)", fn: () => this.resolveCampfire("salt_orange") },
        { label: "🍵 Herbal Tea (+80 Shield & +30% HP)", fn: () => this.resolveCampfire("ginseng_tea") }
      ]);
    } else {
      window.StageEngine.setRoadsideProp(2, 2); // Treasure Chest
      const bonus = 40 + Math.floor(Math.random() * 40);
      st.gold += bonus;
      window.AppUI.log(`🎁 <strong>Day ${st.day} Roadside Chest:</strong> String dug up <strong>+${bonus} Gold</strong>!`, "event");
      window.AppUI.refreshVitals();
      window.SaveManager.saveToLocal();
    }
  },

  resolveCampfire(foodId) {
    const st = window.GameState;
    const food = window.CAPYBARA_CONFIG.VEG_PROVISIONS.find(f => f.id === foodId);
    if (food) {
      const heal = Math.round(st.hero.maxHp * food.hpPct);
      st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + heal);
      st.hero.rage = Math.min(100, st.hero.rage + food.rage);
      if (food.shield) st.hero.shield += food.shield;
      window.VFXRenderer.spawnPopup(`+${heal} HP`, 270, 260, "#4ade80");
      window.AppUI.log(`🥬 Enjoyed <strong>${food.name}</strong>! Restored +${heal} HP & +${food.rage} Rage.`, "event");
    }
    st.awaitingChoice = false;
    window.AppUI.setChoices([]);
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
  }
};
