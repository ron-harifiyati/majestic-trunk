"""Local static preview with the same custom 404 document as GitHub Pages."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class PreviewHandler(SimpleHTTPRequestHandler):
    def send_error(self, code, message=None, explain=None):
        not_found = Path(self.directory) / '404.html'
        if code == 404 and not_found.is_file():
            content = not_found.read_bytes()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(content)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(content)
            return
        super().send_error(code, message, explain)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8090)
    parser.add_argument('--bind', default='127.0.0.1')
    parser.add_argument('--directory', default='dist')
    args = parser.parse_args()
    handler = partial(PreviewHandler, directory=args.directory)
    with ThreadingHTTPServer((args.bind, args.port), handler) as server:
        print(f'Preview: http://{args.bind}:{args.port}/', flush=True)
        server.serve_forever()


if __name__ == '__main__':
    main()
