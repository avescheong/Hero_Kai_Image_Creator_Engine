window.DrawerUI = {
  openMagicModal() {
    const st = window.GameState;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "✨ 12 Pythonic Magic Schools (16-FPS Circles & Overlays)";
    body.innerHTML = `<div class="grid-cards">${window.CAPYBARA_CONFIG.MAGIC_SCHOOLS.map(s => `
      <div class="sub-card ${st.activeSchool === s.id ? "active" : ""}" onclick="window.DrawerUI.selectSchool('${s.id}')">
        <div style="font-weight:800;color:${s.color}">${s.name}</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px"><code>${s.py}</code></div>
        <div style="font-size:11px;color:#cbd5e1;margin-top:4px">${s.circle} + ${s.vfx}</div>
      </div>`).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  },

  selectSchool(id) {
    window.GameState.activeSchool = id;
    window.VfxRenderer.triggerSchoolCast(id);
    window.AppUI.closeModal();
    window.AppUI.log(`🔮 Switched Magic School to <strong>${id}</strong>!`, "magic");
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
        <div class="sub-card ${st.activePet === p.id ? "active" : ""}" onclick="window.GameState.activePet='${p.id}';window.DrawerUI.openPetsAndMountsModal();">
          <div style="font-weight:800;color:#38bdf8">${p.name}</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:4px">${p.desc}</div>
        </div>`).join("")}</div>
      <h4 style="margin:0 0 8px;color:#4ade80">Active Rideable Mount</h4>
      <div class="grid-cards">${cfg.MOUNTS.map(m => `
        <div class="sub-card ${st.activeMount === m.id ? "active" : ""}" onclick="window.GameState.activeMount='${m.id}';window.DrawerUI.openPetsAndMountsModal();">
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
    document.getElementById("modal-title").textContent = "📦 162 Production Assets Manifest (v4.0)";
    const charKeys = Object.keys(cfg.CHARACTER_SHEETS_16F);
    const vfxKeys = Object.keys(cfg.VFX_MISC_SHEETS_16F);
    const enmKeys = Object.keys(cfg.ENM_BOSS_SHEETS_16F);
    const biomeKeys = Object.keys(cfg.BIOME_BACKDROPS_16x9);
    body.innerHTML = `
      <p style="margin-top:0;color:#cbd5e1;font-size:13px">Wired into Modular Build v4.0: <strong>${charKeys.length}</strong> Character + <strong>${vfxKeys.length}</strong> VFX-MISC + <strong>${enmKeys.length}</strong> ENM-BOSS/NPC/Pet/Misc 16F Sheets (<strong>2,432 frames</strong>) + <strong>${biomeKeys.length}</strong> 16:9 Biomes = <strong>162 Assets</strong>.</p>
      <div style="font-size:12px;color:#38bdf8;margin-bottom:8px"><strong>Biomes (16:9):</strong> ${biomeKeys.join(", ")}</div>
      <div style="font-size:12px;color:#4ade80;margin-bottom:8px"><strong>Characters (40×16F):</strong> ${charKeys.slice(0, 6).join(", ")} ... ${charKeys.slice(-2).join(", ")}</div>
      <div style="font-size:12px;color:#facc15;margin-bottom:8px"><strong>VFX-MISC (50×16F):</strong> ${vfxKeys.slice(0, 6).join(", ")} ... ${vfxKeys.slice(-2).join(", ")}</div>
      <div style="font-size:12px;color:#fca5a5"><strong>ENM-BOSS/NPC/Pets/Misc (62×16F):</strong> ${enmKeys.slice(0, 6).join(", ")} ... ${enmKeys.slice(-2).join(", ")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  }
};
