import { MailPreview } from "./MailPreview.jsx"

export function MailList({ mails }) {
    return (
        <div className="mail-list container">
            {mails.map(mail =>
                <section key={mail.id}>
                    <MailPreview mail={mail} />
                    {/* {console.log(mail)} */}
                </section>
            )}
        </div>
    )
}
