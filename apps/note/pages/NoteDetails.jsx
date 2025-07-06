import { noteService } from '../services/note.service.js'

export function NoteDetails() {
    const { noteId } = ReactRouterDOM.useParams()
    const [note, setNote] = React.useState(null)
    const [error, setError] = React.useState(null)

    React.useEffect(() => {
        noteService.get(noteId)
            .then(note => {
                setNote(note)
                console.log('Note loaded:', note)
            })
            .catch(err => {
                console.error('Failed to load note', err)
                setError('Failed to load note')
            })
    }, [noteId])

    function renderNote(note) {
        if (!note) return null;
        
        switch (note.type) {
            case 'NoteTxt': return (<NoteTxt note={note} className="details" />)
            case 'NoteImg': return (<NoteImg note={note} className="details" />)
            case 'NoteTodos': return (<NoteTodos note={note} className="details" />)
            case 'NoteVideo': return (<NoteVideo note={note} className="details" />)
            default:
                return null;
        }
    }

    if (error) return <div className="error">{error}</div>
    if (!note) return <div>Loading...</div>

    return (
        <section className="note-details">
            <h1>Note Details</h1>
            <div className="note-container">
                {renderNote(note)}
            </div>
        </section>
    )
}