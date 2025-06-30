export function MailList({ mails }) {
    return (
        <ul className="mail-list container">
            {mails.map(mail => {
                <li key={mail.id}>
                </li>
            })}
        </ul>
    )
}
