import { noteService } from '../services/note.service.js'
import { NoteTxt } from '../cmps/NoteTxt.jsx'
import { NoteImg } from '../cmps/NoteImg.jsx'
import { NoteTodos } from '../cmps/NoteTodos.jsx'
import { NoteVideo } from '../cmps/NoteVideo.jsx'
import { ColorPickerModal } from '../cmps/ColorPickerModal.jsx'
import { NoteEditor } from '../cmps/NoteEditor.jsx'

export function NoteDetails() {
    const { noteId } = ReactRouterDOM.useParams()
    const [note, setNote] = React.useState(null)
    const [error, setError] = React.useState(null)
    const [isColorModalOpen, setIsColorModalOpen] = React.useState(false)
    const [modalPos, setModalPos] = React.useState({ top: 0, left: 0 })
    const [pendingColor, setPendingColor] = React.useState(null)

    React.useEffect(() => {
        noteService.get(noteId)
            .then(note => setNote(note))
            .catch(err => {
                console.error('Failed to load note', err)
                setError('Failed to load note')
            })
    }, [noteId])

    React.useEffect(() => {
        function handleOpenColorPickerModal(e) {
            const { btnRect } = e.detail;
            const section = document.querySelector('.note-details');
            let top, left;
            if (section) {
                const sectionRect = section.getBoundingClientRect();
                top = btnRect.bottom - sectionRect.top + 6;
                // Center modal horizontally to the button
                left = btnRect.left - sectionRect.left + btnRect.width / 2;
            } else {
                top = btnRect.bottom + 6;
                left = btnRect.left + btnRect.width / 2;
            }
            setTimeout(() => {
                const modal = document.querySelector('.color-picker-modal');
                if (modal && section) {
                    const modalRect = modal.getBoundingClientRect();
                    const sectionRect = section.getBoundingClientRect();
                    // Center modal horizontally to the button
                    left = left - modalRect.width / 2;
                    // Adjust left if overflowing right
                    if (left + modalRect.width > sectionRect.width) {
                        left = Math.max(0, sectionRect.width - modalRect.width - 8);
                    }
                    // Adjust left if overflowing left
                    if (left < 0) {
                        left = 8;
                    }
                    // Adjust top if overflowing bottom
                    if (top + modalRect.height > sectionRect.height) {
                        top = Math.max(0, sectionRect.height - modalRect.height - 8);
                    }
                    setModalPos({ top, left });
                } else {
                    setModalPos({ top, left });
                }
            }, 0);
            setIsColorModalOpen(true);
        }
        window.addEventListener('openColorPickerModal', handleOpenColorPickerModal);
        return () => window.removeEventListener('openColorPickerModal', handleOpenColorPickerModal);
    }, [])

    function handleColorSelect(color) {
        setPendingColor(color)
        const updatedNote = note ? { ...note, style: { ...note.style, backgroundColor: color } } : null
        setNote(updatedNote)
        if (updatedNote) noteService.save(updatedNote)
    }

    function handleCloseModal() {
        setIsColorModalOpen(false)
        if (pendingColor !== null && note) {
            const updatedNote = { ...note, style: { ...note.style, backgroundColor: pendingColor } }
            noteService.save(updatedNote).then(() => setNote(updatedNote))
            setPendingColor(null)
        }
    }

    function renderNote(note) {
        if (!note) return null;
        const color = pendingColor !== null
            ? pendingColor
            : (note.style && note.style.backgroundColor) || null;
        switch (note.type) {
            case 'NoteTxt': return (<NoteTxt note={{ ...note, style: { ...note.style, backgroundColor: color } }} className="details" />)
            case 'NoteImg': return (<NoteImg note={{ ...note, style: { ...note.style, backgroundColor: color } }} className="details" />)
            case 'NoteTodos': return (<NoteTodos note={{ ...note, style: { ...note.style, backgroundColor: color } }} className="details" />)
            case 'NoteVideo': return (<NoteVideo note={{ ...note, style: { ...note.style, backgroundColor: color } }} className="details" />)
            default:
                return null;
        }
    }

    if (error) return <div className="error">{error}</div>
    if (!note) return <div>Loading...</div>

    return (
        <section className="note-details">
            <NoteEditor note={note} onSave={setNote} />
        </section>
    )
}