window.RogueliteDraft = {
  openDraftModal() {
    const pool = [...window.CAPYBARA_CONFIG.SKILL_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
    document.getElementById("modal-title").textContent = `🌟 Level ${window.GameState.level} — Choose 1 Roguelite Skill`;
    const body = document.getElementById("modal-body");
    body.innerHTML = `<div class="draft-grid">${pool.map(s => `
      <div class="draft-card ${s.rarity}" data-id="${s.id}">
        <span style="font-size:10px;font-weight:800;color:#facc15;">${s.rarity.toUpperCase()}</span>
        <strong style="font-size:14px;">${s.name}</strong>
        <p style="margin:0;font-size:12px;color:#cbd5e1;">${s.desc}</p>
      </div>
    `).join("")}</div>`;
    body.querySelectorAll(".draft-card").forEach(card => {
      card.onclick = () => {
        const sid = card.getAttribute("data-id");
        if (!window.GameState.skills.includes(sid)) window.GameState.skills.push(sid);
        const picked = pool.find(x => x.id === sid);
        window.AppUI.log(`📜 Drafted <strong>${picked.name}</strong> (${picked.rarity})!`, "magic");
        window.AppUI.closeModal();
        window.SaveManager.saveToLocal();
      };
    });
    document.getElementById("modal-backdrop").classList.remove("hidden");
  }
};
