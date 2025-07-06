const { useState, useRef, useEffect } = React
import { noteService } from '../services/note.service.js'
import { ColorPickerModal } from './ColorPickerModal.jsx';
import { showSuccessMsg } from '../../../services/event-bus.service.js'

export function NoteCreateBar() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [titleValue, setTitleValue] = useState("")
    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const formRef = useRef(null)
    const fileInputRef = useRef(null)
    const colorbtn2Ref = useRef(null);
    const [modalPos, setModalPos] = useState(null);

    function onAddNote(txt = '', title = '', isPinned = false, imgDataUrl = null) {
        noteService.addNote(txt, title, isPinned, imgDataUrl, selectedColor)
            .then(() => {
                setInputValue("")
                setTitleValue("")
                setSelectedColor(null)
                setIsExpanded(false)
                console.log('Note added successfully:', { txt, title, isPinned, imgDataUrl, selectedColor });
                
                showSuccessMsg('Note added successfully!')
                // Optionally, you can trigger a refresh of notes here
                // window.dispatchEvent(new Event('refreshNotes'))
            })
            .catch(err => {
                console.error('Failed to add note', err)
            })
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            // Close color modal if open and click is outside the modal itself
            const modal = document.querySelector('.color-picker-modal-abs');
            if (isColorModalOpen && modal && !modal.contains(e.target)) {
                setIsColorModalOpen(false);
            }
            // Existing logic for closing the bar
            if (formRef.current && !formRef.current.contains(e.target)) {
                if (isExpanded && (inputValue || titleValue)) {
                    console.log('onAddNote called with:', inputValue, titleValue)
                    onAddNote(inputValue, titleValue)
                }
                closeBar(e)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [inputValue, titleValue, isExpanded, isColorModalOpen])

    useEffect(() => {
        if (!isColorModalOpen) return;
        function updateModalPos() {
            if (colorbtn2Ref.current) {
                const rect = colorbtn2Ref.current.getBoundingClientRect();
                setModalPos({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX
                });
            }
        }
        window.addEventListener('scroll', updateModalPos);
        window.addEventListener('resize', updateModalPos);
        // Update position immediately in case of scroll/resize
        updateModalPos();
        return () => {
            window.removeEventListener('scroll', updateModalPos);
            window.removeEventListener('resize', updateModalPos);
        };
    }, [isColorModalOpen])

    function openBar() { setIsExpanded(true) }

    function closeBar(e) {
        e.stopPropagation()
        setIsExpanded(false)
        setInputValue("")
        setTitleValue("")
        setSelectedColor(null)
    }

    function handleImagebtn2Click(e) {
        e.stopPropagation()
        if (fileInputRef.current) fileInputRef.current.click()
    }

    function handleFileChange(e) {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = function (ev) {
            const imgDataUrl = ev.target.result
            onAddNote(inputValue, titleValue, false, imgDataUrl)
            // Close the bar and reset fields after adding image note
            closeBar(e)
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    return (
        <form
            ref={formRef}
            onClick={openBar}
            className={`note-create-bar${isExpanded ? ' expanded' : ''}`}
            dir="ltr"
            style={isExpanded && selectedColor ? { backgroundColor: selectedColor, transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)' } : {}}
        >
            {isExpanded ? (
                <React.Fragment>
                    <input
                        className="note-create-title"
                        type="text"
                        placeholder="Title"
                        value={titleValue}
                        onChange={e => setTitleValue(e.target.value)}
                    />
                    <textarea
                        className="note-create-textarea"
                        placeholder="Take a note..."
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                    <div className="note-create-actions">
                        <button type="button" className="btn2"><span className="material-symbols-outlined">format_size</span></button>
                        <div style={{ display: 'inline-block', position: 'relative' }}>
                            <button
                                type="button"
                                className="btn2 btn-color"
                                ref={colorbtn2Ref}
                                onMouseDown={e => {
                                    e.stopPropagation();
                                    if (!isColorModalOpen) {
                                        const rect = colorbtn2Ref.current.getBoundingClientRect();
                                        setModalPos({
                                            top: rect.bottom + window.scrollY,
                                            left: rect.left + window.scrollX
                                        });
                                    }
                                    setIsColorModalOpen(prev => !prev);
                                }}
                            >
                                <span className="material-symbols-outlined">palette</span>
                            </button>
                        </div>
                        <button type="button" className="btn2"><span className="material-symbols-outlined">notifications</span></button>
                        <button type="button" className="btn2"><span className="material-symbols-outlined">person_add</span></button>
                        <button type="button" className="btn2" onClick={handleImagebtn2Click}><span className="material-symbols-outlined">image</span></button>
                        <button type="button" className="btn2"><span className="material-symbols-outlined">file_download</span></button>
                        <button type="button" className="btn2"><span className="material-symbols-outlined">more_vert</span> </button>
                        <button type="button" className="btn2" disabled><span className="material-symbols-outlined">undo</span></button>
                        <button type="button" className="btn2" disabled><span className="material-symbols-outlined">redo</span></button>
                        <button type="button" className="btn2 btn-close" onClick={closeBar}>Close</button>
                    </div>
                    {/* Render the modal OUTSIDE the button row to avoid layout shift */}
                    {isColorModalOpen && (
                        <ColorPickerModal
                            isOpen={isColorModalOpen}
                            onClose={() => setIsColorModalOpen(false)}
                            onColorSelect={color => { setSelectedColor(color); /* do not close modal here */ }}
                            selectedColor={selectedColor}
                            modalPos={modalPos}
                        />
                    )}
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <input
                        className="note-create-input"
                        type="text"
                        placeholder="Take a note..."
                        value={inputValue}
                        readOnly
                    />
                    <div className="note-create-actions">
                        <button type="button" className="btn2"><span className="material-symbols-outlined">check_box</span></button>
                        <button type="button" className="btn2"><span className="material-symbols-outlined">brush</span></button>
                        <button type="button" className="btn2" onClick={handleImagebtn2Click}><span className="material-symbols-outlined">image</span></button>
                    </div>
                </React.Fragment>
            )}

            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
            />
        </form>
    )
}