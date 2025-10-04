#!/bin/bash

echo "🚀 FocusFix Quick Test Launcher"
echo "==============================="

# Check if extension is valid
if ! ./validate-build.sh > /dev/null 2>&1; then
    echo "❌ Extension validation failed! Running validation..."
    ./validate-build.sh
    exit 1
fi

echo "✅ Extension is valid and ready to test!"
echo ""

# Get absolute path to test page
TEST_PAGE="file://$(pwd)/test-page.html"

echo "🔧 Testing Instructions:"
echo "========================"
echo ""
echo "1. 📂 Load Extension in Browser:"
echo "   Chrome: chrome://extensions/ → Enable Developer Mode → Load Unpacked"
echo "   Firefox: about:debugging → This Firefox → Load Temporary Add-on"
echo "   📁 Select folder: $(pwd)"
echo ""
echo "2. 🌐 Open Test Page:"
echo "   $TEST_PAGE"
echo ""
echo "3. 🧪 Run Tests:"
echo "   - Press Tab to test focus outlines"
echo "   - Check for Skip to Content link"
echo "   - Click FocusFix icon to test popup"
echo "   - Try CSV export"
echo "   - Test settings page"
echo ""

# Check if we can detect browser and open automatically
if command -v google-chrome &> /dev/null; then
    echo "🌐 Open test page in Chrome? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        google-chrome "$TEST_PAGE"
    fi
elif command -v firefox &> /dev/null; then
    echo "🌐 Open test page in Firefox? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        firefox "$TEST_PAGE"
    fi
fi

echo ""
echo "📋 For detailed testing checklist, see: TESTING.md"
echo "🐛 For troubleshooting, check console errors in browser DevTools"
echo ""
echo "Happy testing! 🎯"