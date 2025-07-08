import { NoteEditor } from './NoteEditor.jsx'
import { NoteTxt } from './NoteTxt.jsx'
import { NoteImg } from './NoteImg.jsx'
import { NoteTodos } from './NoteTodos.jsx'
import { NoteVideo } from './NoteVideo.jsx'

const { useEffect, useRef, useState } = React


export function NoteFlyModal({ note, rect, onClose }) {
    const modalRef = useRef(null)
    const [isCentered, setIsCentered] = useState(false)

    // Calculate modal size and position
    const modalWidth = 400
    const modalHeight = 300
    const style = rect
        ? {
            position: 'absolute',
            left: isCentered ? `calc(50% - ${modalWidth / 2}px)` : rect.left,
            top: isCentered ? `calc(50% - ${modalHeight / 2}px)` : rect.top,
            width: isCentered ? modalWidth : rect.width || modalWidth,
            height: isCentered ? modalHeight : rect.height || modalHeight,
            background: '#fff',
            boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
            borderRadius: 12,
            zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            overflow: 'hidden',
        }
        : {};

    useEffect(() => {
        setTimeout(() => setIsCentered(true), 10)
    }, [])

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

    function handleClose() {
        setIsCentered(false)
        // onClose will be called after transition ends
    }

    function renderNote(note) {
        if (!note) return null;
        // Render the NoteEditor for editing instead of a static preview
        return <NoteEditor note={note} onSave={() => {}} />
    }

    return (
        <div ref={modalRef} style={style}>
            <button onClick={handleClose} style={{position:'absolute',top:8,right:8,zIndex:10}}>✕</button>
            <div style={{width: modalWidth, height: modalHeight, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {renderNote(note)}
            </div>
        </div>
    )
}
