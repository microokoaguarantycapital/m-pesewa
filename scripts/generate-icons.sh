#!/bin/bash
# scripts/generate-icons.sh
# ImageMagick-based icon generator

echo "🔧 M-PESEWA Icon Generator (ImageMagick)"
echo "========================================="

# Check for ImageMagick
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found!"
    echo "   Please install ImageMagick first:"
    echo "   - macOS: brew install imagemagick"
    echo "   - Ubuntu/Debian: sudo apt install imagemagick"
    echo "   - Windows: Download from https://imagemagick.org"
    exit 1
fi

# Check for logo
LOGO_PATH="../assets/images/logo.svg"
if [ ! -f "$LOGO_PATH" ]; then
    echo "⚠️  Logo not found at $LOGO_PATH"
    echo "   Please create a logo.svg file first"
    exit 1
fi

# Create directories
mkdir -p "../assets/images/icons"
mkdir -p "../assets/images/placeholders"

echo "📁 Creating PWA icons..."

# Standard PWA icons
declare -a SIZES=("72" "96" "128" "144" "152" "192" "384" "512")
for size in "${SIZES[@]}"; do
    output="../assets/images/icons/icon-${size}x${size}.png"
    convert "$LOGO_PATH" -resize "${size}x${size}" "$output"
    echo "  ✓ icon-${size}x${size}.png"
done

# Favicons
declare -a FAVICON_SIZES=("16" "32" "64")
for size in "${FAVICON_SIZES[@]}"; do
    output="../assets/images/icons/favicon-${size}x${size}.png"
    convert "$LOGO_PATH" -resize "${size}x${size}" "$output"
    echo "  ✓ favicon-${size}x${size}.png"
done

# Apple Touch Icons
declare -a APPLE_SIZES=("57" "60" "72" "76" "114" "120" "144" "152" "167" "180")
for size in "${APPLE_SIZES[@]}"; do
    output="../assets/images/icons/apple-touch-icon-${size}x${size}.png"
    convert "$LOGO_PATH" -resize "${size}x${size}" "$output"
done
convert "$LOGO_PATH" -resize "180x180" "../assets/images/icons/apple-touch-icon.png"
echo "  ✓ apple-touch-icon.png"

# Android icons
declare -a ANDROID_SIZES=("36" "48" "72" "96" "144" "192")
for size in "${ANDROID_SIZES[@]}"; do
    output="../assets/images/icons/android-icon-${size}x${size}.png"
    convert "$LOGO_PATH" -resize "${size}x${size}" "$output"
done

echo "✅ All icons generated successfully!"
echo ""
echo "📊 Generated files:"
ls -la "../assets/images/icons/" | grep ".png"
echo ""
echo "🚀 Next: Update manifest.json with icon paths"