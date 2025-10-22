// River Raid - Online Leaderboard Server
// This server receives scores from the game and serves the leaderboard

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'leaderboard-data.json');

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Initialize data file if it doesn't exist
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
        console.log('Data file exists');
    } catch {
        console.log('Creating new data file...');
        const initialData = { players: [] };
        await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
}

// Read leaderboard data
async function readLeaderboard() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading leaderboard:', error);
        return { players: [] };
    }
}

// Write leaderboard data
async function writeLeaderboard(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing leaderboard:', error);
        return false;
    }
}

// ==================== API ENDPOINTS ====================

// GET /api/leaderboard - Get all leaderboard data
app.get('/api/leaderboard', async (req, res) => {
    try {
        const data = await readLeaderboard();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

// POST /api/score - Submit a new score from the game
app.post('/api/score', async (req, res) => {
    try {
        const { username, score, level, fuel, enemies } = req.body;

        // Validate required fields
        if (!username || score === undefined) {
            return res.status(400).json({
                error: 'Missing required fields: username and score'
            });
        }

        // Read current data
        const data = await readLeaderboard();

        // Find existing player or create new entry
        let playerIndex = data.players.findIndex(p => p.username === username);

        const playerData = {
            username: username,
            HighScore: score,
            player: {
                fuel: fuel || 0,
                x: 600,
                y: 500
            },
            enemies: enemies || [],
            level: level || 1,
            lastUpdated: new Date().toISOString()
        };

        if (playerIndex >= 0) {
            // Update existing player only if new score is higher
            if (score > (data.players[playerIndex].HighScore || 0)) {
                data.players[playerIndex] = playerData;
                console.log(`Updated ${username}: new high score ${score}`);
            } else {
                console.log(`Score ${score} not higher than existing ${data.players[playerIndex].HighScore}`);
                return res.json({
                    success: true,
                    message: 'Score not higher than existing high score',
                    highScore: data.players[playerIndex].HighScore
                });
            }
        } else {
            // Add new player
            data.players.push(playerData);
            console.log(`Added new player: ${username} with score ${score}`);
        }

        // Save updated data
        const saved = await writeLeaderboard(data);

        if (saved) {
            res.json({
                success: true,
                message: 'Score submitted successfully',
                highScore: score
            });
        } else {
            res.status(500).json({ error: 'Failed to save score' });
        }

    } catch (error) {
        console.error('Error submitting score:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/game-state - Save complete game state (for save/load feature)
app.post('/api/game-state', async (req, res) => {
    try {
        const { username, gameState } = req.body;

        if (!username || !gameState) {
            return res.status(400).json({
                error: 'Missing required fields: username and gameState'
            });
        }

        const data = await readLeaderboard();
        let playerIndex = data.players.findIndex(p => p.username === username);

        if (playerIndex >= 0) {
            // Update existing player's game state
            data.players[playerIndex] = {
                ...data.players[playerIndex],
                ...gameState,
                lastUpdated: new Date().toISOString()
            };
        } else {
            // Create new player entry
            data.players.push({
                username: username,
                ...gameState,
                lastUpdated: new Date().toISOString()
            });
        }

        const saved = await writeLeaderboard(data);

        if (saved) {
            res.json({ success: true, message: 'Game state saved' });
        } else {
            res.status(500).json({ error: 'Failed to save game state' });
        }

    } catch (error) {
        console.error('Error saving game state:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/stats - Get leaderboard statistics
app.get('/api/stats', async (req, res) => {
    try {
        const data = await readLeaderboard();

        if (data.players.length === 0) {
            return res.json({
                totalPlayers: 0,
                highestScore: 0,
                averageScore: 0
            });
        }

        const scores = data.players.map(p => p.HighScore || 0);

        res.json({
            totalPlayers: data.players.length,
            highestScore: Math.max(...scores),
            averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            topPlayer: data.players.reduce((max, p) =>
                (p.HighScore || 0) > (max.HighScore || 0) ? p : max
            )
        });

    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

// DELETE /api/player/:username - Delete a player (for admin purposes)
app.delete('/api/player/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const data = await readLeaderboard();

        const initialLength = data.players.length;
        data.players = data.players.filter(p => p.username !== username);

        if (data.players.length < initialLength) {
            await writeLeaderboard(data);
            res.json({ success: true, message: `Deleted player: ${username}` });
        } else {
            res.status(404).json({ error: 'Player not found' });
        }

    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint - info about the API
app.get('/api', (req, res) => {
    res.json({
        name: 'River Raid Leaderboard API',
        version: '1.0.0',
        endpoints: {
            'GET /api/leaderboard': 'Get all leaderboard data',
            'POST /api/score': 'Submit a new score',
            'POST /api/game-state': 'Save complete game state',
            'GET /api/stats': 'Get leaderboard statistics',
            'DELETE /api/player/:username': 'Delete a player',
            'GET /health': 'Health check'
        }
    });
});

// Start server
async function startServer() {
    await initializeDataFile();

    app.listen(PORT, () => {
        console.log('========================================');
        console.log('  River Raid Leaderboard Server');
        console.log('========================================');
        console.log(`Server running on port ${PORT}`);
        console.log(`Local URL: http://localhost:${PORT}`);
        console.log(`API Info: http://localhost:${PORT}/api`);
        console.log(`Leaderboard: http://localhost:${PORT}/leaderboard.html`);
        console.log('========================================');
    });
}

startServer();
