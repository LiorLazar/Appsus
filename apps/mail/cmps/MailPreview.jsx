export function MailPreview({ mail, onRemoveMail }) {
    // console.log('mail', mail)

    const { from, subject, sentAt, isRead } = mail
    return (
        <section className="mail-preview flex space-between align-center">
            {/* <i className="fa-solid fa-trash"
                onClick={ev => {
                    ev.stopPropagation()
                    ev.preventDefault()
                    onRemoveMail(mail.id)
                }}
                title="Delete"
            >
            </i> */}
            <span className="material-symbols-outlined">delete</span>
            <div className={`mail-from ${!isRead ? 'bold' : ''}`}>{from}</div>
            <div className={`mail-subject ${!isRead ? 'bold' : ''}`}>{subject}</div>
            <div className={`mail-date ${!isRead ? 'bold' : ''}`}>{sentAt}</div>
        </section >
    )
}