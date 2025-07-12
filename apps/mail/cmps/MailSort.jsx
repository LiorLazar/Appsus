import { mailService } from "../services/mail.service.js"

const { useState, useEffect } = React

export function MailSort({ onSetSort }) {
    const [orderItems, setOrderItems] = useState([])
    const [sortBy, setSortBy] = useState({ sortField: '', sortDir: 0 })

    useEffect(() => {
        loadOrderItems()
    }, [])

    function loadOrderItems() {
        mailService.getOrderItems()
            .then(items => {
                console.log('Order items:', items)
                setOrderItems(items)
            })
    }

    function onSort(field, dir) {
        const newSort = { sortField: field, sortDir: dir }
        // console.log('MailSort - Setting sort:', newSort)
        setSortBy(newSort)
        mailService.setSortBy(field, dir)
        if (onSetSort) {
            onSetSort(newSort)
        }
    }

    function handleSortChange(ev) {
        const field = ev.target.value
        // console.log('Sort field selected:', field)
        if (!field) {
            onSort('', 0)
            return
        }
        onSort(field, 1)
    }

    function toggleSortDirection() {
        if (sortBy.sortField) {
            const newDir = sortBy.sortDir === 1 ? -1 : 1
            // console.log('Toggling sort direction:', newDir)
            onSort(sortBy.sortField, newDir)
        }
    }

    function getFieldDisplayName(field) {
        const displayNames = {
            'subject': 'Subject',
            'from': 'From',
            'sentAt': 'Date Sent',
            'createdAt': 'Date Created'
        }
        return displayNames[field] || field
    }

    return (
        <section className="mail-sort">
            <div className="sort-controls">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                    id="sort-select"
                    value={sortBy.sortField}
                    onChange={handleSortChange}
                >
                    <option value="">Default</option>
                    {orderItems.map(item => (
                        <option key={item} value={item}>
                            {getFieldDisplayName(item)}
                        </option>
                    ))}
                </select>
                <div className="flex align-center">Sort Direction:
                    {sortBy.sortField && (
                        <button
                            className="sort-direction-btn btn"
                            onClick={toggleSortDirection}
                            title={`Sort ${sortBy.sortDir === 1 ? 'Descending' : 'Ascending'}`}
                        >
                            <span className="material-symbols-outlined">
                                {sortBy.sortDir === 1 ? 'arrow_upward' : 'arrow_downward'}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}