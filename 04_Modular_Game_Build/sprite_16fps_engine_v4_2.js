// Hero Kai: Scrolls of Pythonia — Capybara Go! Edition
// sprite_16fps_engine_v4_2.js (v5.1: Sakuga Stage Director, Camera Zoom/Shake/Hit-Stop, FlipX Facing Fix, Small Random Props & Beat Ribbon)
window.Sprite16FPSEngine = {
  images: {},
  embedded: window.EMBEDDED_PREVIEW_ASSETS || {},
  activeEffects: [],
  floatingTexts: [],
  previewCanvases: [],
  scrollX: 0,
  frameTick: 0,
  lastTime: 0,
  heroAnimFrame: 0,
  lastHeroSheet: null,
  heroAnimHoldAccum: 0,
  cameraZoom: 1.0,
  targetZoom: 1.0,
  cameraFocusX: 0.5,
  targetFocusX: 0.5,
  shakeAmount: 0,
  hitStopUntil: 0,
  vignetteAlpha: 0,
  _cameraTimer: null,
  heroOffsetX: 0,
  enemyOffsetX: 0,
  enemyFlashUntil: 0,
  heroFlashUntil: 0,

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

  triggerCameraPunch({ zoom = 1.08, focusX = 0.55, shake = 8, hitStopMs = 130, durationMs = 480, vignette = 0.25 } = {}) {
    this.targetZoom = zoom;
    this.targetFocusX = focusX;
    this.shakeAmount = Math.max(this.shakeAmount, shake);
    this.vignetteAlpha = Math.max(this.vignetteAlpha, vignette);
    if (hitStopMs > 0) {
      this.hitStopUntil = Math.max(this.hitStopUntil, Date.now() + hitStopMs);
    }
    if (this._cameraTimer) clearTimeout(this._cameraTimer);
    this._cameraTimer = setTimeout(() => {
      this.targetZoom = 1.0;
      this.targetFocusX = 0.5;
    }, durationMs);
  },

  triggerActorImpulse(side, offsetX, flashMs = 0) {
    if (side === "hero") {
      this.heroOffsetX = offsetX;
      if (flashMs > 0) this.heroFlashUntil = Date.now() + flashMs;
    } else if (side === "enemy") {
      this.enemyOffsetX = offsetX;
      if (flashMs > 0) this.enemyFlashUntil = Date.now() + flashMs;
    }
  },

  spawnOneShot(sheetKey, x, y, scale = 0.55, label = "", zLayer = 7, rowOffset = null, opts = {}) {
    const delayMs = opts.delayMs || 0;
    this.activeEffects.push({
      sheetKey,
      x,
      y,
      fromX: x,
      fromY: y,
      toX: opts.toX !== undefined ? opts.toX : x,
      toY: opts.toY !== undefined ? opts.toY : y,
      scale,
      frame: 0,
      label,
      maxFrames: opts.maxFrames || 16,
      zLayer,
      rowOffset,
      flipX: !!opts.flipX,
      alpha: opts.alpha !== undefined ? opts.alpha : 1.0,
      startAt: Date.now() + delayMs,
      started: delayMs <= 0
    });
  },

  spawnFloatingText(text, x, y, color = "#fde68a", scale = 1.0) {
    this.floatingTexts.push({ text, x, y, color, scale, life: 1.0 });
  },

  setHeroAction(sheetKey, durationMs = 1500) {
    const st = window.GameState;
    if (!st) return;
    st.heroActionState = sheetKey;
    st.heroActionUntil = Date.now() + durationMs;
  },

  attachPreviewCanvases(containerEl) {
    if (!containerEl) return;
    const found = Array.from(containerEl.querySelectorAll("canvas[data-sheet]"));
    const merged = new Set([...(this.previewCanvases || []).filter(cv => document.body.contains(cv)), ...found]);
    this.previewCanvases = Array.from(merged);
    this.renderPreviewCanvases();
  },

  renderPreviewCanvases() {
    if (!this.previewCanvases || this.previewCanvases.length === 0) return;
    this.previewCanvases = this.previewCanvases.filter(cv => document.body.contains(cv));
    for (const cv of this.previewCanvases) {
      const sheet = cv.getAttribute("data-sheet");
      const rowAttr = cv.getAttribute("data-row");
      const rowStartAttr = cv.getAttribute("data-rowstart");
      const rowCountAttr = cv.getAttribute("data-rowcount");
      const cellAttr = cv.getAttribute("data-cell");
      const flipAttr = cv.getAttribute("data-flipx");
      const ctx = cv.getContext("2d");
      if (!ctx) continue;
      ctx.clearRect(0, 0, cv.width, cv.height);
      let frame = this.frameTick;
      if (cellAttr !== null && cellAttr !== "") {
        frame = parseInt(cellAttr, 10) || 0;
      } else if (rowStartAttr !== null && rowStartAttr !== "") {
        const rs = parseInt(rowStartAttr, 10) || 0;
        const rc = Math.max(1, parseInt(rowCountAttr, 10) || 2);
        frame = rs * 4 + (this.frameTick % (rc * 4));
      } else if (rowAttr !== null && rowAttr !== "") {
        frame = (parseInt(rowAttr, 10) || 0) * 4 + (this.frameTick % 4);
      }
      const cfg = window.CAPYBARA_CONFIG;
      let doFlip = false;
      if (flipAttr === "true") doFlip = true;
      else if (flipAttr === "false") doFlip = false;
      else if (cfg && cfg.ACTOR_FLIP_X_MAP && cfg.ACTOR_FLIP_X_MAP[sheet]) doFlip = true;
      this.drawCell(ctx, sheet, frame, cv.width / 2, cv.height / 2, cv.width * 0.92, cv.height * 0.92, 1.0, "source-over", doFlip);
    }
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

  drawEffectsByZ(ctx, minZ, maxZ) {
    const now = Date.now();
    for (const fx of this.activeEffects) {
      if (now < fx.startAt) continue;
      if (fx.zLayer < minZ || fx.zLayer > maxZ) continue;
      const size = 256 * fx.scale;
      const fxFrame = fx.rowOffset !== null && fx.rowOffset !== undefined
        ? (fx.rowOffset * 4 + (fx.frame % 4))
        : fx.frame;
      this.drawCell(ctx, fx.sheetKey, fxFrame, fx.x, fx.y, size, size, fx.alpha || 1.0, "source-over", !!fx.flipX);
      if (fx.label) {
        ctx.save();
        ctx.fillStyle = "#fde68a";
        ctx.strokeStyle = "rgba(15,23,42,0.92)";
        ctx.lineWidth = 3;
        ctx.font = "bold 11px system-ui";
        ctx.textAlign = "center";
        ctx.strokeText(fx.label, fx.x, fx.y - size * 0.34);
        ctx.fillText(fx.label, fx.x, fx.y - size * 0.34);
        ctx.restore();
      }
    }
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
    if (st.heroActionUntil && Date.now() < st.heroActionUntil && st.heroActionState) {
      return st.heroActionState;
    }
    if (st.inCombat && st.parryWindowOpen) return "KAI_ACT_17";
    if (st.hero.hp / st.hero.maxHp < 0.15) return "KAI_ACT_06";
    if (st.awaitingChoice) return this.images["KAI_EXP_THINK"] ? "KAI_EXP_THINK" : "KAI_ACT_13";
    if (st.hero.rage >= 100) return this.images["KAI_EXP_OVERDRIVE"] ? "KAI_EXP_OVERDRIVE" : "KAI_MAG_13";
    if (st.hero.hp / st.hero.maxHp < 0.25) return this.images["KAI_EXP_LOW_HP"] ? "KAI_EXP_LOW_HP" : "KAI_ACT_06";
    if (st.inCombat) {
      if (st.activeActionSheet) return st.activeActionSheet;
      const wCfg = window.CAPYBARA_CONFIG.WEAPONS_DB && window.CAPYBARA_CONFIG.WEAPONS_DB[st.activeWeapon || "ironsword"];
      return (wCfg && wCfg.sheet) ? wCfg.sheet : "KAI_CMB_01";
    }
    if (st.activeMount && st.activeMount !== "none" && st.day > 1 && st.day % 7 === 0) {
      return "KAI_ACT_03";
    }
    if (st.pacingMode === "turbo" && st.autoMarch) return "KAI_ACT_03";
    if (st.day === 1 && !st.autoMarch) return "KAI_ACT_01";
    return "KAI_ACT_02";
  },

  drawCombatBeatRibbon(ctx, w, h, st) {
    if (!st.inCombat) return;
    const cfg = window.CAPYBARA_CONFIG;
    const phases = [
      { id: "cast", label: "1. CAST" },
      { id: "impact", label: "2. IMPACT" },
      { id: "parry", label: "3. PARRY" },
      { id: "enemy", label: "4. ENEMY" }
    ];
    const activePhase = st.combatPhase || "intro";
    const chain = st.spellChain || { trigger: "always", modifier: "amp", payload: st.activeSchool || "starlight" };
    const school = (cfg.MAGIC_SCHOOLS || []).find(s => s.id === chain.payload) || { py: "print()", color: "#fde68a" };
    const vm = window.SpellChainVM;
    const trigLabel = vm ? ((vm.TRIGGERS.find(t => t.id === chain.trigger) || vm.TRIGGERS[0]).label) : chain.trigger;
    const modLabel = vm ? ((vm.MODIFIERS.find(m => m.id === chain.modifier) || vm.MODIFIERS[0]).label) : chain.modifier;

    const barW = Math.min(w - 20, 690);
    const barH = 22;
    const barX = (w - barW) / 2;
    const barY = h - 26;

    ctx.save();
    ctx.fillStyle = "rgba(10, 16, 32, 0.86)";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 11);
    ctx.fill();
    ctx.stroke();

    // Left half: 4-beat Sakuga pills
    let px = barX + 10;
    ctx.font = "bold 9px system-ui";
    ctx.textBaseline = "middle";
    const midY = barY + barH / 2 + 0.5;
    for (let i = 0; i < phases.length; i++) {
      const p = phases[i];
      const isAct = activePhase === p.id;
      const pillW = 58;
      if (isAct) {
        ctx.fillStyle = p.id === "parry" ? "#eab308" : "#0284c7";
        ctx.beginPath();
        ctx.roundRect(px, barY + 3, pillW, 16, 8);
        ctx.fill();
        ctx.fillStyle = p.id === "parry" ? "#0f172a" : "#ffffff";
      } else {
        ctx.fillStyle = "rgba(30, 41, 59, 0.85)";
        ctx.beginPath();
        ctx.roundRect(px, barY + 3, pillW, 16, 8);
        ctx.fill();
        ctx.fillStyle = "#94a3b8";
      }
      ctx.textAlign = "center";
      ctx.fillText(p.label, px + pillW / 2, midY);
      px += pillW + 5;
    }

    // Divider & Right half: Live Spell-Chain code trace
    if (barW >= 460) {
      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
      ctx.beginPath();
      ctx.moveTo(px + 2, barY + 4);
      ctx.lineTo(px + 2, barY + barH - 4);
      ctx.stroke();

      const codeX = px + 10;
      const castHighlight = activePhase === "cast";
      const impactHighlight = activePhase === "impact";
      ctx.textAlign = "left";
      ctx.font = "bold 10px ui-monospace, Consolas, monospace";
      const tTxt = `${trigLabel} ${modLabel}`;
      const arrowTxt = " ➔ ";
      const pTxt = `cast('${chain.payload}')`;
      ctx.fillStyle = castHighlight ? "#38bdf8" : "#94a3b8";
      ctx.fillText(tTxt, codeX, midY, barW - (codeX - barX) - 120);
      const tWidth = Math.min(ctx.measureText(tTxt).width, barW - (codeX - barX) - 120);
      ctx.fillStyle = "#64748b";
      ctx.fillText(arrowTxt, codeX + tWidth, midY);
      const aWidth = ctx.measureText(arrowTxt).width;
      ctx.fillStyle = impactHighlight ? (school.color || "#fde68a") : "#cbd5e1";
      ctx.fillText(pTxt, codeX + tWidth + aWidth, midY, Math.max(40, barX + barW - (codeX + tWidth + aWidth) - 10));
    }
    ctx.restore();
  },

  renderStage(ctx, w, h, dt) {
    const st = window.GameState;
    const cfg = window.CAPYBARA_CONFIG;
    const chObj = cfg.CHAPTERS[(st.chapter - 1) % cfg.CHAPTERS.length];
    const pacingMode = st.pacingMode || "sakuga";
    const now = Date.now();
    const inHitStop = now < this.hitStopUntil;

    // Smooth camera & actor impulse interpolation
    const lerpRate = Math.min(1, dt * 0.012);
    this.cameraZoom += (this.targetZoom - this.cameraZoom) * lerpRate;
    this.cameraFocusX += (this.targetFocusX - this.cameraFocusX) * lerpRate;
    this.heroOffsetX *= Math.pow(0.86, dt / 16);
    this.enemyOffsetX *= Math.pow(0.86, dt / 16);
    this.shakeAmount *= Math.pow(0.82, dt / 16);
    this.vignetteAlpha *= Math.pow(0.92, dt / 16);
    if (Math.abs(this.heroOffsetX) < 0.2) this.heroOffsetX = 0;
    if (Math.abs(this.enemyOffsetX) < 0.2) this.enemyOffsetX = 0;
    if (this.shakeAmount < 0.2) this.shakeAmount = 0;

    // Resolve hero sheet early so we can reset per-action frame index cleanly
    const kaiSheet = this.resolveHeroSheet(st);
    if (kaiSheet !== this.lastHeroSheet) {
      this.lastHeroSheet = kaiSheet;
      this.heroAnimFrame = 0;
    }

    // Advance 16-FPS Sakuga Variable Frame-Hold Clock (frozen during Hit-Stop!)
    if (!inHitStop) {
      this.lastTime += dt;
      const currentHold = this.getFrameHoldMs(this.frameTick, pacingMode);
      while (this.lastTime >= currentHold) {
        this.lastTime -= currentHold;
        this.frameTick = (this.frameTick + 1) % 16;
        this.heroAnimFrame = (this.heroAnimFrame + 1) % 16;
        for (let i = this.activeEffects.length - 1; i >= 0; i--) {
          const fx = this.activeEffects[i];
          if (now < fx.startAt) continue;
          if (!fx.started) {
            fx.started = true;
            fx.frame = 0;
          } else {
            fx.frame++;
          }
          const t = Math.min(1, fx.frame / Math.max(1, fx.maxFrames - 1));
          fx.x = fx.fromX + (fx.toX - fx.fromX) * t;
          fx.y = fx.fromY + (fx.toY - fx.fromY) * t;
          if (fx.frame >= fx.maxFrames) {
            this.activeEffects.splice(i, 1);
          }
        }
      }
    }

    // Clear canvas & enter dynamic Camera World Transform (Z=0.0 .. Z=6.0)
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    const shakeX = this.shakeAmount > 0 ? (Math.random() - 0.5) * 2 * this.shakeAmount : 0;
    const shakeY = this.shakeAmount > 0 ? (Math.random() - 0.5) * 2 * this.shakeAmount : 0;
    const focusPx = w * this.cameraFocusX;
    const focusPy = h * 0.62;
    ctx.translate(focusPx + shakeX, focusPy + shakeY);
    ctx.scale(this.cameraZoom, this.cameraZoom);
    ctx.translate(-focusPx, -focusPy);

    // Z=0.0: Seamless Mirrored 16:9 Parallax Biome Backdrop
    const bg = this.images[chObj.biome] || this.images["BIOME_01"];
    if (bg) {
      if (!st.inCombat && !st.awaitingChoice && !inHitStop) {
        const scrollSpeed = pacingMode === "slow" ? 0.032 : (pacingMode === "turbo" ? 0.065 : 0.045);
        this.scrollX = (this.scrollX + dt * scrollSpeed) % (w * 2);
      }
      const ox = -this.scrollX;
      ctx.drawImage(bg, ox, 0, w, h);
      ctx.save();
      ctx.translate(ox + w * 2, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(bg, 0, 0, w, h);
      ctx.restore();
      if (ox + w * 2 < w) {
        ctx.drawImage(bg, ox + w * 2, 0, w, h);
      }
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#1e3a8a");
      grad.addColorStop(1, "#14532d");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Z=0.5: Living Biome Weather VFX + Day-to-Dusk-to-Night Atmospheric Tint
    if (st.day > 20) {
      ctx.save();
      const nightAlpha = Math.min(0.28, ((st.day - 20) / 40) * 0.28);
      ctx.fillStyle = st.day >= 45 ? `rgba(15, 23, 42, ${nightAlpha})` : `rgba(120, 53, 15, ${nightAlpha * 0.65})`;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
    if (chObj.weatherVfx && this.images[chObj.weatherVfx]) {
      const driftX = (now * 0.03) % w;
      this.drawCell(ctx, chObj.weatherVfx, this.frameTick, (w - driftX) % w, h * 0.26, 92, 92, 0.42);
      this.drawCell(ctx, chObj.weatherVfx, (this.frameTick + 6) % 16, (w * 0.55 - driftX * 0.7 + w) % w, h * 0.36, 80, 80, 0.34);
    }

    const kaiX = w * 0.28 + this.heroOffsetX;
    const kaiY = h * 0.70;
    const bob = Math.sin(now * 0.007) * 2.2;
    const status = st.heroStatus || "none";

    // Z=1.0: Smaller Randomly-Placed Stage-Locked Roadside Prop (64x64)
    const stageProps = (cfg.STAGE_LOCKED_PROPS_V4_2 || {})[st.chapter] || ["VFX_MISC_25"];
    if (!st.inCombat && !st.roadsideNpc && !st.propCollected) {
      const propSheet = stageProps[st.day % stageProps.length];
      const pp = st.propPos || { rx: 0.56, ry: 0.70 };
      const propX = w * pp.rx;
      const propY = h * pp.ry;
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath();
      ctx.ellipse(propX, propY + 24, 24, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.55)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(propX, propY + 2, 24 + Math.sin(now * 0.006) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      this.drawCell(ctx, propSheet, this.frameTick, propX, propY, 64, 64, 0.94);

      if (st.chapter === 1 && !st.tutorialDone && (st.tutorialStep || 0) === 0 && !st.tutorialStageClicked) {
        ctx.save();
        ctx.fillStyle = "rgba(2, 132, 199, 0.92)";
        ctx.beginPath();
        ctx.roundRect(propX - 28, propY - 46 + bob, 56, 16, 8);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("✨ CLICK", propX, propY - 35 + bob);
        ctx.restore();
      }
    }

    // Z=1.2: SOCKET_GROUND_POOL + Sequenced Low-Z Cast Circles
    if (status === "poison") {
      this.drawCell(ctx, "EXP_LINK_18", this.frameTick, kaiX, kaiY + 26, 140, 140, 0.85);
    }
    this.drawEffectsByZ(ctx, 0, 2);

    // Z=1.5: SOCKET_BACK_HEMISPHERE (Behind Hero Kai) & Pythonic Overclock Holo-Ring
    if ((st.overclockDays || 0) > 0) {
      this.drawCell(ctx, "EXP_LINK_42", this.frameTick, kaiX, kaiY - 4, 166, 166, 0.78);
    }
    if (st.hero.rage >= 100) {
      this.drawCell(ctx, "EXP_LINK_19", this.frameTick, kaiX, kaiY - 6, 166, 166, 0.88);
    } else if (st.hero.shield > 0) {
      this.drawCell(ctx, "EXP_LINK_13", this.frameTick, kaiX, kaiY, 158, 158, 0.80);
    }

    // Z=2.5: Companion Pets & Rideable Mount (Strict non-mixed row ranges!)
    const petCfg = cfg.SPIRIT_PETS.find(p => p.id === st.activePet) || cfg.SPIRIT_PETS[0];
    const stringSheet = (status === "confuse" || status === "poison" || status === "freeze" || status === "silence")
      ? "EXP_LINK_32" : "EXP_LINK_31";
    const mantisSheet = (status !== "none") ? "EXP_LINK_34" : "EXP_LINK_33";
    const mountCfg = st.activeMount !== "none" ? (cfg.MOUNTS.find(m => m.id === st.activeMount) || null) : null;
    const mountSheet = mountCfg ? mountCfg.sheet : null;

    if (mountSheet) {
      const mountFrame = mountCfg.rowStart !== undefined
        ? mountCfg.rowStart * 4 + (this.frameTick % ((mountCfg.rowCount || 2) * 4))
        : this.frameTick;
      this.drawCell(ctx, mountSheet, mountFrame, kaiX - 58, kaiY + 14, 104, 104);
    } else {
      const petFrame = petCfg.rowStart !== undefined
        ? petCfg.rowStart * 4 + (this.frameTick % ((petCfg.rowCount || 2) * 4))
        : this.frameTick;
      this.drawCell(ctx, petCfg.id === "string" ? stringSheet : petCfg.sheet, petFrame, kaiX - 94, kaiY + 14, 98, 98);
      this.drawCell(ctx, mantisSheet, this.frameTick, kaiX - 50, kaiY - 46, 82, 82);
    }

    // Z=3.0 & Z=3.2: Hero Kai + 4-Tier Armor Aura (MOD_B08_04 / CG_B01_02)
    const armorObj = (cfg.ARMORS_DB && cfg.ARMORS_DB[st.activeArmor || "moss_cloak"]) || { auraColor: "#4ade80", armorRow: 1, paperDollCell: 5 };
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(kaiX, h * 0.85, 42, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    if (armorObj.auraColor) {
      ctx.strokeStyle = armorObj.auraColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.ellipse(kaiX, h * 0.85, 46, 12, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    this.drawCell(ctx, kaiSheet, this.heroAnimFrame, kaiX, kaiY, 146, 146, 1.0, "source-over", false);

    // Z=4.0: Smaller Randomized Street Pickup (48x48, anywhere on road/sky)
    if (!st.inCombat && st.activeStreetPickup) {
      const pk = st.activeStreetPickup;
      const pkX = pk.rx !== undefined ? w * pk.rx : pk.x;
      const pkY = (pk.ry !== undefined ? h * pk.ry : pk.y) + bob * 1.2;
      ctx.save();
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(pkX, pkY + 4, 21, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      this.drawCell(ctx, pk.key, this.frameTick, pkX, pkY, 48, 48, 1.0);
      ctx.save();
      ctx.fillStyle = "rgba(15,23,42,0.88)";
      ctx.beginPath();
      ctx.roundRect(pkX - 24, pkY - 34, 48, 14, 7);
      ctx.fill();
      ctx.fillStyle = "#fde68a";
      ctx.font = "bold 9px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("✨ Grab", pkX, pkY - 24);
      ctx.restore();
    }

    // Z=4.5: Gate 3C Hollow-Rim Front Shield (0% center alpha) & Waist-Down Status Overlays
    if (st.hero.shield > 0) {
      const shieldSheet = st.hero.shield > 150 ? "EXP_LINK_11" : "EXP_LINK_12";
      this.drawCell(ctx, shieldSheet, this.frameTick, kaiX, kaiY, 158, 158, 0.56, "screen");
    }
    if (status === "freeze") {
      this.drawCell(ctx, "EXP_LINK_14", this.frameTick, kaiX, kaiY + 12, 144, 144, 0.88);
    } else if (status === "bleed") {
      this.drawCell(ctx, "EXP_LINK_16", this.frameTick, kaiX, kaiY - 28, 114, 114, 0.95);
    } else if (status === "burn") {
      this.drawCell(ctx, "EXP_LINK_17", this.frameTick, kaiX, kaiY - 56, 94, 94, 0.95);
    }

    // Z=5.5: SOCKET_CROWN_HALO (Strict Overhead y - 62px)
    if (status === "confuse" || status === "stun" || status === "silence" || st.awaitingChoice) {
      const haloRow = status === "confuse" ? 0 : status === "stun" ? 1 : status === "silence" ? 2 : 3;
      this.drawCell(ctx, "EXP_LINK_15", haloRow * 4 + (this.frameTick % 4), kaiX, kaiY - 62, 112, 112, 0.95);
    }

    // Z=5.0: Enemy / Boss or Roadside Special NPC (Facing LEFT toward Hero Kai via ACTOR_FLIP_X_MAP!)
    const actor = st.enemy || st.roadsideNpc;
    let actorMeta = null;
    if (actor) {
      const enmX = w * 0.73 + this.enemyOffsetX;
      const enmY = h * 0.68;
      const isBoss = !!actor.isBoss;
      const drawSize = isBoss ? 172 : 140;
      const flipActor = actor.flipX !== undefined
        ? !!actor.flipX
        : !!(cfg.ACTOR_FLIP_X_MAP && cfg.ACTOR_FLIP_X_MAP[actor.sheetId]);
      actorMeta = { actor, enmX, enmY, isBoss };

      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.40)";
      ctx.beginPath();
      ctx.ellipse(enmX, h * 0.85, isBoss ? 52 : 38, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const rowOffset = actor.animRow !== undefined ? actor.animRow * 4 : (st.inCombat ? 4 : 0);
      const frame = rowOffset + (this.frameTick % 4);
      const flashAlpha = now < this.enemyFlashUntil ? 0.55 : 1.0;
      this.drawCell(ctx, actor.sheetId, frame, enmX, enmY, drawSize, drawSize, flashAlpha, "source-over", flipActor);
      if (now < this.enemyFlashUntil) {
        this.drawCell(ctx, actor.sheetId, frame, enmX, enmY, drawSize, drawSize, 0.65, "lighter", flipActor);
      }

      if (actor.hp !== undefined) {
        this.drawCell(ctx, actor.staggered ? "EXP_LINK_40" : "EXP_LINK_37", this.frameTick, enmX, enmY - 82, 74, 74, 0.85);
        if (isBoss && (actor.staggerPips <= 1 || actor.staggered)) {
          this.drawCell(ctx, "EXP_LINK_36", this.frameTick, enmX, enmY - 40, 134, 134, 0.80);
        }
      }
    }

    // Z=6.0: Mid-layer sequenced spell travel & high VFX inside camera frame
    this.drawEffectsByZ(ctx, 3, 9);

    if (st.parryWindowOpen) {
      this.drawCell(ctx, "EXP_LINK_27", this.frameTick, kaiX, kaiY, 136, 136, 0.90);
      const totalMs = st.parryWindowDurationMs || 1050;
      const remainRatio = st.parryWindowEndsAt ? Math.max(0, Math.min(1, (st.parryWindowEndsAt - now) / totalMs)) : 0.6;
      const ringRadius = 36 + remainRatio * 42;
      ctx.save();
      ctx.strokeStyle = remainRatio < 0.35 ? "#38bdf8" : "#facc15";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(kaiX, kaiY, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#fde68a";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("🛡️ PARRY! [SPACE]", kaiX, kaiY - 76);
      ctx.restore();
    }
    if (status === "freeze" || status === "confuse" || status === "silence") {
      this.drawCell(ctx, "EXP_LINK_28", this.frameTick, kaiX + 54, kaiY - 46, 78, 78, 0.92);
    }
    if (inHitStop) {
      this.drawCell(ctx, "EXP_LINK_29", 9, w * 0.72, h * 0.62, 148, 148, 0.88);
    }

    // Restore World Camera Transform before drawing screen-space HUD & Vignette
    ctx.restore();

    // Subtle Sakuga Dramatic Vignette during Ultimates / Crits
    if (this.vignetteAlpha > 0.01) {
      ctx.save();
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.2, w * 0.5, h * 0.5, w * 0.7);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, `rgba(2, 6, 23, ${Math.min(0.55, this.vignetteAlpha)})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // Z=7.0: Screen-Space Enemy / Boss Tactical HUD Plate
    if (actorMeta) {
      const { actor: act, enmX, isBoss } = actorMeta;
      ctx.save();
      const titleTxt = act.name + (act.bug ? ` [${act.bug}]` : "");
      ctx.font = "bold 11px system-ui";
      const boxW = Math.min(350, Math.max(246, Math.ceil(ctx.measureText(titleTxt).width) + 28));
      const boxH = act.hp !== undefined ? (isBoss ? 52 : 38) : 26;
      const boxX = Math.max(10, Math.min(w - boxW - 10, enmX - boxW / 2));
      const boxCenterX = boxX + boxW / 2;
      const boxY = 10;
      ctx.fillStyle = "rgba(15,23,42,0.88)";
      ctx.strokeStyle = isBoss ? "#ef4444" : "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isBoss ? "#fca5a5" : "#fde68a";
      ctx.textAlign = "center";
      ctx.fillText(titleTxt, boxCenterX, boxY + 15, boxW - 16);

      if (act.hp !== undefined) {
        const maxHp = act.maxHp || Math.max(1, act.hp);
        const pct = Math.max(0, Math.min(1, act.hp / maxHp));
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(boxX + 12, boxY + 21, boxW - 24, 10);
        ctx.fillStyle = isBoss ? "#ef4444" : "#f59e0b";
        ctx.fillRect(boxX + 12, boxY + 21, (boxW - 24) * pct, 10);
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 9px system-ui";
        ctx.fillText(`${Math.max(0, Math.ceil(act.hp))} / ${maxHp} HP`, boxCenterX, boxY + 29);

        if (isBoss) {
          const pips = act.staggerPips !== undefined ? act.staggerPips : 3;
          ctx.textAlign = "left";
          ctx.fillStyle = act.staggered ? "#38bdf8" : "#cbd5e1";
          ctx.font = "bold 9px system-ui";
          ctx.fillText(act.staggered ? "💥 STAGGERED (1.75× DMG)" : "STAGGER:", boxX + 12, boxY + 45);
          if (!act.staggered) {
            for (let i = 0; i < 3; i++) {
              ctx.fillStyle = i < pips ? "#facc15" : "#334155";
              ctx.fillRect(boxX + 70 + i * 24, boxY + 37, 20, 8);
            }
          }
        }
      }
      ctx.restore();
    }

    // Z=7.2: Live HUD "Kai-Cam" Portrait + 4-Tier Armor Paper-Doll Badge
    const camSheet = (status === "bleed" || status === "poison" || status === "confuse" || status === "freeze")
      ? (this.images["KAICAM_STATUS"] ? "KAICAM_STATUS" : "EXP_LINK_22") : "EXP_LINK_21";
    const camRow = status === "poison" ? 1 : status === "confuse" ? 2 : status === "freeze" ? 3 : (st.awaitingChoice ? 1 : (st.hero.shield > 0 ? 2 : 0));
    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.82)";
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(42, 42, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    this.drawCell(ctx, camSheet, camRow * 4 + (this.frameTick % 4), 42, 42, 54, 54, 1.0);

    if (this.images["MOD_B08_04"] || this.images["CG_B01_02"]) {
      ctx.save();
      ctx.fillStyle = "rgba(15,23,42,0.84)";
      ctx.strokeStyle = armorObj.auraColor || "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(96, 42, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      const pdSheet = this.images["MOD_B08_04"] ? "MOD_B08_04" : "CG_B01_02";
      this.drawCell(ctx, pdSheet, armorObj.paperDollCell !== undefined ? armorObj.paperDollCell : 5, 96, 42, 38, 38, 1.0);
    }

    // Z=7.5: Floating Combat & Loot Text Popups
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= dt * 0.04;
      ft.life -= dt * 0.0011;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, ft.life));
      ctx.font = `900 ${Math.round(14 * (ft.scale || 1))}px system-ui`;
      ctx.textAlign = "center";
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 4;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = ft.color || "#fde68a";
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    // Z=7.8: Live Sakuga Combat Beat & Python Spell-Chain Timeline Ribbon
    this.drawCombatBeatRibbon(ctx, w, h, st);

    this.renderPreviewCanvases();
  }
};
