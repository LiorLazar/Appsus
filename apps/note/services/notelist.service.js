import { noteService } from './note.service.js'
import { NoteAnimate } from './NoteAnimate.js'

function handleColorSelect(color, selectedNote, setPendingColor, setSelectedNote, setNotes) {
    setPendingColor(color);
    if (selectedNote) {
        const updatedNote = { ...selectedNote, style: { ...selectedNote.style, backgroundColor: color } };
        setSelectedNote(updatedNote);
        // Optimistically update the notes array immediately
        setNotes(notes => notes.map(n => n.id === updatedNote.id ? updatedNote : n));
        // Save in the background
        noteService.save(updatedNote);
    }
}

function handleCloseColorModal(pendingColor, selectedNote, setIsColorModalOpen, setNotes, setSelectedNote, setPendingColor) {
    setIsColorModalOpen(false);
    if (pendingColor !== null && selectedNote) {
        const updatedNote = { ...selectedNote, style: { ...selectedNote.style, backgroundColor: pendingColor } };
        noteService.save(updatedNote).then(() => {
            setNotes(notes => notes.map(n => n.id === updatedNote.id ? updatedNote : n));
            setSelectedNote(updatedNote);
        });
        setPendingColor(null);
    }
}

export const notelistService = {
    loadNotes(filterBy, setNotes, setError) {
        noteService.query(filterBy)
            .then(notes => setNotes(notes))
            .catch(err => setError && setError('Failed to load notes'))
    },
    refreshAllNotes(filterBy, setNotes) {
        noteService.query(filterBy).then(freshNotes => setNotes(freshNotes))
    },
    handleModalClose(savedNotePromise, filterBy, setNotes, setModalNote, setModalRect) {
        Promise.resolve(savedNotePromise).then(() => {
            setTimeout(() => {
                notelistService.refreshAllNotes(filterBy, setNotes)
                setModalNote && setModalNote(null)
                setModalRect && setModalRect(null)
            }, 50)
        })
        Promise.resolve(savedNotePromise).then(() => {
            setTimeout(() => {
                notelistService.refreshAllNotes(filterBy, setNotes)
            }, 500)
        })
        setTimeout(() => {
            notelistService.refreshAllNotes(filterBy, setNotes)
        }, 750)
    },
    getPinnedNotes(notes) {
        return notes.filter(note => note.isPinned)
    },
    getUnpinnedNotes(notes) {
        return notes.filter(note => !note.isPinned)
    },
    setupMasonryAndListeners(containerRef, notes, modalNote) {
        if (modalNote) return;
        if (containerRef && containerRef.current) {
            NoteAnimate.initMasonry(containerRef.current);
            NoteAnimate.setupImageListeners(containerRef.current);
            NoteAnimate.setupResizeListener(containerRef.current);
        }
    },
    handleNoteHeightChange(containerRef) {
        if (containerRef && containerRef.current && typeof NoteAnimate.initMasonry === 'function') {
            NoteAnimate.initMasonry(containerRef.current)
        }
    },
    handleColorSelect,
    handleCloseColorModal,
}
