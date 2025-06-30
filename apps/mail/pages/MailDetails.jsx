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
            <h1>{mail.subject}</h1>
            {mail.from}
            {mail.to}
            {mail.body}
            <button>Forward</button>
            <button>Reply</button>
        </section>
    )
}