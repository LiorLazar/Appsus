import { storageService } from "../../../services/async-storage.service.js"
import { utilService } from "../../../services/util.service.js"

const MAIL_KEY = 'mailDB'
let gQueryOptions = {
    sortBy: { sortField: '', sortDir: 0 }
}
_createMails()

export const mailService = {
    query,
    get,
    remove,
    save,
    getEmptyMail,
    getDefaultFilter,
    getFilterFromSearchParams,
    getLoggedInUser,
    getOrderItems,
    setSortBy
}

const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}

function getLoggedInUser() {
    return loggedinUser
}

function query(filterBy = {}) {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            // Apply filters first
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                mails = mails.filter(mail =>
                    regExp.test(mail.subject) ||
                    regExp.test(mail.from) ||
                    regExp.test(mail.to)
                )
            }
            if (filterBy.from) {
                const regExp = new RegExp(filterBy.from, 'i')
                mails = mails.filter(mail => regExp.test(mail.from))
            }
            if (filterBy.to) {
                const regExp = new RegExp(filterBy.to, 'i')
                mails = mails.filter(mail => regExp.test(mail.to))
            }
            if (filterBy.subject) {
                const regExp = new RegExp(filterBy.subject, 'i')
                mails = mails.filter(mail => regExp.test(mail.subject))
            }
            if (filterBy.folder) {
                const regExp = new RegExp(filterBy.folder, 'i')
                mails = mails.filter(mail => regExp.test(mail.folder))
            }
            if (filterBy.category) {
                const regExp = new RegExp(filterBy.category, 'i')
                mails = mails.filter(mail => regExp.test(mail.category))
            }
            if (filterBy.sortBy && filterBy.sortBy.sortField) {
                const { sortField, sortDir } = filterBy.sortBy
                mails.sort((first, second) => {
                    let firstValue = first[sortField]
                    let secondValue = second[sortField]

                    // Handle different data types
                    if (typeof firstValue === 'string' && typeof secondValue === 'string') {
                        firstValue = firstValue.toLowerCase()
                        secondValue = secondValue.toLowerCase()
                    }

                    // Handle dates (sentAt, createdAt)
                    if (sortField === 'sentAt' || sortField === 'createdAt') {
                        firstValue = new Date(firstValue).getTime()
                        secondValue = new Date(secondValue).getTime()
                    }

                    // Sort logic
                    if (firstValue < secondValue) return sortDir === 1 ? -1 : 1
                    if (firstValue > secondValue) return sortDir === 1 ? 1 : -1
                    return 0
                })
            } else if (gQueryOptions.sortBy && gQueryOptions.sortBy.sortField) {
                const { sortField, sortDir } = gQueryOptions.sortBy
                mails.sort((first, second) => {
                    let firstValue = first[sortField]
                    let secondValue = second[sortField]

                    if (typeof firstValue === 'string' && typeof secondValue === 'string') {
                        firstValue = firstValue.toLowerCase()
                        secondValue = secondValue.toLowerCase()
                    }

                    if (sortField === 'sentAt' || sortField === 'createdAt') {
                        firstValue = new Date(firstValue).getTime()
                        secondValue = new Date(secondValue).getTime()
                    }

                    if (firstValue < secondValue) return sortDir === 1 ? -1 : 1
                    if (firstValue > secondValue) return sortDir === 1 ? 1 : -1
                    return 0
                })
            }

            return mails
        })
}

function setSortBy(field, dir) {
    gQueryOptions.sortBy = { sortField: field, sortDir: dir }
}

function get(mailId) {
    return storageService.get(MAIL_KEY, mailId)
}

function remove(mail) {
    return storageService.remove(MAIL_KEY, mail)
}

function save(mail) {
    if (mail.id) return storageService.put(MAIL_KEY, mail)
    else return storageService.post(MAIL_KEY, mail)
}

function getEmptyMail() {
    return {
        subject: '',
        body: '',
        from: '',
        to: '',
        folder: '',
        category: '',
        label: '',
        isRead: false,
        removedAt: null
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        from: '',
        to: '',
        subject: '',
        folder: 'inbox',
        category: '',
        sortBy: { sortField: '', sortDir: 0 }

    }
}

function _createMails() {
    let mails = utilService.loadFromStorage(MAIL_KEY)
    if (!mails || !mails.length) {

        const mails = [
            {
                id: 'e101',
                createdAt: 1551133930500,
                subject: 'Miss you!',
                body: 'Would love to catch up sometimes',
                isRead: false,
                sentAt: 1551133930594,
                removedAt: null,
                from: 'momo@momo.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Primary'
            },
            {
                id: 'e102',
                createdAt: 1551134930500,
                subject: 'Project Update',
                body: 'The project is on track for next week\'s deadline.',
                isRead: false,
                sentAt: 1551134930594,
                removedAt: null,
                from: 'team@appsus.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Promotions'
            },
            {
                id: 'e103',
                createdAt: 1551135930500,
                subject: 'Invitation',
                body: 'You are invited to our annual event!',
                isRead: true,
                sentAt: 1551135930594,
                removedAt: null,
                from: 'events@appsus.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Social'
            }
        ]
        console.log('mails:', mails)
        utilService.saveToStorage(MAIL_KEY, mails)
    }
}

function getFilterFromSearchParams(searchParams) {
    const sortField = searchParams.get('sortField') || ''
    const sortDir = parseInt(searchParams.get('sortDir')) || 0

    return {
        txt: searchParams.get('txt') || '',
        from: searchParams.get('from') || '',
        to: searchParams.get('to') || '',
        subject: searchParams.get('subject') || '',
        folder: searchParams.get('folder') || '',
        category: searchParams.get('category') || '',
        sortBy: { sortField, sortDir: isNaN(sortDir) ? 0 : sortDir }
    }
}
function getOrderItems() {
    return Promise.resolve([
        'subject',
        'from',
        'sentAt',
        'createdAt'
    ])
}