# Enterprise Inventory Management System

A full-stack enterprise-grade inventory management system built with React (Frontend) and Laravel 13 (Backend API). This application features secure token-based authentication, real-time barcode scanning, and optimized data rendering.

## 🚀 Key Features

* **Secure Authentication:** REST API protection using Laravel Sanctum (Token-based Auth).
* **Hardware Integration:** Real-time physical barcode scanning using device webcams (`html5-qrcode`).
* **Barcode Generation:** Automated digital barcode ID creation for physical label printing (`react-barcode`).
* **Print-Ready Mode:** Custom CSS media queries for clean, UI-free hardware printing.
* **Data Export:** Instantly export inventory data to CSV formats.
* **State Management & Pagination:** Seamless frontend data handling with robust error boundaries and unauthenticated route protection.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Create React App)
* React Bootstrap & SweetAlert2
* Axios (with global Bearer Token injection)
* html5-qrcode & react-barcode

**Backend:**
* Laravel 13
* MySQL (Laragon)
* Laravel Sanctum

## 📦 Installation Guide

### 1. Backend Setup (`/myinventory-be`)
```bash
cd myinventory-be
composer install
cp .env.example .env
php artisan key:generate

```

* Configure your MySQL database credentials in `.env`.

```bash
php artisan migrate
php artisan storage:link
php artisan serve

```

### 2. Frontend Setup (`/myinventory-fe`)

```bash
cd myinventory-fe
npm install
npm start

```

## 🔐 Default Credentials

* **Email:** admin@gmail.com
* **Password:** password
