export function MailAdvancedSearch({ isOpen }) {

    const formDetails = [
        { name: 'from', description: 'From', type: 'text' },
        { name: 'to', description: 'To', type: 'text' },
        { name: 'subject', description: 'Subject', type: 'text' },
        { name: 'includes', description: 'Includes the words', type: 'text' },
    ]

    if (!isOpen) return null
    return (
        <div className="mail-advanced-search">
            <div className="advanced-search-form">
                {formDetails.map(detail =>
                    <div className="form-row">
                        <label htmlFor={detail.name}>{detail.description}</label>
                        <input type={detail.type} name={detail.name} id={detail.name} />
                    </div>
                )}

                <div className="form-actions">
                    <button type="button" className="create-filter-btn">Create filter</button>
                    <button type="submit" className="search-btn">Search</button>
                </div>
            </div>
        </div>
    )
}