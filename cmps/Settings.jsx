const { useState, useEffect } = React;

export function Settings({ isOpen, onClose }) {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    const defaultBgColor = darkMode ? '#202124' : '#fff';

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', darkMode);
        // Refresh notes without animation
        window.dispatchEvent(new CustomEvent('refreshNotesFilterBy'));
    }, [darkMode]);

    if (!isOpen) return null;
    return (
        <div className="settings-menu" onClick={onClose}>
            <div className="settings-menu-grid" onClick={ev => ev.stopPropagation()}>
                <label className="switch-label">
                    <span>Dark mode</span>
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={e => setDarkMode(e.target.checked)}
                    />
                    <span className="slider"></span>
                </label>
            </div>
        </div>
    );
}