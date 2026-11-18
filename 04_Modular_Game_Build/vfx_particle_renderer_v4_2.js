// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// vfx_particle_renderer_v4_1.js (Phase 3: 12-School VFX, Manga Cut-Ins & EXP_LINK Triggers)
window.VfxRenderer = {
  triggerSchoolCast(schoolId) {
    const school = window.CAPYBARA_CONFIG.MAGIC_SCHOOLS.find(s => s.id === schoolId) || window.CAPYBARA_CONFIG.MAGIC_SCHOOLS[0];
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    const w = canvas.width, h = canvas.height;
    window.Sprite16FPSEngine.spawnOneShot(school.circle, w * 0.28, h * 0.78, 0.68, school.name, 1);
    window.Sprite16FPSEngine.spawnOneShot(school.overlay, w * 0.28, h * 0.68, 0.65, "", 7);
    window.Sprite16FPSEngine.spawnOneShot(school.vfx, w * 0.73, h * 0.68, 0.80, school.py, 7);
  },
  triggerHitCallout(type, customText = "") /* v4.3: crit/pow/bang/boom -> VFX_MISC_01..04 + floating text */ {
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
    const label = customText || (type.toUpperCase() + "!");
    window.Sprite16FPSEngine.spawnOneShot(map[type] || "VFX_MISC_01", canvas.width * 0.72, canvas.height * 0.50, 0.65, label, 7);
    if (window.Sprite16FPSEngine.spawnFloatingText) {
      window.Sprite16FPSEngine.spawnFloatingText(label, canvas.width * 0.72, canvas.height * 0.46, colors[type] || "#fde68a", type === "crit" || type === "boom" ? 1.25 : 1.0);
    }
  },
  triggerCodeTrace(lessonRingKey = "EXP_LINK_41") {
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    const w = canvas.width, h = canvas.height;
    window.Sprite16FPSEngine.setHeroAction("KAI_ACT_13", 1800);
    window.Sprite16FPSEngine.spawnOneShot("VFX_MISC_13", w * 0.28, h * 0.60, 0.85, "PYTHON TRACE", 7);
    window.Sprite16FPSEngine.spawnOneShot("EXP_LINK_38", w * 0.50, h * 0.62, 0.95, "", 7);
    window.Sprite16FPSEngine.spawnOneShot(lessonRingKey || "EXP_LINK_41", w * 0.28, h * 0.70, 0.85, "OVERCLOCK!", 7);
    window.Sprite16FPSEngine.spawnOneShot("VFX_MISC_10", w * 0.50, h * 0.44, 0.75, "TRUE! PURIFIED!", 7);
    window.Sprite16FPSEngine.spawnFloatingText("⚡ PYTHON OVERCLOCK!", w * 0.32, h * 0.42, "#38bdf8", 1.2);
  },
  triggerMangaCutIn(kind) {
    const useRage = window.Sprite16FPSEngine.images["MANGA_CUTIN_RAGE"] ? "MANGA_CUTIN_RAGE" : "EXP_LINK_24";
    const map = { rage: useRage, assist: "EXP_LINK_25", boss: "EXP_LINK_26", shatter: "EXP_LINK_40" };
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    window.Sprite16FPSEngine.spawnOneShot(map[kind] || useRage, canvas.width * 0.50, canvas.height * 0.52, 0.88, "", 7);
  },
  triggerEnemyProjectile(projRow = null) {
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    window.Sprite16FPSEngine.spawnOneShot("ENM_BOSS_59", canvas.width * 0.50, canvas.height * 0.68, 0.68, "", 7, projRow);
  },
  triggerLotusPurification() {
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    window.Sprite16FPSEngine.spawnOneShot("EXP_LINK_20", canvas.width * 0.28, canvas.height * 0.68, 0.75, "", 7);
    window.Sprite16FPSEngine.spawnOneShot("ENM_BOSS_62", canvas.width * 0.73, canvas.height * 0.68, 0.82, "PURIFIED!", 7);
  },
  triggerProp(sheetKey, label) {
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    window.Sprite16FPSEngine.spawnOneShot(sheetKey, canvas.width * 0.68, canvas.height * 0.68, 0.80, label, 7);
  }
};
