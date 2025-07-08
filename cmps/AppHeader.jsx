import { MailAdvancedSearch } from "../apps/mail/cmps/MailAdvancedSearch.jsx";
import { MailHeader } from "../apps/mail/cmps/MailHeader.jsx";
import { NoteHeader } from "../apps/note/cmps/NoteHeader.jsx";
import { AppsMenu } from "./AppsMenu.jsx";

const { useState } = React
const { Link, NavLink, useLocation } = ReactRouterDOM

export function AppHeader({ onToggleMenu }) {
    const location = useLocation()
    const isMail = location.pathname.includes("/mail")
    const isNote = location.pathname.includes("/note")

    const [isAppsOpen, setIsAppsOpen] = useState(false)

    return (
        <header className={isNote ? "note-header app-header" : "app-header"}>
            {isMail || isNote &&
                <span className="material-symbols-outlined burger-manu btn" onClick={onToggleMenu} style={{ cursor: 'pointer' }}>dehaze</span>
            }
            <Link to="/" className="logo">
                <img className={isNote ? "main-logo note-main-logo" : "main-logo"} src="https://media1.tenor.com/m/gMay0AorbjgAAAAd/a-google-style.gif"></img>
            </Link>
            {isMail && <MailHeader />}
            {isNote && <NoteHeader />}
            <div className="header-bar">
                <span className="material-symbols-outlined btn"
                    onClick={() => setIsAppsOpen(prev => !prev)}
                >apps</span>
                <AppsMenu isOpen={isAppsOpen} onClose={() => setIsAppsOpen(false)} />
            </div>
            <nav>
                <NavLink to="/about" className="btn2">About</NavLink>
            </nav>
        </header >
    )
}