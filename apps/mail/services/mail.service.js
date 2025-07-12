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
            // INBOX EMAILS (8 emails)
            {
                id: 'e101',
                createdAt: 1551133930500,
                subject: 'Miss you!',
                body: 'Would love to catch up sometimes. How have you been? Let\'s plan a coffee date soon!',
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
                subject: 'Project Update - Sprint 3',
                body: 'The project is on track for next week\'s deadline. All features are implemented and testing is in progress.',
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
                subject: 'Annual Company Event Invitation',
                body: 'You are invited to our annual event! Join us for networking, food, and fun activities.',
                isRead: true,
                sentAt: 1551135930594,
                removedAt: null,
                from: 'events@appsus.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Social'
            },
            {
                id: 'e104',
                createdAt: 1551136930500,
                subject: 'Meeting Reminder: Team Standup',
                body: 'Don\'t forget about our team standup meeting tomorrow at 9 AM. We\'ll discuss the sprint progress.',
                isRead: false,
                sentAt: 1551136930594,
                removedAt: null,
                from: 'calendar@appsus.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Primary'
            },
            {
                id: 'e105',
                createdAt: 1551137930500,
                subject: 'Your Netflix subscription is expiring',
                body: 'Your Netflix subscription will expire in 3 days. Renew now to continue enjoying unlimited streaming.',
                isRead: true,
                sentAt: 1551137930594,
                removedAt: null,
                from: 'billing@netflix.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Promotions'
            },
            {
                id: 'e106',
                createdAt: 1551138930500,
                subject: 'Weekend Plans?',
                body: 'Hey! Want to go hiking this weekend? The weather looks perfect and I found a new trail.',
                isRead: false,
                sentAt: 1551138930594,
                removedAt: null,
                from: 'alex@friends.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Social'
            },
            {
                id: 'e107',
                createdAt: 1551139930500,
                subject: 'Code Review Request',
                body: 'Could you please review my pull request for the new mail component? It\'s ready for testing.',
                isRead: false,
                sentAt: 1551139930594,
                removedAt: null,
                from: 'developer@appsus.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Primary'
            },
            {
                id: 'e108',
                createdAt: 1551140930500,
                subject: 'Flash Sale: 50% Off Everything!',
                body: 'Limited time offer! Get 50% off all items in our store. Sale ends midnight tonight!',
                isRead: true,
                sentAt: 1551140930594,
                removedAt: null,
                from: 'sales@techstore.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Promotions'
            },

            // SENT EMAILS (5 emails)
            {
                id: 'e201',
                createdAt: 1551141930500,
                subject: 'Re: Meeting Agenda',
                body: 'Thanks for sharing the agenda. I\'ve added my topics to discuss. Looking forward to the meeting.',
                isRead: true,
                sentAt: 1551141930594,
                removedAt: null,
                from: 'user@appsus.com',
                to: 'manager@appsus.com',
                folder: 'sent',
                category: 'Primary'
            },
            {
                id: 'e202',
                createdAt: 1551142930500,
                subject: 'Vacation Request - Next Month',
                body: 'I would like to request vacation days from March 15-22. I\'ve completed all my current projects.',
                isRead: true,
                sentAt: 1551142930594,
                removedAt: null,
                from: 'user@appsus.com',
                to: 'hr@appsus.com',
                folder: 'sent',
                category: 'Primary'
            },
            {
                id: 'e203',
                createdAt: 1551143930500,
                subject: 'Happy Birthday!',
                body: 'Hope you have a wonderful birthday celebration! Can\'t wait to see you at the party tonight.',
                isRead: true,
                sentAt: 1551143930594,
                removedAt: null,
                from: 'user@appsus.com',
                to: 'sarah@friends.com',
                folder: 'sent',
                category: 'Social'
            },
            {
                id: 'e204',
                createdAt: 1551144930500,
                subject: 'Bug Report - Login Issue',
                body: 'Found a bug in the login system. Users can\'t reset passwords. Details and screenshots attached.',
                isRead: true,
                sentAt: 1551144930594,
                removedAt: null,
                from: 'user@appsus.com',
                to: 'bugs@appsus.com',
                folder: 'sent',
                category: 'Primary'
            },
            {
                id: 'e205',
                createdAt: 1551145930500,
                subject: 'Thank you for the recommendation',
                body: 'Thanks for recommending that restaurant! The food was amazing and the service was excellent.',
                isRead: true,
                sentAt: 1551145930594,
                removedAt: null,
                from: 'user@appsus.com',
                to: 'foodie@friends.com',
                folder: 'sent',
                category: 'Social'
            },

            // STARRED EMAILS (4 emails)
            {
                id: 'e301',
                createdAt: 1551146930500,
                subject: 'Important: Server Maintenance Tonight',
                body: 'URGENT: Servers will be down for maintenance from 11 PM to 3 AM. Please save your work.',
                isRead: true,
                sentAt: 1551146930594,
                removedAt: null,
                from: 'admin@appsus.com',
                to: 'user@appsus.com',
                folder: 'starred',
                category: 'Primary'
            },
            {
                id: 'e302',
                createdAt: 1551147930500,
                subject: 'Contract Renewal - Please Review',
                body: 'Your employment contract is up for renewal. Please review the attached document and sign.',
                isRead: false,
                sentAt: 1551147930594,
                removedAt: null,
                from: 'legal@appsus.com',
                to: 'user@appsus.com',
                folder: 'starred',
                category: 'Primary'
            },
            {
                id: 'e303',
                createdAt: 1551148930500,
                subject: 'Flight Confirmation - NYC Trip',
                body: 'Your flight to NYC is confirmed. Flight AA123 departing March 10 at 8:30 AM. Check-in online.',
                isRead: true,
                sentAt: 1551148930594,
                removedAt: null,
                from: 'bookings@airline.com',
                to: 'user@appsus.com',
                folder: 'starred',
                category: 'Primary'
            },
            {
                id: 'e304',
                createdAt: 1551149930500,
                subject: 'Recipe: Grandma\'s Secret Pasta',
                body: 'Finally sharing grandma\'s secret pasta recipe! You\'ve been asking for years. Don\'t share it!',
                isRead: true,
                sentAt: 1551149930594,
                removedAt: null,
                from: 'family@relatives.com',
                to: 'user@appsus.com',
                folder: 'starred',
                category: 'Social'
            },

            // TRASH EMAILS (3 emails)
            {
                id: 'e401',
                createdAt: 1551150930500,
                subject: 'SPAM: You\'ve won $1,000,000!',
                body: 'Congratulations! You\'ve won our lottery! Click here to claim your prize now!!!',
                isRead: false,
                sentAt: 1551150930594,
                removedAt: 1551151930594,
                from: 'scam@lottery.fake',
                to: 'user@appsus.com',
                folder: 'trash',
                category: 'Spam'
            },
            {
                id: 'e402',
                createdAt: 1551151930500,
                subject: 'Old Newsletter - Tech Weekly',
                body: 'This week in tech: AI developments, new frameworks, and industry news from last month.',
                isRead: true,
                sentAt: 1551151930594,
                removedAt: 1551152930594,
                from: 'news@techweekly.com',
                to: 'user@appsus.com',
                folder: 'trash',
                category: 'Promotions'
            },
            {
                id: 'e403',
                createdAt: 1551152930500,
                subject: 'Expired Event Invitation',
                body: 'Join us for the conference that already happened last week. This event is now over.',
                isRead: true,
                sentAt: 1551152930594,
                removedAt: 1551153930594,
                from: 'expired@events.com',
                to: 'user@appsus.com',
                folder: 'trash',
                category: 'Social'
            }
        ]

        console.log('Created 20 mock emails:', mails)
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