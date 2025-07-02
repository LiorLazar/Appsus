import { AppHeader } from './cmps/AppHeader.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { About } from './pages/About.jsx'
import { Home } from './pages/Home.jsx'
import { MailIndex } from './apps/mail/pages/MailIndex.jsx'
import { NoteIndex } from './apps/note/pages/NoteIndex.jsx'
import { MailDetails } from './apps/mail/pages/MailDetails.jsx'
import { MailCompose } from './apps/mail/cmps/MailCompose.jsx'
import { SideMenu } from './cmps/SideMenu.jsx'

const { useState } = React
const { Route, Routes } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

export function RootCmp() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)


    return <Router>
        <section className="root-cmp">
            <AppHeader onToggleMenu={() => setIsMenuOpen(prev => !prev)} />
            <div className="main-layout">
                <SideMenu isOpen={isMenuOpen} unreadCount={unreadCount} />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/mail" element={<MailIndex setUnreadCount={setUnreadCount} />}>
                            <Route path="compose" element={<MailCompose />} />
                        </Route>
                        <Route path="/mail/:mailId" element={<MailDetails />} />
                        <Route path="/note" element={<NoteIndex />} />
                    </Routes>
                </div>
            </div>
            <UserMsg />
        </section>
    </Router>
}