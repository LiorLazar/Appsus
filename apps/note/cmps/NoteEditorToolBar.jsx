const { useState } = React

export function NoteEditorToolBar({ note, onClose, className = 'note-editor-toolbar', onColor, onImg, onDuplicate, onArchice, onDelete, paletteBtnRef }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    function handleDeleteClick() {
        setShowDeleteModal(true);
    }
    function confirmDelete() {
        setShowDeleteModal(false);
        if (onDelete) onDelete();
    }
    function cancelDelete() {
        setShowDeleteModal(false);
    }

    return (
        <div className={className}>
            <div className="toolbar-btns-left">
                <button className="btn btn-color" type="button" onClick={onColor} ref={paletteBtnRef}>
                    <span className="material-symbols-outlined btn-small">palette</span>
                </button>
                { note.type === 'NoteTxt' &&
                <button className="btn btn-img" type="button">
                    <span className="material-symbols-outlined btn-small" onClick={onImg}>image</span>
                </button>}
                <button className="btn btn-duplicate" type="button">
                    <span className="material-symbols-outlined btn-small" onClick={onDuplicate}>content_copy</span>
                </button>
                { note.folder !== 'archive' &&
                <button className="btn btn-archive" type="button">
                    <span className="material-symbols-outlined btn-small" onClick={onArchice}>archive</span>
                </button>}
                <button className="btn btn-delete" type="button" onClick={handleDeleteClick}>
                    <span className="material-symbols-outlined btn-small">delete</span>
                </button>
            </div>
            <button className="btn btn-close" onClick={onClose}>Close</button>
            {showDeleteModal && (
                <div className="delete-modal-backdrop">
                    <div className="delete-modal">
                        <h2>{note.folder !== 'bin' ? 'Bin' : 'Delete'} Note?</h2>
                        {note.folder === 'bin' && <p>Are you sure you want to delete this note? This action cannot be undone.</p>}
                        <button onClick={confirmDelete}>{note.folder !== 'bin' ? 'Bin' : 'Delete'}</button>
                        <button onClick={cancelDelete}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}