const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001; // Backend portu

// CORS ayarı (frontend'ten istek gelmesine izin veriyoruz)
app.use(cors());

// JSON verileri alabilmek için
app.use(express.json());

// MySQL veritabanı bağlantısı
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // XAMPP kullanıyorsan genellikle şifre boş olur
    database: 'not_defteri' // Birazdan oluşturacağımız veritabanı
});

// Veritabanı bağlantısını test edelim
db.connect((err) => {
    if (err) {
        console.error('MySQL bağlantı hatası:', err);
        return;
    }
    console.log('MySQL veritabanına başarıyla bağlandı!');
});

// Basit bir test route'u
app.get('/', (req, res) => {
    res.send('Backend çalışıyor!');
});

// Server başlat
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor`);
});


//Not Ekleme (POST /api/notes)
app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {   //Eğer başlık boşsa VEYA içerik boşsa".
        return res.status(400).json({ error: 'Başlık ve içerik gerekli!' });
    }

    const sql = "INSERT INTO notes (title, content) VALUES (?, ?)";
    db.query(sql, [title, content], (err, result) => {
        if (err) {
            console.error('Not eklerken hata:', err);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.status(201).json({ message: 'Not başarıyla eklendi!' });
    });
});


//Notları Listeleme(GET /api/notes)
app.get('/api/notes', (req, res) => {
    const sql = "SELECT * FROM notes ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Notları alırken hata:', err);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

