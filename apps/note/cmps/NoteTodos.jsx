import { NoteToolBar } from './NoteToolBar.jsx'
const { useState, useEffect, useRef } = React

export function NoteTodos({ note, onHeightChange }) {
    const [todos, setTodos] = useState(note.info.todos)
    const [showCompleted, setShowCompleted] = useState(false)
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff'
    const cardRef = useRef(null)

    function toggleTodo(idx) {
        const newTodos = todos.map((todo, i) => i === idx ? { ...todo, doneAt: todo.doneAt ? null : Date.now() } : todo)
        setTodos(newTodos)
        if (onHeightChange) onHeightChange()
        // Optionally, update the note in storage here
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
        <div ref={cardRef} className={`note-card${showCompleted ? ' expanded-completed' : ''}`} style={{ backgroundColor, minHeight: showCompleted && completedTodos.length ? 180 : 120 }}>
            <h2 className="note-title">{note.info.title}</h2>
            <ul className="note-todos">
                {activeTodos.map((todo, idx) => (
                    <li key={idx} className={`todo-item`}>
                        <input
                            type="checkbox"
                            className="todo-checkbox"
                            checked={!!todo.doneAt}
                            onChange={() => toggleTodo(todos.indexOf(todo))}
                        />
                        {todo.txt}
                    </li>
                ))}
            </ul>
            {completedTodos.length > 0 && (
                <div className="completed-section" onClick={handleCompletedSectionClick} style={{cursor:'pointer'}}>
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
                            {todo.txt}
                        </li>
                    ))}
                </ul>
            )}
            <NoteToolBar note={note} />
        </div>
    )
}