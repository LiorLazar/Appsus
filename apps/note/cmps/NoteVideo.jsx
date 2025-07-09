import { NoteToolBar } from './NoteToolBar.jsx'
import { NoteAnimate } from '../services/NoteAnimate.js'
import { noteService } from '../services/note.service.js';
const { useNavigate } = ReactRouterDOM

export function NoteVideo({ note, containerRef, className = 'note-card', onUpdate, onCardClick }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff';
    const navigate = useNavigate();
    const [title, setTitle] = React.useState(note.info.title);
    const [txt, setTxt] = React.useState(note.info.txt);

    // Convert YouTube URL to embed format
    const getEmbedUrl = (url) => {
        if (!url) return ''
        
        // Handle different YouTube URL formats
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
        const match = url.match(youtubeRegex)
        
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`
        }
        
        // If already an embed URL, return as is
        if (url.includes('/embed/')) {
            return url
        }
        
        // Return original URL if not YouTube
        return url
    }

    function handleCardClick(e) {
        if (e.target.closest('button, [role="button"], a, input, textarea, select, label')) return;
        if (onCardClick) onCardClick(note, e);
    }

    // Refresh title and txt if note changes
    React.useEffect(() => {
        setTitle(note.info.title)
        setTxt(note.info.txt)
    }, [note.info.title, note.info.txt])

    return (
        <div className={`${className} ${note.id} note-video ${className}`} style={{ backgroundColor }} onClick={handleCardClick}>
            {title && <h2 className="note-title">{title}</h2>}
            <iframe
                className="video-player"
                width={className === 'details' ? '100%' : 200}
                height={className === 'details' ? 360 : 120}
                style={className === 'details' ? { maxWidth: '100%', maxHeight: '50vh', aspectRatio: '16/9', display: 'block', margin: '0 auto' } : {}}
                src={getEmbedUrl(note.info.url)}
                title={note.info.title || "Video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => NoteAnimate.handleImageLoad(containerRef && containerRef.current)}
                onError={() => NoteAnimate.handleImageLoad(containerRef && containerRef.current)}
            />
            {txt && <p className="note-content">{txt.length > 100 ? txt.slice(0, 100) + '\u2026' : txt}</p>}
            <NoteToolBar note={note} />
        </div>
    )
}