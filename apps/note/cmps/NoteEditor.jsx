import { noteService } from '../services/note.service.js'

const { useState, useEffect } = React

export function NoteEditor({ note, onSave, onClose, className = 'note-card modal-note-card' }) {
    const [editNote, setEditNote] = useState({ ...note })

    function handleChange(field, value) {
        setEditNote(prev => ({
            ...prev,
            info: { ...prev.info, [field]: value }
        }))
    }

    function handleTodoChange(idx, value) {
        const newTodos = editNote.info.todos.map((todo, i) => i === idx ? { ...todo, txt: value } : todo)
        setEditNote(prev => ({
            ...prev,
            info: { ...prev.info, todos: newTodos }
        }))
    }

    function handleRemoveMedia() {
        setEditNote(prev => ({
            ...prev,
            info: { ...prev.info, url: undefined }
        }))
    }

    // Auto-save on unmount or when onClose is called
    useEffect(() => {
        return () => {
            noteService.save(editNote).then(saved => {
                if (onSave) onSave(saved)
            })
        }
    }, [editNote])

    return (
        <div className={className + ' note-editor-root'} style={{ backgroundColor: (note && note.style && note.style.backgroundColor) || '#fff' }}>
            <input
                className="note-title"
                type="text"
                value={editNote.info.title || ''}
                onChange={e => handleChange('title', e.target.value)}
                placeholder="add title here..."
                autoFocus={!editNote.info.title}
            />
            {editNote.info.url && (editNote.type === 'NoteImg' || editNote.type === 'NoteVideo') && (
                <div className="note-media-preview">
                    <button
                        type="button"
                        onClick={handleRemoveMedia}
                        className="note-media-remove-btn"
                        aria-label="Remove media"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    {editNote.type === 'NoteImg' && (
                        <img
                            src={editNote.info.url}
                            alt={editNote.info.title || 'Note image'}
                            className="note-img note-media-img"
                        />
                    )}
                    {editNote.type === 'NoteVideo' && (
                        <iframe
                            className="video-player note-media-video"
                            src={getEmbedUrl(editNote.info.url)}
                            title={editNote.info.title || "Video"}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                </div>
            )}
            <textarea
                className="note-text"
                value={editNote.info.txt || ''}
                onChange={e => handleChange('txt', e.target.value)}
                placeholder="add txt note here..."
                rows={2}
            />
            {Array.isArray(editNote.info.todos) && (
                <ul className="note-todos">
                    {editNote.info.todos.map((todo, idx) => (
                        <li key={idx} className="todo-item">
                            <input
                                className="todo-text"
                                type="text"
                                value={todo.txt}
                                onChange={e => handleTodoChange(idx, e.target.value)}
                                placeholder="add todo..."
                            />
                        </li>
                    ))}
                </ul>
            )}
            {editNote.info.url && !['NoteImg', 'NoteVideo'].includes(editNote.type) && (
                <input
                    className="note-url-input"
                    type="text"
                    value={editNote.info.url}
                    onChange={e => handleChange('url', e.target.value)}
                    placeholder="Image/Video URL"
                />
            )}
        </div>
    )
}

// Helper for video embed
function getEmbedUrl(url) {
    if (!url) return ''
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(youtubeRegex)
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`
    }
    if (url.includes('/embed/')) return url
    return url
}
