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
    let top = modalPos.top;
    let left = modalPos.left;
    const modal = modalRef.current;
    if (modal) {
      const { innerWidth, innerHeight } = window;
      const rect = modal.getBoundingClientRect();
      // Adjust right overflow
      if (left + rect.width > innerWidth) {
        left = Math.max(0, innerWidth - rect.width - 8); // 8px margin
      }
      // Adjust left overflow
      if (left < 0) {
        left = 8; // 8px margin from left
      }
      // Do not adjust top overflow
    }
    setAdjustedPos({ top, left });
  }, [isOpen, modalPos]);

  if (!isOpen) return null;

  
  const style = adjustedPos
  ? { position: 'absolute', top: adjustedPos.top, left: adjustedPos.left, zIndex: 10001 }
  : { position: 'absolute', top: '100px', left: '100px', zIndex: 10001 };
  
  console.log('ColorPickerModal render', adjustedPos);
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
              type="button"
              className={`color-circle color-default${selectedColor === '#ffffff' || !selectedColor ? ' selected' : ''}`}
              style={{ backgroundColor: '#ffffff', border: selectedColor === '#ffffff' ? '2.5px solid #e0e0e0' : undefined }}
              onClick={() => onColorSelect('#ffffff')}
              aria-label="Default color"
            >
              <span className="material-symbols-outlined color-default-icon">format_color_reset</span>
              {(selectedColor === '#ffffff' || !selectedColor) && (
                <span className="color-check">✔</span>
              )}
            </button>
            {COLORS.slice(1).map((color, idx) => (
              <button
                type="button"
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
