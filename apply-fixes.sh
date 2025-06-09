#!/bin/bash
echo "🚀 Applying FSCutColors Enhanced UI Fixes"
echo "========================================"

# Navigate to frontend directory
cd ~/ai-collab-frontend/dist

# Create backup
BACKUP_FILE="index.html.backup-$(date +%Y%m%d-%H%M%S)"
cp index.html "$BACKUP_FILE"
echo "✅ Backup created: $BACKUP_FILE"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Add enhanced CSS
echo "🎨 Adding enhanced UI styles..."
echo "" >> index.html
echo "<style>" >> index.html
cat "$SCRIPT_DIR/enhanced-styles.css" >> index.html
echo "</style>" >> index.html

# Add streaming JavaScript functions before closing body tag
echo "⚡ Adding streaming functionality..."
sed -i '/<\/body>/i\
<script>\
// Enhanced UI - Add to existing RealAIChat class\
if (typeof RealAIChat !== "undefined") {\
  // Load streaming functions\
  ' "$SCRIPT_DIR/streaming-functions.js" '\
}\
</script>' index.html

echo ""
echo "🎉 UI Fixes Applied Successfully!"
echo "================================="
echo "✅ Individual response cards added"
echo "✅ Streaming responses enabled"
echo "✅ Progress indicators added"
echo ""
echo "🌐 Test at: https://automations.fscutcolors.com"
echo "📊 Expected: 5-8 seconds per AI response"
echo "🚨 Backup: $BACKUP_FILE"
echo ""
echo "🔄 If issues occur, restore with:"
echo "   cp $BACKUP_FILE ~/ai-collab-frontend/dist/index.html"
