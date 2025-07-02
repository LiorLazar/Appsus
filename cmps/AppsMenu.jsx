
const { Link } = ReactRouterDOM

export function AppsMenu({ isOpen, onClose }) {
    if (!isOpen) return null
    return (
        <div className="apps-menu" onClick={onClose}>
            <div className="apps-menu-grid" onClick={ev => ev.stopPropagation()}>
                <Link to="/mail">
                    <span className="material-symbols-outlined">mail</span>
                    <span>Gmail</span>
                </Link>
                <Link to="/note">
                    <span className="material-symbols-outlined">lightbulb</span>
                    <span>Keep</span>
                </Link>
            </div>
        </div>
    )
}