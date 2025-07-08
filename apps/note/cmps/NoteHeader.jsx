import { utilService } from "../../../services/util.service.js"
import { noteService } from "../services/note.service.js"
import { NoteFilter } from "./NoteFilter.jsx"

const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

export function NoteHeader() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(noteService.getFilterFromSearchParams(searchParams))
    const truthyFilter = utilService.getTruthyValues(filterBy)

    useEffect(() => {
        setSearchParams(truthyFilter)
    }, [filterBy])

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    return (
        <section className="note-header-bar">
            <NoteFilter
                defaultFilter={filterBy}
                onSetFilterBy={onSetFilterBy}
            />
        </section >
    )
}