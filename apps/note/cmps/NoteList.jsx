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
    const [isColorModalOpen, setIsColorModalOpen] = useState(false)
    const [selectedNote, setSelectedNote] = useState(null)
    const [modalPos, setModalPos] = useState({ top: 0, left: 0 })
    // Store the color selection in state, but only save when modal closes
    const [pendingColor, setPendingColor] = useState(null)
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

    useEffect(() => {
        function handleOpenColorPickerModal(e) {
            const { note, btnRect } = e.detail;
            setModalPos({
                top: btnRect.bottom + window.scrollY + 6, // 6px below the button
                left: btnRect.left + window.scrollX
            });
            setSelectedNote(note);
            setIsColorModalOpen(true);
        }
        window.addEventListener('openColorPickerModal', handleOpenColorPickerModal);
        return () => window.removeEventListener('openColorPickerModal', handleOpenColorPickerModal);
    }, []);

    function handleColorSelect(color) {
        setPendingColor(color);
        // Update the selectedNote's color for immediate UI feedback
        setSelectedNote(selectedNote ? { ...selectedNote, style: { ...selectedNote.style, backgroundColor: color } } : null);
    }

    function handleCloseModal() {
        setIsColorModalOpen(false);
        // Save the color only when modal closes
        if (pendingColor !== null && selectedNote) {
            const updatedNote = { ...selectedNote, style: { ...selectedNote.style, backgroundColor: pendingColor } };
            noteService.save(updatedNote).then(() => {
                setNotes(notes => notes.map(n => n.id === updatedNote.id ? updatedNote : n));
                setSelectedNote(updatedNote);
            });
            setPendingColor(null);
        }
    }

    function renderNote(note) {
        // If this is the selected note, show the pending color immediately
        const isSelected = selectedNote && note.id === selectedNote.id;
        const color = isSelected && pendingColor !== null
            ? pendingColor
            : (note.style && note.style.backgroundColor) || null;
        switch (note.type) {
            case 'NoteTxt': return (<NoteTxt note={{ ...note, style: { ...note.style, backgroundColor: color } }} />)
            case 'NoteImg': return (<NoteImg note={{ ...note, style: { ...note.style, backgroundColor: color } }} containerRef={containerRef} />)
            case 'NoteTodos': return (<NoteTodos note={{ ...note, style: { ...note.style, backgroundColor: color } }} onHeightChange={handleNoteHeightChange} />)
            case 'NoteVideo': return (<NoteVideo note={{ ...note, style: { ...note.style, backgroundColor: color } }} containerRef={containerRef} />)
            default:
                return null;
        }
    }

    function handleNoteHeightChange() {
        if (containerRef.current && typeof NoteAnimate.initMasonry === 'function') {
            NoteAnimate.initMasonry(containerRef.current)
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
            {isColorModalOpen && (
                <ColorPickerModal
                    isOpen={isColorModalOpen}
                    onClose={handleCloseModal}
                    onColorSelect={handleColorSelect}
                    selectedColor={
                        (pendingColor !== null)
                            ? pendingColor
                            : (selectedNote && selectedNote.style && selectedNote.style.backgroundColor) || null
                    }
                    modalPos={modalPos}
                    note={selectedNote}
                />
            )}
        </section>
    )
}