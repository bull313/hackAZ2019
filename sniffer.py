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
import getpass
import argparse
from requests.exceptions import HTTPError

#
# Global Variables and Helper Functions
#

# Flag to stop capture
stop = False

# User Prompt for Credentials
def get_cred():
	print("Email: ", end='')
	em = input()
	pw = getpass.getpass()
	return {"email": em, "password": pw}

# MAC Address Formatter
def mac_format(mac_bytes):
	formatted = "%.2s:%.2s:%.2s:%.2s:%.2s:%.2s" % ((ord(mac_bytes[0])), (ord(mac_bytes[1])), (ord(mac_bytes[2])), (ord(mac_bytes[3])), (ord(mac_bytes[4])), (ord(mac_bytes[5])))
	return formatted

# Signal Handler
def sig_handler(sig, frame):
	print("Stopping packet capture...")
	global stop
	stop = True


#
# Packet Parsing
#

class capture:
	def __cinit__(self):
		self.data = None

	# Parse Ethernet Frame Header
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

	# Parse IP Packet Header
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

	# Parse TCP Segment Header
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

def sniff(timeout = None, verbosity = None):
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

	# Set nonblocking capture and interrupt signal handler
	s.setblocking(0)
	signal.signal(signal.SIGINT, sig_handler)

	# Setup for capture
	f = open("my_packets", "w")
	print("Starting packet capture...")
	start = time.time()

	# Loop to capture packets
	while True:
		global stop	
		readable, writable, exceptional = select.select([s], [], [], 0)

		timestamp = time.time()

		if readable:
			# Receive bytestream from socket
			pkt = s.recvfrom(65535)

			# Parse captured bytestream
			cap = capture()
			eth = cap.parse_eth_header(pkt[0][0:14])
			eth.update({"TIMESTAMP": timestamp})
			ip = cap.parse_ip_header(pkt[0][14:34])
			ip.update({"TIMESTAMP": timestamp})
			tcp = cap.parse_tcp_header(pkt[0][34:54])
			tcp.update({"TIMESTAMP": timestamp})

			# Terminal Output
			if verbosity == "verbose":
				print("Ethernet: " + str(eth))
				print("IP: " + str(ip))
				print("TCP: " + str(tcp) + "\n")

			elif verbosity == "silent":
				pass

			else:
				print("Packet from %s to %s" % (ip["SRC_ADDR"], ip["DST_ADDR"]))

			f.write("\n" + json.dumps(eth) + "\n" + json.dumps(ip) + "\n" + json.dumps(tcp) + "\n")

		# Condition to stop capturing
		if stop or (timeout and (timestamp - start) > timeout):
			f.close()
			break

	# Reset to default signal handler
	signal.signal(signal.SIGINT, signal.SIG_DFL)


#
# Upload to Firebase
#

def fb_upload(credentials = None):
	fb_auth = open("ignoreme.json", "r")
	auth_data = json.load(fb_auth)

	config = {"apiKey": auth_data["apiKey"],
			"authDomain": auth_data["authDomain"],
			"databaseURL": auth_data["databaseURL"],
			"storageBucket": auth_data["storageBucket"]}

	firebase = pyrebase.initialize_app(config)
	auth = firebase.auth()
	try:
		if not credentials:
			credentials = get_cred()

		user = auth.sign_in_with_email_and_password(credentials["email"], credentials["password"])

		db = firebase.database()

		print("Uploading data to Firebase...")

		# Read data from local text file
		f = open("my_packets", "r")

		while f.readline():
			eth = json.loads(f.readline())
			ip = json.loads(f.readline())
			tcp = json.loads(f.readline())

			db.child("ethernet_real").push(eth, user["idToken"])
			db.child("ip_real").push(ip, user["idToken"])
			db.child("tcp_real").push(tcp, user["idToken"])

		f.close()

	except HTTPError as e:
		print("Error: " + ast.literal_eval(e.strerror)["error"]["errors"][0]["message"])
		print("Login Failed, no data uploaded...")


#
# Create Firebase User
#

def fb_register():
	fb_auth = open("ignoreme.json", "r")
	auth_data = json.load(fb_auth)

	config = {"apiKey": auth_data["apiKey"],
			"authDomain": auth_data["authDomain"],
			"databaseURL": auth_data["databaseURL"],
			"storageBucket": auth_data["storageBucket"]}

	firebase = pyrebase.initialize_app(config)
	auth = firebase.auth()

	try:
		print("Register a New User")
		credentials = get_cred()
		auth.create_user_with_email_and_password(credentials["email"], credentials["password"])
		print("Registration success!")
	except HTTPError as e:
		print("Error: " + ast.literal_eval(e.strerror)["error"]["errors"][0]["message"])
		print("Registration Failed...")


#
# Main function
#

def main():
	# Parse command-line options
	parser = argparse.ArgumentParser(description="Capture Ethernet Frames, IP Packets, and TCP Segments")
	parser.add_argument("-r", "--register", action="store_true", help="Register a new user for the database")
	parser.add_argument("-t", "--timeout", type=int, metavar="", help="Specify how long to capture packets (in seconds)")
	upl = parser.add_mutually_exclusive_group()
	upl.add_argument("-n", "--no-upload", action="store_true", help="Do not upload packets to Firebase")
	upl.add_argument("-U", "--upload-only", action="store_true", help="Upload current log without capturing")
	output = parser.add_mutually_exclusive_group()
	output.add_argument("-v", "--verbose", action="store_true", help="Show all details of packets logged")
	output.add_argument("-s", "--silent", action="store_true", help="Don't show captured packets")
	args = parser.parse_args()

	if args.register:
		fb_register()
		exit(0)

	if not args.upload_only:
		verbosity = None
		
		if args.verbose:
			verbosity = "verbose"
		elif args.silent:
			verbosity = "silent"

		sniff(args.timeout, verbosity)

	if not args.no_upload:
		fb_upload(None)

main()

