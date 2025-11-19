const TelegramBot = require("node-telegram-bot-api")
const express = require('express')

// 🔹 Tокен от BotFather
const TOKEN = "7308783055:AAHPAWp8dlfQ57wl1xHqve7yrA01evRRbso"
// 🔹 ID чата Узнать можно через: https://t.me/RawDataBot
const TARGET_CHAT_ID = -1002228332362
// Узнать через @userinfobot
const DANIL_TELEGRAM_ID = 700027769
const NIKITA_TELEGRAM_ID = 327312382

const PORT = process.env.PORT || 3000

const WEBHOOK_URL = 'https://p2p-bot-telegram.onrender.com'

// const bot = new TelegramBot(TOKEN, { polling: true })

const app = express()
app.use(express.json())

const bot = new TelegramBot(TOKEN)

bot.setWebHook(`${WEBHOOK_URL}/bot${TOKEN}`)

app.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200)
})

bot.on("message", (msg) => {
    const now = new Date()
    const dateString = now.toLocaleDateString("uk-UA").replace(/\//g, ".")

    const {from: {id} } = msg
    const rate = msg.text.trim()

    if (id !== DANIL_TELEGRAM_ID && id !== NIKITA_TELEGRAM_ID) return;

    const message = `
cerus 🫱🏻‍🫲🏼 rebus
    
${dateString}
    
📊 КУРС ПРОДАЖИ USDT 🟢🕹
💵 USDT - USD 1 / ${rate}`;
    // Отправляем в чат
    bot.sendMessage(TARGET_CHAT_ID, message, { parse_mode: "Markdown" })
})

app.listen(PORT, () => {
    console.log('Bot server running on port ' + PORT)
})
