import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'dist')));

// Seed Data
const INITIAL_DATA = {
    shortcuts: [
        { id: '1', name: 'YouTube', url: 'https://youtube.com', iconName: 'Play', category: 'Leisure' },
        { id: '2', name: 'GitHub', url: 'https://github.com', iconName: 'Flame', category: 'Dev' },
        { id: '3', name: 'LeetCode', url: 'https://leetcode.com', iconName: 'Code2', category: 'Dev' },
        { id: '4', name: 'Telegram', url: 'https://web.telegram.org', iconName: 'Send', category: 'Social' },
        { id: '5', name: 'Twitter', url: 'https://twitter.com', iconName: 'Bird', category: 'Social' },
        { id: '6', name: 'WhatsApp', url: 'https://web.whatsapp.com', iconName: 'MessageSquare', category: 'Social' },
        { id: '7', name: 'OSi UniMAP', url: 'https://osi.unimap.edu.my', iconName: 'GraduationCap', category: 'Academic' }
    ],
    scratchpad: '',
    analytics: [],
    games: [
        { id: '1', title: 'Elden Ring', platform: 'PC', status: 'Completed', rating: '5/5' }
    ],
    projects: [],
    accounts: []
};

// Helper: Read Data
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2));
        return INITIAL_DATA;
    }
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (err) {
        return INITIAL_DATA;
    }
};

// API: Read
app.get('/api/data', (req, res) => {
    res.json(readData());
});

// API: Save
app.post('/api/data', (req, res) => {
    try {
        const current = readData();
        const updated = { ...current, ...req.body };
        fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Fallback: Serves index.html without invoking path-to-regexp
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Dashboard server running live at: http://localhost:${PORT}`);
    console.log(`📁 Data saving directly to: ${DATA_FILE}`);
    console.log(`==================================================\n`);
});