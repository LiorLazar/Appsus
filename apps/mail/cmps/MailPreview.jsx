export function MailPreview({ mail }) {
    console.log('mail', mail)

    const { from, subject, sentAt } = mail
    return (
        <section className="mail-preview flex space-between">
            <div>{from}</div>
            <div>{subject}</div>
            <div>{sentAt}</div>
        </section>
    )
}