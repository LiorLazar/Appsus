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
    setSortBy,
    formatDate
}

const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}

function formatDate(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now - date
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    if (diffInDays === 1) {
        return 'Yesterday'
    }

    if (diffInDays < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'long' })
    }

    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
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

        const now = Date.now()
        const oneHour = 1000 * 60 * 60
        const oneDay = oneHour * 24
        const oneWeek = oneDay * 7
        const oneMonth = oneDay * 30
        const oneYear = oneDay * 365

        const mails = [
            // INBOX EMAILS (8 emails) - Recent dates
            {
                id: 'e101',
                createdAt: now - (2 * oneHour), // 2 hours ago
                subject: 'Miss you!',
                body: 'Would love to catch up sometimes. How have you been? Let\'s plan a coffee date soon!',
                isRead: false,
                sentAt: now - (2 * oneHour),
                removedAt: null,
                from: 'momo@momo.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Primary'
            },
            {
                id: 'e102',
                createdAt: now - (5 * oneHour), // 5 hours ago
                subject: 'Project Update - Sprint 3',
                body: 'The project is on track for next week\'s deadline. All features are implemented and testing is in progress.',
                isRead: false,
                sentAt: now - (5 * oneHour),
                removedAt: null,
                from: 'team@appsus.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Promotions'
            },
            {
                id: 'e103',
                createdAt: now - oneDay, // Yesterday
                subject: 'Annual Company Event Invitation',
                body: 'You are invited to our annual event! Join us for networking, food, and fun activities.',
                isRead: true,
                sentAt: now - oneDay,
                removedAt: null,
                from: 'events@appsus.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Social'
            },
            {
                id: 'e104',
                createdAt: now - (2 * oneDay), // 2 days ago
                subject: 'Meeting Reminder: Team Standup',
                body: 'Don\'t forget about our team standup meeting tomorrow at 9 AM. We\'ll discuss the sprint progress.',
                isRead: false,
                sentAt: now - (2 * oneDay),
                removedAt: null,
                from: 'calendar@appsus.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Primary'
            },
            {
                id: 'e105',
                createdAt: now - (3 * oneDay), // 3 days ago
                subject: 'Your Netflix subscription is expiring',
                body: 'Your Netflix subscription will expire in 3 days. Renew now to continue enjoying unlimited streaming.',
                isRead: true,
                sentAt: now - (3 * oneDay),
                removedAt: null,
                from: 'billing@netflix.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Promotions'
            },
            {
                id: 'e106',
                createdAt: now - (5 * oneDay), // 5 days ago (this week)
                subject: 'Weekend Plans?',
                body: 'Hey! Want to go hiking this weekend? The weather looks perfect and I found a new trail.',
                isRead: false,
                sentAt: now - (5 * oneDay),
                removedAt: null,
                from: 'alex@friends.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Social'
            },
            {
                id: 'e107',
                createdAt: now - (10 * oneDay), // 10 days ago
                subject: 'Code Review Request',
                body: 'Could you please review my pull request for the new mail component? It\'s ready for testing.',
                isRead: false,
                sentAt: now - (10 * oneDay),
                removedAt: null,
                from: 'developer@appsus.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Primary'
            },
            {
                id: 'e108',
                createdAt: now - (15 * oneDay), // 15 days ago
                subject: 'Flash Sale: 50% Off Everything!',
                body: 'Limited time offer! Get 50% off all items in our store. Sale ends midnight tonight!',
                isRead: true,
                sentAt: now - (15 * oneDay),
                removedAt: null,
                from: 'sales@techstore.com',
                to: 'user@appsus.com',
                folder: 'inbox',
                category: 'Promotions'
            },

            // SENT EMAILS (5 emails) - Mixed dates
            {
                id: 'e201',
                createdAt: now - (30 * 60 * 1000), // 30 minutes ago
                subject: 'Re: Meeting Agenda',
                body: 'Thanks for sharing the agenda. I\'ve added my topics to discuss. Looking forward to the meeting.',
                isRead: true,
                sentAt: now - (30 * 60 * 1000),
                removedAt: null,
                from: 'user@appsus.com',
                to: 'manager@appsus.com',
                folder: 'sent',
                category: 'Primary'
            },
            {
                id: 'e202',
                createdAt: now - (6 * oneHour), // 6 hours ago
                subject: 'Vacation Request - Next Month',
                body: 'I would like to request vacation days from March 15-22. I\'ve completed all my current projects.',
                isRead: true,
                sentAt: now - (6 * oneHour),
                removedAt: null,
                from: 'user@appsus.com',
                to: 'hr@appsus.com',
                folder: 'sent',
                category: 'Primary'
            },
            {
                id: 'e203',
                createdAt: now - (4 * oneDay), // 4 days ago
                subject: 'Happy Birthday!',
                body: 'Hope you have a wonderful birthday celebration! Can\'t wait to see you at the party tonight.',
                isRead: true,
                sentAt: now - (4 * oneDay),
                removedAt: null,
                from: 'user@appsus.com',
                to: 'sarah@friends.com',
                folder: 'sent',
                category: 'Social'
            },
            {
                id: 'e204',
                createdAt: now - (oneWeek), // 1 week ago
                subject: 'Bug Report - Login Issue',
                body: 'Found a bug in the login system. Users can\'t reset passwords. Details and screenshots attached.',
                isRead: true,
                sentAt: now - (oneWeek),
                removedAt: null,
                from: 'user@appsus.com',
                to: 'bugs@appsus.com',
                folder: 'sent',
                category: 'Primary'
            },
            {
                id: 'e205',
                createdAt: now - (2 * oneWeek), // 2 weeks ago
                subject: 'Thank you for the recommendation',
                body: 'Thanks for recommending that restaurant! The food was amazing and the service was excellent.',
                isRead: true,
                sentAt: now - (2 * oneWeek),
                removedAt: null,
                from: 'user@appsus.com',
                to: 'foodie@friends.com',
                folder: 'sent',
                category: 'Social'
            },

            // STARRED EMAILS (4 emails) - Important dates
            {
                id: 'e301',
                createdAt: now - (45 * 60 * 1000), // 45 minutes ago - recent important
                subject: 'Important: Server Maintenance Tonight',
                body: 'URGENT: Servers will be down for maintenance from 11 PM to 3 AM. Please save your work.',
                isRead: true,
                sentAt: now - (45 * 60 * 1000),
                removedAt: null,
                from: 'admin@appsus.com',
                to: 'user@appsus.com',
                folder: 'starred',
                category: 'Primary'
            },
            {
                id: 'e302',
                createdAt: now - (oneMonth), // 1 month ago
                subject: 'Contract Renewal - Please Review',
                body: 'Your employment contract is up for renewal. Please review the attached document and sign.',
                isRead: false,
                sentAt: now - (oneMonth),
                removedAt: null,
                from: 'legal@appsus.com',
                to: 'user@appsus.com',
                folder: 'starred',
                category: 'Primary'
            },
            {
                id: 'e303',
                createdAt: now - (2 * oneMonth), // 2 months ago
                subject: 'Flight Confirmation - NYC Trip',
                body: 'Your flight to NYC is confirmed. Flight AA123 departing March 10 at 8:30 AM. Check-in online.',
                isRead: true,
                sentAt: now - (2 * oneMonth),
                removedAt: null,
                from: 'bookings@airline.com',
                to: 'user@appsus.com',
                folder: 'starred',
                category: 'Primary'
            },
            {
                id: 'e304',
                createdAt: now - (6 * oneMonth), // 6 months ago
                subject: 'Recipe: Grandma\'s Secret Pasta',
                body: 'Finally sharing grandma\'s secret pasta recipe! You\'ve been asking for years. Don\'t share it!',
                isRead: true,
                sentAt: now - (6 * oneMonth),
                removedAt: null,
                from: 'family@relatives.com',
                to: 'user@appsus.com',
                folder: 'starred',
                category: 'Social'
            },

            // TRASH EMAILS (3 emails) - Old dates
            {
                id: 'e401',
                createdAt: now - (3 * oneMonth), // 3 months ago
                subject: 'SPAM: You\'ve won $1,000,000!',
                body: 'Congratulations! You\'ve won our lottery! Click here to claim your prize now!!!',
                isRead: false,
                sentAt: now - (3 * oneMonth),
                removedAt: now - (3 * oneMonth) + oneDay,
                from: 'scam@lottery.fake',
                to: 'user@appsus.com',
                folder: 'trash',
                category: 'Spam'
            },
            {
                id: 'e402',
                createdAt: now - (oneYear), // 1 year ago
                subject: 'Old Newsletter - Tech Weekly',
                body: 'This week in tech: AI developments, new frameworks, and industry news from last month.',
                isRead: true,
                sentAt: now - (oneYear),
                removedAt: now - (oneYear) + (2 * oneDay),
                from: 'news@techweekly.com',
                to: 'user@appsus.com',
                folder: 'trash',
                category: 'Promotions'
            },
            {
                id: 'e403',
                createdAt: now - (2 * oneYear), // 2 years ago
                subject: 'Expired Event Invitation',
                body: 'Join us for the conference that already happened last week. This event is now over.',
                isRead: true,
                sentAt: now - (2 * oneYear),
                removedAt: now - (2 * oneYear) + (3 * oneDay),
                from: 'expired@events.com',
                to: 'user@appsus.com',
                folder: 'trash',
                category: 'Social'
            }
        ]

        console.log('Created 20 mock emails with varied timestamps:', mails)
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