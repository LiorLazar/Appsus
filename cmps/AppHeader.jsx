import { MailHeader } from "../apps/mail/cmps/MailHeader.jsx";
import { AppsMenu } from "./AppsMenu.jsx";

const { useState, useEffect } = React
const { Link, NavLink, useLocation, useSearchParams } = ReactRouterDOM

export function AppHeader({ onToggleMenu }) {
    const location = useLocation()
    const isMail = location.pathname.includes("/mail")
    const isNote = location.pathname.includes("/note")

    const [isAppsOpen, setIsAppsOpen] = useState(false)

    return (
        <header className="app-header">
            <span className="material-symbols-outlined burger-manu btn" onClick={onToggleMenu} style={{ cursor: 'pointer' }}>dehaze</span>
            <Link to="/" className="logo">
                <img className="main-logo" src="https://media1.tenor.com/m/gMay0AorbjgAAAAd/a-google-style.gif"></img>
            </Link>
            {isMail ? (
                <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" />
            ) : isNote ? (
                <div className="keep-logo" onClick={() => navigate('/note')}>
                    <img src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" style={{ height: 40, width: 40, marginRight: 8 }} />
                    <span className="keep-title">Keep</span>
                </div>
            ) : (
                null
            )}

            <div className="header-bar">
                {isMail && <MailHeader />}
                <div className="header-icons">
                    <span className="material-symbols-outlined btn">help</span>
                    <span className="material-symbols-outlined btn">settings</span>
                    <span className="material-symbols-outlined btn"
                        onClick={() => setIsAppsOpen(prev => !prev)}
                    >apps</span>
                    <img className="avatar" src="https://cdn.vectorstock.com/i/750p/51/99/user-avatar-icon-flat-style-vector-3125199.avif" alt="avatar" />
                </div>
                <AppsMenu isOpen={isAppsOpen} onClose={() => setIsAppsOpen(false)} />
            </div>


            <nav>
                <NavLink to="/about" className="btn2">About</NavLink>
            </nav>
        </header >
    )
}