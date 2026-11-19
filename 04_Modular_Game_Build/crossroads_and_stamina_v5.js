// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// crossroads_and_stamina_v5.js (Sprint 3: 3-Lane Branching Crossroads, Stamina & Fatigue Economy, Portable JSON Save)
window.CrossroadsEngine = {
  LANES: [
    { id: "gauntlet", label: "⚔️ Risky Gauntlet (+Gems & XP)", prop: "ENM_BOSS_57", run: (eng, chObj) => (Math.random() < 0.5 ? eng.startCombat(chObj.minion, false, "Crossroads Gauntlet") : eng.triggerChestMimicOrSanctuary()) },
    { id: "sanctuary", label: "🌿 Veggie Campfire (+Stamina & HP)", prop: "VFX_MISC_22", run: (eng) => eng.triggerCampfire() },
    { id: "mentor", label: "🤝 Mentor & Fortune (+Buff / Wheel)", prop: "VFX_MISC_21", run: (eng, chObj) => (Math.random() < 0.5 ? eng.triggerSpecialNpc(chObj.npc) : eng.triggerWheel()) }
  ],

  triggerCrossroads(chObj) {
    const st = window.GameState;
    st.awaitingChoice = true;
    window.VfxRenderer.triggerProp("VFX_MISC_28", "CROSSROADS!");
    window.AppUI.log(`🧭 <strong>Day ${st.day} Branching Crossroads!</strong> Choose your path forward:`, "event");
    window.AppUI.setChoices(this.LANES.map(lane => ({
      label: lane.label,
      fn: () => {
        st.awaitingChoice = false;
        window.AppUI.setChoices([]);
        lane.run(window.StoryEngine, chObj);
        if (window.TutorialDirector) window.TutorialDirector.notify("crossroads_picked", { lane: lane.id });
        window.AppUI.refreshVitals();
        window.SaveManager.saveToLocal();
      }
    })));
  }
};
