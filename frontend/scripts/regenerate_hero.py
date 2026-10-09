"""
Regenerate hero JPEG variants from a master image.

Usage (from repo root):
  python frontend/scripts/regenerate_hero.py
  python frontend/scripts/regenerate_hero.py path/to/banner.png

If the master is smaller than 2170×725, it is upscaled with stepped Lanczos.
Place a native 2170×725 file at frontend/public/images/hero-source.jpg.png
for the sharpest result (do not send via chat — export from design tool).
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

TARGET_W, TARGET_H = 2170, 725
DESKTOP_W = 1920
MOBILE_LEFT = 0.28
MOBILE_RIGHT = 0.96


def upscale_to_master(img: Image.Image) -> Image.Image:
    w, h = img.size
    if w >= TARGET_W and h >= TARGET_H:
        return img.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
    current = img
    while current.size[0] < TARGET_W:
        nw = min(int(current.size[0] * 1.5), TARGET_W)
        nh = round(current.size[1] * nw / current.size[0])
        current = current.resize((nw, nh), Image.Resampling.LANCZOS)
    return current.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)


def main() -> None:
    images_dir = Path(__file__).resolve().parents[1] / "public" / "images"
    if len(sys.argv) > 1:
        source_path = Path(sys.argv[1]).resolve()
    else:
        source_path = images_dir / "hero-source.jpg.png"
        if not source_path.exists():
            source_path = images_dir / "hero-source.jpg"

    if not source_path.exists():
        raise SystemExit(f"Master not found: {source_path}")

    img = Image.open(source_path).convert("RGB")
    print(f"Input: {source_path.name} {img.size}")

    master = upscale_to_master(img)
    master.save(images_dir / "hero-source.jpg.png", compress_level=1)
    master.save(images_dir / "hero-source.jpg", quality=95, subsampling=0, optimize=True)
    master.save(images_dir / "hero-2x.jpg", quality=93, subsampling=0, optimize=True)

    desktop_h = round(TARGET_H * DESKTOP_W / TARGET_W)
    desktop = master.resize((DESKTOP_W, desktop_h), Image.Resampling.LANCZOS)
    desktop.save(images_dir / "hero-desktop.jpg", quality=92, subsampling=0, optimize=True)
    desktop.save(images_dir / "hero.jpg", quality=92, subsampling=0, optimize=True)

    left = int(TARGET_W * MOBILE_LEFT)
    right = int(TARGET_W * MOBILE_RIGHT)
    mobile = master.crop((left, 0, right, TARGET_H))
    mobile.save(images_dir / "hero-mobile.jpg", quality=92, subsampling=0, optimize=True)

    print(f"Master:  {master.size}")
    print(f"Desktop: {desktop.size}")
    print(f"Mobile:  {mobile.size}")
    print("Done.")


if __name__ == "__main__":
    main()
