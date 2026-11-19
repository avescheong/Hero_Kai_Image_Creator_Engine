// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// vfx_particle_renderer_v4_2.js (v5.1: Sequenced Non-Stacked Sakuga Choreography Helpers)
window.VfxRenderer = {
  triggerSchoolCast(schoolId, opts = {}) {
    const school = window.CAPYBARA_CONFIG.MAGIC_SCHOOLS.find(s => s.id === schoolId) || window.CAPYBARA_CONFIG.MAGIC_SCHOOLS[0];
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    const w = canvas.width, h = canvas.height;
    const tMul = opts.tMul || 1.0;
    const chainActive = !!opts.chainActive;
    // Stage 1 (0ms, Z=1): Ground circle blooms behind Kai
    window.Sprite16FPSEngine.spawnOneShot(school.circle, w * 0.28, h * 0.77, 0.50, "", 1, null, { maxFrames: 12, delayMs: 0 });
    // Stage 2 (380ms, Z=6): Traveling Spell-Chain / elemental bolt from Kai to Enemy
    window.Sprite16FPSEngine.spawnOneShot(
      chainActive ? "EXP_LINK_38" : school.overlay,
      w * 0.33, h * 0.66, 0.42, "", 6, null,
      { delayMs: Math.round(380 * tMul), toX: w * 0.72, toY: h * 0.66, maxFrames: 9 }
    );
    // Stage 3 (720ms, Z=7): Impact elemental burst on Enemy
    window.Sprite16FPSEngine.spawnOneShot(
      school.vfx, w * 0.73, h * 0.66, 0.60, school.py, 7, null,
      { delayMs: Math.round(720 * tMul), maxFrames: 14 }
    );
  },

  triggerWeaponPassive(kind, label = "") {
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    const w = canvas.width, h = canvas.height;
    if (kind === "forge_hammer") {
      window.Sprite16FPSEngine.spawnOneShot("EXP_LINK_11", w * 0.28, h * 0.68, 0.52, "+120 SHIELD", 7, null, { maxFrames: 10 });
      window.Sprite16FPSEngine.spawnOneShot("VFX_MISC_04", w * 0.73, h * 0.64, 0.44, label || "SLAM!", 7, null, { maxFrames: 10 });
    } else if (kind === "flying_dagger") {
      window.Sprite16FPSEngine.spawnOneShot("VFX_MISC_06", w * 0.73, h * 0.22, 0.46, label || "LIGHT SPEAR!", 7, null, {
        toX: w * 0.73, toY: h * 0.66, maxFrames: 9
      });
    } else if (kind === "chrono") {
      window.Sprite16FPSEngine.spawnOneShot("VFX_MISC_41", w * 0.73, h * 0.62, 0.46, label || "ECHO!", 7, null, { maxFrames: 10 });
    } else {
      window.Sprite16FPSEngine.spawnOneShot("VFX_MISC_08", w * 0.73, h * 0.62, 0.46, label || "PASSIVE!", 7, null, { maxFrames: 10 });
    }
  },

  triggerHitCallout(type, customText = "", opts = {}) {
    const map = {
      crit: "VFX_MISC_01", pow: "VFX_MISC_02", bang: "VFX_MISC_03",
      boom: "VFX_MISC_04", combo: "VFX_MISC_08", dodge: "VFX_MISC_09",
      true_py: "VFX_MISC_10"
    };
    const colors = {
      crit: "#facc15", pow: "#fde68a", bang: "#38bdf8",
      boom: "#f97316", combo: "#c084fc", dodge: "#4ade80", true_py: "#34d399"
    };
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    const w = canvas.width, h = canvas.height;
    const label = customText || (type.toUpperCase() + "!");
    window.Sprite16FPSEngine.spawnOneShot(map[type] || "VFX_MISC_01", w * 0.73, h * 0.36, 0.44, "", 7, null, {
      delayMs: opts.delayMs || 0,
      maxFrames: 10
    });
    if (window.Sprite16FPSEngine.spawnFloatingText) {
      window.Sprite16FPSEngine.spawnFloatingText(label, w * 0.73, h * 0.44, colors[type] || "#fde68a", type === "crit" || type === "boom" ? 1.25 : 1.0);
    }
  },

  triggerCodeTrace(lessonRingKey = "EXP_LINK_41") {
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    const w = canvas.width, h = canvas.height;
    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_13", 1800);
    window.Sprite16FPSEngine.spawnOneShot("VFX_MISC_13", w * 0.28, h * 0.60, 0.52, "PYTHON TRACE", 7, null, { delayMs: 0, maxFrames: 10 });
    window.Sprite16FPSEngine.spawnOneShot("EXP_LINK_38", w * 0.34, h * 0.62, 0.50, "", 7, null, {
      delayMs: 320, toX: w * 0.66, toY: h * 0.62, maxFrames: 9
    });
    window.Sprite16FPSEngine.spawnOneShot(lessonRingKey || "EXP_LINK_41", w * 0.28, h * 0.68, 0.55, "OVERCLOCK!", 7, null, { delayMs: 640, maxFrames: 12 });
    window.Sprite16FPSEngine.spawnOneShot("VFX_MISC_10", w * 0.50, h * 0.36, 0.46, "TRUE! COMPILED!", 7, null, { delayMs: 920, maxFrames: 10 });
    window.Sprite16FPSEngine.spawnFloatingText("⚡ PYTHON OVERCLOCK!", w * 0.32, h * 0.40, "#38bdf8", 1.15);
  },

  triggerMangaCutIn(kind) {
    const useRage = window.Sprite16FPSEngine.images["MANGA_CUTIN_RAGE"] ? "MANGA_CUTIN_RAGE" : "EXP_LINK_24";
    const map = { rage: useRage, assist: "EXP_LINK_25", boss: "EXP_LINK_26", shatter: "EXP_LINK_40" };
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    window.Sprite16FPSEngine.triggerCameraPunch({ zoom: 1.06, focusX: 0.5, shake: 4, hitStopMs: 0, durationMs: 420, vignette: 0.35 });
    window.Sprite16FPSEngine.spawnOneShot(map[kind] || useRage, canvas.width * 0.50, canvas.height * 0.50, 0.62, "", 8, null, { maxFrames: 10 });
  },

  triggerEnemyProjectile(projRow = 0, durationMs = 380) {
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    const w = canvas.width, h = canvas.height;
    const frames = Math.max(6, Math.min(12, Math.round(durationMs / 48)));
    window.Sprite16FPSEngine.spawnOneShot("ENM_BOSS_59", w * 0.68, h * 0.66, 0.46, "", 7, projRow, {
      toX: w * 0.30, toY: h * 0.68, maxFrames: frames
    });
  },

  triggerLotusPurification() {
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    const w = canvas.width, h = canvas.height;
    window.Sprite16FPSEngine.spawnOneShot("EXP_LINK_20", w * 0.28, h * 0.68, 0.54, "", 7, null, { maxFrames: 12 });
    window.Sprite16FPSEngine.spawnOneShot("ENM_BOSS_62", w * 0.73, h * 0.68, 0.56, "PURIFIED!", 7, null, { delayMs: 220, maxFrames: 12 });
  },

  triggerProp(sheetKey, label) {
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    window.Sprite16FPSEngine.spawnOneShot(sheetKey, canvas.width * 0.56, canvas.height * 0.58, 0.46, label, 7, null, { maxFrames: 12 });
  }
};
