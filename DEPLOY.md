# 🌹 La Maison Rouge — Deployment Guide

## How to Make Your Restaurant Website Live (Step by Step)

---

## STEP 1 — Run Locally First (Test on Your Computer)

### 1.1 Install Node.js
- Go to https://nodejs.org
- Download the **LTS version** (e.g., 20.x)
- Run the installer, click Next through all steps
- Open Terminal (Mac/Linux) or Command Prompt (Windows)
- Verify: `node --version` → should show v18 or higher

### 1.2 Set Up the Project
```bash
# Navigate to your project folder
cd la-maison-rouge

# Install dependencies (creates node_modules folder)
npm install
```

### 1.3 Start the Server
```bash
npm start
```

### 1.4 Open in Browser
- **Guest Menu:** http://localhost:3000
- **Kitchen Dashboard:** http://localhost:3000/kitchen.html

---

## STEP 2 — Push to GitHub (Version Control)

### 2.1 Install Git
- Download from https://git-scm.com/downloads
- Install with default settings

### 2.2 Create a GitHub Account
- Go to https://github.com
- Sign up for a free account

### 2.3 Create a New Repository
- Click the green **"New"** button on GitHub
- Repository name: `la-maison-rouge`
- Set to **Public** (required for free hosting)
- Do NOT check "Add a README" (we already have files)
- Click **Create repository**

### 2.4 Push Your Code
```bash
# In your project folder:
git init
git add .
git commit -m "Initial commit - La Maison Rouge restaurant website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/la-maison-rouge.git
git push -u origin main
```
> Replace YOUR_USERNAME with your actual GitHub username

---

## STEP 3 — Deploy to Render (Free Hosting with Backend Support)

Render is the best free option for Node.js apps with a backend server.

### 3.1 Create a Render Account
- Go to https://render.com
- Click **"Get Started for Free"**
- Sign up using your GitHub account (easiest)

### 3.2 Create a New Web Service
1. From the Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Click **"Connect account"** to link your GitHub
4. Find your `la-maison-rouge` repository → click **Connect**

### 3.3 Configure the Deployment
Fill in these exact settings:

| Field | Value |
|-------|-------|
| Name | `la-maison-rouge` |
| Region | Singapore (closest to India) |
| Branch | `main` |
| Root Directory | *(leave blank)* |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | **Free** |

### 3.4 Click "Create Web Service"
- Render will automatically pull your code from GitHub
- Build takes about 2-3 minutes
- You'll see build logs in real time

### 3.5 Get Your Live URL
- Once deployed, Render gives you a URL like:
  `https://la-maison-rouge.onrender.com`
- **Guest Menu:** `https://la-maison-rouge.onrender.com`
- **Kitchen View:** `https://la-maison-rouge.onrender.com/kitchen.html`

---

## STEP 4 — Important Notes About Render Free Tier

⚠️ **Free tier spins down after 15 minutes of inactivity.**
The first request after sleep takes ~30 seconds to wake up. To avoid this:
- Option A: Upgrade to Render's Starter plan ($7/month) — stays always on
- Option B: Use UptimeRobot (free) to ping your site every 5 minutes

### Set Up UptimeRobot (Free Keep-Alive)
1. Go to https://uptimerobot.com → Sign up free
2. Click **"Add New Monitor"**
3. Monitor Type: **HTTP(s)**
4. Friendly Name: `La Maison Rouge`
5. URL: `https://la-maison-rouge.onrender.com`
6. Monitoring Interval: **5 minutes**
7. Click **Create Monitor**

---

## STEP 5 — Auto-Deploy on Code Changes

Every time you push new code to GitHub, Render will automatically redeploy!

```bash
# Make changes to your files, then:
git add .
git commit -m "Updated menu items"
git push
```
Render detects the push and redeploys automatically in ~2 minutes.

---

## STEP 6 — (Optional) Custom Domain

If you want `www.lamaisonrouge.com` instead of the Render URL:

1. Buy a domain from Namecheap (~$10/year) or GoDaddy
2. In Render → Your Service → **Settings** → **Custom Domains**
3. Click **"Add Custom Domain"**
4. Enter your domain, follow the DNS instructions

---

## STEP 7 — (Optional) Upgrade Storage for Production

The current app stores orders in a JSON file (`orders.json`).  
On Render's free tier, this file **resets** when the server restarts.

For persistent production storage, add a free database:

### Add MongoDB Atlas (Free Forever)
1. Go to https://cloud.mongodb.com → Sign up free
2. Create a free **M0 cluster** (512MB, always free)
3. Create a database user, get your connection string
4. Add to Render as an Environment Variable:
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://user:pass@cluster.mongodb.net/restaurant`

---

## 📁 Project Structure

```
la-maison-rouge/
├── public/
│   ├── index.html      ← Guest ordering page
│   ├── kitchen.html    ← Cook/kitchen dashboard
│   ├── style.css       ← All styles
│   └── app.js          ← Frontend logic
├── server/
│   ├── index.js        ← Node.js/Express backend
│   └── orders.json     ← Order storage (auto-created)
├── package.json
├── .gitignore
└── DEPLOY.md           ← This file
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| POST | `/api/orders` | Place a new order |
| PATCH | `/api/orders/:id/status` | Update order status |
| DELETE | `/api/orders` | Clear all orders |

---

*Happy cooking! 👨‍🍳*
