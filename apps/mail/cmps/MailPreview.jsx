
const { useState } = React

export function MailPreview({ mail, onRemoveMail }) {
    // console.log('mail', mail)
    const [isHovered, setIsHovered] = useState(false)
    const { from, subject, sentAt, isRead } = mail
    return (
        <section
            className="mail-preview flex space-between align-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`mail-from ${!isRead ? 'bold' : ''}`}>{from}</div>
            <div className={`mail-subject ${!isRead ? 'bold' : ''}`}>{subject}</div>
            {isHovered ? (
                <div className="mail-actions">
                    <span
                        className="material-symbols-outlined btn"
                        title="Archive"> archive
                    </span>
                    <span
                        className="material-symbols-outlined btn"
                        title="Delete"
                        onClick={ev => {
                            ev.stopPropagation()
                            ev.preventDefault()
                            onRemoveMail(mail.id)
                        }}>delete
                    </span>
                    {mail.isRead ? (
                        <span
                            className="material-symbols-outlined btn"
                            title="Mark As Unread">mark_email_unread
                        </span>

                    ) : (
                        <span
                            className="material-symbols-outlined btn"
                            title="Mark As Read">mark_email_read
                        </span>
                    )
                    }
                    <span
                        className="material-symbols-outlined btn"
                        title="Snooze">schedule
                    </span>
                </div>
            ) :
                <div className={`mail-date ${!isRead ? 'bold' : ''}`}>{sentAt}</div>
            }
        </section >
    )
}