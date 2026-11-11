"""Exercise real HTTP request parsing without binding a network port."""
import importlib.util
import io
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('preview_server', Path(__file__).parents[1] / 'scripts' / 'serve.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class QuietHandler(module.PreviewHandler):
    def log_message(self, *args):
        pass


class RequestSocket:
    def __init__(self, request):
        self.request = io.BytesIO(request)
        self.response = bytearray()

    def makefile(self, *args, **kwargs):
        return self.request

    def sendall(self, data):
        self.response.extend(data)


class PreviewTests(unittest.TestCase):
    def request(self, method, path, directory):
        socket = RequestSocket(f'{method} {path} HTTP/1.0\r\nHost: localhost\r\n\r\n'.encode())
        QuietHandler(socket, ('127.0.0.1', 0), None, directory=directory)
        headers, body = bytes(socket.response).split(b'\r\n\r\n', 1)
        return headers, body

    def test_unknown_paths_and_head(self):
        with tempfile.TemporaryDirectory() as directory:
            content = b'<html><h1>Our branded 404</h1></html>'
            Path(directory, '404.html').write_bytes(content)
            Path(directory, 'index.html').write_bytes(b'Home page')
            for path in ['/missing-page', '/missing/nested/page/']:
                headers, body = self.request('GET', path, directory)
                self.assertIn(b'404 Not Found', headers)
                self.assertEqual(body, content)
                self.assertIn(b'Content-Type: text/html; charset=utf-8', headers)
            headers, body = self.request('HEAD', '/missing/page/', directory)
            self.assertIn(b'404 Not Found', headers)
            self.assertIn(f'Content-Length: {len(content)}'.encode(), headers)
            self.assertEqual(body, b'')
            headers, body = self.request('GET', '/', directory)
            self.assertIn(b'200 OK', headers)
            self.assertEqual(body, b'Home page')


if __name__ == '__main__':
    unittest.main()
