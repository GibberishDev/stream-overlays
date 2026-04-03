// #region init

setModuleList([
	"settings",
	"emotes",
	"sounds",
	"integration"
])

new sfx("super_appear","./assets/sounds/super.mp3")
new sfx("super_timeout","./assets/sounds/super_timeout.mp3")
new sfx("mega_appear","./assets/sounds/mega.mp3")
new sfx("mega_timeout","./assets/sounds/mega_timeout.mp3")
new sfx("regular_appear","./assets/sounds/regular.mp3")
new sfx("regular_timeout","./assets/sounds/regular_timeout.mp3")
initSounds()

// #region settings
new SettingArray("channelList", [], "Channels", "List of channels to track chat messages from")
new SettingNumber("numberregular", 2, 0, null, 1,"Required repetitions - <span style='color:var(--text-color);text-shadow:none;'>REGULAR</span>", "Minimum number of repeats in chat to display combo. 0 means disabled")
new SettingNumber("durationregular", 10000, 0, null, 100,"Duration - <span style='color:var(--text-color);text-shadow:none;'>REGULAR</span>", "Time in milliseconds until combo expires. Values below 2500 practically mean combo expires before twitch api sends information")
new SettingNumber("numbermega", 10, 0, null, 1,"<span style='display:flex;flex-direction:row;'>Required repetitions - <span class='mega' style='margin-left:10px;text-shadow:none;display:flex;flex-direction:row;'><div class='letter' style='--delay:0s'>M</div><div class='letter' style='--delay:0.1s'>E</div><div class='letter' style='--delay:0.2s'>G</div><div class='letter' style='--delay:0.3s'>A</div></span></span>", "Minimum number of repeats in chat to display mega combo animation. 0 means disabled")
new SettingNumber("durationmega", 15000, 0, null, 100,"<span style='display:flex;flex-direction:row;'>Duration - <span class='mega' style='margin-left:10px;text-shadow:none;display:flex;flex-direction:row;'><div class='letter' style='--delay:0s'>M</div><div class='letter' style='--delay:0.1s'>E</div><div class='letter' style='--delay:0.2s'>G</div><div class='letter' style='--delay:0.3s'>A</div></span></span>", "Time in milliseconds until mega combo expires. Values below 2500 practically mean combo expires before twitch api sends information")
new SettingNumber("numbersuper", 25, 0, null, 1,"<span style='display:flex;flex-direction:row;'>Required repetitions - <span class='super' style='margin-left:10px;text-shadow:none;display:flex;flex-direction:row;'><div class='letter'>S</div><div class='letter'>U</div><div class='letter'>P</div><div class='letter'>E</div><div class='letter'>R</div></span></span>", "Minimum number of repeats in chat to display super combo animation. 0 means disabled")
new SettingNumber("durationsuper", 20000, 0, null, 100,"<span style='display:flex;flex-direction:row;'>Duration - <span class='super' style='margin-left:10px;text-shadow:none;display:flex;flex-direction:row;'><div class='letter'>S</div><div class='letter'>U</div><div class='letter'>P</div><div class='letter'>E</div><div class='letter'>R</div></span></span>", "Time in milliseconds until super combo expires. Values below 2500 practically mean combo expires before twitch api sends information")
new SettingNumber("volume", 50, 0, 100, 1,"Sound effects volume", "Volume of sound effects. cool description")

new SettingSelect("position", 0, {
	0:"Bottom left",
	1:"Center left",
	2:"Top left",
	3:"Bottom right",
	4:"Center right",
	5:"Top right",
	6:"Bottom center",
	7:"Center",
	8:"Top center",
},"Position anchor","Defines position of the anchor for combos.")
new SettingBool("showtimer", false, "<span style='display:flex;flex-direction:row'><span class='timer' style='margin-right:24px;--timer:block;animation: timer 2s 0s linear infinite forwards;'></span>Display timer</span>", "Decides whether to show or hide combo expiration timer")
new SettingNumber("sizemult", 1.0, 0.1, null, 0.1, "Scale", "Controls scaling. where 0.1 is smallest at 10% of base size and 2 is bigger and 200% of base size")
new SettingBool("displaywords", true, "Display words", "Decides whether to count text combos. Meant as emote only mode, unless you turned emotes off and... bruh ._.")
new SettingBool("displayemotes", true, "Display emotes", "Decides whether to replace text with emotes")
new SettingBool("ffz", true, "<img style='height:24px;width:36px;object-fit:contain;display:inline-block;position:relative;top:4px;margin-right:8px;' src='./assets/ffz.png'>Enable FFZ emotes", "Include FrankerFaceZ emotes in the set")
new SettingBool("bttv", true, "<img style='height:24px;width:36px;object-fit:contain;display:inline-block;position:relative;top:4px;margin-right:8px;' src='./assets/bttv.png'>Enable BTTV emotes", "Include BetterTTV emotes in the set")
new SettingBool("seventv", true, "<img style='height:24px;width:36px;object-fit:contain;display:inline-block;position:relative;top:4px;margin-right:8px;' src='./assets/7tv.svg'>Enable 7TV emotes", "Include 7TV emotes in the set")
new SettingBool("showcounter", true, "<span style='padding-left:4px;font-size:24px;font-family:boldpixels;color:var(--text-color);text-shadow:none;'>X1</span> Display counter", "Decides whether to show or hide combo counter")
new SettingBool("supercombobg", true, "<span style='height:24px;background-size:auto 24px;background:url(./assets/fire_stem.png);'>Display super combo </span><span style='white-space:nowrap;'><span style='height:24px;background-size:auto 24px;background:url(./assets/fire_stem.png);'>background</span><img style='position:relative;top:4px;' src='./assets/fire.gif'></span>", "Show or hide super combo flaming pipe background")
new SettingNumber("lettersnumber", 20, -1, null, 1, "Visible letters", "Maximum amount of visible letters when displaying a word combo. -1 to display all")
new SettingColor("textcolor", "#ffff00ff", "Text color", "Text color of regular combo")

new SettingBool("exclam", true, "Ignore !", "Ignore messages starting with exclamation mark (!) in combos")
new SettingBool("bots", true, "Ignore bot messages", "Ignore message if it was sent by bot")
new SettingBool("mentions", true, "Ignore mentions", "Ignore words that start with '@'")
new SettingBool("samemessage", false, "Count spam combo", "Count same word in single message as separate repeats. Aka if someone types 'glorp glorp glorp' it will be counted 3 times")
new SettingArray("botarray", ["nightbot","streamelements","sery_bot","wizebot","moobot","tangiabot","streamlabs"], "Bot names", "List of bot channels to ignore if 'Ignore bot messages' setting is on. Can be used as user blacklist")
new SettingArray("blacklist", ["the", "a", "an", "in", "for", "from", "on", "to", "of", "or", "and", "we","you","i", "i'm", "im","she", "her","he","his","him","it","its","it's", "they", "them", "be", "is", "are", "am", "were", "was", "do",], "Common words filter", "List of words that will be ignored. Can be used as word blacklist. probably edit it in notepad and paste it here XD")

new SettingSelect("integrationtype", 0,{
	0:"None",
	1:"<img style='height:24px;width:36px;object-fit:contain;display:inline-block;position:relative;margin:0;margin-right:8px;' src='./assets/sb_logo.svg'>Streamer.Bot",
	2:"<img style='height:24px;width:36px;object-fit:contain;display:inline-block;position:relative;margin:0;margin-right:8px;' src='./assets/miu_logo.ico'>MixItUp",
	3:"<img style='height:24px;width:36px;object-fit:contain;display:inline-block;position:relative;margin:0;margin-right:8px;' src='./assets/fb_logo.png'>FireBot"
},"Bot integration type", "Allows sending events to chat bots")
new SettingString("sb_ip", "127.0.0.1","Streamerbot websocket ip", "In case you set up custom websocket server ip enter it here")
new SettingNumber("sb_port", 8080, 0, 655353, 1,"Streamerbot websocket port", "Port number of streamer.bot websocket server. default is 8080")
new SettingString("sb_endpoint", "/", "Streamerbot websocket endpoint", "In case you set up custom endpoint for websocket server enter it here")
new SettingString("sb_password", "","Streamerbot websocket password", "In case you set up connection password enter it here", true)
// #endregion
// #region settings menu layout
new LayoutText(new LayoutCondition("always"),"Awesome Chat Combos","Thank you for using ACC overlay. Made by GibbDev. Version 1.2",true)

new LayoutCategory(new LayoutCondition("always"),[
	new LayoutSetting(new LayoutCondition("always"), "channelList", true, true),
	new LayoutSetting(new LayoutCondition("always"), "numberregular", false, true),
	new LayoutSetting(new LayoutCondition("always"), "durationregular", false, true),
	new LayoutSetting(new LayoutCondition("always"), "numbermega", false, true),
	new LayoutSetting(new LayoutCondition("always"), "durationmega", false, true),
	new LayoutSetting(new LayoutCondition("always"), "numbersuper", false, true),
	new LayoutSetting(new LayoutCondition("always"), "durationsuper", false, true),
	new LayoutSetting(new LayoutCondition("always"), "volume", false, true),
],"General",true, false)

new LayoutCategory(new LayoutCondition("always"),[
	new LayoutSetting(new LayoutCondition("always"), "position", false, true),
	new LayoutSetting(new LayoutCondition("always"), "showtimer", false, true),
	new LayoutSetting(new LayoutCondition("always"), "sizemult", false, true),
	new LayoutSetting(new LayoutCondition("always"), "displaywords", false, true),
	new LayoutSetting(new LayoutCondition("always"), "displayemotes", false, true),
	new LayoutSetting(new LayoutCondition("displayemotes",true), "ffz", false, true),
	new LayoutEmpty(new LayoutCondition("displayemotes",true)),
	new LayoutSetting(new LayoutCondition("displayemotes",true), "bttv", false, true),
	new LayoutEmpty(new LayoutCondition("displayemotes",true)),
	new LayoutSetting(new LayoutCondition("displayemotes",true), "seventv", false, true),
	new LayoutSetting(new LayoutCondition("always"), "supercombobg", false, true),
	new LayoutSetting(new LayoutCondition("always"), "showcounter", false, true),
	new LayoutSetting(new LayoutCondition("always"), "lettersnumber", false, true),
	new LayoutSetting(new LayoutCondition("always"), "textcolor", false, true),
]
,"Display",true, false)

new LayoutCategory(new LayoutCondition("always"),[
	new LayoutSetting(new LayoutCondition("always"), "exclam", false, true),
	new LayoutSetting(new LayoutCondition("always"), "samemessage", false, true),
	new LayoutSetting(new LayoutCondition("always"), "bots", false, true),
	new LayoutSetting(new LayoutCondition("bots",true), "botarray", false, true),
	new LayoutSetting(new LayoutCondition("always"), "mentions", false, true),
	new LayoutSetting(new LayoutCondition("always"), "blacklist", false, true),
],"Message filtering",true, false)

new LayoutCategory(new LayoutCondition("always"),[
	new LayoutSetting(new LayoutCondition("always"), "integrationtype", true, true),
	new LayoutSetting(new LayoutCondition("integrationtype",1), "sb_ip", false, true),
	new LayoutSetting(new LayoutCondition("integrationtype",1), "sb_port", false, true),
	new LayoutSetting(new LayoutCondition("integrationtype",1), "sb_endpoint", false, true),
	new LayoutSetting(new LayoutCondition("integrationtype",1), "sb_password", false, true),
],"Bot integration",true, false)
// #endregion

document.addEventListener("settingchanged",(ev)=>{
	switch (ev.id) {
		case "textcolor" : {
			document.documentElement.style.setProperty("--text-color",registeredSettings.get("textcolor").value)
			break
		}
		case "sizemult" : {
			document.documentElement.style.setProperty("--var-scale",parseFloat(registeredSettings.get("sizemult").value))
			break
		}
		case "position" : {
			switch (registeredSettings.get("position").value) {
				case "1" : {
					document.querySelectorAll(".combo-wrapper").forEach((el)=>{
						el.className = ''
						el.classList.add("combo-wrapper","pos-left")
					})
					break
				}
				case "2" : {
					document.querySelectorAll(".combo-wrapper").forEach((el)=>{
						el.className = ''
						el.classList.add("combo-wrapper","pos-top-left")
					})
					break
				}
				case "5" : {
					document.querySelectorAll(".combo-wrapper").forEach((el)=>{
						el.className = ''
						el.classList.add("combo-wrapper","pos-top-right")
					})
					break
				}
				case "3" : {
					document.querySelectorAll(".combo-wrapper").forEach((el)=>{
						el.className = ''
						el.classList.add("combo-wrapper","pos-bottom-right")
					})
					break
				}
				case "4" : {
					document.querySelectorAll(".combo-wrapper").forEach((el)=>{
						el.className = ''
						el.classList.add("combo-wrapper","pos-right")
					})
					break
				}
				case "8" : {
					document.querySelectorAll(".combo-wrapper").forEach((el)=>{
						el.className = ''
						el.classList.add("combo-wrapper","pos-top-center")
					})
					break
				}
				case "6" : {
					document.querySelectorAll(".combo-wrapper").forEach((el)=>{
						el.className = ''
						el.classList.add("combo-wrapper","pos-bottom-center")
					})
					break
				}
				case "7" : {
					document.querySelectorAll(".combo-wrapper").forEach((el)=>{
						el.className = ''
						el.classList.add("combo-wrapper","pos-center")
					})
					break
				}
				default : {
					document.querySelectorAll(".combo-wrapper").forEach((el)=>{
						el.className = ''
						el.classList.add("combo-wrapper","pos-bottom-left")
					})
					break
				}
			}
			break
		}
		case "supercombobg" : {
			if (registeredSettings.get("supercombobg").get()) {
				document.documentElement.style.setProperty("--super-bg", 1)
				document.documentElement.style.setProperty("--super-bg-display", "flex")
			} else {
				document.documentElement.style.setProperty("--super-bg", 0)
				document.documentElement.style.setProperty("--super-bg-display", "none")
			}
			break
		}
		case "showtimer" : {
			if (registeredSettings.get("showtimer").get()) {
				document.documentElement.style.setProperty("--timer", "block")
			} else {
				document.documentElement.style.setProperty("--timer", "none")
			}
			break
		}
		case "integrationtype": {
			switch (registeredSettings.get("integrationtype").get()) {
				case "1" : {
					activeIntegration = INTEGRATION_TYPE.SB
					break
				}
				case "2" : {
					activeIntegration = INTEGRATION_TYPE.MIU
					break
				}
				case "3" : {
					activeIntegration = INTEGRATION_TYPE.FB
					break
				}
				default : {
					activeIntegration = INTEGRATION_TYPE.NONE
					break
				}
			}
		}
	}
})

// #endregion
document.addEventListener("moduleready",(ev)=>{
	if (ev.module == "emotes" && registeredSettings.get("displayemotes").get() == true) {
		postNotification("Loaded emotes for channels: " + channels.toString())
		postNotification("Total emotes loaded: " + (Object.keys(bttvEmoteCodeToId).length + Object.keys(ffzEmoteCodeToId).length + Object.keys(seventvEmoteCodeToId).length + Object.keys(twitchGlobalEmoteCodeToId).length + Object.keys(twitchChannelEmoteCodeToId).length))
	}
})
document.addEventListener("allmodulesready",async ()=>{
	client = new tmi.Client({
		channels: Array.from(channels),
		connection: {reconnect: true},
		skipMembership: true,
		skipUpdatingEmotesets: true,
	});
	client.connect()
	client.on("disconnected", (reason) => {console.log(reason)});
	client.on("message",(channel, tags, message, self)=>{messageInput(channel, tags, message)})
	
	postNotification("Connected to chats: " + channels.toString())
})

var client = null
let channels = []
async function start() {
	if (client && typeof(client.disconnect) == 'function') {
		client.disconnect()
	}
	reload()
	initSettings()
	if (registeredSettings.get("channelList").get().toString() === [].toString()) {
		postNotification('No channel set. Aborting startup')
		return
	} else {
		channels = []
		for await (let channel of Array.from(registeredSettings.get("channelList").get())) {
			const response = await fetch(`https://twitchapi.teklynk.com/getuserstatus.php?channel=${channel}`).catch((err)=>console.log(err))
			let data = (await response.json())["data"]
			if (data.toString() === [].toString()) {
				postNotification('Streamer not found: ' + channel)
			} else {
				channels.push(channel)
			}
		}
		if (channels.toString() === [].toString()) {
			postNotification('No valid channels set. Aborting startup')
			return
		}
	}
	if (activeIntegration != INTEGRATION_TYPE.NONE) {
		integrationConnect()
	} else {
		moduleReady("integration")
	}
	if (registeredSettings.get("displayemotes").get() == true) {
			postNotification("Loading emotes for channels: " + channels.toString())
	}
	fetchEmotes(
		channels,
		registeredSettings.get("ffz").get(),
		registeredSettings.get("bttv").get(),
		registeredSettings.get("seventv").get()
	)
}

function messageInput(channel, tags, message) {
	if (tags["emotes-raw"]) {
		let emotes = getOtherChannelTwitchEmotes(message,tags.emotes)
		for (let emote in emotes) {
			twitchChannelEmoteCodeToId[emote] = emotes[emote].id
		}
	}
	if (registeredSettings.get("bots").get()) {
		if (Array.from(registeredSettings.get("botarray").get()).includes(tags.username)) return
	}
	let words = message.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").replace(/(\!( |$))|([\.\,\?])/g," ").replace(/([\"\'])/g,"").split(" ")
	let foundWordRepeats = []
	let foundEmoteRepeats = []
	for (let word of words) {
		if (word == "" || word == "͏") continue
		if (registeredSettings.get("blacklist").get().includes(word)) continue
		if (word[0] == "@" && registeredSettings.get("mentions").get()) continue
		if (registeredSettings.get("exclam").get() && word[0] == "!") return
		if (getEmoteImageUrl(word)) {
			foundEmoteRepeats.push(word)
			continue
		}
		word = word.toLowerCase()
		if (registeredSettings.get("blacklist").get().includes(word)) continue
		foundWordRepeats.push(word)
	}
	if (registeredSettings.get("samemessage").get() != true) {
		foundWordRepeats = Array.from(new Set(foundWordRepeats))
		foundEmoteRepeats = Array.from(new Set(foundEmoteRepeats))
	}
	handleRepeats(foundWordRepeats, foundEmoteRepeats)
}
var comboWords = {}
function handleRepeats(words, emotes) {
	if (registeredSettings.get("displaywords").get()) {
		for (let word of words) {
			if (comboWords[word]) {
				comboWords[word].repetitions += 1
				comboWords[word].timestamp = new Date().getTime()
				let lastLevel = comboWords[word].level
				comboWords[word].level = getLevel(comboWords[word].repetitions)
				if (lastLevel != comboWords[word].level) {
					switch (comboWords[word].level) {
						case 1 : {
							if (registeredSounds.get("regular_appear")) registeredSounds.get("regular_appear").play()
							sendData("combo_achieved_regular",{"word":word,"repetitions":comboWords[word].repetitions.toString(),"timestamp":(new Date().getTime()).toString(),"level":comboWords[word].level.toString(), "isEmote": false.toString(), "emoteURL": ''})
							break
						}
						case 2 : {
							if (registeredSounds.get("mega_appear")) registeredSounds.get("mega_appear").play()
							sendData("combo_achieved_regular",{"word":word,"repetitions":comboWords[word].repetitions.toString(),"timestamp":(new Date().getTime()).toString(),"level":comboWords[word].level.toString(), "isEmote": false.toString(), "emoteURL": ''})
							break
						}
						case 3 : {
							if (registeredSounds.get("super_appear")) registeredSounds.get("super_appear").play()
							sendData("combo_achieved_regular",{"word":word,"repetitions":comboWords[word].repetitions.toString(),"timestamp":(new Date().getTime()).toString(),"level":comboWords[word].level.toString(), "isEmote": false.toString(), "emoteURL": ''})
							break
						}
					}
				}
			} else {
				comboWords[word] = {
					"repetitions":1,
					"type":"word",
					"timestamp": new Date().getTime(),
					"level": 0,
					"id": uuidv4()
				}
			}
			if (comboWords[word].timeout) clearTimeout(comboWords[word].timeout)
			if (comboWords[word].level == 3) {
				comboWords[word].timeout = setTimeout(()=>{checkTimeouts(word)},registeredSettings.get("durationsuper").get())
				updateWordHTML(word)
			} else if (comboWords[word].level == 2) {
				comboWords[word].timeout = setTimeout(()=>{checkTimeouts(word)},registeredSettings.get("durationmega").get())
				updateWordHTML(word)
			} else if (comboWords[word].level == 1) {
				comboWords[word].timeout = setTimeout(()=>{checkTimeouts(word)},registeredSettings.get("durationregular").get())
				updateWordHTML(word)
			} else {
				comboWords[word].timeout = setTimeout(()=>{checkTimeouts(word)},registeredSettings.get("durationregular").get())
			}
		}
	}
	if (registeredSettings.get("displayemotes").get()) {
		for (let emote of emotes) {
			if (comboWords[emote]) {
				comboWords[emote].repetitions += 1
				comboWords[emote].timestamp = new Date().getTime()
				let lastLevel = comboWords[emote].level
				comboWords[emote].level = getLevel(comboWords[emote].repetitions)
				if (lastLevel != comboWords[emote].level) {
					switch (comboWords[emote].level) {
						case 1 : {
							if (registeredSounds.get("regular_appear")) registeredSounds.get("regular_appear").play()
							sendData("combo_achieved_regular",{"word":emote,"repetitions":comboWords[emote].repetitions,"timestamp":new Date().getTime(),"level":comboWords[emote].level, isEmote: true, emoteURL: getEmoteImageUrl(emote)})
							break
						}
						case 2 : {
							if (registeredSounds.get("mega_appear")) registeredSounds.get("mega_appear").play()
							sendData("combo_achieved_mega",{"word":emote,"repetitions":comboWords[emote].repetitions,"timestamp":new Date().getTime(),"level":comboWords[emote].level, isEmote: true, emoteURL: getEmoteImageUrl(emote)})
							break
						}
						case 3 : {
							if (registeredSounds.get("super_appear")) registeredSounds.get("super_appear").play()
							sendData("combo_achieved_super",{"word":emote,"repetitions":comboWords[emote].repetitions,"timestamp":new Date().getTime(),"level":comboWords[emote].level, isEmote: true, emoteURL: getEmoteImageUrl(emote)})
							break
						}
					}
				}
			} else {
				comboWords[emote] = {
					"repetitions":1,
					"type":"emote",
					"timestamp": new Date().getTime(),
					"level": 0,
					"id": uuidv4()
				}
			}
			if (comboWords[emote].timeout) clearTimeout(comboWords[emote].timeout)
			if (comboWords[emote].level == 3) {
				comboWords[emote].timeout = setTimeout(()=>{checkTimeouts(emote)},registeredSettings.get("durationsuper").get())
				updateEmoteHTML(emote)
			} else if (comboWords[emote].level == 2) {
				comboWords[emote].timeout = setTimeout(()=>{checkTimeouts(emote)},registeredSettings.get("durationmega").get())
				updateEmoteHTML(emote)
			} else if (comboWords[emote].level == 1) {
				comboWords[emote].timeout = setTimeout(()=>{checkTimeouts(emote)},registeredSettings.get("durationregular").get())
				updateEmoteHTML(emote)
			} else {
				comboWords[emote].timeout = setTimeout(()=>{checkTimeouts(emote)},registeredSettings.get("durationregular").get())
			}
		}
	}
}

function getLevel(repetitions) {
	var level = 0
	if (parseInt(registeredSettings.get("numberregular").get()) != 0 && repetitions >= parseInt(registeredSettings.get("numberregular").get())) level = 1
	if (parseInt(registeredSettings.get("numbermega").get()) != 0 && repetitions >= parseInt(registeredSettings.get("numbermega").get())) level = 2
	if (parseInt(registeredSettings.get("numbersuper").get()) != 0 && repetitions >= parseInt(registeredSettings.get("numbersuper").get())) level = 3
	return level
}

function checkTimeouts(word) {
	if (comboWords[word] && comboWords[word].timestamp < new Date().getTime()) {
		let id = comboWords[word].id
		if (document.querySelector("[data-id='"+id+"']")) {
			setTimeout(()=> {
				document.querySelector("[data-id='"+id+"']").remove()
			}, 500) 
			document.querySelector("[data-id='"+id+"']").classList.add("disappear")
		}
		if (registeredSettings.get('volume').get() != 0) {
			switch (comboWords[word].level) {
				case 1 : {
					if (registeredSounds.get("regular_timeout")) registeredSounds.get("regular_timeout").play()
					break
				}
				case 2 : {
					if (registeredSounds.get("mega_timeout")) registeredSounds.get("mega_timeout").play()
					break
				}
				case 3 : {
					if (registeredSounds.get("super_timeout")) registeredSounds.get("super_timeout").play()
					break
				}
			}
		}
		if (comboWords[word].level > 0) {
			var isEmote = false
			var emoteURL = '' 
			if (getEmoteImageUrl(word)) {
				isEmote = true
				emoteURL = getEmoteImageUrl(word)
			}
			sendData("combo_expired",{"word":word,"repetitions":comboWords[word].repetitions,"timestamp":new Date().getTime(),"level":comboWords[word].level, "isEmote": isEmote, "emoteURL": emoteURL})
			switch (comboWords[word].level) {
				case 1 : {
					sendData("combo_expired_regular",{"word":word,"repetitions":comboWords[word].repetitions,"timestamp":new Date().getTime(),"level":comboWords[word].level, "isEmote": isEmote, "emoteURL": emoteURL})
					break
				}
				case 2 : {
					sendData("combo_expired_mega",{"word":word,"repetitions":comboWords[word].repetitions,"timestamp":new Date().getTime(),"level":comboWords[word].level, "isEmote": isEmote, "emoteURL": emoteURL})
					break
				}
				case 3 : {
					sendData("combo_expired_super",{"word":word,"repetitions":comboWords[word].repetitions,"timestamp":new Date().getTime(),"level":comboWords[word].level, "isEmote": isEmote, "emoteURL": emoteURL})
					break
				}
			}
		}


		delete comboWords[word]
	} else {
		console.log("rogue timeout")
	}
}

function updateWordHTML(word) {
	if (comboWords[word].level == 0) return
	let container = document.querySelector("#combo-wrapper")
	var el = document.querySelector("[data-id='" + comboWords[word].id + "']")
	if (el == undefined) {
		el = document.createElement("div")
		container.appendChild(el)
		el.dataset.id = comboWords[word].id
		el.innerHTML = `<div class="entry-bg"><div class="fire-stem"></div><div class="fire"></div></div><div class="entry"><div class="timer"></div><div class="word"></div><div class="counter"></div></div>`
		for (let [i, letter] of Array.from(word).entries()) {
			if (i + 1 <= parseInt(registeredSettings.get("lettersnumber").get())) {
				el.querySelector(".word").innerHTML += `<div class='letter' style='--delay:${i * 0.1}s'>${letter.toUpperCase()}</div>`
			} else {
				el.querySelector(".word").innerHTML += `<div class='letter' style='--delay:${i * 0.1}s'>…</div>`
				break
			}
			i++
		}
	}
	switch (comboWords[word].level) {
		case 1 : {
			el.className = 'entry-wrapper'
			el.querySelector(".timer").style.setProperty("--duration", (parseInt(registeredSettings.get("durationregular").get())).toString() + "ms")
			break
		}
		case 2 : {
			el.className = 'entry-wrapper mega'
			el.querySelector(".timer").style.setProperty("--duration", (parseInt(registeredSettings.get("durationmega").get())).toString() + "ms")
			break
		}
		case 3 : {
			el.className = 'entry-wrapper super'
			el.querySelector(".timer").style.setProperty("--duration", (parseInt(registeredSettings.get("durationsuper").get())).toString() + "ms")
			break
		}
		default : {
			el.className = 'entry-wrapper'
			el.querySelector(".timer").style.setProperty("--duration", (parseInt(registeredSettings.get("durationregular").get())).toString() + "ms")
			break
		}
	}
	el.querySelector(".counter").innerHTML = `<div class='letter'>X</div>`
	for (let [i, letter] of Array.from(comboWords[word].repetitions.toString()).entries()) {
		el.querySelector(".counter").innerHTML += `<div class='letter' style='--delay:${i * 0.1}s'>${letter}</div>`
		i++
	}
	triggerReflow(el.querySelector(".timer"))
}

function updateEmoteHTML(emote) {
	if (comboWords[emote].level == 0) return
	let container = document.querySelector("#combo-wrapper")
	var el = document.querySelector("[data-id='" + comboWords[emote].id + "']")
	if (!el) {
		el = document.createElement("div")
		container.appendChild(el)
		el.dataset.id = comboWords[emote].id
		el.innerHTML = `<div class="entry-bg"><div class="fire-stem"></div><div class="fire"></div></div><div class="entry"><div class="timer"></div><div class="word"></div><div class="counter"></div></div>`
		let url = getEmoteImageUrl(emote)
		el.querySelector(".word").innerHTML = `<img class="letter" src="${url}" onerror="this.src='${url}'">`
	}
	switch (comboWords[emote].level) {
		case 1 : {
			el.className = 'entry-wrapper'
			el.querySelector(".timer").style.setProperty("--duration", (parseInt(registeredSettings.get("durationregular").get())).toString() + "ms")
			break
		}
		case 2 : {
			el.className = 'entry-wrapper mega'
			el.querySelector(".timer").style.setProperty("--duration", (parseInt(registeredSettings.get("durationmega").get())).toString() + "ms")
			break
		}
		case 3 : {
			el.className = 'entry-wrapper super'
			el.querySelector(".timer").style.setProperty("--duration", (parseInt(registeredSettings.get("durationsuper").get())).toString() + "ms")
			break
		}
		default : {
			el.className = 'entry-wrapper'
			el.querySelector(".timer").style.setProperty("--duration", (parseInt(registeredSettings.get("durationregular").get())).toString() + "ms")
			break
		}
	}
	el.querySelector(".counter").innerHTML = `<div class='letter'>X</div>`
	for (let [i, letter] of Array.from(comboWords[emote].repetitions.toString()).entries()) {
		el.querySelector(".counter").innerHTML += `<div class='letter' style='--delay:${i * 0.1}s'>${letter}</div>`
		i++
	}
	triggerReflow(el.querySelector(".timer"))
	
}

/**
* Trigger element styling reflow to restart animations and update css forsibly
* 
* @param {DOMElement} element - elements we want to reflow
*/
function triggerReflow(element) {
	element.style.animation = 'none';
	void element.offsetHeight;
	element.style.animation = null;
}
start()

function postNotification(html) {
	let id = uuidv4()
	setTimeout(()=>{document.querySelectorAll("[data-id='" + id + "']").forEach((el)=>{el.remove()})}, 5000)
	var el = document.createElement('div')
	el.innerHTML = html
	el.dataset.id = id
	document.querySelector("#notification").appendChild(el)
}
