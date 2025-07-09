import { NoteToolBar } from './NoteToolBar.jsx'
import { NoteAnimate } from '../services/NoteAnimate.js'
import { noteService } from '../services/note.service.js';

const { useState, useEffect } = React

export function NoteImg({ note, containerRef, className = 'note-card', onCardClick }) {
    const [title, setTitle] = useState(note.info.title);
    const [txt, setTxt] = useState(note.info.txt);
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff';

    useEffect(() => {
        setTitle(note.info.title)
        setTxt(note.info.txt)
    }, [note.info.title, note.info.txt])

    function handleCardClick(e) {
        if (e.target.closest('button, [role="button"], a, input, textarea, select, label')) return;
        if (onCardClick) onCardClick(note, e);
    }

    return (
        <div className={`${className} ${note.id}`} style={{ backgroundColor }} onClick={handleCardClick}>
            {title && <h2 className="note-title">{title}</h2>}
            <img
                src={note.info.url}
                alt={title || 'Note image'}
                className="note-img"
                onLoad={() => NoteAnimate.handleImageLoad(containerRef && containerRef.current)}
                onError={() => NoteAnimate.handleImageLoad(containerRef && containerRef.current)}
                style={className === 'details' ? { maxHeight: '65%', width: '100%', height: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' } : { width: '100%', height: '100%' }}
            />
            {txt && <p className="note-text">{txt.length > 100 ? txt.slice(0, 100) + '\u2026' : txt}</p>}
            <NoteToolBar note={note} className="tool-bar" />
        </div>
    )
}