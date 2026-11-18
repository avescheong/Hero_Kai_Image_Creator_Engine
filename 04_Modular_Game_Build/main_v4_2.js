// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// main_v4_1.js (Phase 4: Bootstrapper, Sakuga Pacing Toggle, Rhythm Parry & Cure Controls)
window.SaveManager = {
  KEY: "kai_capybara_go_v4_2_save",
  saveToLocal() { try { localStorage.setItem(this.KEY, JSON.stringify(window.GameState)); } catch (e) {} },
  loadFromLocal() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) Object.assign(window.GameState, JSON.parse(raw));
    } catch (e) {}
  }
};

window.AppUI = {
  log(html, cls = "") {
    const box = document.getElementById("log-container");
    if (!box) return;
    const div = document.createElement("div");
    div.className = `log-entry ${cls}`;
    div.innerHTML = html;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  },
  setChoices(list) {
    const bar = document.getElementById("choice-chips-bar");
    if (!bar) return;
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
    const chObj = window.StoryEngine.getCurrentChapter();
    document.getElementById("hud-biome").textContent = chObj.name;
    document.getElementById("hud-day").textContent = `Day ${st.day} / ${st.maxDays}`;
    document.getElementById("hud-gold").textContent = `🪙 ${st.gold} Gold`;
    document.getElementById("hud-stamina").textContent = `🥬 Stamina ${st.stamina}/${st.maxStamina}`;
    document.getElementById("btn-chapter").textContent = `🗺️ Ch. ${st.chapter}`;
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

    const atkEl = document.getElementById("hud-atk-badge");
    if (atkEl) atkEl.textContent = `⚔️ ${st.hero.atk} ATK · 🎯 ${st.hero.crit}% Crit · 🛡️ ${st.hero.dr}% DR`;
    const btnCure = document.getElementById("btn-cure-status");
    if (btnCure) btnCure.classList.toggle("hidden", st.heroStatus === "none");
  },
  closeModal() { document.getElementById("modal-backdrop").classList.add("hidden"); }
};

(async function bootstrap() {
  const loader = document.getElementById("loader-overlay");
  if (loader) loader.classList.remove("hidden");
  await window.Sprite16FPSEngine.loadAll((pct) => {
    const fill = document.getElementById("loader-bar-fill");
    const pctEl = document.getElementById("loader-pct");
    if (fill) fill.style.width = `${pct}%`;
    if (pctEl) pctEl.textContent = `${pct}%`;
  });
  if (loader) loader.classList.add("hidden");

  window.SaveManager.loadFromLocal();
  window.StoryEngine.recalcHeroStats(true);
  window.AppUI.refreshVitals();
  window.AppUI.log("🌿 Welcome to <strong>Hero Kai: Scrolls of Pythonia — Final Modular Build v4.2</strong>! Wired with <strong>202 16-FPS sheets (3,232 frames)</strong>, <strong>EXP_LINK_01–50</strong> Sakuga Z-Sandwich, 4-Branch Skill Trees, Weapons/Armor &amp; 12 Boss Gates!", "event");

  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(50, now - last);
    last = now;
    window.Sprite16FPSEngine.renderStage(ctx, canvas.width, canvas.height, dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  document.getElementById("btn-next-day").onclick = () => window.StoryEngine.advanceDay();
  document.getElementById("btn-pacing").onclick = (e) => {
    const order = ["slow", "sakuga", "turbo"];
    const labels = { slow: "🐢 0.75x Story", sakuga: "⚔️ 1.0x Sakuga", turbo: "⚡ 1.4x Turbo" };
    const nextIdx = (order.indexOf(window.GameState.pacingMode || "sakuga") + 1) % order.length;
    window.GameState.pacingMode = order[nextIdx];
    e.target.textContent = labels[window.GameState.pacingMode];
    window.SaveManager.saveToLocal();
  };
  document.getElementById("btn-chapter").onclick = () => window.DrawerUI.openChapterModal();
  document.getElementById("btn-gear").onclick = () => window.DrawerUI.openGearModal();
  document.getElementById("btn-skill-tree").onclick = () => window.DrawerUI.openSkillTreeModal();
  document.getElementById("btn-magic").onclick = () => window.DrawerUI.openMagicModal();
  document.getElementById("btn-pets").onclick = () => window.DrawerUI.openPetsAndMountsModal();
  document.getElementById("btn-bestiary").onclick = () => window.DrawerUI.openBestiaryModal("all");
  document.getElementById("btn-wiki-import").onclick = () => window.DrawerUI.openWikiImportModal();
  document.getElementById("btn-atlas").onclick = () => window.DrawerUI.openAtlasManifestModal();
  document.getElementById("btn-parry").onclick = () => window.StoryEngine.triggerParry();
  document.getElementById("btn-cure-status").onclick = () => window.StoryEngine.tapCureStatus();
  document.getElementById("btn-modal-close").onclick = () => window.AppUI.closeModal();

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && document.getElementById("modal-backdrop").classList.contains("hidden")) {
      e.preventDefault();
      if (window.GameState.inCombat && window.GameState.parryWindowOpen) {
        window.StoryEngine.triggerParry();
      } else {
        window.StoryEngine.advanceDay();
      }
    }
  });
})();

// v4.2 Clickable Street Pickup Hit-Testing on Stage Canvas
(function bindStreetPickups() {
  const canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  canvas.addEventListener("click", (e) => {
    const st = window.GameState;
    if (!st || st.inCombat) return;
    const rect = canvas.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const cy = ((e.clientY - rect.top) / rect.height) * canvas.height;
    if (cy > canvas.height * 0.55 && cx > canvas.width * 0.35 && cx < canvas.width * 0.85) {
      const pickups = window.GameConfig.STREET_PICKUPS_V4_2 || [];
      if (pickups.length > 0 && Math.random() < 0.45) {
        const p = pickups[Math.floor(Math.random() * pickups.length)];
        st.gold += p.gold;
        st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + p.hp);
        window.VfxRenderer.triggerProp(p.key, `+${p.gold}G`);
        window.AppUI.log(`🎁 Clicked street pickup <strong>${p.label}</strong>! +${p.gold} Gold` + (p.hp ? ` &amp; +${p.hp} HP` : "") + ".", "event");
        window.AppUI.refreshVitals();
        window.SaveManager.saveToLocal();
      }
    }
  });
})();
