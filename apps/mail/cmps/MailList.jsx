import { MailPreview } from "./MailPreview.jsx"

const { Link } = ReactRouterDOM

export function MailList({ mails }) {
    const unreadCount = mails.filter(mail => !mail.isRead).length

    return (
        <div className="mail-list container">
            <div>Unread Mails: {unreadCount}</div>
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
