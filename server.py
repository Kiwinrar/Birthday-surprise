#!/usr/bin/env python3
"""
High-Performance Multi-Threaded Development Server
- Multi-threaded: Uses ThreadingTCPServer so audio streaming never blocks page navigation.
- HTTP Range support: Audio streams and seeks instantly (206 Partial Content).
- Clean URL routing: /letter -> /letter.html, etc.
- Graceful error handling: Handles BrokenPipeError / ConnectionResetError quietly when pages navigate.
"""
import http.server
import socketserver
import os
import sys
import re

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

class ThreadedCleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Strip query parameters and anchors
        clean_path = path.split('?', 1)[0].split('#', 1)[0]
        
        # Check if requesting root
        if clean_path in ('/', ''):
            return os.path.abspath('index.html')
            
        local_path = clean_path.lstrip('/')
        if os.path.exists(local_path):
            return os.path.abspath(local_path)
            
        # Check if .html version exists
        html_version = local_path + '.html'
        if os.path.exists(html_version):
            return os.path.abspath(html_version)
            
        return super().translate_path(path)

    def do_GET(self):
        # Support HTTP Range requests for instant, smooth audio playback
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().do_GET()

        range_header = self.headers.get('Range', None)
        if not range_header or not path.endswith(('.mp3', '.mp4', '.ogg', '.wav')):
            try:
                return super().do_GET()
            except (BrokenPipeError, ConnectionResetError):
                return

        # Parse range header
        try:
            file_size = os.path.getsize(path)
            range_match = re.match(r'bytes=(\d+)-(\d*)', range_header)
            if not range_match:
                return super().do_GET()

            start = int(range_match.group(1))
            end = int(range_match.group(2)) if range_match.group(2) else file_size - 1

            if start >= file_size or end >= file_size:
                self.send_error(416, "Requested Range Not Satisfiable")
                return

            length = end - start + 1
            self.send_response(206)
            self.send_header('Content-Type', self.guess_type(path))
            self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
            self.send_header('Content-Length', str(length))
            self.send_header('Accept-Ranges', 'bytes')
            self.end_headers()

            with open(path, 'rb') as f:
                f.seek(start)
                bytes_to_send = length
                chunk_size = 64 * 1024
                while bytes_to_send > 0:
                    read_len = min(chunk_size, bytes_to_send)
                    data = f.read(read_len)
                    if not data:
                        break
                    self.wfile.write(data)
                    bytes_to_send -= len(data)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def copyfile(self, source, outputfile):
        """Silently ignore broken pipe errors when client navigates away"""
        try:
            super().copyfile(source, outputfile)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def log_message(self, format, *args):
        # Filter out noisy 404s for devtools/favicon
        msg = format % args
        if 'favicon.ico' in msg or 'devtools' in msg:
            return
        super().log_message(format, *args)


class ThreadingServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == '__main__':
    with ThreadingServer(("", PORT), ThreadedCleanURLHandler) as httpd:
        print(f"✨ Birthday Website Server running at: http://localhost:{PORT}")
        print("⚡ Multi-threaded streaming enabled: Instant page transitions!")
        print("Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
