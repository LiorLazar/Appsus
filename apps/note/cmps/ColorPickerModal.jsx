const COLORS = [
  null, // Default color (no color)
  '#ffab91', '#ffd54f', '#dcedc8', '#b2dfdb', '#b3e5fc',
  '#90caf9', '#b39ddb', '#f8bbd0', '#ffe0b2', '#d7ccc8', '#f5f5f5'
];

export function ColorPickerModal({ isOpen, onClose, onColorSelect, selectedColor, modalPos }) {
  if (!isOpen) return null;

  // Use absolute positioning so the modal scrolls with the content
  const style = modalPos
    ? { position: 'absolute', top: modalPos.top, left: modalPos.left, zIndex: 9999 }
    : { position: 'absolute', top: '40px', left: '0', zIndex: 9999 };

  return (
    <div className="color-picker-modal-abs" onClick={onClose} style={style}>
      <div className="color-picker-modal" onClick={e => e.stopPropagation()}>
        <div className="color-picker-row">
          <button
            className={`color-circle color-default${!selectedColor ? ' selected' : ''}`}
            style={{ backgroundColor: '#fff', border: selectedColor ? '2.5px solid #e0e0e0' : undefined }}
            onClick={() => onColorSelect(null)}
            aria-label="Default color"
          >
            <span className="material-symbols-outlined color-default-icon">format_color_reset</span>
            {!selectedColor && (
              <span className="color-check">✔</span>
            )}
          </button>
          {COLORS.slice(1).map((color, idx) => (
            <button
              key={color}
              className={`color-circle${selectedColor === color ? ' selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              aria-label={`Pick color ${color}`}
            >
              {selectedColor === color && (
                <span className="color-check">✔</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
