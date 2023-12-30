document.addEventListener('DOMContentLoaded', () => {
    // Fetch existing notes when the page loads
    loadExistingNotes();

    // Event listener for saving a new note
    document.getElementById('note-form').addEventListener('submit', saveNote);

    // Event listener for clicking an existing note (for future enhancement)
    // document.getElementById('existing-notes').addEventListener('click', displayNoteDetails);

    // Event listener for clearing the form
    document.getElementById('clear-form').addEventListener('click', clearForm);
});

// Function to load existing notes from the server
function loadExistingNotes() {
    fetch('/api/notes')
        .then(response => response.json())
        .then(data => {
            const notesContainer = document.getElementById('existing-notes');
            notesContainer.innerHTML = ''; // Clear existing notes

            data.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.className = 'note-item';
                noteElement.innerHTML = `<p><strong>${note.title}</strong>: ${note.text}</p>`;
                noteElement.addEventListener('click', () => displayNoteDetails(note));
                notesContainer.appendChild(noteElement);
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
        const newNote = {
            title,
            text
        };

        fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newNote)
        })
        .then(response => response.json())
        .then(() => {
            loadExistingNotes(); // Reload notes after saving
            clearForm();
        })
        .catch(error => console.error('Error saving note:', error));
    } else {
        alert('Please enter both title and text for the note.');
    }
}

// Function to display a clicked note's details (for future enhancement)
function displayNoteDetails(note) {
    // Implement this function to show the selected note details in the right-hand column
    // For now, you can console.log() the note details for testing purposes.
    console.log(note);
}

// Function to clear the form fields
function clearForm() {
    document.getElementById('note-title').value = '';
    document.getElementById('note-text').value = '';
}
