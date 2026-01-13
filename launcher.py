import os
import subprocess
import platform
import sys
import webbrowser
import time
import shutil
import socket

# === KONFIGURASI ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_NAME = "kenangan-pmo-nextjs"
PORT = 9002 

def wait_for_port(port, timeout=30):
    """Menunggu sampai port terbuka sebelum membuka browser"""
    start_time = time.time()
    while True:
        try:
            with socket.create_connection(("localhost", port), timeout=1):
                return True
        except:
            if time.time() - start_time > timeout:
                return False
            time.sleep(1)

def clean_old_files():
    print("[!] Membersihkan cache dan dependencies lama...")
    for folder in ["node_modules", ".next", "package-lock.json"]:
        path = os.path.join(BASE_DIR, folder)
        if os.path.exists(path):
            if os.path.isdir(path): shutil.rmtree(path)
            else: os.remove(path)
    print("[*] Selesai.")

def run_docker():
    print(f"\n[!] Membangun Docker Image (Port {PORT})...")
    os.chdir(BASE_DIR)
    try:
        # Stop container lama jika masih jalan
        subprocess.run(["docker", "stop", IMAGE_NAME], stderr=subprocess.DEVNULL)
        
        subprocess.run(["docker", "build", "-t", IMAGE_NAME, "."], check=True)
        print(f"[*] Menjalankan Container...")
        
        # Jalankan di background (detached) agar script bisa lanjut memantau port
        subprocess.Popen(["docker", "run", "--name", IMAGE_NAME, "-p", f"{PORT}:{PORT}", "--rm", IMAGE_NAME])
        
        print(f"[*] Menunggu server siap...")
        if wait_for_port(PORT):
            webbrowser.open(f"http://localhost:{PORT}")
            print(f"[*] Berhasil! Akses di http://localhost:{PORT}")
        
        # Menjaga script tetap hidup untuk melihat log docker
        subprocess.run(["docker", "logs", "-f", IMAGE_NAME])
    except Exception as e:
        print(f"\n[ERROR] Gagal: {e}")

def run_local(reinstall=False):
    os.chdir(BASE_DIR)
    try:
        if reinstall:
            clean_old_files()
            print("[!] npm install...")
            subprocess.run(["npm", "install"], check=True, shell=(platform.system() == "Windows"))
        
        print(f"[*] Menjalankan Next.js dev di port {PORT}...")
        # Jalankan dev server
        process = subprocess.Popen(["npm", "run", "dev", "--", "-p", str(PORT)], shell=(platform.system() == "Windows"))
        
        if wait_for_port(PORT):
            webbrowser.open(f"http://localhost:{PORT}")
        
        process.wait()
    except Exception as e:
        print(f"Terjadi kesalahan: {e}")

if __name__ == "__main__":
    while True:
        print(f"\n{'='*40}\n  NEXT.JS LAUNCHER (PORT {PORT})\n{'='*40}")
        print("1. Jalankan via Docker")
        print("2. FIX ERROR: Reinstall & Jalankan Lokal")
        print("3. Jalankan Lokal (Cepat)")
        print("4. Reset Docker")
        print("5. Keluar")
        
        choice = input("\nPilih menu (1-5): ")
        if choice == "1": run_docker()
        elif choice == "2": run_local(reinstall=True)
        elif choice == "3": run_local(reinstall=False)
        elif choice == "4":
            subprocess.run(["docker", "stop", IMAGE_NAME], stderr=subprocess.DEVNULL)
            subprocess.run(["docker", "rmi", "-f", IMAGE_NAME], stderr=subprocess.DEVNULL)
            print("[*] Docker bersih.")
        elif choice == "5": break