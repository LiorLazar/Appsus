import { NoteTxt } from './NoteTxt.jsx'
import { NoteImg } from './NoteImg.jsx'
import { NoteTodos } from './NoteTodos.jsx'
import { NoteVideo } from './NoteVideo.jsx'
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
        switch (note.type) {
            case 'NoteTxt': return ( <NoteTxt note={note}/> )

            case 'NoteImg': return ( <NoteImg note={note} containerRef={containerRef}/> )

            case 'NoteTodos': return ( <NoteTodos note={note}/> )

            case 'NoteVideo': return ( <NoteVideo note={note} containerRef={containerRef}/>)

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