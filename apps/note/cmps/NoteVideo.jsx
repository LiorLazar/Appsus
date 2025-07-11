import { NoteToolBar } from './NoteToolBar.jsx'
import { NoteAnimate } from '../services/NoteAnimate.js'
import { noteService } from '../services/note.service.js';

export function NoteVideo({ note, containerRef, className = 'note-card', onUpdate, onCardClick, noteItemRef }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : noteService.getDefaultNoteBgColor();
    const [title, setTitle] = React.useState(note.info.title);
    const [txt, setTxt] = React.useState(note.info.txt);

    function handleCardClick(e) {
        if (e.target.closest('button, [role="button"], a, input, textarea, select, label')) return;
        if (onCardClick) onCardClick(note, e);
    }

    return (
        <div className={`${className} ${note.id} note-video ${className}`} style={{ backgroundColor, border: (backgroundColor === 'transparent' || !backgroundColor) ? noteService.getDefaultBorderColor() : undefined, borderRadius: 12 }} onClick={handleCardClick}>
            {title && <h2 className="note-title">{title}</h2>}
            <iframe
                className="video-player"
                width={className === 'details' ? '100%' : 200}
                height={className === 'details' ? 360 : 120}
                style={className === 'details' ? { maxWidth: '100%', maxHeight: '50vh', aspectRatio: '16/9', display: 'block', margin: '0 auto' } : {}}
                src={noteService.getEmbedUrl(note.info.url)}
                title={note.info.title || "Video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => NoteAnimate.handleImageLoad(containerRef && containerRef.current)}
                onError={() => NoteAnimate.handleImageLoad(containerRef && containerRef.current)}
            />
            {txt && <p className="note-content">{txt.length > 100 ? txt.slice(0, 100) + '\u2026' : txt}</p>}
            <NoteToolBar note={note} noteItemRef={noteItemRef} />
        </div>
    )
}