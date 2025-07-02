import { AppsMenu } from "./AppsMenu.jsx";

const { useState } = React
const { Link, NavLink, useLocation } = ReactRouterDOM

export function AppHeader() {
    const location = useLocation()
    const isMail = location.pathname.includes("/mail");
    const isNote = location.pathname.includes("/note");

    const [isAppsOpen, setIsAppsOpen] = useState(false)

    return (
        <header className="app-header">
            <span className="material-symbols-outlined">dehaze</span>
            <Link to="/" className="logo">
                <img className="main-logo" src="https://media1.tenor.com/m/gMay0AorbjgAAAAd/a-google-style.gif"></img>
            </Link>
            {isMail ? (
                <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" />
            ) : isNote ? (
                <div className="keep-logo">
                    <span>Keep</span>
                    <img src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" />
                </div>
            ) : (
                null
            )}

            <div className="header-bar">
                {(isMail || isNote) && (
                    <div className="search-bar">
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            placeholder={isMail ? "Search mail" : "Search note"}
                        />
                        {isMail && (
                            <span className="material-symbols-outlined">tune</span>
                        )}
                    </div>
                )}
                <div className="header-icons">
                    <span className="material-symbols-outlined">help</span>
                    <span className="material-symbols-outlined">settings</span>
                    <span className="material-symbols-outlined"
                        onClick={() => setIsAppsOpen(prev => !prev)}
                    >apps</span>
                    <img className="avatar" src="https://cdn.vectorstock.com/i/750p/51/99/user-avatar-icon-flat-style-vector-3125199.avif" alt="avatar" />
                </div>
                <AppsMenu isOpen={isAppsOpen} onClose={() => setIsAppsOpen(false)} />
            </div>


            <nav>
                {/* <NavLink to="/">Home</NavLink> */}
                <NavLink to="/about">About</NavLink>
                {/* <NavLink to="/mail">Mail</NavLink>
                <NavLink to="/note">Note</NavLink> */}
            </nav>
        </header >
    )
}