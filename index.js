const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');
const app = express();

app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', qr => {
  console.log('QR RECEIVED');
  qrcode.generate(qr, { small: true });  // Log to panel logs
});

client.on('ready', () => {
  console.log('WhatsApp bot is ready!');
});

client.initialize();

app.post('/send-message', async (req, res) => {
  const { number, message } = req.body;
  try {
    await client.sendMessage(`${number}@c.us`, message);
    res.send({ status: 'sent' });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));
