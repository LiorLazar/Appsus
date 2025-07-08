import { utilService } from "../../../services/util.service.js"

const { NavLink } = ReactRouterDOM
const { useState, useEffect, useRef } = React

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

const options = [
    { name: 'Chats', icon: 'chat' },
    { name: 'Scheduled', icon: 'schedule_send' },
    { name: 'All Mail', icon: 'stacked_email' },
    { name: 'Spam', icon: 'report' },
    { name: 'Bin', icon: 'delete' },
    { name: 'Manage Labels', icon: 'settings' },
]
export function MailSideMenu({ isOpen, defaultFilter, onSetFilterBy }) {
    const [showMore, setShowMore] = useState(false)
    const [showCategories, setShowCategories] = useState(false)

    const [filterByToEdit, setFilterByToEdit] = useState({ ...defaultFilter })
    const onSetFilterByDebounce = useRef(utilService.debounce(onSetFilterBy, 500)).current

    useEffect(() => {
        onSetFilterByDebounce(filterByToEdit)
    }, [filterByToEdit])

    function handleFolderClick(folderName) {
        console.log('handleFolderClick called with:', folderName)
        console.log('Is "All Mail"?', folderName === 'All Mail')

        if (folderName === 'All Mail') {
            console.log('Setting filter for All Mail')
            setFilterByToEdit(prevFilter => {
                const newFilter = {
                    ...prevFilter,
                    folder: '',
                    category: ''
                }
                console.log('New filter for All Mail:', newFilter)
                return newFilter
            })
        } else {
            console.log('Setting filter for regular folder:', folderName.toLowerCase())
            setFilterByToEdit(prevFilter => ({
                ...prevFilter,
                folder: folderName.toLowerCase(),
                category: ''
            }))
        }
    }

    function handleCategoryClick(categoryName) {
        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            category: categoryName,
            folder: 'inbox'
        }))
    }

    return (
        <aside className={`side-menu${isOpen ? ' open' : ' collapsed'}`}>
            <NavLink to="/mail/compose" className="compose-btn">
                <span className="material-symbols-outlined">edit</span>
                <span>Compose</span>
            </NavLink>
            {folders.map(folder =>
                <div
                    key={folder.name}
                    className="menu-item"
                    onClick={() => handleFolderClick(folder.name)}
                >
                    <span className="material-symbols-outlined">{folder.icon}</span>
                    <span>{folder.name}</span>
                </div>
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
                    {showCategories && categories.map(category =>
                        <div
                            key={category.name}
                            className="menu-item category-link"
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            <span className="material-symbols-outlined">{category.icon}</span>
                            <span className="category-name">{category.name}</span>
                        </div>
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
            {showMore && options.map(option =>
                <div
                    key={option.name}
                    className="menu-item"
                    onClick={() => handleFolderClick(option.name)}
                >
                    <span className="material-symbols-outlined">{option.icon}</span>
                    <span className="more">{option.name}</span>
                </div>
            )}
        </aside>
    )

}