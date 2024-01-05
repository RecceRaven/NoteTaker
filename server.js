const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Set up routes 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Landing Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });
  
  // Notes Page
  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });
  
// API endpoint to save a new note
app.post('/api/notes', (req, res) => {
    try {
        const newNote = req.body;
        const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
        
        // Assign a unique ID based on the current timestamp (this can be improved)
        newNote.id = Date.now();
        
        notes.push(newNote);
        fs.writeFileSync('db.json', JSON.stringify(notes, null, 2));
        res.json(newNote);
    } catch (error) {
        res.status(500).json({ message: 'Failed to save note', error: error.message });
    }
});
  // Load Existing Notes
  app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    res.json(notes);
  });
  
// API endpoint to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    let notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));

    // Filter out the note with the specified ID
    notes = notes.filter(note => note.id !== parseInt(noteId));

    // Write the updated notes back to db.json
    fs.writeFileSync('db.json', JSON.stringify(notes, null, 2));

    res.json({ message: 'Note deleted successfully!' });
});

// API endpoint to get a single note by ID
app.get('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));

    const foundNote = notes.find(note => note.id === parseInt(noteId));
    
    if (foundNote) {
        res.json(foundNote);
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
});
   