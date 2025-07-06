import { NoteToolBar } from './NoteToolBar.jsx'

export function NoteTxt({ note, className = 'note-card' }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff';
    
    return (
        <div className={`${className} ${note.id}`}  style={{ backgroundColor }}>
            <h2 className="note-title">{note.info.title}</h2>
            <div className={`note-txt`}>
                <p className="note-text">{note.info.txt}</p>
            </div>
            <NoteToolBar note={note} />
        </div>
    )
}