# TransBandung App - AWS Cloud Deployment

Aplikasi **TransBandung** adalah platform manajemen data transportasi yang dideploy menggunakan arsitektur modern di AWS. Projek ini merupakan bagian dari tugas **Evaluasi 2 (ETS 2)** untuk mata kuliah Cloud Computing.

## 🚀 Tech Stack
* **Backend:** Node.js & Express
* **Containerization:** Docker
* **Registry:** Amazon ECR (Elastic Container Registry)
* **Orchestration:** Amazon ECS (Elastic Container Service) - Fargate
* **Database:** Amazon RDS (Relational Database Service)
* **CI/CD:** GitHub Actions

## 🏗️ Architecture & CI/CD Flow
Sistem ini menggunakan pipeline otomatis. Setiap kali ada perubahan kode yang di-*push* ke branch `main`, GitHub Actions akan:
1. Melakukan **Build** image Docker.
2. Melakukan **Tagging** image ke region Sydney (`ap-southeast-2`).
3. Melakukan **Push** image ke Amazon ECR.
4. Melakukan **Deploy** atau update service pada Amazon ECS Fargate secara otomatis.

## 🛠️ Troubleshooting & Lessons Learned
Selama proses pengerjaan, ditemukan beberapa kendala teknis:
* **Region Mismatch:** Sempat terjadi error karena image di-*push* ke region Virginia (`us-east-1`) sementara Cluster ECS berada di Sydney (`ap-southeast-2`). Solusinya adalah melakukan sinkronisasi seluruh resource ke Sydney.
* **ECR Repository:** Deployment sempat gagal karena repository di Sydney belum dibuat secara manual. Setelah dibuat, pipeline berjalan lancar.
* **Port Mapping:** Penyesuaian port dari 80 ke 3000 agar sesuai dengan aplikasi Node.js.