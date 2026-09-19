#!/bin/bash
# Konverzija sirovog materijala iz _raw-media u web verzije koje idu u git.
#
# Zahteva ffmpeg u PATH-u.
# Pokretanje iz korena projekta:  bash scripts/convert-media.sh
#
# Ulaz:
#   _raw-media/Zeka360/*.insp                     Insta360 dual fisheye 360 slike
#   _raw-media/Zeka360/**/*.mp4 i *.MP4           originalni dron i telefon snimci
# Izlaz:
#   public/images/360/panorame/pano-NNN.webp      6000x3000 equirectangular
#   public/videos/*.mp4                           1080p, 30fps, faststart
#   public/videos/posteri/*.webp                  poster sličica za svaki klip

set -euo pipefail

RAW="_raw-media/Zeka360"
PANO_OUT="public/images/360/panorame"
VID_OUT="public/videos"
POS_OUT="$VID_OUT/posteri"

# FOV objektiva za stitch. 200 je izmereno na ovom materijalu: ispod te vrednosti
# se detalji na šavu dupliraju (luster se pojavi dva puta), iznad se razvlače.
FOV=200

mkdir -p "$PANO_OUT" "$VID_OUT" "$POS_OUT"

echo "== 360 panorame =="
for f in "$RAW"/*.insp; do
  [ -e "$f" ] || { echo "  (nema .insp fajlova)"; break; }
  num=$(basename "$f" .insp | sed 's/.*_\([0-9]\{3\}\)$/\1/')
  ffmpeg -y -v error -i "$f" \
    -vf "v360=dfisheye:equirect:ih_fov=$FOV:iv_fov=$FOV:w=6000:h=3000" \
    -c:v libwebp -quality 82 -compression_level 5 -preset photo \
    "$PANO_OUT/pano-$num.webp"
  echo "  pano-$num.webp  $(du -k "$PANO_OUT/pano-$num.webp" | cut -f1)KB"
done

echo "== video =="
# $1 = izvorni fajl, $2 = ime bez ekstenzije, $3 = ciljna sirina
enc() {
  ffmpeg -y -v error -i "$1" -r 30 -vf "scale=$3:-2" \
    -c:v libx264 -crf 26 -preset medium -pix_fmt yuv420p -profile:v high -level 4.1 \
    -movflags +faststart -c:a aac -b:a 128k "$VID_OUT/$2.mp4"
  ffmpeg -y -v error -ss 1 -i "$VID_OUT/$2.mp4" -frames:v 1 \
    -vf "scale=1280:-2" -c:v libwebp -quality 80 "$POS_OUT/$2.webp"
  echo "  $2.mp4  $(du -m "$VID_OUT/$2.mp4" | cut -f1)MB"
}

# Vertikalni klipovi zadrzavaju 1080 sirine, horizontalni 4K se spusta na 1920.
while IFS= read -r src; do
  w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$src")
  h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$src")
  name=$(basename "$src" | sed 's/\.[Mm][Pp]4$//' | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
  if [ "$w" -gt "$h" ]; then enc "$src" "$name" 1920; else enc "$src" "$name" 1080; fi
done < <(find "$RAW" -type f -iname "*.mp4" | sort)

echo
echo "Gotovo."
du -sh "$PANO_OUT" "$VID_OUT"
