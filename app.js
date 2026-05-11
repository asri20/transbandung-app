const express = require('express');
const { S3Client } = require('@aws-sdk/client-s3'); // Menggunakan SDK V3 sesuai package.json
const multer = require('multer');
const multerS3 = require('multer-s3');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// --- KONEKSI DATABASE (Amazon RDS) ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi ke RDS:', err.message);
    } else {
        console.log('Terhubung ke Database Amazon RDS');
    }
});

// --- KONFIGURASI S3 (PENTING: Harus sinkron dengan SDK V3) ---
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

// --- KONFIGURASI UPLOAD KE S3 ---
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `laporan/${Date.now().toString()}-${file.originalname}`);
        }
    })
});

// --- FITUR UTAMA ---

app.get('/status', (req, res) => {
    res.json({ 
        status: "online", 
        message: "TransBandung Monitor API is Running",
        timestamp: new Date()
    });
});

app.post('/lapor', upload.single('foto'), (req, res) => {
    const { deskripsi, lokasi } = req.body;
    const fotoUrl = req.file ? req.file.location : null;

    if (!deskripsi || !lokasi) {
        return res.status(400).json({ error: "Deskripsi dan Lokasi wajib diisi" });
    }

    const query = "INSERT INTO laporan (deskripsi, lokasi, foto_url) VALUES (?, ?, ?)";
    db.query(query, [deskripsi, lokasi, fotoUrl], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Gagal menyimpan data ke RDS" });
        }
        res.json({
            message: "Laporan berhasil dikirim ke RDS & S3!",
            data: { deskripsi, lokasi, fotoUrl }
        });
    });
});

app.listen(port, () => {
    console.log(`Server TransBandung berjalan di port ${port}`);
});