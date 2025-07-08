import { utilService } from "../../../services/util.service.js";
import { mailService } from "../services/mail.service.js";
import { MailAdvancedSearch } from "./MailAdvancedSearch.jsx";
import { MailFilter } from "./MailFilter.jsx";

const { useState, useEffect } = React
const { useLocation, useSearchParams } = ReactRouterDOM

export function MailHeader() {
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(mailService.getFilterFromSearchParams(searchParams))
    const truthyFilter = utilService.getTruthyValues(filterBy)


    useEffect(() => {
        setSearchParams(truthyFilter)
    }, [filterBy])

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    return (
        <section className="mail-header-bar">
            <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" />
            <MailFilter
                defaultFilter={filterBy}
                onSetFilterBy={onSetFilterBy}
            />
            <div className="header-icons flex">
                <span className="material-symbols-outlined btn">help</span>
                <span className="material-symbols-outlined btn">settings</span>
                <div className="avatar">
                    <img src="https://cdn.vectorstock.com/i/750p/51/99/user-avatar-icon-flat-style-vector-3125199.avif" alt="avatar" />
                </div>
            </div>
        </section >
    )
}