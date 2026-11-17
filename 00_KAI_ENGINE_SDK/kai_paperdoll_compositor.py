#!/usr/bin/env python3
"""
Hero Kai Paper-Doll & Head-Lock Sprite Compositor (kai_paperdoll_compositor.py)
Composites modular Z-layers (armor, weapons, accessories, spell VFX) onto sealed
4x4 unarmed socket mannequins with 0% AI generation drift, plus optional
--lock-head neck-socket grafting from a canonical head-cutout sheet.
"""

import argparse
import json
from pathlib import Path
from typing import List, Optional, Tuple
from PIL import Image


def composite_sheets(
    base_path: Path,
    overlay_paths: List[Path],
    output_path: Path,
    head_lock_path: Optional[Path] = None,
    head_offset: Tuple[int, int] = (0, 0),
    cols: int = 4,
    rows: int = 4,
) -> Path:
    base = Image.open(base_path).convert("RGBA")
    w, h = base.size
    cw, ch = w // cols, h // rows

    for ov_path in overlay_paths:
        ov = Image.open(ov_path).convert("RGBA")
        if ov.size != (w, h):
            ov = ov.resize((w, h), Image.Resampling.LANCZOS)
        base = Image.alpha_composite(base, ov)

    if head_lock_path is not None:
        head_sheet = Image.open(head_lock_path).convert("RGBA")
        if head_sheet.size != (w, h):
            head_sheet = head_sheet.resize((w, h), Image.Resampling.LANCZOS)
        dx, dy = head_offset
        for r in range(rows):
            for c in range(cols):
                x0, y0 = c * cw, r * ch
                cell_head = head_sheet.crop((x0, y0, x0 + cw, y0 + ch))
                # Only graft upper 42% of cell (crown + face) onto neck anchor
                head_crop = cell_head.crop((0, 0, cw, int(ch * 0.42)))
                base.alpha_composite(head_crop, dest=(x0 + dx, y0 + dy))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    base.save(output_path, "PNG")
    return output_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Deterministic 4x4 Paper-Doll & Head-Lock Compositor")
    parser.add_argument("--base", type=Path, required=True, help="Sealed unarmed mannequin 4x4 PNG")
    parser.add_argument("--overlay", type=Path, action="append", default=[], help="Modular gear or VFX 4x4 PNG (can repeat)")
    parser.add_argument("--lock-head", type=Path, default=None, help="Optional canonical head/face 4x4 PNG to graft onto neck")
    parser.add_argument("--head-dx", type=int, default=0)
    parser.add_argument("--head-dy", type=int, default=0)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()

    out = composite_sheets(
        args.base,
        args.overlay,
        args.out,
        head_lock_path=args.lock_head,
        head_offset=(args.head_dx, args.head_dy),
    )
    print(json.dumps({"status": "composited", "output": str(out), "overlays": len(args.overlay), "head_locked": args.lock_head is not None}))


if __name__ == "__main__":
    main()
