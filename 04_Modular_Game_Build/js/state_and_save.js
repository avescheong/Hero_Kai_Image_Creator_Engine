window.GameState = {
  chapter: 1,
  day: 1,
  maxDays: 60,
  gold: 120,
  stamina: 20,
  maxStamina: 20,
  level: 1,
  xp: 0,
  xpNext: 100,
  hero: {
    hp: 500, maxHp: 500,
    atk: 48, def: 12,
    shield: 0, rage: 0,
    comboRate: 0.25, counterRate: 0.20, dodgeRate: 0.15, critRate: 0.20,
    comboCount: 0,
    activeSchool: "starlight",
    status: {}
  },
  gear: {
    weapon: "IronSword of Pythonia (+18 ATK)",
    armor: "Moss-Green Traveling Cloak (+12 DEF)",
    ring1: "Guardian Lotus Ring (+60 Shield)",
    ring2: "Skyflame Band (+15% Crit)",
    acc1: "Icy Bubble Charm (+15% Skill DMG)",
    acc2: "Tzu Chi Dharma Medallion (+10% Heal)"
  },
  skills: ["flying_daggers", "sword_chi"],
  pets: ["String (#D89B4C Terrier)", "Baby Mantis (#2ECC71 Guardian)"],
  inCombat: false,
  awaitingChoice: false,
  autoPlay: false,
  speed: 1,
  enemy: null
};

window.SaveManager = {
  saveToLocal() {
    localStorage.setItem("kai_capybara_go_save_v1", JSON.stringify(window.GameState));
  },
  loadFromLocal() {
    const raw = localStorage.getItem("kai_capybara_go_save_v1");
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw);
      Object.assign(window.GameState, parsed);
      return true;
    } catch { return false; }
  },
  exportJson() {
    const blob = new Blob([JSON.stringify(window.GameState, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `kai_capybara_go_day${window.GameState.day}.json`;
    a.click();
  }
};
