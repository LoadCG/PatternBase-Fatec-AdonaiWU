import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patternbase';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsPath = path.resolve(__dirname, '../uploads');
const assetsPath = path.resolve(__dirname, '../assets');
fs.mkdirSync(uploadsPath, { recursive: true });
const upload = multer({ dest: uploadsPath });

const parseList = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value !== 'string') return [value];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
};

const printSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  technique: { type: String, default: 'Digital' },
  collection: { type: String, default: 'Sem coleção' },
  colors: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ['Rascunho', 'Em revisão', 'Publicado'], default: 'Rascunho' },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

const Print = mongoose.model('Print', printSchema);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsPath));
app.use('/assets', express.static(assetsPath));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', project: 'PatternBase' }));

app.get('/api/prints', async (_req, res, next) => {
  try { res.json(await Print.find().sort({ createdAt: -1 })); } catch (error) { next(error); }
});

app.post('/api/prints', upload.single('image'), async (req, res, next) => {
  try {
    const payload = { ...req.body };
    payload.colors = parseList(payload.colors);
    payload.tags = parseList(payload.tags);
    if (req.file) payload.imageUrl = `/uploads/${req.file.filename}`;
    res.status(201).json(await Print.create(payload));
  } catch (error) { next(error); }
});

app.put('/api/prints/:id', async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (Object.hasOwn(req.body, 'colors')) payload.colors = parseList(req.body.colors);
    if (Object.hasOwn(req.body, 'tags')) payload.tags = parseList(req.body.tags);
    const updated = await Print.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Estampa não encontrada.' });
    res.json(updated);
  } catch (error) { next(error); }
});

app.delete('/api/prints/:id', async (req, res, next) => {
  try {
    const deleted = await Print.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Estampa não encontrada.' });
    res.status(204).end();
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Erro interno ao processar a requisição.' });
});

const initialPrint = {
  name: 'Eu fui Salvo',
  description: 'ESTAMPA DE CAMISETA CRISTÃ | DESIGN GRÁFICO GOSPEL Tema: Efésios 2:8 Eu fui Salvo 🕊️',
  technique: 'Digital',
  collection: 'Cristã',
  colors: ['#fefefe', '#0390fc', '#010101'],
  tags: ['oversized', 'cristã'],
  status: 'Publicado',
  imageUrl: '/assets/eu-fui-salvo-1080x1440.jpg'
};

mongoose.connect(mongoUri)
  .then(async () => {
    if (await Print.countDocuments() === 0) await Print.create(initialPrint);
    app.listen(port, () => console.log(`PatternBase API em http://localhost:${port}`));
  })
  .catch((error) => { console.error('Falha ao conectar ao MongoDB:', error.message); process.exit(1); });
