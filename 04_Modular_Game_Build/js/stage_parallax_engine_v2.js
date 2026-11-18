window.StageEngine = {
  atlases: {},
  scrollX: 0,
  time: 0,
  heroAnim: { mode: "march", timer: 0, schoolId: null },
  roadsideProp: null,

  async loadAll(onProgress) {
    const entries = Object.entries(window.CAPYBARA_CONFIG.ATLAS_FILES);
    let loaded = 0;
    await Promise.all(entries.map(([key, url]) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.atlases[key] = img;
        loaded++;
        onProgress(Math.round((loaded / entries.length) * 100));
        resolve();
      };
      img.onerror = () => {
        loaded++;
        onProgress(Math.round((loaded / entries.length) * 100));
        resolve();
      };
      img.src = url;
    })));
  },

  triggerHeroAnim(mode, duration = 0.65, schoolId = null) {
    this.heroAnim = { mode, timer: duration, maxDuration: duration, schoolId };
  },

  setRoadsideProp(row, col) {
    this.roadsideProp = { row, col, x: 740 };
  },

  clearRoadsideProp() {
    this.roadsideProp = null;
  },

  update(dt) {
    const mult = window.GameState.speed || 1;
    this.time += dt * mult;
    if (!window.GameState.inCombat && !window.GameState.awaitingChoice) {
      this.scrollX = (this.scrollX + dt * 95 * mult) % 960;
    }
    if (this.roadsideProp && this.roadsideProp.x > 520) {
      this.roadsideProp.x = Math.max(520, this.roadsideProp.x - dt * 220 * mult);
    }
    if (this.heroAnim.timer > 0) {
      this.heroAnim.timer -= dt * mult;
      if (this.heroAnim.timer <= 0) this.heroAnim.mode = "march";
    }
    window.VFXRenderer.update(dt * mult);
  },

  drawCell(ctx, sheetKey, row, col, x, y, w, h, flipX = false) {
    const img = this.atlases[sheetKey];
    if (!img) return;
    const cw = (img.naturalWidth || img.width || 1024) / 4;
    const ch = (img.naturalHeight || img.height || 1024) / 4;
    ctx.save();
    ctx.translate(x, y);
    if (flipX) ctx.scale(-1, 1);
    ctx.drawImage(img, col * cw, row * ch, cw, ch, -w / 2, -h, w, h);
    ctx.restore();
  },

  draw16Frame(ctx, sheetKey, frameIdx, x, y, w, h, flipX = false) {
    const idx = Math.max(0, Math.min(15, frameIdx | 0));
    this.drawCell(ctx, sheetKey, Math.floor(idx / 4), idx % 4, x, y, w, h, flipX);
  },

  render(ctx, canvas) {
    const W = canvas.width, H = canvas.height;
    const st = window.GameState;
    ctx.clearRect(0, 0, W, H);

    // 1. Top-Screen Parallax Biome Banner (CG_B08_01)
    const biomeImg = this.atlases.BIOMES_ACT1;
    const C = window.CAPYBARA_CONFIG.CELL_SIZE;
    const biomeCol = st.day <= 20 ? 0 : st.day <= 40 ? 1 : 2;
    if (biomeImg) {
      for (let rx = -this.scrollX; rx < W; rx += 480) {
        ctx.drawImage(biomeImg, biomeCol * C, 0, C, C, rx, 0, 480, H - 70);
      }
    } else {
      ctx.fillStyle = "#1e3a8a";
      ctx.fillRect(0, 0, W, H - 70);
    }

    // 2. Ground Road Strip
    const grad = ctx.createLinearGradient(0, H - 80, 0, H);
    grad.addColorStop(0, "#78553a");
    grad.addColorStop(1, "#4a3222");
    ctx.fillStyle = grad;
    ctx.fillRect(0, H - 80, W, 80);
    ctx.fillStyle = "#926c4b";
    for (let sx = -(this.scrollX % 80); sx < W; sx += 80) {
      ctx.fillRect(sx, H - 55, 42, 8);
    }

    // 3. Roadside Event Prop (CG_B08_03)
    if (this.roadsideProp && !st.inCombat) {
      this.drawCell(ctx, "ROADSIDE_PROPS", this.roadsideProp.row, this.roadsideProp.col, this.roadsideProp.x, H - 44, 150, 150);
    }

    // 4. Hero Party Formation (Left Side: String, Baby Mantis, Hero Kai)
    const bounce = Math.abs(Math.sin(this.time * 7)) * 6;
    const heroY = H - 40 - (st.inCombat ? 0 : bounce);

    // Pet Slot 1: String (#D89B4C Terrier)
    const stringCol = Math.floor(this.time * 5) % 4;
    this.drawCell(ctx, "STRING_PET", 0, stringCol, 125, H - 40 - bounce * 0.8, 100, 100);

    // Pet Slot 2: Baby Mantis Spell Guardian (#2ECC71)
    const mantisFloat = Math.sin(this.time * 4) * 7;
    this.drawCell(ctx, "MANTIS_PET", 0, Math.floor(this.time * 4) % 4, 190, H - 155 + mantisFloat, 95, 95);

    // Hero Kai (16-Frame Smooth Animation Engine v2.0)
    const animProg = this.heroAnim.maxDuration ? Math.max(0, Math.min(0.999, 1 - (this.heroAnim.timer / this.heroAnim.maxDuration))) : 0;
    const animFrame = Math.floor(animProg * 16);
    if (this.heroAnim.mode === "cast" && this.heroAnim.schoolId) {
      const mKey = (window.CAPYBARA_CONFIG.MAGIC_16F_MAP || {})[this.heroAnim.schoolId] || "KAI_16F_STARLIGHT";
      this.draw16Frame(ctx, this.atlases[mKey] ? mKey : "KAI_16F_STARLIGHT", animFrame, 275, heroY, 165, 165);
    } else if (this.heroAnim.mode === "attack") {
      this.draw16Frame(ctx, "KAI_16F_ATTACK", animFrame, 295, heroY, 165, 165);
    } else if (this.heroAnim.mode === "hit") {
      this.draw16Frame(ctx, "KAI_16F_HIT", animFrame, 260, heroY, 155, 155);
    } else if (this.heroAnim.mode === "victory") {
      this.draw16Frame(ctx, "KAI_16F_VICTORY", animFrame, 270, heroY, 165, 165);
    } else if (st.inCombat || st.awaitingChoice) {
      const idleF = Math.floor(this.time * 12) % 16;
      this.draw16Frame(ctx, "KAI_16F_IDLE", idleF, 270, heroY, 155, 155);
    } else if ((st.speed || 1) >= 2) {
      const runF = Math.floor(this.time * 20) % 16;
      this.draw16Frame(ctx, "KAI_16F_RUN", runF, 270, heroY, 158, 158);
    } else {
      const walkF = Math.floor(this.time * 16) % 16;
      this.draw16Frame(ctx, "KAI_16F_WALK", walkF, 270, heroY, 155, 155);
    }

    // Hero Shield Bubble Overlay (CG_VFX_03)
    if (st.hero.shield > 0) {
      this.drawCell(ctx, "VFX_DEFENSE", 0, 1, 270, heroY + 12, 165, 165);
    }
    // Hero Rage 100% Aura (CG_VFX_04 R4C3)
    if (st.hero.rage >= 100) {
      this.drawCell(ctx, "VFX_STATUS", 3, 2, 270, heroY + 10, 175, 175);
    }

    // 5. Enemy / Boss Formation (Right Side)
    if (st.inCombat && st.enemy) {
      const ex = 675, ey = H - 40;
      const eFrame = Math.floor(this.time * 3) % 4;
      this.drawCell(ctx, st.enemy.sheetKey, st.enemy.row, eFrame, ex, ey, st.enemy.size, st.enemy.size, true);

      // Enemy HP Bar
      const bw = 150;
      const hpPct = Math.max(0, st.enemy.hp / st.enemy.maxHp);
      ctx.fillStyle = "rgba(15,23,42,0.85)";
      ctx.fillRect(ex - bw / 2, ey - st.enemy.size - 24, bw, 16);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(ex - bw / 2 + 2, ey - st.enemy.size - 22, (bw - 4) * hpPct, 12);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${st.enemy.name} (${Math.max(0, Math.ceil(st.enemy.hp))})`, ex, ey - st.enemy.size - 12);

      // Enemy Status Overlays (CG_VFX_04: Poison, Burn, Freeze, Stun, Confuse, # Silence)
      const es = st.enemy.status || {};
      const tick = Math.floor(this.time * 3) % 2;
      if (es.poison > 0) this.drawCell(ctx, "VFX_STATUS", 0, tick, ex, ey - 20, 110, 110);
      if (es.confuse > 0) this.drawCell(ctx, "VFX_STATUS", 0, 2 + tick, ex, ey - st.enemy.size + 10, 85, 85);
      if (es.stun > 0) this.drawCell(ctx, "VFX_STATUS", 1, tick, ex, ey - st.enemy.size + 10, 90, 90);
      if (es.freeze > 0) this.drawCell(ctx, "VFX_STATUS", 1, 2 + tick, ex, ey + 10, 145, 145);
      if (es.burn > 0) this.drawCell(ctx, "VFX_STATUS", 2, tick, ex, ey, 130, 130);
      if (es.silence > 0) this.drawCell(ctx, "VFX_STATUS", 3, tick, ex, ey - st.enemy.size + 5, 80, 80);
    }

    // 6. Foreground VFX & Popups
    window.VFXRenderer.draw(ctx, this.atlases);
  }
};
