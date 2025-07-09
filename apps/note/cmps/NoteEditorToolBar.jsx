export function NoteEditorToolBar({ note, onSave, onClose, className = 'note-editor-toolbar', onColor, onImg, onDuplicate, onDelete, paletteBtnRef }) {
  
    return (
        <div className={className}>
            <div className="toolbar-btns-left">
                <button className="btn btn-color" type="button" onClick={onColor} ref={paletteBtnRef}>
                    <span className="material-symbols-outlined btn-small">palette</span>
                </button>
                <button className="btn btn-img" type="button">
                    <span className="material-symbols-outlined btn-small">image</span>
                </button>
                <button className="btn btn-duplicate" type="button">
                    <span className="material-symbols-outlined btn-small">content_copy</span>
                </button>
                <button className="btn btn-delete" type="button">
                    <span className="material-symbols-outlined btn-small">delete</span>
                </button>
            </div>

                <button className="btn btn-close" onClick={onClose}>Close</button>
        </div>
    )
}