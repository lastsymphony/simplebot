const fs = require('fs');
const simple = require('./lib/simple')
const { WAConnection: _WAConnection, MessageType, compressImage } = require("@adiwajshing/baileys")
const WAConnection = simple.WAConnection(_WAConnection)
const CFonts = require('cfonts');
const chalk = require('chalk')

const starts = async(client = new WAConnection()) => {
	let authofile = './session.json'
    client.version = [2, 2119, 6]
	client.browserDescription = ["Whatsapp - BOT", "Chrome", "1.0.0"]
	client.logger.level = 'warn'
	CFonts.say('Whatsapp BOT AUTOMATE', {
    font: '3d',
    align: 'center',
    gradient: ['red', 'magenta']
	})
	client.on("qr", () => {
	console.log("Scan QR!")
	})
	fs.existsSync(authofile) && client.loadAuthInfo(authofile)
	client.on('connecting', () => {
		console.log(chalk.green('connecting...'))
	})
	client.on('open', () => {
		console.log(chalk.green('connect...'))
	})
	console.log(chalk.green('Bot is Online'))
	await client.connect({timeoutMs: 30*1000})
    fs.writeFileSync(authofile, JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

    client.on('chat-update', async (m) => {
		require('./handler.js')(client, m)
	})
}

starts()