window.VfxRenderer = {
  triggerSchoolCast(schoolId) {
    const school = window.CAPYBARA_CONFIG.MAGIC_SCHOOLS.find(s => s.id === schoolId) || window.CAPYBARA_CONFIG.MAGIC_SCHOOLS[0];
    const canvas = document.getElementById("game-canvas");
    const w = canvas.width, h = canvas.height;
    window.Sprite16FPSEngine.spawnOneShot(school.circle, w * 0.27, h * 0.78, 0.68, school.name);
    window.Sprite16FPSEngine.spawnOneShot(school.overlay, w * 0.27, h * 0.68, 0.65);
    window.Sprite16FPSEngine.spawnOneShot(school.vfx, w * 0.73, h * 0.68, 0.78, school.py);
  },
  triggerHitCallout(type) {
    const map = { crit: "VFX_MISC_01", pow: "VFX_MISC_02", bang: "VFX_MISC_03", boom: "VFX_MISC_04", combo: "VFX_MISC_08", dodge: "VFX_MISC_09" };
    const canvas = document.getElementById("game-canvas");
    window.Sprite16FPSEngine.spawnOneShot(map[type] || "VFX_MISC_01", canvas.width * 0.72, canvas.height * 0.46, 0.65, type.toUpperCase() + "!");
  },
  triggerEnemyProjectile() {
    const canvas = document.getElementById("game-canvas");
    window.Sprite16FPSEngine.spawnOneShot("ENM_BOSS_59", canvas.width * 0.50, canvas.height * 0.68, 0.68);
  },
  triggerLotusPurification() {
    const canvas = document.getElementById("game-canvas");
    window.Sprite16FPSEngine.spawnOneShot("ENM_BOSS_62", canvas.width * 0.73, canvas.height * 0.68, 0.80, "PURIFIED!");
  },
  triggerProp(sheetKey, label) {
    const canvas = document.getElementById("game-canvas");
    window.Sprite16FPSEngine.spawnOneShot(sheetKey, canvas.width * 0.68, canvas.height * 0.68, 0.80, label);
  }
};
