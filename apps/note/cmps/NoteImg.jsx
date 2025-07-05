import { NoteToolBar } from './NoteToolBar.jsx'
import { NoteAnimate } from '../services/NoteAnimate.js'

export function NoteImg({ note, containerRef }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff';

    return (
        <div className={`note-card ${note.id}`} style={{ backgroundColor }}>
            <img 
                src={note.info.url} 
                alt={note.info.title} 
                className="note-img"
                onLoad={() => NoteAnimate.handleImageLoad(containerRef.current)}
                onError={() => NoteAnimate.handleImageLoad(containerRef.current)}
            />
            <h2 className="note-title">{note.info.title}</h2>
            <p className="note-text">{note.info.txt}</p>
            <NoteToolBar note={note} className="tool-bar"/>
        </div>
    )
}