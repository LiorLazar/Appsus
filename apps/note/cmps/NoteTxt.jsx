import { NoteToolBar } from './NoteToolBar.jsx'

const { useNavigate } = ReactRouterDOM

export function NoteTxt({ note, className = 'note-card', onCardClick }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff';
    const navigate = useNavigate();

    function handleCardClick(e) {
        if (e.target.closest('button, [role="button"], a, input, textarea, select, label')) return;
        if (onCardClick) onCardClick(note, e);
    }

    return (
        <div className={`${className} ${note.id}`} style={{ backgroundColor }} onClick={handleCardClick}>
            {note.info.title && <h2 className="note-title">{note.info.title}</h2>}
            <div className={`note-txt`}>
                {note.info.txt && <p className="note-text">{note.info.txt.length > 100 ? note.info.txt.slice(0, 100) + '\u2026' : note.info.txt}</p>}
            </div>
            <NoteToolBar note={note} />
        </div>
    )
}