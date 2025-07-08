import { MailAdvancedSearch } from "../apps/mail/cmps/MailAdvancedSearch.jsx";
import { MailHeader } from "../apps/mail/cmps/MailHeader.jsx";
import { NoteHeader } from "../apps/note/cmps/NoteHeader.jsx";
import { AppsMenu } from "./AppsMenu.jsx";

const { useState, Fragment } = React
const { Link, NavLink, useLocation } = ReactRouterDOM

export function AppHeader({ onToggleMenu }) {
    const location = useLocation()
    const isMail = location.pathname.includes("/mail")
    const isNote = location.pathname.includes("/note")

    const [isAppsOpen, setIsAppsOpen] = useState(false)

    return (
        <header className={isNote ? "note-header app-header" : "app-header"}>
            <span className="material-symbols-outlined burger-manu btn" onClick={onToggleMenu} style={{ cursor: 'pointer' }}>dehaze</span>
            <Link to="/" className="logo">
                <img className={isNote ? "main-logo note-main-logo" : "main-logo"} src="https://media1.tenor.com/m/gMay0AorbjgAAAAd/a-google-style.gif"></img>
            </Link>
            {isMail && <MailHeader />}
            {isNote && <NoteHeader />}
            {isMail &&
                <Fragment>
                    <div className="header-bar">
                        <div className="header-icons">
                            <span className="material-symbols-outlined btn">help</span>
                            <span className="material-symbols-outlined btn">settings</span>
                            <span className="material-symbols-outlined btn"
                                onClick={() => setIsAppsOpen(prev => !prev)}
                            >apps</span>
                            <div className="avatar">
                                <img src="https://cdn.vectorstock.com/i/750p/51/99/user-avatar-icon-flat-style-vector-3125199.avif" alt="avatar" />
                            </div>
                        </div>
                        <AppsMenu isOpen={isAppsOpen} onClose={() => setIsAppsOpen(false)} />
                    </div>
                    <nav>
                        <NavLink to="/about" className="btn2">About</NavLink>
                    </nav>
                </Fragment>
            }
        </header >
    )
}