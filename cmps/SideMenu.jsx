const { NavLink } = ReactRouterDOM

export function SideMenu({ isOpen }) {
    return (
        <aside className={`side-menu${isOpen ? ' open' : ' collapsed'}`}>
            <NavLink to="/mail/inbox" className="menu-item">
                <span className="material-symbols-outlined">inbox</span>
                {isOpen && <span>Inbox</span>}
            </NavLink>
            <NavLink to="/mail/sent" className="menu-item">
                <span className="material-symbols-outlined">send</span>
                {isOpen && <span>Sent</span>}
            </NavLink>
            {/* ...other items... */}
        </aside>
    )
}