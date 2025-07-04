const COLORS = [
  null, // Default color (no color)
  '#faafa8', '#f39f76', '#fff8b8', '#e2f6d3', '#b4ddd3',
  '#d4e4ed', '#aeccdc', '#d3bfdb', '#f6e2dd', '#e9e3d4', '#efeff1'
];

export function ColorPickerModal({ isOpen, onClose, onColorSelect, selectedColor, modalPos }) {
  const modalRef = React.useRef(null);
  const [adjustedPos, setAdjustedPos] = React.useState(modalPos);

  React.useLayoutEffect(() => {
    if (!isOpen || !modalPos) return;
    const modal = modalRef.current;
    if (!modal) return;
    const { innerWidth, innerHeight } = window;
    const rect = modal.getBoundingClientRect();
    let top = modalPos.top;
    let left = modalPos.left;
    // Adjust right overflow
    if (left + rect.width > innerWidth) {
      left = Math.max(0, innerWidth - rect.width - 8); // 8px margin
    }
    // Adjust bottom overflow
    if (top + rect.height > innerHeight) {
      top = Math.max(0, innerHeight - rect.height - 8); // 8px margin
    }
    setAdjustedPos({ top, left });
  }, [isOpen, modalPos]);

  if (!isOpen) return null;

  const style = adjustedPos
    ? { position: 'absolute', top: adjustedPos.top, left: adjustedPos.left, zIndex: 10001 }
    : { position: 'absolute', top: '40px', left: '0', zIndex: 10001 };

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
      <div ref={modalRef} className="color-picker-modal-abs" style={style} onClick={e => e.stopPropagation()}>
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
