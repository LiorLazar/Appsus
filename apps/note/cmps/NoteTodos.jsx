import { NoteToolBar } from './NoteToolBar.jsx'
import { noteService } from '../services/note.service.js'

const { useNavigate } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function NoteTodos({ note, onHeightChange, className = 'note-card', onUpdate }) {
    const [todos, setTodos] = useState(note.info.todos)
    const [showCompleted, setShowCompleted] = useState(false)
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [isEditingTodo, setIsEditingTodo] = useState(null)
    const [title, setTitle] = useState(note.info.title)
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff'
    const cardRef = useRef(null)
    const navigate = useNavigate();

    function toggleTodo(idx) {
        const newTodos = todos.map((todo, i) => i === idx ? { ...todo, doneAt: todo.doneAt ? null : Date.now() } : todo)
        setTodos(newTodos)
        if (onHeightChange) onHeightChange()

        // Update the note in the service
        noteService.save({ ...note, info: { ...note.info, todos: newTodos } })
            .then(() => {
                console.log('Note updated successfully')

            })
    }

    const activeTodos = todos.filter(todo => !todo.doneAt)
    const completedTodos = todos.filter(todo => todo.doneAt)

    function handleCompletedSectionClick() {
        setShowCompleted(s => {
            const next = !s
            if (onHeightChange) onHeightChange()
            return next
        })
    }

    function handleCardClick(e) {
        // Prevent navigation if clicking on interactive elements, todo list, completed section, or checkbox
        if (
            e.target.closest('button, .note-toolbar, input[type="checkbox"], a, select, textarea, [tabindex], [role="button"], .completed-section, .note-todos, .custom-checkbox-label')
        ) return;
        navigate(`/note/${note.id}`);
    }

    function handleTitleClick(e) {
        if (className === 'details') setIsEditingTitle(true)
    }
    function handleTitleChange(e) {
        setTitle(e.target.value)
    }
    function handleTitleBlur() {
        console.log('Title blur event triggered');

        setIsEditingTitle(false)
        // Only update if not empty and changed

        console.log('Updating note title:', title);

        const updatedNote = { ...note, info: { ...note.info, title } }
        noteService.save(updatedNote).then(() => {
            console.log('Note title updated successfully')
        }
        ).catch(err => {
            console.error('Error updating note title:', err)
        })

    }
    function handleTodoClick(idx) {
        if (className === 'details') setIsEditingTodo(idx)
    }
    function handleTodoChange(e, idx) {
        const newTodos = todos.map((todo, i) => i === idx ? { ...todo, txt: e.target.value } : todo)
        setTodos(newTodos)
    }
    function handleTodoBlur(idx) {
        setIsEditingTodo(null)
        const updatedNote = { ...note, info: { ...note.info, todos } }
        noteService.save(updatedNote)
    }

    useEffect(() => {
        // Wait for DOM update before triggering masonry
        setTimeout(() => {
            const container = document.querySelector('.note-container')
            if (window.NoteAnimate && typeof window.NoteAnimate.initMasonry === 'function' && container) {
                window.NoteAnimate.initMasonry(container)
            }
        }, 50)
    }, [showCompleted])

    return (
        <div
            ref={cardRef}
            className={`${className} ${note.id} ${className} ${showCompleted ? 'expanded-completed' : ''}`}
            style={{ backgroundColor, minHeight: showCompleted && completedTodos.length ? 180 : 120, '--note-bg': backgroundColor }}
            onClick={handleCardClick}
        >
            {(isEditingTitle && className === 'details') || (!title && className === 'details') ? (
                <input
                    className="note-title"
                    value={title}
                    placeholder={className === 'details' ? "add title here..." : "Title"}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    autoFocus={isEditingTitle || !title}
                    style={{ background: 'transparent', border: 'none', outline: 'none', font: 'inherit', color: 'inherit', width: '100%', padding: 0, marginBottom: 10 }}
                />
            ) : (
                title && <h2 className="note-title" onClick={handleTitleClick} style={className === 'details' ? { cursor: 'text' } : {}}>{title}</h2>
            )}
            <div className={`note-todos`}>
                <ul className="note-todos">
                    {activeTodos.length === 0 && className === 'details' && (
                        <li className="todo-item">
                            <input
                                className="todo-text"
                                value={(todos[0] && todos[0].txt) ? todos[0].txt : ''}
                                placeholder="add txt note here..."
                                onChange={e => handleTodoChange(e, 0)}
                                onBlur={() => handleTodoBlur(0)}
                                autoFocus
                                style={{ background: 'transparent', border: 'none', outline: 'none', font: 'inherit', color: 'inherit', width: '100%', padding: 0 }}
                            />
                        </li>
                    )}
                    {activeTodos.map((todo, idx) => (
                        <li key={idx} className={`todo-item`}>
                            <label className="custom-checkbox-label">
                                <input
                                    type="checkbox"
                                    className="todo-checkbox"
                                    checked={!!todo.doneAt}
                                    onChange={() => toggleTodo(todos.indexOf(todo))}
                                    style={{ display: 'none' }}
                                />
                                <span
                                    className={`custom-checkbox${todo.doneAt ? ' checked' : ''}`}
                                    style={{ backgroundColor: backgroundColor, borderColor: '#444' }}
                                >
                                    {!!todo.doneAt && (
                                        <svg width="14" height="14" viewBox="0 0 14 14">
                                            <polyline points="3,7 6,10 11,4" style={{ fill: 'none', stroke: '#333', strokeWidth: 2 }} />
                                        </svg>
                                    )}
                                </span>
                            </label>
                            {isEditingTodo === idx && className === 'details' ? (
                                <input
                                    className="todo-text"
                                    value={todos[idx].txt}
                                    onChange={e => handleTodoChange(e, idx)}
                                    onBlur={() => handleTodoBlur(idx)}
                                    autoFocus
                                    style={{ background: 'transparent', border: 'none', outline: 'none', font: 'inherit', color: 'inherit', width: '100%', padding: 0 }}
                                />
                            ) : (
                                <span className="todo-text" onClick={() => handleTodoClick(idx)} style={className === 'details' ? { cursor: 'text' } : {}}>{todos[idx].txt}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            {completedTodos.length > 0 && (
                <div className="completed-section" onClick={handleCompletedSectionClick}>
                    <span className="material-symbols-outlined">{showCompleted ? 'expand_more' : 'chevron_right'}</span>
                    {completedTodos.length} completed item{completedTodos.length > 1 ? 's' : ''}
                </div>
            )}
            {showCompleted && (
                <ul className="note-todos">
                    {completedTodos.map((todo, idx) => (
                        <li key={idx} className={`todo-item done`}>
                            <input
                                type="checkbox"
                                className="todo-checkbox"
                                checked={!!todo.doneAt}
                                onChange={() => toggleTodo(todos.indexOf(todo))}
                            />
                            <span className="todo-text" onClick={() => navigate(`/note/${note.id}`)}>{todo.txt}</span>
                        </li>
                    ))}
                </ul>
            )}
            <NoteToolBar note={note} />
        </div>
    )
}