import { MailPreview } from "./MailPreview.jsx"

const { Link } = ReactRouterDOM

export function MailList({ mails }) {
    return (
        <div className="mail-list container">
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
