// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// audio_and_passport_v5.js (Sprint 4: Zero-Dependency Web Audio SFX Synth & Python Mastery Passport)
window.AudioSFX = {
  ctx: null,
  muted: false,
  _ensureCtx() {
    if (this.muted) return null;
    if (!this.ctx && typeof window !== "undefined") {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        try { this.ctx = new AC(); } catch (e) { return null; }
      }
    }
    if (this.ctx && this.ctx.state === "suspended" && this.ctx.resume) {
      try { this.ctx.resume(); } catch (e) {}
    }
    return this.ctx;
  },
  toggleMute() {
    this.muted = !this.muted;
    const btn = document.getElementById("btn-audio-mute");
    if (btn) btn.textContent = this.muted ? "🔇 Muted" : "🔊 SFX";
    return this.muted;
  },
  play(kind) {
    const ctx = this._ensureCtx();
    if (!ctx) return false;
    try {
      const now = ctx.currentTime;
      const tone = (freq, dur, type = "triangle", gainVal = 0.08, delay = 0) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + delay);
        g.gain.setValueAtTime(gainVal, now + delay);
        g.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + dur);
      };
      if (kind === "parry") { tone(880, 0.09, "square", 0.09, 0); tone(1320, 0.16, "triangle", 0.08, 0.06); }
      else if (kind === "crit") { tone(520, 0.08, "sawtooth", 0.08, 0); tone(780, 0.12, "triangle", 0.09, 0.05); tone(1040, 0.16, "sine", 0.07, 0.10); }
      else if (kind === "hit") { tone(160, 0.11, "sawtooth", 0.09, 0); }
      else if (kind === "magic") { tone(440, 0.10, "sine", 0.07, 0); tone(660, 0.14, "sine", 0.06, 0.06); }
      else if (kind === "compile") { tone(523, 0.08, "triangle", 0.08, 0); tone(659, 0.08, "triangle", 0.08, 0.07); tone(784, 0.16, "triangle", 0.08, 0.14); }
      else if (kind === "error") { tone(220, 0.14, "sawtooth", 0.08, 0); tone(185, 0.18, "sawtooth", 0.08, 0.10); }
      else if (kind === "levelup") { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.14, "triangle", 0.08, i * 0.07)); }
      else if (kind === "ko") { [330, 277, 220, 146].forEach((f, i) => tone(f, 0.18, "sawtooth", 0.07, i * 0.11)); }
      else if (kind === "coin") { tone(987, 0.06, "sine", 0.07, 0); tone(1318, 0.12, "sine", 0.07, 0.05); }
      else if (kind === "tagin") { tone(660, 0.08, "triangle", 0.08, 0); tone(880, 0.12, "triangle", 0.08, 0.06); }
      return true;
    } catch (e) { return false; }
  }
};

window.MasteryPassport = {
  CONCEPTS: [
    { ch: 1, id: "print", label: "print() Output" },
    { ch: 2, id: "variables", label: "Variables (x = 5)" },
    { ch: 3, id: "arithmetic", label: "int / float Math" },
    { ch: 4, id: "strings", label: "str & + Concat" },
    { ch: 5, id: "casting", label: "int() Type Casting" },
    { ch: 6, id: "booleans", label: "Booleans (True/False)" },
    { ch: 7, id: "conditionals", label: "if / elif / else" },
    { ch: 8, id: "comments", label: "# Comments & Logic" },
    { ch: 9, id: "for_loops", label: "for i in range()" },
    { ch: 10, id: "while_break", label: "while & break" },
    { ch: 11, id: "lists_sort", label: "Lists & .sort()" },
    { ch: 12, id: "functions", label: "def Functions" }
  ],
  recordChapterMastery(ch) {
    const st = window.GameState;
    if (!st) return;
    if (!Array.isArray(st.masteredConcepts)) st.masteredConcepts = [];
    const c = this.CONCEPTS.find(x => x.ch === ch);
    if (c && !st.masteredConcepts.includes(c.id)) {
      st.masteredConcepts.push(c.id);
    }
  },
  exportPassportJson() {
    const st = window.GameState || {};
    const mastered = st.masteredConcepts || [];
    return JSON.stringify({
      game: "Kai_Capybara_GO",
      version: (window.CAPYBARA_CONFIG && window.CAPYBARA_CONFIG.VERSION) || "5.0.4",
      chapter: st.chapter || 1,
      day: st.day || 1,
      level: st.level || 1,
      masteredCount: mastered.length,
      totalConcepts: this.CONCEPTS.length,
      masteredConcepts: mastered,
      scrollsUnlocked: (st.collectedScrolls || [1]).length
    }, null, 2);
  }
};
