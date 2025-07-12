import { utilService } from "../../../services/util.service.js";
import { mailService } from "../services/mail.service.js";
import { MailFilter } from "./MailFilter.jsx";

const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

export function MailHeader() {
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
            <img className="mail-logo" src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" />
            <MailFilter
                defaultFilter={filterBy}
                onSetFilterBy={onSetFilterBy}
            />
            <div className="header-icons flex">
              
            </div>
        </section >
    )
}