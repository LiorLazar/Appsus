import { noteService } from '../services/note.service.js';

export function NoteToolBar({ note, noteItemRef }) {
    return (
        <div className="note-toolbar">
            <button
                className="btn2 btn-color"
                onClick={function(e) {
                    // Use the note card's bounding rect for modal position
                    const noteRect = noteItemRef && noteItemRef.current && typeof noteItemRef.current.getBoundingClientRect === 'function'
                        ? noteItemRef.current.getBoundingClientRect()
                        : null;
                    const scrollY = window.scrollY || window.pageYOffset;
                    const scrollX = window.scrollX || window.pageXOffset;
                    let btnRect;
                    if (noteRect) {
                        btnRect = {
                            top: noteRect.bottom + scrollY,
                            left: noteRect.left + scrollX,
                            bottom: noteRect.bottom + scrollY,
                            right: noteRect.right + scrollX,
                            width: noteRect.width,
                            height: noteRect.height
                        };
                    } else {
                        // fallback to button
                        const btn = e.currentTarget;
                        const btnRectRaw = btn.getBoundingClientRect();
                        btnRect = {
                            top: btnRectRaw.bottom + scrollY,
                            left: btnRectRaw.left + scrollX,
                            bottom: btnRectRaw.bottom + scrollY,
                            right: btnRectRaw.right + scrollX,
                            width: btnRectRaw.width,
                            height: btnRectRaw.height
                        };
                    }
                    window.dispatchEvent(new CustomEvent('openColorPickerModal', {
                        detail: { note: note, btnRect }
                    }));
                }}
            >
                <span className="material-symbols-outlined btn-small">palette</span>
            </button>
            <button
                className="btn2 btn-pin"
                onClick={() => {
                    noteService.save({ ...note, isPinned: !note.isPinned })
                        .then(() => window.dispatchEvent(new Event('refreshNotes')))
                }}
            >
                <span className="material-symbols-outlined btn-small">
                    {note.isPinned ? 'push_pin' : 'push_pin'}
                </span>
            </button>
        </div>
    )
}