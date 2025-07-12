import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { noteService } from "../../note/services/note.service.js"
import { mailService } from "../services/mail.service.js"
import { MailPreview } from "./MailPreview.jsx"

const { Link } = ReactRouterDOM

export function MailList({ mails, setMails }) {

    function onRemoveMail(mailId) {
        mailService.get(mailId)
            .then(mail => {
                console.log(mail)
                if (mail.folder === 'bin') {
                    mailService.remove(mailId)
                        .then(() => {
                            showSuccessMsg('Mail Removed Successfully')
                            setMails(mails => mails.filter(mail => mail.id !== mailId))
                        })
                        .catch(err => console.log('err:', err))
                }
                else {
                    mail.folder = 'bin'
                    return mailService.save(mail)
                        .then(() => {
                            showSuccessMsg('Mail Moved to Trash folder')
                            setMails(mails => mails.filter(mail => mail.id !== mailId))
                        }
                        )
                }
            })
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

    function onMarkMail(mailId) {
        mailService.get(mailId)
            .then(mail => {
                mail.isRead = !mail.isRead
                return mailService.save(mail)
            })
            .then(updatedMail => {
                showSuccessMsg(`Mail marked as ${updatedMail.isRead ? 'read' : 'unread'}`)
                setMails(mails => mails.map(mail =>
                    mail.id === mailId ? { ...mail, isRead: updatedMail.isRead } : mail
                ))
            })
            .catch(err => {
                console.log('Error marking mail:', err)
                showErrorMsg('Error updating mail')
            })
    }

    function onCreateNote(mailId) {
        mailService.get(mailId)
            .then(mail => {
                const mailContent = `From: ${mail.from}\nTo: ${mail.to}\nMail Content: ${mail.body}`
                noteService.addNote(mailContent, mail.subject)
                    .then(() => {
                        // setInputValue(mailContent)
                        // setTitleValue(mail.subject)
                        // setSelectedColor(null)
                        // setIsExpanded(false)
                        console.log('Note added successfully')
                        showSuccessMsg('Note added successfully!')
                    })
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
                        onMarkMail={onMarkMail}
                        onCreateNote={onCreateNote}
                    />
                </Link>
            ))}
        </div>
    )
}