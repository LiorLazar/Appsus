import { NoteToolBar } from './NoteToolBar.jsx'
import { NoteAnimate } from '../services/NoteAnimate.js'
import { noteService } from '../services/note.service.js';

const { useNavigate } = ReactRouterDOM

export function NoteImg({ note, containerRef, className = 'note-card' }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff';
    const navigate = useNavigate();
    const [isEditingTitle, setIsEditingTitle] = React.useState(false);
    const [isEditingText, setIsEditingText] = React.useState(false);
    const [title, setTitle] = React.useState(note.info.title);
    const [txt, setTxt] = React.useState(note.info.txt);
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
            console.log('Note text updated successfully');
        })
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
        
        noteService.save(updatedNote).then(() => {
            console.log('Note text updated successfully');
        })
    }
    function handleCardClick(e) {
        if (
            e.target.closest('button, .note-toolbar, a, select, textarea, input, [tabindex], [role="button"]')
        ) return;
        navigate(`/note/${note.id}`);
    }
    return (
        <div className={`${className} ${note.id}`} style={{ backgroundColor }} onClick={handleCardClick}>
            {(isEditingTitle && className === 'details') || (!title && className === 'details') ? (
                <input
                    className="note-title"
                    value={title}
                    placeholder="add title here..."
                    onChange={handleTitleChange}
                    onFocus={() => setIsEditingTitle(true)}
                    onBlur={handleTitleBlur}
                    autoFocus
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '2.1rem', fontWeight: 500, color: '#202124', width: '100%', padding: 0, marginBottom: 10 }}
                />
            ) : (
                title && <h2 className="note-title" onClick={handleTitleClick} style={className === 'details' ? { cursor: 'text' } : {}}>{title}</h2>
            )}
            <img
                src={note.info.url}
                alt={note.info.title || 'Note image'}
                className="note-img"
                onClick={handleCardClick}
                onLoad={() => NoteAnimate.handleImageLoad(containerRef && containerRef.current)}
                onError={() => NoteAnimate.handleImageLoad(containerRef && containerRef.current)}
                style={className === 'details' ? { maxHeight: '65%', width: '100%', height: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' } : { width: '100%', height: '100%' }}
            />

            {isEditingText && className === 'details' || (!txt && className === 'details') ? (
                <textarea
                    className="note-text"
                    value={txt}
                    placeholder="add txt note here..."
                    onChange={handleTextChange}
                    onFocus={() => setIsEditingText(true)}
                    onBlur={handleTextBlur}
                    autoFocus
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '1.2rem', color: '#333', width: '100%', minHeight: 60, padding: 0, resize: 'none' }}
                />
            ) : (
                txt && <p className="note-text" onClick={handleTextClick} style={className === 'details' ? { cursor: 'text' } : {}}>{txt}</p>
            )}
            <NoteToolBar note={note} className="tool-bar" />
        </div>
    )
}