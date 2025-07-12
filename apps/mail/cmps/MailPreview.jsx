import { mailService } from "../services/mail.service.js"

const { useState } = React

export function MailPreview({ mail, onRemoveMail, onArchiveMail, onMarkMail, onCreateNote }) {
    // console.log('mail', mail)
    const [isHovered, setIsHovered] = useState(false)
    const { from, subject, sentAt, isRead } = mail

    function onDeleteMail(ev, mailId) {
        ev.stopPropagation()
        ev.preventDefault()
        onRemoveMail(mailId)
    }

    function onHandleArchiveMail(ev, mailId) {
        ev.stopPropagation()
        ev.preventDefault()
        onArchiveMail(mailId)
    }

    function onHandleMarkMail(ev, mailId) {
        // console.log(mailId)
        ev.stopPropagation()
        ev.preventDefault()
        onMarkMail(mailId)
    }

    function onHandleCreateNote(ev, mailId) {
        ev.stopPropagation()
        ev.preventDefault()
        onCreateNote(mailId)
    }

    return (
        <section
            className="mail-preview flex space-between align-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`mail-from ${!isRead ? 'bold' : ''}`}>{from}</div>
            <div className={`subject ${!isRead ? 'bold' : ''}`}>{subject}</div>
            {isHovered ? (
                <div className="mail-actions">
                    <span
                        className="material-symbols-outlined btn"
                        title="Archive"
                        onClick={ev => { onHandleArchiveMail(ev, mail.id) }}> archive
                    </span>
                    <span
                        className="material-symbols-outlined btn"
                        title="Delete"
                        onClick={ev => { onDeleteMail(ev, mail.id) }}
                    >
                        delete
                    </span>
                    {mail.isRead ? (
                        <span
                            className="material-symbols-outlined btn"
                            title="Mark As Unread"
                            onClick={ev => onHandleMarkMail(ev, mail.id)}
                        >
                            mark_email_unread
                        </span>

                    ) : (
                        <span
                            className="material-symbols-outlined btn"
                            title="Mark As Read"
                            onClick={ev => onHandleMarkMail(ev, mail.id)}
                        >
                            mark_email_read
                        </span>
                    )
                    }
                    <span
                        className="material-symbols-outlined btn"
                        title="Create Note with Mail Info"
                        onClick={ev => onHandleCreateNote(ev, mail.id)}
                    >convert_to_text
                    </span>
                </div>
            ) :
                <div className={`mail-date ${!isRead ? 'bold' : ''}`}>{sentAt}</div>
            }
        </section >
    )
}