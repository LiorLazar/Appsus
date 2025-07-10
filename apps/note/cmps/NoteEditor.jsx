import { noteService } from '../services/note.service.js'
import { NoteEditorToolBar } from './NoteEditorToolBar.jsx'
import { editorService } from '../services/editor.service.js';

const { useState, useImperativeHandle, forwardRef } = React;

export const NoteEditor = forwardRef(function NoteEditor({ note, onSave, onClose, className = 'note-card modal-note-card', onColorBtnClick }, ref) {
    const [editNote, setEditNote] = useState({ ...note })
    const [newTodoValue, setNewTodoValue] = useState('')
    const fileInputRef = React.useRef(null);

    const handleChange = editorService.handleChange(setEditNote, editorService.debouncedSave, onSave);
    const handleRemoveMedia = editorService.handleRemoveMedia(setEditNote, editNote, editorService.debouncedSave, onSave);
    const handleAddTodo = editorService.handleAddTodo(setEditNote, editorService.debouncedSave, onSave);
    const handleEditTodo = editorService.handleEditTodo(setEditNote, editorService.debouncedSave, onSave);
    const handleImgBtnClick = editorService.handleImgBtnClick(fileInputRef, editNote);
    const handleFileChange = editorService.handleFileChange(setEditNote, editorService.debouncedSave, onSave);

    // useImperativeHandle(ref, () => ({
    //     saveAndClose: () => {
    //         console.log('Saving and closing note editor');
    //         console.log('Note to save:', editNote);
    //         if (onClose) onClose()
    //     }
    // }))

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
                        <span className="material-symbols-outlined">delete</span>
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
                        <li key={todo.id || idx} className="todo-item">
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
                onSave={() => editorService.debouncedSave(editNote, onSave)}
                onClose={onClose}
                onColor={e => onColorBtnClick(e, editNote)}
                onImg={handleImgBtnClick}
                onDuplicate={handleDuplicate}
            />
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
            />
        </div>
    )

    function handleAddTodoInput(e) {
        if ((e.key === 'Enter' || e.type === 'blur') && newTodoValue.trim()) {
            handleAddTodo(newTodoValue)
            setNewTodoValue('')
        }
    }

    function handleDuplicate() {
        const { id, createdAt, ...rest } = editNote;
        const newNote = {
            ...rest,
            info: JSON.parse(JSON.stringify(editNote.info)),
            style: { ...editNote.style },
            id: undefined,
            createdAt: Date.now()
        };
        if (newNote.type === 'NoteTodos' && Array.isArray(newNote.info.todos)) {
            newNote.info.todos = newNote.info.todos.map(todo => ({ ...todo, id: (Date.now() + Math.random()).toString(36) }));
            newNote.type = 'NoteTodos';
            noteService.save(newNote);
        } else {
            noteService.save(newNote);
        }
    }
})
