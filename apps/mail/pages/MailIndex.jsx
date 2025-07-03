import { MailList } from "../cmps/MailList.jsx"
import { mailService } from "../services/mail.service.js"

const { useState, useEffect } = React
const { Outlet } = ReactRouterDOM

export function MailIndex({ setUnreadCount, filterFolder }) {
    const [mails, setMails] = useState(null)
    const [filterBy, setFilterBy] = useState(() => ({
        txt: '',
        folder: filterFolder || 'inbox'
    }))

    useEffect(() => {
        const filter = { ...filterBy }
        if (filterFolder) filter.folder = filterFolder
        mailService.query(filter)
            .then(mails => {
                // console.log('Filtered mails:', mails)
                setMails(mails)
                const unread = mails.filter(mail => !mail.isRead).length
                if (setUnreadCount) setUnreadCount(unread)
            })
            .catch(err => {
                console.log('err:', err)
            })
    }, [filterBy, setUnreadCount, filterFolder])

    useEffect(() => {
        setFilterBy(prev => ({ ...prev, folder: filterFolder || 'inbox' }))
    }, [filterFolder])

    // function onSetFilterBy(filterBy) {
    //     setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    // }

    if (!mails) return <div className="container">Loading...</div>
    return <section className="mail-index">
        <MailList mails={mails} />
        <Outlet />
    </section>
}