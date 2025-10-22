# 🎮 River Raid - Online Leaderboard Server

A Node.js server that provides real-time online leaderboard functionality for the River Raid game.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start server
npm start

# Server runs on http://localhost:3000
```

### Access Leaderboard

Open browser to: `http://localhost:3000/leaderboard.html`

## 📡 API Endpoints

### GET /api/leaderboard
Returns all player data

**Response:**
```json
{
  "players": [
    {
      "username": "Player1",
      "HighScore": 1234,
      "level": 5,
      "player": { "fuel": 45.5 },
      "enemies": []
    }
  ]
}
```

### POST /api/score
Submit a new score

**Request Body:**
```json
{
  "username": "Player1",
  "score": 1234,
  "level": 5,
  "fuel": 45.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Score submitted successfully",
  "highScore": 1234
}
```

### GET /api/stats
Get leaderboard statistics

**Response:**
```json
{
  "totalPlayers": 10,
  "highestScore": 5000,
  "averageScore": 1250,
  "topPlayer": { "username": "Champion", "HighScore": 5000 }
}
```

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions to Render, Railway, Heroku, or Glitch.

## 🔧 Configuration

- **PORT**: Set via environment variable or defaults to 3000
- **Data Storage**: leaderboard-data.json (auto-created)

## 📁 Project Structure

```
online-server/
├── server.js              # Main server file
├── package.json           # Dependencies
├── DEPLOYMENT_GUIDE.md    # Deployment instructions
├── public/                # Static files
│   ├── leaderboard.html   # Leaderboard webpage
│   ├── leaderboard.css    # Styles
│   └── leaderboard-online.js  # Frontend logic
└── leaderboard-data.json  # Data storage (auto-created)
```

## 🛠️ Development

```bash
# Install nodemon for auto-restart
npm install --save-dev nodemon

# Run in development mode
npm run dev
```

## 📝 License

MIT
