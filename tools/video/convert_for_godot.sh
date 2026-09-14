#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 input.mp4 output.ogv"
  exit 1
fi

INPUT="$1"
OUTPUT="$2"

# Godot 4.x lit nativement Ogg Theora. On garde le MP4 comme master de montage,
# puis on fabrique un .ogv destiné à l'application.
ffmpeg -y -i "$INPUT" \
  -vf "scale=1280:960:force_original_aspect_ratio=decrease,pad=1280:960:(ow-iw)/2:(oh-ih)/2:color=black,fps=30" \
  -c:v libtheora -q:v 7 \
  -c:a libvorbis -q:a 5 \
  -ac 2 \
  "$OUTPUT"

echo "Godot cinematic ready: $OUTPUT"
