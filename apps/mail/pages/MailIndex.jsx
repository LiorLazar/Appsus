import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { utilService } from "../../../services/util.service.js"
import { MailList } from "../cmps/MailList.jsx"
import { mailService } from "../services/mail.service.js"

const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

export function MailIndex() {
    const [mails, setMails] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(mailService.getFilterFromSearchParams(searchParams))
    const truthyFilter = utilService.getTruthyValues(filterBy)

    useEffect(() => {
        console.log(filterBy)
        setSearchParams(truthyFilter)
        loadMails()
    }, [filterBy])

    useEffect(() => {
        setFilterBy(mailService.getFilterFromSearchParams(searchParams))
    }, [searchParams])

    function loadMails() {
        mailService.query(filterBy)
            .then(mails => setMails(mails))
            .catch(err => console.log('err:', err))
    }

    function loadMails() {
        mailService.query(filterBy)
            .then(setMails)
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Problem Load Mails')
            })
    }

    if (!mails) return <div className="container">Loading...</div>
    const unreadCounts = {
        primary: mails.filter(mail => mail.category === 'Primary' && !mail.isRead).length,
        promotions: mails.filter(mail => mail.category === 'Promotions' && !mail.isRead).length,
        social: mails.filter(mail => mail.category === 'Social' && !mail.isRead).length,
    }
    return (
        <section className="mail-index">
            {
                (filterBy.folder === 'inbox' || !filterBy.folder) && (
                    <div className="categories">
                        <div
                            className={`category ${filterBy.category === 'Primary' ? ' active' : ''}`}
                            onClick={() => setFilterBy(prev => ({ ...prev, folder: 'inbox', category: 'Primary' }))}
                        >
                            <span className="material-symbols-outlined">inbox</span>
                            Primary
                            {/* {unreadCounts.primary > 0 && (
                                <span className="category-badge primary">{unreadCounts.primary} new</span>
                            )} */}
                        </div>
                        <div
                            className={`category ${filterBy.category === 'Promotions' ? ' active' : ''}`}
                            onClick={() => setFilterBy(prev => ({ ...prev, folder: 'inbox', category: 'Promotions' }))}
                        >
                            <span className="material-symbols-outlined">local_offer</span>
                            Promotions
                            {/* {unreadCounts.promotions > 0 && (
                                <span className="category-badge promotions">{unreadCounts.promotions} new</span>
                            )} */}
                        </div>
                        <div
                            className={`category ${filterBy.category === 'Social' ? ' active' : ''}`}
                            onClick={() => setFilterBy(prev => ({ ...prev, folder: 'inbox', category: 'Social' }))}
                        >
                            <span className="material-symbols-outlined">group</span>
                            Social
                            {/* {unreadCounts.social > 0 && (
                                <span className="category-badge social">{unreadCounts.social} new</span>
                            )} */}
                        </div>
                    </div>
                )
            }
            <MailList mails={mails} setMails={setMails} />
        </section >
    )
}