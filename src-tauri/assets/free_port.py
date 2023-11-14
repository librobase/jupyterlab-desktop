import socket

sock = socket.socket()
sock.bind(('', 0))
p = sock.getsockname()[1]
print(p)
