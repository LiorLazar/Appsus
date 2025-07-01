const { Link, NavLink, useLocation } = ReactRouterDOM

export function AppHeader() {
    const location = useLocation()
    const isMail = location.pathname.includes("/mail");
    const isNote = location.pathname.includes("/note");
    return (
        <header className="app-header">
            <Link to="/">
                {
                    isMail ?
                        <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" />
                        : <div><span>Keep</span> <img src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png"></img></div>}
            </Link>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/mail">Mail</NavLink>
                <NavLink to="/note">Note</NavLink>
            </nav>
        </header>
    )
}
