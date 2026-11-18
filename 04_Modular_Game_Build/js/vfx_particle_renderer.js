window.VFXRenderer = {
  activeEffects: [],
  popups: [],

  spawnProjectile(type, startX, startY, endX, endY, sheetKey, row, col, duration = 0.45) {
    this.activeEffects.push({
      kind: "projectile", type, startX, startY, endX, endY,
      sheetKey, row, col, elapsed: 0, duration
    });
  },

  spawnBurst(sheetKey, frames, x, y, size = 150, duration = 0.5) {
    this.activeEffects.push({
      kind: "anim", sheetKey, frames, x, y, size, elapsed: 0, duration
    });
  },

  spawnPopup(text, x, y, color = "#facc15") {
    this.popups.push({ text, x, y, color, elapsed: 0, duration: 0.9 });
  },

  update(dt) {
    for (let i = this.activeEffects.length - 1; i >= 0; i--) {
      this.activeEffects[i].elapsed += dt;
      if (this.activeEffects[i].elapsed >= this.activeEffects[i].duration) {
        this.activeEffects.splice(i, 1);
      }
    }
    for (let i = this.popups.length - 1; i >= 0; i--) {
      this.popups[i].elapsed += dt;
      this.popups[i].y -= dt * 32;
      if (this.popups[i].elapsed >= this.popups[i].duration) {
        this.popups.splice(i, 1);
      }
    }
  },

  draw(ctx, atlases) {
    const C = window.CAPYBARA_CONFIG.CELL_SIZE;
    for (const fx of this.activeEffects) {
      const img = atlases[fx.sheetKey];
      if (!img) continue;
      const t = Math.min(1, fx.elapsed / fx.duration);
      if (fx.kind === "projectile") {
        // Curved Bezier arc for Flying Daggers & projectiles
        const cx = (fx.startX + fx.endX) / 2;
        const cy = Math.min(fx.startY, fx.endY) - 90;
        const px = (1 - t) * (1 - t) * fx.startX + 2 * (1 - t) * t * cx + t * t * fx.endX;
        const py = (1 - t) * (1 - t) * fx.startY + 2 * (1 - t) * t * cy + t * t * fx.endY;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(t * Math.PI * 3);
        ctx.drawImage(img, fx.col * C, fx.row * C, C, C, -48, -48, 96, 96);
        ctx.restore();
      } else if (fx.kind === "anim") {
        const idx = Math.min(fx.frames.length - 1, Math.floor(t * fx.frames.length));
        const [r, c] = fx.frames[idx];
        ctx.drawImage(img, c * C, r * C, C, C, fx.x - fx.size / 2, fx.y - fx.size / 2, fx.size, fx.size);
      }
    }

    for (const p of this.popups) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - p.elapsed / p.duration);
      ctx.font = "900 20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#0f172a";
      ctx.strokeText(p.text, p.x, p.y);
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.x, p.y);
      ctx.restore();
    }
  }
};
