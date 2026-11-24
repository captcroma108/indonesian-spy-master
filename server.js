const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const VAULT_DIR = 'C:\\Users\\captc\\Indonesian_Learning_Vault';

const server = http.createServer((req, res) => {
  let reqUrl = decodeURIComponent(req.url.split('?')[0]);

  // Google Pixel APK UI Studio
  if (reqUrl === '/pixel-studio' || reqUrl === '/studio' || reqUrl === '/design') {
    const filePath = path.join(VAULT_DIR, 'pixel_studio.html');
    fs.readFile(filePath, (err, content) => {
      if (err) { res.writeHead(500); res.end('Error loading pixel_studio.html'); }
      else { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(content); }
    });
    return;
  }

  // Main 30-Day Master Course
  if (reqUrl === '/' || reqUrl === '/index.html' || reqUrl === '/course' || reqUrl === '/30days') {
    const filePath = path.join(VAULT_DIR, 'course_30days.html');
    fs.readFile(filePath, (err, content) => {
      if (err) { res.writeHead(500); res.end('Error loading course_30days.html'); }
      else { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(content); }
    });
    return;
  }

  // Audio Manifest JSON
  if (reqUrl === '/audio_manifest.json') {
    const manifestPath = path.join(VAULT_DIR, 'audio_manifest.json');
    if (fs.existsSync(manifestPath)) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      fs.createReadStream(manifestPath).pipe(res);
      return;
    }
  }

  // Curriculum Data JS
  if (reqUrl === '/curriculum_data.js') {
    const filePath = path.join(VAULT_DIR, 'curriculum_data.js');
    fs.readFile(filePath, (err, content) => {
      if (err) { res.writeHead(500); res.end('Error loading curriculum_data.js'); }
      else { res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' }); res.end(content); }
    });
    return;
  }

  // APKG Download
  if (reqUrl === '/download-deck' || reqUrl === '/Indonesian_Spy_Master_Deck.apkg') {
    const apkgPath = path.join(VAULT_DIR, 'Indonesian_Spy_Master_Deck.apkg');
    if (fs.existsSync(apkgPath)) {
      const stat = fs.statSync(apkgPath);
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="Indonesian_Spy_Master_Deck.apkg"',
        'Content-Length': stat.size
      });
      fs.createReadStream(apkgPath).pipe(res);
      return;
    }
  }

  // APK Download (Direct standalone Android app)
  if (reqUrl === '/download-apk' || reqUrl === '/Indonesian_Master.apk' || reqUrl === '/app.apk') {
    const apkPath = path.join(VAULT_DIR, 'Indonesian_Master.apk');
    if (fs.existsSync(apkPath)) {
      const stat = fs.statSync(apkPath);
      res.writeHead(200, {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="Indonesian_Master.apk"',
        'Content-Length': stat.size
      });
      fs.createReadStream(apkPath).pipe(res);
      return;
    }
  }

  // Manifest & Service Worker
  if (reqUrl === '/manifest.json') {
    res.writeHead(200, { 'Content-Type': 'application/manifest+json; charset=utf-8' });
    fs.createReadStream(path.join(VAULT_DIR, 'manifest.json')).pipe(res);
    return;
  }

  if (reqUrl === '/sw.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    fs.createReadStream(path.join(VAULT_DIR, 'sw.js')).pipe(res);
    return;
  }

  // App Icons
  if (reqUrl === '/icon-512.png' || reqUrl === '/icon-192.png') {
    const iconPath = path.join(VAULT_DIR, reqUrl.replace('/', ''));
    if (fs.existsSync(iconPath)) {
      res.writeHead(200, { 'Content-Type': 'image/png' });
      fs.createReadStream(iconPath).pipe(res);
      return;
    }
  }

  // Pimsleur Audio route: /pimsleur-audio/...
  if (reqUrl.startsWith('/pimsleur-audio/')) {
    const audioName = reqUrl.replace('/pimsleur-audio/', '');
    const audioPath = path.join(VAULT_DIR, 'Pimsleur_Course', 'PIMSELUR', audioName);
    if (fs.existsSync(audioPath)) {
      const stat = fs.statSync(audioPath);
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes'
      });
      fs.createReadStream(audioPath).pipe(res);
      return;
    }
  }

  // Pimsleur Suite Master JSON
  if (reqUrl === '/pimsleur_suite_master.json') {
    const pPath = path.join(VAULT_DIR, 'pimsleur_suite_master.json');
    if (fs.existsSync(pPath)) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      fs.createReadStream(pPath).pipe(res);
      return;
    }
  }

  // Pimsleur Data JSON
  if (reqUrl === '/pimsleur_data.json') {
    const pPath = path.join(VAULT_DIR, 'pimsleur_data.json');
    if (fs.existsSync(pPath)) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      fs.createReadStream(pPath).pipe(res);
      return;
    }
  }

  // Native audio route: /native-audio/...
  if (reqUrl.startsWith('/native-audio/')) {
    const audioName = reqUrl.replace('/native-audio/', '');
    const audioPath = path.join(VAULT_DIR, 'native_audio', audioName);
    if (fs.existsSync(audioPath)) {
      const stat = fs.statSync(audioPath);
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes'
      });
      fs.createReadStream(audioPath).pipe(res);
      return;
    }
  }

  // DLI Audio route: /dli-audio/...
  if (reqUrl.startsWith('/dli-audio/')) {
    const audioName = reqUrl.replace('/dli-audio/', '');
    const audioPath = path.join(VAULT_DIR, 'DLI_Course', 'Student_Manuals', 'Audio', audioName);
    if (fs.existsSync(audioPath)) {
      const stat = fs.statSync(audioPath);
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes'
      });
      fs.createReadStream(audioPath).pipe(res);
      return;
    }
  }

  // PDF route: /pdf/...
  if (reqUrl.startsWith('/pdf/')) {
    const pdfPath = path.join(VAULT_DIR, reqUrl.replace('/pdf/', ''));
    if (fs.existsSync(pdfPath)) {
      const stat = fs.statSync(pdfPath);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Length': stat.size
      });
      fs.createReadStream(pdfPath).pipe(res);
      return;
    }
  }

  res.writeHead(404);
  res.end('Not Found: ' + reqUrl);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/ and http://localhost:${PORT}/`);
});
