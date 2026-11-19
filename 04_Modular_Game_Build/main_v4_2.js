// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// main_v4_2.js (v4.3: State-Sanitized SaveManager, Auto-March, Interactive Stage Hitboxes, Live Spell-Forge & Gacha Hooks)
window.SaveManager = {
  KEY: "kai_capybara_go_v4_4_save",
  saveToLocal() {
    try {
      const st = Object.assign({}, window.GameState, {
        inCombat: false, awaitingChoice: false, parryWindowOpen: false, parriedThisTurn: false,
        enemy: null, roadsideNpc: null, activeActionSheet: null, autoMarch: false
      });
      localStorage.setItem(this.KEY, JSON.stringify(st));
    } catch (e) {}
  },
  loadFromLocal() {
    try {
      const raw = localStorage.getItem(this.KEY) || localStorage.getItem("kai_capybara_go_v4_3_save") || localStorage.getItem("kai_capybara_go_v4_2_save");
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.assign(window.GameState, parsed);
      }
    } catch (e) {}
    const st = window.GameState;
    // Sanitize transient combat/modal locks so reload never deadlocks NEXT DAY
    st.inCombat = false;
    st.awaitingChoice = false;
    st.parryWindowOpen = false;
    st.parriedThisTurn = false;
    st.combatPhase = "idle";
    st.enemy = null;
    st.roadsideNpc = null;
    st.activeActionSheet = null;
    st._pendingPythonGate = null;
    st.autoMarch = false;
    st.autoBattle = !!st.autoBattle && false;
    st.awaitingCommand = false;
    st.heroDefending = false;
    if (st.mendCd === undefined) st.mendCd = 0;
    if (!st.battleItems) st.battleItems = { potion: 2, bao: 2, orange: 1 };
    if (!Array.isArray(st.draftedSkills)) st.draftedSkills = [];
    if (!Array.isArray(st.collectedScrolls)) st.collectedScrolls = [1];
    if (!st.petLevel) st.petLevel = 1;
    if (st.overclockDays === undefined) st.overclockDays = 0;
    if (st.propCollected === undefined) st.propCollected = false;
    if (!st.propPos || typeof st.propPos.rx !== "number") st.propPos = { rx: 0.58, ry: 0.68 };
    if (st.tutorialStep === undefined) st.tutorialStep = 0;
    if (st.tutorialDone === undefined) st.tutorialDone = false;
    if (st.tutorialStageClicked === undefined) st.tutorialStageClicked = false;
    if (!Array.isArray(st.ownedWeapons)) st.ownedWeapons = ["ironsword"];
    if (!Array.isArray(st.ownedArmors)) st.ownedArmors = ["hoodie", "moss_cloak"];
    if (!st.maxUnlockedChapter) st.maxUnlockedChapter = st.chapter || 1;
    if (st.sandboxMode === undefined) st.sandboxMode = false;
    if (!Array.isArray(st.solvedChallengeIds)) st.solvedChallengeIds = [];
    if (st.slotSpinsThisChapter === undefined) st.slotSpinsThisChapter = 0;
    if (st.meditatedThisChapter === undefined) st.meditatedThisChapter = false;
    if (st.stringCd === undefined) st.stringCd = 0;
    if (st.mantisCd === undefined) st.mantisCd = 0;
    if (!st.spellChain) st.spellChain = { trigger: "always", modifier: "amp", payload: st.activeSchool || "starlight" };
    if (!Array.isArray(st.masteredConcepts)) st.masteredConcepts = [];
    // v5.2: Migrate legacy split-sheet pet/mount IDs to dedicated single-creature IDs
    if (st.activePet === "str_int") st.activePet = "str_dragonet";
    else if (st.activePet === "float_bool") st.activePet = "float_otter";
    if (st.activeMount === "mushroom_boar") st.activeMount = "bouncy_mushroom";
    else if (st.activeMount === "turtle_stag") st.activeMount = "crystal_turtle";
  },
  exportSaveJson() {
    this.saveToLocal();
    return JSON.stringify(window.GameState, null, 2);
  },
  importSaveJson(rawStr) {
    try {
      const parsed = JSON.parse(rawStr);
      if (!parsed || typeof parsed !== "object" || !parsed.hero) return false;
      Object.assign(window.GameState, parsed);
      this.saveToLocal();
      this.loadFromLocal();
      window.StoryEngine.recalcHeroStats(true);
      window.AppUI.refreshVitals();
      return true;
    } catch (e) { return false; }
  },
  resetSave() {
    try {
      localStorage.removeItem(this.KEY);
      localStorage.removeItem("kai_capybara_go_v4_3_save");
      localStorage.removeItem("kai_capybara_go_v4_2_save");
    } catch (e) {}
    window.location.reload();
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
    document.getElementById("hud-gold").textContent = `🪙 ${st.gold}G · 💎 ${st.gems || 0}`;
    document.getElementById("hud-stamina").textContent = (st.stamina <= 0) ? `😫 FATIGUED 0/${st.maxStamina}` : `🥬 Stamina ${st.stamina}/${st.maxStamina}`;
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
    const ocBadge = document.getElementById("hud-overclock-badge");
    if (ocBadge) {
      ocBadge.classList.toggle("hidden", !(st.overclockDays > 0));
      ocBadge.textContent = `⚡ Overclock ${st.overclockDays}d`;
    }
    const btnCure = document.getElementById("btn-cure-status");
    if (btnCure) btnCure.classList.toggle("hidden", st.heroStatus === "none");
    const btnParry = document.getElementById("btn-parry");
    if (btnParry) {
      btnParry.classList.toggle("parry-active", !!st.parryWindowOpen);
      btnParry.textContent = st.parryWindowOpen ? "🛡️ PARRY NOW! (Space)" : "🛡️ Parry";
    }
    const btnStr = document.getElementById("btn-tag-string");
    if (btnStr) {
      btnStr.disabled = !st.inCombat || (st.stringCd || 0) > 0;
      btnStr.textContent = (st.stringCd || 0) > 0 ? `🐾 String (${st.stringCd}t)` : "🐾 [Q] String";
    }
    const btnMan = document.getElementById("btn-tag-mantis");
    if (btnMan) {
      btnMan.disabled = !st.inCombat || (st.mantisCd || 0) > 0;
      btnMan.textContent = (st.mantisCd || 0) > 0 ? `🌿 Mantis (${st.mantisCd}t)` : "🌿 [E] Mantis";
    }
    const btnHack = document.getElementById("btn-hack-boss");
    if (btnHack) btnHack.classList.toggle("hidden", !(st.inCombat && st.enemy && st.enemy.isBoss && !st.enemy.hacked));
    const btnSb = document.getElementById("btn-sandbox-mode");
    if (btnSb) {
      btnSb.classList.toggle("sandbox-on", !!st.sandboxMode);
      btnSb.textContent = st.sandboxMode ? "🧪 Sandbox: ON" : "🧪 Sandbox: OFF";
    }
    if (window.FFBattleMenu) {
      window.FFBattleMenu.renderDeck();
    }
    if (window.TutorialDirector && window.TutorialDirector.renderCoachBar) {
      window.TutorialDirector.renderCoachBar();
    }
  },
  closeModal() {
    document.getElementById("modal-backdrop").classList.add("hidden");
    const zoomEl = document.getElementById("anim-zoom-overlay");
    if (zoomEl) zoomEl.classList.add("hidden");
  }
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
  if (!window.GameState.activeStreetPickup && window.GameState.day === 1) {
    window.StoryEngine.randomizeStageProps(true);
  }
  window.StoryEngine.recalcHeroStats(true);
  window.AppUI.refreshVitals();
  if (window.TutorialDirector) window.TutorialDirector.init();
  window.AppUI.log("🌿 Welcome to <strong>Hero Kai: Scrolls of Pythonia — v5.1.0 Sakuga Director</strong>! Click <strong>💻 Spell-Forge IDE</strong> to write &amp; trace live Python spells, or follow the <strong>Ch. 1 Silent Village Guide</strong>!", "event");

  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  function syncCanvasSize() {
    const stage = canvas.parentElement;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const tw = Math.max(640, Math.round(rect.width));
    const th = Math.max(220, Math.round(rect.height));
    if (canvas.width !== tw || canvas.height !== th) {
      canvas.width = tw;
      canvas.height = th;
    }
  }
  syncCanvasSize();
  window.addEventListener("resize", syncCanvasSize);
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(50, now - last);
    last = now;
    window.Sprite16FPSEngine.renderStage(ctx, canvas.width, canvas.height, dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  document.getElementById("btn-next-day").onclick = () => window.StoryEngine.advanceDay();
  document.getElementById("btn-auto").onclick = () => window.StoryEngine.toggleAutoMarch();
  document.getElementById("btn-code-forge").onclick = () => {
    const st = window.GameState;
    const activeGate = (st && st.awaitingChoice && st._pendingPythonGate) ? st._pendingPythonGate : null;
    window.DrawerUI.openCodeForgeModal(activeGate);
  };
  const hackBtn = document.getElementById("btn-hack-boss");
  if (hackBtn) hackBtn.onclick = () => window.DrawerUI.openBossHackModal();
  const audioBtn = document.getElementById("btn-audio-mute");
  if (audioBtn) audioBtn.onclick = () => window.AudioSFX && window.AudioSFX.toggleMute();
  const devBtn = document.getElementById("btn-dev-drawer");
  if (devBtn) devBtn.onclick = () => {
    const grp = document.getElementById("dev-tools-group");
    if (grp) grp.classList.toggle("hidden");
  };
  document.getElementById("btn-gacha").onclick = () => window.DrawerUI.openGachaSanctumModal();
  const sbBtn = document.getElementById("btn-sandbox-mode");
  if (sbBtn) sbBtn.onclick = () => {
    window.GameState.sandboxMode = !window.GameState.sandboxMode;
    window.AppUI.refreshVitals();
    window.SaveManager.saveToLocal();
    window.AppUI.log(window.GameState.sandboxMode ? "🧪 <strong>Teacher Sandbox ON:</strong> All chapters, weapons, armors, and skill nodes unlocked for demo!" : "🔒 <strong>Teacher Sandbox OFF:</strong> Normal roguelite progression enforced.", "event");
  };
  document.getElementById("btn-save-reset").onclick = () => {
    window.SaveManager.saveToLocal();
    if (confirm("Progress saved! Do you want to reset your run back to Day 1?")) {
      window.SaveManager.resetSave();
    }
  };
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
  const selfTestBtn = document.getElementById("btn-self-test");
  if (selfTestBtn) selfTestBtn.onclick = () => window.DrawerUI.openSystemSelfTestModal();
  document.getElementById("btn-parry").onclick = () => window.StoryEngine.triggerParry();
  const strBtn = document.getElementById("btn-tag-string");
  if (strBtn) strBtn.onclick = () => window.StoryEngine.triggerCompanionTagIn("string");
  const manBtn = document.getElementById("btn-tag-mantis");
  if (manBtn) manBtn.onclick = () => window.StoryEngine.triggerCompanionTagIn("mantis");
  document.getElementById("btn-cure-status").onclick = () => window.StoryEngine.tapCureStatus();
  document.getElementById("btn-modal-close").onclick = () => window.AppUI.closeModal();
  const modalBackdrop = document.getElementById("modal-backdrop");
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) window.AppUI.closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      const zoomEl = document.getElementById("anim-zoom-overlay");
      if (zoomEl && !zoomEl.classList.contains("hidden")) {
        if (window.DrawerUI) window.DrawerUI.closeAnimZoomModal();
        return;
      }
      if (modalBackdrop && !modalBackdrop.classList.contains("hidden")) {
        window.AppUI.closeModal();
        return;
      }
    }
    if (!document.getElementById("modal-backdrop").classList.contains("hidden")) return;
    if (window.GameState.inCombat && window.GameState.awaitingCommand && window.FFBattleMenu) {
      if (window.FFBattleMenu.handleHotkey(e.code)) {
        e.preventDefault();
        return;
      }
    }
    if (e.code === "Space") {
      e.preventDefault();
      if (window.GameState.inCombat && window.GameState.parryWindowOpen) {
        window.StoryEngine.triggerParry();
      } else {
        window.StoryEngine.advanceDay();
      }
    } else if (e.code === "KeyQ" && window.GameState.inCombat) {
      window.StoryEngine.triggerCompanionTagIn("string");
    } else if (e.code === "KeyE" && window.GameState.inCombat) {
      window.StoryEngine.triggerCompanionTagIn("mantis");
    }
  });
})();

// v5.1 Visible Stage Hitbox Testing: Small Randomized Street Pickups, Roadside Props, Hover Cursor & Companion Petting
(function bindStageInteractions() {
  const canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  canvas.addEventListener("mousemove", (e) => {
    const st = window.GameState;
    if (!st) return;
    const rect = canvas.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const cy = ((e.clientY - rect.top) / rect.height) * canvas.height;
    let hit = cx < canvas.width * 0.36 && cy > canvas.height * 0.40;
    if (!st.inCombat && !hit && st.activeStreetPickup) {
      const pk = st.activeStreetPickup;
      const pkX = pk.rx !== undefined ? canvas.width * pk.rx : pk.x;
      const pkY = pk.ry !== undefined ? canvas.height * pk.ry : pk.y;
      if (Math.hypot(cx - pkX, cy - pkY) <= 40) hit = true;
    }
    if (!st.inCombat && !hit && !st.roadsideNpc && !st.propCollected) {
      const pp = st.propPos || { rx: 0.56, ry: 0.70 };
      if (Math.hypot(cx - canvas.width * pp.rx, cy - canvas.height * pp.ry) <= 44) hit = true;
    }
    canvas.style.cursor = hit ? "pointer" : "default";
  });

  canvas.addEventListener("click", (e) => {
    const st = window.GameState;
    if (!st) return;
    const rect = canvas.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const cy = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // 1. Pet String & Baby Mantis on left side of stage (KAI_ACT_14 + EXP_LINK_39)
    if (cx < canvas.width * 0.36 && cy > canvas.height * 0.40) {
      window.Sprite16FPSEngine.setHeroAction("KAI_ACT_14", 1500);
      window.Sprite16FPSEngine.spawnOneShot("EXP_LINK_39", canvas.width * 0.23, canvas.height * 0.64, 0.56, "BOND +15 RAGE!", 7);
      if (!st.petBondedToday) {
        st.petBondedToday = true;
        st.hero.rage = Math.min(100, st.hero.rage + 15);
        const heal = Math.round(st.hero.maxHp * 0.05);
        st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + heal);
        window.Sprite16FPSEngine.spawnFloatingText("🐾 +15 RAGE  +" + heal + " HP", cx, cy - 20, "#f472b6", 1.05);
        window.AppUI.log(`🐾 Petted <strong>String &amp; Baby Mantis</strong> (<code>KAI_ACT_14</code>)! +15 Rage &amp; +${heal} HP.`, "event");
        if (window.TutorialDirector) window.TutorialDirector.notify("stage_clicked", { kind: "pet" });
        window.AppUI.refreshVitals();
        window.SaveManager.saveToLocal();
      } else if (window.TutorialDirector) {
        window.TutorialDirector.notify("stage_clicked", { kind: "pet" });
      }
      return;
    }

    if (st.inCombat) return;

    // 2. Visible Active Street Pickup Hitbox (40px radius at randomized rx, ry)
    if (st.activeStreetPickup) {
      const pk = st.activeStreetPickup;
      const pkX = pk.rx !== undefined ? canvas.width * pk.rx : pk.x;
      const pkY = pk.ry !== undefined ? canvas.height * pk.ry : pk.y;
      const dist = Math.hypot(cx - pkX, cy - pkY);
      if (dist <= 40) {
        st.activeStreetPickup = null;
        st.gold += pk.gold;
        if (pk.hp) st.hero.hp = Math.min(st.hero.maxHp, st.hero.hp + pk.hp);
        const act = pk.key === "VFX_MISC_48" ? "KAI_ACT_10" : (pk.key === "VFX_MISC_29" ? "KAI_ACT_04" : "KAI_ACT_15");
        window.Sprite16FPSEngine.setHeroAction(act, 1400);
        if (window.AudioSFX) window.AudioSFX.play("coin");
        window.VfxRenderer.triggerProp("VFX_MISC_35", `+${pk.gold}G!`);
        window.Sprite16FPSEngine.spawnFloatingText(`+${pk.gold}G` + (pk.hp ? ` +${pk.hp}HP` : ""), pkX, pkY - 24, "#facc15", 1.15);
        window.AppUI.log(`🎁 Collected <strong>${pk.label}</strong>! +${pk.gold} Gold` + (pk.hp ? ` &amp; +${pk.hp} HP` : "") + ".", "event");
        if (window.TutorialDirector) window.TutorialDirector.notify("stage_clicked", { kind: "pickup" });
        window.AppUI.refreshVitals();
        window.SaveManager.saveToLocal();
        return;
      }
    }

    // 3. Stage-Locked Roadside Prop Hitbox (44px radius at randomized propPos) — disappears after clicking
    const pp = st.propPos || { rx: 0.56, ry: 0.70 };
    const propX = canvas.width * pp.rx;
    const propY = canvas.height * pp.ry;
    if (!st.roadsideNpc && !st.propCollected && Math.hypot(cx - propX, cy - propY) <= 44) {
      st.propCollected = true;
      st.gold += 10;
      st.hero.rage = Math.min(100, st.hero.rage + 10);
      window.Sprite16FPSEngine.setHeroAction("KAI_ACT_09", 1200);
      window.Sprite16FPSEngine.spawnOneShot("VFX_MISC_49", propX, propY, 0.52, "", 7);
      window.Sprite16FPSEngine.spawnFloatingText("✨ +10G  +10 RAGE", propX, propY - 32, "#38bdf8", 1.05);
      window.AppUI.log("✨ Inspected roadside shrine/prop! +10 Gold &amp; +10 Rage.", "event");
      if (window.TutorialDirector) window.TutorialDirector.notify("stage_clicked", { kind: "prop" });
      window.AppUI.refreshVitals();
      window.SaveManager.saveToLocal();
    }
  });
})();
