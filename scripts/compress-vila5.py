"""
Kompresija materijala za Vilu 5.

Ulaz:  public/images/VILA 5/<brojevi stanova>/{*.pdf, *.png}
       (naziv foldera i PDF-a su merodavni, naziv PNG-a je nebitan)
Izlaz: public/images/vila5/pdf/stan-<brojevi>.pdf       A3 list stana, 150 dpi JPEG
       public/images/vila5/osnove/stan-<brojevi>.webp   isti list kao slika za sajt
       public/images/vila5/3d/stan-<brojevi>.webp       3D prikaz (identične slike se čuvaju jednom)

Pokretanje (iz korena projekta): python scripts/compress-vila5.py [folder sa originalima]
Potrebno: pip install pymupdf pillow
"""
import hashlib
import io
import json
import os
import re
import sys

import pymupdf
from PIL import Image, ImageDraw, ImageFont

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join("public", "images", "VILA 5")
DST = os.path.join("public", "images", "vila5")

PDF_DPI = 150
PDF_JPEG_QUALITY = 75
PLAN_WIDTH = 2400
PLAN_QUALITY = 78
IMG3D_WIDTH = 2000
IMG3D_QUALITY = 80

# Greške u originalnim PDF listovima: brojevi iz naziva foldera -> {pogrešan tekst: ispravan tekst}.
# Ispravka se crta preko renderovanog lista istim fontom (Calibri Bold) i bojom; original ostaje netaknut.
TEXT_FIXES = {
    "2": {"Trosoban stan": "Dvosoban stan"},
}
FIX_FONT = "C:/Windows/Fonts/calibrib.ttf"


def numbers(name):
    return [int(n) for n in re.findall(r"\d+", name)]


def key(nums):
    return "-".join(str(n) for n in nums)


def size(path):
    return os.path.getsize(path)


def mb(n):
    return f"{n / 1024 / 1024:.2f}MB"


def find_span(page, needle):
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            for span in line["spans"]:
                if needle in span["text"]:
                    return span
    return None


def redraw_text(img, span, new_text, scale):
    """Prekriva stari tekst bojom pozadine i ispisuje novi, centrirano na istoj liniji."""
    x0, y0, x1, y1 = (round(v * scale) for v in span["bbox"])
    region = img.crop((x0, y0, x1, y1))
    pixels = sorted(region.getdata(), key=sum)
    background = pixels[len(pixels) // 10]
    bright = pixels[int(len(pixels) * 0.9):]
    color = bright[len(bright) // 2]
    # bbox iz PDF-a je širi od samih slova, pa se centrira po stvarnim pikselima teksta
    text_box = region.convert("L").point(lambda v: 255 if v > 60 else 0).getbbox()
    center_x = x0 + (text_box[0] + text_box[2]) / 2 if text_box else (x0 + x1) / 2
    pad = round(4 * scale)
    draw = ImageDraw.Draw(img)
    draw.rectangle((x0 - pad, y0, x1 + pad, y1), fill=background)
    font = ImageFont.truetype(FIX_FONT, span["size"] * scale)
    draw.text((center_x, span["origin"][1] * scale), new_text, font=font, fill=color, anchor="ms")


def compress_pdf(src_path, nums, fixes):
    doc = pymupdf.open(src_path)
    page = doc[0]
    text = page.get_text()
    scale = PDF_DPI / 72
    pix = page.get_pixmap(dpi=PDF_DPI, alpha=False)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)

    for old, new in fixes.items():
        span = find_span(page, old)
        if span is None:
            print(f"UPOZORENJE: tekst '{old}' nije pronađen u {src_path}")
            continue
        redraw_text(img, span, new, scale)
        text = text.replace(old, new)
        print(f"ISPRAVKA {key(nums)}: '{old}' -> '{new}'")

    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=PDF_JPEG_QUALITY, optimize=True, progressive=True)
    out = pymupdf.open()
    new_page = out.new_page(width=page.rect.width, height=page.rect.height)
    new_page.insert_image(new_page.rect, stream=buf.getvalue())
    out.set_metadata({
        "title": f"Vila 5 · Stan {', '.join(str(n) for n in nums)}",
        "author": "Kralj Residence",
        "subject": "Stambeni objekat Vila 5, Vrnjačka Banja",
    })
    pdf_out = os.path.join(DST, "pdf", f"stan-{key(nums)}.pdf")
    out.save(pdf_out, garbage=4, deflate=True)

    plan = img.resize((PLAN_WIDTH, round(img.height * PLAN_WIDTH / img.width)), Image.LANCZOS)
    plan_out = os.path.join(DST, "osnove", f"stan-{key(nums)}.webp")
    plan.save(plan_out, "WEBP", quality=PLAN_QUALITY, method=6)

    kind = re.search(r"(\w+soban)\s+stan", text, re.I)
    area = re.search(r"P\s*=\s*([\d.,]+)\s*m2", text)
    return pdf_out, plan_out, (kind.group(1).capitalize() if kind else None), (area.group(1) if area else None)


def main():
    if not os.path.isdir(SRC):
        sys.exit(f"Nema foldera {SRC}")
    for sub in ("pdf", "osnove", "3d"):
        os.makedirs(os.path.join(DST, sub), exist_ok=True)

    before = after = 0
    manifest = {}
    png_groups = {}  # md5 -> {"path": ..., "nums": [...]}

    folders = sorted(
        (f for f in os.listdir(SRC) if os.path.isdir(os.path.join(SRC, f))),
        key=lambda f: numbers(f)[0],
    )
    for folder in folders:
        nums = numbers(folder)
        full = os.path.join(SRC, folder)
        for name in os.listdir(full):
            path = os.path.join(full, name)
            before += size(path)
            if name.lower().endswith(".pdf"):
                if numbers(name) != nums:
                    print(f"UPOZORENJE: PDF {name} ne odgovara folderu {folder}")
                pdf_out, plan_out, kind, area = compress_pdf(path, nums, TEXT_FIXES.get(key(nums), {}))
                after += size(pdf_out) + size(plan_out)
                print(f"{folder:14s} PDF {mb(size(path))} -> {mb(size(pdf_out))}  osnova {mb(size(plan_out))}  {kind} {area}")
                for n in nums:
                    manifest.setdefault(n, {}).update(pdf=pdf_out, plan=plan_out, type=kind, area=area, group=key(nums))
            elif name.lower().endswith(".png"):
                digest = hashlib.md5(open(path, "rb").read()).hexdigest()
                group = png_groups.setdefault(digest, {"path": path, "nums": []})
                group["nums"].extend(nums)

    for group in png_groups.values():
        nums = sorted(group["nums"])
        img = Image.open(group["path"])
        corner_alpha = img.getpixel((0, 0))[3] if img.mode == "RGBA" else None
        w = min(IMG3D_WIDTH, img.width)
        out = os.path.join(DST, "3d", f"stan-{key(nums)}.webp")
        img.resize((w, round(img.height * w / img.width)), Image.LANCZOS).save(
            out, "WEBP", quality=IMG3D_QUALITY, alpha_quality=80, method=6
        )
        after += size(out)
        print(f"3D  {os.path.relpath(group['path'], SRC):32s} -> {os.path.basename(out)} {mb(size(out))} (alfa u uglu: {corner_alpha})")
        for n in nums:
            manifest.setdefault(n, {})["img3d"] = out

    print(f"\nUKUPNO: {mb(before)} -> {mb(after)}")
    for n in sorted(manifest):
        print(n, json.dumps(manifest[n], ensure_ascii=False))


if __name__ == "__main__":
    main()
