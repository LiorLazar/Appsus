import { utilService } from "../../../services/util.service.js"

const { useState, useEffect, useRef } = React

export function MailFilter({ defaultFilter, onSetFilterBy }) {

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
        <form className="mail-search-bar" autoComplete="off" onSubmit={ev => ev.preventDefault()}>
            <span className="material-symbols-outlined search-icon btn">search</span>
            <input
                className="mail-search-input"
                onChange={handleChange}
                value={txt}
                name="txt"
                type="text"
                placeholder="Search mail"
            />
            <span className="material-symbols-outlined tune-icon btn">tune</span>
        </form>
    )
}