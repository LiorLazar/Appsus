const { useState } = React;
import { ColorPickerModal } from './ColorPickerModal.jsx';

export function NoteToolBar({ note }) {
    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);

    function handleColorBtnClick() {
        setIsColorModalOpen(true);
    }
    function handleColorSelect(color) {
        setSelectedColor(color);
        setIsColorModalOpen(false);
        // Optionally, trigger a callback to update the note color here
    }
    function handleCloseModal() {
        setIsColorModalOpen(false);
    }

    return (
        <div className="note-toolbar">
            <div style={{ display: 'inline-block', position: 'absulute' }}>
                <button className="btn btn-color" onClick={handleColorBtnClick}>
                    <span className="material-symbols-outlined">palette</span>
                </button>
                <ColorPickerModal
                    note={note}
                    isOpen={isColorModalOpen}
                    onClose={handleCloseModal}
                    onColorSelect={handleColorSelect}
                    selectedColor={selectedColor}
                />
            </div>
            <button className="btn btn-pin">
                {note.isPinned ? 
                    <span className="material-symbols-outlined">keep</span> : 
                    <span className="material-symbols-outlined">keep</span>
                }
            </button>
        </div>
    )
}