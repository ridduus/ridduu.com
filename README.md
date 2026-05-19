# Ronak Sharma — Portfolio Website

A modern, full-stack portfolio built with **Vite + React**, **Express.js**, **MongoDB**, and **Tailwind CSS v4**.

---

## 🗂 Project Structure

```
portfolio/
├── frontend/          # Vite + React + Tailwind CSS v4
│   ├── src/
│   │   ├── pages/     # Home, About, Skills, Projects, Reviews, Contact
│   │   ├── components/ # Navbar, Footer
│   │   └── index.css  # Tailwind v4 + CSS custom properties
│   ├── vite.config.js
│   └── package.json
│
├── backend/           # Express.js + MongoDB
│   ├── models/
│   │   └── Review.js  # Mongoose schema
│   ├── routes/
│   │   └── reviews.js # GET / POST / DELETE
│   ├── server.js
│   └── package.json
│
└── package.json       # Root scripts (concurrently)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1. Clone / Extract

```bash
cd portfolio
```

### 2. Set Up Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set your MONGODB_URI
npm install
```

**`.env` (backend)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ronak_portfolio
# OR Atlas:
# MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/ronak_portfolio
```

### 3. Set Up Frontend

```bash
cd ../frontend
cp .env.example .env
npm install
```

**`.env` (frontend)**
```
VITE_API_URL=/api
```

---

### 4. Run in Development

Open **two terminals**:

**Terminal 1 — Backend**
```bash
cd backend
npm run dev
# Server: http://localhost:5000
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
# App: http://localhost:5173
```

> The Vite dev server proxies `/api/*` → `http://localhost:5000` automatically.

---

### 5. OR run both together from root

```bash
# From portfolio/ root
npm install
npm run dev
```

---

## 🌐 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, stats, services preview |
| `/about` | About | Bio, stats, qualification timeline |
| `/skills` | Skills | Skill bars — Frontend, Backend, Network, Hardware |
| `/projects` | Projects | 5 project cards with links |
| `/reviews` | Reviews | MongoDB-backed reviews + submission form |
| `/contact` | Contact | Contact info + message form |

---

## 🗄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reviews` | Get all approved reviews |
| `POST` | `/api/reviews` | Submit a new review |
| `DELETE` | `/api/reviews/:id` | Delete a review (admin) |
| `GET` | `/api/health` | Health check |

### POST `/api/reviews` — Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Web Developer",
  "rating": 5,
  "message": "Amazing work!"
}
```

---

## 🏗 Production Build

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

Serve `dist/` with any static host (Vercel, Netlify, etc.) and deploy backend to Railway / Render / VPS.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite, React 18, React Router v6 |
| Styling | Tailwind CSS v4, CSS custom properties |
| Icons | Lucide React |
| Backend | Express.js 4 |
| Database | MongoDB + Mongoose |
| Dev Tools | Nodemon, Concurrently |

---

## 📧 Contact

**Ronak Sharma**  
Email: ronaksharma2350@gmail.com  
WhatsApp: +91 895-513-4408  
Messenger: ridvesh.sharma
