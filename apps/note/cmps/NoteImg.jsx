import { NoteToolBar } from './NoteToolBar.jsx'
import { NoteAnimate } from '../services/NoteAnimate.js'
import { noteService } from '../services/note.service.js'

export function NoteImg({ note, containerRef, noteItemRef, className = 'note-card', onCardClick }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : noteService.getDefaultNoteBgColor();

    function handleCardClick(e) {
        if (e.target.closest('button, [role="button"], a, input, textarea, select, label')) return;
        if (onCardClick) onCardClick(note, e);
    }

    return (
        <div className={`${className} ${note.id}`} style={{ backgroundColor, border: noteService.getDefaultBorderColor(backgroundColor), borderRadius: 12 }} onClick={handleCardClick}>
            {note.info.title && <h2 className="note-title">{note.info.title}</h2>}
            <img
                src={note.info.url}
                alt={note.info.title || 'Note image'}
                className="note-img"
                onLoad={() => NoteAnimate.handleImageLoad(containerRef && containerRef.current)}
                onError={() => NoteAnimate.handleImageLoad(containerRef && containerRef.current)}
                style={className === 'details' ? { maxHeight: '65%', width: '100%', height: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' } : { width: '100%', height: '100%' }}
            />
            {note.info.txt && <p className="note-text">{note.info.txt.length > 100 ? note.info.txt.slice(0, 100) + '\u2026' : note.info.txt}</p>}
            <NoteToolBar note={note} noteItemRef={noteItemRef} className="tool-bar" />
        </div>
    )
}