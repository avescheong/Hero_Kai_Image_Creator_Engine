// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// tutorial_director_v5.js (v5.1: Chapter 1 Silent Village Interactive Guide & Live System Diagnostics)
window.TutorialDirector = {
  STEPS: [
    {
      id: "stage_explore",
      title: "Stage Props & Companion Bond",
      text: "Welcome to <strong>The Silent Village</strong>! Click the glowing <strong>Item/Shrine</strong> on stage or pet <strong>String</strong> (left), then press <strong>NEXT DAY (Space)</strong>!",
      spotlight: () => (window.GameState && window.GameState.tutorialStageClicked ? "btn-next-day" : "")
    },
    {
      id: "first_combat",
      title: "Final Fantasy Command Deck & Parry",
      text: "Your turn! Pick <strong>⚔️ Attack</strong>, <strong>✨ Magic</strong> (hit Weaknesses!), <strong>💚 Heal</strong>, <strong>🛡️ Defend</strong>, or <strong>🔥 Taunt</strong> in the Command Deck (or toggle <strong>Auto-Battle</strong>), then <strong>Space</strong> to Parry!",
      spotlight: () => (window.GameState && window.GameState.parryWindowOpen ? "btn-parry" : (window.GameState && window.GameState.awaitingCommand ? "ff-battle-deck" : (window.GameState && window.GameState.inCombat ? "btn-tag-string" : "btn-next-day")))
    },
    {
      id: "wizard_and_skills",
      title: "Great Wizard & Visual Skill Tree",
      text: "Accept the <strong>Great Wizard's</strong> blessing, then open <strong>🌳 Skills</strong> and spend a Spark to unlock a connected Tier 1–2 node!",
      spotlight: () => (window.GameState && window.GameState.awaitingChoice ? "choice-chips-bar" : "btn-skill-tree")
    },
    {
      id: "spell_forge_chain",
      title: "Python Gate & 3-Slot Spell-Chain",
      text: "Day 4 Python Gate! Click <strong>💻 Spell-Forge IDE</strong>, enter <code>print</code> for <strong>5-Day Overclock</strong>, and try the <strong>⚡ 3-Slot Spell-Chain</strong> tab!",
      spotlight: () => "btn-code-forge"
    },
    {
      id: "crossroads_stamina",
      title: "3-Lane Crossroads & Stamina",
      text: "Day 5 <strong>Branching Crossroads</strong>! Marching uses Stamina (20/20). Pick <strong>🌿 Veggie Campfire</strong> (plant-based meal restores Stamina) or another lane!",
      spotlight: () => (window.GameState && window.GameState.awaitingChoice ? "choice-chips-bar" : "btn-next-day")
    },
    {
      id: "gear_magic_gacha",
      title: "12 Magic Schools & Armory",
      text: "Open <strong>✨ Magic</strong> to swap elemental spells (auto-syncs to your Spell-Chain!), or inspect <strong>⚔️ Gear</strong> & <strong>🎰 Gacha</strong>, then march to Day 8!",
      spotlight: () => "btn-magic"
    },
    {
      id: "boss_hack_trial",
      title: "3-Pip Boss Stagger & Live AI Hack",
      text: "Day 8 Tutorial Mini-Boss! Press <strong>NEXT DAY</strong> if not fighting yet, break its Stagger pips, and click <strong>⚡ Hack Boss AI</strong> mid-battle to rewrite its Python!",
      spotlight: () => {
        const hackBtn = document.getElementById("btn-hack-boss");
        if (hackBtn && !hackBtn.classList.contains("hidden")) return "btn-hack-boss";
        return window.GameState && window.GameState.inCombat ? "btn-parry" : "btn-next-day";
      }
    },
    {
      id: "graduate",
      title: "Silent Village Graduation",
      text: "<strong>Tutorial Complete!</strong> Claim <strong>+100 Gold, +2 Skill Sparks &amp; +5 Star Gems</strong> to continue your 60-day quest — check <strong>⚙️ More ➔ 🩺 Self-Test</strong> anytime!",
      spotlight: () => "btn-tutorial-finish",
      actionLabel: "✨ Claim Reward & Finish"
    }
  ],

  init() {
    this.renderCoachBar();
  },

  isActive() {
    const st = window.GameState;
    return !!(st && st.chapter === 1 && !st.tutorialDone && !st.sandboxMode);
  },

  _clearSpotlights() {
    document.querySelectorAll(".tutorial-spotlight").forEach(el => el.classList.remove("tutorial-spotlight"));
  },

  renderCoachBar() {
    const bar = document.getElementById("tutorial-coach-bar");
    this._clearSpotlights();
    if (!bar) return;
    if (!this.isActive()) {
      bar.classList.add("hidden");
      return;
    }
    const st = window.GameState;
    const idx = Math.max(0, Math.min(this.STEPS.length - 1, st.tutorialStep || 0));
    const step = this.STEPS[idx];
    const dots = this.STEPS.map((s, i) =>
      `<span class="tut-dot ${i < idx ? "done" : (i === idx ? "active" : "")}" title="Step ${i + 1}: ${s.title}"></span>`
    ).join("");

    bar.classList.remove("hidden");
    bar.innerHTML = `
      <canvas class="card-preview-canvas tut-mentor-canvas" data-sheet="ENM_BOSS_43" data-row="0" data-flipx="false" width="44" height="44"></canvas>
      <div class="tut-body">
        <div class="tut-top-row">
          <span class="tut-step-pill">🧙‍♂️ Ch.1 Guide · Step ${idx + 1}/${this.STEPS.length}: ${step.title}</span>
          <span class="tut-dots">${dots}</span>
        </div>
        <div class="tut-text">${step.text}</div>
      </div>
      <div class="tut-actions">
        ${step.actionLabel ? `<button id="btn-tutorial-finish" class="btn-primary tut-finish-btn" onclick="window.TutorialDirector.finishTutorial()">${step.actionLabel}</button>` : ""}
        <button class="btn-tool tut-skip-btn" onclick="window.TutorialDirector.skipTutorial()">Skip</button>
      </div>`;

    if (window.Sprite16FPSEngine && window.Sprite16FPSEngine.attachPreviewCanvases) {
      window.Sprite16FPSEngine.attachPreviewCanvases(bar);
    }
    const spotId = typeof step.spotlight === "function" ? step.spotlight() : "";
    if (spotId) {
      const target = document.getElementById(spotId);
      if (target && !target.classList.contains("hidden")) {
        target.classList.add("tutorial-spotlight");
      }
    }
  },

  advanceToStep(nextIdx) {
    const st = window.GameState;
    if (!this.isActive()) return;
    if ((st.tutorialStep || 0) < nextIdx) {
      st.tutorialStep = Math.min(this.STEPS.length - 1, nextIdx);
      if (window.SaveManager) window.SaveManager.saveToLocal();
    }
    this.renderCoachBar();
  },

  notify(eventName, payload = {}) {
    const st = window.GameState;
    if (!st || !this.isActive()) {
      this._clearSpotlights();
      return;
    }
    const step = st.tutorialStep || 0;
    if (eventName === "stage_clicked") {
      st.tutorialStageClicked = true;
    } else if (eventName === "day_advanced") {
      if (step === 0 && (payload.day || st.day) >= 2) this.advanceToStep(1);
    } else if (eventName === "combat_won") {
      if (step === 1) this.advanceToStep(2);
      else if (step === 6 && payload.isBoss) this.advanceToStep(7);
    } else if (eventName === "parry_window" || eventName === "parry_success") {
      // Refresh spotlight onto #btn-parry dynamically
    } else if (eventName === "npc_blessed") {
      // Waiting for player to unlock a skill node next
    } else if (eventName === "skill_unlocked") {
      if (step <= 2) this.advanceToStep(3);
    } else if (eventName === "forge_compiled" || eventName === "chain_edited") {
      if (step === 3) this.advanceToStep(4);
    } else if (eventName === "crossroads_picked") {
      if (step === 4) this.advanceToStep(5);
    } else if (eventName === "magic_switched") {
      if (step === 5) this.advanceToStep(6);
    } else if (eventName === "boss_hacked") {
      if (step === 6) this.advanceToStep(7);
    }
    this.renderCoachBar();
  },

  finishTutorial() {
    const st = window.GameState;
    if (!st) return;
    if (!st.tutorialDone) {
      st.tutorialDone = true;
      st.tutorialStep = this.STEPS.length - 1;
      st.gold = (st.gold || 0) + 100;
      st.skillSparks = (st.skillSparks || 0) + 2;
      st.gems = (st.gems || 0) + 5;
      if (window.AudioSFX) window.AudioSFX.play("levelup");
      if (window.VfxRenderer) window.VfxRenderer.triggerProp("EXP_LINK_46", "GRADUATED!");
      if (window.AppUI) {
        window.AppUI.log("🎓 <strong>Silent Village Tutorial Complete!</strong> Claimed <strong>+100 Gold, +2 Skill Sparks &amp; +5 Star Gems</strong>!", "event");
        window.AppUI.refreshVitals();
      }
      if (window.SaveManager) window.SaveManager.saveToLocal();
    }
    this.renderCoachBar();
  },

  skipTutorial() {
    const st = window.GameState;
    if (!st) return;
    st.tutorialDone = true;
    this.renderCoachBar();
    if (window.AppUI) window.AppUI.log("⏭️ <strong>Ch. 1 Tutorial Skipped.</strong> Replay anytime via <strong>⚙️ More ➔ 🩺 Self-Test</strong>.", "event");
    if (window.SaveManager) window.SaveManager.saveToLocal();
  },

  restartTutorial() {
    const st = window.GameState;
    if (!st) return;
    st.chapter = 1;
    st.day = 1;
    st.inCombat = false;
    st.awaitingChoice = false;
    st.enemy = null;
    st.roadsideNpc = null;
    st.propCollected = false;
    st.tutorialDone = false;
    st.tutorialStep = 0;
    st.tutorialStageClicked = false;
    if (window.StoryEngine) {
      window.StoryEngine._combatSeqId++;
      window.StoryEngine.randomizeStageProps(true);
    }
    if (window.FFBattleMenu) window.FFBattleMenu.cancelPending(true);
    if (window.AppUI) {
      window.AppUI.setChoices([]);
      window.AppUI.closeModal();
      window.AppUI.refreshVitals();
      window.AppUI.log("🧙‍♂️ <strong>Restarted Ch. 1 Silent Village Interactive Tutorial</strong> at Day 1!", "event");
    }
    if (window.SaveManager) window.SaveManager.saveToLocal();
    this.renderCoachBar();
  }
};

window.SystemDiagnostics = {
  runAll() {
    const checks = [];
    const cfg = window.CAPYBARA_CONFIG || {};
    const eng = window.Sprite16FPSEngine;
    const st = window.GameState || {};

    // 1. 226/226 Loaded sprite sheets & biomes
    const loadedCount = eng && eng.images ? Object.keys(eng.images).length : 0;
    checks.push({
      name: "1. 226 Sprite Atlases & Biomes Preloaded",
      ok: loadedCount >= 226,
      detail: `${loadedCount} / 226 assets loaded in Sprite16FPSEngine.images`
    });

    // 2. ACTOR_FLIP_X_MAP coverage
    const flipMap = cfg.ACTOR_FLIP_X_MAP || {};
    const npcsMapped = (cfg.SPECIAL_NPCS || []).every(n => Object.prototype.hasOwnProperty.call(flipMap, n.id));
    const enemiesMapped = Object.keys(cfg.ENEMY_CATALOG || {}).every(id => Object.prototype.hasOwnProperty.call(flipMap, id));
    checks.push({
      name: "2. NPC & Enemy Facing Map (ACTOR_FLIP_X_MAP)",
      ok: flipMap.ENM_BOSS_43 === true && flipMap.ENM_BOSS_49 === false && npcsMapped && enemiesMapped,
      detail: `Great Wizard flipX=${flipMap.ENM_BOSS_43}, Yuzu flipX=${flipMap.ENM_BOSS_49}, 10 NPCs & 42 Enemies mapped`
    });

    // 3. Magic School <-> SpellChain payload sync
    const synced = !!(st.spellChain && st.spellChain.payload === st.activeSchool);
    checks.push({
      name: "3. Magic School ↔ Spell-Chain Payload Sync",
      ok: synced,
      detail: `activeSchool="${st.activeSchool}", spellChain.payload="${st.spellChain && st.spellChain.payload}"`
    });

    // 4. Randomized propPos & pickup non-overlap bounds
    const pp = st.propPos || { rx: 0, ry: 0 };
    const pk = st.activeStreetPickup;
    const propBoundsOk = pp.rx >= 0.40 && pp.rx <= 0.90 && pp.ry >= 0.50 && pp.ry <= 0.85;
    const nonOverlap = !pk || Math.hypot((pk.rx || 0) - pp.rx, (pk.ry || 0) - pp.ry) >= 0.14;
    checks.push({
      name: "4. Randomized Stage Props & Non-Overlap",
      ok: propBoundsOk && nonOverlap,
      detail: `propPos=(${pp.rx.toFixed(2)}, ${pp.ry.toFixed(2)})` + (pk ? `, pickup=(${pk.rx.toFixed(2)}, ${pk.ry.toFixed(2)})` : ", no pickup this turn")
    });

    // 5. SpellChainVM zero-eval pipeline
    let chainOk = false;
    let chainDetail = "SpellChainVM missing";
    if (window.SpellChainVM && window.SpellChainVM.evaluateChain) {
      const res = window.SpellChainVM.evaluateChain(st, { burnTurns: 1 }, true);
      chainOk = !!(res && typeof res.dmgMult === "number" && res.pythonLine);
      chainDetail = res ? `${res.pythonLine} (x${res.dmgMult.toFixed(2)})` : "eval failed";
    }
    checks.push({ name: "5. Safe 3-Slot SpellChainVM Pipeline", ok: chainOk, detail: chainDetail });

    // 6. BossHackEngine all 12 chapters
    let hacksOk = false;
    if (window.BossHackEngine && window.BossHackEngine.getBossScript) {
      const all12 = Array.from({ length: 12 }, (_, i) => window.BossHackEngine.getBossScript(i + 1));
      hacksOk = all12.every(s => s && s.code && s.answer && Array.isArray(s.options) && s.options.length === 4);
    }
    checks.push({
      name: "6. BossHackEngine Scripts (Chapters 1–12)",
      ok: hacksOk,
      detail: hacksOk ? "12/12 End-Boss AI Python hack scripts verified" : "Missing chapter boss hack data"
    });

    // 7. Skill Tree 4x4 structure
    const branches = cfg.SKILL_TREES_DB || [];
    const totalNodes = branches.reduce((acc, b) => acc + (b.nodes ? b.nodes.length : 0), 0);
    checks.push({
      name: "7. Visual Skill Tree (4 Branches × 4 Tiers)",
      ok: branches.length === 4 && totalNodes === 16,
      detail: `${branches.length} branches, ${totalNodes} tier nodes, ${(st.unlockedNodes || []).length} unlocked`
    });

    // 8. AudioSFX API & Mute Toggle check
    const audioApiOk = !!(window.AudioSFX && typeof window.AudioSFX.play === "function" && (window.AudioContext || window.webkitAudioContext));
    checks.push({
      name: "8. Procedural Web Audio SFX Synth",
      ok: audioApiOk,
      detail: audioApiOk ? `Web Audio ready (muted=${!!window.AudioSFX.muted})` : "Web Audio API unavailable"
    });

    // 9. MasteryPassport JSON export
    let passportOk = false;
    let passportDetail = "";
    if (window.MasteryPassport && window.MasteryPassport.exportPassportJson) {
      try {
        const parsed = JSON.parse(window.MasteryPassport.exportPassportJson());
        passportOk = parsed && parsed.game === "Kai_Capybara_GO" && parsed.totalConcepts === 12;
        passportDetail = `v${parsed.version}, ${parsed.masteredCount}/12 concepts`;
      } catch (e) {
        passportDetail = "Invalid JSON";
      }
    }
    checks.push({ name: "9. Python Mastery Passport JSON Export", ok: passportOk, detail: passportDetail });

    // 10. SaveManager JSON round-trip check
    let saveOk = false;
    if (window.SaveManager && window.SaveManager.exportSaveJson) {
      try {
        const parsed = JSON.parse(window.SaveManager.exportSaveJson());
        saveOk = !!(parsed && parsed.hero && typeof parsed.hero.maxHp === "number");
      } catch (e) {}
    }
    checks.push({
      name: "10. SaveManager Portable JSON Integrity",
      ok: saveOk,
      detail: saveOk ? `Key ${window.SaveManager.KEY} valid` : "Save JSON invalid"
    });

    // 11. Final Fantasy Manual Command Deck & Enemy Intent
    const deckEl = typeof document !== "undefined" ? document.getElementById("ff-battle-deck") : null;
    const ffMenu = window.FFBattleMenu;
    const ffIntent = ffMenu && ffMenu.rollEnemyIntent ? ffMenu.rollEnemyIntent({ atk: 20, maxHp: 300, isBoss: false }, 1) : null;
    const ffWeaks = ffMenu && ffMenu.getEnemyWeaknesses ? ffMenu.getEnemyWeaknesses(1) : [];
    const ffAuto = ffMenu && ffMenu.chooseAutoAction ? ffMenu.chooseAutoAction(st) : null;
    const ffOk = !!(deckEl && ffMenu && ffIntent && ffIntent.label && ffWeaks.length >= 2 && ffAuto && ffAuto.type);
    checks.push({
      name: "11. Final Fantasy Command Deck & Intent AI",
      ok: ffOk,
      detail: ffOk ? `Weaknesses=${ffWeaks.join("/")}, Intent="${ffIntent.label}", Auto=${ffAuto.type}` : "FFBattleMenu check failed"
    });

    const passed = checks.filter(c => c.ok).length;
    return { passed, total: checks.length, checks };
  }
};
