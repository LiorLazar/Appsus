import { noteService } from '../services/note.service.js'
const { useState, useEffect } = React

export function NoteList() {
    const [notes, setNotes] = useState([])

    useEffect(() => {
        noteService.query()
            .then(notes => {
                setNotes(notes)
                console.log('Notes loaded:', notes)
            })
            .catch(err => {
                console.error('Failed to load notes', err)
                setError('Failed to load notes')
            })
    }, [])

    function renderNote(note) {
        const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff'

        switch (note.type) {
            case 'NoteTxt':
                return (
                    <div className="note-card" style={{ backgroundColor }}>
                        <h2 className="note-title">{note.info.title}</h2>
                        <p className="note-text">{note.info.txt}</p>
                    </div>
                )
            case 'NoteImg':
                return (
                    <div className="note-card" style={{ backgroundColor }}>
                        <img src={note.info.url} alt={note.info.title} className="note-img" />
                        <h2 className="note-title">{note.info.title}</h2>
                    </div>
                )
            case 'NoteTodos':
                return (
                    <div className="note-card" style={{ backgroundColor }}>
                        <h2 className="note-title">{note.info.title}</h2>
                        <ul className="note-todos">
                            {note.info.todos.map((todo, idx) => (
                                <li key={idx} className={`todo-item ${todo.doneAt ? 'done' : ''}`}>
                                    {todo.txt}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <section className="note-list">
            <h1>Notes</h1>
            {notes.length ? (
                <div className="note-container">
                    {notes.map(note => (
                        <div key={note.id} className="note-item">
                            {renderNote(note)}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-notes-message">No notes available</p>
            )}
        </section>
    )
}