import os
import subprocess
import platform
import sys
import webbrowser
import time
import shutil

# === KONFIGURASI ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_NAME = "kenangan-pmo-nextjs"
PORT = "9002" 

def clean_old_files():
    """Menghapus node_modules dan lockfile untuk fix error patching"""
    print("[!] Membersihkan cache dan dependencies lama...")
    paths_to_delete = [
        os.path.join(BASE_DIR, "node_modules"),
        os.path.join(BASE_DIR, ".next"),
        os.path.join(BASE_DIR, "package-lock.json")
    ]
    for path in paths_to_delete:
        if os.path.exists(path):
            if os.path.isdir(path):
                shutil.rmtree(path)
            else:
                os.remove(path)
    print("[*] Pembersihan selesai.")

def run_docker():
    print(f"\n[!] Menjalankan via Docker (Port {PORT})...")
    os.chdir(BASE_DIR)
    if not os.path.exists(os.path.join(BASE_DIR, "Dockerfile")):
        print("[ERROR] File Dockerfile tidak ditemukan! Silahkan buat dulu.")
        return
    
    try:
        subprocess.run(["docker", "build", "-t", IMAGE_NAME, "."], check=True)
        print(f"[*] App berjalan di http://localhost:{PORT}")
        time.sleep(3)
        webbrowser.open(f"http://localhost:{PORT}")
        subprocess.run(["docker", "run", "--name", IMAGE_NAME, "-p", f"{PORT}:{PORT}", "--rm", IMAGE_NAME], check=True)
    except Exception as e:
        print(f"Gagal Docker: {e}")

def run_local(reinstall=False):
    os.chdir(BASE_DIR)
    try:
        if reinstall:
            clean_old_files()
            print("[!] Menginstall dependencies baru (npm install)...")
            subprocess.run(["npm", "install"], check=True, shell=(platform.system() == "Windows"))
        
        print(f"[*] Menjalankan server di port {PORT}...")
        time.sleep(2)
        webbrowser.open(f"http://localhost:{PORT}")
        
        # Jalankan dengan parameter port 9002
        cmd = ["npm", "run", "dev", "--", "-p", PORT]
        subprocess.run(cmd, check=True, shell=(platform.system() == "Windows"))
    except Exception as e:
        print(f"Terjadi kesalahan: {e}")

if __name__ == "__main__":
    while True:
        print(f"\n{'='*40}\n  NEXT.JS LAUNCHER (PORT {PORT})\n{'='*40}")
        print("1. Jalankan via Docker")
        print("2. FIX ERROR: Reinstall & Jalankan Lokal")
        print("3. Jalankan Lokal (Cepat)")
        print("4. Hapus Docker Image/Container")
        print("5. Keluar")
        
        choice = input("\nPilih menu (1-5): ")
        if choice == "1": run_docker()
        elif choice == "2": run_local(reinstall=True)
        elif choice == "3": run_local(reinstall=False)
        elif choice == "4":
            subprocess.run(["docker", "stop", IMAGE_NAME], stderr=subprocess.DEVNULL)
            subprocess.run(["docker", "rmi", "-f", IMAGE_NAME], stderr=subprocess.DEVNULL)
            print("[*] Docker dibersihkan.")
        elif choice == "5": break