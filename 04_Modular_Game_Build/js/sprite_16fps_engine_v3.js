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
      ...Object.entries(cfg.BIOME_BACKDROPS_16x9).map(([k, v]) => [k, v]),
      ...Object.entries(cfg.VFX_MISC_SHEETS_16F).map(([k, v]) => [k, v])
    ];
    let done = 0;
    const total = entries.length;
    await Promise.all(entries.map(([key, path]) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => { this.images[key] = img; done++; onProgress(Math.round((done / total) * 100)); resolve(); };
      img.onerror = () => {
        if (this.embedded[key]) {
          const fallback = new Image();
          fallback.onload = () => { this.images[key] = fallback; done++; onProgress(Math.round((done / total) * 100)); resolve(); };
          fallback.onerror = () => { done++; onProgress(Math.round((done / total) * 100)); resolve(); };
          fallback.src = this.embedded[key];
        } else {
          done++; onProgress(Math.round((done / total) * 100)); resolve();
        }
      };
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
    const biomeIdx = Math.min(cfg.BIOMES.length - 1, Math.floor((st.day - 1) / 6));
    const biome = cfg.BIOMES[biomeIdx];

    // 1. 16:9 Parallax Biome Backdrop
    const bg = this.images[biome.id] || this.images["BIOME_01"];
    if (bg) {
      if (!st.inCombat) this.scrollX = (this.scrollX + dt * 0.045 * st.speed) % w;
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

    // 3. Ambient Biome 16-FPS Overlay (e.g. Sakura / Spores / Fire)
    this.drawCell(ctx, biome.vfx, this.frameTick, w * 0.52, h * 0.48, 160, 160);

    // 4. Hero Kai & Pets Stage Presence
    const bob = Math.sin(Date.now() * 0.008 * st.speed) * 4;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath(); ctx.ellipse(w * 0.25, h * 0.84, 34, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fde68a"; ctx.strokeStyle = "#34221A"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(w * 0.25, h * 0.72 + bob, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(w * 0.25 - 16, h * 0.72 + 16 + bob, 32, 22);
    ctx.strokeRect(w * 0.25 - 16, h * 0.72 + 16 + bob, 32, 22);
    ctx.fillStyle = "#fff"; ctx.font = "bold 11px system-ui"; ctx.textAlign = "center";
    ctx.fillText("Hero Kai", w * 0.25, h * 0.56 + bob);

    // String & Baby Mantis
    ctx.fillStyle = "#D89B4C";
    ctx.beginPath(); ctx.arc(w * 0.14, h * 0.78 - bob * 0.7, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#2ECC71";
    ctx.beginPath(); ctx.arc(w * 0.08, h * 0.70 + bob * 0.8, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();

    // 5. Active Enemy or Roadside Prop
    if (st.enemy) {
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.38)";
      ctx.beginPath(); ctx.ellipse(w * 0.74, h * 0.84, 36, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = st.enemy.isBoss ? "#dc2626" : "#7c3aed";
      ctx.strokeStyle = "#34221A"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(w * 0.74, h * 0.70 - bob, st.enemy.isBoss ? 32 : 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "bold 12px system-ui"; ctx.textAlign = "center";
      ctx.fillText(`${st.enemy.name} (${Math.max(0, Math.ceil(st.enemy.hp))} HP)`, w * 0.74, h * 0.52);
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
