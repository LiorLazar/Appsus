import { AppsMenu } from "../../../cmps/AppsMenu.jsx";
import { Settings } from "../../../cmps/Settings.jsx";
import { UserProfile } from "../../../cmps/UserProfile.jsx";
import { utilService } from "../../../services/util.service.js";
import { mailService } from "../services/mail.service.js";
import { MailFilter } from "./MailFilter.jsx";

const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

export function MailHeader() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(mailService.getFilterFromSearchParams(searchParams))
    const truthyFilter = utilService.getTruthyValues(filterBy)

    const [isAppsOpen, setIsAppsOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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
            <UserProfile />
            {/* <div className="avatar">
                <img src="https://cdn.vectorstock.com/i/750p/51/99/user-avatar-icon-flat-style-vector-3125199.avif" alt="avatar" />
            </div> */}
            <span className="material-symbols-outlined btn"
                onClick={() => setIsAppsOpen(prev => !prev)}
            >apps</span>
            <AppsMenu isOpen={isAppsOpen} onClose={() => setIsAppsOpen(false)} />
            <span className="material-symbols-outlined btn"
                onClick={() => setIsSettingsOpen(prev => !prev)}
            >settings</span>
            <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </section >
    )
}