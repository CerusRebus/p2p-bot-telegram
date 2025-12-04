require('dotenv').config()
console.log('TOKEN EXISTS:', !!process.env.TOKEN_TG_BOT)
const isSpam = require('./spam/detector')
const handleSpam = require('./spam/handler')

const TelegramBot = require("node-telegram-bot-api")
const express = require('express')

let lastMessageId = null
let lastMessageDate = null

const PORT = process.env.PORT || 3000
// Tокен от BotFather
const TOKEN_TG_BOT = process.env.TOKEN_TG_BOT
// ID чата Узнать можно через: https://t.me/RawDataBot
const TARGET_CHAT_ID = Number(process.env.TARGET_CHAT_ID)
const WEBHOOK_URL = process.env.WEBHOOK_URL
// Telegram IDs
const DANIL_TELEGRAM_ID = Number(process.env.DANIL_TELEGRAM_ID)
const NIKITA_TELEGRAM_ID = Number(process.env.NIKITA_TELEGRAM_ID)

// const bot = new TelegramBot(TOKEN_TG_BOT, { polling: true })

const app = express()
app.use(express.json())

const bot = new TelegramBot(TOKEN_TG_BOT)
bot.setWebHook(`${WEBHOOK_URL}/bot${TOKEN_TG_BOT}`)

app.post(`/bot${TOKEN_TG_BOT}`, (req, res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200)
})

bot.on("message", async (msg) => {

    const spam = isSpam(msg)
    if (spam) {
        await handleSpam(bot, msg, spam)
        return
    }

    const now = new Date()
    const dateString = now.toLocaleDateString("uk-UA").replace(/\//g, ".")

    const {from: {id}} = msg
    const rate = msg.text.trim()

    if (id !== DANIL_TELEGRAM_ID && id !== NIKITA_TELEGRAM_ID) return

    const today = new Date().toISOString().slice(0, 10)

    if (lastMessageDate !== today) {
        lastMessageDate = today
        lastMessageId = null
    }

    if (lastMessageId) {
        try {
            await bot.deleteMessage(TARGET_CHAT_ID, lastMessageId)
        } catch (error) {
            console.log('Failed to delete message:', error.message)
        }
    }

    const message = `
cerus 🫱🏻‍🫲🏼 rebus

${dateString}

📊 КУРС ПРОДАЖИ USDT 🟢🕹
💵 USDT - USD 1 / ${rate}`

    const sent = await bot.sendMessage(TARGET_CHAT_ID, message, {parse_mode: "Markdown", disable_notification: true})

    lastMessageId = sent.message_id
    // Отправляем в чат
    bot.sendMessage(TARGET_CHAT_ID, message, {parse_mode: "Markdown"})
})

app.listen(PORT, () => {
    console.log('Bot server running on port ' + PORT)
})
