import { NoteToolBar } from './NoteToolBar.jsx'
import { NoteAnimate } from '../services/NoteAnimate.js'
import { noteService } from '../services/note.service.js';
const { useNavigate } = ReactRouterDOM

export function NoteVideo({ note, containerRef, className = 'note-card', onUpdate }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff';
    const navigate = useNavigate();
    const [isEditingTitle, setIsEditingTitle] = React.useState(false);
    const [isEditingText, setIsEditingText] = React.useState(false);
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

    function handleTitleClick() {
        if (className === 'details') setIsEditingTitle(true);
    }
    function handleTitleChange(e) {
        setTitle(e.target.value);
    }
    function handleTitleBlur() {
        setIsEditingTitle(false);
            const updatedNote = { ...note, info: { ...note.info, title } };
            noteService.save(updatedNote).then(() => {
                console.log('Note updated successfully');
            });
            
    }
    function handleTextClick() {
        if (className === 'details') setIsEditingText(true);
    }
    function handleTextChange(e) {
        setTxt(e.target.value);
    }
    function handleTextBlur() {
        setIsEditingText(false);
            const updatedNote = { ...note, info: { ...note.info, txt } };
            noteService.save(updatedNote);
    }
    function handleCardClick(e) {
        if (
            e.target.closest('button, .note-toolbar, iframe, a, select, textarea, input, [tabindex], [role="button"]')
        ) return;
        navigate(`/note/${note.id}`);
    }

    return (
        <div className={`${className} ${note.id} note-video ${className}`} style={{ backgroundColor }} onClick={handleCardClick}>
            {isEditingTitle && className === 'details' ? (
                <input
                    className="note-title"
                    value={title}
                    placeholder="add title here..."
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    autoFocus
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '2.1rem', fontWeight: 500, color: '#202124', width: '100%', padding: 0, marginBottom: 10 }}
                />
            ) : (
                title && <h2 className="note-title" onClick={handleTitleClick} style={className === 'details' ? { cursor: 'text' } : {}}>{title}</h2>
            )}
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
            {isEditingText && className === 'details' || (!txt && className === 'details') ? (
                <textarea
                    className="note-content"
                    value={txt}
                    placeholder="add txt note here..."
                    onChange={handleTextChange}
                    onBlur={handleTextBlur}
                    autoFocus
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '1.2rem', color: '#333', width: '100%', minHeight: 60, padding: 0, resize: 'none' }}
                />
            ) : (
                txt && <p className="note-content" onClick={handleTextClick} style={className === 'details' ? { cursor: 'text' } : {}}>{txt}</p>
            )}
            <NoteToolBar note={note} />
        </div>
    )
}