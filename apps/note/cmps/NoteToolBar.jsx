export function NoteToolBar({ note }) {
    return (
        <div className="note-toolbar">
            <button className="btn btn-color"><span className="material-symbols-outlined">palette</span></button>
            <button className="btn btn-pin">
                {note.isPinned ? 
                    <span className="material-symbols-outlined">keep</span> : 
                    <span className="material-symbols-outlined">keep</span>
                }
            </button>
        </div>
    )
}