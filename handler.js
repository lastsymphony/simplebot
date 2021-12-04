const fs = require('fs');
const simple = require('./lib/simple')
const { WAConnection: _WAConnection, MessageType, compressImage } = require("@adiwajshing/baileys")
const WAConnection = simple.WAConnection(_WAConnection)
const util = require('util')
const syntaxErr = require('syntax-error')
const { exec } = require('child_process')
const axios = require('axios')
const yts = require('yt-search')
const fetch = require('node-fetch')
const fetch = require('node-fetch')
const chalk = require('chalk')
const config = require('./config.json')
const { menu } = require('./lib/menu')
let { yta, ytv } = require('../lib/scrape/y2mate');

module.exports = client = async (client, m) => {
	try {
	if (!m.hasNewMessage) return
    	if (!m.messages) return
    	if (!m) return
    	m = m.messages.all()[0];
    	simple.smsg(client, m)
    	if (m.text && typeof m.text !== 'string') return
    	let { quoted, mentionedJid, sender, isGroup, text, pushname, fromMe, mtype } = m
    	command = text.replace(config.prefix, '').trim().split(/ +/).shift().toLowerCase()
    	const args = text.trim().split(/ +/).slice(1);
    	const query = args.join(' ')
    	const isCmd = text.startsWith(config.prefix)

    	const isOwner = config.ownerNumber.includes(sender)

    	if (isCmd) {console.log(chalk.green('[ USE COMMAND ] '), chalk.cyan(command))}

    switch(command) {
	    case 'menu':
	    case 'help':
		    m.reply(menu())
		 break
            case 'sticker':
	    case 'stiker':
	    case 's':
		    {
			let q = m.quoted ? m.quoted : m
			let mime = (q.msg || q).mimetype || ''
			if (/image/.test(mime)) {
			   let img = await q.download()
			if (!img) m.reply(`balas gambar dengan caption *${config.prefix}sticker*`)
			   client.sendSticker(m.chat, img, 'UwU', `${pushname}`)
			} else if (/video/.test(mime)) { 
			   let img = await q.download()
			if (!img) throw `balas gambar dengan caption */sticker*`
			   client.sendSticker(m.chat, img, 'UwU', `${pushname}`)
			} else {
			   m.reply(`balas gambar dengan caption *${config.prefix}sticker*`)
			}
		    }
		 break
	    case 'play':
		    {
			if (!query) return m.reply(`Use ${config.prefix}play <query> contoh ${config.prefix}play anjay songs`)
			try { 
			let result = await yts(query)
			let vid = result.all.find(video => video.seconds < 3800)
			if (!vid) return m.reply('Video/Audio Tidak ditemukan')
			let caption =
			`*• Title:* ${vid.title}\n` +
			`*• Duration:* ${vid.timestamp}\n` +
			`*• Uploaded:* ${vid.ago}\n` +
			`*• VideoID:* ${vid.videoId}\n`+
			`*• Url:* ${vid.url}\n`+
			`pilih salah satu format dibawah ini!`;
			    await client.send2ButtonLoc(m.chat, await (await fetch(vid.image)).buffer(), caption, '© Ichinose', 'Video', `>ytv ${vid.url}`, 'Audio', `>yta ${vid.url}`, m)
			} catch(e) {
			 _err(e)
			}
		    }
		break	
            case 'tiktok':
		    {
			if (!query) return m.reply(`Use ${config.prefix}tiktok <link> contoh ${config.prefix}tiktok https://vm.tiktok.com/ZSJcLPNpe`)
			    const res_tiktok = await axios.get('https://tyz-api.herokuapp.com/downloader/tiktok?link='+query)
			    client.sendFile(m.chat, res_tiktok.data.metaData.nowatermark, 'tiktok.mp4', 'Sukses', m)
			    client.sendFile(m.chat, res_tiktok.data.metaData.audio, 'tiktok.mp3', '', m)
		    }
		break
	   case 'soundcloud':
		    {
			m.reply(config.msg.wait)
			    axios.get('https://tyz-api.herokuapp.com/downloader/scdl?link='+query).then(res => {
				cmd.sendFile(m.chat, res.data.link, 'audio.mp3', '', m)
			    })
		    }
		break
	    case 'pinterest':
		    {
			 if (!query) return m.reply(`Use ${config.prefix}pinterest <query> contoh ${config.prefix}pinterest waifu`)
			    const res_pin = (await axios.get('https://tyz-api.herokuapp.com/search/pinterest?query='+query)).data.result
			    client.sendFile(m.chat, Math.floor(Math.random() * res_pin), 'pinterest.jpg', `Hasil pencarian: ${query}`, m)
		    }
		break
	    case 'zerochan':
		    {
			    if (!query) return m.reply(`Use ${config.prefix}zerochan <query> contoh ${config.prefix}zerochan azur_lane`)
			    client.sendFile(m.chat, 'https://tyz-api.herokuapp.com/search/konachan?query='+query, 'zerochan.jpeg', `Hasil pencarian: ${query}`, m)
		    }
		break
	    case 'artinama':
		    {
			    if (!query) return m.reply(`Use ${config.prefix}artinama <nama> contoh ${config.prefix}artinama Arya`)
			    const res_artinama = await axios.get('https://tyz-api.herokuapp.com/primbon/artinama?nama='+query)
			    m.reply(res_artinama.data)
		    }
		break
	    case 'milf':
	    case 'waifu':
	    case 'husbu':
	    case 'loli':
	    case 'cosplay':
		    {
			    client.sendFile(m.chat, 'https://tyz-api.herokuapp.com/randomimg/'+command, 'image.jpeg', '', m)
		    }
		break
	    case 'eval':
		    {
		    if (!isOwner) return
			 let _syntax = ''
			 let _return
			 let _text = `;(async () => {${(/^=/.test('/') ? 'return ' : '') + query}})()`
			 try {
			_return = await eval(_text)
			}catch(e) {
			let err = await syntaxErr(_text)
			if (err) _syntax = err + '\n\n'
			_return = e
			}finally {
			m.reply(_syntax + util.format(_return))
			}
		    }
	       break
	}
	
	//Button response
	if (mtype === 'buttonsResponseMessage') {
	  let buttonId = m.msg.selectedButtonId
	  const buttonCmd = buttonId.replace('>', '').trim().split(/ +/).shift().toLowerCase()
	  switch (buttonCmd) {
		case 'yta':
     		    m.reply('Tunggu sedang di proses')
      		    var res = await yta(buttonId.slice(5))
     		    await cmd.sendFile(m.chat, res.dl_link, `${res.title}.mp3`, '', m, false, { asDocument: true})
     	        break
    		case 'ytv':
      		    m.reply('Tunggu sedang di proses')
      	            var res = await ytv(buttonId.slice(5))
      		    await cmd.sendFile(m.chat, res.dl_link, `${res.title}.mp4`, '', m, false, { asDocument: true})
               break
	  }
	}
	  
		
	function _err(e) {
      	if (typeof e == 'string')
        client.reply(m.chat, e, m)
      	else
        client.reply(m.chat, config.msg.error, m)
        console.log(chalk.red('Error'+ e)
    	}
		
	} catch (err) {
		console.log(err)
	}
}
