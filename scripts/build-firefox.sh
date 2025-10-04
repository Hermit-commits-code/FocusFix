#!/bin/bash
# Build script for Firefox extension
cp manifest-firefox.json dist/manifest.json
cp -r background dist/
cp -r content dist/
cp -r popup dist/
cp -r options dist/
cp -r icons dist/
echo "Firefox extension files prepared in ./dist for packaging."
