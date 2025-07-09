import { noteService } from '../services/note.service.js'
import { utilService } from '../../../services/util.service.js'
import { NoteEditorToolBar } from './NoteEditorToolBar.jsx'

const { useState, useImperativeHandle, forwardRef } = React
const debouncedSave = utilService.debounce((note, onSave) => {
    note.createdAt = Date.now()

    noteService.save(note).then(saved => {
        if (onSave) onSave(saved)
    })
}, 400)

export const NoteEditor = forwardRef(function NoteEditor({ note, onSave, onClose, className = 'note-card modal-note-card', onColorBtnClick }, ref) {
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
            type: 'NoteTxt',
            info: { ...prev.info, url: undefined }
        }))
        debouncedSave({ ...editNote, type: 'NoteTxt', info: { ...editNote.info, url: undefined } }, onSave)
    }

    function handleAddTodo(newTodoTxt) {
        if (!newTodoTxt.trim()) return

        setEditNote(prev => {
            const newTodos = Array.isArray(prev.info.todos)
                ? [...prev.info.todos, { txt: newTodoTxt, doneAt: null, id: (Date.now() + Math.random()).toString(36) }]
                : [{ txt: newTodoTxt, doneAt: null, id: (Date.now() + Math.random()).toString(36) }]
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

    function handleEditTodo(idx, value) {
        setEditNote(prev => {
            const newTodos = prev.info.todos.map((todo, i) =>
                i === idx ? { ...todo, txt: value } : todo
            )
            const updated = {
                ...prev,
                info: { ...prev.info, todos: newTodos }
            }
            debouncedSave(updated, onSave)
            return updated
        })
    }

    useImperativeHandle(ref, () => ({
        saveAndClose: () => {
            console.log('Saving and closing note editor');
            console.log('Note to save:', editNote);
            if (onClose) onClose()
        }
    }))

    // Only show add-todo input and hide txt textarea if editing a todos note
    const isTodosNote = Array.isArray(editNote.info.todos)

    // Always use the note prop's style.backgroundColor for live updates
    return (
        <div
            className={className + ' note-editor-root'}
            style={{ backgroundColor: note && note.style && note.style.backgroundColor ? note.style.backgroundColor : '#fff' }}
        >
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
                        onClick={handleRemoveMedia}
                        className="note-media-remove-btn"
                        aria-label="Remove media"
                    >
                        <span class="material-symbols-outlined">delete</span>
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
                            src={noteService.getEmbedUrl(editNote.info.url)}
                            title={editNote.info.title || "Video"}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                </div>
            )}
            {!isTodosNote && (
                <textarea
                    className="note-text"
                    value={editNote.info.txt || ''}
                    onChange={e => handleChange('txt', e.target.value)}
                    placeholder="add txt note here..."
                    rows={2}
                />
            )}
            {isTodosNote && (
                <ul className="note-todos">
                    {editNote.info.todos.map((todo, idx) => (
                        <li key={idx} className="todo-item">
                            <input
                                className="todo-text"
                                type="text"
                                value={todo.txt}
                                onChange={e => handleEditTodo(idx, e.target.value)}
                            />
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
            {editNote.createdAt && (
                <p className="note-edited-at">
                    Edited at {noteService.formatDateTime(editNote.createdAt)}
                </p>
            )}
            <NoteEditorToolBar
                note={editNote}
                onSave={() => debouncedSave(editNote, onSave)}
                onClose={onClose}
                onColor={e => onColorBtnClick(e, editNote)}
            />
        </div>
    )
})
