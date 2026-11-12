# DNYANEX Deployment Guide
Team MahaMinds • Smart Innovation Hackathon 2026

## 🚀 Option 1: Instant Frontend Deploy (Netlify Drop / Vercel)
You can deploy the frontend in 30 seconds:
1. Go to https://app.netlify.com/drop
2. Drag and drop the `dist/` folder from this directory.
3. Your web app is live with a public URL!

## 🚀 Option 2: Full-Stack Deploy on Render.com (Free)
1. Push this folder to a GitHub repository.
2. In Render Dashboard, click **New + Web Service**.
3. Select your repository.
4. Settings:
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5. Click **Deploy**.

## 🚀 Option 3: Local or Self-Hosted Production Run
```bash
# Terminal 1: Backend
pip install -r requirements.txt
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```
