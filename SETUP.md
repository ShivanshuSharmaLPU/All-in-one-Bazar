# AllinOneBazar — Local Setup Guide

## Prerequisites

Make sure you have installed:
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) OR a free **MongoDB Atlas** account → https://mongodb.com/atlas
- **Git** (optional)

---

## Project Structure

```
AllinOneBazar-main/
├── backend/      ← Express + Node.js API
└── frontend/     ← React + Vite app
```

---

## Step 1 — Configure Backend Environment

Open `backend/.env` and fill in your credentials:

| Variable | Where to get it |
|---|---|
| `MONGO_URI` | Local: `mongodb://localhost:27017/allinonebazar` OR [MongoDB Atlas](https://mongodb.com/atlas) |
| `JWT_SECRET` | Any random long string (e.g. `mysupersecret123`) |
| `CLOUD_NAME`, `API_KEY`, `API_SECRET` | [Cloudinary Dashboard](https://cloudinary.com) |
| `CLIENT_ID`, `CLIENT_SECRET` | [Google Cloud Console](https://console.cloud.google.com) → Credentials → OAuth 2.0 |
| `GOOGLE_CALLBACK_URL` | Keep as `http://localhost:3000/api/v1/user/auth/google/callback` |
| `MAIL_USER` | Your Gmail address |
| `MAIL_PASS` | Gmail [App Password](https://myaccount.google.com/apppasswords) (16 chars, enable 2FA first) |
| `RAZORPAY_KEY_ID`, `RAZORPAY_SECRET` | [Razorpay Dashboard](https://dashboard.razorpay.com) → Settings → API Keys |

---

## Step 2 — Configure Frontend Environment

Open `frontend/.env`:
- `VITE_RAZORPAY_KEY_ID` → Same as `RAZORPAY_KEY_ID` from backend

---

## Step 3 — Google OAuth Setup (Important!)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable **Google+ API** or **Google People API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URI:
   ```
   http://localhost:3000/api/v1/user/auth/google/callback
   ```
7. Copy the **Client ID** and **Client Secret** to `backend/.env`

---

## Step 4 — Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

---

## Step 5 — Run the App

### Terminal 1 — Start Backend
```bash
cd backend
npm start
```
Backend runs at: **http://localhost:3000**

### Terminal 2 — Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## Minimum Setup (to just see the app running)

If you just want to run the app quickly without payment/email/OAuth:
1. Set up MongoDB (local is easiest — install and run `mongod`)
2. Set up Cloudinary (free tier available)
3. Fill in `JWT_SECRET` with any string
4. Set `FRONTEND_URL=http://localhost:5173` in backend `.env`
5. Leave Razorpay, Google, and Mail fields as placeholders — those features will just not work until filled

---

## Common Errors & Fixes

| Error | Fix |
|---|---|
| `MongoServerError` | Check your `MONGO_URI` — make sure MongoDB is running |
| `Cannot find module` | Run `npm install` in both `backend/` and `frontend/` |
| CORS error in browser | Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly |
| Google OAuth not working | Check redirect URI matches exactly in Google Console |
| Images not uploading | Check Cloudinary credentials |
