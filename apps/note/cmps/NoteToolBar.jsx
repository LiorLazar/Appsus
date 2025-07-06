export function NoteToolBar({ note }) {
    return (
        <div className="note-toolbar">
            <button
                className="btn2 btn-color"
                onClick={function(e) {
                    var btnRect = e.target.getBoundingClientRect();
                    window.dispatchEvent(new CustomEvent('openColorPickerModal', {
                        detail: { note: note, btnRect: btnRect }
                    }));
                }}
            >
                <span className="material-symbols-outlined">palette</span>
            </button>
            <button className="btn2 btn-pin">
                {note.isPinned ? 
                    <span className="material-symbols-outlined">keep</span> : 
                    <span className="material-symbols-outlined">keep</span>
                }
            </button>
        </div>
    )
}