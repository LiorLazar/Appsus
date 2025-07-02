import { NoteToolBar } from './NoteToolBar.jsx'

export function NoteTxt({ note }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff';
    
    return (
        <div className="note-card" style={{ backgroundColor }}>
            <h2 className="note-title">{note.info.title}</h2>
            <p className="note-text">{note.info.txt}</p>
            <NoteToolBar note={note} />
        </div>
    )
}