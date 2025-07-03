const { useState, useRef, useEffect } = React;
import { NoteCreateEx } from './NoteCreateEx.jsx';

export function NoteCreateBar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (formRef.current && !formRef.current.contains(e.target)) {
                setIsExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const openBar = () => setIsExpanded(true);
    const closeBar = (e) => { e.stopPropagation(); setIsExpanded(false); };

    return (
        <form
            ref={formRef}
            onClick={openBar}
            className={`note-create-bar${isExpanded ? ' expanded' : ''}`}
            dir="ltr"
        >
            {isExpanded ? (
                <NoteCreateEx closeBar={closeBar} />
            ) : (
                React.createElement(React.Fragment, null,
                    <input
                        className="note-create-input"
                        type="text"
                        placeholder="Take a note..."
                        readOnly
                    />,
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
                )
            )}
        </form>
    );
}