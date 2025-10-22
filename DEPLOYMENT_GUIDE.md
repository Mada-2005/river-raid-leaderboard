# 🌐 River Raid Online Leaderboard - Deployment Guide

## 🎯 Overview

This guide will help you deploy your River Raid leaderboard online so **anyone can access it from anywhere in the world** with automatic real-time updates!

---

## 📦 What You Have

- **Node.js Server** (`server.js`) - Backend API
- **Leaderboard Website** (`public/`) - Frontend HTML/CSS/JS
- **C++ HTTP Client** (`OnlineLeaderboard.h`) - Sends scores from game

---

## 🚀 Quick Start (Local Testing)

### Step 1: Install Node.js Dependencies

```bash
cd "E:\C++ codes\Cpp project uni\RiverRaidGame\startup code\CIE101_ProjectStartupCode\online-server"
npm install
```

### Step 2: Start the Server

```bash
npm start
```

### Step 3: Open the Leaderboard

Open your browser to: `http://localhost:3000/leaderboard.html`

---

## 🌍 Deploy to the Internet (FREE Options)

### Option 1: Render.com (Recommended - EASIEST)

**Why Render?**
- ✅ Completely FREE
- ✅ Auto-deploys from GitHub
- ✅ HTTPS included
- ✅ No credit card required
- ✅ Easy setup

**Steps:**

1. **Create GitHub Repository**
   ```bash
   cd "E:\C++ codes\Cpp project uni\RiverRaidGame\startup code\CIE101_ProjectStartupCode\online-server"
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**
   - Create new repository on GitHub.com
   - Follow GitHub's instructions to push your code

3. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Sign up (free)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - **Name**: river-raid-leaderboard
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Click "Create Web Service"

4. **Get Your URL**
   - Render will give you a URL like: `https://river-raid-leaderboard.onrender.com`
   - Your leaderboard will be at: `https://river-raid-leaderboard.onrender.com/leaderboard.html`

5. **Update C++ Game**
   - Change server URL in your game code to your Render URL

---

### Option 2: Railway.app

**Steps:**

1. **Push code to GitHub** (same as above)

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js

3. **Get Your URL**
   - Railway gives you a URL
   - Access at: `https://your-app.up.railway.app/leaderboard.html`

---

### Option 3: Heroku (Classic Option)

**Steps:**

1. **Install Heroku CLI**
   - Download from [heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

2. **Create `Procfile`** (already included)
   ```
   web: node server.js
   ```

3. **Deploy**
   ```bash
   heroku login
   heroku create river-raid-leaderboard
   git push heroku main
   ```

4. **Access**
   - URL: `https://river-raid-leaderboard.herokuapp.com/leaderboard.html`

---

### Option 4: Glitch.com (Simplest - No Git Required)

**Steps:**

1. Go to [glitch.com](https://glitch.com)
2. Click "New Project" → "glitch-hello-node"
3. Delete their code
4. Copy/paste your `server.js`, `package.json`
5. Create `public/` folder and upload HTML/CSS/JS files
6. Done! Glitch gives you instant URL

---

## 🔧 Integrate with C++ Game

### Step 1: Add OnlineLeaderboard.h to Your Project

1. Copy `OnlineLeaderboard.h` to your project directory
2. Add to Visual Studio project (Right-click → Add → Existing Item)

### Step 2: Update Game.h

```cpp
#include "OnlineLeaderboard.h"

class Game {
private:
    // ... existing code ...
    OnlineLeaderboard* onlineLeaderboard;

public:
    // ... existing code ...
};
```

### Step 3: Update Game.cpp

```cpp
// In constructor
Game::Game() {
    // ... existing code ...

    // Initialize online leaderboard
    // Replace with your deployed URL
    onlineLeaderboard = new OnlineLeaderboard("https://your-app.onrender.com");
}

// In destructor
Game::~Game() {
    // ... existing code ...
    delete onlineLeaderboard;
}

// When game ends or score updates
void Game::endGame() {
    // ... existing code ...

    // Submit score online
    onlineLeaderboard->submitScore(
        username,
        points,
        level,
        gamePlane->GetFuel()
    );
}
```

### Step 4: Rebuild and Test

1. Build the game in Visual Studio
2. Run the game
3. Play and achieve a score
4. Check the online leaderboard - your score should appear!

---

## 🔄 How It Works

```
┌─────────────┐
│  C++ Game   │
│  (Windows)  │
└──────┬──────┘
       │ HTTP POST /api/score
       │ (when game ends)
       ▼
┌─────────────────┐
│  Node.js Server │ ◄── Deployed on Render/Railway/etc.
│  (server.js)    │
└────────┬────────┘
         │
         │ Stores in leaderboard-data.json
         │
         ▼
┌─────────────────┐
│  Leaderboard    │ ◄── Anyone can visit URL
│  Website        │     Auto-refreshes every 5 seconds
│  (public/*.html)│
└─────────────────┘
```

---

## 📝 Configuration

### Change Server URL in C++ Game

In your game code:
```cpp
onlineLeaderboard = new OnlineLeaderboard("https://YOUR-DEPLOYED-URL.com");
```

### Disable Online Leaderboard (Optional)

If you want to temporarily disable:
```cpp
onlineLeaderboard->setEnabled(false);
```

---

## 🔒 Security Considerations

### Current Setup (Good for personal/class projects)
- Anyone can submit scores
- No authentication
- Simple and fast

### For Production (Future Enhancement)
Consider adding:
- API key authentication
- Rate limiting
- Username validation
- CAPTCHA for score submission

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Make sure dependencies are installed
npm install

# Check if port 3000 is in use
# Change PORT in server.js if needed
```

### C++ game can't connect
- Check firewall settings
- Verify server URL is correct
- Make sure server is running
- Check internet connection

### Scores not appearing
- Check browser console (F12)
- Verify API endpoint is correct
- Check server logs

### Deployment fails
- Ensure `package.json` is included
- Check Node.js version compatibility
- Review deployment logs

---

## 📊 Monitoring Your Leaderboard

### Check Server Status
Visit: `https://your-url.com/health`

### View API Info
Visit: `https://your-url.com/api`

### Check Logs
- **Render**: Dashboard → Logs tab
- **Railway**: Project → Deployments → Logs
- **Heroku**: `heroku logs --tail`

---

## 💰 Cost Breakdown

### Free Tier Limits

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Render** | ✅ Free | 750 hours/month, sleeps after 15min inactivity |
| **Railway** | ✅ Free | $5 credit/month, ~500 hours |
| **Heroku** | ✅ Free | 550 hours/month (with credit card verification) |
| **Glitch** | ✅ Free | Sleeps after 5min, 4000 requests/hour |

**Recommendation**: Use **Render** - most generous free tier!

---

## 🔄 Auto-Updates

The leaderboard automatically:
- ✅ Refreshes every 5 seconds
- ✅ Shows new scores instantly
- ✅ Updates statistics in real-time
- ✅ Displays online/offline status

---

## 🎨 Customization

### Change Refresh Rate
Edit `public/leaderboard-online.js` line ~219:
```javascript
}, 5000);  // Change to desired milliseconds
```

### Modify Server Port
Edit `server.js` line 7:
```javascript
const PORT = process.env.PORT || 3000;  // Change 3000
```

---

## 📱 Share Your Leaderboard

Once deployed, share your URL:
```
https://your-app.onrender.com/leaderboard.html
```

Anyone can:
- View live rankings
- See top players
- Watch scores update in real-time
- No installation needed!

---

## 🎯 Next Steps

1. ✅ Deploy server to Render/Railway
2. ✅ Update C++ game with server URL
3. ✅ Test by playing the game
4. ✅ Share leaderboard URL with friends!

---

## 🆘 Need Help?

Common issues:
- **CORS errors**: Server handles this automatically
- **Connection refused**: Check server is running
- **404 errors**: Verify URL is correct
- **Slow updates**: Check auto-refresh is enabled

---

## 🎉 Success Checklist

- [ ] Server deployed and accessible
- [ ] Leaderboard loads in browser
- [ ] C++ game updated with server URL
- [ ] Score submission works
- [ ] Leaderboard updates in real-time
- [ ] Shared URL with others

---

**You're all set! Your River Raid leaderboard is now LIVE and accessible to the world! 🚀🏆**
