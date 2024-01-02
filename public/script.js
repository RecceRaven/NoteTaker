// Function to load existing notes as links
function loadExistingNotes() {
    fetch('/api/notes')
    .then(response => response.json())
    .then(notes => {
        const notesContainer = document.getElementById('existing-notes');
        notesContainer.innerHTML = ''; // Clear existing notes
        notes.forEach(note => {
            const noteLink = document.createElement('a');
            noteLink.href = '#';
            noteLink.classList.add('note-link');
            noteLink.dataset.id = note.id;
            noteLink.innerHTML = `<p><strong>${note.title}</strong>: ${note.text.substring(0, 10)}${note.text.length > 10 ? '...' : ''}</p>`;
           notesContainer.appendChild(noteLink);
        });
    })
    .catch(error => console.error('Error loading notes:', error));
}

// Function to save a new note
function saveNote(event) {
    event.preventDefault();

    const title = document.getElementById('note-title').value;
    const text = document.getElementById('note-text').value;

    if (title && text) {
        const newNote = { title, text };

        fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNote)
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Response Data:', data);
            console.log(`Note saved with ID: ${data.id}`);
            loadExistingNotes();
            clearForm();
        })
        .catch(error => console.error('Error saving note:', error));
    } else {
        alert('Please enter both title and text for the note.');
    }
}

// Function to display details of the clicked note
function displayClickedNoteDetails(noteId) {
    fetch(`/api/notes/${noteId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(note => {
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-text').value = note.text;
        console.log(noteId);
    })
    .catch(error => {
        console.error('Error fetching note details:', error);
    });
}

// Function to clear the form fields
function clearForm() {
    document.getElementById('note-title').value = '';
    document.getElementById('note-text').value = '';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadExistingNotes(); // Load existing notes when the page loads

    // Event listener for the Save Note button
    document.getElementById('save-note').addEventListener('click', saveNote);

    // Event listener for the Clear Form button
    document.getElementById('clear-form').addEventListener('click', clearForm);


    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('note-link')) {
            event.preventDefault();
            const noteId = event.target.dataset.id;
            displayClickedNoteDetails(noteId);
            console.log('success!')
        }
    });
});