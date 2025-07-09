import { noteService } from '../services/note.service.js'

export function NoteEditorToolBar({ note, onSave, onClose, className = 'note-editor-toolbar', onColor, onImg, onDuplicate, onDelete }) {
  
    return (
        <div className={className}>
            <div className="toolbar-btns-left">
                <span class="material-symbols-outlined btn btn-small" onClick="">palette</span>
                <span class="material-symbols-outlined btn btn-small" onClick="">image</span>
                <span class="material-symbols-outlined btn btn-small">content_copy</span>
                <span class="material-symbols-outlined btn btn-small" onClick="">delete</span>
            </div>

                <button className="btn btn-close" onClick={onClose}>Close</button>
        </div>
    )
}