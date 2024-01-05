function loadExistingNotes() {
    fetch('/api/notes')
    .then(response => response.json())
    .then(notes => {
        const notesContainer = document.getElementById('existing-notes');
        notesContainer.innerHTML = ''; // Clear existing notes
        
        notes.forEach(note => {
            const noteContainer = document.createElement('div');
            noteContainer.classList.add('is-flex', 'is-align-items-center', 'is-justify-content-space-between');

            const noteLink = document.createElement('a');
            noteLink.href = '#';
            noteLink.classList.add('note-link');
            noteLink.dataset.id = note.id;
            noteLink.innerHTML = `<p><strong>${note.title}</strong>: ${note.text.substring(0, 10)}${note.text.length > 10 ? '...' : ''}</p>`;
            
            // Add click event listener to each note link
            noteLink.addEventListener('click', function(event) {
                event.preventDefault(); 
                const clickedNoteId = this.dataset.id; 
                displayClickedNoteDetails(clickedNoteId); 
            });
            
            // Create Bulma delete button
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('button', 'is-small'); // Add Bulma classes for styling
            deleteButton.innerText = 'Delete';
            deleteButton.dataset.id = note.id;
            deleteButton.addEventListener('click', deleteNote); 

            noteContainer.appendChild(noteLink);
            noteContainer.appendChild(deleteButton); // Append delete button to note container
            notesContainer.appendChild(noteContainer);
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
    if (!noteId) {
        console.error('Note ID is undefined or null.');
        return;
    }

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
        console.log(`Successfully fetched details for note ID: ${noteId}`);
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

//Function to delete note
function deleteNote(event) {
    const noteId = event.target.dataset.id;

    if (confirm('Are you sure you want to delete this note?')) {
        fetch(`/api/notes/${noteId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(`Note with ID ${noteId} deleted successfully.`);
            loadExistingNotes(); 
        })
        .catch(error => {
            console.error('Error deleting note:', error);
        });
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadExistingNotes(); // Load existing notes when the page loads

    // Event listener for the Save Note button
    document.getElementById('save-note').addEventListener('click', saveNote);

    // Event listener for the Clear Form button
    document.getElementById('clear-form').addEventListener('click', clearForm);


});