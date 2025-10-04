#!/bin/bash

echo "🦊 FocusFix Browser Compatibility Setup"
echo "======================================="

# Check which browser setup to use
echo "Which browser are you targeting?"
echo "1) Chrome/Edge (Manifest V3)"
echo "2) Firefox (Manifest V2)"
echo "3) Both (will copy current setup info)"

read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "🔧 Setting up for Chrome/Edge (Manifest V3)..."
        if [[ -f "manifest.json" ]]; then
            echo "✅ Current manifest.json is already Chrome/Edge compatible"
        else
            echo "❌ manifest.json not found"
            exit 1
        fi
        echo ""
        echo "📝 Chrome Setup Instructions:"
        echo "1. Open Chrome and go to chrome://extensions/"
        echo "2. Enable 'Developer mode'"
        echo "3. Click 'Load unpacked'"
        echo "4. Select this folder: $(pwd)"
        ;;
    2)
        echo "🔧 Setting up for Firefox..."
        if [[ -f "manifest-firefox.json" ]]; then
            cp manifest.json manifest-chrome.json
            cp manifest-firefox.json manifest.json
            echo "✅ Switched to Firefox manifest (Chrome version backed up)"
        else
            echo "❌ manifest-firefox.json not found"
            exit 1
        fi
        echo ""
        echo "📝 Firefox Setup Instructions:"
        echo "1. Open Firefox and go to about:debugging"
        echo "2. Click 'This Firefox'"
        echo "3. Click 'Load Temporary Add-on'"
        echo "4. Select manifest.json from: $(pwd)"
        ;;
    3)
        echo "📋 Multi-Browser Setup:"
        echo ""
        echo "📁 Files available:"
        echo "  • manifest.json (Chrome/Edge - Manifest V3)"
        echo "  • manifest-firefox.json (Firefox - Manifest V2)"
        echo ""
        echo "🔧 Chrome/Edge:"
        echo "  chrome://extensions/ → Load unpacked → Select folder"
        echo ""
        echo "🔧 Firefox:"
        echo "  1. Copy manifest-firefox.json to manifest.json"
        echo "  2. about:debugging → Load Temporary Add-on"
        echo ""
        echo "💡 Use this script to switch between browser configs"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🧪 Test page available at: file://$(pwd)/test-page.html"
echo "📋 Run validation: ./validate-build.sh"
echo ""
echo "Happy testing! 🎯"