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

// ✅ Serve static files from the 'frontend' folder (relative to repo root)
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ✅ Submit endpoint (POST)
app.post('/api/submit', async (req, res) => {
  const { username, phone, message } = req.body;

  if (!username || !phone) {
    return res.status(400).json({ error: 'Username and phone are required.' });
  }

  let text = `📩 *New Data from User*\n`;
  text += `👤 Username: ${username}\n`;
  text += `📞 Phone: ${phone}\n`;
  if (message) text += `💬 Message: ${message}`;

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

    res.status(200).json({ message: 'Data sent to Telegram successfully!' });
  } catch (error) {
    console.error('Telegram send error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to send data to Telegram.' });
  }
});

// ✅ Catch-all route: serve index.html for any other request
// This ensures that even if someone goes to /random, they get the frontend
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(404).send('Frontend not found. Make sure index.html exists in the frontend folder.');
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});