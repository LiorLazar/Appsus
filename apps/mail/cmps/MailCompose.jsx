import { showErrorMsg } from "../../../services/event-bus.service.js"
import { mailService } from "../services/mail.service.js"

const { useState } = React
const { useNavigate } = ReactRouterDOM

export function MailCompose() {
    const [mail, setMail] = useState(mailService.getEmptyMail())
    const navigate = useNavigate()

    function onSaveMail(ev) {
        ev.preventDefault()
        const sentMail = { ...mail, folder: 'sent' }
        mailService.save(sentMail)
            .then(() => {
                const { subject, body, from, to } = mail
                if (!subject || !body || !from || !to) navigate('/mail/sent')
            })
            .catch(err => {
                console.log('Cannot save mail:', err)
                showErrorMsg('Missing Required fields')
            })

    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        setMail(prevMail => ({ ...prevMail, [field]: value }))
    }

    function onBack() {
        navigate('/mail')
    }

    return (
        <section className="mail-compose">
            <div className="header flex align-center space-between">
                <span>New Message</span>
                <button className="close-btn" onClick={onBack}>×</button>
            </div>
            <form className="compose-form" onSubmit={onSaveMail}>
                <input className="compose-input" type="email" name="to" placeholder="To" value={mail.to} onChange={handleChange} required />
                <input className="compose-input" type="text" name="subject" placeholder="Subject" value={mail.subject} onChange={handleChange} />
                <textarea className="compose-textarea" name="body" placeholder="" value={mail.body} onChange={handleChange} />
                <button className="send-btn">Send</button>
            </form>
        </section>
    )
}