import { NoteToolBar } from './NoteToolBar.jsx'
import { NoteAnimate } from '../services/NoteAnimate.js'

export function NoteVideo({ note, containerRef, className = '' }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff';
    
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

    return (
        <div className={`note-card ${note.id} note-video ${className}`} style={{ backgroundColor }}>
            <h2 className="note-title">{note.info.title}</h2>
            <iframe
                className="video-player" 
                width="200" 
                height="120" 
                src={getEmbedUrl(note.info.url)}
                title={note.info.title || "Video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => NoteAnimate.handleImageLoad(containerRef.current)}
                onError={() => NoteAnimate.handleImageLoad(containerRef.current)}
            />
            <p className="note-content">{note.info.txt}</p>
            <NoteToolBar note={note} />
        </div>
    )
}