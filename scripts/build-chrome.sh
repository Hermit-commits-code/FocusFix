#!/bin/bash
# Build script for Chrome extension
cp manifest.json dist/manifest.json
cp -r background dist/
cp -r content dist/
cp -r popup dist/
cp -r options dist/
cp -r icons dist/
echo "Chrome extension files prepared in ./dist for packaging."
