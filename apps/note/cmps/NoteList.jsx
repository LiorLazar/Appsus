import { NoteTxt } from './NoteTxt.jsx'
import { NoteImg } from './NoteImg.jsx'
import { NoteTodos } from './NoteTodos.jsx'
import { NoteVideo } from './NoteVideo.jsx'
import { noteService } from '../services/note.service.js'
import { NoteAnimate } from '../services/NoteAnimate.js'
import { utilService } from '../../../services/util.service.js'
import { ColorPickerModal } from './ColorPickerModal.jsx'
import { NoteFlyModal } from './NoteFlyModal.jsx'

const { useState, useEffect, useRef } = React
const { useSearchParams } = ReactRouterDOM

export function NoteList() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(noteService.getFilterFromSearchParams(searchParams))
    const truthyFilter = utilService.getTruthyValues(filterBy)
    const [notes, setNotes] = useState([])
    const [isColorModalOpen, setIsColorModalOpen] = useState(false)
    const [selectedNote, setSelectedNote] = useState(null)
    const [modalPos, setModalPos] = useState({ top: 0, left: 0 })
    const [pendingColor, setPendingColor] = useState(null)
    const [modalNote, setModalNote] = useState(null)
    const [modalRect, setModalRect] = useState(null)
    const containerRef = useRef(null)

    function loadNotes(filterBy) {
        noteService.query(filterBy)
            .then(notes => {
                setNotes(notes)
            })
            .catch(err => {
                setError('Failed to load notes')
            })
    }

    useEffect(() => {
        setSearchParams(truthyFilter)
        loadNotes(filterBy)
    }, [filterBy])

    useEffect(() => {
        setFilterBy(noteService.getFilterFromSearchParams(searchParams))
    }, [searchParams])

    useEffect(() => {
        // loadNotes(filterBy)

        function handleRefreshNotes() {
            loadNotes(filterBy)
        }

        window.addEventListener('refreshNotes', handleRefreshNotes)
        return () => {
            window.removeEventListener('refreshNotes', handleRefreshNotes)
        }
    }, [])

    useEffect(() => {
        // Only run NoteAnimate when modal is fully closed
        if (modalNote) return;
        if (!containerRef.current) return;

        // Initialize masonry layout
        NoteAnimate.initMasonry(containerRef.current);

        // Setup image load listeners
        const cleanupImages = NoteAnimate.setupImageListeners(containerRef.current);

        // Setup resize listener
        const cleanupResize = NoteAnimate.setupResizeListener(containerRef.current);

        return () => {
            if (cleanupImages) cleanupImages();
            if (cleanupResize) cleanupResize();
        };
    }, [notes, modalNote])

    useEffect(() => {
        function handleOpenColorPickerModal(e) {
            const { note, btnRect } = e.detail;
            let top = btnRect.bottom;
            let left = btnRect.left;
            if (containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                // Move modal down by 200px and right by 75px
                top = btnRect.bottom - containerRect.top + 200;
                left = btnRect.left - containerRect.left + 75;
            }
            setPendingColor(note.style && note.style.backgroundColor ? note.style.backgroundColor : null);
            setModalPos({
                top,
                left
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

    function renderNote(note, onCardClick) {
        // If this is the selected note, show the pending color immediately
        const isSelected = selectedNote && note.id === selectedNote.id;
        const color = isSelected && pendingColor !== null
            ? pendingColor
            : (note.style && note.style.backgroundColor) || null;
        switch (note.type) {
            case 'NoteTxt': return (<NoteTxt note={{ ...note, style: { ...note.style, backgroundColor: color } }} onCardClick={e => onCardClick(note, e)} />)
            case 'NoteImg': return (<NoteImg note={{ ...note, style: { ...note.style, backgroundColor: color } }} containerRef={containerRef} onCardClick={e => onCardClick(note, e)} />)
            case 'NoteTodos': return (<NoteTodos note={{ ...note, style: { ...note.style, backgroundColor: color } }} onHeightChange={handleNoteHeightChange} onCardClick={e => onCardClick(note, e)} />)
            case 'NoteVideo': return (<NoteVideo note={{ ...note, style: { ...note.style, backgroundColor: color } }} containerRef={containerRef} onCardClick={e => onCardClick(note, e)} />)
            default:
                return null;
        }
    }

    function handleNoteHeightChange() {
        if (containerRef.current && typeof NoteAnimate.initMasonry === 'function') {
            NoteAnimate.initMasonry(containerRef.current)
        }
    }

    function refreshAllNotes() {
        noteService.query(filterBy).then(freshNotes => {
            setNotes(freshNotes)
        })
    }

    function handleModalClose(savedNotePromise) {
        Promise.resolve(savedNotePromise).then(() => {
            setTimeout(() => {
                refreshAllNotes()
                setModalNote(null)
                setModalRect(null)
            }, 50)
        })
        Promise.resolve(savedNotePromise).then(() => {
            setTimeout(() => {
                refreshAllNotes()
            }, 500)
        })
        setTimeout(() => {
            refreshAllNotes()
        }, 750)
    }

    return (
        <section className="note-list">
            {notes.length ? (
                <div className="note-container" ref={containerRef}>
                    {notes.map(note => {
                        let noteClass = `note-item ${note.id}`
                        if (modalNote && modalNote.id === note.id) noteClass += ' note-hidden-for-modal'
                        // Create a ref for each note-item
                        const noteItemRef = React.createRef();
                        return (
                            <div
                                key={note.id}
                                className={noteClass}
                                ref={noteItemRef}
                                style={{ cursor: 'pointer' }}
                            >
                                {renderNote(note, (noteArg, e) => {
                                    // Get the bounding rect from the note-item div
                                    const rect = noteItemRef.current.getBoundingClientRect();
                                    setModalRect({
                                        left: rect.left,
                                        top: rect.top,
                                        width: rect.width,
                                        height: rect.height,
                                        noteId: noteArg.id
                                    });
                                    setModalNote(noteArg);
                                })}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <p className="no-notes-message">No notes available</p>
            )}
            {modalNote && modalRect && (
                <NoteFlyModal
                    note={modalNote}
                    rect={modalRect}
                    onClose={() => handleModalClose(Promise.resolve())}
                />
            )}
            {isColorModalOpen && (
                <ColorPickerModal
                    isOpen={isColorModalOpen}
                    onClose={handleCloseModal}
                    onColorSelect={handleColorSelect}
                    selectedColor={pendingColor}
                    modalPos={modalPos}
                />
            )}
        </section>
    )
}
