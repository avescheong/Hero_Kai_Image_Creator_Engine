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
    const rsAttr = opts.rowStart !== undefined ? ` data-rowstart="${opts.rowStart}"` : "";
    const rcAttr = opts.rowCount !== undefined ? ` data-rowcount="${opts.rowCount}"` : "";
    const cellAttr = opts.cell !== undefined ? ` data-cell="${opts.cell}"` : "";
    const flipAttr = opts.flipX !== undefined ? ` data-flipx="${opts.flipX}"` : "";
    const cls = opts.cls ? ` ${opts.cls}` : "";
    const canvasHtml = `<canvas class="card-preview-canvas${cls}" data-sheet="${sheetKey}"${rowAttr}${rsAttr}${rcAttr}${cellAttr}${flipAttr} width="${size}" height="${size}"></canvas>`;
    if (opts.zoomFn) {
      return `<span class="skill-thumb-wrap" title="Click to enlarge 16-FPS animation" onclick="event.stopPropagation();${opts.zoomFn}">${canvasHtml}<span class="zoom-badge">🔍</span></span>`;
    }
    return canvasHtml;
  },

  attachPreviews() {
    const body = document.getElementById("modal-body");
    if (window.Sprite16FPSEngine && window.Sprite16FPSEngine.attachPreviewCanvases) {
      window.Sprite16FPSEngine.attachPreviewCanvases(body);
    }
  },

  openAnimZoomModal(cfg) {
    const overlay = document.getElementById("anim-zoom-overlay");
    const card = document.getElementById("anim-zoom-card");
    if (!overlay || !card) return;
    this._zoomActionFn = cfg.actionFn || null;
    const statHtml = (cfg.stats || []).length
      ? `<div class="stat-pills-row" style="justify-content:center">${cfg.stats.map(p => `<span class="stat-pill">${p}</span>`).join("")}</div>`
      : "";
    card.innerHTML = `
      <div class="anim-zoom-header">
        <span class="tier-tag" style="font-size:10px">${cfg.badge || "16-FPS SAKUGA PREVIEW"}</span>
        <button class="btn-close" onclick="window.DrawerUI.closeAnimZoomModal()">✕</button>
      </div>
      <div style="font-size:16px;font-weight:900;color:${cfg.color || "#fde68a"}">${cfg.title || ""}</div>
      <div class="anim-zoom-stage">
        ${this.previewTag(cfg.sheet, { size: 192, row: cfg.row, rowStart: cfg.rowStart, rowCount: cfg.rowCount, flipX: cfg.flipX, cls: "anim-zoom-canvas" })}
      </div>
      ${statHtml}
      ${cfg.code ? `<div style="font-size:12px;color:#34d399;background:#020617;padding:6px 10px;border-radius:8px;border:1px solid #334155"><code>${cfg.code}</code></div>` : ""}
      ${cfg.desc ? `<div style="font-size:12px;color:#cbd5e1;line-height:1.4">${cfg.desc}</div>` : ""}
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:4px">
        ${cfg.actionLabel ? `<button class="btn-primary" onclick="window.DrawerUI._runZoomAction()">${cfg.actionLabel}</button>` : ""}
        <button class="btn-tool" onclick="window.DrawerUI.closeAnimZoomModal()">Close Preview</button>
      </div>`;
    overlay.classList.remove("hidden");
    if (window.Sprite16FPSEngine && window.Sprite16FPSEngine.attachPreviewCanvases) {
      window.Sprite16FPSEngine.attachPreviewCanvases(card);
    }
  },

  _runZoomAction() {
    const fn = this._zoomActionFn;
    this.closeAnimZoomModal();
    if (typeof fn === "function") fn();
  },

  closeAnimZoomModal() {
    const overlay = document.getElementById("anim-zoom-overlay");
    if (overlay) overlay.classList.add("hidden");
    this._zoomActionFn = null;
  },

  openSkillNodeZoom(nodeId) {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    let nd = null, br = null, idx = -1;
    (cfg.SKILL_TREES_DB || []).forEach(b => b.nodes.forEach((n, i) => {
      if (n.id === nodeId) { nd = n; br = b; idx = i; }
    }));
    if (!nd || !br) return;
    const unlocked = st.unlockedNodes || [];
    const active = unlocked.includes(nd.id);
    const prevNode = idx > 0 ? br.nodes[idx - 1] : null;
    const nextNode = br.nodes[idx + 1] || null;
    const prevUnlocked = !prevNode || unlocked.includes(prevNode.id);
    const nextUnlocked = !!(nextNode && unlocked.includes(nextNode.id));
    const canUnlock = !active && (st.sandboxMode || prevUnlocked) && st.skillSparks >= nd.cost;
    const canRefund = active && (st.sandboxMode || !nextUnlocked);
    this.openAnimZoomModal({
      badge: `${br.title} · Tier ${idx + 1}`,
      title: nd.name,
      color: "#fde68a",
      sheet: nd.sheet || "KAI_MAG_05",
      stats: this.formatNodeStats(nd),
      code: nd.py,
      desc: active ? (canRefund ? "Currently ACTIVE in your build." : `Active. Refund ${nextNode.name} first to remove.`) : (prevUnlocked ? `Costs ${nd.cost} Skill Sparks to unlock.` : `Requires ${prevNode.name} first.`),
      actionLabel: canUnlock ? `✨ Unlock (${nd.cost}✨)` : (canRefund ? `↩️ Refund (+${nd.cost}✨)` : ""),
      actionFn: (canUnlock || canRefund) ? () => this.toggleSkillNode(nd.id) : null
    });
  },

  openMagicZoom(schoolId) {
    const s = (window.CAPYBARA_CONFIG.MAGIC_SCHOOLS || []).find(x => x.id === schoolId);
    if (!s) return;
    this.openAnimZoomModal({
      badge: "Pythonic Magic School · 16-FPS",
      title: s.name,
      color: s.color,
      sheet: s.kaiSheet,
      code: s.py,
      desc: s.desc,
      actionLabel: `🔮 Equip ${s.id}`,
      actionFn: () => this.selectSchool(s.id)
    });
  },

  openPetOrMountZoom(kind, id) {
    const cfg = window.CAPYBARA_CONFIG;
    if (kind === "pet") {
      const p = (cfg.SPIRIT_PETS || []).find(x => x.id === id);
      if (!p) return;
      this.openAnimZoomModal({
        badge: "Companion Spirit Pet",
        title: p.name,
        color: "#38bdf8",
        sheet: p.sheet,
        rowStart: p.rowStart,
        rowCount: p.rowCount,
        stats: [`+${p.atk} ATK`, `+${p.crit}% Crit`, `+${p.shield} Shield`],
        desc: p.desc,
        actionLabel: `🐾 Equip ${p.name}`,
        actionFn: () => {
          window.GameState.activePet = p.id;
          window.StoryEngine.recalcHeroStats(true);
          window.AppUI.refreshVitals();
          window.SaveManager.saveToLocal();
          this.openPetsAndMountsModal();
        }
      });
    } else {
      const m = (cfg.MOUNTS || []).find(x => x.id === id);
      if (!m) return;
      this.openAnimZoomModal({
        badge: "Rideable Mount",
        title: m.name,
        color: "#4ade80",
        sheet: m.sheet || "KAI_ACT_03",
        rowStart: m.rowStart,
        rowCount: m.rowCount,
        stats: [m.hp ? `+${m.hp} HP` : "", m.shield ? `+${m.shield} Shield` : "", `+${m.crit}% Crit`, m.dr ? `+${m.dr}% DR` : ""].filter(Boolean),
        desc: m.bonus,
        actionLabel: `🐎 Ride ${m.name}`,
        actionFn: () => {
          window.GameState.activeMount = m.id;
          window.StoryEngine.recalcHeroStats(true);
          window.AppUI.refreshVitals();
          window.SaveManager.saveToLocal();
          this.openPetsAndMountsModal();
        }
      });
    }
  },

  openMagicModal() {
    const st = window.GameState;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "✨ 12 Pythonic Magic Schools (Click 🔍 Thumbnail to Enlarge)";
    body.innerHTML = `<div class="grid-cards">${window.CAPYBARA_CONFIG.MAGIC_SCHOOLS.map(s => `
      <div class="sub-card card-with-preview ${st.activeSchool === s.id ? "active" : ""}" onclick="window.DrawerUI.selectSchool('${s.id}')">
        ${this.previewTag(s.kaiSheet, { size: 58, zoomFn: `window.DrawerUI.openMagicZoom('${s.id}')` })}
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
    const st = window.GameState;
    st.activeSchool = id;
    if (!st.spellChain) st.spellChain = { trigger: "always", modifier: "amp", payload: id };
    else st.spellChain.payload = id;
    window.VfxRenderer.triggerSchoolCast(id);
    window.AppUI.closeModal();
    window.AppUI.log(`🔮 Switched Magic School &amp; Spell-Chain Payload to <strong>${id}</strong>!`, "magic");
    if (window.TutorialDirector) window.TutorialDirector.notify("magic_switched", { school: id });
    window.SaveManager.saveToLocal();
  },

  openGearModal() {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "⚔️ Weapons & 4-Tier Armor Paper-Doll (MOD_B08_04 / CG_B01_02)";
    body.innerHTML = `
      <h4 style="margin:0 0 8px;color:#fde68a">Equipped Weapon (Live Combat Animation)</h4>
      <div class="grid-cards" style="margin-bottom:14px">${Object.values(cfg.WEAPONS_DB || {}).map(w => {
        const owned = st.sandboxMode || (st.ownedWeapons || ["ironsword"]).includes(w.id) || (w.unlockCh || 1) <= (st.maxUnlockedChapter || st.chapter);
        return `
        <div class="sub-card card-with-preview ${st.activeWeapon === w.id ? "active" : ""} ${owned ? "" : "locked"}" onclick="window.DrawerUI.equipWeapon('${w.id}')">
          ${this.previewTag(w.sheet, { size: 56 })}
          <div class="card-meta">
            <div style="font-weight:800;color:#38bdf8">${w.name} ${owned ? "" : "🔒 Ch." + (w.unlockCh || 1)}</div>
            <div style="font-size:11px;color:#4ade80;margin-top:2px">+${w.atk} ATK • +${w.crit}% Crit • +${w.combo}% Combo</div>
            <div style="font-size:11px;color:#cbd5e1;margin-top:3px">${w.desc}</div>
          </div>
        </div>`;
      }).join("")}</div>
      <h4 style="margin:0 0 8px;color:#4ade80">4-Tier Armor Paper-Doll Progression (MOD_B08_04 &amp; CG_B01_02)</h4>
      <div class="grid-cards">${Object.values(cfg.ARMORS_DB || {}).map(a => {
        const owned = st.sandboxMode || (st.ownedArmors || ["hoodie", "moss_cloak"]).includes(a.id) || (a.unlockCh || 1) <= (st.maxUnlockedChapter || st.chapter);
        return `
        <div class="sub-card card-with-preview ${st.activeArmor === a.id ? "active" : ""} ${owned ? "" : "locked"}" onclick="window.DrawerUI.equipArmor('${a.id}')">
          <div style="display:flex;flex-direction:column;gap:4px">
            ${this.previewTag("CG_B01_02", { size: 52, row: a.armorRow })}
          </div>
          <div class="card-meta">
            <div style="font-weight:800;color:${a.auraColor || '#fde68a'}">${a.name} ${owned ? "" : "🔒 Ch." + (a.unlockCh || 1) + " / Chest"}</div>
            <div style="font-size:11px;color:#cbd5e1;margin-top:4px">+${a.hp} HP • +${a.shield} Hollow Shield • +${a.dr}% DR</div>
            <div style="font-size:10px;color:#94a3b8;margin-top:3px">Paper-Doll Aura Active on HUD &amp; Stage</div>
          </div>
        </div>`;
      }).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
    this.attachPreviews();
  },

  equipWeapon(id) {
    const st = window.GameState;
    const w = (window.CAPYBARA_CONFIG.WEAPONS_DB || {})[id];
    const owned = st.sandboxMode || (st.ownedWeapons || ["ironsword"]).includes(id) || (w && (w.unlockCh || 1) <= (st.maxUnlockedChapter || st.chapter));
    if (!owned) {
      window.AppUI.log(`🔒 <strong>${w ? w.name : id}</strong> unlocks at Chapter ${w ? w.unlockCh : "?"} (or toggle 🧪 Sandbox).`, "boss");
      return;
    }
    st.activeWeapon = id;
    window.StoryEngine.recalcHeroStats(true);
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    this.openGearModal();
  },

  equipArmor(id) {
    const st = window.GameState;
    const a = (window.CAPYBARA_CONFIG.ARMORS_DB || {})[id];
    const owned = st.sandboxMode || (st.ownedArmors || ["hoodie", "moss_cloak"]).includes(id) || (a && (a.unlockCh || 1) <= (st.maxUnlockedChapter || st.chapter));
    if (!owned) {
      window.AppUI.log(`🔒 <strong>${a ? a.name : id}</strong> unlocks at Chapter ${a ? a.unlockCh : "?"} or Mythic Chest (or toggle 🧪 Sandbox).`, "boss");
      return;
    }
    st.activeArmor = id;
    window.StoryEngine.recalcHeroStats(true);
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    this.openGearModal();
  },

  formatNodeStats(nd) {
    const pills = [];
    if (nd.atk) pills.push(`+${nd.atk} ATK`);
    if (nd.hp) pills.push(`+${nd.hp} HP`);
    if (nd.shield) pills.push(`+${nd.shield} Shield`);
    if (nd.crit) pills.push(`+${nd.crit}% Crit`);
    if (nd.combo) pills.push(`+${nd.combo}% Combo`);
    if (nd.skillDmg) pills.push(`+${nd.skillDmg}% Spell DMG`);
    if (nd.dr) pills.push(`+${nd.dr}% DR`);
    if (nd.counter) pills.push(`+${nd.counter}% Counter`);
    return pills;
  },

  openSkillTreeModal() {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    const body = document.getElementById("modal-body");
    const unlocked = st.unlockedNodes || [];
    const totals = { atk: 0, hp: 0, shield: 0, crit: 0, combo: 0, skillDmg: 0, dr: 0, counter: 0 };
    (cfg.SKILL_TREES_DB || []).forEach(br => br.nodes.forEach(nd => {
      if (unlocked.includes(nd.id)) {
        totals.atk += nd.atk || 0; totals.hp += nd.hp || 0; totals.shield += nd.shield || 0;
        totals.crit += nd.crit || 0; totals.combo += nd.combo || 0; totals.skillDmg += nd.skillDmg || 0;
        totals.dr += nd.dr || 0; totals.counter += nd.counter || 0;
      }
    }));
    const totalPills = this.formatNodeStats(totals);
    const branchColors = { starlight: "#facc15", forge: "#fb923c", chrono: "#38bdf8", lotus: "#f472b6" };

    document.getElementById("modal-title").textContent = `🌳 Pythonic Skill Trees (✨ ${st.skillSparks} Sparks Available)`;
    const drafted = (st.draftedSkills || []).map(id => (cfg.ROGUELITE_SKILLS_DB || []).find(s => s.id === id)).filter(Boolean);
    body.innerHTML = `
      <div class="skill-tree-summary">
        <div class="skill-summary-top">
          <span><strong>Active Tree Bonuses (${unlocked.length}/16 Nodes):</strong> ${totalPills.length ? totalPills.map(p => `<span class="stat-pill">${p}</span>`).join("") : '<span style="color:#94a3b8">None yet</span>'}</span>
          <span class="spark-pill">✨ ${st.skillSparks} Sparks</span>
        </div>
        <div class="skill-summary-help">How it works: Unlock branches top-to-bottom (<strong>Tier 1 ➔ Tier 4</strong>). Click your highest unlocked node in a branch to refund Sparks!</div>
      </div>
      ${drafted.length ? `<div style="margin-bottom:10px;padding:8px 10px;background:#1e293b;border-radius:8px;border:1px solid #f59e0b;font-size:12px">
        <strong style="color:#fde68a">🃏 Drafted Roguelite Perks (${drafted.length}):</strong> ${drafted.map(d => `<span class="perk-pill">${d.name}</span>`).join(" ")}
      </div>` : ""}
      <div class="skill-tree-grid">${(cfg.SKILL_TREES_DB || []).map(br => {
        const bColor = branchColors[br.id] || "#fde68a";
        return `
        <div class="tree-branch" style="--branch-color:${bColor}">
          <div class="tree-branch-header" style="color:${bColor}">${br.title}</div>
          <div class="tree-nodes-col">
            ${br.nodes.map((nd, idx) => {
              const active = unlocked.includes(nd.id);
              const prevNode = idx > 0 ? br.nodes[idx - 1] : null;
              const nextNode = br.nodes[idx + 1] || null;
              const prevUnlocked = !prevNode || unlocked.includes(prevNode.id);
              const nextUnlocked = !!(nextNode && unlocked.includes(nextNode.id));
              const canUnlock = !active && (st.sandboxMode || prevUnlocked) && st.skillSparks >= nd.cost;
              const canRefund = active && (st.sandboxMode || !nextUnlocked);
              const lockedByPrev = !active && !st.sandboxMode && !prevUnlocked;
              const stateCls = active ? "state-active" : (lockedByPrev ? "state-locked" : (canUnlock ? "state-available" : "state-unaffordable"));
              const statusTxt = active ? "✅ ACTIVE" : (lockedByPrev ? `🔒 ${nd.cost}✨` : (canUnlock ? `✨ UNLOCK · ${nd.cost}✨` : `⚠️ ${nd.cost}✨`));
              const hintTxt = active
                ? (canRefund ? `Click to refund (+${nd.cost}✨)` : `Refund ${nextNode.name} first`)
                : (lockedByPrev ? `Requires ${prevNode.name}` : (canUnlock ? "Click to unlock" : `Need ${nd.cost} Sparks`));
              const statPills = this.formatNodeStats(nd).map(p => `<span class="stat-pill">${p}</span>`).join("");
              const connCls = active ? "active" : (prevUnlocked ? "available" : "locked");
              return `${idx > 0 ? `<div class="tree-connector ${connCls}">↓</div>` : ""}
              <div class="tree-node ${stateCls}" onclick="window.DrawerUI.toggleSkillNode('${nd.id}')">
                <div class="tree-node-top">
                  <span class="tier-tag">T${idx + 1}</span>
                  <span class="tree-node-status">${statusTxt}</span>
                </div>
                <div class="tree-node-main">
                  ${this.previewTag(nd.sheet || "KAI_MAG_05", { size: 42, zoomFn: `window.DrawerUI.openSkillNodeZoom('${nd.id}')` })}
                  <div class="tree-node-info">
                    <div class="tree-node-name">${nd.name}</div>
                    <div class="stat-pills-row">${statPills}</div>
                  </div>
                </div>
                <div class="tree-node-code"><code>${nd.py}</code></div>
                <div class="tree-node-hint">${hintTxt} · 🔍 icon to enlarge</div>
              </div>`;
            }).join("")}
          </div>
        </div>`;
      }).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
    this.attachPreviews();
  },

  toggleSkillNode(nodeId) {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    let nodeObj = null, branchObj = null, nodeIdx = -1;
    (cfg.SKILL_TREES_DB || []).forEach(b => b.nodes.forEach((n, idx) => {
      if (n.id === nodeId) { nodeObj = n; branchObj = b; nodeIdx = idx; }
    }));
    if (!nodeObj || !branchObj) return;
    if (!st.unlockedNodes) st.unlockedNodes = [];
    let didUnlock = false;
    if (st.unlockedNodes.includes(nodeId)) {
      const nextNode = branchObj.nodes[nodeIdx + 1];
      if (!st.sandboxMode && nextNode && st.unlockedNodes.includes(nextNode.id)) {
        window.AppUI.log(`🔒 Refund <strong>${nextNode.name}</strong> first before removing ${nodeObj.name}.`, "boss");
        return;
      }
      st.unlockedNodes = st.unlockedNodes.filter(id => id !== nodeId);
      st.skillSparks += nodeObj.cost;
    } else {
      const prevNode = nodeIdx > 0 ? branchObj.nodes[nodeIdx - 1] : null;
      if (!st.sandboxMode && prevNode && !st.unlockedNodes.includes(prevNode.id)) {
        window.AppUI.log(`🔒 Unlock <strong>${prevNode.name}</strong> first in the ${branchObj.title} branch!`, "boss");
        return;
      }
      if (st.skillSparks >= nodeObj.cost) {
        st.unlockedNodes.push(nodeId);
        st.skillSparks -= nodeObj.cost;
        didUnlock = true;
      }
    }
    window.StoryEngine.recalcHeroStats(true);
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    if (didUnlock && window.TutorialDirector) window.TutorialDirector.notify("skill_unlocked", { nodeId });
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
    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_15", 1600);
    window.VfxRenderer.triggerProp("VFX_MISC_31", "MYTHIC CHEST!");
    const tiers = ["hoodie", "moss_cloak", "dwarven_plate", "lotus_paladin"];
    const curIdx = tiers.indexOf(st.activeArmor);
    let msg = "";
    if (curIdx >= 0 && curIdx < tiers.length - 1 && Math.random() < 0.45) {
      st.activeArmor = tiers[curIdx + 1];
      if (!st.ownedArmors) st.ownedArmors = ["hoodie", "moss_cloak"];
      if (!st.ownedArmors.includes(st.activeArmor)) st.ownedArmors.push(st.activeArmor);
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
    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_14", 1600);
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
    if (!st.sandboxMode && (st.slotSpinsThisChapter || 0) >= 3) {
      const banner = document.getElementById("gacha-result-banner");
      if (banner) banner.innerHTML = "⏳ Lucky Slots limit reached (3/3 spins this chapter). Advance to next chapter to spin again!";
      return;
    }
    if (st.gold < 45) {
      const banner = document.getElementById("gacha-result-banner");
      if (banner) banner.innerHTML = "❌ Not enough Gold (need 45G).";
      return;
    }
    st.gold -= 45;
    st.slotSpinsThisChapter = (st.slotSpinsThisChapter || 0) + 1;
    window.VfxRenderer.triggerProp("VFX_MISC_33", "777 SLOTS!");
    const reels = ["print()", "def:", "True", "777"];
    const r = [0, 1, 2].map(() => reels[Math.floor(Math.random() * reels.length)]);
    let msg = `🎰 Reels (${st.slotSpinsThisChapter}/3): [<strong>${r.join(" | ")}</strong>] — `;
    if (r[0] === r[1] && r[1] === r[2]) {
      st.gold += 140; st.gems = (st.gems || 0) + 5; st.hero.rage = 100;
      msg += "🌟 <strong>TRIPLE JACKPOT!</strong> +140 Gold, +5 Gems &amp; 100% Rage!";
    } else if (r[0] === r[1] || r[1] === r[2] || r[0] === r[2]) {
      st.gold += 45; st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + 120);
      msg += "✨ <strong>DOUBLE MATCH!</strong> +45 Gold Refund &amp; +120 HP!";
    } else {
      st.gold += 10; st.gems = (st.gems || 0) + 1;
      msg += "+10 Gold &amp; +1 Star Gem!";
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

    if (this._forgeTab === "chain" && window.SpellChainVM) {
      const ch = st.spellChain || { trigger: "always", modifier: "amp", payload: st.activeSchool || "starlight" };
      const trigs = window.SpellChainVM.TRIGGERS;
      const mods = window.SpellChainVM.MODIFIERS;
      const schools = cfg.MAGIC_SCHOOLS || [];
      body.innerHTML = `
        <div class="filter-pills">
          <button class="filter-pill" onclick="window.DrawerUI.switchForgeTab('ide')">💻 Live Spell-Forge IDE</button>
          <button class="filter-pill active" onclick="window.DrawerUI.switchForgeTab('chain')">⚡ 3-Slot Spell-Chain</button>
          <button class="filter-pill" onclick="window.DrawerUI.switchForgeTab('codex')">📜 Jing Si Wisdom Codex (${(st.collectedScrolls || [1]).length}/12)</button>
        </div>
        <div class="code-forge-ide">
          <div style="font-weight:800;color:#fde68a;font-size:13px">Assemble Your Live 3-Slot Python Combat Pipeline:</div>
          <pre class="forge-code-block">${(trigs.find(t=>t.id===ch.trigger)||trigs[0]).label}
    ${(mods.find(m=>m.id===ch.modifier)||mods[0]).label}
    cast("${ch.payload}")</pre>
          <div style="font-size:11px;color:#38bdf8;font-weight:700">1. Trigger Condition</div>
          <div class="forge-tokens-row">${trigs.map(t => `<button class="choice-chip ${ch.trigger===t.id?'active':''}" onclick="window.DrawerUI.setSpellChainSlot('trigger','${t.id}')">${t.label}</button>`).join("")}</div>
          <div style="font-size:11px;color:#4ade80;font-weight:700">2. Pythonic Modifier</div>
          <div class="forge-tokens-row">${mods.map(m => `<button class="choice-chip ${ch.modifier===m.id?'active':''}" onclick="window.DrawerUI.setSpellChainSlot('modifier','${m.id}')">${m.label}</button>`).join("")}</div>
          <div style="font-size:11px;color:#f472b6;font-weight:700">3. Magic School Payload</div>
          <div class="forge-tokens-row">${schools.map(s => `<button class="choice-chip ${ch.payload===s.id?'active':''}" onclick="window.DrawerUI.setSpellChainSlot('payload','${s.id}')">${s.name}</button>`).join("")}</div>
        </div>`;
      document.getElementById("modal-backdrop").classList.remove("hidden");
      return;
    }
    if (this._forgeTab === "codex") {
      const scrolls = cfg.JING_SI_SCROLLS_DB || [];
      const unlocked = st.collectedScrolls || [1];
      body.innerHTML = `
        <div class="filter-pills">
          <button class="filter-pill" onclick="window.DrawerUI.switchForgeTab('ide')">💻 Live Spell-Forge IDE</button>
          <button class="filter-pill" onclick="window.DrawerUI.switchForgeTab('chain')">⚡ 3-Slot Spell-Chain</button>
          <button class="filter-pill active" onclick="window.DrawerUI.switchForgeTab('codex')">📜 Jing Si Wisdom Codex (${unlocked.length}/12)</button>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-size:12px;color:#cbd5e1;flex-wrap:wrap;gap:8px">
          <span>Mastered: <strong>${(st.masteredConcepts || []).length}/12 Python Concepts</strong> · Scrolls: <strong>${unlocked.length}/12</strong></span>
          <div style="display:flex;gap:6px">
            <button class="btn-tool" onclick="window.DrawerUI.meditateScroll()">🌸 Meditate (+15% HP &amp; Cleanse)</button>
            <button class="btn-tool" onclick="window.DrawerUI.copyPassportExport()">📋 Copy Mastery JSON</button>
          </div>
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
        <button class="filter-pill" onclick="window.DrawerUI.switchForgeTab('chain')">⚡ 3-Slot Spell-Chain</button>
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

  setSpellChainSlot(slot, val) {
    const st = window.GameState;
    if (!st.spellChain) st.spellChain = { trigger: "always", modifier: "amp", payload: st.activeSchool || "starlight" };
    st.spellChain[slot] = val;
    if (slot === "payload") st.activeSchool = val;
    if (window.TutorialDirector) window.TutorialDirector.notify("chain_edited", { slot, val });
    window.SaveManager.saveToLocal();
    this.openCodeForgeModal(this._activeGate);
  },

  openBossHackModal() {
    const st = window.GameState;
    if (!st.inCombat || !st.enemy || !st.enemy.isBoss || !window.BossHackEngine) return;
    const sc = window.BossHackEngine.getBossScript(st.chapter);
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = `⚡ Hack ${st.enemy.name}'s Python AI`;
    body.innerHTML = `
      <div class="code-forge-ide">
        <div style="font-size:12px;color:#fde68a">${sc.prompt}</div>
        <div style="font-size:11px;color:#38bdf8">${sc.effectDesc}</div>
        <pre class="forge-code-block">${sc.code}</pre>
        <div class="forge-input-row">
          <input id="boss-hack-input" type="text" placeholder="Type Python fix (e.g. ${sc.answer})..." />
          <button class="btn-primary" onclick="window.DrawerUI.submitBossHack()">⚡ INJECT FIX</button>
        </div>
        <div class="forge-tokens-row">
          ${sc.options.map(o => `<button class="choice-chip" onclick="document.getElementById('boss-hack-input').value='${o}'">${o}</button>`).join("")}
        </div>
        <div id="boss-hack-output" class="forge-output">Inject the exact keyword to disable Boss shields and stun for 1 turn!</div>
      </div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  },

  submitBossHack() {
    const inp = document.getElementById("boss-hack-input");
    const out = document.getElementById("boss-hack-output");
    if (!inp || !out || !window.BossHackEngine) return;
    const res = window.BossHackEngine.applyHack(inp.value);
    out.style.borderColor = res.ok ? "#22c55e" : "#ef4444";
    out.textContent = res.msg;
    if (res.ok) {
      if (window.TutorialDirector) window.TutorialDirector.notify("boss_hacked");
      setTimeout(() => window.AppUI.closeModal(), 650);
    }
  },

  nextForgeChallenge() {
    this._selectedChallengeIdx = (this._selectedChallengeIdx + 1) % (this._forgeChallenges ? this._forgeChallenges.length : 1);
    this.openCodeForgeModal(null);
  },

  copyPassportExport() {
    if (!window.MasteryPassport) return;
    const json = window.MasteryPassport.exportPassportJson();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).catch(() => {});
    }
    window.AppUI.log(`📜 <strong>Mastery Passport Exported (copied if permitted):</strong> <code>${json.replace(/</g, "&lt;")}</code>`, "python");
  },

  meditateScroll() {
    const st = window.GameState;
    if (!st.sandboxMode && st.meditatedThisChapter) {
      window.AppUI.log("🌸 You have already meditated this chapter. Advance to the next chapter to meditate again!", "event");
      return;
    }
    st.meditatedThisChapter = true;
    const heal = Math.round(st.hero.maxHp * 0.15);
    st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + heal);
    st.heroStatus = "none";
    window.VfxRenderer.triggerLotusPurification();
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    window.AppUI.log(`🌸 Meditated on Jing Si Wisdom (1/1 this chapter): +${heal} HP &amp; Status Cleansed!`, "event");
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

    const normAnswer = String(gate.answer || "").replace(/\s+/g, " ").trim();
    if (normVal === normAnswer || normVal === expectedLine) {
      if (!Array.isArray(st.solvedChallengeIds)) st.solvedChallengeIds = [];
      const challengeKey = `${gate.ch || st.chapter}_${gate.day || 0}_${normAnswer}`;
      const isFirstClear = !st.solvedChallengeIds.includes(challengeKey);
      if (isFirstClear) {
        st.solvedChallengeIds.push(challengeKey);
        st.gold += 80;
        st.skillSparks += 2;
        st.hero.rage = Math.min(100, st.hero.rage + 25);
        st.overclockDays = 5;
      } else {
        st.xp += 10;
      }
      if (!st.collectedScrolls) st.collectedScrolls = [1];
      if (!st.collectedScrolls.includes(gate.ch || st.chapter)) st.collectedScrolls.push(gate.ch || st.chapter);
      window.StoryEngine.recalcHeroStats(true);
      if (window.AudioSFX) window.AudioSFX.play("compile");
      if (window.MasteryPassport) window.MasteryPassport.recordChapterMastery(gate.ch || st.chapter);
      window.VfxRenderer.triggerCodeTrace(gate.lessonRing || "EXP_LINK_41");

      const scroll = (cfg.JING_SI_SCROLLS_DB || []).find(s => s.ch === (gate.ch || st.chapter)) || (cfg.JING_SI_SCROLLS_DB || [])[0];
      out.style.borderColor = "#22c55e";
      out.innerHTML = isFirstClear
        ? `✅ <strong>SPELL COMPILED &amp; TRACED!</strong> <code>${gate.answer}</code> verified!<br>⚡ Activated <strong>5-Day Python Overclock</strong> (+35% Spell DMG, +15% Crit), +80 Gold, +2 Sparks!<br>${scroll ? `📜 <em>"${scroll.zh}" — ${scroll.en}</em>` : ""}`
        : `✅ <strong>PRACTICE TRACE VERIFIED!</strong> <code>${gate.answer}</code> compiled (+10 Practice XP — 1st-clear Gold &amp; Sparks already claimed).`;

      if (this._activeGate) {
        const solvedGate = this._activeGate;
        this._activeGate = null;
        st._pendingPythonGate = null;
        if (isFirstClear) {
          if (solvedGate.ch === 1) st.bonusAtk = (st.bonusAtk || 0) + 12;
          else if (solvedGate.ch === 2) st.bonusMaxHp = (st.bonusMaxHp || 0) + 120;
          else if (solvedGate.ch === 3) { st.bonusCrit = (st.bonusCrit || 0) + 8; st.gold += 100; }
          else if (solvedGate.ch === 6) { st.bonusShield = (st.bonusShield || 0) + 150; st.gems = (st.gems || 0) + 10; }
          else if (solvedGate.ch === 10) { st.bonusMaxHp = (st.bonusMaxHp || 0) + 200; st.hero.rage = Math.min(100, st.hero.rage + 50); }
          else if (solvedGate.ch === 11) { st.bonusSkillDmg = (st.bonusSkillDmg || 0) + 30; st.gold += 50; }
          window.StoryEngine.recalcHeroStats(true);
        }
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
      if (window.TutorialDirector) window.TutorialDirector.notify("forge_compiled");
      window.AppUI.refreshVitals();
      window.SaveManager.saveToLocal();
      window.AppUI.log(`💻 <strong>Python Spell-Forge Executed!</strong> <code>${gate.answer}</code> → 5-Day Overclock Active!`, "python");
    } else {
      if (window.AudioSFX) window.AudioSFX.play("error");
      window.Sprite16FPSEngine.setHeroAction("KAI_ACT_06", 1200);
      window.VfxRenderer.triggerProp("EXP_LINK_09", "SYNTAX ERROR!");
      out.style.borderColor = "#ef4444";
      out.innerHTML = `❌ <strong>SyntaxError:</strong> '${val || "(empty)"}' didn't match the spell pattern.<br>💡 Hint: ${gate.hint || "Try one of the Quick Tokens above!"}`;
    }
  },

  openWikiImportModal() {
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "📥 Wiki Build & Portable JSON Save/Load";
    body.innerHTML = `
      <p style="margin-top:0;font-size:12px;color:#cbd5e1">Paste a JSON build exported from <strong>PythoniaDB (05_Kai_Wikipedia)</strong> or export/import a full <strong>v5.0 Save JSON</strong>:</p>
      <textarea id="wiki-import-text" rows="5" style="width:100%;background:#0f172a;color:#34d399;border:1px solid #334155;border-radius:8px;padding:8px;font-family:monospace;font-size:12px">{"weapon":"starlight_staff","armor":"lotus_paladin","pet":"string","mount":"turtle_stag","unlockedNodes":["st_1","st_2","lt_1"]}</textarea>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">
        <button class="choice-chip" onclick="window.DrawerUI.applyWikiImport()">✅ Apply Wiki Build</button>
        <button class="choice-chip" onclick="window.DrawerUI.exportFullSaveToBox()">📤 Export Full Save JSON</button>
        <button class="choice-chip" onclick="window.DrawerUI.importFullSaveFromBox()">📥 Import Full Save JSON</button>
      </div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  },

  exportFullSaveToBox() {
    const box = document.getElementById("wiki-import-text");
    if (!box || !window.SaveManager) return;
    const json = window.SaveManager.exportSaveJson();
    box.value = json;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).catch(() => {});
    }
    window.AppUI.log("📤 <strong>Exported full v5.0 Save JSON</strong> into the editor box.", "event");
  },

  importFullSaveFromBox() {
    const box = document.getElementById("wiki-import-text");
    if (!box || !window.SaveManager) return;
    if (window.SaveManager.importSaveJson(box.value)) {
      window.AppUI.closeModal();
      window.AppUI.log("📥 <strong>Imported full v5.0 Save JSON!</strong> Run state restored.", "event");
    } else {
      window.AppUI.log("❌ Invalid Save JSON format (requires valid GameState with hero object).", "boss");
    }
  },

  applyWikiImport() {
    const txt = document.getElementById("wiki-import-text").value;
    try {
      const data = JSON.parse(txt);
      const st = window.GameState;
      if (data.weapon) st.activeWeapon = data.weapon;
      if (data.armor) st.activeArmor = data.armor;
      if (data.pet) {
        st.activePet = data.pet === "str_int" ? "str_dragonet" : (data.pet === "float_bool" ? "float_otter" : data.pet);
      }
      if (data.mount) {
        st.activeMount = data.mount === "mushroom_boar" ? "bouncy_mushroom" : (data.mount === "turtle_stag" ? "crystal_turtle" : data.mount);
      }
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
    body.innerHTML = `<div class="grid-cards">${window.CAPYBARA_CONFIG.CHAPTERS.map(c => {
      const unlocked = st.sandboxMode || c.ch <= (st.maxUnlockedChapter || 1);
      return `
      <div class="sub-card card-with-preview ${st.chapter === c.ch ? "active" : ""} ${unlocked ? "" : "locked"}" onclick="window.DrawerUI.selectChapter(${c.ch})">
        ${this.previewTag(c.d60, { size: 54 })}
        <div class="card-meta">
          <div style="font-weight:800;color:#4ade80">${c.name} ${unlocked ? "" : "🔒"}</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:4px">End-Boss: ${c.d60}</div>
          <div style="font-size:11px;color:#94a3b8">NPC: ${c.npc}</div>
        </div>
      </div>`;
    }).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
    this.attachPreviews();
  },

  selectChapter(ch) {
    const st = window.GameState;
    if (!st.sandboxMode && ch > (st.maxUnlockedChapter || 1)) {
      window.AppUI.log(`🔒 Purify Chapter ${ch - 1}'s Day-60 Boss first to unlock Chapter ${ch} (or toggle 🧪 Sandbox).`, "boss");
      return;
    }
    window.StoryEngine._combatSeqId++;
    if (window.Sprite16FPSEngine) window.Sprite16FPSEngine.activeEffects = [];
    st.chapter = ch; st.day = 1; st.inCombat = false; st.awaitingChoice = false; st.combatPhase = "idle"; st.enemy = null; st.roadsideNpc = null; st.activeStreetPickup = null; st.propCollected = false;
    st.slotSpinsThisChapter = 0; st.meditatedThisChapter = false;
    window.StoryEngine.randomizeStageProps(true);
    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_18", 1500);
    window.AppUI.closeModal();
    window.AppUI.refreshVitals();
    if (window.TutorialDirector) window.TutorialDirector.renderCoachBar();
    window.AppUI.log(`🗺️ Warped to <strong>${window.StoryEngine.getCurrentChapter().name}</strong> (Day 1/60).`, "event");
  },

  openPetsAndMountsModal() {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = `🐾 Companion Pets (Lv.${st.petLevel || 1}) & Rideable Mounts (Click 🔍 to Enlarge)`;
    body.innerHTML = `
      <h4 style="margin:0 0 8px;color:#fde68a">Active Pet Companion (Dedicated Non-Mixed Sprites)</h4>
      <div class="grid-cards" style="margin-bottom:14px">${cfg.SPIRIT_PETS.map(p => `
        <div class="sub-card card-with-preview ${st.activePet === p.id ? "active" : ""}" onclick="window.GameState.activePet='${p.id}';window.StoryEngine.recalcHeroStats(true);window.AppUI.refreshVitals();window.SaveManager.saveToLocal();window.DrawerUI.openPetsAndMountsModal();">
          ${this.previewTag(p.sheet, { size: 56, rowStart: p.rowStart, rowCount: p.rowCount, zoomFn: `window.DrawerUI.openPetOrMountZoom('pet','${p.id}')` })}
          <div class="card-meta">
            <div style="font-weight:800;color:#38bdf8">${p.name}</div>
            <div style="font-size:11px;color:#cbd5e1;margin-top:4px">${p.desc}</div>
          </div>
        </div>`).join("")}</div>
      <h4 style="margin:0 0 8px;color:#4ade80">Active Rideable Mount (Dedicated Non-Mixed Sprites)</h4>
      <div class="grid-cards">${cfg.MOUNTS.map(m => `
        <div class="sub-card card-with-preview ${st.activeMount === m.id ? "active" : ""}" onclick="window.GameState.activeMount='${m.id}';window.StoryEngine.recalcHeroStats(true);window.AppUI.refreshVitals();window.SaveManager.saveToLocal();window.DrawerUI.openPetsAndMountsModal();">
          ${this.previewTag(m.sheet || "KAI_ACT_03", { size: 56, rowStart: m.rowStart, rowCount: m.rowCount, zoomFn: `window.DrawerUI.openPetOrMountZoom('mount','${m.id}')` })}
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

  openDefeatModal(sourceName, masteryGain) {
    const st = window.GameState;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "💀 Hero Kai Fallen — Starlight Revival";
    body.innerHTML = `
      <div class="ko-banner">
        <div style="font-weight:800;color:#fca5a5;font-size:15px">Defeated by ${sourceName} on Ch.${st.chapter} · Day ${st.day}</div>
        <div style="font-size:12px;color:#e2e8f0;margin-top:6px">Your Jing Si Wisdom Scrolls (${(st.collectedScrolls || [1]).length}/12) and unlocked Skill Nodes remain intact. Earned <strong>+${masteryGain} Starlight Mastery Sparks</strong>!</div>
      </div>
      <div style="display:flex;align-items:center;gap:14px">
        ${this.previewTag("KAI_ACT_07", { size: 78 })}
        <div>
          <p style="margin:0 0 10px;font-size:13px;color:#cbd5e1">Rise gracefully after every fall—restart Chapter ${st.chapter} at Day 1 with full HP &amp; Hollow Shield.</p>
          <button class="btn-primary" onclick="window.DrawerUI.reviveAfterDefeat()">🌸 Rise Again (Ch.${st.chapter} Day 1)</button>
        </div>
      </div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
    this.attachPreviews();
  },

  reviveAfterDefeat() {
    const st = window.GameState;
    st.day = 1;
    st.stamina = st.maxStamina || 20;
    st.heroStatus = "none";
    st.inCombat = false;
    st.awaitingChoice = false;
    st.enemy = null;
    window.StoryEngine.recalcHeroStats(false);
    st.hero.hp = st.hero.maxHp;
    st.hero.shield = st.hero.baseShield || 90;
    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_01", 1200);
    window.AppUI.closeModal();
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    window.AppUI.log(`🌸 <strong>Hero Kai Rose Again!</strong> Returned to Ch.${st.chapter} Day 1 with full HP, Stamina &amp; Shield.`, "event");
  },

  openSystemSelfTestModal() {
    if (!window.SystemDiagnostics) return;
    const res = window.SystemDiagnostics.runAll();
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = `🩺 Live System Self-Test (${res.passed}/${res.total} PASSED)`;
    body.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px">
        <span style="font-size:12px;color:${res.passed === res.total ? '#4ade80' : '#fca5a5'};font-weight:800">
          ${res.passed === res.total ? '✅ All runtime modules, facing maps, sync hooks & saves verified!' : '⚠️ Some diagnostic checks require attention.'}
        </span>
        <div style="display:flex;gap:6px">
          <button class="btn-tool" onclick="window.TutorialDirector && window.TutorialDirector.restartTutorial()">🔄 Replay Ch. 1 Tutorial</button>
          <button class="btn-primary" onclick="window.DrawerUI.openSystemSelfTestModal()">🩺 Re-Run Checks</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${res.checks.map(c => `
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:#1e293b;border:1px solid ${c.ok ? '#22c55e' : '#ef4444'}">
            <div>
              <div style="font-size:12px;font-weight:800;color:#f8fafc">${c.name}</div>
              <div style="font-size:11px;color:#94a3b8;margin-top:2px">${c.detail}</div>
            </div>
            <span style="font-size:11px;font-weight:900;color:${c.ok ? '#4ade80' : '#fca5a5'};white-space:nowrap">${c.ok ? '✅ PASS' : '❌ FAIL'}</span>
          </div>`).join("")}
      </div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  },

  openAtlasManifestModal() {
    const cfg = window.CAPYBARA_CONFIG;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "📦 226 Production Assets Manifest (v5.2.0)";
    const charKeys = Object.keys(cfg.CHARACTER_SHEETS_16F || {});
    const vfxKeys = Object.keys(cfg.VFX_MISC_SHEETS_16F || {});
    const enmKeys = Object.keys(cfg.ENM_BOSS_SHEETS_16F || {});
    const expKeys = Object.keys(cfg.EXP_LINK_SHEETS_16F || {});
    const biomeKeys = Object.keys(cfg.BIOME_BACKDROPS_16x9 || {});
    const statusKeys = Object.keys(cfg.STATUS_SHEETS_V4_2 || {});
    body.innerHTML = `
      <p style="margin-top:0;color:#cbd5e1;font-size:13px">Wired into Modular Build v5.2.0: <strong>${charKeys.length}</strong> Character + <strong>${vfxKeys.length}</strong> VFX-MISC + <strong>${enmKeys.length}</strong> ENM-BOSS + <strong>${expKeys.length}</strong> EXP-LINK + <strong>${statusKeys.length}</strong> Status/Expression Sheets + <strong>${biomeKeys.length}</strong> 16:9 Biomes = <strong>${charKeys.length + vfxKeys.length + enmKeys.length + expKeys.length + statusKeys.length + biomeKeys.length} Loaded Assets</strong>.</p>
      <div style="font-size:12px;color:#38bdf8;margin-bottom:8px"><strong>Biomes (16:9):</strong> ${biomeKeys.join(", ")}</div>
      <div style="font-size:12px;color:#4ade80;margin-bottom:8px"><strong>Characters (${charKeys.length}×16F):</strong> ${charKeys.slice(0, 4).join(", ")} ... ${charKeys.slice(-3).join(", ")}</div>
      <div style="font-size:12px;color:#facc15;margin-bottom:8px"><strong>VFX-MISC (${vfxKeys.length}×16F):</strong> ${vfxKeys.slice(0, 4).join(", ")} ... ${vfxKeys.slice(-2).join(", ")}</div>
      <div style="font-size:12px;color:#fca5a5;margin-bottom:8px"><strong>ENM-BOSS (${enmKeys.length}×16F):</strong> ${enmKeys.slice(0, 4).join(", ")} ... ${enmKeys.slice(-2).join(", ")}</div>
      <div style="font-size:12px;color:#f472b6;margin-bottom:8px"><strong>EXP-LINK (${expKeys.length}×16F):</strong> ${expKeys.slice(0, 4).join(", ")} ... ${expKeys.slice(-2).join(", ")}</div>
      <div style="font-size:12px;color:#c084fc"><strong>STATUS &amp; EXPRESSIONS (${statusKeys.length}×16F):</strong> ${statusKeys.join(", ")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  }
};
