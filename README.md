# 🌿 EcoTrack AI – Plastic-Free Campus Digital Ecosystem

A full-stack web application that tracks reusable container usage, detects plastic waste using AI, and incentivizes sustainable behavior through a Green Credits system.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ (https://nodejs.org)
- **MongoDB** running locally OR a MongoDB Atlas URI
- **npm** or **yarn**

---

## 📁 Project Structure

```
ecotrack-ai/
├── backend/          # Node.js + Express + MongoDB API
│   ├── models/       # Mongoose schemas (User, Transaction, Waste)
│   ├── routes/       # API routes (auth, transaction, admin)
│   ├── middleware/   # JWT auth middleware
│   ├── server.js     # Entry point
│   └── .env.example  # Environment variables template
└── frontend/         # React (Vite) application
    └── src/
        ├── context/  # Auth context (JWT state)
        ├── pages/    # All page components
        └── components/ # Navbar
```

---

## ⚙️ Setup Instructions

### Step 1: Setup Backend

```bash
cd ecotrack-ai/backend
npm install
```

Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecotrack
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
```

Start the backend:
```bash
npm run dev       # Development (with nodemon auto-restart)
# OR
npm start         # Production
```

✅ Backend runs at: http://localhost:5000

---

### Step 2: Setup Frontend

```bash
cd ecotrack-ai/frontend
npm install
npm run dev
```

✅ Frontend runs at: http://localhost:5173

---

### Step 3: Create Demo Users (Optional)

After starting the backend, register accounts via the UI or use these via the `/api/auth/register` endpoint:

**Admin Account:**
```json
{ "name": "Admin User", "email": "admin@eco.com", "password": "admin123", "role": "admin" }
```

**Student Account:**
```json
{ "name": "Student User", "email": "student@eco.com", "password": "student123", "role": "student" }
```

---

## 🌐 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | None | Register user |
| POST | /api/auth/login | None | Login + get JWT |
| GET | /api/auth/profile | JWT | Get current user |
| POST | /api/transaction/scan | JWT | Process QR scan (+10 credits) |
| GET | /api/transaction/my-history | JWT | Get user's transactions |
| GET | /api/admin/leaderboard | None | Top 10 users by credits |
| POST | /api/admin/plastic-detected | JWT | Log AI waste detection |
| GET | /api/admin/plastic-stats | Admin | Full analytics data |
| POST | /api/admin/redeem | JWT | Redeem green credits |

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 🔐 Auth | JWT-based login/register with bcrypt password hashing |
| 📷 QR Scanning | Simulated QR scan flow → credits + plastic avoided logged |
| 🤖 AI Detection | TensorFlow.js + MobileNet classifies waste images in-browser |
| 🌱 Green Credits | Earned per scan, redeemable for campus rewards |
| 🏆 Leaderboard | Top 10 students ranked by green credits |
| 📊 Analytics | Admin dashboard with bar charts, pie charts, stats |
| 💳 Redemption | Deduct credits for eco-rewards |

---

## 🤖 AI Plastic Detection Notes

The AI module uses **TensorFlow.js + MobileNet** which runs entirely **in the browser** (no server calls for classification). On first use:
- The model (~20MB) downloads from TensorFlow CDN
- Classification happens locally in your browser
- Results are then logged to the MongoDB backend

If TensorFlow packages aren't installed, run:
```bash
cd frontend
npm install @tensorflow/tfjs @tensorflow-models/mobilenet
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Pure CSS (Glassmorphism, custom) |
| Charts | Recharts |
| AI | TensorFlow.js + MobileNet |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

---

## ⚠️ Troubleshooting

**MongoDB not connecting?**
- Ensure MongoDB is running: `mongod` or `brew services start mongodb-community`
- Or use MongoDB Atlas: set `MONGO_URI=mongodb+srv://...` in `.env`

**CORS errors?**
- Backend allows `localhost:5173` and `localhost:3000` by default
- Edit `server.js` to add your frontend URL if different

**TensorFlow not loading?**
- Ensure you have `@tensorflow/tfjs` and `@tensorflow-models/mobilenet` installed
- Check browser console for errors; a strong internet connection needed for first model load

**Port conflicts?**
- Backend: change `PORT` in `.env`
- Frontend: edit `vite.config.js` → `server.port`
