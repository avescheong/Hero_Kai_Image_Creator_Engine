// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// equipment_and_pets_drawer_v4_2.js (v4.3: Live 16-FPS Card Previews, 4-Tier Armor Paper-Doll, Gacha & 3-Card Draft, Pythonia Live Spell-Forge IDE & Jing Si Codex)
window.DrawerUI = {
  _draftPool: [],
  _draftTitle: "Roguelite Skill Draft",
  _forgeTab: "ide",
  _selectedChallengeIdx: 0,

  previewTag(sheetKey, opts = {}) {
    const size = opts.size || 56;
    const rowAttr = opts.row !== undefined ? ` data-row="${opts.row}"` : "";
    const cellAttr = opts.cell !== undefined ? ` data-cell="${opts.cell}"` : "";
    return `<canvas class="card-preview-canvas" data-sheet="${sheetKey}"${rowAttr}${cellAttr} width="${size}" height="${size}"></canvas>`;
  },

  attachPreviews() {
    const body = document.getElementById("modal-body");
    if (window.Sprite16FPSEngine && window.Sprite16FPSEngine.attachPreviewCanvases) {
      window.Sprite16FPSEngine.attachPreviewCanvases(body);
    }
  },

  openMagicModal() {
    const st = window.GameState;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "✨ 12 Pythonic Magic Schools (Live 16-FPS)";
    body.innerHTML = `<div class="grid-cards">${window.CAPYBARA_CONFIG.MAGIC_SCHOOLS.map(s => `
      <div class="sub-card card-with-preview ${st.activeSchool === s.id ? "active" : ""}" onclick="window.DrawerUI.selectSchool('${s.id}')">
        ${this.previewTag(s.kaiSheet, { size: 58 })}
        <div class="card-meta">
          <div style="font-weight:800;color:${s.color}">${s.name}</div>
          <div style="font-size:12px;color:#34d399;margin-top:3px"><code>${s.py}</code></div>
          <div style="font-size:11px;color:#fde68a;margin-top:3px">${s.desc}</div>
        </div>
      </div>`).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
    this.attachPreviews();
  },

  selectSchool(id) {
    window.GameState.activeSchool = id;
    window.VfxRenderer.triggerSchoolCast(id);
    window.AppUI.closeModal();
    window.AppUI.log(`🔮 Switched Magic School to <strong>${id}</strong>!`, "magic");
    window.SaveManager.saveToLocal();
  },

  openGearModal() {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "⚔️ Weapons & 4-Tier Armor Paper-Doll (MOD_B08_04 / CG_B01_02)";
    body.innerHTML = `
      <h4 style="margin:0 0 8px;color:#fde68a">Equipped Weapon (Live Combat Animation)</h4>
      <div class="grid-cards" style="margin-bottom:14px">${Object.values(cfg.WEAPONS_DB || {}).map(w => `
        <div class="sub-card card-with-preview ${st.activeWeapon === w.id ? "active" : ""}" onclick="window.DrawerUI.equipWeapon('${w.id}')">
          ${this.previewTag(w.sheet, { size: 56 })}
          <div class="card-meta">
            <div style="font-weight:800;color:#38bdf8">${w.name}</div>
            <div style="font-size:11px;color:#4ade80;margin-top:2px">+${w.atk} ATK • +${w.crit}% Crit • +${w.combo}% Combo</div>
            <div style="font-size:11px;color:#cbd5e1;margin-top:3px">${w.desc}</div>
          </div>
        </div>`).join("")}</div>
      <h4 style="margin:0 0 8px;color:#4ade80">4-Tier Armor Paper-Doll Progression (MOD_B08_04 &amp; CG_B01_02)</h4>
      <div class="grid-cards">${Object.values(cfg.ARMORS_DB || {}).map(a => `
        <div class="sub-card card-with-preview ${st.activeArmor === a.id ? "active" : ""}" onclick="window.DrawerUI.equipArmor('${a.id}')">
          <div style="display:flex;flex-direction:column;gap:4px">
            ${this.previewTag("CG_B01_02", { size: 52, row: a.armorRow })}
          </div>
          <div class="card-meta">
            <div style="font-weight:800;color:${a.auraColor || '#fde68a'}">${a.name}</div>
            <div style="font-size:11px;color:#cbd5e1;margin-top:4px">+${a.hp} HP • +${a.shield} Hollow Shield • +${a.dr}% DR</div>
            <div style="font-size:10px;color:#94a3b8;margin-top:3px">Paper-Doll Aura Active on HUD &amp; Stage</div>
          </div>
        </div>`).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
    this.attachPreviews();
  },

  equipWeapon(id) {
    window.GameState.activeWeapon = id;
    window.StoryEngine.recalcHeroStats(true);
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    this.openGearModal();
  },

  equipArmor(id) {
    window.GameState.activeArmor = id;
    window.StoryEngine.recalcHeroStats(true);
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    this.openGearModal();
  },

  openSkillTreeModal() {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = `🌳 Pythonic Skill Trees (✨ ${st.skillSparks} Sparks Available)`;
    const drafted = (st.draftedSkills || []).map(id => (cfg.ROGUELITE_SKILLS_DB || []).find(s => s.id === id)).filter(Boolean);
    body.innerHTML = `
      ${drafted.length ? `<div style="margin-bottom:10px;padding:8px 10px;background:#1e293b;border-radius:8px;border:1px solid #f59e0b;font-size:12px">
        <strong style="color:#fde68a">🃏 Drafted Roguelite Perks (${drafted.length}):</strong> ${drafted.map(d => `<span class="perk-pill">${d.name}</span>`).join(" ")}
      </div>` : ""}
      <div class="grid-cards">${(cfg.SKILL_TREES_DB || []).map(br => `
      <div class="sub-card" style="cursor:default">
        <div style="font-weight:800;color:#fde68a;margin-bottom:8px">${br.title}</div>
        ${br.nodes.map(nd => {
          const active = (st.unlockedNodes || []).includes(nd.id);
          return `<div onclick="window.DrawerUI.toggleSkillNode('${nd.id}')" style="cursor:pointer;padding:6px 8px;margin-bottom:6px;border-radius:8px;border:1px solid ${active ? '#f59e0b' : '#334155'};background:${active ? 'rgba(245,158,11,0.18)' : 'rgba(15,23,42,0.85)'}">
            <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:${active ? '#fde68a' : '#e2e8f0'}">
              <span>${nd.name}</span><span>${active ? 'ACTIVE' : nd.cost + ' ✨'}</span>
            </div>
            <div style="font-size:10px;color:#34d399;margin-top:2px"><code>${nd.py}</code></div>
          </div>`;
        }).join("")}
      </div>`).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  },

  toggleSkillNode(nodeId) {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    let nodeObj = null;
    (cfg.SKILL_TREES_DB || []).forEach(b => b.nodes.forEach(n => { if (n.id === nodeId) nodeObj = n; }));
    if (!nodeObj) return;
    if (!st.unlockedNodes) st.unlockedNodes = [];
    if (st.unlockedNodes.includes(nodeId)) {
      st.unlockedNodes = st.unlockedNodes.filter(id => id !== nodeId);
      st.skillSparks += nodeObj.cost;
    } else if (st.skillSparks >= nodeObj.cost) {
      st.unlockedNodes.push(nodeId);
      st.skillSparks -= nodeObj.cost;
    }
    window.StoryEngine.recalcHeroStats(true);
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    this.openSkillTreeModal();
  },

  openSkillDraftModal(sourceLabel = "3-Card Roguelite Skill Draft", isPaid = false) {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    if (isPaid) {
      if (st.gold < 140) {
        window.AppUI.log("❌ Need 140 Gold for a Sanctum Skill Draft!", "boss");
        return;
      }
      st.gold -= 140;
      window.AppUI.refreshVitals();
    }
    this._draftTitle = sourceLabel;
    const all = cfg.ROGUELITE_SKILLS_DB || [];
    const unowned = all.filter(s => !(st.draftedSkills || []).includes(s.id));
    const pool = (unowned.length >= 3 ? unowned : all).slice().sort(() => Math.random() - 0.5).slice(0, 3);
    this._draftPool = pool;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = `🃏 ${sourceLabel} (VFX_MISC_34)`;
    body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:10px">
          ${this.previewTag("VFX_MISC_34", { size: 48 })}
          <span style="font-size:12px;color:#cbd5e1">Pick 1 Pythonic Perk to permanently empower Hero Kai:</span>
        </div>
        <button class="btn-tool" onclick="window.DrawerUI.rerollSkillDraft()">🎲 Reroll (40G)</button>
      </div>
      <div class="draft-cards-grid">${pool.map((s, idx) => `
        <div class="draft-card rarity-${s.rarity}" onclick="window.DrawerUI.pickDraftSkill(${idx})">
          <div class="rarity-tag">${s.rarity.toUpperCase()}</div>
          ${this.previewTag(s.sheet, { size: 74 })}
          <div style="font-weight:800;font-size:13px;color:#f8fafc;margin-top:6px">${s.name}</div>
          <div style="font-size:11px;color:#34d399;margin:4px 0"><code>${s.py}</code></div>
          <div style="font-size:11px;color:#fde68a">${s.desc}</div>
        </div>`).join("")}
      </div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
    this.attachPreviews();
  },

  rerollSkillDraft() {
    const st = window.GameState;
    if (st.gold < 40) {
      window.AppUI.log("❌ Need 40 Gold to reroll draft cards.", "boss");
      return;
    }
    st.gold -= 40;
    window.AppUI.refreshVitals();
    this.openSkillDraftModal(this._draftTitle, false);
  },

  pickDraftSkill(idx) {
    const st = window.GameState;
    const sk = this._draftPool[idx];
    if (!sk) return;
    if (!st.draftedSkills) st.draftedSkills = [];
    st.draftedSkills.push(sk.id);
    window.StoryEngine.recalcHeroStats(true);
    window.VfxRenderer.triggerProp("VFX_MISC_34", sk.name.toUpperCase());
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    window.AppUI.closeModal();
    window.AppUI.log(`🃏 Drafted <strong>${sk.name}</strong> (${sk.rarity.toUpperCase()}) — ${sk.desc}!`, "magic");
  },

  openGachaSanctumModal() {
    const st = window.GameState;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = `🎰 Starlight Gacha & Forge Sanctum (🪙 ${st.gold}G · 💎 ${st.gems || 0} Gems)`;
    body.innerHTML = `
      <div class="grid-cards">
        <div class="sub-card draft-card rarity-epic" onclick="window.DrawerUI.rollMythicChest()">
          <div class="rarity-tag">100 GOLD</div>
          ${this.previewTag("VFX_MISC_31", { size: 72 })}
          <div style="font-weight:800;color:#fde68a;margin-top:6px">Mythic Gear Chest</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:4px">Bounce &amp; open for +2 Skill Sparks, +Gems, or instant Armor Upgrade!</div>
        </div>
        <div class="sub-card draft-card rarity-legendary" onclick="window.DrawerUI.hatchPetEgg()">
          <div class="rarity-tag">10 GEMS</div>
          ${this.previewTag("VFX_MISC_32", { size: 72 })}
          <div style="font-weight:800;color:#38bdf8;margin-top:6px">Spirit Pet Egg Hatch</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:4px">Ascends Pet Bond to Lv.${(st.petLevel || 1) + 1} (+25% Pet ATK &amp; Shield) &amp; +35 Rage!</div>
        </div>
        <div class="sub-card draft-card rarity-epic" onclick="window.DrawerUI.spinLuckySlots()">
          <div class="rarity-tag">45 GOLD</div>
          ${this.previewTag("VFX_MISC_33", { size: 72 })}
          <div style="font-weight:800;color:#4ade80;margin-top:6px">Lucky 777 Python Slots</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:4px">Spin 3 Pythonic reels for Gold, Star Gems, or full 100% Rage!</div>
        </div>
        <div class="sub-card draft-card rarity-mythic" onclick="window.DrawerUI.openSkillDraftModal('Sanctum Skill Draft', true)">
          <div class="rarity-tag">140 GOLD</div>
          ${this.previewTag("VFX_MISC_34", { size: 72 })}
          <div style="font-weight:800;color:#f472b6;margin-top:6px">3-Card Skill Draft</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:4px">Draft 1 of 3 stackable Pythonic Roguelite cards!</div>
        </div>
      </div>
      <div id="gacha-result-banner" style="margin-top:12px;padding:10px;border-radius:8px;background:#1e293b;border:1px solid #334155;font-size:12px;color:#e2e8f0">
        Select any Gacha station above to spend Gold or Star Gems!
      </div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
    this.attachPreviews();
  },

  rollMythicChest() {
    const st = window.GameState;
    if (st.gold < 100) {
      document.getElementById("gacha-result-banner").innerHTML = "❌ Not enough Gold (need 100G).";
      return;
    }
    st.gold -= 100;
    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_09", 1600);
    window.VfxRenderer.triggerProp("VFX_MISC_31", "MYTHIC CHEST!");
    const tiers = ["hoodie", "moss_cloak", "dwarven_plate", "lotus_paladin"];
    const curIdx = tiers.indexOf(st.activeArmor);
    let msg = "";
    if (curIdx >= 0 && curIdx < tiers.length - 1 && Math.random() < 0.45) {
      st.activeArmor = tiers[curIdx + 1];
      window.StoryEngine.recalcHeroStats(true);
      msg = `🛡️ <strong>ARMOR UPGRADED!</strong> Found <strong>${window.CAPYBARA_CONFIG.ARMORS_DB[st.activeArmor].name}</strong>!`;
    } else {
      st.skillSparks += 2;
      st.gems = (st.gems || 0) + 6;
      msg = `✨ Opened Mythic Chest: <strong>+2 Skill Sparks &amp; +6 Star Gems</strong>!`;
    }
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    this.openGachaSanctumModal();
    document.getElementById("gacha-result-banner").innerHTML = msg;
    window.AppUI.log(`🎁 ${msg}`, "event");
  },

  hatchPetEgg() {
    const st = window.GameState;
    if ((st.gems || 0) < 10) {
      document.getElementById("gacha-result-banner").innerHTML = "❌ Not enough Star Gems (need 10 💎).";
      return;
    }
    st.gems -= 10;
    st.petLevel = (st.petLevel || 1) + 1;
    st.hero.rage = Math.min(100, st.hero.rage + 35);
    window.StoryEngine.recalcHeroStats(true);
    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_12", 1600);
    window.VfxRenderer.triggerProp("VFX_MISC_32", `PET LV.${st.petLevel}!`);
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    const msg = `🐣 <strong>Rainbow Egg Hatched!</strong> Companion Bond ascended to <strong>Lv.${st.petLevel}</strong> &amp; +35 Rage!`;
    this.openGachaSanctumModal();
    document.getElementById("gacha-result-banner").innerHTML = msg;
    window.AppUI.log(msg, "magic");
  },

  spinLuckySlots() {
    const st = window.GameState;
    if (st.gold < 45) {
      document.getElementById("gacha-result-banner").innerHTML = "❌ Not enough Gold (need 45G).";
      return;
    }
    st.gold -= 45;
    window.VfxRenderer.triggerProp("VFX_MISC_33", "777 SLOTS!");
    const reels = ["print()", "def:", "True", "777"];
    const r = [0, 1, 2].map(() => reels[Math.floor(Math.random() * reels.length)]);
    let msg = `🎰 Reels: [<strong>${r.join(" | ")}</strong>] — `;
    if (r[0] === r[1] && r[1] === r[2]) {
      st.gold += 180; st.gems = (st.gems || 0) + 8; st.hero.rage = 100;
      msg += "🌟 <strong>TRIPLE JACKPOT!</strong> +180 Gold, +8 Gems &amp; 100% Rage!";
    } else if (r[0] === r[1] || r[1] === r[2] || r[0] === r[2]) {
      st.gold += 85; st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + 180);
      msg += "✨ <strong>DOUBLE MATCH!</strong> +85 Gold &amp; +180 HP!";
    } else {
      st.gold += 25; st.gems = (st.gems || 0) + 2;
      msg += "+25 Gold &amp; +2 Star Gems!";
    }
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    this.openGachaSanctumModal();
    document.getElementById("gacha-result-banner").innerHTML = msg;
    window.AppUI.log(msg, "event");
  },

  // --- BOLD INNOVATION: Pythonia Live Spell-Forge IDE & Jing Si Wisdom Codex ---
  openCodeForgeModal(activeGate = null) {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    this._activeGate = activeGate;
    if (activeGate) {
      this._forgeTab = "ide";
    }
    const challenges = [
      ...(cfg.PYTHON_GATES || []),
      ...Object.entries(cfg.CHAPTER_BOSS_GATES || {}).map(([ch, g]) => ({
        day: 60, ch: parseInt(ch, 10), prompt: `Ch.${ch} Boss Gate: ${g.prompt}`,
        code: g.code, options: g.options, answer: g.answer,
        hint: `Use ${g.answer} to complete the Ch.${ch} Python pattern.`,
        lessonRing: `EXP_LINK_4${((parseInt(ch, 10) - 1) % 5) + 1}`,
        reward: "+5-Day Python Overclock & +80 Gold"
      }))
    ];
    this._forgeChallenges = challenges;
    const gate = activeGate || challenges[this._selectedChallengeIdx % challenges.length];
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "💻 Pythonia Live Spell-Forge IDE & Jing Si Codex";

    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_13", 2500);

    if (this._forgeTab === "codex") {
      const scrolls = cfg.JING_SI_SCROLLS_DB || [];
      const unlocked = st.collectedScrolls || [1];
      body.innerHTML = `
        <div class="filter-pills">
          <button class="filter-pill" onclick="window.DrawerUI.switchForgeTab('ide')">💻 Live Spell-Forge IDE</button>
          <button class="filter-pill active" onclick="window.DrawerUI.switchForgeTab('codex')">📜 Jing Si Wisdom Codex (${unlocked.length}/12)</button>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-size:12px;color:#cbd5e1">
          <span>Unlock wisdom scrolls by solving Spell-Forge challenges or advancing chapters.</span>
          <button class="btn-tool" onclick="window.DrawerUI.meditateScroll()">🌸 Meditate (+10% HP &amp; Cleanse)</button>
        </div>
        <div class="grid-cards">${scrolls.map(sc => {
          const isOpen = unlocked.includes(sc.ch);
          return `<div class="sub-card ${isOpen ? 'active' : ''}" style="cursor:default;opacity:${isOpen ? 1 : 0.45}">
            <div style="font-weight:800;color:#fde68a;font-size:11px">Chapter ${sc.ch} Scroll ${isOpen ? '🌸 UNLOCKED' : '🔒 LOCKED'}</div>
            <div style="font-size:13px;color:#f8fafc;margin-top:4px;font-weight:700">${isOpen ? sc.zh : '???'}</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:4px">${isOpen ? sc.en : 'Clear Chapter ' + sc.ch + ' or solve a Spell-Forge challenge.'}</div>
          </div>`;
        }).join("")}</div>`;
      document.getElementById("modal-backdrop").classList.remove("hidden");
      return;
    }

    const tokens = Array.from(new Set([...(gate.options || []), "print", "def", "for", "elif", "break", "sort", "int", "True", "#"])).slice(0, 8);
    body.innerHTML = `
      <div class="filter-pills">
        <button class="filter-pill active" onclick="window.DrawerUI.switchForgeTab('ide')">💻 Live Spell-Forge IDE</button>
        <button class="filter-pill" onclick="window.DrawerUI.switchForgeTab('codex')">📜 Jing Si Wisdom Codex (${(st.collectedScrolls || [1]).length}/12)</button>
      </div>
      <div class="code-forge-ide">
        <div class="forge-header-row">
          <div style="display:flex;align-items:center;gap:10px">
            ${this.previewTag("VFX_MISC_13", { size: 54 })}
            <div>
              <div style="font-weight:800;color:#38bdf8;font-size:13px">${activeGate ? '🔥 ACTIVE PYTHON GATE' : `Challenge #${(this._selectedChallengeIdx % challenges.length) + 1} (Ch.${gate.ch})`}</div>
              <div style="font-size:12px;color:#e2e8f0;margin-top:2px">${gate.prompt}</div>
            </div>
          </div>
          ${!activeGate ? `<button class="btn-tool" onclick="window.DrawerUI.nextForgeChallenge()">⏭️ Next Challenge</button>` : ""}
        </div>
        <pre class="forge-code-block">${gate.code}</pre>
        <div class="forge-input-row">
          <input id="forge-code-input" type="text" placeholder="Type Python keyword or click a token below (e.g. ${gate.answer})..." />
          <button class="btn-primary" onclick="window.DrawerUI.runForgeSpell()">▶ RUN &amp; TRACE SPELL</button>
        </div>
        <div class="forge-tokens-row">
          <span style="font-size:11px;color:#94a3b8">Quick Tokens:</span>
          ${tokens.map(tk => `<button class="choice-chip" onclick="document.getElementById('forge-code-input').value='${tk.replace(/'/g, "\\'")}'">${tk}</button>`).join("")}
        </div>
        <div id="forge-output" class="forge-output">
          💡 Tip: Fill the missing blank (<code>_____</code>) and press <strong>RUN &amp; TRACE SPELL</strong> to ignite <strong>5-Day Python Overclock (+35% Spell DMG &amp; +15% Crit)</strong>!
        </div>
      </div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
    this.attachPreviews();
  },

  switchForgeTab(tab) {
    this._forgeTab = tab;
    this.openCodeForgeModal(this._activeGate);
  },

  nextForgeChallenge() {
    this._selectedChallengeIdx = (this._selectedChallengeIdx + 1) % (this._forgeChallenges ? this._forgeChallenges.length : 1);
    this.openCodeForgeModal(null);
  },

  meditateScroll() {
    const st = window.GameState;
    const heal = Math.round(st.hero.maxHp * 0.10);
    st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + heal);
    st.heroStatus = "none";
    window.VfxRenderer.triggerLotusPurification();
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    window.AppUI.log(`🌸 Meditated on Jing Si Wisdom: +${heal} HP &amp; Status Cleansed!`, "event");
  },

  runForgeSpell() {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    const gate = this._activeGate || this._forgeChallenges[this._selectedChallengeIdx % this._forgeChallenges.length];
    const input = document.getElementById("forge-code-input");
    const out = document.getElementById("forge-output");
    if (!input || !out) return;
    const val = input.value.trim();
    const expectedLine = gate.code.replace(/_+/, gate.answer).replace(/\s+/g, " ").trim();
    const normVal = val.replace(/\s+/g, " ").trim();

    if (val === gate.answer || normVal === expectedLine || (gate.answer.length >= 2 && val.includes(gate.answer))) {
      st.gold += 80;
      st.skillSparks += 2;
      st.hero.rage = Math.min(100, st.hero.rage + 25);
      st.overclockDays = 5;
      if (!st.collectedScrolls) st.collectedScrolls = [1];
      if (!st.collectedScrolls.includes(gate.ch || st.chapter)) st.collectedScrolls.push(gate.ch || st.chapter);
      window.StoryEngine.recalcHeroStats(true);
      window.VfxRenderer.triggerCodeTrace(gate.lessonRing || "EXP_LINK_41");

      const scroll = (cfg.JING_SI_SCROLLS_DB || []).find(s => s.ch === (gate.ch || st.chapter)) || (cfg.JING_SI_SCROLLS_DB || [])[0];
      out.style.borderColor = "#22c55e";
      out.innerHTML = `✅ <strong>SPELL COMPILED &amp; TRACED!</strong> <code>${gate.answer}</code> verified!<br>⚡ Activated <strong>5-Day Python Overclock</strong> (+35% Spell DMG, +15% Crit), +80 Gold, +2 Sparks!<br>${scroll ? `📜 <em>"${scroll.zh}" — ${scroll.en}</em>` : ""}`;

      if (this._activeGate) {
        const solvedGate = this._activeGate;
        this._activeGate = null;
        if (solvedGate.day === 60) {
          st.awaitingChoice = false;
          window.AppUI.setChoices([]);
          const chObj = window.StoryEngine.getCurrentChapter();
          setTimeout(() => {
            window.AppUI.closeModal();
            window.StoryEngine.startCombat(chObj.d60, true, "Day-60 Chapter End-Boss", true);
          }, 800);
        } else {
          st.awaitingChoice = false;
          window.AppUI.setChoices([]);
        }
      }
      window.AppUI.refreshVitals();
      window.SaveManager.saveToLocal();
      window.AppUI.log(`💻 <strong>Python Spell-Forge Executed!</strong> <code>${gate.answer}</code> → 5-Day Overclock Active!`, "python");
    } else {
      window.Sprite16FPSEngine.setHeroAction("KAI_ACT_14", 1200);
      window.VfxRenderer.triggerProp("EXP_LINK_09", "SYNTAX ERROR!");
      out.style.borderColor = "#ef4444";
      out.innerHTML = `❌ <strong>SyntaxError:</strong> '${val || "(empty)"}' didn't match the spell pattern.<br>💡 Hint: ${gate.hint || "Try one of the Quick Tokens above!"}`;
    }
  },

  openWikiImportModal() {
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "📥 Import Build JSON from PythoniaDB Wiki";
    body.innerHTML = `
      <p style="margin-top:0;font-size:12px;color:#cbd5e1">Paste a JSON build exported from <strong>PythoniaDB (05_Kai_Wikipedia)</strong> or click Load Sample Build:</p>
      <textarea id="wiki-import-text" rows="5" style="width:100%;background:#0f172a;color:#34d399;border:1px solid #334155;border-radius:8px;padding:8px;font-family:monospace;font-size:12px">{"weapon":"starlight_staff","armor":"lotus_paladin","pet":"string","mount":"turtle_stag","unlockedNodes":["st_1","st_2","lt_1"]}</textarea>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="choice-chip" onclick="window.DrawerUI.applyWikiImport()">✅ Apply Wiki Build</button>
      </div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  },

  applyWikiImport() {
    const txt = document.getElementById("wiki-import-text").value;
    try {
      const data = JSON.parse(txt);
      const st = window.GameState;
      if (data.weapon) st.activeWeapon = data.weapon;
      if (data.armor) st.activeArmor = data.armor;
      if (data.pet) st.activePet = data.pet;
      if (data.mount) st.activeMount = data.mount;
      if (Array.isArray(data.unlockedNodes)) st.unlockedNodes = data.unlockedNodes;
      window.StoryEngine.recalcHeroStats(true);
      window.AppUI.refreshVitals();
      window.SaveManager.saveToLocal();
      window.AppUI.closeModal();
      window.AppUI.log("📥 <strong>Imported PythoniaDB Wiki Build!</strong> Stats and loadout updated.", "event");
    } catch (e) {
      window.AppUI.log("❌ Invalid JSON format. Check brackets and quotes!", "boss");
    }
  },

  openChapterModal() {
    const st = window.GameState;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "🗺️ Jump to Chapter (Chapters 1–12)";
    body.innerHTML = `<div class="grid-cards">${window.CAPYBARA_CONFIG.CHAPTERS.map(c => `
      <div class="sub-card card-with-preview ${st.chapter === c.ch ? "active" : ""}" onclick="window.DrawerUI.selectChapter(${c.ch})">
        ${this.previewTag(c.d60, { size: 54 })}
        <div class="card-meta">
          <div style="font-weight:800;color:#4ade80">${c.name}</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:4px">End-Boss: ${c.d60}</div>
          <div style="font-size:11px;color:#94a3b8">NPC: ${c.npc}</div>
        </div>
      </div>`).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
    this.attachPreviews();
  },

  selectChapter(ch) {
    const st = window.GameState;
    st.chapter = ch; st.day = 1; st.inCombat = false; st.awaitingChoice = false; st.enemy = null; st.roadsideNpc = null; st.activeStreetPickup = null;
    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_18", 1500);
    window.AppUI.closeModal();
    window.AppUI.refreshVitals();
    window.AppUI.log(`🗺️ Warped to <strong>${window.StoryEngine.getCurrentChapter().name}</strong> (Day 1/60).`, "event");
  },

  openPetsAndMountsModal() {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = `🐾 Companion Pets (Lv.${st.petLevel || 1}) & Rideable Mounts`;
    body.innerHTML = `
      <h4 style="margin:0 0 8px;color:#fde68a">Active Pet Companion</h4>
      <div class="grid-cards" style="margin-bottom:14px">${cfg.SPIRIT_PETS.map(p => `
        <div class="sub-card card-with-preview ${st.activePet === p.id ? "active" : ""}" onclick="window.GameState.activePet='${p.id}';window.StoryEngine.recalcHeroStats(true);window.AppUI.refreshVitals();window.DrawerUI.openPetsAndMountsModal();">
          ${this.previewTag(p.sheet, { size: 56 })}
          <div class="card-meta">
            <div style="font-weight:800;color:#38bdf8">${p.name}</div>
            <div style="font-size:11px;color:#cbd5e1;margin-top:4px">${p.desc}</div>
          </div>
        </div>`).join("")}</div>
      <h4 style="margin:0 0 8px;color:#4ade80">Active Rideable Mount</h4>
      <div class="grid-cards">${cfg.MOUNTS.map(m => `
        <div class="sub-card card-with-preview ${st.activeMount === m.id ? "active" : ""}" onclick="window.GameState.activeMount='${m.id}';window.StoryEngine.recalcHeroStats(true);window.AppUI.refreshVitals();window.DrawerUI.openPetsAndMountsModal();">
          ${this.previewTag(m.sheet || "KAI_ACT_15", { size: 56 })}
          <div class="card-meta">
            <div style="font-weight:800;color:#4ade80">${m.name}</div>
            <div style="font-size:11px;color:#cbd5e1;margin-top:4px">${m.bonus}</div>
          </div>
        </div>`).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
    this.attachPreviews();
  },

  openBestiaryModal(filter = "all") {
    const cfg = window.CAPYBARA_CONFIG;
    const st = window.GameState;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = `👾 62-Sheet ENM_BOSS Bestiary (${st.defeatedIds.length}/42 Purified)`;
    const entries = Object.entries(cfg.ENEMY_CATALOG).filter(([_, v]) => {
      if (filter === "all") return true;
      if (filter === "minion") return v.tier.includes("Minion");
      if (filter === "elite") return v.tier.includes("Elite");
      if (filter === "boss") return v.tier.includes("End-Boss");
      return true;
    });
    body.innerHTML = `
      <div class="filter-pills">
        <button class="filter-pill ${filter==='all'?'active':''}" onclick="window.DrawerUI.openBestiaryModal('all')">All Enemies (42)</button>
        <button class="filter-pill ${filter==='minion'?'active':''}" onclick="window.DrawerUI.openBestiaryModal('minion')">Minions &amp; D20</button>
        <button class="filter-pill ${filter==='elite'?'active':''}" onclick="window.DrawerUI.openBestiaryModal('elite')">D40 Elites</button>
        <button class="filter-pill ${filter==='boss'?'active':''}" onclick="window.DrawerUI.openBestiaryModal('boss')">D60 End-Bosses (12)</button>
        <button class="filter-pill ${filter==='npc'?'active':''}" onclick="window.DrawerUI.openBestiaryModal('npc')">Special NPCs (10)</button>
      </div>
      <div class="grid-cards">${filter === 'npc'
        ? cfg.SPECIAL_NPCS.map(n => `
          <div class="sub-card card-with-preview" onclick="window.AppUI.closeModal();window.StoryEngine.triggerSpecialNpc('${n.id}')">
            ${this.previewTag(n.id, { size: 54 })}
            <div class="card-meta">
              <div style="font-weight:800;color:#fde68a">${n.name}</div>
              <div style="font-size:11px;color:#94a3b8">${n.id} · ${n.role}</div>
              <div style="font-size:11px;color:#4ade80;margin-top:4px">${n.buff}</div>
            </div>
          </div>`).join("")
        : entries.map(([id, e]) => `
          <div class="sub-card card-with-preview" onclick="window.AppUI.closeModal();window.StoryEngine.startCombat('${id}', ${e.tier.includes('Boss') || e.tier.includes('Elite')}, 'Bestiary Duel')">
            ${this.previewTag(id, { size: 54 })}
            <div class="card-meta">
              <div style="font-weight:800;color:${e.tier.includes('End-Boss')?'#fca5a5':'#38bdf8'}">${e.name}</div>
              <div style="font-size:11px;color:#94a3b8">${id} · Ch.${e.ch} · ${e.tier}</div>
              <div style="font-size:11px;color:#fde68a;margin-top:4px">Bug: <code>${e.bug}</code> ${st.defeatedIds.includes(id)?'· 🌸 Purified':''}</div>
            </div>
          </div>`).join("")
      }</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
    this.attachPreviews();
  },

  openAtlasManifestModal() {
    const cfg = window.CAPYBARA_CONFIG;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "📦 226 Production Assets Manifest (v4.3)";
    const charKeys = Object.keys(cfg.CHARACTER_SHEETS_16F || {});
    const vfxKeys = Object.keys(cfg.VFX_MISC_SHEETS_16F || {});
    const enmKeys = Object.keys(cfg.ENM_BOSS_SHEETS_16F || {});
    const expKeys = Object.keys(cfg.EXP_LINK_SHEETS_16F || {});
    const biomeKeys = Object.keys(cfg.BIOME_BACKDROPS_16x9 || {});
    const statusKeys = Object.keys(cfg.STATUS_SHEETS_V4_2 || {});
    body.innerHTML = `
      <p style="margin-top:0;color:#cbd5e1;font-size:13px">Wired into Modular Build v4.3: <strong>${charKeys.length}</strong> Character + <strong>${vfxKeys.length}</strong> VFX-MISC + <strong>${enmKeys.length}</strong> ENM-BOSS + <strong>${expKeys.length}</strong> EXP-LINK + <strong>${statusKeys.length}</strong> Status/Expression Sheets + <strong>${biomeKeys.length}</strong> 16:9 Biomes = <strong>${charKeys.length + vfxKeys.length + enmKeys.length + expKeys.length + statusKeys.length + biomeKeys.length} Loaded Assets</strong>.</p>
      <div style="font-size:12px;color:#38bdf8;margin-bottom:8px"><strong>Biomes (16:9):</strong> ${biomeKeys.join(", ")}</div>
      <div style="font-size:12px;color:#4ade80;margin-bottom:8px"><strong>Characters (${charKeys.length}×16F):</strong> ${charKeys.slice(0, 4).join(", ")} ... ${charKeys.slice(-3).join(", ")}</div>
      <div style="font-size:12px;color:#facc15;margin-bottom:8px"><strong>VFX-MISC (${vfxKeys.length}×16F):</strong> ${vfxKeys.slice(0, 4).join(", ")} ... ${vfxKeys.slice(-2).join(", ")}</div>
      <div style="font-size:12px;color:#fca5a5;margin-bottom:8px"><strong>ENM-BOSS (${enmKeys.length}×16F):</strong> ${enmKeys.slice(0, 4).join(", ")} ... ${enmKeys.slice(-2).join(", ")}</div>
      <div style="font-size:12px;color:#f472b6;margin-bottom:8px"><strong>EXP-LINK (${expKeys.length}×16F):</strong> ${expKeys.slice(0, 4).join(", ")} ... ${expKeys.slice(-2).join(", ")}</div>
      <div style="font-size:12px;color:#c084fc"><strong>STATUS &amp; EXPRESSIONS (${statusKeys.length}×16F):</strong> ${statusKeys.join(", ")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  }
};
