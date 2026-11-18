window.PythonTerminal = {
  openGate(gate) {
    window.GameState.awaitingChoice = true;
    window.StageEngine.setRoadsideProp(3, 0);
    const body = document.getElementById("modal-body");
    document.getElementById("modal-title").textContent = `🐍 Python Gate — Day ${gate.day}`;
    body.innerHTML = `
      <p style="margin:0;font-size:14px;">${gate.prompt}</p>
      <div class="code-box">${gate.code}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        ${gate.options.map(opt => `<button class="btn-tool" data-opt="${opt}">${opt}</button>`).join("")}
      </div>
    `;
    body.querySelectorAll("button[data-opt]").forEach(btn => {
      btn.onclick = () => {
        const pick = btn.getAttribute("data-opt");
        if (pick === gate.answer) {
          window.GameState.hero.atk = Math.round(window.GameState.hero.atk * 1.25);
          window.GameState.gold += 100;
          window.AppUI.log(`🐍 <strong>Python Gate Solved!</strong> (${gate.answer}) → ${gate.reward}`, "python");
          window.GameState.awaitingChoice = false;
          window.AppUI.closeModal();
          window.RogueliteDraft.openDraftModal();
        } else {
          btn.style.borderColor = "#ef4444";
          btn.textContent = `${pick} (SyntaxError — Try again!)`;
        }
      };
    });
    document.getElementById("modal-backdrop").classList.remove("hidden");
  }
};
