const https = require('https');
const fs = require('fs');
const path = require('path');

// Netlify API key (public, safe for static sites)
const NETLIFY_SITE_ID = 'dcteknik';
const NETLIFY_API_TOKEN = 'nfp_1234567890abcdef'; // Bu gerçek token olacak

async function deployToNetlify() {
    console.log('🚀 Netlify\'a otomatik deployment başlatılıyor...');
    
    // Tüm dosyaları oku
    const files = [
        'index.html',
        'style.css',
        'js/script.js',
        'blog.html',
        'manifest.webmanifest',
        'robots.txt',
        'sitemap.xml'
    ];
    
    const deployData = {
        files: {}
    };
    
    // Dosyaları oku ve deploy data'ya ekle
    for (const file of files) {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            deployData.files[file] = content;
            console.log(`✅ ${file} hazırlandı`);
        }
    }
    
    // Netlify API'ye gönder
    const postData = JSON.stringify(deployData);
    
    const options = {
        hostname: 'api.netlify.com',
        port: 443,
        path: '/api/v1/sites/dcteknik/deploys',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'Authorization': `Bearer ${NETLIFY_API_TOKEN}`
        }
    };
    
    const req = https.request(options, (res) => {
        console.log(`📡 Netlify API Response: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('✅ Deployment başarılı!');
            console.log('🌐 Site URL: https://dcteknik.netlify.app');
            console.log('📱 Blog bölümü artık görünür olmalı!');
        });
    });
    
    req.on('error', (e) => {
        console.error(`❌ Deployment hatası: ${e.message}`);
    });
    
    req.write(postData);
    req.end();
}

// Hemen çalıştır
deployToNetlify();
