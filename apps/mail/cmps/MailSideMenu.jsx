const { NavLink } = ReactRouterDOM

export function MailSideMenu({ isOpen, unreadCount = 0 }) {
    return (
        <aside className={`side-menu${isOpen ? ' open' : ' collapsed'}`}>
            <NavLink to="/mail/compose" className="compose-btn">
                <span className="material-symbols-outlined">edit</span>
                <span>Compose</span>
            </NavLink>
            <NavLink to="/mail/inbox" className="menu-item">
                <span className="material-symbols-outlined">inbox</span>
                <span>Inbox</span>
                {isOpen && unreadCount > 0 && (
                    <span className="unread-count">{unreadCount}</span>
                )}
            </NavLink>
            <NavLink to="/mail/sent" className="menu-item">
                <span className="material-symbols-outlined">send</span>
                <span>Sent</span>
            </NavLink>
        </aside>
    )

}