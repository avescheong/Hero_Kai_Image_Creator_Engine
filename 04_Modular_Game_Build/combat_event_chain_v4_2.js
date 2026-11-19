// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// combat_event_chain_v4_2.js (v5.1: Sequenced 4-Beat Sakuga Combat Engine, Random Prop Spawner & Ch. 1 Tutorial Hooks)
window.GameState = {
  chapter: 1, day: 1, maxDays: 60, gold: 120, gems: 25, stamina: 20, maxStamina: 20,
  level: 1, xp: 0, xpNext: 100, skillSparks: 4, pacingMode: "sakuga", autoMarch: false,
  autoBattle: false, awaitingCommand: false, heroDefending: false, mendCd: 0,
  battleItems: { potion: 2, bao: 2, orange: 1 },
  inCombat: false, awaitingChoice: false, parryWindowOpen: false, parriedThisTurn: false,
  combatPhase: "idle", parryWindowEndsAt: 0, parryWindowDurationMs: 1000,
  activeSchool: "starlight", activeWeapon: "ironsword", activeArmor: "moss_cloak",
  activePet: "string", activeMount: "none", activeActionSheet: null,
  heroActionState: "KAI_ACT_01", heroActionUntil: 0,
  unlockedNodes: ["st_1"], draftedSkills: [], petLevel: 1, overclockDays: 0,
  ownedWeapons: ["ironsword"], ownedArmors: ["hoodie", "moss_cloak"], maxUnlockedChapter: 1, sandboxMode: false,
  solvedChallengeIds: [], masteredConcepts: [], slotSpinsThisChapter: 0, meditatedThisChapter: false,
  collectedScrolls: [1], activeStreetPickup: null, propCollected: false, petBondedToday: false,
  propPos: { rx: 0.58, ry: 0.68 },
  tutorialStep: 0, tutorialDone: false, tutorialStageClicked: false,
  heroStatus: "none", cureTaps: 0,
  combatTurn: 0, stringCd: 0, mantisCd: 0,
  spellChain: { trigger: "always", modifier: "amp", payload: "starlight" },
  bonusAtk: 0, bonusMaxHp: 0, bonusShield: 0, bonusCrit: 0, bonusSkillDmg: 0, bonusCounter: 0,
  hero: { hp: 850, maxHp: 850, atk: 105, shield: 90, rage: 0, crit: 27, combo: 20, dr: 25, skillDmg: 125, counter: 15, dodge: 5 },
  enemy: null, roadsideNpc: null, defeatedIds: []
};

window.StoryEngine = {
  autoTimer: null,
  _combatSeqId: 0,

  getCurrentChapter() {
    const cfg = window.CAPYBARA_CONFIG;
    return cfg.CHAPTERS[(window.GameState.chapter - 1) % cfg.CHAPTERS.length];
  },

  getTimingScale() {
    const mode = (window.GameState && window.GameState.pacingMode) || "sakuga";
    if (mode === "slow") return 1.35;
    if (mode === "turbo") return 0.58;
    return 1.0;
  },

  waitBeat(ms, seqId) {
    return new Promise((resolve) => {
      let elapsed = 0;
      const target = Math.max(40, Math.round(ms));
      const tick = () => {
        const st = window.GameState;
        if (seqId !== this._combatSeqId || !st || !st.inCombat || !st.enemy) {
          resolve(false);
          return;
        }
        const modal = document.getElementById("modal-backdrop");
        const modalOpen = modal && !modal.classList.contains("hidden");
        if (!modalOpen) elapsed += 50;
        if (elapsed >= target) {
          resolve(true);
          return;
        }
        setTimeout(tick, 50);
      };
      setTimeout(tick, 50);
    });
  },

  randomizeStageProps(spawnPickup = true) {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    if (!st || !cfg) return;
    st.propPos = {
      rx: 0.44 + Math.random() * 0.40,
      ry: 0.56 + Math.random() * 0.22
    };
    const pickups = cfg.STREET_PICKUPS_V4_2 || [];
    const shouldSpawn = spawnPickup && pickups.length > 0 && ((st.chapter === 1 && st.day === 1) || Math.random() < 0.70);
    if (!shouldSpawn) {
      st.activeStreetPickup = null;
      return;
    }
    const p = pickups[Math.floor(Math.random() * pickups.length)];
    let rx = 0.50;
    let ry = 0.64;
    for (let attempt = 0; attempt < 8; attempt++) {
      if (p.key === "VFX_MISC_48") {
        rx = 0.38 + Math.random() * 0.50;
        ry = 0.26 + Math.random() * 0.40;
      } else {
        rx = 0.40 + Math.random() * 0.46;
        ry = 0.54 + Math.random() * 0.24;
      }
      if (Math.hypot(rx - st.propPos.rx, ry - st.propPos.ry) >= 0.16) break;
    }
    st.activeStreetPickup = {
      key: p.key, label: p.label, gold: p.gold, hp: p.hp, rx, ry
    };
  },

  toggleAutoMarch() {
    const st = window.GameState;
    st.autoMarch = !st.autoMarch;
    st.autoBattle = st.autoMarch;
    const btn = document.getElementById("btn-auto");
    if (btn) {
      btn.textContent = st.autoMarch ? "⏸️ Auto: ON" : "▶️ Auto: OFF";
      btn.classList.toggle("active-auto", st.autoMarch);
    }
    if (st.inCombat && window.AppUI) {
      window.AppUI.log(st.autoBattle ? "🤖 <strong>Auto-Battle ON:</strong> Hero Kai executes smart tactical AI automatically." : "🎮 <strong>Manual Command Mode ON:</strong> Choose your Attack, Magic, Heal, Defend &amp; Taunt each turn!", "event");
    }
    if (st.autoBattle && st.inCombat && st.awaitingCommand && window.FFBattleMenu) {
      window.FFBattleMenu.submitCommand(window.FFBattleMenu.chooseAutoAction(st));
    } else if (st.inCombat && window.FFBattleMenu) {
      window.FFBattleMenu._lastRenderKey = "";
      window.FFBattleMenu.renderDeck(true);
    }
    if (st.autoMarch) {
      this.scheduleAutoMarch();
    } else if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
    if (window.SaveManager) window.SaveManager.saveToLocal();
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

    let tHp = 0, tAtk = 0, tShield = 0, tCrit = 0, tCombo = 0, tSkill = 0, tDr = 0, tCounter = 0;
    (cfg.SKILL_TREES_DB || []).forEach(br => {
      br.nodes.forEach(nd => {
        if ((st.unlockedNodes || []).includes(nd.id)) {
          tHp += nd.hp || 0; tAtk += nd.atk || 0; tShield += nd.shield || 0;
          tCrit += nd.crit || 0; tCombo += nd.combo || 0; tSkill += nd.skillDmg || 0; tDr += nd.dr || 0; tCounter += nd.counter || 0;
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
    st.hero.maxHp = 500 + (st.level - 1) * 60 + a.hp + (m.hp || 0) + tHp + (st.bonusMaxHp || 0);
    st.hero.hp = preserveHpRatio ? Math.max(1, Math.min(st.hero.maxHp, Math.round(st.hero.maxHp * ratio))) : st.hero.maxHp;
    const baseAtkVal = 45 + (st.level - 1) * 4 + w.atk + Math.round((p.atk || 0) * petBonusMult) + tAtk + (st.bonusAtk || 0);
    st.hero.atk = (st.stamina <= 0) ? Math.round(baseAtkVal * 0.80) : baseAtkVal;
    st.hero.crit = Math.min(95, 15 + w.crit + (p.crit || 0) + (m.crit || 0) + tCrit + ocCrit + (st.bonusCrit || 0));
    st.hero.combo = Math.min(90, 10 + w.combo + tCombo);
    st.hero.skillDmg = 100 + w.skillDmg + tSkill + ocSkill + (st.bonusSkillDmg || 0);
    st.hero.dr = Math.min(75, a.dr + (m.dr || 0) + tDr);
    st.hero.counter = Math.min(60, (w.counter || 10) + tCounter + (st.bonusCounter || 0));
    st.hero.dodge = (st.activeMount === "bouncy_mushroom" || st.activeMount === "runic_boar" || st.activeMount === "mushroom_boar") ? 15 : 5;
    st.hero.baseShield = a.shield + Math.round((p.shield || 0) * petBonusMult) + (m.shield || 0) + tShield + (st.bonusShield || 0);
    st.hero.shield = Math.max(st.hero.shield || 0, st.hero.baseShield);
  },

  advanceDay() {
    const st = window.GameState;
    if (st.hero.hp <= 0) {
      if (window.DrawerUI && window.DrawerUI.openDefeatModal) window.DrawerUI.openDefeatModal("Exhaustion", 0);
      return;
    }
    if (st.inCombat || st.awaitingChoice) return;
    st.roadsideNpc = null;
    st.activeActionSheet = null;
    st._pendingPythonGate = null;
    st.combatPhase = "idle";
    st.propCollected = false;
    st.petBondedToday = false;

    if ((st.overclockDays || 0) > 0) {
      st.overclockDays--;
      if (st.overclockDays === 0) this.recalcHeroStats(true);
    }

    if (st.day >= st.maxDays) {
      if (st.chapter < 12) {
        st.chapter++;
        st.maxUnlockedChapter = Math.max(st.maxUnlockedChapter || 1, st.chapter);
        st.day = 1;
        st.slotSpinsThisChapter = 0;
        st.meditatedThisChapter = false;
        st.skillSparks += 3;
        st.gems = (st.gems || 0) + 10;
        st.stamina = Math.min(st.maxStamina || 20, (st.stamina || 0) + 10);
        Object.values(window.CAPYBARA_CONFIG.WEAPONS_DB || {}).forEach(w => {
          if ((w.unlockCh || 1) <= st.chapter && !st.ownedWeapons.includes(w.id)) st.ownedWeapons.push(w.id);
        });
        Object.values(window.CAPYBARA_CONFIG.ARMORS_DB || {}).forEach(a => {
          if ((a.unlockCh || 1) <= st.chapter && !st.ownedArmors.includes(a.id)) st.ownedArmors.push(a.id);
        });
        if (!st.collectedScrolls.includes(st.chapter)) st.collectedScrolls.push(st.chapter);
        this.randomizeStageProps(true);
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
    const stamCost = st.pacingMode === "turbo" ? 2 : 1;
    const prevStam = st.stamina ?? 20;
    st.stamina = Math.max(0, prevStam - stamCost);
    if (prevStam > 0 && st.stamina === 0) {
      this.recalcHeroStats(true);
      window.AppUI.log("😫 <strong>Fatigued (0 Stamina)!</strong> -20% ATK until you eat a plant-based meal at Campfire!", "combat");
    }
    const cv = document.getElementById("game-canvas");
    const cw = cv ? cv.width : 960;
    const ch = cv ? cv.height : 300;
    window.Sprite16FPSEngine.spawnOneShot("VFX_MISC_47", cw * 0.25, ch * 0.84, 0.42, "", 2, null, { maxFrames: 10 });

    this.randomizeStageProps(true);

    const chObj = this.getCurrentChapter();
    const isTut = st.chapter === 1 && !st.tutorialDone && !st.sandboxMode;
    const gate = window.CAPYBARA_CONFIG.PYTHON_GATES.find(g => g.day === st.day);

    if (isTut && st.day === 2) {
      this.startCombat(chObj.minion, false, "Tutorial Skirmish");
    } else if (isTut && st.day === 3) {
      this.triggerSpecialNpc("ENM_BOSS_43");
    } else if (isTut && st.day === 4) {
      const ch1Gate = window.CAPYBARA_CONFIG.PYTHON_GATES.find(g => g.ch === 1) || window.CAPYBARA_CONFIG.PYTHON_GATES[0];
      this.triggerPythonGate(ch1Gate);
    } else if (isTut && st.day === 5 && window.CrossroadsEngine) {
      window.CrossroadsEngine.triggerCrossroads(chObj);
    } else if (isTut && st.day === 6) {
      this.triggerCampfire();
    } else if (isTut && st.day === 8) {
      this.startCombat(chObj.d20, true, "Tutorial Mini-Boss");
    } else if (gate) {
      this.triggerPythonGate(gate);
    } else if (st.day === 15) {
      this.triggerSpecialNpc(chObj.npc);
    } else if (st.day === 20) {
      this.startCombat(chObj.d20, true, "Day-20 Mini-Boss");
    } else if (st.day === 40) {
      this.startCombat(chObj.d40, true, "Day-40 Elite Gatekeeper");
    } else if (st.day === 60) {
      this.triggerChapterBossGate(chObj);
    } else if (st.day % 5 === 0 && window.CrossroadsEngine) {
      window.CrossroadsEngine.triggerCrossroads(chObj);
    } else {
      const roll = Math.random();
      if (roll < 0.36) this.startCombat(chObj.minion, false, "Field Minion");
      else if (roll < 0.50) this.triggerChestMimicOrSanctuary();
      else if (roll < 0.64) this.triggerSpecialNpc(chObj.npc);
      else if (roll < 0.78) this.triggerWheel();
      else if (roll < 0.90) this.triggerCampfire();
      else this.triggerTrapOrDummy();
    }

    if (window.TutorialDirector) window.TutorialDirector.notify("day_advanced", { day: st.day });
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
    st._pendingPythonGate = gate;
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
          st._pendingPythonGate = null;
          if (opt === gate.answer) {
            st.gold += 100; st.skillSparks += 2; st.hero.rage = Math.min(100, st.hero.rage + 30);
            st.overclockDays = Math.max(st.overclockDays || 0, 5);
            if (gate.ch === 1) st.bonusAtk = (st.bonusAtk || 0) + 12;
            else if (gate.ch === 2) st.bonusMaxHp = (st.bonusMaxHp || 0) + 120;
            else if (gate.ch === 3) { st.bonusCrit = (st.bonusCrit || 0) + 8; st.gold += 100; }
            else if (gate.ch === 6) { st.bonusShield = (st.bonusShield || 0) + 150; st.gems = (st.gems || 0) + 10; }
            else if (gate.ch === 10) { st.bonusMaxHp = (st.bonusMaxHp || 0) + 200; st.hero.rage = Math.min(100, st.hero.rage + 50); }
            else if (gate.ch === 11) { st.bonusSkillDmg = (st.bonusSkillDmg || 0) + 30; st.gold += 50; }
            this.recalcHeroStats(true);
            window.VfxRenderer.triggerCodeTrace(gate.lessonRing || "EXP_LINK_43");
            window.AppUI.log(`✅ <strong>Correct!</strong> ${gate.reward} (+2 Skill Sparks &amp; 5-Day Python Overclock!)`, "event");
            if (window.TutorialDirector) window.TutorialDirector.notify("forge_compiled");
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
        if (npc.id === "ENM_BOSS_43") { st.bonusSkillDmg = (st.bonusSkillDmg || 0) + 15; if (!st.collectedScrolls.includes(st.chapter)) st.collectedScrolls.push(st.chapter); }
        else if (npc.id === "ENM_BOSS_44") { st.hero.shield += 120; st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + Math.round(st.hero.maxHp * 0.30)); }
        else if (npc.id === "ENM_BOSS_45") { st.bonusAtk = (st.bonusAtk || 0) + 18; }
        else if (npc.id === "ENM_BOSS_46") { st.bonusAtk = (st.bonusAtk || 0) + 25; st.bonusShield = (st.bonusShield || 0) + 100; }
        else if (npc.id === "ENM_BOSS_47") { st.gold += 60; st.xp += 40; }
        else if (npc.id === "ENM_BOSS_48") { st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + Math.round(st.hero.maxHp * 0.45)); }
        else if (npc.id === "ENM_BOSS_49") { st.heroStatus = "none"; st.hero.rage = Math.min(100, st.hero.rage + 30); }
        else if (npc.id === "ENM_BOSS_50") { st.heroStatus = "none"; st.hero.shield += 50; }
        else if (npc.id === "ENM_BOSS_51") { st.gold += 50; st.bonusCrit = (st.bonusCrit || 0) + 10; }
        else if (npc.id === "ENM_BOSS_52") { st.hero.rage = Math.min(100, st.hero.rage + 35); st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + Math.round(st.hero.maxHp * 0.15)); }
        this.recalcHeroStats(true);
        window.VfxRenderer.triggerProp(propKey, "BLESSED!");
        window.AppUI.log(`🌟 Received <strong>${npc.name}</strong>'s Blessing: <strong>${npc.buff}</strong>!`, "event");
        st.awaitingChoice = false; st.roadsideNpc = null; window.AppUI.setChoices([]);
        if (window.TutorialDirector) window.TutorialDirector.notify("npc_blessed", { npcId: npc.id });
        window.AppUI.refreshVitals();
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
    window.AppUI.setChoices(window.CAPYBARA_CONFIG.VEG_PROVISIONS.map(food => ({
      label: `🥬 ${food.name}`,
      fn: () => {
        const healAmt = Math.round(st.hero.maxHp * food.hpPct);
        st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + healAmt);
        st.hero.rage = Math.min(100, st.hero.rage + food.rage);
        const stamGain = food.id === "nasi_lemak" ? 10 : 6;
        st.stamina = Math.min(st.maxStamina || 20, (st.stamina || 0) + stamGain);
        this.recalcHeroStats(true);
        if (food.shield) st.hero.shield += food.shield;
        if (food.cleanse) st.heroStatus = "none";
        window.Sprite16FPSEngine.setHeroAction("KAI_ACT_11", 1600);
        window.Sprite16FPSEngine.spawnFloatingText(`+${healAmt} HP · +${stamGain} STM`, 270, 200, "#4ade80", 1.05);
        window.VfxRenderer.triggerProp("VFX_MISC_38", "+HP!");
        window.AppUI.log(`🌿 Ate <strong>${food.name}</strong> (+${stamGain} Stamina) — ${food.desc}`, "event");
        st.awaitingChoice = false; window.AppUI.setChoices([]); window.AppUI.refreshVitals();
      }
    })));
  },

  triggerParry() {
    const st = window.GameState;
    if (!st.inCombat || !st.parryWindowOpen || st.parriedThisTurn) return false;
    st.parriedThisTurn = true;
    st.parryWindowOpen = false;
    st.activeActionSheet = "KAI_CMB_06";
    st.hero.rage = Math.min(100, st.hero.rage + 25);
    if (window.AudioSFX) window.AudioSFX.play("parry");
    window.Sprite16FPSEngine.triggerActorImpulse("hero", 18);
    window.Sprite16FPSEngine.triggerCameraPunch({ zoom: 1.09, focusX: 0.45, shake: 9, hitStopMs: 150, durationMs: 480, vignette: 0.25 });
    const isTauntCounter = !!(st.enemy && st.enemy.tauntedTurns > 0);
    window.VfxRenderer.triggerHitCallout("true_py", isTauntCounter ? "TAUNT PARRY ×2.6!" : "PARRY COUNTER!");
    if (st.enemy) {
      const counterDmg = Math.round(st.hero.atk * (isTauntCounter ? 2.60 : 1.80));
      st.enemy.hp -= counterDmg;
      this.applyBossStaggerDamage(isTauntCounter ? 2 : 1);
      window.Sprite16FPSEngine.triggerActorImpulse("enemy", 16, 200);
      window.Sprite16FPSEngine.spawnFloatingText(`-${counterDmg} PARRY!`, 700, 175, "#34d399", 1.2);
      window.AppUI.log(`🛡️ <strong>${isTauntCounter ? "TAUNT PARRY ×2.6!" : "PERFECT COLON : PARRY!"}</strong> Blocked hit &amp; countered with <code>KAI_CMB_06</code> for <strong>${counterDmg}</strong> DMG!`, "magic");
      if (window.TutorialDirector) window.TutorialDirector.notify("parry_success");
      if (st.enemy.hp <= 0) {
        this.handleEnemyDefeat();
        return true;
      }
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

  triggerCompanionTagIn(petKind) {
    const st = window.GameState;
    if (!st.inCombat || !st.enemy) return false;
    if (petKind === "string") {
      if ((st.stringCd || 0) > 0) return false;
      st.stringCd = 3;
      const petMult = 1 + ((st.petLevel || 1) - 1) * 0.25;
      const dmg = Math.round(25 * petMult * 1.5 + st.hero.atk * 0.65);
      st.enemy.hp -= dmg;
      this.applyBossStaggerDamage(1);
      window.Sprite16FPSEngine.setHeroAction("KAI_ACT_14", 1100);
      if (window.AudioSFX) window.AudioSFX.play("tagin");
      window.VfxRenderer.triggerMangaCutIn("assist");
      window.Sprite16FPSEngine.spawnOneShot("EXP_LINK_39", 450, 220, 0.56, "SONIC BARK!", 7, null, { maxFrames: 12 });
      window.Sprite16FPSEngine.triggerActorImpulse("enemy", 14, 180);
      window.Sprite16FPSEngine.spawnFloatingText(`🐕 -${dmg} BARK!`, 700, 175, "#f59e0b", 1.2);
      window.AppUI.log(`🐾 <strong>String Tag-In [Sonic Bark]:</strong> Dealt <strong>${dmg}</strong> DMG &amp; shredded 1 Stagger Pip!`, "magic");
      if (st.enemy.hp <= 0) this.handleEnemyDefeat();
      window.AppUI.refreshVitals();
      return true;
    }
    if (petKind === "mantis") {
      if ((st.mantisCd || 0) > 0) return false;
      st.mantisCd = 3;
      const antiHeal = st.heroStatus === "poison" ? 0.5 : 1.0;
      const heal = Math.round(st.hero.maxHp * 0.12 * antiHeal);
      st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + heal);
      st.hero.shield += 40;
      st.heroStatus = "none";
      if (window.AudioSFX) window.AudioSFX.play("tagin");
      window.VfxRenderer.triggerMangaCutIn("assist");
      window.VfxRenderer.triggerLotusPurification();
      window.Sprite16FPSEngine.spawnFloatingText(`🌿 +${heal} HP CLEANSE!`, 270, 180, "#4ade80", 1.15);
      window.AppUI.log(`🌿 <strong>Baby Mantis Tag-In [Dawn Blossom]:</strong> +${heal} HP, +40 Shield &amp; Status Cleansed!`, "event");
      window.AppUI.refreshVitals();
      return true;
    }
    return false;
  },

  handleHeroDefeat(sourceName) {
    const st = window.GameState;
    this._combatSeqId++;
    st.inCombat = false;
    st.combatPhase = "defeat";
    st.parryWindowOpen = false;
    st.heroDefending = false;
    st.autoMarch = false;
    st.enemy = null;
    st.activeActionSheet = null;
    if (window.FFBattleMenu) window.FFBattleMenu.cancelPending(true);
    if (window.AudioSFX) window.AudioSFX.play("ko");
    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_07", 2500);
    const masteryGain = Math.max(1, Math.floor(st.day / 15));
    st.skillSparks = (st.skillSparks || 0) + masteryGain;
    window.AppUI.log(`💀 <strong>Hero Kai Fallen!</strong> Defeated by <strong>${sourceName}</strong> on Ch.${st.chapter} Day ${st.day}. Earned +${masteryGain} Starlight Mastery Sparks!`, "boss");
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    if (window.DrawerUI && window.DrawerUI.openDefeatModal) {
      window.DrawerUI.openDefeatModal(sourceName, masteryGain);
    }
  },

  handleEnemyDefeat() {
    const st = window.GameState;
    if (!st.enemy) return;
    const seqSnap = ++this._combatSeqId;
    const defeated = st.enemy;
    if (!st.defeatedIds.includes(defeated.sheetId)) st.defeatedIds.push(defeated.sheetId);
    st.inCombat = false; st.enemy = null; st.activeActionSheet = null; st.parryWindowOpen = false;
    st.heroDefending = false;
    st.combatPhase = "victory";
    if (window.FFBattleMenu) window.FFBattleMenu.cancelPending(true);
    const goldGain = defeated.isBoss ? 140 : 45;
    const xpGain = defeated.isBoss ? 100 : 50;
    const gemGain = defeated.isBoss ? 5 : 1;
    st.gold += goldGain; st.xp += xpGain; st.gems = (st.gems || 0) + gemGain;
    let leveledUp = false;
    while (st.xp >= st.xpNext) {
      st.level++; st.xp -= st.xpNext; st.skillSparks += 2;
      leveledUp = true;
      this.recalcHeroStats(false);
    }
    window.VfxRenderer.triggerLotusPurification();
    window.AppUI.log(`🌸 <strong>Purified ${defeated.name}!</strong> +${goldGain} Gold, +${gemGain} Star Gems &amp; +${xpGain} XP.`, "event");
    if (window.TutorialDirector) window.TutorialDirector.notify("combat_won", { isBoss: defeated.isBoss });
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();

    setTimeout(() => {
      if (this._combatSeqId !== seqSnap && st.inCombat) return;
      if (leveledUp) {
        if (window.AudioSFX) window.AudioSFX.play("levelup");
        window.Sprite16FPSEngine.setHeroAction("KAI_ACT_16", 1800);
        window.VfxRenderer.triggerProp("EXP_LINK_46", "LEVEL UP!");
      } else {
        window.Sprite16FPSEngine.setHeroAction("KAI_ACT_08", 1500);
      }
      window.Sprite16FPSEngine.spawnFloatingText(`+${goldGain}G  +${gemGain}💎`, 700, 210, "#fde68a", 1.15);
    }, 420);

    if ((leveledUp || defeated.isBoss) && window.DrawerUI && window.DrawerUI.openSkillDraftModal) {
      setTimeout(() => {
        if (this._combatSeqId === seqSnap && !st.inCombat) {
          window.DrawerUI.openSkillDraftModal(leveledUp ? `Level ${st.level} Level-Up Draft` : `${defeated.name} Victory Draft`);
        }
      }, 950);
    }
  },

  async startCombat(sheetId, isBoss, tierLabel, gateSolved = false) {
    const st = window.GameState;
    const seqId = ++this._combatSeqId;
    const tMul = this.getTimingScale();
    if (window.FFBattleMenu) window.FFBattleMenu.cancelPending(false);
    if (window.Sprite16FPSEngine) window.Sprite16FPSEngine.activeEffects = [];
    this.recalcHeroStats(true);
    const meta = window.CAPYBARA_CONFIG.ENEMY_CATALOG[sheetId] || { name: "Glitch Construct", bug: "SyntaxError" };
    st.inCombat = true;
    st.combatPhase = "intro";
    st.combatTurn = 0;
    st.awaitingCommand = false;
    st.heroDefending = false;
    st.mendCd = 0;
    st.battleItems = { potion: 2, bao: 2, orange: 1 };
    st.stringCd = 0;
    st.mantisCd = 0;
    st.roadsideNpc = null;
    st.activeStreetPickup = null;
    st.hero.shield = Math.max(st.hero.shield, st.hero.baseShield || 90);
    const effectiveCh = Math.max(st.chapter, meta.ch || 1);
    const effectiveDay = (tierLabel === "Bestiary Duel" && isBoss) ? Math.max(st.day, 32) : st.day;
    const scale = 1 + (effectiveCh - 1) * 0.45 + effectiveDay * 0.08;
    const baseHp = isBoss ? ((st.day === 60 || tierLabel === "Bestiary Duel") ? 1150 : (tierLabel === "Tutorial Mini-Boss" ? 1450 : 620)) : (tierLabel === "Tutorial Skirmish" ? 260 : 210);
    const baseAtk = isBoss ? (st.day === 60 ? 38 : 26) : 16;
    const maxHp = Math.round(baseHp * scale);
    st.enemy = {
      sheetId, name: meta.name, bug: meta.bug,
      hp: maxHp, maxHp: maxHp,
      atk: Math.round(baseAtk * scale),
      isBoss, staggerPips: isBoss ? 3 : 0, staggered: false,
      burnTurns: 0, frozen: false, silenced: false, tauntedTurns: 0,
      weaknesses: window.FFBattleMenu ? window.FFBattleMenu.getEnemyWeaknesses(effectiveCh) : ["starlight", "fire"],
      intent: null
    };
    st.enemy.intent = window.FFBattleMenu ? window.FFBattleMenu.rollEnemyIntent(st.enemy, effectiveCh) : { type: "strike", icon: "⚔️", label: `Strike (${st.enemy.atk} DMG)`, dmg: st.enemy.atk };
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
    window.AppUI.refreshVitals();
    if (window.FFBattleMenu) window.FFBattleMenu.renderDeck(true);
    if (window.TutorialDirector) window.TutorialDirector.renderCoachBar();
    if (await this.waitBeat((isBoss ? 1200 : 650) * tMul, seqId)) {
      this.runTurn(seqId);
    }
  },

  async _runWeaponPassiveBeat(seqId, tMul, isCrit, baseDmg, echoSchool = null) {
    const st = window.GameState;
    const echoProc = !!(echoSchool && echoSchool.statusEffect === "echo_clone" && Math.random() < 0.50);
    const swordProc = st.activeWeapon === "ironsword" && st.combatTurn % 2 === 0;
    const hammerProc = st.activeWeapon === "forge_hammer";
    const twinProc = st.activeWeapon === "twin_blade";
    const daggerProc = st.activeWeapon === "flying_dagger" && isCrit;
    if (!(echoProc || swordProc || hammerProc || twinProc || daggerProc)) return false;
    if (!(await this.waitBeat(400 * tMul, seqId))) return true;
    let pDmg = 0;
    let pKind = st.activeWeapon;
    let pLabel = "";
    if (echoProc) {
      pDmg = Math.round(baseDmg * 0.50);
      pKind = "chrono";
      pLabel = `ECHO -${pDmg}!`;
      window.AppUI.log(`⏳ <strong>Chrono Echo Clone!</strong> Echoed for <strong>+${pDmg}</strong> DMG!`, "magic");
    } else if (swordProc) {
      pDmg = Math.round(st.hero.atk * 1.45);
      pLabel = `SWORD CHI -${pDmg}!`;
      window.AppUI.log(`⚔️ <strong>Sword Chi Wave!</strong> Follow-up hit for <strong>${pDmg}</strong> DMG!`, "magic");
    } else if (hammerProc) {
      st.hero.shield += 120;
      const stunned = Math.random() < 0.25;
      if (stunned) { st.enemy.frozen = true; this.applyBossStaggerDamage(1); }
      pLabel = stunned ? "SLAM STUN! +120🛡️" : "+120 SHIELD!";
      window.AppUI.log(`🔨 <strong>Forge Hammer Slam!</strong> +120 Shield${stunned ? " &amp; Stunned foe" : ""}!`, "event");
    } else if (twinProc) {
      pDmg = Math.round(baseDmg * 0.25);
      st.hero.rage = Math.min(100, st.hero.rage + 15);
      pLabel = `FLURRY -${pDmg} +15🔥`;
      window.AppUI.log(`🗡️ <strong>Twin-Blade 4-Hit Flurry!</strong> +${pDmg} DMG &amp; +15 Rage!`, "magic");
    } else if (daggerProc) {
      pDmg = Math.round(st.hero.atk * 0.85);
      pLabel = `LIGHT SPEAR -${pDmg}!`;
      window.AppUI.log(`⚡ <strong>Flying Dagger Light Spear!</strong> Crit follow-up for <strong>${pDmg}</strong> DMG!`, "magic");
    }
    if (pDmg > 0) {
      st.enemy.hp -= pDmg;
      window.Sprite16FPSEngine.triggerActorImpulse("enemy", 12, 180);
      window.Sprite16FPSEngine.spawnFloatingText(pLabel, 700, 155, "#38bdf8", 1.1);
    } else {
      window.Sprite16FPSEngine.spawnFloatingText(pLabel, 280, 165, "#facc15", 1.05);
    }
    window.VfxRenderer.triggerWeaponPassive(pKind, pLabel);
    window.AppUI.refreshVitals();
    if (st.enemy.hp <= 0) {
      await this.waitBeat(400 * tMul, seqId);
      if (seqId === this._combatSeqId && st.enemy) this.handleEnemyDefeat();
      return true;
    }
    return false;
  },

  async runTurn(seqId) {
    const st = window.GameState;
    if (seqId !== this._combatSeqId || !st.inCombat || !st.enemy) return;
    const cfg = window.CAPYBARA_CONFIG;
    const tMul = this.getTimingScale();
    st.combatTurn = (st.combatTurn || 0) + 1;
    st.heroDefending = false;
    if ((st.stringCd || 0) > 0) st.stringCd--;
    if ((st.mantisCd || 0) > 0) st.mantisCd--;
    if ((st.mendCd || 0) > 0) st.mendCd--;
    if (window.FFBattleMenu && !st.enemy.intent) {
      st.enemy.intent = window.FFBattleMenu.rollEnemyIntent(st.enemy, st.chapter);
    }

    // Beat 0: Hero Status Warfare Tick
    let skippedByFreeze = false;
    if (st.heroStatus === "burn" || st.heroStatus === "poison" || st.heroStatus === "bleed") {
      const pct = st.heroStatus === "burn" ? 0.08 : (st.heroStatus === "bleed" ? 0.06 : 0.05);
      const dot = Math.max(4, Math.round(st.hero.maxHp * pct));
      st.hero.hp = Math.max(0, st.hero.hp - dot);
      window.Sprite16FPSEngine.spawnFloatingText(`-${dot} ${st.heroStatus.toUpperCase()}`, 260, 175, "#f97316", 0.95);
      window.AppUI.log(`🔥 <strong>${st.heroStatus.toUpperCase()}</strong> ticked for <strong>${dot}</strong> DMG! (Tap 🌸 Cure 3×)`, "combat");
      window.AppUI.refreshVitals();
      if (st.hero.hp <= 0) { this.handleHeroDefeat(`${st.heroStatus.toUpperCase()} Ailment`); return; }
      if (!(await this.waitBeat(500 * tMul, seqId))) return;
    }
    if (st.heroStatus === "freeze" && Math.random() < 0.50) {
      skippedByFreeze = true;
      window.AppUI.log("❄️ <strong>Hero Kai is Frozen!</strong> Turn skipped — prepare for Enemy attack! (Tap 🌸 Cure 3×)", "combat");
      window.AppUI.refreshVitals();
      if (!(await this.waitBeat(500 * tMul, seqId))) return;
    }

    if (!skippedByFreeze) {
      // Beat 1A: Final Fantasy Manual Command Selection (or Auto-Battle AI)
      st.combatPhase = "command";
      window.AppUI.refreshVitals();
      let cmd = null;
      if (st.autoBattle && window.FFBattleMenu) {
        cmd = window.FFBattleMenu.chooseAutoAction(st);
        if (!(await this.waitBeat(260 * tMul, seqId))) return;
      } else if (window.FFBattleMenu) {
        cmd = await window.FFBattleMenu.waitForCommand(seqId);
        if (!cmd || seqId !== this._combatSeqId || !st.inCombat || !st.enemy) return;
      } else {
        cmd = { type: "attack" };
      }

      const vulnMult = (st.enemy.tauntedTurns || 0) > 0 ? 1.40 : 1.0;

      if (cmd.type === "attack") {
        st.combatPhase = "cast";
        const wCfg = (cfg.WEAPONS_DB && cfg.WEAPONS_DB[st.activeWeapon || "ironsword"]) || { name: "IronSword", sheet: "KAI_CMB_01" };
        st.activeActionSheet = wCfg.sheet;
        window.Sprite16FPSEngine.triggerActorImpulse("hero", 18);
        window.AppUI.refreshVitals();
        if (!(await this.waitBeat(420 * tMul, seqId))) return;

        st.combatPhase = "impact";
        const isCrit = Math.random() < (st.hero.crit / 100);
        const staggerMult = st.enemy.staggered ? 1.75 : 1.0;
        const confuseMult = (st.heroStatus === "confuse" && Math.random() < 0.35) ? 0.60 : 1.0;
        let comboTriggered = false;
        let dmg = Math.round(st.hero.atk * 1.45 * (isCrit ? 1.8 : 1.0) * staggerMult * confuseMult * vulnMult);
        if (Math.random() * 100 < st.hero.combo) {
          dmg = Math.round(dmg * 1.35);
          comboTriggered = true;
        }
        st.enemy.hp -= dmg;
        st.hero.rage = Math.min(100, st.hero.rage + 28);
        if (isCrit) this.applyBossStaggerDamage(1);
        if (window.AudioSFX) window.AudioSFX.play(isCrit ? "crit" : "hit");
        window.Sprite16FPSEngine.triggerActorImpulse("enemy", 16, 200);
        window.Sprite16FPSEngine.triggerCameraPunch({
          zoom: isCrit ? 1.07 : 1.04, focusX: 0.62, shake: isCrit ? 7 : 4, hitStopMs: isCrit ? 120 : 60, durationMs: 380, vignette: isCrit ? 0.16 : 0.06
        });
        window.VfxRenderer.triggerHitCallout(isCrit ? "crit" : (comboTriggered ? "combo" : "pow"), `-${dmg}${isCrit ? " CRIT!" : (comboTriggered ? " COMBO!" : "")}`);
        window.AppUI.log(`⚔️ Kai strikes with <strong>${wCfg.name}</strong> for <strong>${dmg}</strong> ${isCrit ? "CRIT!" : "DMG"} (+28 Rage)!`, "combat");
        window.AppUI.refreshVitals();
        if (st.enemy.hp <= 0) {
          await this.waitBeat(400 * tMul, seqId);
          if (seqId === this._combatSeqId && st.enemy) this.handleEnemyDefeat();
          return;
        }
        if (await this._runWeaponPassiveBeat(seqId, tMul, isCrit, dmg, null)) return;
        if (!(await this.waitBeat(420 * tMul, seqId))) return;
      } else if (cmd.type === "heal") {
        st.combatPhase = "cast";
        const items = st.battleItems || (st.battleItems = { potion: 2, bao: 2, orange: 1 });
        const antiHeal = st.heroStatus === "poison" ? 0.5 : 1.0;
        let healAmt = 0;
        let logMsg = "";
        if (cmd.itemId === "mend") {
          st.mendCd = 2;
          healAmt = Math.round(st.hero.maxHp * 0.25 * antiHeal);
          st.hero.shield += 60;
          st.heroStatus = "none";
          st.activeActionSheet = "KAI_MAG_07";
          logMsg = `🌸 <strong>Lotus Mend:</strong> Restored <strong>+${healAmt} HP</strong>, +60 Shield &amp; Cleansed status!`;
        } else if (cmd.itemId === "potion") {
          items.potion = Math.max(0, (items.potion || 0) - 1);
          healAmt = Math.round(st.hero.maxHp * 0.38 * antiHeal);
          st.hero.rage = Math.min(100, st.hero.rage + 15);
          st.activeActionSheet = "KAI_ACT_10";
          logMsg = `🧪 <strong>Herbal Potion:</strong> Restored <strong>+${healAmt} HP</strong> &amp; +15 Rage!`;
        } else if (cmd.itemId === "bao") {
          items.bao = Math.max(0, (items.bao || 0) - 1);
          healAmt = Math.round(st.hero.maxHp * 0.22 * antiHeal);
          st.stamina = Math.min(st.maxStamina || 20, (st.stamina || 0) + 4);
          this.recalcHeroStats(true);
          st.activeActionSheet = "KAI_ACT_11";
          logMsg = `🥟 <strong>Steamed Veggie Bao:</strong> Restored <strong>+${healAmt} HP</strong> &amp; +4 Stamina!`;
        } else {
          items.orange = Math.max(0, (items.orange || 0) - 1);
          healAmt = Math.round(st.hero.maxHp * 0.15 * antiHeal);
          st.hero.rage = Math.min(100, st.hero.rage + 35);
          st.heroStatus = "none";
          st.activeActionSheet = "KAI_ACT_11";
          logMsg = `🍊 <strong>Salt-Steamed Orange:</strong> Restored <strong>+${healAmt} HP</strong>, +35 Rage &amp; Cleansed status!`;
        }
        st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + healAmt);
        if (window.AudioSFX) window.AudioSFX.play("magic");
        window.VfxRenderer.triggerHealVfx(cmd.itemId || "mend");
        window.Sprite16FPSEngine.spawnFloatingText(`+${healAmt} HP`, 270, 185, "#4ade80", 1.15);
        window.AppUI.log(logMsg, "event");
        window.AppUI.refreshVitals();
        if (!(await this.waitBeat(650 * tMul, seqId))) return;
      } else if (cmd.type === "defend") {
        st.combatPhase = "cast";
        st.heroDefending = true;
        st.hero.shield += 140;
        st.hero.rage = Math.min(100, st.hero.rage + 25);
        st.activeActionSheet = "KAI_ACT_17";
        if (window.AudioSFX) window.AudioSFX.play("parry");
        window.VfxRenderer.triggerDefendVfx();
        window.Sprite16FPSEngine.spawnFloatingText("🛡️ +140 SHIELD · 50% DR", 270, 185, "#38bdf8", 1.1);
        window.AppUI.log("🛡️ <strong>Aegis Defend!</strong> +140 Shield, +25 Rage, 50% DR, Blocks Status Hex &amp; Auto-Counter ready!", "event");
        window.AppUI.refreshVitals();
        if (!(await this.waitBeat(620 * tMul, seqId))) return;
      } else if (cmd.type === "taunt") {
        st.combatPhase = "cast";
        st.enemy.tauntedTurns = 2;
        st.hero.rage = Math.min(100, st.hero.rage + 35);
        if (window.FFBattleMenu) st.enemy.intent = window.FFBattleMenu.rollEnemyIntent(st.enemy, st.chapter);
        st.activeActionSheet = "KAI_ACT_08";
        if (window.AudioSFX) window.AudioSFX.play("tagin");
        window.VfxRenderer.triggerTauntVfx();
        window.Sprite16FPSEngine.spawnFloatingText("🔥 TAUNTED! +40% DMG", 690, 155, "#f97316", 1.15);
        window.AppUI.log(`🔥 <strong>Taunted ${st.enemy.name}!</strong> Takes <strong>1.4× DMG</strong> for 2 turns (+35 Rage) &amp; Parry Counter boosted to ×2.6!`, "magic");
        window.AppUI.refreshVitals();
        if (!(await this.waitBeat(650 * tMul, seqId))) return;
      } else {
        // "magic" or "limit"
        st.combatPhase = "cast";
        const isUltimate = cmd.type === "limit" || (st.hero.rage >= 100 && !cmd.schoolId);
        const chosenId = isUltimate ? "special" : (cmd.schoolId || (st.spellChain && st.spellChain.payload) || st.activeSchool || "starlight");
        let school = cfg.MAGIC_SCHOOLS.find(s => s.id === chosenId) || cfg.MAGIC_SCHOOLS[0];
        const isSilenced = st.heroStatus === "silence";
        if (isUltimate && !isSilenced) {
          school = cfg.MAGIC_SCHOOLS.find(s => s.id === "special") || school;
          st.hero.rage = 0;
          window.VfxRenderer.triggerMangaCutIn("rage");
          window.Sprite16FPSEngine.triggerCameraPunch({ zoom: 1.10, focusX: 0.45, shake: 5, hitStopMs: 0, durationMs: 520, vignette: 0.35 });
          if (school.statusEffect === "trio_assist") window.VfxRenderer.triggerMangaCutIn("assist");
        }
        st.activeActionSheet = isSilenced ? ((cfg.WEAPONS_DB[st.activeWeapon] || {}).sheet || "KAI_CMB_01") : school.kaiSheet;
        const critChance = (st.hero.crit + (school.critBonus || 0)) / 100;
        const isCrit = Math.random() < critChance;
        const staffMult = st.activeWeapon === "starlight_staff" ? 1.45 : 1.0;
        const spellScale = isSilenced ? 0.75 : (((st.hero.skillDmg || 100) / 100) * staffMult);
        const staggerMult = st.enemy.staggered ? 1.75 : 1.0;
        const confuseMult = (st.heroStatus === "confuse" && Math.random() < 0.35) ? 0.60 : 1.0;
        const isWeak = !isSilenced && !isUltimate && (st.enemy.weaknesses || []).includes(school.id);
        const weakMult = isWeak ? 1.35 : 1.0;
        const chainRes = (!isSilenced && window.SpellChainVM)
          ? window.SpellChainVM.evaluateChain(st, st.enemy, isCrit)
          : { triggered: false, dmgMult: 1.0, bonusShield: 0, bonusRage: 0, healPct: 0, cleanse: false, staggerPips: 0, pythonLine: "" };

        window.Sprite16FPSEngine.triggerActorImpulse("hero", 14);
        if (!isSilenced) window.VfxRenderer.triggerSchoolCast(school.id, { tMul, chainActive: chainRes.triggered });
        window.AppUI.refreshVitals();
        if (!(await this.waitBeat(700 * tMul, seqId))) return;

        st.combatPhase = "impact";
        if (chainRes.triggered) {
          if (chainRes.bonusShield) st.hero.shield += chainRes.bonusShield;
          if (chainRes.bonusRage) st.hero.rage = Math.min(100, st.hero.rage + chainRes.bonusRage);
          if (chainRes.cleanse) st.heroStatus = "none";
          if (chainRes.healPct) st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + Math.round(st.hero.maxHp * chainRes.healPct));
          if (chainRes.staggerPips) this.applyBossStaggerDamage(chainRes.staggerPips);
        }
        let dmg = Math.round(st.hero.atk * (isSilenced ? 1.0 : (school.atkPct || 1.8)) * spellScale * (isCrit ? 1.8 : 1.0) * staggerMult * confuseMult * vulnMult * weakMult * chainRes.dmgMult);
        let comboTriggered = false;
        if (Math.random() * 100 < st.hero.combo) {
          dmg = Math.round(dmg * 1.35);
          comboTriggered = true;
        }
        st.enemy.hp -= dmg;
        if (isWeak) {
          this.applyBossStaggerDamage(1);
          window.Sprite16FPSEngine.spawnFloatingText("💥 WEAK ×1.35!", 700, 125, "#facc15", 1.15);
        }
        if (isUltimate || isCrit) this.applyBossStaggerDamage(isUltimate ? 2 : 1);
        if (!isUltimate) st.hero.rage = Math.min(100, st.hero.rage + (school.rageGain || 20));
        if (!isSilenced && school.shieldGain) st.hero.shield += school.shieldGain;
        if (!isSilenced && school.healPct) {
          const antiHeal = st.heroStatus === "poison" ? 0.5 : 1.0;
          st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + Math.round(st.hero.maxHp * school.healPct * antiHeal));
        }
        if (school.statusEffect === "cleanse_all" || school.statusEffect === "cleanse_burn" || school.statusEffect === "cleanse_silence") st.heroStatus = "none";
        if (school.statusEffect === "dodge_up") st.hero.dodge = Math.min(50, (st.hero.dodge || 5) + 20);
        if (school.statusEffect === "burn") st.enemy.burnTurns = 3;
        if (school.statusEffect === "freeze" && Math.random() < 0.40) st.enemy.frozen = true;
        if (school.statusEffect === "silence") st.enemy.silenced = true;

        if (st.enemy.burnTurns > 0) {
          const burnDmg = Math.round(st.hero.atk * 0.35);
          st.enemy.hp -= burnDmg;
          st.enemy.burnTurns--;
        }
        const isRangedSpell = ["starlight", "lightning", "water"].includes(school.id) || st.activeWeapon === "flying_dagger";
        if (window.AudioSFX) window.AudioSFX.play(isCrit || isUltimate ? "crit" : "magic");
        window.Sprite16FPSEngine.triggerActorImpulse("enemy", 18, 220);
        window.Sprite16FPSEngine.triggerCameraPunch({
          zoom: isUltimate ? 1.11 : (isCrit ? 1.08 : 1.04),
          focusX: 0.62, shake: isUltimate ? 10 : (isCrit ? 7 : 4), hitStopMs: isUltimate ? 160 : (isCrit ? 120 : 60),
          durationMs: 420, vignette: isUltimate ? 0.30 : (isCrit ? 0.18 : 0.08)
        });
        window.VfxRenderer.triggerHitCallout(
          isUltimate ? "boom" : (isCrit ? "crit" : (comboTriggered ? "combo" : (isRangedSpell ? "bang" : "pow"))),
          `-${dmg}${isCrit ? " CRIT!" : (isWeak ? " WEAK!" : "")}`
        );
        window.AppUI.log(`✨ ${isSilenced ? "[SILENCED STRIKE] " : (isUltimate ? "<strong>[LIMIT BREAK!]</strong> " : "")}Kai casts <strong>${school.name}</strong>${isWeak ? " <strong style='color:#facc15'>[WEAKNESS!]</strong>" : ""} for <strong>${dmg}</strong> ${isCrit ? "CRIT!" : "DMG"}${chainRes.triggered ? " <code>[" + chainRes.pythonLine + "]</code>" : ""}`, "magic");
        window.AppUI.refreshVitals();
        if (st.enemy.hp <= 0) {
          await this.waitBeat(420 * tMul, seqId);
          if (seqId === this._combatSeqId && st.enemy) this.handleEnemyDefeat();
          return;
        }
        if (await this._runWeaponPassiveBeat(seqId, tMul, isCrit, dmg, isSilenced ? null : school)) return;
        if (!(await this.waitBeat(460 * tMul, seqId))) return;
      }
    }

    // Beat 3: Enemy Intent Execution & Rhythm Parry Window
    st.activeActionSheet = null;
    st.combatPhase = "parry";
    const intent = st.enemy.intent || { type: "strike", dmg: st.enemy.atk, status: null };
    if (st.enemy.frozen) {
      st.enemy.frozen = false;
      if (st.enemy.staggered) {
        st.enemy.staggered = false;
        st.enemy.staggerPips = 3;
      }
      window.AppUI.log(`❄️ <strong>${st.enemy.name} is Staggered/Frozen!</strong> Skips its attack!`, "event");
      window.AppUI.refreshVitals();
      if (!(await this.waitBeat(600 * tMul, seqId))) return;
    } else if (intent.type === "charge") {
      const gain = intent.shieldGain || Math.round(st.enemy.maxHp * 0.08);
      st.enemy.hp = Math.min(st.enemy.maxHp, st.enemy.hp + gain);
      window.Sprite16FPSEngine.spawnFloatingText(`+${gain} BARRIER!`, 700, 175, "#38bdf8", 1.1);
      window.AppUI.log(`🛡️ <strong>${st.enemy.name}</strong> fortified its barrier for <strong>+${gain} HP</strong>!`, "boss");
      window.AppUI.refreshVitals();
      if (!(await this.waitBeat(600 * tMul, seqId))) return;
    } else {
      const parryMs = Math.round((st.heroDefending ? 1500 : 1050) * tMul);
      st.parryWindowOpen = true;
      st.parriedThisTurn = false;
      st.parryWindowDurationMs = parryMs;
      st.parryWindowEndsAt = Date.now() + parryMs;
      window.AppUI.refreshVitals();
      if (window.TutorialDirector) window.TutorialDirector.notify("parry_window");

      while (Date.now() < st.parryWindowEndsAt) {
        await new Promise(r => setTimeout(r, 60));
        if (seqId !== this._combatSeqId || !st.inCombat || !st.enemy || st.parriedThisTurn) break;
      }
      st.parryWindowOpen = false;
      window.AppUI.refreshVitals();
      if (seqId !== this._combatSeqId || !st.inCombat || !st.enemy) return;

      if (st.parriedThisTurn) {
        if (!(await this.waitBeat(650 * tMul, seqId))) return;
      } else {
        st.combatPhase = "enemy";
        window.AppUI.refreshVitals();
        if (Math.random() * 100 < (st.hero.dodge || 5)) {
          window.Sprite16FPSEngine.setHeroAction("KAI_ACT_05", 700);
          window.VfxRenderer.triggerHitCallout("dodge", "DODGED!");
          window.AppUI.log(`💨 <strong>Dodged!</strong> Hero Kai evaded ${st.enemy.name}'s attack!`, "event");
          window.AppUI.refreshVitals();
          if (!(await this.waitBeat(500 * tMul, seqId))) return;
        } else {
          const mat = (cfg.CHAPTER_STATUS_MATRIX_V4_2 || {})[st.chapter] || { status: "poison", projRow: 1 };
          const projMs = Math.round(380 * tMul);
          window.Sprite16FPSEngine.triggerActorImpulse("enemy", -16);
          window.VfxRenderer.triggerEnemyProjectile(mat.projRow, projMs);
          if (!(await this.waitBeat(projMs, seqId))) return;

          const baseIntentDmg = intent.dmg || st.enemy.atk;
          let raw = st.enemy.silenced ? Math.round(baseIntentDmg * 0.5) : baseIntentDmg;
          if (st.heroDefending) raw = Math.round(raw * 0.5);
          st.enemy.silenced = false;
          const mitigated = Math.max(3, Math.round(raw * (1 - (st.hero.dr || 0) / 100)));
          const afterShield = Math.max(0, mitigated - st.hero.shield);
          st.hero.shield = Math.max(0, st.hero.shield - mitigated);
          st.hero.hp = Math.max(0, st.hero.hp - afterShield);
          if (window.AudioSFX) window.AudioSFX.play("hit");
          window.Sprite16FPSEngine.triggerCameraPunch({ zoom: 1.03, focusX: 0.35, shake: 5, hitStopMs: 80, durationMs: 280, vignette: 0.12 });
          window.VfxRenderer.triggerHitCallout("bang", afterShield > 0 ? `-${afterShield} HP` : "SHIELDED!");
          if (afterShield > 0) {
            window.Sprite16FPSEngine.setHeroAction("KAI_ACT_06", 700);
            window.Sprite16FPSEngine.triggerActorImpulse("hero", -14, 180);
            window.Sprite16FPSEngine.spawnFloatingText(`-${afterShield} HP`, 270, 200, "#ef4444", 1.1);
            if (!st.heroDefending && ((intent.status && Math.random() < 0.70) || Math.random() < 0.28)) {
              st.heroStatus = intent.status || mat.status;
              st.cureTaps = 0;
            }
          }
          window.AppUI.refreshVitals();
          if (st.hero.hp <= 0) {
            this.handleHeroDefeat(st.enemy.name);
            return;
          }
          if (st.heroDefending || (Math.random() * 100 < (st.hero.counter || 10) && st.enemy)) {
            if (!(await this.waitBeat(340 * tMul, seqId))) return;
            const cntMult = st.heroDefending ? 1.10 : 0.90;
            const cntDmg = Math.round(st.hero.atk * cntMult);
            st.enemy.hp -= cntDmg;
            window.Sprite16FPSEngine.triggerActorImpulse("hero", 14);
            window.Sprite16FPSEngine.triggerActorImpulse("enemy", 12, 160);
            window.Sprite16FPSEngine.spawnFloatingText(`-${cntDmg} ${st.heroDefending ? "SHIELD BASH!" : "COUNTER!"}`, 700, 195, "#38bdf8", 1.05);
            if (st.heroDefending) window.AppUI.log(`🛡️ <strong>Aegis Shield Bash!</strong> Countered for <strong>${cntDmg}</strong> DMG!`, "magic");
            window.AppUI.refreshVitals();
            if (st.enemy.hp <= 0) {
              await this.waitBeat(400 * tMul, seqId);
              if (seqId === this._combatSeqId && st.enemy) this.handleEnemyDefeat();
              return;
            }
          }
        }
      }
    }

    if ((st.enemy.tauntedTurns || 0) > 0) st.enemy.tauntedTurns--;
    if (window.FFBattleMenu) st.enemy.intent = window.FFBattleMenu.rollEnemyIntent(st.enemy, st.chapter);

    // Beat 4: Recovery Breath before Next Turn
    st.combatPhase = "recover";
    window.AppUI.refreshVitals();
    if (await this.waitBeat(450 * tMul, seqId)) {
      this.runTurn(seqId);
    }
  }
};
