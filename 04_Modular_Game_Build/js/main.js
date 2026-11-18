window.AppUI = {
  log(html, cls = "") {
    const box = document.getElementById("log-container");
    const div = document.createElement("div");
    div.className = `log-entry ${cls}`;
    div.innerHTML = html;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  },

  setChoices(list) {
    const bar = document.getElementById("choice-chips-bar");
    bar.innerHTML = "";
    list.forEach(c => {
      const btn = document.createElement("button");
      btn.className = "choice-chip";
      btn.textContent = c.label;
      btn.onclick = c.fn;
      bar.appendChild(btn);
    });
  },

  refreshVitals() {
    const st = window.GameState;
    document.getElementById("hud-day").textContent = `Day ${st.day} / ${st.maxDays}`;
    document.getElementById("hud-gold").textContent = `🪙 ${st.gold} Gold`;
    document.getElementById("hud-stamina").textContent = `🥬 Stamina ${st.stamina}/${st.maxStamina}`;
    document.getElementById("bar-hp").style.width = `${Math.max(0, (st.hero.hp / st.hero.maxHp) * 100)}%`;
    document.getElementById("txt-hp").textContent = `${Math.ceil(st.hero.hp)} / ${st.hero.maxHp}`;
    document.getElementById("bar-shield").style.width = `${Math.min(100, (st.hero.shield / st.hero.maxHp) * 100)}%`;
    document.getElementById("txt-shield").textContent = `${Math.ceil(st.hero.shield)}`;
    document.getElementById("bar-rage").style.width = `${Math.min(100, st.hero.rage)}%`;
    document.getElementById("txt-rage").textContent = `${st.hero.rage} / 100`;
    document.getElementById("txt-lvl").textContent = st.level;
    document.getElementById("bar-xp").style.width = `${Math.min(100, (st.xp / st.xpNext) * 100)}%`;
    document.getElementById("txt-xp").textContent = `${st.xp} / ${st.xpNext} XP`;
    document.getElementById("timeline-fill").style.width = `${Math.max(2, (st.day / st.maxDays) * 100)}%`;
    document.getElementById("btn-next-day").disabled = st.inCombat || st.awaitingChoice;
  },

  closeModal() {
    document.getElementById("modal-backdrop").classList.add("hidden");
  }
};

(async function bootstrap() {
  const loader = document.getElementById("loader-overlay");
  loader.classList.remove("hidden");
  await window.StageEngine.loadAll((pct) => {
    document.getElementById("loader-bar-fill").style.width = `${pct}%`;
    document.getElementById("loader-pct").textContent = `${pct}%`;
  });
  loader.classList.add("hidden");

  window.SaveManager.loadFromLocal();
  window.AppUI.refreshVitals();
  window.AppUI.log("🌿 Welcome to <strong>Hero Kai: Scrolls of Pythonia — Capybara Go! Edition</strong>. All 15 4x4 PNG sprite atlases are wired onto the Canvas!", "event");

  document.getElementById("btn-next-day").onclick = () => window.StoryEngine.advanceDay();
  document.getElementById("btn-speed").onclick = (e) => {
    const speeds = [1, 2, 3];
    const idx = (speeds.indexOf(window.GameState.speed) + 1) % speeds.length;
    window.GameState.speed = speeds[idx];
    e.target.textContent = `${window.GameState.speed}x`;
  };
  document.getElementById("btn-auto").onclick = (e) => {
    window.GameState.autoPlay = !window.GameState.autoPlay;
    e.target.textContent = `AUTO: ${window.GameState.autoPlay ? "ON" : "OFF"}`;
    e.target.classList.toggle("active", window.GameState.autoPlay);
  };
  document.getElementById("btn-magic").onclick = () => window.DrawerUI.openMagicSelector();
  document.getElementById("btn-gear").onclick = () => window.DrawerUI.openGearAndPets();
  document.getElementById("btn-save").onclick = () => window.DrawerUI.openSaveLoad();
  document.getElementById("modal-close").onclick = () => window.AppUI.closeModal();

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !window.GameState.inCombat && !window.GameState.awaitingChoice) {
      e.preventDefault();
      window.StoryEngine.advanceDay();
    }
  });

  setInterval(() => {
    if (window.GameState.autoPlay && !window.GameState.inCombat && !window.GameState.awaitingChoice) {
      window.StoryEngine.advanceDay();
    }
  }, 900);

  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    window.StageEngine.update(dt);
    window.StageEngine.render(ctx, canvas);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
