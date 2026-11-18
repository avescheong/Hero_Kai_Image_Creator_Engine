window.DrawerUI = {
  openMagicSelector() {
    const st = window.GameState;
    document.getElementById("modal-title").textContent = "✨ Select Active Hero Magic School (12 Schools)";
    const body = document.getElementById("modal-body");
    body.innerHTML = `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
      ${window.CAPYBARA_CONFIG.MAGIC_SCHOOLS.map(m => `
        <button class="btn-tool ${st.hero.activeSchool === m.id ? "active" : ""}" data-school="${m.id}" style="text-align:left;">
          <div style="font-weight:800;color:${m.color}">${m.name}</div>
          <div style="font-size:11px;color:#94a3b8;">Python: <code>${m.py}</code> &bull; Effect: ${m.status}</div>
        </button>
      `).join("")}
    </div>`;
    body.querySelectorAll("button[data-school]").forEach(btn => {
      btn.onclick = () => {
        st.hero.activeSchool = btn.getAttribute("data-school");
        window.AppUI.log(`✨ Switched Rage Magic School to <strong>${st.hero.activeSchool.toUpperCase()}</strong>!`, "magic");
        window.AppUI.closeModal();
      };
    });
    document.getElementById("modal-backdrop").classList.remove("hidden");
  },

  openGearAndPets() {
    const st = window.GameState;
    document.getElementById("modal-title").textContent = "🛡️ 6-Slot Equipment & Pet Formation";
    const body = document.getElementById("modal-body");
    body.innerHTML = `
      <div><strong>6-Slot Loadout</strong><ul style="margin:6px 0;padding-left:18px;font-size:13px;">
        ${Object.entries(st.gear).map(([k, v]) => `<li><b>${k.toUpperCase()}</b>: ${v}</li>`).join("")}
      </ul></div>
      <div><strong>Active Pets (Zero Ember Canon)</strong><ul style="margin:6px 0;padding-left:18px;font-size:13px;">
        ${st.pets.map(p => `<li>${p}</li>`).join("")}
      </ul></div>
      <div><strong>Active Roguelite Skills</strong><div style="font-size:12px;color:#94a3b8;">${st.skills.join(", ")}</div></div>
    `;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  },

  openSaveLoad() {
    document.getElementById("modal-title").textContent = "💾 Save / Load Game State (JSON)";
    const body = document.getElementById("modal-body");
    body.innerHTML = `
      <div style="display:flex;gap:10px;">
        <button id="btn-export-json" class="btn-primary" style="flex:1;">Export Save JSON</button>
        <button id="btn-reset-save" class="btn-tool" style="flex:1;">Reset Day 1</button>
      </div>
    `;
    document.getElementById("btn-export-json").onclick = () => window.SaveManager.exportJson();
    document.getElementById("btn-reset-save").onclick = () => {
      localStorage.removeItem("kai_capybara_go_save_v1");
      location.reload();
    };
    document.getElementById("modal-backdrop").classList.remove("hidden");
  }
};
