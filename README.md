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