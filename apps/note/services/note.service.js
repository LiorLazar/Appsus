import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const NOTE_KEY = 'noteDB'
_createNotes()

export const noteService = {
    query,
    get,
    remove,
    save,
    getDefaultFilter,
    getFilterFromSearchParams,
    addNote,
    getEmbedUrl,
    formatDateTime,
}

function query(filterBy = {}) {
    return storageService.query(NOTE_KEY)
        .then(notes => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                notes = notes.filter(note =>
                    (note.info.title && regExp.test(note.info.title)) ||
                    (note.info.txt && regExp.test(note.info.txt)) ||
                    (note.info.todos && note.info.todos.some(todo => regExp.test(todo.txt)))
                )
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

function getDefaultFilter() {
    return { txt: '' }
}

function _createNotes() {
    let notes = utilService.loadFromStorage(NOTE_KEY)
    if (!notes || !notes.length) {
        notes = [
            {
                id: 'n101',
                createdAt: 1112222,
                type: 'NoteTxt',
                isPinned: true,
                style: {
                    backgroundColor: '#f39f76' // google keep orange
                },
                info: {
                    txt: 'Fullstack Me Baby!'
                }
            },
            {
                id: 'n102',
                createdAt: 1112223,
                type: 'NoteImg',
                isPinned: false,
                info: {
                    url: 'https://picsum.photos/200/200',
                    title: 'Bobi and Me'
                },
                style: {
                    backgroundColor: '#faafa8' // google keep peach
                }
            },
            {
                id: 'n103',
                createdAt: 1112224,
                type: 'NoteTodos',
                isPinned: false,
                info: {
                    title: 'Get my stuff together',
                    todos: [
                        { txt: 'Driving license', doneAt: null },
                        { txt: 'Coding power', doneAt: 187111111 }
                    ]
                }
            },
            {
                id: 'n104',
                createdAt: 1112225,
                type: 'NoteTxt',
                isPinned: false,
                style: {
                    backgroundColor: '#fff8b8' // google keep yellow
                },
                info: {
                    txt: 'Learn React!'
                }
            },
            {
                id: 'n105',
                createdAt: 1112226,
                type: 'NoteImg',
                isPinned: true,
                info: {
                    url: 'https://picsum.photos/220/150',
                    title: 'Vacation Time'
                },
                style: {
                    backgroundColor: '#fff8b8' // google keep yellow
                }
            },
            {
                id: 'n106',
                createdAt: 1112227,
                type: 'NoteTodos',
                isPinned: false,
                info: {
                    title: 'Shopping List',
                    todos: [
                        { txt: 'Milk', doneAt: null },
                        { txt: 'Eggs', doneAt: null },
                        { txt: 'Bread', doneAt: 187111111 }
                    ]
                }
            },
            {
                id: 'n107',
                createdAt: 1112228,
                type: 'NoteTxt',
                isPinned: true,
                style: {
                    backgroundColor: '#d3bfdb' // google keep purple
                },
                info: {
                    txt: 'Master JavaScript!'
                }
            },
            {
                id: 'n108',
                createdAt: 1112229,
                type: 'NoteImg',
                isPinned: false,
                info: {
                    url: 'https://picsum.photos/170/200',
                    title: 'Nature Walk'
                },
                style: {
                    backgroundColor: '#f39f76' // google keep orange
                }
            },
            {
                id: 'n109',
                createdAt: 1112230,
                type: 'NoteTodos',
                isPinned: false,
                info: {
                    title: 'Workout Plan',
                    todos: [
                        { txt: 'Morning Run', doneAt: null },
                        { txt: 'Yoga', doneAt: null },
                        { txt: 'Strength Training', doneAt: 187111111 }
                    ]
                }
            },
            {
                id: 'n110',
                createdAt: 1112231,
                type: 'NoteTxt',
                isPinned: false,
                style: {
                    backgroundColor: '#f6e2dd' // google keep pink
                },
                info: {
                    txt: 'Plan a trip!'
                }
            },
            {
                id: 'n111',
                createdAt: 1112232,
                type: 'NoteTxt',
                isPinned: false,
                style: {
                    backgroundColor: '#d4e4ed' // google keep light blue
                },
                info: {
                    txt: 'Read a book!'
                }
            },
            {
                id: 'n112',
                createdAt: 1112233,
                type: 'NoteImg',
                isPinned: false,
                info: {
                    url: 'https://picsum.photos/250/250',
                    title: 'Sunset View'
                },
                style: {
                    backgroundColor: '#d4e4ed' // google keep light blue
                }
            },
            {
                id: 'n113',
                createdAt: 1112234,
                type: 'NoteTodos',
                isPinned: false,
                info: {
                    title: 'Daily Tasks',
                    todos: [
                        { txt: 'Exercise', doneAt: null },
                        { txt: 'Meditate', doneAt: null },
                        { txt: 'Work on project', doneAt: 187111111 }
                    ]
                }
            },
            {
                id: 'n114',
                createdAt: 1112235,
                type: 'NoteTxt',
                isPinned: true,
                style: {
                    backgroundColor: '#e2f6d3' // google keep light green
                },
                info: {
                    txt: 'Start a new hobby!'
                }
            },
            {
                id: 'n115',
                createdAt: 1112236,
                type: 'NoteImg',
                isPinned: false,
                info: {
                    url: 'https://picsum.photos/300/200',
                    title: 'Mountain Adventure'
                },
                style: {
                    backgroundColor: '#e9e3d4' // google keep light beige
                }
            },
            {
                id: 'n116',
                createdAt: 1112237,
                type: 'NoteVideo',
                isPinned: false,
                style: {
                    backgroundColor: '#d4e4ed' // google keep light blue
                },
                info: {
                    title: 'Austin MAJOR 2025',
                    url: 'https://www.youtube.com/watch?v=WdO-CyDFKeI'
                }
            }
        ]
        utilService.saveToStorage(NOTE_KEY, notes)
    }

    console.log('notes:', notes)
}

function addNote(txt = '', title = '', isPinned = false, imgDataUrl = null, selectedColor = null) {
    let note = {}
    note.info = note.info || {}
    note.info.title = title
    note.info.txt = txt
    note.isPinned = isPinned
    note.style = note.style || {}
    note.style.backgroundColor = selectedColor || '#fff' // Default to white if no color
    note.createdAt = Date.now()
    const youtubeRegex = /(https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[\w\-?&=%.]+)/gi
    const matches = txt.match(youtubeRegex)

    if (imgDataUrl) {
        note.type = 'NoteImg'
        note.info.url = imgDataUrl
    } else if (matches && matches.length > 0) {
        note.type = 'NoteVideo'
        note.info.url = matches[0].trim()
        // Remove the url from the text
        const txtWithoutUrl = txt.replace(matches[0], '').trim()
        note.info.txt = txtWithoutUrl
    } else if (txt.includes(',')) {
        note.type = 'NoteTodos'
        note.info.todos = txt.split(',').map(str => ({ txt: str.trim(), doneAt: null }))
    } else {
        note.type = 'NoteTxt'
    }

    return save(note)
        .then(() => {
            window.dispatchEvent(new Event('refreshNotes'))
        })
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

function getEmbedUrl(url) {
    if (!url) return ''
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(youtubeRegex)
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`
    }
    if (url.includes('/embed/')) return url
    return url
}

function formatDateTime(ts) {
    if (!ts) return ''
    const d = new Date(ts)
    return d.toLocaleString()
}

