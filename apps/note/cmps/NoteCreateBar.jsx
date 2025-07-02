export function NoteCreateBar() {
    return (
        <form className="note-create-bar" dir="ltr">
            <input
                className="note-create-input"
                type="text"
                placeholder="Take a note..."
            />
            <div className="note-create-actions">
                <button type="button" className="btn">
                    <span className="material-symbols-outlined">check_box</span>
                </button>
                <button type="button" className="btn">
                    <span className="material-symbols-outlined">brush</span>
                </button>
                <button type="button" className="btn">
                    <span className="material-symbols-outlined">image</span>
                </button>
            </div>
        </form>
    );
}