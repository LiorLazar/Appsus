const { NavLink } = ReactRouterDOM

export function SideMenu({ isOpen, unreadCount = 0 }) {
    return (
        <aside className={`side-menu${isOpen ? '' : ' collapsed'}`}>
            <NavLink to="/mail/inbox" className="menu-item">
                <span className="material-symbols-outlined">inbox</span>
                <span>
                    Inbox
                    {isOpen && unreadCount > 0 && (
                        <span className="unread-count">{unreadCount}</span>
                    )}
                </span>
            </NavLink>
            <NavLink to="/mail/sent" className="menu-item">
                <span className="material-symbols-outlined">send</span>
                <span>Sent</span>
            </NavLink>
            {/* Add more items as needed */}
        </aside>
    )
}