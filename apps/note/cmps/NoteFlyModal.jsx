import { NoteEditor } from './NoteEditor.jsx'

const { useEffect, useState, useRef } = React

export function NoteFlyModal({ note, rect, onClose, onColorBtnClick, pendingColor, selectedNote }) {
    const modalRef = useRef(null)
    const noteRef = useRef(null)
    const noteEditorRef = useRef(null)
    const [isCentered, setIsCentered] = useState(false)
    const [modalSize, setModalSize] = useState({ width: 400, height: 300 })
    const [measured, setMeasured] = useState(false)

    // Measure note size after first render
    useEffect(() => {
        if (!measured && noteRef.current) {
            const noteRect = noteRef.current.getBoundingClientRect()
            setModalSize({
                width: noteRect.width + 250,
                height: noteRect.height + 150
            })
            setMeasured(true)
        }
    }, [measured, note])

    // Center after measurement
    useEffect(() => {
        if (measured) setTimeout(() => setIsCentered(true), 10)
    }, [measured])

    useEffect(() => {
        if (!isCentered && modalRef.current) {
            const handleTransitionEnd = (e) => {
                if (e.target === modalRef.current && (e.propertyName === 'width' || e.propertyName === 'height' || e.propertyName === 'left' || e.propertyName === 'top')) {
                    onClose()
                }
            }
            const ref = modalRef.current
            ref.addEventListener('transitionend', handleTransitionEnd)
            return () => ref.removeEventListener('transitionend', handleTransitionEnd)
        }
    }, [isCentered])

    useEffect(() => {
        // Prevent background scrolling when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Remove background scroll lock immediately on close
    function handleBackdropClick() {
        document.body.style.overflow = '';
        // Make the backdrop transparent immediately
        const backdrop = document.querySelector('.note-flymodal-backdrop');
        if (backdrop) backdrop.style.background = 'transparent';
        setIsCentered(false)
    }

    function handleClose() {
        setIsCentered(false)
        // onClose will be called after transition ends
    }

    function renderNote(note) {
        if (!note) return null;
        // Render the NoteEditor for editing instead of a static preview
        return <div ref={noteRef} style={{ position: measured ? 'static' : 'absolute', visibility: measured ? 'visible' : 'hidden', pointerEvents: 'none', zIndex: -1 }}><NoteEditor note={note} onSave={() => { }} /></div>
    }

    const isSelected = selectedNote && note.id === selectedNote.id;
    const liveBgColor = isSelected && pendingColor != null
        ? pendingColor
        : (selectedNote && selectedNote.style && selectedNote.style.backgroundColor)
            ? selectedNote.style.backgroundColor
            : (note.style && note.style.backgroundColor);

    const style = rect
        ? {
            position: 'absolute',
            left: isCentered ? `calc(50% - ${modalSize.width / 2}px)` : rect.left,
            top: isCentered ? `calc(50% - ${modalSize.height / 2}px)` : rect.top,
            width: isCentered ? modalSize.width : rect.width || modalSize.width,
            height: isCentered ? modalSize.height : rect.height || modalSize.height,
            background: liveBgColor || '#fff', // Use liveBgColor for modal background
            boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
            borderRadius: 12,
            zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            overflow: 'hidden',
        }
        : {};

    return (
        <div className="note-flymodal-backdrop" onClick={handleBackdropClick}>
            <div ref={modalRef} style={style} onClick={e => e.stopPropagation()}>
                {/* Removed the close (✕) button from the modal */}
                {renderNote(note)}
                {measured && (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0 }}>
                        <NoteEditor
                            ref={noteEditorRef}
                            note={{ ...note, style: { ...note.style, backgroundColor: liveBgColor } }}
                            onSave={() => { }}
                            onClose={handleClose} // Use handleClose for animation
                            onColorBtnClick={onColorBtnClick}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
