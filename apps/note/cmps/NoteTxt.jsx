import { NoteToolBar } from './NoteToolBar.jsx'
import { noteService } from '../services/note.service.js';
const { useNavigate } = ReactRouterDOM

export function NoteTxt({ note, className = 'note-card', onCardClick }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff';
    const navigate = useNavigate();
    const [title, setTitle] = React.useState(note.info.title);
    const [txt, setTxt] = React.useState(note.info.txt);

    function handleCardClick(e) {
        if (e.target.closest('button, [role="button"], a, input, textarea, select, label')) return;
        if (onCardClick) onCardClick(note, e);
    }

    return (
        <div className={`${className} ${note.id}`} style={{ backgroundColor }} onClick={handleCardClick}>
            {title && <h2 className="note-title">{title}</h2>}
            <div className={`note-txt`}>
                {txt && <p className="note-text">{txt.length > 100 ? txt.slice(0, 100) + '\u2026' : txt}</p>}
            </div>
            <NoteToolBar note={note} />
        </div>
    )
}