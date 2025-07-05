const COLORS = [
  null, // Default color (no color)
  '#ffab91', '#ffd54f', '#dcedc8', '#b2dfdb', '#b3e5fc',
  '#90caf9', '#b39ddb', '#f8bbd0', '#ffe0b2', '#d7ccc8', '#f5f5f5'
];

export function ColorPickerModal({ isOpen, onClose, onColorSelect, selectedColor, modalPos }) {
  if (!isOpen) return null;

  // Use absolute positioning for the modal so it scrolls with the page
  const style = modalPos
    ? { position: 'absolute', top: modalPos.top, left: modalPos.left, zIndex: 10001 }
    : { position: 'absolute', top: '40px', left: '0', zIndex: 10001 };

  // Instead of a fixed overlay, use a transparent absolute overlay that covers the whole document
  // This overlay will be placed at the top of the DOM tree (e.g., as a sibling to the modal)
  // and will not interfere with the modal's absolute positioning
  return (
    <div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, window.innerHeight) + 'px',
          zIndex: 10000,
          background: 'transparent',
        }}
        onClick={onClose}
      />
      <div className="color-picker-modal-abs" style={style} onClick={e => e.stopPropagation()}>
        <div className="color-picker-modal">
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
    </div>
  );
}
