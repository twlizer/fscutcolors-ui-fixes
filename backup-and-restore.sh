#!/bin/bash
# Backup and restore functionality for FSCutColors UI fixes

case "$1" in
    "restore")
        echo "🔄 Restoring from backup..."
        cd ~/ai-collab-frontend/dist
        
        # Find the most recent backup
        LATEST_BACKUP=$(ls -t index.html.backup-* 2>/dev/null | head -1)
        
        if [ -n "$LATEST_BACKUP" ]; then
            cp "$LATEST_BACKUP" index.html
            echo "✅ Restored from: $LATEST_BACKUP"
            echo "🌐 Test your site to confirm restoration"
        else
            echo "❌ No backup found"
            echo "💡 Backups are created automatically when applying fixes"
        fi
        ;;
    "list")
        echo "📋 Available backups:"
        cd ~/ai-collab-frontend/dist
        ls -la index.html.backup-* 2>/dev/null || echo "No backups found"
        ;;
    "clean")
        echo "🧹 Cleaning old backups (keeping last 5)..."
        cd ~/ai-collab-frontend/dist
        ls -t index.html.backup-* 2>/dev/null | tail -n +6 | xargs rm -f
        echo "✅ Old backups cleaned"
        ;;
    *)
        echo "🛡️  FSCutColors Backup & Restore Tool"
        echo "====================================="
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  restore  - Restore from most recent backup"
        echo "  list     - Show all available backups"
        echo "  clean    - Remove old backups (keep 5 most recent)"
        echo ""
        echo "Examples:"
        echo "  $0 restore    # Restore if fixes cause issues"
        echo "  $0 list       # See all backup files"
        echo "  $0 clean      # Clean up old backups"
        echo ""
        echo "📋 Current backups:"
        cd ~/ai-collab-frontend/dist 2>/dev/null
        ls -la index.html.backup-* 2>/dev/null | head -5 || echo "No backups found"
        ;;
esac
