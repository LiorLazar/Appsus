import { noteService } from '../services/note.service.js'
import { utilService } from '../../../services/util.service.js'

const { useState, useEffect, useImperativeHandle, forwardRef } = React
const debouncedSave = utilService.debounce((note, onSave) => {
    console.log('Saving note:', note);

    noteService.save(note).then(saved => {
        if (onSave) onSave(saved)
    })
}, 400)

export const NoteEditor = forwardRef(function NoteEditor({ note, onSave, onClose, className = 'note-card modal-note-card' }, ref) {
    const [editNote, setEditNote] = useState({ ...note })
    const [newTodoValue, setNewTodoValue] = useState('')


    function handleChange(field, value) {
        setEditNote(prev => {
            const updated = {
                ...prev,
                info: { ...prev.info, [field]: value }
            }
            debouncedSave(updated, onSave)
            return updated
        })
    }

    function handleRemoveMedia() {
        setEditNote(prev => ({
            ...prev,
            info: { ...prev.info, url: undefined }
        }))
    }

    function handleAddTodo(newTodoTxt) {
        console.log('Adding todo:', newTodoTxt);

        if (!newTodoTxt.trim()) return
        setEditNote(prev => {
            const newTodos = Array.isArray(prev.info.todos)
                ? [...prev.info.todos, { txt: newTodoTxt, doneAt: null }]
                : [{ txt: newTodoTxt, doneAt: null }]
            const updated = {
                ...prev,
                info: { ...prev.info, todos: newTodos }
            }
            debouncedSave(updated, onSave)
            return updated
        })
    }

    function handleAddTodoInput(e) {
        if ((e.key === 'Enter' || e.type === 'blur') && newTodoValue.trim()) {
            handleAddTodo(newTodoValue)
            setNewTodoValue('')
        }
    }

    // Add a callback to save and close when requested from parent (e.g., backdrop click)
    useImperativeHandle(ref, () => ({
        saveAndClose: () => {
            console.log('Saving and closing note editor');
            console.log('Note to save:', editNote);
            if (onClose) onClose()
        }
    }))

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
                            <span className="todo-text">{todo.txt}</span>
                        </li>
                    ))}
                    <li className="todo-item add-todo-item">
                        <input
                            className="todo-text add-todo-input"
                            type="text"
                            value={newTodoValue}
                            onChange={e => setNewTodoValue(e.target.value)}
                            onKeyDown={handleAddTodoInput}
                            onBlur={handleAddTodoInput}
                            placeholder="Add new todo and press Enter..."
                        />
                    </li>
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
})

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
