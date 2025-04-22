# Panduan Deployment Aplikasi AI Pribadi

Dokumen ini berisi instruksi lengkap untuk men-deploy aplikasi AI pribadi Anda ke layanan hosting gratis. Aplikasi ini terdiri dari dua komponen utama: frontend (Next.js) dan backend (Node.js/Express).

## Daftar Isi
1. [Persiapan Akun](#1-persiapan-akun)
2. [Deployment Backend](#2-deployment-backend)
3. [Deployment Frontend](#3-deployment-frontend)
4. [Konfigurasi Variabel Lingkungan](#4-konfigurasi-variabel-lingkungan)
5. [Pengujian Aplikasi](#5-pengujian-aplikasi)
6. [Pemecahan Masalah](#6-pemecahan-masalah)
7. [Mendapatkan API Token Gratis](#7-mendapatkan-api-token-gratis)

## 1. Persiapan Akun

### 1.1 Membuat Akun Vercel (untuk Frontend)

1. Kunjungi [Vercel](https://vercel.com/) dan klik "Sign Up"
2. Anda dapat mendaftar menggunakan GitHub, GitLab, atau email
3. Ikuti langkah-langkah pendaftaran hingga selesai
4. Vercel menawarkan tier gratis yang cukup untuk aplikasi pribadi

### 1.2 Membuat Akun Railway.app (untuk Backend)

1. Kunjungi [Railway.app](https://railway.app/) dan klik "Login"
2. Anda dapat mendaftar menggunakan GitHub atau email
3. Railway menawarkan kredit gratis untuk pengguna baru ($5 kredit yang cukup untuk menjalankan aplikasi selama beberapa minggu)

### 1.3 Alternatif: Membuat Akun Render.com (untuk Backend)

1. Kunjungi [Render.com](https://render.com/) dan klik "Get Started"
2. Anda dapat mendaftar menggunakan GitHub atau email
3. Render menawarkan tier gratis untuk web services

### 1.4 Membuat Akun GitHub (opsional, tetapi direkomendasikan)

1. Kunjungi [GitHub](https://github.com/) dan klik "Sign Up"
2. Ikuti langkah-langkah pendaftaran
3. GitHub akan digunakan untuk menyimpan kode sumber dan memudahkan deployment

## 2. Deployment Backend

### 2.1 Menggunakan Railway.app

1. Login ke akun Railway.app Anda
2. Klik "New Project" dan pilih "Deploy from GitHub"
3. Jika Anda belum menghubungkan GitHub, ikuti langkah-langkah untuk menghubungkannya
4. Pilih repositori yang berisi kode backend (jika Anda belum mengupload ke GitHub, lihat langkah 2.1.1)
5. Setelah repositori terhubung, Railway akan otomatis mendeteksi aplikasi Node.js
6. Klik "Deploy" untuk memulai deployment
7. Setelah deployment selesai, klik "Variables" dan tambahkan variabel lingkungan berikut:
   - `PORT`: 3001
   - `HUGGING_FACE_TOKEN`: (opsional, lihat bagian 7.1)
   - `REPLICATE_TOKEN`: (opsional, lihat bagian 7.2)
   - `ALLOWED_ORIGINS`: URL frontend Anda (akan didapatkan setelah men-deploy frontend)
8. Catat URL backend yang diberikan oleh Railway (format: https://your-app-name.railway.app)

#### 2.1.1 Mengupload Kode ke GitHub

1. Buat repositori baru di GitHub
2. Inisialisasi Git di folder backend:
   ```bash
   cd /path/to/ai-app/backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/repo-name.git
   git push -u origin main
   ```

### 2.2 Menggunakan Render.com

1. Login ke akun Render.com Anda
2. Klik "New" dan pilih "Web Service"
3. Hubungkan dengan GitHub atau upload kode secara langsung
4. Berikan nama untuk web service Anda
5. Pilih "Node" sebagai runtime
6. Masukkan perintah build: `npm install`
7. Masukkan perintah start: `node server.js`
8. Pilih "Free" plan
9. Klik "Advanced" dan tambahkan variabel lingkungan yang sama seperti di langkah 2.1.7
10. Klik "Create Web Service" untuk memulai deployment
11. Catat URL backend yang diberikan oleh Render (format: https://your-app-name.onrender.com)

## 3. Deployment Frontend

### 3.1 Menggunakan Vercel

1. Login ke akun Vercel Anda
2. Klik "Add New" dan pilih "Project"
3. Impor repositori dari GitHub (jika Anda belum mengupload ke GitHub, lihat langkah 3.1.1)
4. Vercel akan otomatis mendeteksi aplikasi Next.js
5. Di bagian "Environment Variables", tambahkan:
   - `NEXT_PUBLIC_API_URL`: URL backend Anda dari langkah 2.1.8 atau 2.2.11, diikuti dengan `/api` (contoh: https://your-app-name.railway.app/api)
6. Klik "Deploy" untuk memulai deployment
7. Setelah deployment selesai, Vercel akan memberikan URL untuk aplikasi frontend Anda
8. Catat URL ini dan perbarui variabel `ALLOWED_ORIGINS` di backend Anda

#### 3.1.1 Mengupload Kode Frontend ke GitHub

1. Buat repositori baru di GitHub
2. Inisialisasi Git di folder frontend:
   ```bash
   cd /path/to/ai-app/frontend/ai-frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/repo-name-frontend.git
   git push -u origin main
   ```

## 4. Konfigurasi Variabel Lingkungan

### 4.1 Memperbarui ALLOWED_ORIGINS di Backend

1. Kembali ke dashboard Railway.app atau Render.com
2. Temukan variabel lingkungan untuk proyek backend Anda
3. Perbarui `ALLOWED_ORIGINS` dengan URL frontend dari Vercel (contoh: https://your-app-name.vercel.app)
4. Simpan perubahan dan tunggu backend di-deploy ulang

### 4.2 Memverifikasi Konfigurasi Frontend

1. Pastikan `NEXT_PUBLIC_API_URL` di frontend mengarah ke URL backend yang benar
2. Jika perlu diubah, perbarui di dashboard Vercel dan tunggu frontend di-deploy ulang

## 5. Pengujian Aplikasi

1. Buka URL frontend Anda di browser
2. Uji fitur-fitur berikut:
   - Chat interface
   - Generasi gambar
   - Analisis data (teks, file, dan peramalan)
3. Jika Anda belum menambahkan token API, aplikasi akan berjalan dalam mode demo

## 6. Pemecahan Masalah

### 6.1 Frontend Tidak Dapat Terhubung ke Backend

1. Periksa apakah URL backend di `NEXT_PUBLIC_API_URL` sudah benar
2. Pastikan `ALLOWED_ORIGINS` di backend sudah diperbarui dengan URL frontend
3. Periksa log di Vercel dan Railway/Render untuk melihat error

### 6.2 Error CORS

1. Pastikan `ALLOWED_ORIGINS` di backend sudah benar
2. Jika masih terjadi error, coba tambahkan protokol dan port yang benar (contoh: https://your-app-name.vercel.app)

### 6.3 Aplikasi Berjalan Lambat

1. Tier gratis dari layanan hosting biasanya memiliki batasan performa
2. Aplikasi mungkin "cold start" setelah tidak aktif beberapa saat
3. Ini normal untuk tier gratis dan tidak mempengaruhi fungsionalitas

## 7. Mendapatkan API Token Gratis

### 7.1 Hugging Face Token (untuk Generasi Gambar dan Analisis Teks)

1. Kunjungi [Hugging Face](https://huggingface.co/) dan buat akun
2. Setelah login, klik profil Anda di pojok kanan atas dan pilih "Settings"
3. Pilih "Access Tokens" dari menu sebelah kiri
4. Klik "New Token" dan berikan nama untuk token Anda
5. Pilih "Read" sebagai role
6. Klik "Generate Token" dan salin token yang dihasilkan
7. Tambahkan token ini sebagai `HUGGING_FACE_TOKEN` di variabel lingkungan backend

### 7.2 Replicate Token (untuk Generasi Gambar Alternatif)

1. Kunjungi [Replicate](https://replicate.com/) dan buat akun
2. Setelah login, klik profil Anda dan pilih "API Tokens"
3. Klik "Create Token" dan berikan nama untuk token Anda
4. Salin token yang dihasilkan
5. Tambahkan token ini sebagai `REPLICATE_TOKEN` di variabel lingkungan backend
6. Replicate memberikan kredit gratis untuk pengguna baru yang cukup untuk beberapa ratus permintaan

## Kesimpulan

Selamat! Anda telah berhasil men-deploy aplikasi AI pribadi Anda dengan hosting gratis. Aplikasi ini memiliki kemampuan generasi gambar dan analisis data yang dapat Anda gunakan untuk kebutuhan pribadi.

Jika Anda ingin mengembangkan aplikasi lebih lanjut, Anda dapat:
1. Menambahkan model AI lain dari Hugging Face atau Replicate
2. Meningkatkan antarmuka pengguna
3. Menambahkan fitur autentikasi untuk membatasi akses
4. Mengintegrasikan dengan layanan penyimpanan seperti AWS S3 atau Google Cloud Storage

Untuk pertanyaan atau bantuan lebih lanjut, silakan merujuk ke dokumentasi resmi dari layanan yang digunakan atau forum komunitas terkait.
