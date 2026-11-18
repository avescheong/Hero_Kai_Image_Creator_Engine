window.VfxRenderer = {
  triggerSchoolCast(schoolId) {
    const school = window.CAPYBARA_CONFIG.MAGIC_SCHOOLS.find(s => s.id === schoolId) || window.CAPYBARA_CONFIG.MAGIC_SCHOOLS[0];
    const canvas = document.getElementById("game-canvas");
    const w = canvas.width, h = canvas.height;
    window.Sprite16FPSEngine.spawnOneShot(school.circle, w * 0.25, h * 0.78, 0.75, school.name);
    window.Sprite16FPSEngine.spawnOneShot(school.overlay, w * 0.25, h * 0.70, 0.70);
    window.Sprite16FPSEngine.spawnOneShot(school.vfx, w * 0.74, h * 0.70, 0.80, school.py);
  },
  triggerHitCallout(type) {
    const map = { crit: "VFX_MISC_01", pow: "VFX_MISC_02", combo: "VFX_MISC_03", dodge: "VFX_MISC_04", boom: "VFX_MISC_05" };
    const canvas = document.getElementById("game-canvas");
    window.Sprite16FPSEngine.spawnOneShot(map[type] || "VFX_MISC_01", canvas.width * 0.72, canvas.height * 0.45, 0.7, type.toUpperCase() + "!");
  },
  triggerProp(sheetKey, label) {
    const canvas = document.getElementById("game-canvas");
    window.Sprite16FPSEngine.spawnOneShot(sheetKey, canvas.width * 0.65, canvas.height * 0.68, 0.85, label);
  }
};
