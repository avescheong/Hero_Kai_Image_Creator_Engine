window.SaveManager = {
  KEY: "kai_capybara_go_v3_save",
  saveToLocal() { try { localStorage.setItem(this.KEY, JSON.stringify(window.GameState)); } catch(e) {} },
  loadFromLocal() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) Object.assign(window.GameState, JSON.parse(raw));
    } catch(e) {}
  }
};

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
    const cfg = window.CAPYBARA_CONFIG;
    const biome = cfg.BIOMES[Math.min(cfg.BIOMES.length - 1, Math.floor((st.day - 1) / 6))];
    document.getElementById("hud-biome").textContent = biome.name;
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
  closeModal() { document.getElementById("modal-backdrop").classList.add("hidden"); }
};

(async function bootstrap() {
  const loader = document.getElementById("loader-overlay");
  loader.classList.remove("hidden");
  await window.Sprite16FPSEngine.loadAll((pct) => {
    document.getElementById("loader-bar-fill").style.width = `${pct}%`;
    document.getElementById("loader-pct").textContent = `${pct}%`;
  });
  loader.classList.add("hidden");

  window.SaveManager.loadFromLocal();
  window.AppUI.refreshVitals();
  window.AppUI.log("🌿 Welcome to <strong>Hero Kai: Scrolls of Pythonia — Modular Build v3.0</strong>! All <strong>90/90 16-FPS sheets (1,440 frames)</strong> & <strong>10 Biome Backdrops</strong> are wired.", "event");

  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(50, now - last); last = now;
    window.Sprite16FPSEngine.renderStage(ctx, canvas.width, canvas.height, dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  document.getElementById("btn-next-day").onclick = () => window.StoryEngine.advanceDay();
  document.getElementById("btn-speed").onclick = (e) => {
    window.GameState.speed = window.GameState.speed === 1 ? 2 : window.GameState.speed === 2 ? 4 : 1;
    e.target.textContent = `⚡ ${window.GameState.speed}x`;
  };
  document.getElementById("btn-magic").onclick = () => window.DrawerUI.openMagicModal();
  document.getElementById("btn-atlas").onclick = () => window.DrawerUI.openAtlasManifestModal();
  document.getElementById("btn-modal-close").onclick = () => window.AppUI.closeModal();
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && document.getElementById("modal-backdrop").classList.contains("hidden")) {
      e.preventDefault();
      window.StoryEngine.advanceDay();
    }
  });
})();
