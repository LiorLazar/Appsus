import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { mailService } from "../services/mail.service.js"
import { MailPreview } from "./MailPreview.jsx"

const { useState, useEffect } = React
const { Link } = ReactRouterDOM

export function MailList({ mails, onRemoveMail }) {
    if (!Array.isArray(mails)) return null

    const [emails, setEmails] = useState(null)
    const [filterBy, setFilterBy] = useState(mailService.getDefaultFilter())

    useEffect(() => {
        loadMails()
    }, [filterBy])

    function loadMails() {
        mailService.query(filterBy)
            .then(setEmails)
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Problem removing book')
            })
    }

    function onRemoveMail(emailId) {
        mailService.remove(emailId)
            .then(() => {
                showSuccessMsg('Mail Removed Successfully')
                setEmails(emails => emails.filter(email => email.id !== emailId))
            })
            .catch(err => console.log('err:', err))
    }

    return (
        <div className="mail-list container">
            <div>Unread Mails: {emails ? emails.filter(email => !email.isRead).length : 0}</div>
            <Link to="compose" className="compose-btn">+ Compose</Link>
            {(emails || []).map(mail =>
                <Link key={mail.id} to={mail.id}>
                    <section >
                        <MailPreview mail={mail} onRemoveMail={onRemoveMail} />
                    </section>
                </Link>
            )}
        </div>
    )
}
