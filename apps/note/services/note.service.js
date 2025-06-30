import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const NOTE_KEY = 'noteDB'
_createNotes()

export const noteService = {
    query,
    get,
    remove,
    save,
    getEmptyNote,
    getDefaultFilter,
    getFilterFromSearchParams
}

function query(filterBy = {}) { 
    return storageService.query(NOTE_KEY)
        .then(notes => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                notes = notes.filter(note => regExp.test(note.title))
            }
            // if (filterBy.minNoteTxt) {
            //     notes = notes.filter(note => note.notetxt >= filterBy.minNoteTxt)
            // }
            // console.log(' notes:', notes)

            return notes
        })
}

function get(noteId) {
    return storageService.get(NOTE_KEY, noteId).then(_setNextPrevNoteId)
}

function remove(noteId) {
    // return Promise.reject('Oh No!')
    return storageService.remove(NOTE_KEY, noteId)
}

function save(note) {
    if (note.id) {
        return storageService.put(NOTE_KEY, note)
    } else {
        return storageService.post(NOTE_KEY, note)
    }
}

function getEmptyNote(title = '', notetxt = '') {
    return { title, notetxt }
}

function getDefaultFilter() {
    return { txt: '' }
}

function _createNotes() {
    let notes = utilService.loadFromStorage(NOTE_KEY)
    if (!notes || !notes.length) {
        notes = [
            _createNote('audu', 'testttt11111'),
            _createNote('fiak', 'testttt22222'),
            _createNote('budi', 'testttt33333'),
            _createNote('caca', 'testttt44444'),
            _createNote('doni', 'testttt55555')
        ]
        utilService.saveToStorage(NOTE_KEY, notes)
    }

    console.log('notes:', notes);
    
}

function _createNote(title, notetxt) {
    const note = getEmptyNote(title, notetxt)
    note.id = utilService.makeId()
    return note
}

function getFilterFromSearchParams(searchParams) {
    const txt = searchParams.get('txt') || ''
  
    return {
        txt
    }
}

function _setNextPrevNoteId(note) {
    return query().then((notes) => {
        const noteIdx = notes.findIndex((currNote) => currNote.id === note.id)
        const nextNote = notes[noteIdx + 1] ? notes[noteIdx + 1] : notes[0]
        const prevNote = notes[noteIdx - 1] ? notes[noteIdx - 1] : notes[notes.length - 1]
        note.nextNoteId = nextNote.id
        note.prevNoteId = prevNote.id
        return note
    })
}



