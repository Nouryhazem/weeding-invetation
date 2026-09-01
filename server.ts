import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const DATA_DIR = path.join(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

const INITIAL_MESSAGES = [
  {
    id: 'msg-seed-nour',
    name: 'Noury',
    message: 'My beautiful Nour, I love you so much! Wishing you a lifetime of love and happiness 🤍',
    timestamp: 1757361600000,
    approved: true,
    capsuleType: 'today',
  },
];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(INITIAL_MESSAGES, null, 2), 'utf-8');
  } else {
    try {
      const content = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        // Clean out legacy demo placeholders if present
        const hasOldDemos = parsed.some(
          (m: { id?: string; name?: string }) =>
            m.id === 'msg-1' ||
            m.id === 'msg-2' ||
            m.id === 'msg-3' ||
            m.id === 'msg-4' ||
            m.name === 'عائلة الجابري' ||
            m.name === 'م. حسام وعائلته'
        );
        if (hasOldDemos || parsed.length === 0) {
          const userMessages = parsed.filter(
            (m: { id?: string; name?: string }) =>
              m.id !== 'msg-1' &&
              m.id !== 'msg-2' &&
              m.id !== 'msg-3' &&
              m.id !== 'msg-4' &&
              m.name !== 'عائلة الجابري' &&
              m.name !== 'م. حسام وعائلته' &&
              m.name !== 'د. سارة وفارس' &&
              m.name !== 'أصدقاء العمر'
          );
          const finalMessages = [
            INITIAL_MESSAGES[0],
            ...userMessages.filter((m: { id?: string }) => m.id !== 'msg-seed-nour'),
          ];
          fs.writeFileSync(MESSAGES_FILE, JSON.stringify(finalMessages, null, 2), 'utf-8');
        }
      }
    } catch {
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(INITIAL_MESSAGES, null, 2), 'utf-8');
    }
  }
}

function readMessages() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_MESSAGES;
  }
}

function writeMessages(messages: any[]) {
  ensureDataFile();
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Get messages (all or approved only)
  app.get('/api/messages', (req, res) => {
    try {
      const messages = readMessages();
      const approvedOnly = req.query.approved === 'true';
      if (approvedOnly) {
        return res.json(messages.filter((m: any) => m.approved === true));
      }
      res.json(messages);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve messages', details: err.message });
    }
  });

  // Submit new message
  app.post('/api/messages', (req, res) => {
    try {
      const { name, message, capsuleType } = req.body;
      const trimmedName = typeof name === 'string' ? name.trim() : '';
      const trimmedMessage = typeof message === 'string' ? message.trim() : '';
      const validCapsule = capsuleType === 'anniversary' ? 'anniversary' : 'today';

      if (!trimmedName) {
        return res.status(400).json({ success: false, message: 'برجاء كتابة الاسم الكريم' });
      }
      if (trimmedName.length > 50) {
        return res.status(400).json({ success: false, message: 'الاسم يجب ألا يتجاوز ٥٠ حرفاً' });
      }
      if (!trimmedMessage) {
        return res.status(400).json({ success: false, message: 'برجاء كتابة رسالتكم الكريمة' });
      }
      if (trimmedMessage.length < 3) {
        return res.status(400).json({ success: false, message: 'الرسالة يجب أن تكون ٣ أحرف على الأقل' });
      }
      if (trimmedMessage.length > 500) {
        return res.status(400).json({ success: false, message: 'الرسالة يجب ألا تتجاوز ٥٠٠ حرف' });
      }

      const newEntry = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: trimmedName,
        message: trimmedMessage,
        timestamp: Date.now(),
        approved: true, // auto-approved and available everywhere
        capsuleType: validCapsule,
      };

      const messages = readMessages();
      const updated = [newEntry, ...messages];
      writeMessages(updated);

      res.status(201).json({ success: true, entry: newEntry });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'حدث خطأ في الخادم أثناء الحفظ', error: err.message });
    }
  });

  // Approve a message
  app.patch('/api/messages/:id/approve', (req, res) => {
    try {
      const { id } = req.params;
      const messages = readMessages();
      const target = messages.find((m: any) => m.id === id);
      if (target) {
        target.approved = true;
        writeMessages(messages);
        return res.json({ success: true });
      }
      res.status(404).json({ success: false, message: 'Message not found' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Hide a message
  app.patch('/api/messages/:id/hide', (req, res) => {
    try {
      const { id } = req.params;
      const messages = readMessages();
      const target = messages.find((m: any) => m.id === id);
      if (target) {
        target.approved = false;
        writeMessages(messages);
        return res.json({ success: true });
      }
      res.status(404).json({ success: false, message: 'Message not found' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Delete a message
  app.delete('/api/messages/:id', (req, res) => {
    try {
      const { id } = req.params;
      const messages = readMessages();
      const updated = messages.filter((m: any) => m.id !== id);
      writeMessages(updated);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
