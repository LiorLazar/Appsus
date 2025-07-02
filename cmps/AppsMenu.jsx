
const { Link } = ReactRouterDOM

export function AppsMenu({ isOpen, onClose }) {
    if (!isOpen) return null
    return (
        <div className="apps-menu" onClick={onClose}>
            <div className="apps-menu-grid" onClick={ev => ev.stopPropagation()}>
                <Link to="/mail">
                    <span className="material-symbols-outlined">mail</span>
                </Link>
                <div>Gmail</div>
                <Link to="/note">
                    <span className="material-symbols-outlined">lightbulb</span>
                </Link>
                <div>Keep</div>
            </div>
        </div>
    )
}