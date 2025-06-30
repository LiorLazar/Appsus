export function MailPreview({ mail }) {
    // console.log('mail', mail)

    const { from, subject, sentAt, isRead } = mail
    return (
        <section className="mail-preview flex space-between align-center">
            <div className={`mail-from ${!isRead ? 'bold' : ''}`}>{from}</div>
            <div className={`mail-subject ${!isRead ? 'bold' : ''}`}>{subject}</div>
            <div className={`mail-date ${!isRead ? 'bold' : ''}`}>{sentAt}</div>
        </section >
    )
}