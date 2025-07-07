import { MailSideMenu } from "../apps/mail/cmps/MailSideMenu.jsx"

const { NavLink, useLocation } = ReactRouterDOM

export function SideMenu({ isOpen, unreadCount = 0 }) {
    const location = useLocation()
    const isMail = location.pathname.includes('/mail')

    if (isMail) return (
        <MailSideMenu
            isOpen={isOpen}
            unreadCount={unreadCount}
        />
    )
}