import { storageService } from "../../../services/async-storage.service.js"
import { utilService } from "../../../services/util.service.js"

const MAIL_KEY = 'mailDB'
_createMails()

export const mailService = {
    query,
    get,
    remove,
    save,
    getEmptyMail,
    getDefaultFilter,
    getFilterFromSearchParams,
    getLoggedInUser
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
            return mails
        })
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
    return {
        txt: searchParams.get('txt') || '',
        from: searchParams.get('from') || '',
        to: searchParams.get('to') || '',
        subject: searchParams.get('subject') || '',
        folder: searchParams.get('folder') || '',
        category: searchParams.get('category') || '',
    }
}