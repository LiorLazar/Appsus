const { forwardRef } = React;

export const NoteCreateEx = forwardRef(function NoteCreateEx({ closeBar }, ref) {
    return (
        React.createElement(React.Fragment, null,
            <input
                className="note-create-title"
                type="text"
                placeholder="Title"
                onClick={e => e.stopPropagation()}
                ref={ref}
            />,
            <textarea
                className="note-create-textarea"
                placeholder="Take a note..."
                onClick={e => e.stopPropagation()}
                autoFocus
            />,
            <div className="note-create-actions">
                <button type="button" className="btn">
                    <span className="material-symbols-outlined">format_size</span>
                </button>
                <button type="button" className="btn">
                    <span className="material-symbols-outlined">palette</span>
                </button>
                <button type="button" className="btn">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <button type="button" className="btn">
                    <span className="material-symbols-outlined">person_add</span>
                </button>
                <button type="button" className="btn">
                    <span className="material-symbols-outlined">image</span>
                </button>
                <button type="button" className="btn">
                    <span className="material-symbols-outlined">file_download</span>
                </button>
                <button type="button" className="btn">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
                <span className="note-create-actions-spacer" />
                <button type="button" className="btn" disabled>
                    <span className="material-symbols-outlined">undo</span>
                </button>
                <button type="button" className="btn" disabled>
                    <span className="material-symbols-outlined">redo</span>
                </button>
                <button type="button" className="btn btn-close" onClick={closeBar}>
                    Close
                </button>
            </div>
        )
    );
});
