import { NoteToolBar } from './NoteToolBar.jsx';
import { noteService } from '../services/note.service.js';

export function NoteTxt({ note, className = 'note-card', onCardClick, noteItemRef }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : noteService.getDefaultNoteBgColor();

    function handleCardClick(e) {
        if (e.target.closest('button, [role="button"], a, input, textarea, select, label')) return;
        if (onCardClick) onCardClick(note, e);
    }

    return (
        <div className={`${className} ${note.id}`} style={{ backgroundColor, border: (backgroundColor === 'transparent' || !backgroundColor) ? noteService.getDefaultBorderColor() : undefined, borderRadius: 12 }} onClick={handleCardClick}>
            {note.info.title && <h2 className="note-title">{note.info.title}</h2>}
            <div className={`note-txt`}>
                {note.info.txt && <p className="note-text">{note.info.txt.length > 100 ? note.info.txt.slice(0, 100) + '\u2026' : note.info.txt}</p>}
            </div>
            <NoteToolBar note={note} noteItemRef={noteItemRef} />
        </div>
    )
}