const { NavLink } = ReactRouterDOM

export function SideMenu() {
    return (
        <aside className="side-menu">
            <NavLink to="/mail/inbox" className="menu-item">
                <span className="material-symbols-outlined">inbox</span>
                <span>Inbox</span>
            </NavLink>
            <NavLink to="/mail/sent" className="menu-item">
                <span className="material-symbols-outlined">send</span>
                <span>Sent</span>
            </NavLink>
            <NavLink to="/mail/drafts" className="menu-item">
                <span className="material-symbols-outlined">drafts</span>
                <span>Drafts</span>
            </NavLink>
            {/* Add more items as needed */}
        </aside>
    )
}