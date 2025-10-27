#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DC TEKNİK - Kalıcı Server Başlatma
PowerShell hatalarını bypass eder
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

def start_server():
    print("🚀 DC TEKNİK - Server başlatılıyor...")
    
    # Mevcut dizini ayarla
    current_dir = Path(__file__).parent
    os.chdir(current_dir)
    
    print(f"📁 Dizin: {current_dir}")
    
    # Port ayarları
    PORT = 8000
    
    # Handler sınıfı
    class CustomHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            # CORS headers ekle
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            super().end_headers()
    
    try:
        # Server oluştur
        with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
            print(f"✅ Server başlatıldı!")
            print(f"🌐 Adres: http://localhost:{PORT}")
            print(f"🌐 Adres: http://127.0.0.1:{PORT}")
            print("⏹️  Durdurmak için Ctrl+C")
            print("-" * 50)
            
            # Tarayıcıda aç
            try:
                webbrowser.open(f'http://localhost:{PORT}')
                print("🌐 Tarayıcıda açıldı!")
            except:
                print("⚠️  Tarayıcı otomatik açılamadı")
            
            # Server başlat
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 10048:  # Port zaten kullanımda
            print(f"❌ Port {PORT} zaten kullanımda!")
            print("🔄 Farklı port deneniyor...")
            start_server_alt()
        else:
            print(f"❌ Hata: {e}")
    except KeyboardInterrupt:
        print("\n⏹️  Server durduruldu!")
    except Exception as e:
        print(f"❌ Beklenmeyen hata: {e}")

def start_server_alt():
    """Alternatif port ile server başlat"""
    for port in range(8001, 8010):
        try:
            with socketserver.TCPServer(("", port), http.server.SimpleHTTPRequestHandler) as httpd:
                print(f"✅ Server başlatıldı! Port: {port}")
                print(f"🌐 Adres: http://localhost:{port}")
                webbrowser.open(f'http://localhost:{port}')
                httpd.serve_forever()
                break
        except OSError:
            continue
    else:
        print("❌ Hiçbir port kullanılamıyor!")

if __name__ == "__main__":
    start_server()

