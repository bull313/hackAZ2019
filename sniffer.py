#!/usr/bin/python3

import os
import struct
import binascii
import json
import socket
import select
import signal 
import pyrebase
import time
import ast

#
# Packet Parsing
#

def mac_format(mac_bytes):
	formatted = "%.2s:%.2s:%.2s:%.2s:%.2s:%.2s" % ((ord(mac_bytes[0])), (ord(mac_bytes[1])), (ord(mac_bytes[2])), (ord(mac_bytes[3])), (ord(mac_bytes[4])), (ord(mac_bytes[5])))
	return formatted

class capture:
	def __cinit__(self):
		self.data = None

	def parse_eth_header(self, data):
		temp = struct.unpack("!6s6sH", data)
		d_mac = mac_format(binascii.hexlify(temp[0]).decode("utf-8"))
		s_mac = mac_format(binascii.hexlify(temp[1]).decode("utf-8"))
		eth_p = temp[2]
		eth_header = {"DST_MAC":d_mac,
			"SRC_MAC":s_mac,
			"ETH_PROTOCOL":eth_p,
			"TIMESTAMP": None}
		return eth_header

	def parse_ip_header(self, data):
		temp = struct.unpack("!BBHHHBBH4s4s", data)
		ver = temp[0]
		tos = temp[1]
		t_len = temp[2]
		iden = temp[3]
		frag = temp[4]
		ttl = temp[5]
		prot = temp[6]
		hd_chk = temp[7]
		s_addr = socket.inet_ntoa(temp[8])
		d_addr = socket.inet_ntoa(temp[9])
		ip_header = {"VERSION": ver,
			"TOS": tos,
			"TOTAL_LENGTH": t_len,
			"IDENTIFICATION": iden,
			"FRAG_OFFSET": frag,
			"TTL": ttl,
			"PROTOCOL": prot,
			"CHECKSUM": hd_chk,
			"SRC_ADDR": s_addr,
			"DST_ADDR": d_addr,
			"TIMESTAMP": None}
		return ip_header

	def parse_tcp_header(self, data):
		temp = struct.unpack("!HHLLBBHHH", data)
		s_port = temp[0]
		d_port = temp[1]
		seq = temp[2]
		ack = temp[3]
		off_res = temp[4]
		flag = temp[5]
		win = temp[6]
		chk = temp[7]
		urg = temp[8]
		tcp_header = {"SRC_PORT": s_port,
			"DST_PORT": d_port,
			"SEQ_NUM": seq,
			"ACK_NUM": ack,
			"OFFSET_RESERVED": off_res,
			"TCP_FLAG": flag,
			"WINDOW_SIZE": win,
			"CHECKSUM": chk,
			"URGENT_PTR": urg,
			"TIMESTAMP": None}
		return tcp_header


#
# Packet Sniffing
#

# If OS is Windows
if os.name == "nt":
	s = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_IP)
	# bind to your IP
	s.bind(("10.143.150.54", 0))
	s.setsockopt(socket.IPPROTO_IP, socket.IP_HDRINCL, 1)
	s.ioctl(socket.SIO_RCVCALL, socket.RCVCALL_ON)

# If OS is *nix
else:
	s = socket.socket(socket.PF_PACKET, socket.SOCK_RAW, socket.ntohs(0x0800))

s.setblocking(0)

# Signal handlers
def sig_handler(sig, frame):
	print("Stopping packet capture...")
	global stop
	stop = True

signal.signal(signal.SIGINT, sig_handler)
signal.signal(signal.SIGTERM, sig_handler)

f = open("my_packets", "w")

stop = False

print("Starting packet capture...")

# Loop to read packets
while True:	
	readable, writable, exceptional = select.select([s], [], [], 0)

	if readable:
		timestamp = time.time()
		pkt = s.recvfrom(65535)

		cap = capture()

		eth = cap.parse_eth_header(pkt[0][0:14])
		eth.update({"TIMESTAMP": timestamp})
		ip = cap.parse_ip_header(pkt[0][14:34])
		ip.update({"TIMESTAMP": timestamp})
		tcp = cap.parse_tcp_header(pkt[0][34:54])
		tcp.update({"TIMESTAMP": timestamp})

		print("Ethernet: " + str(eth))
		print("IP: " + str(ip))
		print("TCP: " + str(tcp) + "\n")

		f.write("\n" + json.dumps(eth) + "\n" + json.dumps(ip) + "\n" + json.dumps(tcp) + "\n")
	
	if stop:
		f.close()
		break


#
# Upload to Firebase
#
'''
print("Uploading data to Firebase")

# TODO: Plug in Firebase Auth info


config = {"apiKey":
		"authDomain":
		"databaseURL":
		"storageBucket":
		"serviceAccount":
		}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
user = auth.sign_in_with_email_and_password("", "")
db = firebase.database()
'''
# Read data from local text file
f = open("my_packets", "r")

while f.readline():
	eth = json.loads(f.readline())
	ip = json.loads(f.readline())
	tcp = json.loads(f.readline())

	#print(eth)
	#print(ip)
	#print(tcp)
	#print()

	# TODO: Write JSON data to Firebase
	db.child("eth_test").push(eth)
	db.child("ip_test").push(ip)
	db.child("tcp_test").push(tcp)


f.close()

