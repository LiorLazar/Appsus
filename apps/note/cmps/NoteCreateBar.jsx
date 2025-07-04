const { useState, useRef, useEffect } = React
import { noteService } from '../services/note.service.js'


export function NoteCreateBar() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [titleValue, setTitleValue] = useState("")
    const formRef = useRef(null)
    const fileInputRef = useRef(null)

    function onAddNote(txt = '', title = '', isPinned = false, imgDataUrl = null) {
        let note = {}
        note.info = note.info || {}
        note.info.title = title
        note.isPinned = isPinned
        note.createdAt = Date.now()
        if (imgDataUrl) {
            note.type = 'NoteImg'
            note.info.url = imgDataUrl
        } else if (txt.includes(',')) {
            note.type = 'NoteTodos'
            note.info.todos = txt.split(',').map(str => ({ txt: str.trim(), doneAt: null }))
        } else {
            note.type = 'NoteTxt'
            note.info.txt = txt
        }
        noteService.save(note)
            .then(() => {
                window.dispatchEvent(new Event('refreshNotes'))
            })
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
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
    }, [inputValue, titleValue, isExpanded])

    function openBar() { setIsExpanded(true) }

    function closeBar(e) {
        e.stopPropagation()
        setIsExpanded(false)
        setInputValue("")
        setTitleValue("")
    }

    function handleImageBtnClick(e) {
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
            setIsExpanded(false)
            setInputValue("")
            setTitleValue("")
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
                        <button type="button" className="btn"><span className="material-symbols-outlined">format_size</span></button>
                        <button type="button" className="btn"><span className="material-symbols-outlined">palette</span></button>
                        <button type="button" className="btn"><span className="material-symbols-outlined">notifications</span></button>
                        <button type="button" className="btn"><span className="material-symbols-outlined">person_add</span></button>
                        <button type="button" className="btn" onClick={handleImageBtnClick}><span className="material-symbols-outlined">image</span></button>
                        <button type="button" className="btn"><span className="material-symbols-outlined">file_download</span></button>
                        <button type="button" className="btn"><span className="material-symbols-outlined">more_vert</span> </button>
                        <button type="button" className="btn" disabled><span className="material-symbols-outlined">undo</span></button>
                        <button type="button" className="btn" disabled><span className="material-symbols-outlined">redo</span></button>
                        <button type="button" className="btn btn-close" onClick={closeBar}>Close</button>
                    </div>
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
                        <button type="button" className="btn"><span className="material-symbols-outlined">check_box</span></button>
                        <button type="button" className="btn"><span className="material-symbols-outlined">brush</span></button>
                        <button type="button" className="btn" onClick={handleImageBtnClick}><span className="material-symbols-outlined">image</span></button>
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