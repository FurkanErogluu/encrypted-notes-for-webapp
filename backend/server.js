const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS ayarları
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MySQL bağlantısı
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'not_defteri'
});

// Veritabanı bağlantısı
db.connect((err) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err);
    return;
  }
  console.log('MySQL veritabanına bağlandı');
});

// Dosya yükleme konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir!'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Notları getir
app.get('/api/notes', (req, res) => {
  const query = 'SELECT * FROM notes ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Not ekle
app.post('/api/notes', upload.single('image'), async (req, res) => {
  try {
    const { title, content, isEncrypted, password } = req.body;
    let hashedPassword = null;
    
    if (isEncrypted === true || isEncrypted === 'true') {
      if (!password) {
        res.status(400).json({ error: 'Şifreli not için şifre zorunludur' });
        return;
      }
      // Şifreyi hashle
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
    
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const query = 'INSERT INTO notes (title, content, image_url, is_encrypted, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, content, imageUrl, isEncrypted, hashedPassword], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: result.insertId, 
        title, 
        content: isEncrypted === true || isEncrypted === 'true' ? 'Şifrelenmiş içerik' : content, 
        image_url: imageUrl,
        is_encrypted: isEncrypted,
        created_at: new Date()
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Not güncelle
app.put('/api/notes/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, content, isEncrypted, password } = req.body;
    let hashedPassword = null;
    
    if (isEncrypted === true || isEncrypted === 'true') {
      if (!password) {
        res.status(400).json({ error: 'Şifreli not için şifre zorunludur' });
        return;
      }
      // Şifreyi hashle
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
    
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
    
    const query = 'UPDATE notes SET title = ?, content = ?, image_url = ?, is_encrypted = ?, password = ? WHERE id = ?';
    db.query(query, [title, content, imageUrl, isEncrypted, hashedPassword, req.params.id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: req.params.id, 
        title, 
        content: isEncrypted === true || isEncrypted === 'true' ? 'Şifrelenmiş içerik' : content, 
        image_url: imageUrl,
        is_encrypted: isEncrypted,
        updated_at: new Date()
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Not sil
app.delete('/api/notes/:id', (req, res) => {
  const query = 'DELETE FROM notes WHERE id = ?';
  db.query(query, [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Not başarıyla silindi' });
  });
});

// Şifreli notu aç
app.post('/api/notes/:id/decrypt', async (req, res) => {
  try {
    const { password } = req.body;
    const query = 'SELECT * FROM notes WHERE id = ?';
    
    db.query(query, [req.params.id], async (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (results.length === 0) {
        res.status(404).json({ error: 'Not bulunamadı' });
        return;
      }
      
      const note = results[0];
      
      if (!note.is_encrypted) {
        res.json({ content: note.content });
        return;
      }
      
      if (!password) {
        res.status(400).json({ error: 'Şifre gerekli' });
        return;
      }
      
      // Şifreyi kontrol et
      const isValid = await bcrypt.compare(password, note.password);
      
      if (!isValid) {
        res.status(401).json({ error: 'Yanlış şifre' });
        return;
      }
      
      res.json({ content: note.content });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});

