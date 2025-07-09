import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"
import { MailAdvancedSearch } from "./MailAdvancedSearch.jsx"

const { useState, useEffect, useRef } = React

export function MailFilter({ defaultFilter, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(defaultFilter || mailService.getDefaultFilter())

    const onSetFilterByDebounce = useRef(utilService.debounce(onSetFilterBy, 500)).current
    const { txt } = filterByToEdit || {}

    useEffect(() => {
        onSetFilterByDebounce(filterByToEdit)
    }, [filterByToEdit])

    const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false)

    function handleChange({ target }) {
        // console.log('handleChange target:', target)
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

    function handleAdvancedSearch(advancedFilter) {
        // console.log('handleAdvancedSearch filter:', advancedFilter)
        const globalSearchFilter = {
            txt: advancedFilter.txt || '',
            from: advancedFilter.from || '',
            to: advancedFilter.to || '',
            subject: advancedFilter.subject || '',
            folder: '',
            category: ''
        }
        // console.log('Global search filter:', globalSearchFilter)
        setFilterByToEdit(globalSearchFilter)
    }
    return (
        <section className="mail-search-bar-container">
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
                <span
                    className="material-symbols-outlined tune-icon btn"
                    onClick={() => setIsAdvancedSearchOpen(prev => !prev)}
                >tune</span>
            </form>
            <MailAdvancedSearch
                isOpen={isAdvancedSearchOpen}
                onSetFilterBy={handleAdvancedSearch}
            />
        </section>
    )
}