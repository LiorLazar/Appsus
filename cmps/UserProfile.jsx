const { useState } = React;

export function UserProfile() {
    const [isOpen, setIsOpen] = useState(false);

    function handleAvatarClick() {
        setIsOpen(true);
    }

    function handleClose() {
        setIsOpen(false);
    }

    return (
        <div className="user-profile-container">
            <div className="avatar" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                <img src="https://cdn.vectorstock.com/i/750p/51/99/user-avatar-icon-flat-style-vector-3125199.avif" alt="avatar" />
            </div>
            {isOpen && (
                <div className="user-modal-overlay" onClick={handleClose}>
                    <div className="user-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={handleClose}>×</button>
                        <div className="user-modal-header">
                            <div className="user-modal-avatars">
                                <img src="assets/img/profile-image-lior.jpeg" alt="lior avatar" className="user-avatar-img" />
                                <img src="assets/img/profile-image-golan.jpeg" alt="golan avatar" className="user-avatar-img" />
                            </div>
                            <div className="user-modal-email">Lior-Golan@appsus.com</div>
                        </div>
                        <div className="user-modal-greeting">Hi, lior & golan!</div>
                        <button className="manage-account-btn">Manage your Appsus Account</button>
                        <div className="user-modal-actions">
                            <button className="signout-btn">Sign out</button>
                        </div>
                        <div className="user-modal-footer">
                            Privacy policy · Terms of Service
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}