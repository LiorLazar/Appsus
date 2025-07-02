import { NoteToolBar } from './NoteToolBar.jsx'

export function NoteTodos({ note }) {
    const backgroundColor = (note.style && note.style.backgroundColor) ? note.style.backgroundColor : '#ffffff';
    
    return (
        <div className="note-card" style={{ backgroundColor }}>
            <h2 className="note-title">{note.info.title}</h2>
            <ul className="note-todos">
                {note.info.todos.map((todo, idx) => (
                    <li key={idx} className={`todo-item ${todo.doneAt ? 'done' : ''}`}>
                        {todo.txt}
                    </li>
                ))}
            </ul>
            <NoteToolBar note={note} />
        </div>
    ) 
}