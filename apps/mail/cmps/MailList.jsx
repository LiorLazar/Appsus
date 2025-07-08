import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { mailService } from "../services/mail.service.js"
import { MailPreview } from "./MailPreview.jsx"

const { Link } = ReactRouterDOM

export function MailList({ mails, setMails }) {
    function onRemoveMail(emailId) {
        mailService.remove(emailId)
            .then(() => {
                showSuccessMsg('Mail Removed Successfully')
                setMails(mails => mails.filter(email => email.id !== emailId))
            })
            .catch(err => console.log('err:', err))
    }

    return (
        <div className="mail-list container">
            {mails.map(mail => (
                <Link key={mail.id} to={`/mail/${mail.id}`}>
                    <MailPreview mail={mail} onRemoveMail={onRemoveMail} />
                </Link>
            ))}
        </div>
    )
}