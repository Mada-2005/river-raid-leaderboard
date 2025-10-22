// Online Leaderboard JavaScript - Connects to server API

// Configuration
const API_BASE_URL = window.location.origin;  // Automatically use the same server
const API_ENDPOINTS = {
    leaderboard: `${API_BASE_URL}/api/leaderboard`,
    stats: `${API_BASE_URL}/api/stats`,
    score: `${API_BASE_URL}/api/score`
};

// Global variables
let playersData = [];
let currentSort = 'score';
let autoRefreshInterval = null;
let isOnline = false;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Online leaderboard initialized');
    console.log('API URL:', API_BASE_URL);

    document.getElementById('serverUrl').textContent = API_BASE_URL;

    loadLeaderboard();
    setupSearch();
    setupAutoRefresh();
});

// Load leaderboard data from server API
async function loadLeaderboard() {
    try {
        console.log('Fetching from:', API_ENDPOINTS.leaderboard);
        updateStatus('connecting');

        const response = await fetch(API_ENDPOINTS.leaderboard);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data loaded:', data);

        if (!data.players || !Array.isArray(data.players)) {
            throw new Error('Invalid data format: players array not found');
        }

        playersData = data.players;
        isOnline = true;
        updateStatus('online');

        // Hide error message, show leaderboard
        document.getElementById('errorMessage').style.display = 'none';
        document.querySelector('.leaderboard-section').style.display = 'block';

        // Process and display data
        updateStats(playersData);
        displayLeaderboard(playersData);
        updateLastUpdateTime();

    } catch (error) {
        console.error('Error loading leaderboard:', error);
        isOnline = false;
        updateStatus('offline');
        showError(error.message);
    }
}

// Update connection status indicator
function updateStatus(status) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    switch(status) {
        case 'online':
            statusDot.className = 'status-dot online';
            statusText.textContent = '🟢 Connected';
            break;
        case 'offline':
            statusDot.className = 'status-dot offline';
            statusText.textContent = '🔴 Offline';
            break;
        case 'connecting':
            statusDot.className = 'status-dot connecting';
            statusText.textContent = '🟡 Connecting...';
            break;
    }
}

// Display leaderboard data in table
function displayLeaderboard(players) {
    const tbody = document.getElementById('leaderboardBody');

    if (players.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <div style="font-size: 3em; margin-bottom: 20px;">🎮</div>
                    <h3>No players yet!</h3>
                    <p>Be the first to play and set a high score!</p>
                </td>
            </tr>
        `;
        return;
    }

    // Sort players
    let sortedPlayers = sortPlayers(players, currentSort);

    // Generate table rows
    let html = '';
    sortedPlayers.forEach((player, index) => {
        const rank = index + 1;
        const rankBadgeClass = getRankBadgeClass(rank);
        const playerNameClass = rank === 1 ? 'top-player' : '';

        const username = player.username || 'Anonymous';
        const highScore = player.HighScore || 0;
        const level = player.level || calculateLevel(highScore);
        const fuel = player.player?.fuel || 0;
        const enemiesCount = player.enemies?.length || 0;

        html += `
            <tr>
                <td class="rank-col">
                    <div class="rank-badge ${rankBadgeClass}">
                        ${rank <= 3 ? getMedalEmoji(rank) : rank}
                    </div>
                </td>
                <td class="name-col">
                    <span class="player-name ${playerNameClass}">${escapeHtml(username)}</span>
                </td>
                <td class="score-col">
                    <span class="score-value">${highScore.toLocaleString()}</span>
                </td>
                <td class="level-col">
                    <span class="level-badge">Level ${level}</span>
                </td>
                <td class="fuel-col">
                    <div class="fuel-bar">
                        <div class="fuel-fill" style="width: ${Math.min(Math.abs(fuel), 100)}%"></div>
                    </div>
                    <div style="font-size: 0.85em; margin-top: 5px;">${Math.round(Math.abs(fuel))}%</div>
                </td>
                <td class="enemies-col">
                    ${enemiesCount} enemies
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Update statistics cards
function updateStats(players) {
    if (players.length === 0) {
        document.getElementById('totalPlayers').textContent = '0';
        document.getElementById('topScore').textContent = '0';
        document.getElementById('avgScore').textContent = '0';
        return;
    }

    document.getElementById('totalPlayers').textContent = players.length;

    const scores = players.map(p => p.HighScore || 0);
    const topScore = Math.max(...scores);
    document.getElementById('topScore').textContent = topScore.toLocaleString();

    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    document.getElementById('avgScore').textContent = avgScore.toLocaleString();
}

// Sort players
function sortPlayers(players, sortBy) {
    let sorted = [...players];

    if (sortBy === 'score') {
        sorted.sort((a, b) => (b.HighScore || 0) - (a.HighScore || 0));
    } else if (sortBy === 'name') {
        sorted.sort((a, b) => {
            const nameA = (a.username || '').toLowerCase();
            const nameB = (b.username || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }

    return sorted;
}

// Sort leaderboard (called from buttons)
function sortLeaderboard(sortBy) {
    currentSort = sortBy;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    displayLeaderboard(playersData);
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (searchTerm === '') {
            displayLeaderboard(playersData);
            document.getElementById('noResults').style.display = 'none';
            document.querySelector('.leaderboard-section').style.display = 'block';
        } else {
            const filtered = playersData.filter(player => {
                const username = (player.username || '').toLowerCase();
                return username.includes(searchTerm);
            });

            if (filtered.length === 0) {
                document.querySelector('.leaderboard-section').style.display = 'none';
                document.getElementById('noResults').style.display = 'block';
            } else {
                document.getElementById('noResults').style.display = 'none';
                document.querySelector('.leaderboard-section').style.display = 'block';
                displayLeaderboard(filtered);
            }
        }
    });
}

// Setup auto-refresh
function setupAutoRefresh() {
    // Refresh every 10 minutes
    autoRefreshInterval = setInterval(() => {
        console.log('Auto-refreshing leaderboard...');
        loadLeaderboard();
    }, 600000);  // 600000ms = 10 minutes
}

// Refresh leaderboard
function refreshLeaderboard() {
    console.log('Manual refresh triggered');
    loadLeaderboard();
}

// Helper functions
function getRankBadgeClass(rank) {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return 'rank-other';
}

function getMedalEmoji(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
}

function calculateLevel(score) {
    return Math.floor(score / 100) + 1;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('lastUpdate').textContent = timeString;
}

function showError(message) {
    document.querySelector('.leaderboard-section').style.display = 'none';
    document.getElementById('noResults').style.display = 'none';

    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'block';

    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
}

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
});
