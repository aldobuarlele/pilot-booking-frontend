💻 2. README.md untuk Repositori FRONTEND (`pilot-booking-frontend`)

```markdown
# 🌐 Pilot Booking System - Enterprise Web Portal

[![Next.js](https://img.shields.io/badge/Next.js-14%2B-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-764ABC?style=flat-square)](https://github.com/pmndrs/zustand)

The modern, highly responsive, and elegant user interface for the **Pilot Booking System**. Built with Next.js and Tailwind CSS, providing a seamless booking experience for customers and a powerful command center for administrators.

## ✨ Key Features

* **Elegant Public Catalog:** Glassmorphism UI, dynamic service cards, and real-time quota indicators.
* **Secure Admin Dashboard:** Centralized command center to manage bookings, approve payments, and update system configurations.
* **Dynamic Multipart Uploads:** Seamless image uploading for service facilities directly from the browser.
* **Layered Security (Auto-Logout):** Proactive and reactive JWT expiration handling (15-minute idle kick) integrated with Axios Interceptors.
* **Centralized State Management:** Optimized and fast global state handling using Zustand.
* **Dynamic Theme System:** Admin-configurable primary colors, company names, and system variables that reflect instantly on the public site.

## 🛠️ Technology Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **HTTP Client:** Axios

## ⚙️ Prerequisites

* [Node.js](https://nodejs.org/) (v18.x or newer)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* The **Pilot Booking System Core API (Backend)** must be running locally or deployed.

## 🚀 Getting Started

### 1. Install Dependencies
Clone the repository and install the required npm packages:
```bash
npm install
# or
yarn install
2. Environment Variables

Create a .env.local file in the root directory and define the backend API URL:

Cuplikan kode
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
3. Run the Development Server

Start the Next.js local development server:

Bash
npm run dev
# or
yarn dev
4. Access the Application

Public Portal (Landing Page): http://localhost:3000

Admin Login: http://localhost:3000/admin/login (Default: admin / admin123)

📁 Directory Structure
Plaintext
src/
├── app/            # Next.js App Router pages (admin, book, public)
├── components/     # Reusable UI components (ThemeProvider, Alerts)
├── lib/            # Utilities (Axios instance, Interceptors)
└── store/          # Zustand global state (adminStore, authStore, themeStore)
🔒 Security Implementation Notes
This frontend implements a dual-layer security mechanism for Admin sessions:

Axios Response Interceptors: Automatically purges credentials and redirects to login if the backend returns 401 Unauthorized or 403 Forbidden.

JWT Expiry Timer: Decodes the token payload upon login and schedules a proactive auto-logout exactly when the 15-minute epoch window expires.