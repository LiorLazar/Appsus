import { MailList } from "../cmps/MailList.jsx"
import { mailService } from "../services/mail.service.js"

const { useState, useEffect } = React
const { Outlet } = ReactRouterDOM

export function MailIndex({ setUnreadCount }) {
    const [mails, setMails] = useState(null)
    const [filterBy, setFilterBy] = useState(mailService.getDefaultFilter())

    useEffect(() => {
        mailService.query(filterBy)
            .then(mails => {
                setMails(mails)
                // Calculate unread count and update parent
                const unread = mails.filter(mail => !mail.isRead).length
                setUnreadCount(unread)
            })
            .catch(err => {
                console.log('err:', err)
            })
    }, [filterBy, setUnreadCount])

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    if (!mails) return <div className="container">Loading...</div>
    return <section className="mail-index">
        <MailList mails={mails} />
        <Outlet />
    </section>
}