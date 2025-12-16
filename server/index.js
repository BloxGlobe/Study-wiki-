const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');

function readJSON(file){
  try { return JSON.parse(fs.readFileSync(file,'utf8')||'[]'); } catch(e){ return []; }
}
function writeJSON(file, obj){ fs.writeFileSync(file, JSON.stringify(obj, null, 2)); }

function hashPassword(password){
  const salt = crypto.randomBytes(16).toString('base64');
  const derived = crypto.scryptSync(password, salt, 64).toString('base64');
  return { salt, hash: derived };
}

function verifyPassword(password, salt, hash){
  const derived = crypto.scryptSync(password, salt, 64).toString('base64');
  return derived === hash;
}

app.post('/api/signup', (req,res)=>{
  const { name, email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const users = readJSON(USERS_FILE);
  if (users.find(u=>u.email===email)) return res.status(409).json({ error: 'user exists' });
  const id = Date.now().toString();
  const { salt, hash } = hashPassword(password);
  const user = { id, name: name||'', email, salt, hash };
  users.push(user);
  writeJSON(USERS_FILE, users);
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post('/api/login', (req,res)=>{
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const users = readJSON(USERS_FILE);
  const user = users.find(u=>u.email===email);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  if (!verifyPassword(password, user.salt, user.hash)) return res.status(401).json({ error: 'invalid credentials' });
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.get('/api/notes', (req,res)=>{
  const notes = readJSON(NOTES_FILE);
  res.json(notes);
});

app.post('/api/notes', (req,res)=>{
  const note = req.body;
  const notes = readJSON(NOTES_FILE);
  note.id = Date.now().toString();
  notes.push(note);
  writeJSON(NOTES_FILE, notes);
  res.json(note);
});

app.put('/api/notes/:id', (req,res)=>{
  const notes = readJSON(NOTES_FILE);
  const id = req.params.id;
  const idx = notes.findIndex(n=>n.id===id);
  if (idx===-1) return res.status(404).json({ error: 'not found' });
  notes[idx] = { ...notes[idx], ...req.body };
  writeJSON(NOTES_FILE, notes);
  res.json(notes[idx]);
});

// Proxy endpoint to OpenAI. Requires OPENAI_API_KEY in env.
app.post('/api/ai', async (req,res)=>{
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: 'Server not configured with OPENAI_API_KEY' });
  const { prompt, options } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt required' });
  try {
    const payload = {
      model: (options && options.model) || 'gpt-4o-mini',
      messages: [{ role: 'user', content: String(prompt) }],
      max_tokens: (options && options.max_tokens) || 400
    };
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${key}`
      },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('Server listening on', PORT));
