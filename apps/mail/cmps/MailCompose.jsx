import { showErrorMsg } from "../../../services/event-bus.service.js"
import { mailService } from "../services/mail.service.js"

const { useState } = React
const { useNavigate } = ReactRouterDOM

export function MailCompose() {
    const [newMail, setNewMail] = useState(null)
    const navigate = useNavigate()

    function onSaveMail(ev) {
        ev.preventDefault()
        mailService.save(newMail)
            .then(() => {
                const { subject, body, from, to } = newMail
                if (!subject || !body || !from || !to) navigate('/mail')
            })
            .catch(err => {
                console.log('Cannot save mail:', err)
                showErrorMsg('Missing Required fields')
            })

    }

    const mailFields = [
        { name: 'from', type: 'text' },
        { name: 'to', type: 'text' },
        { name: 'subject', type: 'text' },
        { name: 'body', type: 'text' },
    ]

    return (
        <section className="mail-compose">
            <h1>Compose Mail</h1>
            <form onSubmit={onSaveMail}>
                {mailFields.map(field => {
                    return <label key={field.name} htmlFor={field.name}>
                        {field.name}
                        <input type={field.type} name={field.name} />
                    </label>
                })}
            </form>
        </section>
    )
}