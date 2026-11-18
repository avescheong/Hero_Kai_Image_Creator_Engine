window.CombatEngine = {
  timer: null,

  startBattle(enemyTemplate) {
    const st = window.GameState;
    st.inCombat = true;
    st.enemy = JSON.parse(JSON.stringify(enemyTemplate));
    window.StageEngine.clearRoadsideProp();
    window.AppUI.log(`⚔️ Encountered <strong>${st.enemy.name}</strong> (HP: ${st.enemy.maxHp})!`, "combat");
    this.scheduleNextTurn();
  },

  scheduleNextTurn() {
    if (!window.GameState.inCombat) return;
    const delay = Math.round(1150 / (window.GameState.speed || 1));
    this.timer = setTimeout(() => this.executeTurn(), delay);
  },

  executeTurn() {
    const st = window.GameState;
    if (!st.inCombat || !st.enemy) return;
    const heroX = 280, heroY = 300, enemyX = 675, enemyY = 290;

    // Step 1: DoT ticks on Enemy (Poison, Burn)
    if (st.enemy.status.poison > 0) {
      const pDmg = Math.round(st.hero.atk * 0.45);
      st.enemy.hp -= pDmg;
      st.enemy.status.poison--;
      window.VFXRenderer.spawnPopup(`-${pDmg} POISON`, enemyX, enemyY - 90, "#4ade80");
    }
    if (st.enemy.status.burn > 0) {
      const bDmg = Math.round(st.hero.atk * 0.40);
      st.enemy.hp -= bDmg;
      st.enemy.status.burn--;
      window.VFXRenderer.spawnPopup(`-${bDmg} BURN`, enemyX, enemyY - 70, "#fb923c");
    }

    // Step 2: Hero Primary Action (Rage 100% Ultimate vs Basic Attack)
    if (st.hero.rage >= 100) {
      st.hero.rage = 0;
      const sch = window.CAPYBARA_CONFIG.MAGIC_SCHOOLS.find(s => s.id === st.hero.activeSchool) || window.CAPYBARA_CONFIG.MAGIC_SCHOOLS[6];
      window.StageEngine.triggerHeroAnim("cast", 0.65, sch.id);
      const ultDmg = Math.round(st.hero.atk * 2.4);
      st.enemy.hp -= ultDmg;
      window.VFXRenderer.spawnBurst(sch.vfxSheet, [sch.vfxCell, [sch.vfxCell[0], Math.min(3, sch.vfxCell[1] + 1)]], enemyX, enemyY, 190, 0.6);
      window.VFXRenderer.spawnPopup(`-${ultDmg} ${sch.name.split(" ")[0].toUpperCase()}!`, enemyX, enemyY - 110, sch.color);
      if (sch.status === "poison") st.enemy.status.poison = 3;
      if (sch.status === "burn") st.enemy.status.burn = 3;
      if (sch.status === "freeze") st.enemy.status.freeze = 1;
      if (sch.status === "stun") st.enemy.status.stun = 1;
      if (sch.status === "confuse") st.enemy.status.confuse = 2;
      if (sch.status === "silence") st.enemy.status.silence = 2;
      if (sch.status === "heal_cleanse") {
        const heal = Math.round(st.hero.maxHp * 0.15);
        st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + heal);
        window.VFXRenderer.spawnPopup(`+${heal} LOTUS`, heroX, heroY - 90, "#f9a8d4");
      }
      window.AppUI.log(`✨ <strong>${sch.name}</strong> unleashed for <strong>${ultDmg}</strong> DMG!`, "magic");
    } else {
      window.StageEngine.triggerHeroAnim("attack", 0.4);
      const isCrit = Math.random() < st.hero.critRate;
      const dmg = Math.round(st.hero.atk * (isCrit ? 1.75 : 1.0));
      st.enemy.hp -= dmg;
      st.hero.rage = Math.min(100, st.hero.rage + 25);
      window.VFXRenderer.spawnPopup(isCrit ? `-${dmg} CRIT!` : `-${dmg}`, enemyX, enemyY - 80, isCrit ? "#facc15" : "#fff");

      // Weapon Procs: Sword Chi & Flying Daggers
      if (st.skills.includes("sword_chi")) {
        window.VFXRenderer.spawnBurst("VFX_SWORD_CHI", [[0,0],[0,1],[0,2],[0,3]], (heroX + enemyX)/2, enemyY + 10, 180, 0.42);
      }
      if (st.skills.includes("flying_daggers")) {
        const dRow = st.skills.includes("poison_dagger") ? 1 : 0;
        window.VFXRenderer.spawnProjectile("dagger", heroX, heroY - 30, enemyX, enemyY - 10, "VFX_DAGGERS", dRow, 0, 0.4);
        const dDmg = Math.round(st.hero.atk * 0.5);
        st.enemy.hp -= dDmg;
        if (st.skills.includes("poison_dagger")) st.enemy.status.poison = 2;
      }

      // Combo Loop & Every-3-Combo Skill Shield
      if (Math.random() < st.hero.comboRate) {
        st.hero.comboCount++;
        const cDmg = Math.round(st.hero.atk * 0.85);
        st.enemy.hp -= cDmg;
        window.VFXRenderer.spawnBurst("VFX_STRIKES", [[3,0]], heroX + 40, heroY - 120, 120, 0.45);
        window.VFXRenderer.spawnPopup(`COMBO! -${cDmg}`, enemyX, enemyY - 120, "#38bdf8");
        if (st.skills.includes("skill_shield") && st.hero.comboCount % 3 === 0) {
          const sh = Math.round(st.hero.maxHp * 0.18);
          st.hero.shield += sh;
          window.VFXRenderer.spawnBurst("VFX_DEFENSE", [[1,0],[1,1],[1,2]], heroX, heroY - 20, 165, 0.55);
          window.VFXRenderer.spawnPopup(`+${sh} SKILL SHIELD`, heroX, heroY - 110, "#38bdf8");
        }
      }
    }

    // Step 3: Pet Follow-Ups (String & Baby Mantis)
    const petDmg = Math.round(st.hero.atk * 0.35);
    st.enemy.hp -= petDmg;
    window.VFXRenderer.spawnPopup(`🐾 -${petDmg}`, enemyX + 35, enemyY - 40, "#fdba74");

    // Check Victory
    if (st.enemy.hp <= 0) {
      this.handleVictory();
      return;
    }

    // Step 4: Enemy Turn (CC check: Freeze / Stun / Confuse)
    if (st.enemy.status.freeze > 0) {
      st.enemy.status.freeze--;
      window.VFXRenderer.spawnPopup("FROZEN!", enemyX, enemyY - 100, "#67e8f9");
    } else if (st.enemy.status.stun > 0) {
      st.enemy.status.stun--;
      window.VFXRenderer.spawnPopup("STUNNED!", enemyX, enemyY - 100, "#fde047");
    } else if (st.enemy.status.confuse > 0 && Math.random() < 0.5) {
      st.enemy.status.confuse--;
      const selfDmg = Math.round(st.enemy.atk * 0.7);
      st.enemy.hp -= selfDmg;
      window.VFXRenderer.spawnPopup(`CONFUSED! -${selfDmg}`, enemyX, enemyY - 100, "#e879f9");
    } else {
      // Enemy Attacks Hero -> Check Dodge Mirage -> Shield Absorb -> Counter
      if (Math.random() < st.hero.dodgeRate) {
        window.VFXRenderer.spawnBurst("VFX_DEFENSE", [[3,0],[3,2],[3,3]], heroX, heroY - 20, 145, 0.5);
        window.VFXRenderer.spawnPopup("DODGE!", heroX, heroY - 100, "#67e8f9");
      } else {
        let eDmg = Math.max(4, st.enemy.atk - Math.round(st.hero.def * 0.5));
        if (st.hero.shield > 0) {
          const absorbed = Math.min(st.hero.shield, eDmg);
          st.hero.shield -= absorbed;
          eDmg -= absorbed;
          window.VFXRenderer.spawnBurst("VFX_DEFENSE", [[0,2]], heroX, heroY - 20, 165, 0.4);
          window.VFXRenderer.spawnPopup(`BLOCKED ${absorbed}`, heroX, heroY - 90, "#facc15");
        }
        if (eDmg > 0) {
          st.hero.hp = Math.max(1, st.hero.hp - eDmg);
          window.StageEngine.triggerHeroAnim("hit", 0.35);
          window.VFXRenderer.spawnPopup(`-${eDmg}`, heroX, heroY - 70, "#f87171");
        }
        if (Math.random() < st.hero.counterRate) {
          const ctrDmg = Math.round(st.hero.atk * 0.9);
          st.enemy.hp -= ctrDmg;
          window.VFXRenderer.spawnBurst("VFX_DEFENSE", [[2,1],[2,2],[2,3]], heroX + 60, heroY - 20, 155, 0.45);
          window.VFXRenderer.spawnPopup(`COUNTER! -${ctrDmg}`, enemyX, enemyY - 100, "#facc15");
        }
      }
    }

    if (st.enemy.hp <= 0) {
      this.handleVictory();
      return;
    }

    window.AppUI.refreshVitals();
    this.scheduleNextTurn();
  },

  handleVictory() {
    const st = window.GameState;
    const xpGain = st.enemy.xp || 40;
    const goldGain = st.enemy.gold || 35;
    st.gold += goldGain;
    st.xp += xpGain;
    st.inCombat = false;
    window.AppUI.log(`🏆 Defeated <strong>${st.enemy.name}</strong>! (+${xpGain} XP, +${goldGain} Gold)`, "event");
    st.enemy = null;

    if (st.xp >= st.xpNext) {
      st.xp -= st.xpNext;
      st.level++;
      st.xpNext = Math.round(st.xpNext * 1.25);
      st.hero.maxHp += 50;
      st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + 80);
      st.hero.atk += 6;
      window.RogueliteDraft.openDraftModal();
    }
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
  }
};
