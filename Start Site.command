#!/bin/bash
# Verdandi Weaver — Local Site Server
# Double-click this file to start the local site.

SITE_DIR="$(cd "$(dirname "$0")" && pwd -P)/site"

echo ""
echo "  Verdandi Weaver · Local Server"
echo "  ──────────────────────────────"
echo "  Opening: http://localhost:5500"
echo "  Stop:    press Ctrl+C"
echo "  Folder:  $SITE_DIR"
echo ""

# Clear port 5500 if something is already using it
lsof -ti:5500 | xargs kill -9 2>/dev/null

# Open the browser after a short delay
(sleep 1 && open "http://localhost:5500") &

# Start the server — use functools.partial to pass directory explicitly,
# bypassing the os.getcwd() call that macOS blocks for ~/Documents paths
python3 -c "
import http.server, socketserver, functools, sys, os
d = sys.argv[1]
print('  Python sees: ' + repr(d))
print('  Exists:      ' + str(os.path.exists(d)))
print('  Is dir:      ' + str(os.path.isdir(d)))
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=d)
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', 5500), handler) as httpd:
    httpd.serve_forever()
" "$SITE_DIR"
