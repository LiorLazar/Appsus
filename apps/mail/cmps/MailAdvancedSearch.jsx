import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React
const { useSearchParams } = ReactRouterDOM

export function MailAdvancedSearch({ isOpen, onSetFilterBy }) {

    const [searchParams, setSearchParams] = useSearchParams()
    const [filterByToEdit, setFilterByToEdit] = useState(
        mailService.getFilterFromSearchParams(searchParams) || mailService.getDefaultFilter()
    )
    const onSetFilterByDebounce = useRef(utilService.debounce(onSetFilterBy, 500)).current
    const truthyFilter = utilService.getTruthyValues(filterByToEdit || {})

    const { from, to, subject, txt } = filterByToEdit || {}


    useEffect(() => {
        console.log(truthyFilter)
        setSearchParams(truthyFilter)
    }, [filterByToEdit])


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

    function handleSearch() {
        // Only send non-empty filter fields
        const truthyFilter = utilService.getTruthyValues(filterByToEdit)
        console.log('Advanced search filter:', truthyFilter)

        // Update URL search params
        setSearchParams(truthyFilter)

        // Call parent filter update
        onSetFilterBy(truthyFilter)
    }

    const formDetails = [
        { name: 'from', description: 'From', type: 'text' },
        { name: 'to', description: 'To', type: 'text' },
        { name: 'subject', description: 'Subject', type: 'text' },
        { name: 'txt', description: 'Includes the words', type: 'text' },
    ]

    if (!isOpen) return null
    return (
        <div className="mail-advanced-search">
            <div className="advanced-search-form">
                {formDetails.map(detail =>
                    <div key={detail.name} className="form-row">
                        <label htmlFor={detail.name}>{detail.description}</label>
                        <input
                            type={detail.type}
                            name={detail.name}
                            id={detail.name}
                            value={filterByToEdit[detail.name] || ''}
                            onChange={handleChange}
                        />
                    </div>
                )}

                <div className="form-actions">
                    <button type="button" className="create-filter-btn">Create filter</button>
                    <button type="button" className="search-btn" onClick={handleSearch}>Search</button>
                </div>
            </div>
        </div>
    )
}