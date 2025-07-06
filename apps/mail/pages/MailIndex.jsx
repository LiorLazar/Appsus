import { showSuccessMsg } from "../../../services/event-bus.service.js"
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
    const [allInboxMails, setAllInboxMails] = useState([])

    useEffect(() => {
        mailService.query({ folder: 'inbox' }).then(setAllInboxMails)
    }, [])

    useEffect(() => {
        const filter = { ...filterBy }
        if (filterFolder) filter.folder = filterFolder
        mailService.query(filter)
            .then(mails => {
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

    if (!mails) return <div className="container">Loading...</div>
    const unreadCounts = {
        primary: allInboxMails.filter(mail => mail.label === 'Primary' && !mail.isRead).length,
        promotions: allInboxMails.filter(mail => mail.label === 'Promotions' && !mail.isRead).length,
        social: allInboxMails.filter(mail => mail.label === 'Social' && !mail.isRead).length,
    }
    return <section className="mail-index">
        {(filterFolder === 'inbox' || !filterFolder) && (
            <div className="labels">
                <div
                    className={`label${filterBy.label === 'Primary' ? ' active' : ''}`}
                    onClick={() => setFilterBy(prev => ({ ...prev, folder: 'inbox', label: 'Primary' }))}
                >
                    <span className="material-symbols-outlined">inbox</span>
                    Primary
                </div>
                <div
                    className={`label${filterBy.label === 'Promotions' ? ' active' : ''}`}
                    onClick={() => setFilterBy(prev => ({ ...prev, folder: 'inbox', label: 'Promotions' }))}
                >
                    <span className="material-symbols-outlined">local_offer</span>
                    Promotions
                    {unreadCounts.promotions > 0 && (
                        <span className="label-badge promotions">{unreadCounts.promotions} new</span>
                    )}
                </div>
                <div
                    className={`label${filterBy.label === 'Social' ? ' active' : ''}`}
                    onClick={() => setFilterBy(prev => ({ ...prev, folder: 'inbox', label: 'Social' }))}
                >
                    <span className="material-symbols-outlined">group</span>
                    Social
                    {unreadCounts.social > 0 && (
                        <span className="label-badge social">{unreadCounts.social} new</span>
                    )}
                </div>
            </div>
        )}
        <MailList mails={mails} setMails={setMails} />
        <Outlet />
    </section>
}