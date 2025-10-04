#!/bin/bash

echo "🔧 FocusFix Extension Build Validation"
echo "======================================"

# Check if all required files exist
echo "📁 Checking file structure..."

required_files=(
    "manifest.json"
    "src/background.js"
    "src/content.js" 
    "src/popup.html"
    "src/popup.js"
    "src/options.html"
    "src/options.js"
    "icons/icon16.png"
    "icons/icon32.png"
    "icons/icon48.png"
    "icons/icon128.png"
)

missing_files=()

for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
        missing_files+=("$file")
    fi
done

if [[ ${#missing_files[@]} -gt 0 ]]; then
    echo ""
    echo "❌ Build validation FAILED - missing files:"
    printf '%s\n' "${missing_files[@]}"
    exit 1
fi

echo ""
echo "🔍 Checking JavaScript syntax..."

js_files=("src/background.js" "src/content.js" "src/popup.js" "src/options.js")
syntax_errors=()

for js_file in "${js_files[@]}"; do
    if node -c "$js_file" 2>/dev/null; then
        echo "✅ $js_file syntax OK"
    else
        echo "❌ $js_file syntax ERROR"
        syntax_errors+=("$js_file")
    fi
done

if [[ ${#syntax_errors[@]} -gt 0 ]]; then
    echo ""
    echo "❌ Build validation FAILED - JavaScript syntax errors:"
    printf '%s\n' "${syntax_errors[@]}"
    exit 1
fi

echo ""
echo "📋 Validating manifest.json..."

if python3 -c "
import json
import sys

try:
    with open('manifest.json', 'r') as f:
        manifest = json.load(f)
    
    manifest_version = manifest.get('manifest_version')
    
    if manifest_version == 3:
        # Manifest V3 validation
        required_keys = ['manifest_version', 'name', 'version', 'permissions', 'background', 'action', 'content_scripts']
        missing_keys = [key for key in required_keys if key not in manifest]
        
        if missing_keys:
            print(f'❌ Missing required V3 manifest keys: {missing_keys}')
            sys.exit(1)
            
        if 'service_worker' not in manifest.get('background', {}):
            print('❌ Manifest V3 requires background.service_worker')
            sys.exit(1)
            
    elif manifest_version == 2:
        # Manifest V2 validation  
        required_keys = ['manifest_version', 'name', 'version', 'permissions', 'background', 'content_scripts']
        missing_keys = [key for key in required_keys if key not in manifest]
        
        if missing_keys:
            print(f'❌ Missing required V2 manifest keys: {missing_keys}')
            sys.exit(1)
            
        if 'scripts' not in manifest.get('background', {}):
            print('❌ Manifest V2 requires background.scripts')
            sys.exit(1)
    else:
        print(f'❌ Unsupported manifest version: {manifest_version}')
        sys.exit(1)
        
    print(f'✅ manifest.json is valid (Manifest V{manifest_version})')
    
except json.JSONDecodeError as e:
    print(f'❌ manifest.json JSON syntax error: {e}')
    sys.exit(1)
except Exception as e:
    print(f'❌ manifest.json validation error: {e}')
    sys.exit(1)
"; then
    echo "✅ Manifest validation passed"
else
    echo "❌ Manifest validation failed"
    exit 1
fi

echo ""
echo "🎯 Checking HTML files..."

html_files=("src/popup.html" "src/options.html")

for html_file in "${html_files[@]}"; do
    if [[ -f "$html_file" ]]; then
        # Basic HTML validation - check for required tags
        if grep -q "<!DOCTYPE html>" "$html_file" && \
           grep -q "<html" "$html_file" && \
           grep -q "<head>" "$html_file" && \
           grep -q "<body>" "$html_file"; then
            echo "✅ $html_file structure OK"
        else
            echo "❌ $html_file missing required HTML structure"
            exit 1
        fi
    fi
done

echo ""
echo "🖼️  Checking icon files..."

for size in 16 32 48 128; do
    icon_file="icons/icon${size}.png"
    if [[ -f "$icon_file" ]]; then
        file_info=$(file "$icon_file")
        if [[ "$file_info" == *"PNG image data"* ]]; then
            echo "✅ $icon_file is valid PNG"
        else
            echo "❌ $icon_file is not a valid PNG file"
            exit 1
        fi
    fi
done

echo ""
echo "🚀 Extension Package Size Check..."

total_size=$(du -sh . | cut -f1)
echo "📦 Total extension size: $total_size"

# Warn if extension is getting large
size_in_kb=$(du -sk . | cut -f1)
if [[ $size_in_kb -gt 5000 ]]; then
    echo "⚠️  Warning: Extension size ($total_size) is getting large"
fi

echo ""
echo "✅ BUILD VALIDATION PASSED!"
echo ""
echo "🎉 Your FocusFix extension is ready to load into your browser!"
echo ""
echo "Next steps:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked' and select this folder"
echo "4. Test on test-page.html"
echo ""