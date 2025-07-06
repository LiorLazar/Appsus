import { NoteToolBar } from './NoteToolBar.jsx'
import { NoteAnimate } from '../services/NoteAnimate.js'

export function NoteImg({ note, containerRef, className = '' }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff';

    return (
        <div className={`note-card ${note.id}`} style={{ backgroundColor }}>
            <div className={`note-img ${className}`}>
                <img 
                    src={note.info.url} 
                    alt={note.info.title || 'Note image'} 
                    className="note-img"
                    onLoad={() => NoteAnimate.handleImageLoad(containerRef.current)}
                    onError={() => NoteAnimate.handleImageLoad(containerRef.current)}
                />
                {note.info.title && <p>{note.info.title}</p>}
            </div>
            <p className="note-text">{note.info.txt}</p>
            <NoteToolBar note={note} className="tool-bar"/>
        </div>
    )
}