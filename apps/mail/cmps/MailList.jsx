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

    function onArchiveMail(mailId) {
        mailService.get(mailId)
            .then(mail => {
                mail.folder = 'archive'
                return mailService.save(mail)
            })
            .then(() => {
                showSuccessMsg('Mail Archived Successfully')
                setMails(mails => mails.filter(email => email.id !== mailId))
            })
            .catch(err => {
                console.log('Error archiving mail:', err)
                showErrorMsg('Error archiving mail')
            })
    }

    return (
        <div className="mail-list container">
            {mails.map(mail => (
                <Link key={mail.id} to={`/mail/${mail.id}`}>
                    <MailPreview
                        mail={mail}
                        onRemoveMail={onRemoveMail}
                        onArchiveMail={onArchiveMail}
                    />
                </Link>
            ))}
        </div>
    )
}