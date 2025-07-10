import { NoteToolBar } from './NoteToolBar.jsx'
import { noteService } from '../services/note.service.js'

const { useNavigate } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function NoteTodos({ note, onHeightChange, className = 'note-card', onUpdate, onCardClick, noteItemRef }) {
    const [todos, setTodos] = useState(note.info.todos)
    const [showCompleted, setShowCompleted] = useState(false)
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff'
    const cardRef = useRef(null)
    const navigate = useNavigate();

    function toggleTodo(todoId) {
        const newTodos = todos.map(todo =>
            todo.id === todoId ? { ...todo, doneAt: todo.doneAt ? null : Date.now() } : todo
        )
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
        if (e.target.closest('button, [role="button"], a, input, textarea, select, label')) return;
        if (onCardClick) onCardClick(note, e);
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

    useEffect(() => {
        // Ensure each todo has a unique id (fallback if utilService.makeId is missing)
        if (Array.isArray(note.info.todos)) {
            const todosWithId = note.info.todos.map(todo =>
                todo.id ? todo : { ...todo, id: (Date.now() + Math.random()).toString(36) }
            )
            if (JSON.stringify(todosWithId) !== JSON.stringify(note.info.todos)) {
                noteService.save({ ...note, info: { ...note.info, todos: todosWithId } })
            }
            setTodos(todosWithId)
        } else {
            setTodos([])
        }
    }, [note.info.todos])

    return (
        <div
            ref={cardRef}
            className={`${className} ${note.id} ${className} ${showCompleted ? 'expanded-completed' : ''}`}
            style={{ backgroundColor, minHeight: showCompleted && completedTodos.length ? 180 : 120, '--note-bg': backgroundColor }}
            onClick={handleCardClick}
        >
            {note.info.title && <h2 className="note-title">{note.info.title}</h2>}
            <div className={`note-todos`}>
                <ul className="note-todos">
                    {activeTodos.map((todo, idx) => (
                        <li key={todo.id || idx} className={`todo-item`}>
                            <label className="custom-checkbox-label">
                                <input
                                    type="checkbox"
                                    className="todo-checkbox"
                                    checked={!!todo.doneAt}
                                    readOnly
                                    style={{ display: 'none' }}
                                />
                                <span
                                    className={`custom-checkbox${todo.doneAt ? ' checked' : ''}`}
                                    style={{ backgroundColor: backgroundColor, borderColor: '#444' }}
                                    onClick={() => toggleTodo(todo.id)}
                                >
                                    {!!todo.doneAt && (
                                        <svg width="14" height="14" viewBox="0 0 14 14">
                                            <polyline points="3,7 6,10 11,4" style={{ fill: 'none', stroke: '#333', strokeWidth: 2 }} />
                                        </svg>
                                    )}
                                </span>
                            </label>
                            <span className="todo-text">{todo.txt}</span>
                        </li>
                    ))}
                </ul>
            </div>
            {completedTodos.length > 0 && (
                <div className="completed-section" onClick={e => { e.stopPropagation(); handleCompletedSectionClick(); }}>
                    <span className="material-symbols-outlined">{showCompleted ? 'expand_more' : 'chevron_right'}</span>
                    {completedTodos.length} completed item{completedTodos.length > 1 ? 's' : ''}
                </div>
            )}
            {showCompleted && (
                <ul className="note-todos">
                    {completedTodos.map((todo, idx) => (
                        <li key={todo.id || idx} className={`todo-item done`}>
                            <input
                                type="checkbox"
                                className="todo-checkbox"
                                checked={!!todo.doneAt}
                                onChange={() => toggleTodo(todo.id)}
                            />
                            <span className="todo-text">{todo.txt}</span>
                        </li>
                    ))}
                </ul>
            )}
            <NoteToolBar note={note} noteItemRef={noteItemRef} />
        </div>
    )
}