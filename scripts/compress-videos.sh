#!/bin/bash
# Compress videos to web-optimized MP4 (Mobile-Safe)
# Settings: 1080p, 30fps, H.264 Main Profile, yuv420p (iOS/Android compatible)

VIDEOS_DIR="public/images/videos"
COMPRESSED_DIR="$VIDEOS_DIR/compressed"

mkdir -p "$COMPRESSED_DIR"

echo "🎬 Starting video compression (mobile-safe encoding)..."
echo "📁 Output directory: $COMPRESSED_DIR"
echo ""

compress_video() {
  local input="$1"
  local filename=$(basename "$input" .mov)
  local output="$COMPRESSED_DIR/${filename}.mp4"
  
  echo "📤 Compressing: $filename.mov"
  echo "   Output: ${filename}.mp4"
  
  ffmpeg -i "$input" \
    -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30" \
    -c:v libx264 \
    -profile:v main \
    -level 4.0 \
    -pix_fmt yuv420p \
    -preset medium \
    -crf 23 \
    -movflags +faststart \
    -an \
    -y \
    "$output"
  
  local input_size=$(du -h "$input" | cut -f1)
  local output_size=$(du -h "$output" | cut -f1)
  
  echo "✅ Done! $input_size → $output_size"
  echo ""
}

# Compress all videos
compress_video "$VIDEOS_DIR/home-bg.mov"
compress_video "$VIDEOS_DIR/tours-bg.mov"
compress_video "$VIDEOS_DIR/transfers-bg.mov"
compress_video "$VIDEOS_DIR/bg-about.mov"
compress_video "$VIDEOS_DIR/bg-contact.mov"

echo "🎉 All videos compressed!"
echo ""
echo "Next steps:"
echo "1. Check the compressed videos in: $COMPRESSED_DIR"
echo "2. Upload them to DigitalOcean Spaces"
echo "3. Update code to use .mp4 CDN URLs"
