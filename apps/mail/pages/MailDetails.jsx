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
        navigate('/mail/inbox')
    }

    if (!mail) return <div>Loading...</div>
    return (
        <section className="mail-details container">
            <section className="header">
                <div className="mail-subject">{mail.subject}</div>
            </section>
            <div className="sender-details">
                <span className="mail-from">{mail.from}</span>
                <span className="mail-date">{mail.sentAt}</span>
            </div>
            <span className="mail-to">{mail.to}</span>
            <p className="mail-body">{mail.body}</p>
            <div className="buttons-container">
                <button onClick={onBack}>Back</button>
                <button>
                    <span className="material-symbols-outlined">forward</span>
                    Forward
                </button>
                <button>
                    <span className="material-symbols-outlined">reply</span>
                    Reply
                </button>
            </div>
        </section>
    )
}