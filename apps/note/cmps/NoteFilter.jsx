import { utilService } from "../../../services/util.service.js"
const { useState, useEffect, useRef } = React

export function NoteFilter({ defaultFilter, onSetFilterBy = () => {} }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...defaultFilter })

    const onSetFilterByDebounce = useRef(utilService.debounce(onSetFilterBy, 500)).current
    const { txt } = filterByToEdit

    useEffect(() => {
        onSetFilterByDebounce(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        switch (target.type) {

            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    return (
        <form className="note-search-bar" autoComplete="off" onSubmit={ev => ev.preventDefault()}>
            <span className="material-symbols-outlined search-icon btn">search</span>
            <input
                className="note-search-input"
                onChange={handleChange}
                value={txt || ''}
                name="txt"
                type="text"
                placeholder="Search"
            />
            {txt && (
                <span
                    className="material-symbols-outlined note-search-close btn"
                    onClick={() => setFilterByToEdit(prev => ({ ...prev, txt: '' }))}
                >
                    close
                </span>
            )}
        </form>
    )
}