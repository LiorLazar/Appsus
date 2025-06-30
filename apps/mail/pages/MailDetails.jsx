import { mailService } from "../services/mail.service.js"

const { useParams, useNavigate, useLocation } = ReactRouterDOM
const { useState, useEffect } = React

export function MailDetails() {
    const [mail, setMail] = useState(null)
    const { mailId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => loadMail(), [mailId])

    function loadMail() {
        mailService.get(mailId)
            .then(setMail)
            .catch(err => {
                console.log('Cannot get mail:', err)
            })
    }

    function onBack() {
        navigate('/mail')
    }

    if (!mail) return <div>Loading...</div>
    return (
        <section className="mail-details container">
            <section className="header">
                <span className="mail-from">{mail.from}</span>
                <span className="mail-to">{mail.to}</span>
                <span className="mail-date">{mail.sentAt}</span>
            </section>
            <div className="mail-subject">{mail.subject}</div>
            <div className="mail-body">{mail.body}</div>
            <button>Forward</button>
            <button>Reply</button>
        </section>
    )
}