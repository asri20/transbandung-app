const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(express.json());

// KONEKSI DATABASE (Amazon RDS)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// KONFIGURASI S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

// KONFIGURASI UPLOAD KE S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname});
        },
        key: (req, file, cb) => {
            cb(null, `laporan/${Date.now().toString()}-${file.originalname}`)
        }
    })
});

// --- FITUR UTAMA ---

// Fitur 1: Home (Health Check untuk ECS)
app.get('/', (req, res) => {
    res.json({ status: "online", message: "TransBandung Monitor API is Running" });
});

// Fitur 2 & 3: Lapor & Upload Foto
app.post('/lapor', upload.single('foto'), (req, res) => {
    const { deskripsi, lokasi } = req.body;
    const fotoUrl = req.file ? req.file.location : null;

    const query = "INSERT INTO laporan (deskripsi, lokasi, foto_url) VALUES (?, ?, ?)";
    db.query(query, [deskripsi, lokasi, fotoUrl], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
            message: "Laporan berhasil dikirim ke RDS & S3!",
            data: { deskripsi, lokasi, fotoUrl }
        });
    });
});

app.listen(3000, () => console.log('Server berjalan di port 3000'));