// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// sprite_16fps_engine_v4_1.js (v4.1.1: 212-Asset Preloader, flipX Left-Facing NPCs/Bosses, Smart Fallback & 8-Layer Z-Sandwich)
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
      ...Object.entries(cfg.EXP_LINK_SHEETS_16F || {}),
      ...Object.entries(cfg.STATUS_SHEETS_V4_2 || {})
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

  resolveFallbackKey(sheetKey) {
    if (this.images[sheetKey]) return sheetKey;
    if (!sheetKey) return null;
    if (sheetKey.startsWith("KAI_ACT_")) return this.images["KAI_ACT_02"] ? "KAI_ACT_02" : "KAI_ACT_01";
    if (sheetKey.startsWith("KAI_CMB_")) return "KAI_CMB_01";
    if (sheetKey.startsWith("KAI_MAG_")) return sheetKey === "KAI_MAG_16" ? "KAI_MAG_16" : "KAI_MAG_01";
    if (sheetKey.startsWith("EXP_LINK_21") || sheetKey.startsWith("EXP_LINK_22")) return "EXP_LINK_21";
    if (sheetKey.startsWith("EXP_LINK_1")) return "EXP_LINK_11";
    if (sheetKey.startsWith("EXP_LINK_31") || sheetKey.startsWith("EXP_LINK_32")) return "EXP_LINK_31";
    if (sheetKey.startsWith("EXP_LINK_33") || sheetKey.startsWith("EXP_LINK_34")) return "EXP_LINK_33";
    if (sheetKey.startsWith("EXP_LINK_")) return "EXP_LINK_07";
    if (sheetKey.startsWith("ENM_BOSS_")) {
      const num = parseInt(sheetKey.replace("ENM_BOSS_", ""), 10) || 1;
      if (num >= 43 && num <= 52) return num === 49 ? "ENM_BOSS_49" : "ENM_BOSS_43";
      if (num >= 31 && num <= 42) return "ENM_BOSS_31";
      return "ENM_BOSS_01";
    }
    if (sheetKey === "VFX_MISC_22" || sheetKey === "VFX_MISC_38") return "VFX_MISC_22";
    if (sheetKey === "VFX_MISC_43" || sheetKey === "VFX_MISC_44") return "VFX_MISC_43";
    if (sheetKey.startsWith("VFX_MISC_")) return "VFX_MISC_21";
    if (sheetKey.startsWith("BIOME_")) return "BIOME_01";
    return null;
  },

  spawnOneShot(sheetKey, x, y, scale = 0.65, label = "", zLayer = 7, rowOffset = null) {
    this.activeEffects.push({ sheetKey, x, y, scale, frame: 0, label, maxFrames: 16, zLayer, rowOffset });
  },

  drawCell(ctx, sheetKey, frameIdx, dx, dy, dw, dh, alpha = 1.0, composite = "source-over", flipX = false) {
    const resolved = this.resolveFallbackKey(sheetKey);
    const img = resolved ? this.images[resolved] : null;
    if (!img || !img.width) return false;
    const f = ((frameIdx % 16) + 16) % 16;
    const col = f % 4;
    const row = Math.floor(f / 4);
    const sw = img.width / 4;
    const sh = img.height / 4;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = composite;
    ctx.translate(dx, dy);
    if (flipX) ctx.scale(-1, 1);
    ctx.drawImage(img, col * sw, row * sh, sw, sh, -dw / 2, -dh / 2, dw, dh);
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
    if (status === "bleed" && this.images["KAI_STATUS_BLEED"]) return "KAI_STATUS_BLEED";
    if (status === "bleed") return "EXP_LINK_01";
    if (status === "poison" && this.images["KAI_STATUS_POISON"]) return "KAI_STATUS_POISON";
    if (status === "poison") return "EXP_LINK_02";
    if (status === "confuse" && this.images["KAI_STATUS_CONFUSE"]) return "KAI_STATUS_CONFUSE";
    if (status === "confuse") return "EXP_LINK_03";
    if (status === "freeze" && this.images["KAI_STATUS_FREEZE"]) return "KAI_STATUS_FREEZE";
    if (status === "freeze") return "EXP_LINK_04";
    if ((status === "stun" || status === "burn") && this.images["KAI_STATUS_BURN"]) return "KAI_STATUS_BURN";
    if (status === "stun" || status === "burn") return "EXP_LINK_05";
    if (status === "silence" && this.images["KAI_STATUS_SILENCE"]) return "KAI_STATUS_SILENCE";
    if (status === "silence") return "EXP_LINK_06";
    if (st.awaitingChoice) return this.images["KAI_EXP_THINK"] ? "KAI_EXP_THINK" : "EXP_LINK_07";
    if (st.hero.rage >= 100) return this.images["KAI_EXP_OVERDRIVE"] ? "KAI_EXP_OVERDRIVE" : "EXP_LINK_08";
    if (st.hero.hp / st.hero.maxHp < 0.25) return this.images["KAI_EXP_LOW_HP"] ? "KAI_EXP_LOW_HP" : "EXP_LINK_10";
    if (st.inCombat) {
      if (st.activeActionSheet) return st.activeActionSheet;
      const wCfg = window.CAPYBARA_CONFIG.WEAPONS_DB && window.CAPYBARA_CONFIG.WEAPONS_DB[st.activeWeapon || "ironsword"];
      return (wCfg && wCfg.sheet) ? wCfg.sheet : "KAI_CMB_01";
    }
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
      this.drawCell(ctx, petCfg.id === "string" ? stringSheet : petCfg.sheet, this.frameTick, kaiX - 96, kaiY + 14, 102, 102);
      this.drawCell(ctx, mantisSheet, this.frameTick, kaiX - 52, kaiY - 46, 86, 86);
    }

    // Z=3.0 & Z=3.2: Hero Kai + Reactive Expression Sheet (Facing RIGHT ->)
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(kaiX, h * 0.85, 42, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const kaiSheet = this.resolveHeroSheet(st);
    this.drawCell(ctx, kaiSheet, this.frameTick, kaiX, kaiY, 146, 146, 1.0, "source-over", false);

    // Z=4.5: Gate 3C Hollow-Rim Front Shield (0% center alpha) & Waist-Down Status Overlays
    if (st.hero.shield > 0) {
      const shieldSheet = st.hero.shield > 150 ? "EXP_LINK_11" : "EXP_LINK_12";
      this.drawCell(ctx, shieldSheet, this.frameTick, kaiX, kaiY, 168, 168, 0.62, "screen");
    }
    if (status === "freeze") {
      this.drawCell(ctx, "EXP_LINK_14", this.frameTick, kaiX, kaiY + 12, 150, 150, 0.90);
    } else if (status === "bleed") {
      this.drawCell(ctx, "EXP_LINK_16", this.frameTick, kaiX, kaiY - 28, 118, 118, 0.95);
    } else if (status === "burn") {
      this.drawCell(ctx, "EXP_LINK_17", this.frameTick, kaiX, kaiY - 56, 98, 98, 0.95);
    }

    // Z=5.5: SOCKET_CROWN_HALO (Strict Overhead y - 62px)
    if (status === "confuse" || status === "stun" || status === "silence" || st.awaitingChoice) {
      const haloRow = status === "confuse" ? 0 : status === "stun" ? 1 : status === "silence" ? 2 : 3;
      this.drawCell(ctx, "EXP_LINK_15", haloRow * 4 + (this.frameTick % 4), kaiX, kaiY - 62, 118, 118, 0.95);
    }

    // Z=5.0: Enemy / Boss or Roadside Special NPC (flipX = true so they face LEFT <- toward Hero Kai!)
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
      this.drawCell(ctx, actor.sheetId, frame, enmX, enmY, drawSize, drawSize, 1.0, "source-over", !!actor.flipX);

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
      ? (this.images["KAICAM_STATUS"] ? "KAICAM_STATUS" : "EXP_LINK_22") : "EXP_LINK_21";
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
      const fxFrame = fx.rowOffset !== null && fx.rowOffset !== undefined
        ? (fx.rowOffset * 4 + (fx.frame % 4))
        : fx.frame;
      this.drawCell(ctx, fx.sheetKey, fxFrame, fx.x, fx.y, size, size);
    }
  }
};
