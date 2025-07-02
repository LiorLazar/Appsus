import { NoteToolBar } from './NoteToolBar.jsx'
import { noteService } from '../services/note.service.js'
import { NoteAnimate } from '../services/NoteAnimate.js'

const { useState, useEffect, useRef } = React

export function NoteList() {
    const [notes, setNotes] = useState([])
    const containerRef = useRef(null)

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

    useEffect(() => {
        if (notes.length && containerRef.current) {
            // Initialize masonry layout
            NoteAnimate.initMasonry(containerRef.current)
            
            // Setup image load listeners
            const cleanupImages = NoteAnimate.setupImageListeners(containerRef.current)
            
            return cleanupImages
        }
    }, [notes])

    useEffect(() => {
        if (containerRef.current) {
            // Setup resize listener
            const cleanupResize = NoteAnimate.setupResizeListener(containerRef.current)
            
            return cleanupResize
        }
    }, [notes])

    function renderNote(note) {
        const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff'

        switch (note.type) {
            case 'NoteTxt':
                return (
                    <div className="note-card" style={{ backgroundColor }}>
                        <h2 className="note-title">{note.info.title}</h2>
                        <p className="note-text">{note.info.txt}</p>
                        <NoteToolBar note={note} />
                    </div>
                )
            case 'NoteImg':
                return (
                    <div className="note-card" style={{ backgroundColor }}>
                        <img 
                            src={note.info.url} 
                            alt={note.info.title} 
                            className="note-img"
                            onLoad={() => NoteAnimate.handleImageLoad(containerRef.current)}
                            onError={() => NoteAnimate.handleImageLoad(containerRef.current)}
                        />
                        <h2 className="note-title">{note.info.title}</h2>
                        <NoteToolBar note={note} className="tool-bar"/>
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
                        <NoteToolBar note={note} />
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <section className="note-list">
            {notes.length ? (
                <div className="note-container" ref={containerRef}>
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