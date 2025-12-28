
import os
import platform
import socket
import time
import subprocess
from tkinter import messagebox
import tkinter as tk
import requests
import socketio
import psutil
import threading
from scapy.all import sniff, DNS, DNSQR

# --- Configuration ---
SERVER_URL = 'http://localhost:3000'
SIO_URL = 'ws://localhost:3000'
DOWNLOADS_PATH = os.path.join(os.path.expanduser("~"), "Downloads")
SUSPICIOUS_PROCESS_NAMES = [
    "mimikatz.exe",
    "nc.exe",
    "netcat.exe",
    "powershell.exe",
]

# --- State ---
seen_files = set(os.listdir(DOWNLOADS_PATH))
blocked_urls = set()
COMMON_TLDS = [
    '.com', '.org', '.net', '.edu', '.gov', '.io', '.co', '.info', '.biz', '.tv',
    '.me', '.app', '.dev', '.tech', '.site', '.xyz', '.ai', '.crypto', '.gg'
]
ALLOWED_DOMAINS = [
    'spotify.com',
    'discord.com',
    'discord.gg',
]


# --- Socket.IO Client ---
sio = socketio.Client()

@sio.event
def connect():
    print("Connected to server.")
    register_client()

@sio.event
def disconnect():
    print("Disconnected from server.")

@sio.on('command')
def on_command(data):
    command = data.get('command')
    args = data.get('args')
    # Add extra print for diagnostics
    print(f"--- Command received from server ---")
    print(f"Command: {command}")
    print(f"Args: {args}")
    print(f"------------------------------------")

    if command == 'alert':
        log_activity('info', 'command_received', f"Received 'alert' command.")
        show_alert(args.get('message', 'Alert from SOC!'))
    elif command == 'shutdown':
        log_activity('critical', 'command_received', f"Received 'shutdown' command.")
        show_alert("System shutdown command received!")
        if platform.system() == "Windows":
            log_activity('warn', 'action_taken', 'Executing system shutdown on Windows.')
            os.system('shutdown /s /t 1')
        elif platform.system() == "Linux" or platform.system() == "Darwin": # Darwin is for macOS
            log_activity('warn', 'action_taken', 'Executing system shutdown on Linux/macOS.')
            os.system('sudo shutdown -h now')
        else:
            log_activity('error', 'action_failed', f"Shutdown command not supported on OS: {platform.system()}")
            show_alert(f"Shutdown not supported on this OS: {platform.system()}")
    elif command == 'isolate':
        log_activity('info', 'command_received', f"Received 'isolate' command.")
        show_alert("This machine has been isolated from the network (DEMO).")
        log_activity('warn', 'isolate_demo', 'Simulated isolation command received and acknowledged.')
    elif command == 'block-url':
        log_activity('info', 'command_received', f"Received 'block-url' command.")
        url = args.get('url')
        if url:
            blocked_urls.add(url)
            log_activity('warn', 'url_blocked', f'URL blocked (DEMO): {url}')

def show_alert(message):
    """
    Shows a GUI alert that stays on top of other windows.
    Handles environments where a display may not be available.
    """
    try:
        root = tk.Tk()
        root.withdraw() # Hide the main window
        root.attributes('-topmost', True) # Keep the alert on top
        messagebox.showinfo("Mini SOC Alert", message)
        root.destroy()
        print(f"Successfully showed alert: '{message}'")
    except Exception as e:
        print(f"--- GUI Alert Failed ---")
        print(f"Could not display alert: '{message}'")
        print(f"Error: {e}")
        print(f"This can happen if the client is not running in a desktop session.")
        print(f"--------------------------")
        log_activity('error', 'gui_alert_failed', f"Failed to display GUI alert. Error: {e}")


def register_client():
    client_data = {
        'user': os.getlogin(),
        'hostname': socket.gethostname(),
        'os': platform.system(),
    }
    sio.emit('register', {'clientData': client_data})
    print("Registered with server:", client_data)

def log_activity(level, type, message):
    log_data = {
        'level': level,
        'type': type,
        'message': message,
    }
    sio.emit('log', log_data)
    print("Logged activity:", log_data)

def check_for_eicar():
    eicar_path = os.path.join(DOWNLOADS_PATH, "eicar.com.txt")
    if os.path.exists(eicar_path):
        log_activity('error', 'malware_detected', f'EICAR test file detected at: {eicar_path}')

def check_downloads():
    global seen_files
    current_files = set(os.listdir(DOWNLOADS_PATH))
    new_files = current_files - seen_files
    for filename in new_files:
        log_activity('warn', 'new_download', f'New file downloaded: {filename}')
    seen_files = current_files

def check_processes():
    for proc in psutil.process_iter(['name']):
        if proc.info['name'] in SUSPICIOUS_PROCESS_NAMES:
            log_activity('error', 'suspicious_process', f'Suspicious process detected: {proc.info["name"]}')

def process_dns_packet(packet):
    if packet.haslayer(DNS) and packet.getlayer(DNS).qr == 0:  # DNS query
        dns_layer = packet.getlayer(DNS)
        if dns_layer.qd is not None and dns_layer.qd.qname is not None:
            domain = dns_layer.qd.qname.decode('utf-8').rstrip('.')
            if domain in blocked_urls:
                log_activity('error', 'web_access_denied', f'Access to blocked URL attempted: {domain}')
                show_alert(f"ACCESS DENIED: The URL '{domain}' is blocked by your administrator.")
            else:
                if any(domain.endswith(tld) for tld in COMMON_TLDS) or any(domain.endswith(allowed) for allowed in ALLOWED_DOMAINS):
                    log_activity('info', 'dns_query', f'DNS Query: {domain}')

def sniff_dns():
    try:
        sniff(filter="udp port 53", prn=process_dns_packet, store=0)
    except Exception as e:
        print(f"Error sniffing DNS packets: {e}")
        log_activity('error', 'dns_sniff_failed', f"Failed to sniff DNS packets. Error: {e}")

def connect_to_server():
    while True:
        try:
            sio.connect(SIO_URL, socketio_path='/socket.io')
            break
        except socketio.exceptions.ConnectionError:
            print("Server not available. Retrying in 5 seconds...")
            time.sleep(5)

def main():
    connect_to_server()

    dns_thread = threading.Thread(target=sniff_dns, daemon=True)
    dns_thread.start()

    try:
        while True:
            check_for_eicar()
            check_downloads()
            check_processes()
            time.sleep(10)
    except KeyboardInterrupt:
        print("Client shutting down.")
    finally:
        sio.disconnect()

if __name__ == '__main__':
    main()
