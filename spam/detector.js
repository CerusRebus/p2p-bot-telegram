const SPAM_CONFIG = require('./SPAM_CONFIG')

const userActivity = {}

function isSpam(msg) {
    if (!msg.text) return false

    const text = msg.text.toLowerCase()
    const userId = msg.from.id
    const now = Date.now()
    
    if (!userActivity[userId]) {
        userActivity[userId] = {
            timestamps: [],
            lastText: ''
        }
    }

    const u = userActivity[userId]

    u.timestamps = u.timestamps.filter(t => now - t < SPAM_CONFIG.intervalMs)
    u.timestamps.push(now)

    if (u.timestamps.length > SPAM_CONFIG.maxMessage) {
        return 'flood'
    }
    
    if (u.lastText === text && text.length > 5) {
        return 'repeat'
    }

    u.lastText = text
    
    if (/http[s]?:\/\/|t\.me\/|@/i.test(text)) {
        return 'link'
    }
    
    if (SPAM_CONFIG.keywords.some(k => text.includes(k))) {
        return 'keyword'
    }

    return false
}

module.exports = isSpam