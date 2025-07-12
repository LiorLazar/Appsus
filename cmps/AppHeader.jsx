import { MailAdvancedSearch } from "../apps/mail/cmps/MailAdvancedSearch.jsx";
import { MailHeader } from "../apps/mail/cmps/MailHeader.jsx";
import { NoteHeader } from "../apps/note/cmps/NoteHeader.jsx";
import { AppsMenu } from "./AppsMenu.jsx";
import { Settings } from "./Settings.jsx";

const { useState, Fragment } = React
const { Link, NavLink, useLocation } = ReactRouterDOM

export function AppHeader({ onToggleMenu }) {
    const location = useLocation()
    const isMail = location.pathname.includes("/mail")
    const isNote = location.pathname.includes("/note")

    if (!isMail && !isNote) return null
    return (
        <header className={isNote ? "note-header app-header" : "app-header"}>
            {(isMail || isNote) &&
                <span className="material-symbols-outlined burger-manu btn" onClick={onToggleMenu} style={{ cursor: 'pointer' }}>dehaze</span>
            }
            <Link to="/" className="logo">
                <img className={isNote ? "main-logo note-main-logo" : "main-logo"} src="assets/img/appsus.png" alt="Appsus logo" />
            </Link>
            {isMail && <MailHeader />}
            {isNote && <NoteHeader />}
        </header >
    )
}