const TelegramBot = require("node-telegram-bot-api")
// 🔹 Твой токен от BotFather
const TOKEN = "7308783055:AAHPAWp8dlfQ57wl1xHqve7yrA01evRRbso"
// 🔹 ID чата, куда бот должен отправлять сообщения
// Узнать можно через: https://t.me/RawDataBot
const TARGET_CHAT_ID = -1002228332362

const bot = new TelegramBot(TOKEN, { polling: true })

bot.on("message", (msg) => {
    const now = new Date()
    const dateString = now.toLocaleDateString("uk-UA").replace(/\//g, ".")

    const rate = msg.text.trim()

    // Бот должен реагировать только если пишет его владелец
    const DANIL_TELEGRAM_ID = 700027769 // Узнать через @userinfobot
    const NIKITA_TELEGRAM_ID = 327312382

    const {from: {id} } = msg

    if (id !== DANIL_TELEGRAM_ID && id !== NIKITA_TELEGRAM_ID) return;

    // Формируем красивый пост
    const message = `
cerus 🫱🏻‍🫲🏼 rebus
    
${dateString}
    
📊 КУРС ПРОДАЖИ USDT 🟢🕹
💵 USDT - USD 1 / ${rate}`;
    // Отправляем в чат
    bot.sendMessage(TARGET_CHAT_ID, message, { parse_mode: "Markdown" })
})

console.log('Bot started successful')