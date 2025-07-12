import { NoteAnimate } from '../services/NoteAnimate.js';
const { useEffect, useState } = React
const { useSearchParams } = ReactRouterDOM;

window.NoteAnimate = NoteAnimate;

const menuItems = [
    { name: 'Notes', icon: 'lightbulb', filter: { folder: 'notes' } },
    { name: 'Archive', icon: 'archive', filter: { folder: 'archive' } },
    { name: 'Bin', icon: 'delete', filter: { folder: 'bin' } }
];

export function NoteSideMenu({ isOpen }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [folder, setFolder] = useState(searchParams.get('folder') || 'notes');

    useEffect(() => {
        setTimeout(() => {
            const pinned = document.querySelector('.pinned-notes-container');
            const unpinned = document.querySelector('.unpinned-notes-container');
            if (NoteAnimate && typeof NoteAnimate.initMasonry === 'function') {
                if (pinned) NoteAnimate.initMasonry(pinned, { fastTransition: true });
                if (unpinned) NoteAnimate.initMasonry(unpinned, { fastTransition: true });
            }
        }, 300);
    }, [isOpen]);

    function handleMenuClick(item) {
        setFolder(item.filter.folder);
        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            folder: item.filter.folder
        });
    }

    function handleSidebarSearchChange(ev) {
        setSidebarSearch(ev.target.value);
        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            sidebarTxt: ev.target.value
        });
    }

    return (
        <aside className={`note-side-menu ${isOpen ? ' open' : ' collapsed'}`}>
            {menuItems.map(item => (
                <div
                    key={item.name}
                    className={`menu-item${folder === item.filter.folder ? ' active' : ''}`}
                    onClick={() => handleMenuClick(item)}
                >
                    <span className="material-symbols-outlined menu-item">{item.icon}</span>
                    <span className="item-name">{item.name}</span>
                </div>
            ))}
        </aside>
    )
}