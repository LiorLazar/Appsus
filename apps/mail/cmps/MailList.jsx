import { MailPreview } from "./MailPreview.jsx"

const { Link } = ReactRouterDOM

export function MailList({ mails }) {
    return (
        <div className="mail-list container">
            <Link to="compose" className="compose-btn">+ Compose</Link>
            {mails.map(mail =>
                <Link key={mail.id} to={mail.id}>
                    <section >
                        <MailPreview mail={mail} />
                    </section>
                </Link>
            )}
        </div>
    )
}
