const SPAM_CONFIG = require('./SPAM_CONFIG')

async function handleSpam(bot, msg, reason) {
    try {
        await bot.deleteMessage(msg.chat.id, msg.message_id)
        console.log(`🛑 SPAM | user=${msg.from.id} | reason=${reason}`)
        await bot.restrictChatMember(msg.chat.id, msg.from.id, {
            can_send_messages: false, until_date: Math.floor(Date.now() / 1000) + SPAM_CONFIG.muteMs / 1000
        })
    } catch (error) {
        console.log('Spam handler error:', error.message)
    }
}

module.exports = handleSpam