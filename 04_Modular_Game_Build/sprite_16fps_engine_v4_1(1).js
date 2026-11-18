// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// sprite_16fps_engine_v4_1.js (Phase 2: 212-Asset Preloader, 1,460ms Sakuga Timing & 8-Layer Split-Sandwich Z-Order)
window.Sprite16FPSEngine = {
  images: {},
  embedded: window.EMBEDDED_PREVIEW_ASSETS || {},
  activeEffects: [],
  scrollX: 0,
  frameTick: 0,
  lastTime: 0,
  hitStopActive: false,

  async loadAll(onProgress) {
    const cfg = window.CAPYBARA_CONFIG;
    const entries = [
      ...Object.entries(cfg.BIOME_BACKDROPS_16x9 || {}),
      ...Object.entries(cfg.CHARACTER_SHEETS_16F || {}),
      ...Object.entries(cfg.VFX_MISC_SHEETS_16F || {}),
      ...Object.entries(cfg.ENM_BOSS_SHEETS_16F || {}),
      ...Object.entries(cfg.EXP_LINK_SHEETS_16F || {})
    ];
    let done = 0;
    const total = entries.length || 1;
    await Promise.all(entries.map(([key, path]) => new Promise((resolve) => {
      if (this.embedded[key]) {
        const emb = new Image();
        emb.onload = emb.onerror = () => {
          if (emb.width > 0) this.images[key] = emb;
          done++;
          if (onProgress) onProgress(Math.round((done / total) * 100));
          resolve();
        };
        emb.src = this.embedded[key];
        return;
      }
      const img = new Image();
      img.onload = img.onerror = () => {
        if (img.width > 0) this.images[key] = img;
        done++;
        if (onProgress) onProgress(Math.round((done / total) * 100));
        resolve();
      };
      img.src = path;
    })));
  },

  spawnOneShot(sheetKey, x, y, scale = 0.65, label = "", zLayer = 7) {
    this.activeEffects.push({ sheetKey, x, y, scale, frame: 0, label, maxFrames: 16, zLayer });
  },

  drawCell(ctx, sheetKey, frameIdx, dx, dy, dw, dh, alpha = 1.0, composite = "source-over") {
    const img = this.images[sheetKey];
    if (!img || !img.width) return false;
    const f = ((frameIdx % 16) + 16) % 16;
    const col = f % 4;
    const row = Math.floor(f / 4);
    const sw = img.width / 4;
    const sh = img.height / 4;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = composite;
    ctx.drawImage(img, col * sw, row * sh, sw, sh, dx - dw / 2, dy - dh / 2, dw, dh);
    ctx.restore();
    return true;
  },

  getFrameHoldMs(frameIdx, pacingMode) {
    const cfg = window.CAPYBARA_CONFIG;
    const sakuga = cfg.SAKUGA_TIMING;
    const lut = sakuga && sakuga.kid_paced_sakuga_ms ? sakuga.kid_paced_sakuga_ms : null;
    const baseHold = lut ? lut[frameIdx % 16] : 62.5;
    const mult = (sakuga && sakuga.modes && sakuga.modes[pacingMode]) ? sakuga.modes[pacingMode].multiplier : 1.0;
    return baseHold * mult;
  },

  resolveHeroSheet(st) {
    const status = st.heroStatus || "none";
    if (status === "bleed") return "EXP_LINK_01";
    if (status === "poison") return "EXP_LINK_02";
    if (status === "confuse") return "EXP_LINK_03";
    if (status === "freeze") return "EXP_LINK_04";
    if (status === "stun" || status === "burn") return "EXP_LINK_05";
    if (status === "silence") return "EXP_LINK_06";
    if (st.awaitingChoice) return "EXP_LINK_07";
    if (st.hero.rage >= 100) return "EXP_LINK_08";
    if (st.hero.hp / st.hero.maxHp < 0.25) return "EXP_LINK_10";
    if (st.inCombat) {
      if (st.activeActionSheet) return st.activeActionSheet;
      const wCfg = window.CAPYBARA_CONFIG.WEAPONS_DB && window.CAPYBARA_CONFIG.WEAPONS_DB[st.activeWeapon || "ironsword"];
      return (wCfg && wCfg.sheet) ? wCfg.sheet : "KAI_CMB_01";
    }
    if (st.hero.shield > 0 && st.hero.hp === st.hero.maxHp) return "KAI_ACT_02";
    return "KAI_ACT_02";
  },

  renderStage(ctx, w, h, dt) {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    const chObj = cfg.CHAPTERS[(st.chapter - 1) % cfg.CHAPTERS.length];
    const pacingMode = st.pacingMode || "sakuga";

    // Z=0.0: 16:9 Parallax Biome Backdrop
    const bg = this.images[chObj.biome] || this.images["BIOME_01"];
    if (bg) {
      if (!st.inCombat && !st.awaitingChoice) {
        const scrollSpeed = pacingMode === "slow" ? 0.032 : (pacingMode === "turbo" ? 0.065 : 0.045);
        this.scrollX = (this.scrollX + dt * scrollSpeed) % w;
      }
      const ox = -this.scrollX;
      ctx.drawImage(bg, ox, 0, w, h);
      ctx.drawImage(bg, ox + w, 0, w, h);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#1e3a8a");
      grad.addColorStop(1, "#14532d");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Advance 16-FPS Sakuga Variable Frame-Hold Clock
    this.lastTime += dt;
    const currentHold = this.getFrameHoldMs(this.frameTick, pacingMode);
    while (this.lastTime >= currentHold) {
      this.lastTime -= currentHold;
      this.frameTick = (this.frameTick + 1) % 16;
      this.hitStopActive = (this.frameTick === 9 && st.inCombat);
      for (let i = this.activeEffects.length - 1; i >= 0; i--) {
        this.activeEffects[i].frame++;
        if (this.activeEffects[i].frame >= this.activeEffects[i].maxFrames) {
          this.activeEffects.splice(i, 1);
        }
      }
    }

    // Z=0.5: Ambient Biome Weather Overlay
    this.drawCell(ctx, chObj.weatherVfx, this.frameTick, w * 0.50, h * 0.45, 185, 185, 0.85);

    const kaiX = w * 0.28;
    const kaiY = h * 0.70;
    const bob = Math.sin(Date.now() * 0.007) * 2.5;
    const status = st.heroStatus || "none";

    // Z=1.2: SOCKET_GROUND_POOL (Under Boots)
    if (status === "poison") {
      this.drawCell(ctx, "EXP_LINK_18", this.frameTick, kaiX, kaiY + 26, 150, 150, 0.90);
    } else if (st.inCombat) {
      const mSchool = cfg.MAGIC_SCHOOLS.find(m => m.id === st.activeSchool);
      this.drawCell(ctx, mSchool ? mSchool.circle : "VFX_MISC_11", this.frameTick, kaiX, kaiY + 34, 140, 140, 0.65);
    }

    // Z=1.5: SOCKET_BACK_HEMISPHERE (Behind Hero Kai)
    if (st.hero.rage >= 100) {
      this.drawCell(ctx, "EXP_LINK_19", this.frameTick, kaiX, kaiY - 6, 175, 175, 0.90);
    } else if (st.hero.shield > 0) {
      this.drawCell(ctx, "EXP_LINK_13", this.frameTick, kaiX, kaiY, 170, 170, 0.85);
    }

    // Z=2.5: Companion Pets & Rideable Mount (String #D89B4C & Baby Mantis #2ECC71)
    const petCfg = cfg.SPIRIT_PETS.find(p => p.id === st.activePet) || cfg.SPIRIT_PETS[0];
    const stringSheet = (status === "confuse" || status === "poison" || status === "freeze" || status === "silence")
      ? "EXP_LINK_32" : "EXP_LINK_31";
    const mantisSheet = (status !== "none") ? "EXP_LINK_34" : "EXP_LINK_33";
    const mountSheet = st.activeMount !== "none"
      ? (cfg.MOUNTS.find(m => m.id === st.activeMount) || {}).sheet : null;

    if (mountSheet) {
      this.drawCell(ctx, mountSheet, this.frameTick, kaiX - 58, kaiY + 14, 108, 108);
    } else {
      const drawnPet = this.drawCell(ctx, petCfg.id === "string" ? stringSheet : petCfg.sheet, this.frameTick, kaiX - 96, kaiY + 14, 102, 102);
      if (!drawnPet) {
        ctx.fillStyle = "#D89B4C";
        ctx.beginPath();
        ctx.arc(kaiX - 96, kaiY + 18 - bob * 0.7, 14, 0, Math.PI * 2);
        ctx.fill();
      }
      this.drawCell(ctx, mantisSheet, this.frameTick, kaiX - 52, kaiY - 46, 86, 86);
    }

    // Z=3.0 & Z=3.2: Hero Kai + Reactive Expression Sheet (100% Opacity)
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(kaiX, h * 0.85, 42, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const kaiSheet = this.resolveHeroSheet(st);
    const drewKai = this.drawCell(ctx, kaiSheet, this.frameTick, kaiX, kaiY, 146, 146, 1.0);
    if (!drewKai) {
      ctx.save();
      ctx.fillStyle = "#fde68a";
      ctx.strokeStyle = "#34221A";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(kaiX, kaiY + bob, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Z=4.5: Gate 3C Hollow-Rim Front Shield (0% center alpha) & Waist-Down Status Overlays
    if (st.hero.shield > 0) {
      const shieldSheet = st.hero.shield > 150 ? "EXP_LINK_11" : "EXP_LINK_12";
      if (!this.drawCell(ctx, shieldSheet, this.frameTick, kaiX, kaiY, 168, 168, 0.62, "screen")) {
        ctx.save();
        ctx.strokeStyle = "rgba(250,204,21,0.85)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(kaiX, kaiY, 64, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
    if (status === "freeze") {
      this.drawCell(ctx, "EXP_LINK_14", this.frameTick, kaiX, kaiY + 12, 150, 150, 0.90);
    } else if (status === "bleed") {
      this.drawCell(ctx, "EXP_LINK_16", this.frameTick, kaiX, kaiY - 4, 140, 140, 0.95);
    } else if (status === "burn") {
      this.drawCell(ctx, "EXP_LINK_17", this.frameTick, kaiX, kaiY + 12, 150, 150, 0.90);
    }

    // Z=5.5: SOCKET_CROWN_HALO (Strict Overhead y - 62px)
    if (status === "confuse" || status === "stun" || status === "silence" || st.awaitingChoice) {
      const haloRow = status === "confuse" ? 0 : status === "stun" ? 1 : status === "silence" ? 2 : 3;
      this.drawCell(ctx, "EXP_LINK_15", haloRow * 4 + (this.frameTick % 4), kaiX, kaiY - 62, 118, 118, 0.95);
    }

    // Z=5.0: Enemy / Boss or Roadside Special NPC + Python Bug-Tell Heart
    const actor = st.enemy || st.roadsideNpc;
    if (actor) {
      const enmX = w * 0.73;
      const enmY = h * 0.68;
      const isBoss = !!actor.isBoss;
      const drawSize = isBoss ? 174 : 142;

      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.40)";
      ctx.beginPath();
      ctx.ellipse(enmX, h * 0.85, isBoss ? 52 : 38, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const rowOffset = actor.animRow !== undefined ? actor.animRow * 4 : (st.inCombat ? 4 : 0);
      const frame = rowOffset + (this.frameTick % 4);
      const drewActor = this.drawCell(ctx, actor.sheetId, frame, enmX, enmY, drawSize, drawSize, 1.0);
      if (!drewActor) {
        ctx.save();
        ctx.fillStyle = isBoss ? "#dc2626" : "#7c3aed";
        ctx.strokeStyle = "#34221A";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(enmX, enmY - bob, isBoss ? 32 : 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      if (actor.hp !== undefined) {
        this.drawCell(ctx, "EXP_LINK_37", this.frameTick, enmX, enmY - 82, 86, 86, 0.90);
        if (st.inCombat && this.frameTick < 4) {
          this.drawCell(ctx, "EXP_LINK_38", this.frameTick, (kaiX + enmX) * 0.5, enmY - 12, 220, 96, 0.75);
        }
      }

      ctx.save();
      ctx.fillStyle = "rgba(15,23,42,0.85)";
      ctx.fillRect(enmX - 115, h * 0.40, 230, 24);
      ctx.fillStyle = isBoss ? "#fca5a5" : "#fde68a";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      const label = actor.hp !== undefined
        ? `${actor.name} (${Math.max(0, Math.ceil(actor.hp))} HP)`
        : actor.name;
      ctx.fillText(label, enmX, h * 0.40 + 16);
      ctx.restore();
    }

    // Z=7.0: Live HUD "Kai-Cam" Portrait + Rhythm Parry Ring + Hit-Stop + Active One-Shot VFX
    const camSheet = (status === "bleed" || status === "poison" || status === "confuse" || status === "freeze")
      ? "EXP_LINK_22" : "EXP_LINK_21";
    const camRow = status === "poison" ? 1 : status === "confuse" ? 2 : status === "freeze" ? 3 : (st.awaitingChoice ? 1 : (st.hero.shield > 0 ? 2 : 0));
    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.82)";
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(46, 46, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    this.drawCell(ctx, camSheet, camRow * 4 + (this.frameTick % 4), 46, 46, 62, 62, 1.0);

    if (st.parryWindowOpen) {
      this.drawCell(ctx, "EXP_LINK_27", this.frameTick, kaiX, kaiY, 150, 150, 0.95);
    }
    if (status === "freeze" || status === "confuse" || status === "silence") {
      this.drawCell(ctx, "EXP_LINK_28", this.frameTick, kaiX + 54, kaiY - 46, 86, 86, 0.95);
    }
    if (this.hitStopActive) {
      this.drawCell(ctx, "EXP_LINK_29", 9, w * 0.72, h * 0.62, 175, 175, 0.90);
    }

    for (const fx of this.activeEffects) {
      const size = 256 * fx.scale;
      const drew = this.drawCell(ctx, fx.sheetKey, fx.frame, fx.x, fx.y, size, size);
      if (!drew && fx.label) {
        ctx.save();
        ctx.fillStyle = "#facc15";
        ctx.font = "900 18px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(fx.label, fx.x, fx.y - fx.frame * 1.5);
        ctx.restore();
      }
    }
  }
};
