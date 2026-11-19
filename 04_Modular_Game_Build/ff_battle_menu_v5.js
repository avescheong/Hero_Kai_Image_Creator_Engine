// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// ff_battle_menu_v5.js (v5.3: Final Fantasy Manual Tactical Command Deck, Enemy Intent & Elemental Weakness Break)
window.FFBattleMenu = {
  subMenu: "main",
  hoveredCmd: "attack",
  _pendingResolver: null,
  _pendingSeqId: 0,
  _lastRenderKey: "",

  getEnemyWeaknesses(ch) {
    const map = (window.CAPYBARA_CONFIG && window.CAPYBARA_CONFIG.CHAPTER_WEAKNESSES_V5_3) || {};
    return map[ch] || ["starlight", "fire"];
  },

  rollEnemyIntent(enemy, ch) {
    if (!enemy) return null;
    if (enemy.frozen) {
      return { type: "stunned", icon: "❄️", label: "Frozen / Staggered (0 DMG)", dmg: 0, status: null, color: "#38bdf8" };
    }
    const st = window.GameState || {};
    const cfg = window.CAPYBARA_CONFIG || {};
    const mat = (cfg.CHAPTER_STATUS_MATRIX_V4_2 || {})[ch] || { status: "poison", projRow: 1 };
    if ((enemy.tauntedTurns || 0) > 0) {
      return {
        type: "enraged",
        icon: "💢",
        label: `Enraged Strike (${Math.round(enemy.atk * 1.25)} DMG — PARRY ×2.6!)`,
        dmg: Math.round(enemy.atk * 1.25),
        status: null,
        color: "#f97316"
      };
    }
    const turn = (st.combatTurn || 0) + 1;
    const roll = Math.random();
    if (enemy.isBoss && turn % 4 === 0) {
      const shieldGain = Math.round((enemy.maxHp || 500) * 0.08);
      return { type: "charge", icon: "🛡️", label: `Barrier Charge (+${shieldGain} HP)`, dmg: 0, shieldGain, status: null, color: "#38bdf8" };
    }
    if (turn % 3 === 0 || roll < 0.25) {
      return { type: "heavy", icon: "💥", label: `Heavy Smash (${Math.round(enemy.atk * 1.45)} DMG)`, dmg: Math.round(enemy.atk * 1.45), status: null, color: "#ef4444" };
    }
    if (turn === 2 || roll < 0.53) {
      return {
        type: "hex",
        icon: "🧪",
        label: `${mat.status.toUpperCase()} Hex (${Math.round(enemy.atk * 0.85)} DMG)`,
        dmg: Math.round(enemy.atk * 0.85),
        status: mat.status,
        color: "#c084fc"
      };
    }
    return { type: "strike", icon: "⚔️", label: `Strike (${enemy.atk} DMG)`, dmg: enemy.atk, status: null, color: "#fde68a" };
  },

  chooseAutoAction(st) {
    if (!st) return { type: "attack" };
    if (st.hero && st.hero.rage >= 100 && st.heroStatus !== "silence") {
      return { type: "limit" };
    }
    if (st.hero && (st.hero.hp / Math.max(1, st.hero.maxHp)) < 0.38 && (st.mendCd || 0) <= 0) {
      return { type: "heal", itemId: "mend" };
    }
    if (st.heroStatus === "silence") {
      return { type: "attack" };
    }
    const payload = (st.spellChain && st.spellChain.payload) || st.activeSchool || "starlight";
    return { type: "magic", schoolId: payload };
  },

  waitForCommand(seqId) {
    this.cancelPending(false);
    const st = window.GameState;
    this.subMenu = "main";
    st.awaitingCommand = true;
    this._pendingSeqId = seqId;
    this._lastRenderKey = "";
    this.renderDeck(true);
    if (window.TutorialDirector && window.TutorialDirector.renderCoachBar) {
      window.TutorialDirector.renderCoachBar();
    }
    return new Promise((resolve) => {
      this._pendingResolver = resolve;
    });
  },

  submitCommand(cmd) {
    const st = window.GameState;
    if (!this._pendingResolver || !st || !st.awaitingCommand) return false;
    const resolver = this._pendingResolver;
    this._pendingResolver = null;
    st.awaitingCommand = false;
    this.subMenu = "main";
    this._lastRenderKey = "";
    this.renderDeck(true);
    if (window.TutorialDirector && window.TutorialDirector.renderCoachBar) {
      window.TutorialDirector.renderCoachBar();
    }
    resolver(cmd);
    return true;
  },

  cancelPending(hideIfOutOfCombat = true) {
    const st = window.GameState;
    if (this._pendingResolver) {
      const resolver = this._pendingResolver;
      this._pendingResolver = null;
      if (st) st.awaitingCommand = false;
      resolver(null);
    } else if (st) {
      st.awaitingCommand = false;
    }
    if (hideIfOutOfCombat && (!st || !st.inCombat)) {
      const deck = document.getElementById("ff-battle-deck");
      if (deck) deck.classList.add("hidden");
      this._lastRenderKey = "";
    }
  },

  toggleAutoBattle() {
    if (window.StoryEngine && window.StoryEngine.toggleAutoMarch) {
      window.StoryEngine.toggleAutoMarch();
      return;
    }
    const st = window.GameState;
    if (!st) return;
    st.autoBattle = !st.autoBattle;
    st.autoMarch = st.autoBattle;
    this._lastRenderKey = "";
    this.renderDeck(true);
  },

  setHover(cmd) {
    if (this.hoveredCmd === cmd) return;
    this.hoveredCmd = cmd;
    if (this.subMenu === "main") {
      const subPane = document.querySelector("#ff-battle-deck .ff-sub-pane");
      if (subPane) {
        subPane.innerHTML = this._buildMainPreviewHtml();
        if (window.Sprite16FPSEngine && window.Sprite16FPSEngine.attachPreviewCanvases) {
          window.Sprite16FPSEngine.attachPreviewCanvases(subPane);
        }
      }
    }
  },

  openSubMenu(sub) {
    const st = window.GameState;
    if (!st || !st.inCombat || !st.awaitingCommand) return;
    this.subMenu = sub;
    this._lastRenderKey = "";
    this.renderDeck(true);
  },

  _buildMainPreviewHtml() {
    const st = window.GameState || {};
    const cfg = window.CAPYBARA_CONFIG || {};
    const wCfg = (cfg.WEAPONS_DB || {})[st.activeWeapon || "ironsword"] || { name: "IronSword", sheet: "KAI_CMB_01", desc: "Weapon Strike" };
    const payloadId = (st.spellChain && st.spellChain.payload) || st.activeSchool || "starlight";
    const school = (cfg.MAGIC_SCHOOLS || []).find(s => s.id === payloadId) || (cfg.MAGIC_SCHOOLS || [])[0] || { name: "Starlight", kaiSheet: "KAI_MAG_05", py: "print()", desc: "Spell" };
    const intent = st.enemy && st.enemy.intent ? st.enemy.intent : { icon: "⚔️", label: "Strike", type: "strike" };
    let advice = `Enemy plans ${intent.icon} ${intent.label}.`;
    if (intent.type === "heavy" || intent.type === "enraged") {
      advice = `Enemy plans ${intent.icon} ${intent.label} — <strong>Defend [4]</strong> halves damage or <strong>Parry [Space]</strong> for huge counter!`;
    } else if (intent.type === "hex") {
      advice = `Enemy plans ${intent.icon} ${intent.label} — <strong>Defend [4]</strong> blocks status hex or <strong>Heal [3]</strong> prepares cleanse.`;
    } else if (intent.type === "charge") {
      advice = `Enemy is charging barrier! Strike with <strong>Magic [2]</strong> or <strong>Taunt [5]</strong> to punish!`;
    } else if (intent.type === "stunned") {
      advice = `Enemy is Staggered/Frozen (0 DMG) — unleash <strong>Attack [1]</strong> or <strong>Weakness Magic [2]</strong>!`;
    }

    const estAtk = Math.round((st.hero ? st.hero.atk : 100) * 1.45);
    const map = {
      attack: {
        sheet: wCfg.sheet,
        title: `⚔️ ${wCfg.name}`,
        py: "kai.strike(weapon_passive=True)",
        stat: `~${estAtk} DMG · +28🔥 Rage · Triggers Weapon Passive`
      },
      magic: {
        sheet: school.kaiSheet,
        title: `✨ ${school.name}`,
        py: `cast("${school.id}") # ${school.py}`,
        stat: st.heroStatus === "silence" ? "SILENCED! Use Attack [1] or Salt-Steamed Orange" : `1.35× DMG & -1 Stagger Pip on Enemy Weaknesses!`
      },
      heal: {
        sheet: "KAI_MAG_07",
        title: "💚 Lotus Mend & Plant-Based Provisions",
        py: "heal(lotus_mend) or eat('Veggie_Bao')",
        stat: `Lotus Mend CD: ${st.mendCd || 0}t · Potions: ${(st.battleItems && st.battleItems.potion) || 0} · Bao: ${(st.battleItems && st.battleItems.bao) || 0}`
      },
      defend: {
        sheet: "KAI_ACT_17",
        title: "🛡️ Aegis Guard & Shield Counter",
        py: "with guard(dr=0.50): parry_window *= 1.5",
        stat: "+140 Shield · +25🔥 Rage · 50% DR + Blocks Hex + Auto-Counter"
      },
      taunt: {
        sheet: "KAI_ACT_08",
        title: "🔥 Pythonic Taunt & Vulnerability",
        py: "enemy.taunt(2); enemy.vuln = 1.40",
        stat: "+35🔥 Rage · Enemy takes 1.4× DMG (2t) · Parry Counter = ×2.6!"
      },
      limit: {
        sheet: "KAI_MAG_16",
        title: "💥 GRAND OUROBOROS LIMIT BREAK!",
        py: "def ultimate(): return 3.2 * OVERDRIVE",
        stat: "320% ATK + Trio Assist Cut-In + -2 Boss Stagger Pips!"
      },
      allies: {
        sheet: "EXP_LINK_31",
        title: "🐾 Companion Assists & Boss AI Hack",
        py: "string.bark() / mantis.cleanse() / hack_boss()",
        stat: "Free bonus actions that don't consume your turn!"
      }
    };
    const info = map[this.hoveredCmd] || map.attack;
    return `
      <div class="ff-preview-box">
        <canvas class="card-preview-canvas" data-sheet="${info.sheet}" width="52" height="52"></canvas>
        <div class="ff-preview-meta">
          <div class="ff-preview-title">${info.title}</div>
          <div class="ff-preview-stat">${info.stat}</div>
          <div class="ff-preview-code"><code>${info.py}</code></div>
          <div class="ff-preview-advice">💡 ${advice}</div>
        </div>
      </div>`;
  },

  _buildMagicSubHtml(st, cfg) {
    const weaks = (st.enemy && st.enemy.weaknesses) || this.getEnemyWeaknesses(st.chapter);
    const schools = (cfg.MAGIC_SCHOOLS || []).filter(s => s.id !== "special");
    const disabled = !st.awaitingCommand || st.heroStatus === "silence";
    return `
      <div class="ff-sub-header">
        <span>✨ Choose Magic Spell ${st.heroStatus === "silence" ? '<strong style="color:#fca5a5">(SILENCED!)</strong>' : '(💥 WEAK = 1.35× DMG &amp; -1 Stagger)'}</span>
        <button class="btn-tool ff-back-btn" onclick="window.FFBattleMenu.openSubMenu('main')">← Back</button>
      </div>
      <div class="ff-magic-grid">
        ${schools.map(s => {
          const isWeak = weaks.includes(s.id);
          return `
            <button class="ff-magic-btn ${isWeak ? "is-weak" : ""}" ${disabled ? "disabled" : ""} onclick="window.FFBattleMenu.submitCommand({type:'magic',schoolId:'${s.id}'})">
              <canvas class="card-preview-canvas" data-sheet="${s.kaiSheet}" width="32" height="32"></canvas>
              <div class="ff-magic-info">
                <div class="ff-magic-name" style="color:${s.color}">${s.name.split(" (")[0]} ${isWeak ? '<span class="ff-weak-pill">WEAK!</span>' : ""}</div>
                <div class="ff-magic-desc">${Math.round((s.atkPct || 1.8) * 100)}% · <code>${s.py}</code></div>
              </div>
            </button>`;
        }).join("")}
      </div>`;
  },

  _buildHealSubHtml(st) {
    const items = st.battleItems || { potion: 2, bao: 2, orange: 1 };
    const mendCd = st.mendCd || 0;
    const dis = !st.awaitingCommand;
    return `
      <div class="ff-sub-header">
        <span>💚 Lotus Healing &amp; 100% Plant-Based Provisions</span>
        <button class="btn-tool ff-back-btn" onclick="window.FFBattleMenu.openSubMenu('main')">← Back</button>
      </div>
      <div class="ff-heal-grid">
        <button class="ff-magic-btn" ${dis || mendCd > 0 ? "disabled" : ""} onclick="window.FFBattleMenu.submitCommand({type:'heal',itemId:'mend'})">
          <canvas class="card-preview-canvas" data-sheet="KAI_MAG_07" width="32" height="32"></canvas>
          <div class="ff-magic-info">
            <div class="ff-magic-name" style="color:#f472b6">🌸 Lotus Mend ${mendCd > 0 ? `(${mendCd}t CD)` : '<span class="ff-weak-pill">READY</span>'}</div>
            <div class="ff-magic-desc">+25% HP, +60 Shield &amp; Cleanse Status (2t CD)</div>
          </div>
        </button>
        <button class="ff-magic-btn" ${dis || (items.potion || 0) <= 0 ? "disabled" : ""} onclick="window.FFBattleMenu.submitCommand({type:'heal',itemId:'potion'})">
          <canvas class="card-preview-canvas" data-sheet="KAI_ACT_10" width="32" height="32"></canvas>
          <div class="ff-magic-info">
            <div class="ff-magic-name" style="color:#4ade80">🧪 Herbal Potion (×${items.potion || 0})</div>
            <div class="ff-magic-desc">+38% Max HP &amp; +15 Rage</div>
          </div>
        </button>
        <button class="ff-magic-btn" ${dis || (items.bao || 0) <= 0 ? "disabled" : ""} onclick="window.FFBattleMenu.submitCommand({type:'heal',itemId:'bao'})">
          <canvas class="card-preview-canvas" data-sheet="KAI_ACT_11" width="32" height="32"></canvas>
          <div class="ff-magic-info">
            <div class="ff-magic-name" style="color:#fde68a">🥟 Veggie Bao (×${items.bao || 0})</div>
            <div class="ff-magic-desc">+22% Max HP &amp; +4 Stamina</div>
          </div>
        </button>
        <button class="ff-magic-btn" ${dis || (items.orange || 0) <= 0 ? "disabled" : ""} onclick="window.FFBattleMenu.submitCommand({type:'heal',itemId:'orange'})">
          <canvas class="card-preview-canvas" data-sheet="VFX_MISC_38" width="32" height="32"></canvas>
          <div class="ff-magic-info">
            <div class="ff-magic-name" style="color:#fb923c">🍊 Salt-Steamed Orange (×${items.orange || 0})</div>
            <div class="ff-magic-desc">+15% HP, +35 Rage &amp; Cleanse</div>
          </div>
        </button>
      </div>`;
  },

  _buildAlliesSubHtml(st) {
    const bossHackReady = !!(st.enemy && st.enemy.isBoss && !st.enemy.hacked);
    const limitReady = st.hero && st.hero.rage >= 100 && st.heroStatus !== "silence";
    return `
      <div class="ff-sub-header">
        <span>🐾 Companion Bonus Assists &amp; Boss AI Hack</span>
        <button class="btn-tool ff-back-btn" onclick="window.FFBattleMenu.openSubMenu('main')">← Back</button>
      </div>
      <div class="ff-heal-grid">
        <button class="ff-magic-btn" ${(st.stringCd || 0) > 0 ? "disabled" : ""} onclick="window.StoryEngine.triggerCompanionTagIn('string');window.FFBattleMenu.renderDeck(true);">
          <canvas class="card-preview-canvas" data-sheet="EXP_LINK_31" width="32" height="32"></canvas>
          <div class="ff-magic-info">
            <div class="ff-magic-name" style="color:#f59e0b">🐾 [Q] String — Sonic Bark ${(st.stringCd || 0) > 0 ? `(${st.stringCd}t)` : "(FREE)"}</div>
            <div class="ff-magic-desc">150% Pet ATK &amp; -1 Stagger Pip</div>
          </div>
        </button>
        <button class="ff-magic-btn" ${(st.mantisCd || 0) > 0 ? "disabled" : ""} onclick="window.StoryEngine.triggerCompanionTagIn('mantis');window.FFBattleMenu.renderDeck(true);">
          <canvas class="card-preview-canvas" data-sheet="EXP_LINK_33" width="32" height="32"></canvas>
          <div class="ff-magic-info">
            <div class="ff-magic-name" style="color:#4ade80">🌿 [E] Mantis — Dawn Blossom ${(st.mantisCd || 0) > 0 ? `(${st.mantisCd}t)` : "(FREE)"}</div>
            <div class="ff-magic-desc">+12% HP, +40 Shield &amp; Cleanse</div>
          </div>
        </button>
        <button class="ff-magic-btn" ${!bossHackReady ? "disabled" : ""} onclick="window.DrawerUI.openBossHackModal()">
          <canvas class="card-preview-canvas" data-sheet="VFX_MISC_13" width="32" height="32"></canvas>
          <div class="ff-magic-info">
            <div class="ff-magic-name" style="color:#38bdf8">⚡ Hack Boss AI</div>
            <div class="ff-magic-desc">${bossHackReady ? "Patch Boss Python code (-25% ATK &amp; Freeze!)" : (st.enemy && st.enemy.hacked ? "Already hacked!" : "Boss fights only")}</div>
          </div>
        </button>
        <button class="ff-magic-btn ${limitReady ? "is-weak" : ""}" ${!limitReady || !st.awaitingCommand ? "disabled" : ""} onclick="window.FFBattleMenu.submitCommand({type:'limit'})">
          <canvas class="card-preview-canvas" data-sheet="KAI_MAG_16" width="32" height="32"></canvas>
          <div class="ff-magic-info">
            <div class="ff-magic-name" style="color:#facc15">💥 Limit Break (${st.hero ? st.hero.rage : 0}/100🔥)</div>
            <div class="ff-magic-desc">${limitReady ? "320% ATK + Trio Assist Ready!" : "Fill Rage to 100% to unleash"}</div>
          </div>
        </button>
      </div>`;
  },

  renderDeck(force = false) {
    const deck = document.getElementById("ff-battle-deck");
    const st = window.GameState;
    if (!deck) return;
    if (!st || !st.inCombat || !st.enemy) {
      deck.classList.add("hidden");
      this._lastRenderKey = "";
      return;
    }
    const cfg = window.CAPYBARA_CONFIG || {};
    const items = st.battleItems || {};
    const key = [
      st.combatTurn, st.awaitingCommand, st.combatPhase, st.autoBattle,
      this.subMenu, st.hero.hp, st.hero.rage, st.heroStatus,
      st.mendCd, items.potion, items.bao, items.orange,
      st.stringCd, st.mantisCd, st.enemy.tauntedTurns, st.enemy.hacked,
      st.enemy.intent ? st.enemy.intent.type : ""
    ].join("|");
    if (!force && key === this._lastRenderKey && !deck.classList.contains("hidden")) {
      return;
    }
    this._lastRenderKey = key;

    const weaks = st.enemy.weaknesses || this.getEnemyWeaknesses(st.chapter);
    const weakHtml = weaks.map(id => {
      const sc = (cfg.MAGIC_SCHOOLS || []).find(s => s.id === id);
      return `<span class="ff-weak-pill" style="border-color:${sc ? sc.color : "#fde68a"};color:${sc ? sc.color : "#fde68a"}">${sc ? sc.name.split(" (")[0] : id}</span>`;
    }).join(" ");
    const limitReady = st.hero && st.hero.rage >= 100 && st.heroStatus !== "silence";
    const dis = !st.awaitingCommand;

    let rightHtml = "";
    if (this.subMenu === "magic") rightHtml = this._buildMagicSubHtml(st, cfg);
    else if (this.subMenu === "heal") rightHtml = this._buildHealSubHtml(st);
    else if (this.subMenu === "allies") rightHtml = this._buildAlliesSubHtml(st);
    else rightHtml = this._buildMainPreviewHtml();

    deck.classList.remove("hidden");
    deck.innerHTML = `
      <div class="ff-deck-header">
        <div class="ff-deck-title">
          <span class="ff-turn-badge">${st.awaitingCommand ? "▶" : "⏳"} TURN ${st.combatTurn || 1} · ${st.awaitingCommand ? "YOUR COMMAND" : (st.combatPhase || "EXECUTING").toUpperCase()}</span>
          <span class="ff-weak-wrap">Weak: ${weakHtml}</span>
          ${(st.enemy.tauntedTurns || 0) > 0 ? `<span class="ff-taunt-pill">🔥 TAUNTED ${st.enemy.tauntedTurns}t (+40% DMG)</span>` : ""}
        </div>
        <div class="ff-deck-controls">
          <span class="ff-hotkey-hint">[1–6] Keys</span>
          <button id="btn-ff-auto-toggle" class="btn-tool ${st.autoBattle ? "active-auto" : ""}">${st.autoBattle ? "🤖 Auto-Battle: ON" : "🎮 Manual Mode"}</button>
        </div>
      </div>
      <div class="ff-deck-body">
        <div class="ff-cmd-list">
          <button class="ff-cmd-btn ${this.hoveredCmd === "attack" && this.subMenu === "main" ? "is-selected" : ""}" ${dis ? "disabled" : ""} onmouseenter="window.FFBattleMenu.setHover('attack')" onclick="window.FFBattleMenu.submitCommand({type:'attack'})"><span><kbd>1</kbd> ⚔️ Attack</span></button>
          <button class="ff-cmd-btn ${this.subMenu === "magic" ? "is-selected" : ""}" ${dis ? "disabled" : ""} onmouseenter="window.FFBattleMenu.setHover('magic')" onclick="window.FFBattleMenu.openSubMenu('magic')"><span><kbd>2</kbd> ✨ Magic ▸</span></button>
          <button class="ff-cmd-btn ${this.subMenu === "heal" ? "is-selected" : ""}" ${dis ? "disabled" : ""} onmouseenter="window.FFBattleMenu.setHover('heal')" onclick="window.FFBattleMenu.openSubMenu('heal')"><span><kbd>3</kbd> 💚 Heal ▸</span></button>
          <button class="ff-cmd-btn ${this.hoveredCmd === "defend" && this.subMenu === "main" ? "is-selected" : ""}" ${dis ? "disabled" : ""} onmouseenter="window.FFBattleMenu.setHover('defend')" onclick="window.FFBattleMenu.submitCommand({type:'defend'})"><span><kbd>4</kbd> 🛡️ Defend</span></button>
          <button class="ff-cmd-btn ${this.hoveredCmd === "taunt" && this.subMenu === "main" ? "is-selected" : ""}" ${dis ? "disabled" : ""} onmouseenter="window.FFBattleMenu.setHover('taunt')" onclick="window.FFBattleMenu.submitCommand({type:'taunt'})"><span><kbd>5</kbd> 🔥 Taunt</span></button>
          ${limitReady
            ? `<button class="ff-cmd-btn ff-limit-ready" ${dis ? "disabled" : ""} onmouseenter="window.FFBattleMenu.setHover('limit')" onclick="window.FFBattleMenu.submitCommand({type:'limit'})"><span><kbd>6</kbd> 💥 LIMIT!</span></button>`
            : `<button class="ff-cmd-btn ${this.subMenu === "allies" ? "is-selected" : ""}" ${dis ? "disabled" : ""} onmouseenter="window.FFBattleMenu.setHover('allies')" onclick="window.FFBattleMenu.openSubMenu('allies')"><span><kbd>6</kbd> 🐾 Allies ▸</span></button>`}
        </div>
        <div class="ff-sub-pane">${rightHtml}</div>
      </div>`;

    const autoToggleBtn = deck.querySelector("#btn-ff-auto-toggle");
    if (autoToggleBtn) {
      autoToggleBtn.onclick = (e) => {
        e.stopPropagation();
        this.toggleAutoBattle();
      };
    }

    if (window.Sprite16FPSEngine && window.Sprite16FPSEngine.attachPreviewCanvases) {
      window.Sprite16FPSEngine.attachPreviewCanvases(deck);
    }
  },

  handleHotkey(code) {
    const st = window.GameState;
    if (!st || !st.inCombat || !st.awaitingCommand) return false;
    if (code === "Digit1") return this.submitCommand({ type: "attack" });
    if (code === "Digit2") { this.openSubMenu("magic"); return true; }
    if (code === "Digit3") { this.openSubMenu("heal"); return true; }
    if (code === "Digit4") return this.submitCommand({ type: "defend" });
    if (code === "Digit5") return this.submitCommand({ type: "taunt" });
    if (code === "Digit6") {
      if (st.hero && st.hero.rage >= 100 && st.heroStatus !== "silence") {
        return this.submitCommand({ type: "limit" });
      }
      this.openSubMenu("allies");
      return true;
    }
    if ((code === "Backspace" || code === "Escape") && this.subMenu !== "main") {
      this.openSubMenu("main");
      return true;
    }
    return false;
  }
};
