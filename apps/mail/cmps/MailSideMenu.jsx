const { NavLink } = ReactRouterDOM
const { useState } = React

const folders = [
    { name: 'Inbox', icon: 'inbox' },
    { name: 'Starred', icon: 'star' },
    { name: 'Snoozed', icon: 'schedule' },
    { name: 'Important', icon: 'label' },
    { name: 'Sent', icon: 'send' },
    { name: 'Drafts', icon: 'draft' }
]

const categories = [
    { name: 'Social', icon: 'group' },
    { name: 'Updates', icon: 'info' },
    { name: 'Forums', icon: 'forum' },
    { name: 'Promotions', icon: 'local_offer' },
]


export function MailSideMenu({ isOpen, unreadCount = 0 }) {
    const [showMore, setShowMore] = useState(false)
    const [showCategories, setShowCategories] = useState(false)

    return (
        <aside className={`side-menu${isOpen ? ' open' : ' collapsed'}`}>
            <NavLink to="/mail/compose" className="compose-btn">
                <span className="material-symbols-outlined">edit</span>
                <span>Compose</span>
            </NavLink>
            {folders.map(folder =>
                <NavLink to={`/mail/${folder.name}`} className="menu-item">
                    <span className="material-symbols-outlined">{folder.icon}</span>
                    <span>{folder.name}</span>
                </NavLink>
            )}
            {isOpen && (
                <div>
                    <div
                        className="menu-item categories-label"
                        tabIndex={0}
                        onClick={() => setShowCategories(open => !open)}
                        title={showCategories ? "Collapse label: Categories" : "Expand label: Categories"}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{
                                transform: showCategories ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s'
                            }}
                        >
                            chevron_right
                        </span>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', marginRight: '8px', color: '#5f6368' }}>
                            label
                        </span>
                        <span>Categories</span>
                    </div>
                    {showCategories && categories.map(folder =>
                        <NavLink key={folder.name} to={`/mail/${folder.name}`} className="menu-item category-link">
                            <span className="material-symbols-outlined">{folder.icon}</span>
                            <span className="category-name">{folder.name}</span>
                        </NavLink>
                    )}
                </div>
            )}
            <div
                className={`menu-item more-btn${showMore ? ' open' : ''}`}
                onClick={() => setShowMore(m => !m)}
                tabIndex={0}
                style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', borderRadius: '24px', margin: '4px 8px', padding: '0 16px', height: '40px' }}
            >
                <span
                    className="material-symbols-outlined"
                    style={{
                        transform: showMore ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                    }}
                >expand_more</span>
                <span style={{ marginLeft: '8px' }}>{showMore ? 'Less' : 'More'}</span>
            </div>
            {showMore && categories.map(folder =>
                <NavLink key={folder.name} to={`/mail/${folder.name}`} className="menu-item">
                    <span className="material-symbols-outlined">{folder.icon}</span>
                    <span className="more">{folder.name}</span>
                </NavLink>
            )}
        </aside>
    )

}