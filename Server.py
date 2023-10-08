import threading
import socket
import os


HTTP_404 = b'HTTP/1.1 404 Not Found'
HTTP_200 = b'HTTP/1.1 200 OK'
HTTP_500 = b'HTTP/1.1 500 Internal Server Error'
HTTP_401 = b'HTTP/1.1 401 Unauthorized'

def num_projs():
    return len(os.listdir(os.getcwd()+os.path.sep+'js_things'+os.path.sep))
def load_file(file_name):
    with open(file_name, 'rb') as f:
        return f.read()
    return None

def load_index(file_args):
    if 'n' in file_args:
        n = file_args['n']
    else:
        n = "1"
    n = n.encode('ascii')

    ret_bytes = HTTP_200 + b'\nContent-Type: text/html\n\n'+\
    b"""<!DOCTYPE html>
<html>
<head>
    <title> TEST </title>
    <meta http-equiv="refresh" content="3600;url=/?n=""" + str(1+((int(n))%num_projs())).encode('ascii') + b"""" />
</head>
<body style="margin: 0;overflow: hidden;">
    <canvas id="c" width="1824" height="984"></canvas>
</body>
<script src="/js_things/""" + n + b""".js"></script>
</html>
"""
    return ret_bytes

APPROVED_FILE_TYPES = [
        'css',
        'js',
        'html',
        'ico',
        ]
VALID_PAGES = {
        '/': load_index
        }

def handle_conn_recv(conn, addr):
    req = conn.recv(2048).decode('utf-8')
    
    line_sep = '\r\n' if '\r\n' in req else '\n'
    lines = req.split(line_sep)

    # validate first line
    dec_first_line = lines[0].split(' ')
    if len(dec_first_line) != 3: return None
    typ, file, prot = dec_first_line

    # read the arguments of the req
    args = {}
    for l in lines[1:]:
        if l == '': break
        k, v = l.split(': ')
        args[k] = v

    # read the arguments of the file
    file_name = file
    file_args = {}
    if '?' in file:
        file_name, file_args_str = file.split('?')
        for arg in file_args_str.split('&'):
            k, v = arg.split('=')
            file_args[k] = v
    content = bytearray()

    # check if there's additional content to fetch
    if line_sep+line_sep in req:
        content = req.split(line_sep+line_sep)
    if 'Content-Length' in args:
        c_length = args['Content-Length']
        c_length = int(c_length)
        while len(content) < c_lengt: 
            content += bytearray(conn.recv(1024))

    return typ, (file_name, file_args), prot, args, content

def get_file(file_name, file_args):
    # if it's a destination, use that handler
    if '.' not in file_name:
        if file_name in VALID_PAGES:
            return VALID_PAGES[file_name](file_args)
        return HTTP_404

    # check that file name is not trying to access anything but approved things
    file_ending = file_name.split('.')[-1]
    if  file_ending not in APPROVED_FILE_TYPES or \
        '..' in file_name:
        return HTTP_401
    return HTTP_200 + \
           b'\nContent-Type: ' + file_ending.encode('ascii') + b'\n\n' + \
           load_file('.' + file_name)

if __name__ == '__main__':
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 80))
        s.listen(10)
        while 1:
            def h(conn, addr):
                res = handle_conn_recv(conn, addr)
                if res: 
                    typ, (file_name, file_args), *_ = res
                    if typ == 'GET':
                        conn.send(get_file(file_name, file_args))
                    else:
                        conn.send(HTTP_501)
                conn.close()
            t = threading.Thread(target=h, args=s.accept())
            t.setDaemon(True)
            t.start()
