window.DrawerUI = {
  openMagicModal() {
    const st = window.GameState;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "✨ 12 Pythonic Magic Schools (16-FPS Circles & Overlays)";
    body.innerHTML = `<div class="grid-cards">${window.CAPYBARA_CONFIG.MAGIC_SCHOOLS.map(s => `
      <div class="sub-card ${st.activeSchool === s.id ? "active" : ""}" onclick="window.DrawerUI.selectSchool('${s.id}')">
        <div style="font-weight:800;color:${s.color}">${s.name}</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px"><code>${s.py}</code></div>
        <div style="font-size:11px;color:#cbd5e1;margin-top:4px">${s.circle} + ${s.overlay}</div>
      </div>`).join("")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  },
  selectSchool(id) {
    window.GameState.activeSchool = id;
    window.VfxRenderer.triggerSchoolCast(id);
    window.AppUI.closeModal();
    window.AppUI.log(`🔮 Switched Magic School to <strong>${id}</strong>!`, "magic");
  },
  openAtlasManifestModal() {
    const cfg = window.CAPYBARA_CONFIG;
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = "📦 90/90 16-FPS Atlases + 10 Biomes Manifest";
    const charKeys = Object.keys(cfg.CHARACTER_SHEETS_16F);
    const vfxKeys = Object.keys(cfg.VFX_MISC_SHEETS_16F);
    const biomeKeys = Object.keys(cfg.BIOME_BACKDROPS_16x9);
    body.innerHTML = `
      <p style="margin-top:0;color:#cbd5e1;font-size:13px">Wired into Modular Build v3.0: <strong>${charKeys.length}</strong> Character 16F Sheets + <strong>${vfxKeys.length}</strong> VFX-MISC 16F Sheets (<strong>1,440 frames</strong>) + <strong>${biomeKeys.length}</strong> 16:9 Biomes.</p>
      <div style="font-size:12px;color:#38bdf8;margin-bottom:8px"><strong>Biomes (16:9):</strong> ${biomeKeys.join(", ")}</div>
      <div style="font-size:12px;color:#4ade80;margin-bottom:8px"><strong>Characters (40×16F):</strong> ${charKeys.slice(0, 8).join(", ")} ... ${charKeys.slice(-2).join(", ")}</div>
      <div style="font-size:12px;color:#facc15"><strong>VFX-MISC (50×16F):</strong> ${vfxKeys.slice(0, 8).join(", ")} ... ${vfxKeys.slice(-2).join(", ")}</div>`;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  }
};
