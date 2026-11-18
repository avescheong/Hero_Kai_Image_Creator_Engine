// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// equipment_and_pets_drawer_v4_1.js (Phase 4: Gear, Skill Trees, 12-School Coefficients, Bestiary & Wiki Build Import)
window.DrawerUI = {
  openMagicModal() {
    const st = window.GameState;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "✨ 12 Pythonic Magic Schools (Exact Coefficients)";
    body.innerHTML = `<div class="grid-cards">${window.CAPYBARA_CONFIG.MAGIC_SCHOOLS.map(s => `
      <div class="sub-card ${st.activeSchool === s.id ? "active" : ""}" onclick="window.DrawerUI.selectSchool('${s.id}')">
        <div style="font-weight:800;color:${s.color}">${s.name}</div>
        <div style="font-size:12px;color:#34d399;margin-top:4px"><code>${s.py}</code></div>
        <div style="font-size:11px;color:#fde68a;margin-top:4px">${s.desc}</div>
      </div>`).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
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
    document.getElementById("modal-title").textContent = "⚔️ Weapons & 4-Tier Armor Loadout";
    body.innerHTML = `
      <h4 style="margin:0 0 8px;color:#fde68a">Equipped Weapon</h4>
      <div class="grid-cards" style="margin-bottom:14px">${Object.values(cfg.WEAPONS_DB || {}).map(w => `
        <div class="sub-card ${st.activeWeapon === w.id ? "active" : ""}" onclick="window.DrawerUI.equipWeapon('${w.id}')">
          <div style="font-weight:800;color:#38bdf8">${w.name}</div>
          <div style="font-size:11px;color:#4ade80;margin-top:2px">+${w.atk} ATK • +${w.crit}% Crit • +${w.combo}% Combo</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:4px">${w.desc}</div>
        </div>`).join("")}</div>
      <h4 style="margin:0 0 8px;color:#4ade80">4-Tier Armor Skin (CG_B01_02)</h4>
      <div class="grid-cards">${Object.values(cfg.ARMORS_DB || {}).map(a => `
        <div class="sub-card ${st.activeArmor === a.id ? "active" : ""}" onclick="window.DrawerUI.equipArmor('${a.id}')">
          <div style="font-weight:800;color:#fde68a">${a.name}</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:4px">+${a.hp} HP • +${a.shield} Hollow Shield • +${a.dr}% DR</div>
        </div>`).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
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
    body.innerHTML = `<div class="grid-cards">${(cfg.SKILL_TREES_DB || []).map(br => `
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
      <div class="sub-card ${st.chapter === c.ch ? "active" : ""}" onclick="window.DrawerUI.selectChapter(${c.ch})">
        <div style="font-weight:800;color:#4ade80">${c.name}</div>
        <div style="font-size:11px;color:#cbd5e1;margin-top:4px">End-Boss: ${c.d60}</div>
        <div style="font-size:11px;color:#94a3b8">NPC: ${c.npc}</div>
      </div>`).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  },

  selectChapter(ch) {
    const st = window.GameState;
    st.chapter = ch; st.day = 1; st.inCombat = false; st.awaitingChoice = false; st.enemy = null; st.roadsideNpc = null;
    window.AppUI.closeModal();
    window.AppUI.refreshVitals();
    window.AppUI.log(`🗺️ Warped to <strong>${window.StoryEngine.getCurrentChapter().name}</strong> (Day 1/60).`, "event");
  },

  openPetsAndMountsModal() {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "🐾 Companion Pets & Rideable Mounts (16-FPS)";
    body.innerHTML = `
      <h4 style="margin:0 0 8px;color:#fde68a">Active Pet Companion</h4>
      <div class="grid-cards" style="margin-bottom:14px">${cfg.SPIRIT_PETS.map(p => `
        <div class="sub-card ${st.activePet === p.id ? "active" : ""}" onclick="window.GameState.activePet='${p.id}';window.StoryEngine.recalcHeroStats(true);window.AppUI.refreshVitals();window.DrawerUI.openPetsAndMountsModal();">
          <div style="font-weight:800;color:#38bdf8">${p.name}</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:4px">${p.desc}</div>
        </div>`).join("")}</div>
      <h4 style="margin:0 0 8px;color:#4ade80">Active Rideable Mount</h4>
      <div class="grid-cards">${cfg.MOUNTS.map(m => `
        <div class="sub-card ${st.activeMount === m.id ? "active" : ""}" onclick="window.GameState.activeMount='${m.id}';window.StoryEngine.recalcHeroStats(true);window.AppUI.refreshVitals();window.DrawerUI.openPetsAndMountsModal();">
          <div style="font-weight:800;color:#4ade80">${m.name}</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:4px">${m.bonus}</div>
        </div>`).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
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
          <div class="sub-card" onclick="window.AppUI.closeModal();window.StoryEngine.triggerSpecialNpc('${n.id}')">
            <div style="font-weight:800;color:#fde68a">${n.name}</div>
            <div style="font-size:11px;color:#94a3b8">${n.id} · ${n.role}</div>
            <div style="font-size:11px;color:#4ade80;margin-top:4px">${n.buff}</div>
          </div>`).join("")
        : entries.map(([id, e]) => `
          <div class="sub-card" onclick="window.AppUI.closeModal();window.StoryEngine.startCombat('${id}', ${e.tier.includes('Boss') || e.tier.includes('Elite')}, 'Bestiary Duel')">
            <div style="font-weight:800;color:${e.tier.includes('End-Boss')?'#fca5a5':'#38bdf8'}">${e.name}</div>
            <div style="font-size:11px;color:#94a3b8">${id} · Ch.${e.ch} · ${e.tier}</div>
            <div style="font-size:11px;color:#fde68a;margin-top:4px">Bug: <code>${e.bug}</code> ${st.defeatedIds.includes(id)?'· 🌸 Purified':''}</div>
          </div>`).join("")
      }</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  },

  openAtlasManifestModal() {
    const cfg = window.CAPYBARA_CONFIG;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "📦 212 Production Assets Manifest (v4.1)";
    const charKeys = Object.keys(cfg.CHARACTER_SHEETS_16F || {});
    const vfxKeys = Object.keys(cfg.VFX_MISC_SHEETS_16F || {});
    const enmKeys = Object.keys(cfg.ENM_BOSS_SHEETS_16F || {});
    const expKeys = Object.keys(cfg.EXP_LINK_SHEETS_16F || {});
    const biomeKeys = Object.keys(cfg.BIOME_BACKDROPS_16x9 || {});
    body.innerHTML = `
      <p style="margin-top:0;color:#cbd5e1;font-size:13px">Wired into Modular Build v4.1: <strong>${charKeys.length}</strong> Character + <strong>${vfxKeys.length}</strong> VFX-MISC + <strong>${enmKeys.length}</strong> ENM-BOSS + <strong>${expKeys.length}</strong> EXP-LINK 16F Sheets (<strong>3,232 frames</strong>) + <strong>${biomeKeys.length}</strong> 16:9 Biomes = <strong>212 Assets</strong>.</p>
      <div style="font-size:12px;color:#38bdf8;margin-bottom:8px"><strong>Biomes (16:9):</strong> ${biomeKeys.join(", ")}</div>
      <div style="font-size:12px;color:#4ade80;margin-bottom:8px"><strong>Characters (40×16F):</strong> ${charKeys.slice(0, 4).join(", ")} ... ${charKeys.slice(-2).join(", ")}</div>
      <div style="font-size:12px;color:#facc15;margin-bottom:8px"><strong>VFX-MISC (50×16F):</strong> ${vfxKeys.slice(0, 4).join(", ")} ... ${vfxKeys.slice(-2).join(", ")}</div>
      <div style="font-size:12px;color:#fca5a5;margin-bottom:8px"><strong>ENM-BOSS (62×16F):</strong> ${enmKeys.slice(0, 4).join(", ")} ... ${enmKeys.slice(-2).join(", ")}</div>
      <div style="font-size:12px;color:#f472b6"><strong>EXP-LINK (50×16F):</strong> ${expKeys.slice(0, 4).join(", ")} ... ${expKeys.slice(-2).join(", ")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  }
};
