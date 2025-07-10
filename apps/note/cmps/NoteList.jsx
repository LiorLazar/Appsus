import { NoteTxt } from './NoteTxt.jsx'
import { NoteImg } from './NoteImg.jsx'
import { NoteTodos } from './NoteTodos.jsx'
import { NoteVideo } from './NoteVideo.jsx'
import { noteService } from '../services/note.service.js'
import { notelistService } from '../services/notelist.service.js'
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
    const [error, setError] = useState(null)
    const containerRef = useRef(null)
    const pinnedContainerRef = useRef(null)
    const unpinnedContainerRef = useRef(null)

    useEffect(() => {
        setSearchParams(truthyFilter)
        notelistService.loadNotes(filterBy, setNotes, setError)
    }, [filterBy])

    useEffect(() => {
        setFilterBy(noteService.getFilterFromSearchParams(searchParams))
    }, [searchParams])

    useEffect(() => {
        function handleRefreshNotes() {
            notelistService.loadNotes(filterBy, setNotes, setError)
        }
        window.addEventListener('refreshNotes', handleRefreshNotes)
        return () => {
            window.removeEventListener('refreshNotes', handleRefreshNotes)
        }
    }, [])

    useEffect(() => {
        notelistService.setupMasonryAndListeners(pinnedContainerRef, notes, modalNote)
        notelistService.setupMasonryAndListeners(unpinnedContainerRef, notes, modalNote)
    }, [notes, modalNote])

    useEffect(() => {
        function handleOpenColorPickerModal(e) {
            const { note, btnRect } = e.detail;
            setPendingColor(note.style && note.style.backgroundColor ? note.style.backgroundColor : null);
            setModalPos({
                top: btnRect.top,
                left: btnRect.left
            });
            setSelectedNote(note);
            setIsColorModalOpen(true);
            console.log('ColorPickerModal open position:', btnRect);
        }
        
        window.addEventListener('openColorPickerModal', handleOpenColorPickerModal);
        return () => window.removeEventListener('openColorPickerModal', handleOpenColorPickerModal);
    }, []);

    function handleColorSelect(color) {
        notelistService.handleColorSelect(color, selectedNote, setPendingColor, setSelectedNote, setNotes);
    }

    function handleCloseModal() {
        notelistService.handleCloseColorModal(pendingColor, selectedNote, setIsColorModalOpen, setNotes, setSelectedNote, setPendingColor);
    }

    // Move renderNote back here so it can use React components directly
    function renderNote(note, onCardClick, noteItemRef) {
        const isSelected = selectedNote && note.id === selectedNote.id;
        const color = isSelected && pendingColor !== null
            ? pendingColor
            : (note.style && note.style.backgroundColor) || null;
        switch (note.type) {
            case 'NoteTxt': return (<NoteTxt note={note} onCardClick={e => onCardClick(note, e)} noteItemRef={noteItemRef} />)
            case 'NoteImg': return (<NoteImg note={note} containerRef={containerRef} onCardClick={e => onCardClick(note, e)} noteItemRef={noteItemRef} />)
            case 'NoteTodos': return (<NoteTodos note={note} onHeightChange={() => notelistService.handleNoteHeightChange(containerRef)} onCardClick={e => onCardClick(note, e)} noteItemRef={noteItemRef} />)
            case 'NoteVideo': return (<NoteVideo note={note} containerRef={containerRef} onCardClick={e => onCardClick(note, e)} noteItemRef={noteItemRef} />)
            default:
                return null;
        }
    }

    function renderNoteItem(note) {
        let noteClass = `note-item ${note.id}`
        if (modalNote && modalNote.id === note.id) noteClass += ' note-hidden-for-modal'
        const noteItemRef = React.createRef();
        return (
            <div
                key={note.id}
                className={noteClass}
                ref={noteItemRef}
                style={{ cursor: 'pointer' }}
            >
                {renderNote(note, (noteArg, e) => {
                    const rect = noteItemRef.current.getBoundingClientRect();
                    setModalRect({
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                        noteId: noteArg.id
                    });
                    setModalNote(noteArg);
                }, noteItemRef)}
            </div>
        )
    }

    const pinnedNotes = notelistService.getPinnedNotes(notes)
    const unpinnedNotes = notelistService.getUnpinnedNotes(notes)

    function handleModalClose(savedNotePromise) {
        notelistService.handleModalClose(savedNotePromise, filterBy, setNotes, setModalNote, setModalRect)
    }

    function handleEditorColorBtn(e, note, pos = null) {
        const btnRect = e.currentTarget.getBoundingClientRect();

        if (pos) {
            setModalPos({ top: pos.top, left: pos.left });
        } else {
            // If no position is provided, use the button's position
            setModalPos({ top: btnRect.top, left: btnRect.left });
        }

        setSelectedNote(note);
        setPendingColor(note.style && note.style.backgroundColor ? note.style.backgroundColor : null);
        setIsColorModalOpen(true);
    }

    useEffect(() => {
        // When the selectedNote or pendingColor changes, update the editor if open
        if (modalNote && selectedNote && modalNote.id === selectedNote.id) {
            setModalNote({
                ...selectedNote,
                style: {
                    ...selectedNote.style,
                    backgroundColor: pendingColor != null
                        ? pendingColor
                        : (selectedNote.style && selectedNote.style.backgroundColor)
                }
            });
        }
    }, [pendingColor, selectedNote])

    // Add log before rendering ColorPickerModal

    return (
        <section className="note-list">
            {notes.length ? (
                <div>
                    {pinnedNotes.length > 0 && (
                        <div>
                            <div className="notes-section-title">PINNED</div>
                            <div className="note-container pinned-notes-container" ref={pinnedContainerRef}>
                                {pinnedNotes.map(renderNoteItem)}
                            </div>
                        </div>
                    )}
                    {unpinnedNotes.length > 0 && (
                        <div>
                            <div className="notes-section-title">OTHERS</div>
                            <div className="note-container unpinned-notes-container" ref={unpinnedContainerRef}>
                                {unpinnedNotes.map(renderNoteItem)}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="no-notes-message">No notes available</p>
            )}
            {modalNote && modalRect && (
                <NoteFlyModal
                    note={modalNote}
                    rect={modalRect}
                    onClose={() => handleModalClose(Promise.resolve())}
                    onColorBtnClick={handleEditorColorBtn}
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
