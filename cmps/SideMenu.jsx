import { MailSideMenu } from "../apps/mail/cmps/MailSideMenu.jsx"
import { mailService } from "../apps/mail/services/mail.service.js"
import { utilService } from "../services/util.service.js"

const { NavLink, useLocation, useSearchParams } = ReactRouterDOM
const { useState, useEffect } = React

export function SideMenu({ isOpen }) {
    const location = useLocation()
    const isMail = location.pathname.includes('/mail')

    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(mailService.getFilterFromSearchParams(searchParams))
    const truthyFilter = utilService.getTruthyValues(filterBy)

    useEffect(() => {
        setSearchParams(truthyFilter)
    }, [filterBy])

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    if (isMail) return (
        <MailSideMenu
            isOpen={isOpen}
            defaultFilter={filterBy}
            onSetFilterBy={onSetFilterBy}
        />
    )
}