import { utilService } from "../../../services/util.service.js"
import { noteService } from "../services/note.service.js"
import { NoteFilter } from "./NoteFilter.jsx"
import { AppsMenu } from "../../../cmps/AppsMenu.jsx";
import { Settings } from "../../../cmps/Settings.jsx"

const { useState, useEffect, Fragment } = React
const { useSearchParams, useNavigate } = ReactRouterDOM

export function NoteHeader() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterBy, setFilterBy] = useState(noteService.getFilterFromSearchParams(searchParams))
    const truthyFilter = utilService.getTruthyValues(filterBy)
    const [isAppsOpen, setIsAppsOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [showCheckIcon, setShowCheckIcon] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setSearchParams(truthyFilter)
    }, [filterBy])

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    useEffect(() => {
        function handleFolderSelected(e) {
            const folder = e.detail.folder || 'notes';
            if (typeof onSetFilterBy === 'function') {
                onSetFilterBy({ folder });
            }
        }
        window.addEventListener('note-folder-selected', handleFolderSelected);
        return () => window.removeEventListener('note-folder-selected', handleFolderSelected);
    }, [onSetFilterBy]);

    function handleRefresh() {
        setIsRefreshing(true)
        setShowCheckIcon(false)
        window.dispatchEvent(new Event('refreshNotes'))
        setTimeout(() => {
            setIsRefreshing(false)
            setShowCheckIcon(true)
            setTimeout(() => setShowCheckIcon(false), 1200)
        }, 1200)
    }

    return (
        <Fragment>
            <div className="keep-logo" onClick={() => navigate('/note')}>
                <img src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" style={{ height: 40, width: 40, marginRight: 8 }} />
                <span className="keep-title">Keep</span>
            </div>
            <section className="note-header-bar">
                <NoteFilter
                    defaultFilter={filterBy}
                    onSetFilterBy={onSetFilterBy}
                />
            </section >
            <div className="header-bar note-header-ba flex">
                <div className="header-icons note-header-icons">
                    {isRefreshing ? (
                        <span className="material-symbols-outlined btn loading-spinner" style={{ animation: 'spin 1.2s linear infinite' }}>progress_activity</span>
                    ) : showCheckIcon ? (
                        <span className="material-symbols-outlined btn">cloud_done</span>
                    ) : (
                        <span className="material-symbols-outlined btn" onClick={handleRefresh}>refresh</span>
                    )}
                    <span className="material-symbols-outlined btn"
                        onClick={() => setIsSettingsOpen(prev => !prev)}
                    >settings</span>
                    <span className="material-symbols-outlined btn apps-btn"
                        onClick={() => setIsAppsOpen(prev => !prev)}
                    >apps</span>
                    <div className="avatar">
                        <img src="https://cdn.vectorstock.com/i/750p/51/99/user-avatar-icon-flat-style-vector-3125199.avif" alt="avatar" />
                    </div>
                </div>
                <AppsMenu isOpen={isAppsOpen} onClose={() => setIsAppsOpen(false)} />
                <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            </div>
        </Fragment>
    )
}

/* Add this CSS to your NoteHeader.css or main.css for the spinner effect:
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/