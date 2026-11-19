// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// spell_chain_and_boss_hack_v5.js (Sprint 2: 3-Slot Python Spell-Chain VM & Live Boss AI Source Code Hacking)
window.SpellChainVM = {
  TRIGGERS: [
    { id: "always", label: "if True:", desc: "Always fires (+10% Spell DMG)" },
    { id: "on_crit", label: "if is_crit:", desc: "Fires on Critical Hit (+35% DMG & +10 Rage)" },
    { id: "on_burn", label: "if enemy.burn > 0:", desc: "Fires vs Burning foe (+45% DMG)" },
    { id: "loop_3", label: "for i in range(3):", desc: "3-hit loop (+20% DMG & +1 Stagger every 3rd turn)" },
    { id: "low_hp", label: "if kai.hp < 50%:", desc: "Fires below 50% HP (+40% DMG & +60 Shield)" }
  ],
  MODIFIERS: [
    { id: "amp", label: "dmg *= 1.35", desc: "+35% Spell Multiplier when triggered" },
    { id: "shield", label: "shield += 90", desc: "+90 Hollow-Rim Shield when triggered" },
    { id: "cleanse", label: "cleanse()", desc: "Cleanses hero ailment & +5% HP when triggered" },
    { id: "rage", label: "rage += 18", desc: "+18 Rage when triggered" },
    { id: "stagger", label: "stagger(1)", desc: "Shreds 1 Boss Stagger Pip when triggered" }
  ],

  evaluateChain(st, enemy, isCrit) {
    const chain = st.spellChain || { trigger: "always", modifier: "amp", payload: st.activeSchool || "starlight" };
    let triggered = false;
    let dmgMult = 1.0;
    let bonusShield = 0;
    let bonusRage = 0;
    let healPct = 0;
    let cleanse = false;
    let staggerPips = 0;

    switch (chain.trigger) {
      case "always":
        triggered = true; dmgMult += 0.10; break;
      case "on_crit":
        if (isCrit) { triggered = true; dmgMult += 0.35; bonusRage += 10; } break;
      case "on_burn":
        if (enemy && enemy.burnTurns > 0) { triggered = true; dmgMult += 0.45; } break;
      case "loop_3":
        triggered = true; dmgMult += 0.20;
        if ((st.combatTurn || 1) % 3 === 0) staggerPips += 1;
        break;
      case "low_hp":
        if (st.hero.hp < st.hero.maxHp * 0.50) { triggered = true; dmgMult += 0.40; bonusShield += 60; } break;
    }

    if (triggered) {
      switch (chain.modifier) {
        case "amp": dmgMult += 0.35; break;
        case "shield": bonusShield += 90; break;
        case "cleanse": cleanse = true; healPct += 0.05; break;
        case "rage": bonusRage += 18; break;
        case "stagger": staggerPips += 1; break;
      }
    }

    const trigObj = this.TRIGGERS.find(t => t.id === chain.trigger) || this.TRIGGERS[0];
    const modObj = this.MODIFIERS.find(m => m.id === chain.modifier) || this.MODIFIERS[0];
    return {
      triggered, dmgMult, bonusShield, bonusRage, healPct, cleanse, staggerPips,
      payload: chain.payload || st.activeSchool || "starlight",
      pythonLine: `${trigObj.label} ${modObj.label} -> cast('${chain.payload || st.activeSchool}')`
    };
  }
};

window.BossHackEngine = {
  getBossScript(chapter) {
    const ch = Math.max(1, Math.min(12, chapter || 1));
    const gate = (window.CAPYBARA_CONFIG.CHAPTER_BOSS_GATES || {})[ch] || {
      prompt: "Patch the Boss AI loop!", code: "_______(\"LIGHT\")", options: ["print", "echo", "pass", "none"], answer: "print"
    };
    return {
      ch,
      prompt: gate.prompt,
      code: gate.code,
      options: gate.options,
      answer: gate.answer,
      effectDesc: "Hacking Boss AI halves Boss ATK by 25%, breaks 2 Stagger Pips & freezes Boss for 1 turn!"
    };
  },

  applyHack(inputVal) {
    const st = window.GameState;
    if (!st.inCombat || !st.enemy || !st.enemy.isBoss) {
      return { ok: false, msg: "Boss AI Hacking is only active during Boss/Elite battles!" };
    }
    if (st.enemy.hacked) {
      return { ok: false, msg: `${st.enemy.name}'s AI has already been hacked this fight!` };
    }
    const script = this.getBossScript(st.chapter);
    const normVal = String(inputVal || "").replace(/\s+/g, " ").trim();
    const normAns = String(script.answer || "").replace(/\s+/g, " ").trim();
    const expectedLine = script.code.replace(/_+/, script.answer).replace(/\s+/g, " ").trim();

    if (normVal === normAns || normVal === expectedLine) {
      st.enemy.hacked = true;
      st.enemy.atk = Math.max(5, Math.round(st.enemy.atk * 0.75));
      st.enemy.frozen = true;
      window.StoryEngine.applyBossStaggerDamage(2);
      window.VfxRenderer.triggerCodeTrace("EXP_LINK_44");
      window.VfxRenderer.triggerMangaCutIn("shatter");
      window.Sprite16FPSEngine.spawnFloatingText("💻 BOSS AI HACKED!", 680, 145, "#38bdf8", 1.25);
      window.AppUI.log(`💻 <strong>BOSS AI HACKED!</strong> Injected <code>${script.answer}</code> — ${st.enemy.name}'s ATK dropped 25%, -2 Stagger Pips &amp; Frozen 1 turn!`, "python");
      window.AppUI.refreshVitals();
      return { ok: true, msg: `Patched Boss AI with ${script.answer}!` };
    }
    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_06", 800);
    return { ok: false, msg: `SyntaxError: '${normVal || "(empty)"}' did not patch the Boss AI loop.` };
  }
};
