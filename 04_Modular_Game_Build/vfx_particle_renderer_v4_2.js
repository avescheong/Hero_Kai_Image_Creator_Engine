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
  triggerHitCallout(type) /* v4.2: crit/pow/bang/boom -> VFX_MISC_01..04 */ {
    const map = {
      crit: "VFX_MISC_01", pow: "VFX_MISC_02", bang: "VFX_MISC_03",
      boom: "VFX_MISC_04", combo: "VFX_MISC_08", dodge: "VFX_MISC_09",
      true_py: "VFX_MISC_10"
    };
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    window.Sprite16FPSEngine.spawnOneShot(map[type] || "VFX_MISC_01", canvas.width * 0.72, canvas.height * 0.46, 0.65, type.toUpperCase() + "!", 7);
  },
  triggerMangaCutIn(kind) {
    const useRage = window.Sprite16FPSEngine.images["MANGA_CUTIN_RAGE"] ? "MANGA_CUTIN_RAGE" : "EXP_LINK_24";
    const map = { rage: useRage, assist: "EXP_LINK_25", boss: "EXP_LINK_26", shatter: "EXP_LINK_40" };
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    window.Sprite16FPSEngine.spawnOneShot(map[kind] || useRage, canvas.width * 0.50, canvas.height * 0.28, 1.05, "", 7);
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
