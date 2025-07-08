export function MailAdvancedSearch({ isOpen }) {
    if (!isOpen) return null
    return (
        <div className="mail-advanced-search">
            <form>
                <label htmlFor="from">From</label>
                <input type="text" name='from' id='from' />

                <label htmlFor="to">To</label>
                <input type="text" name='to' id='to' />

                <label htmlFor="subject">Subject</label>
                <input type="text" name='subject' id='subject' />

                <label htmlFor="includes">Includes the words</label>
                <input type="text" name='includes' id='includes' />
            </form>
        </div>
    )

}