window.Sprite16FPSEngine = {
  images: {},
  embedded: window.EMBEDDED_PREVIEW_ASSETS || {},
  activeEffects: [],
  scrollX: 0,
  frameTick: 0,
  lastTime: 0,

  async loadAll(onProgress) {
    const cfg = window.CAPYBARA_CONFIG;
    const entries = [
      ...Object.entries(cfg.BIOME_BACKDROPS_16x9),
      ...Object.entries(cfg.CHARACTER_SHEETS_16F),
      ...Object.entries(cfg.VFX_MISC_SHEETS_16F),
      ...Object.entries(cfg.ENM_BOSS_SHEETS_16F)
    ];
    let done = 0;
    const total = entries.length;
    await Promise.all(entries.map(([key, path]) => new Promise((resolve) => {
      if (this.embedded[key]) {
        const emb = new Image();
        emb.onload = () => { this.images[key] = emb; done++; onProgress(Math.round((done / total) * 100)); resolve(); };
        emb.onerror = () => { done++; onProgress(Math.round((done / total) * 100)); resolve(); };
        emb.src = this.embedded[key];
        return;
      }
      const img = new Image();
      img.onload = () => { this.images[key] = img; done++; onProgress(Math.round((done / total) * 100)); resolve(); };
      img.onerror = () => { done++; onProgress(Math.round((done / total) * 100)); resolve(); };
      img.src = path;
    })));
  },

  spawnOneShot(sheetKey, x, y, scale = 0.65, label = "") {
    this.activeEffects.push({ sheetKey, x, y, scale, frame: 0, label, maxFrames: 16 });
  },

  drawCell(ctx, sheetKey, frameIdx, dx, dy, dw, dh) {
    const img = this.images[sheetKey];
    if (!img) return false;
    const f = ((frameIdx % 16) + 16) % 16;
    const col = f % 4;
    const row = Math.floor(f / 4);
    const sw = img.width / 4;
    const sh = img.height / 4;
    ctx.drawImage(img, col * sw, row * sh, sw, sh, dx - dw / 2, dy - dh / 2, dw, dh);
    return true;
  },

  renderStage(ctx, w, h, dt) {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    const chObj = cfg.CHAPTERS[(st.chapter - 1) % cfg.CHAPTERS.length];

    // 1. 16:9 Parallax Biome Backdrop
    const bg = this.images[chObj.biome] || this.images["BIOME_01"];
    if (bg) {
      if (!st.inCombat && !st.awaitingChoice) this.scrollX = (this.scrollX + dt * 0.045 * st.speed) % w;
      const ox = -this.scrollX;
      ctx.drawImage(bg, ox, 0, w, h);
      ctx.drawImage(bg, ox + w, 0, w, h);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#1e3a8a"); grad.addColorStop(1, "#14532d");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    }

    // 2. Advance 16-FPS Clock (62.5 ms per frame)
    this.lastTime += dt * st.speed;
    while (this.lastTime >= 62.5) {
      this.lastTime -= 62.5;
      this.frameTick = (this.frameTick + 1) % 16;
      for (let i = this.activeEffects.length - 1; i >= 0; i--) {
        this.activeEffects[i].frame++;
        if (this.activeEffects[i].frame >= this.activeEffects[i].maxFrames) {
          this.activeEffects.splice(i, 1);
        }
      }
    }

    // 3. Ambient Biome 16-FPS Weather Overlay
    this.drawCell(ctx, chObj.weatherVfx, this.frameTick, w * 0.50, h * 0.45, 180, 180);

    // 4. Hero Kai & Pets/Mount Stage Presence (Left Side -> Facing Right)
    const bob = Math.sin(Date.now() * 0.008 * st.speed) * 3;
    const kaiSheet = st.inCombat ? "KAI_CMB_01" : "KAI_ACT_02";
    const kaiFrame = st.inCombat ? (this.frameTick % 16) : (this.frameTick % 16);
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath(); ctx.ellipse(w * 0.27, h * 0.85, 40, 10, 0, 0, Math.PI * 2); ctx.fill();
    if (!this.drawCell(ctx, kaiSheet, kaiFrame, w * 0.27, h * 0.71, 138, 138)) {
      ctx.fillStyle = "#fde68a"; ctx.strokeStyle = "#34221A"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(w * 0.27, h * 0.72 + bob, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    // Companion Pet / Mount behind Kai
    const petCfg = cfg.SPIRIT_PETS.find(p => p.id === st.activePet) || cfg.SPIRIT_PETS[0];
    const petSheet = st.activeMount !== "none"
      ? (cfg.MOUNTS.find(m => m.id === st.activeMount)?.sheet || petCfg.sheet)
      : petCfg.sheet;
    if (!this.drawCell(ctx, petSheet, this.frameTick % 8, w * 0.13, h * 0.75, 96, 96)) {
      ctx.fillStyle = "#D89B4C"; ctx.strokeStyle = "#34221A"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(w * 0.13, h * 0.77 - bob * 0.7, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();

    // 5. Active Enemy / Boss (ENM_BOSS_01..42) or Special NPC / World Prop (ENM_BOSS_43..61)
    const actor = st.enemy || st.roadsideNpc;
    if (actor) {
      ctx.save();
      const isBoss = !!actor.isBoss;
      const drawSize = isBoss ? 172 : 140;
      ctx.fillStyle = "rgba(0,0,0,0.40)";
      ctx.beginPath(); ctx.ellipse(w * 0.73, h * 0.85, isBoss ? 52 : 38, 11, 0, 0, Math.PI * 2); ctx.fill();
      const rowOffset = actor.animRow ? actor.animRow * 4 : (st.inCombat ? 4 : 0);
      const frame = rowOffset + (this.frameTick % 4);
      const drew = this.drawCell(ctx, actor.sheetId, frame, w * 0.73, h * 0.69, drawSize, drawSize);
      if (!drew) {
        ctx.fillStyle = isBoss ? "#dc2626" : "#7c3aed";
        ctx.strokeStyle = "#34221A"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(w * 0.73, h * 0.70 - bob, isBoss ? 32 : 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = "rgba(15,23,42,0.82)";
      ctx.fillRect(w * 0.73 - 110, h * 0.42, 220, 22);
      ctx.fillStyle = isBoss ? "#fca5a5" : "#fde68a";
      ctx.font = "bold 12px system-ui"; ctx.textAlign = "center";
      const label = actor.hp !== undefined
        ? `${actor.name} (${Math.max(0, Math.ceil(actor.hp))} HP)`
        : actor.name;
      ctx.fillText(label, w * 0.73, h * 0.42 + 15);
      ctx.restore();
    }

    // 6. Active 16-FPS One-Shot VFX Layers
    for (const fx of this.activeEffects) {
      const size = 256 * fx.scale;
      const drew = this.drawCell(ctx, fx.sheetKey, fx.frame, fx.x, fx.y, size, size);
      if (!drew && fx.label) {
        ctx.fillStyle = "#facc15"; ctx.font = "900 18px system-ui"; ctx.textAlign = "center";
        ctx.fillText(fx.label, fx.x, fx.y - fx.frame * 1.5);
      }
    }
  }
};
