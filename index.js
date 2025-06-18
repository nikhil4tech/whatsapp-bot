const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 1️⃣ Use LocalAuth to persist session
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

// 2️⃣ WhatsApp events
client.on('qr', qr => {
  console.log('Scan this QR code:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ WhatsApp bot is ready!');
});

client.on('authenticated', () => {
  console.log('🔐 Authenticated!');
});

client.on('auth_failure', msg => {
  console.error('❌ Auth failed:', msg);
});

client.on('disconnected', reason => {
  console.log('🔌 Disconnected:', reason);
});

client.initialize();

// 3️⃣ Send message endpoint for n8n or external APIs
app.post('/send-message', async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ status: 'error', message: 'Missing number or message' });
  }

  const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;

  try {
    await client.sendMessage(formattedNumber, message);
    res.json({ status: 'success', message: `Message sent to ${number}` });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ status: 'error', message: 'Failed to send message', error });
  }
});

// 4️⃣ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
