import { NoteTxt } from './NoteTxt.jsx'
import { NoteImg } from './NoteImg.jsx'
import { NoteTodos } from './NoteTodos.jsx'
import { NoteVideo } from './NoteVideo.jsx'
import { noteService } from '../services/note.service.js'
import { NoteAnimate } from '../services/NoteAnimate.js'
import { ColorPickerModal } from './ColorPickerModal.jsx'

const { useState, useEffect, useRef } = React

export function NoteList() {
    const [notes, setNotes] = useState([])
    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [modalPos, setModalPos] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const containerRef = useRef(null)

    function loadNotes() {
        noteService.query()
            .then(notes => {
                setNotes(notes)
                console.log('Notes loaded:', notes)
            })
            .catch(err => {
                console.error('Failed to load notes', err)
                setError('Failed to load notes')
            })
    }

    useEffect(() => {
        loadNotes()

        function handleRefreshNotes() {
            loadNotes()
        }

        window.addEventListener('refreshNotes', handleRefreshNotes)
        return () => {
            window.removeEventListener('refreshNotes', handleRefreshNotes)
        }
    }, [])

    useEffect(() => {
        if (!containerRef.current) return

        // Initialize masonry layout
        NoteAnimate.initMasonry(containerRef.current)

        // Setup image load listeners
        const cleanupImages = NoteAnimate.setupImageListeners(containerRef.current)

        // Setup resize listener
        const cleanupResize = NoteAnimate.setupResizeListener(containerRef.current)

        return () => {
            if (cleanupImages) cleanupImages()
            if (cleanupResize) cleanupResize()
        }
    }, [notes])

    function renderNote(note) {
        switch (note.type) {
            case 'NoteTxt': return (<NoteTxt note={note} />)
            case 'NoteImg': return (<NoteImg note={note} containerRef={containerRef} />)
            case 'NoteTodos': return (<NoteTodos note={note} onHeightChange={handleNoteHeightChange} />)
            case 'NoteVideo': return (<NoteVideo note={note} containerRef={containerRef} />)
            default:
                return null
        }
    }

    function handleNoteHeightChange() {
        if (containerRef.current && typeof NoteAnimate.initMasonry === 'function') {
            NoteAnimate.initMasonry(containerRef.current)
        }
    }

    function handleNoteClick(e, note) {
        // Get the bounding rect of the clicked note
        const rect = e.currentTarget.getBoundingClientRect();
        setModalPos({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
        });
        setSelectedNote(note);
        setIsColorModalOpen(true);
    }

    return (
        <section className="note-list">
            <ColorPickerModal
                isOpen={isColorModalOpen}
                onClose={() => setIsColorModalOpen(false)}
                onColorSelect={() => setIsColorModalOpen(false)}
                selectedColor={null}
                modalPos={modalPos}
            />
            {notes.length ? (
                <div className="note-container" ref={containerRef}>
                    {notes.map(note => (
                        <div key={note.id} className="note-item" onClick={e => handleNoteClick(e, note)}>
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