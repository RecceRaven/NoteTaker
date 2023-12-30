const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up routes here

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Landing Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  
  // Notes Page
  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
  });
  
  // Save Note
  app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    notes.push(newNote);
    fs.writeFileSync('db.json', JSON.stringify(notes));
    res.json(newNote);
  });
  
  // Load Existing Notes
  app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    res.json(notes);
  });
  
  // Additional routes for Clear Form, Delete Note, etc.
   