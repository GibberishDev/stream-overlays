// #region init

setModuleList([
    "settings",
    "emotes",
    "sounds",
])


// #region utils
function triggerReflow(element) {
    element.style.animation = 'none';
    void element.offsetHeight;
    element.style.animation = null;
}
function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
// #endregion

new sfx("super_appear","./assets/super.mp3")
new sfx("super_timeout","./assets/super_timeout.mp3")
initSounds()

// #region settings
new SettingArray("channelList", [], "Channels", "List of channels to track chat messages from")
new SettingString("position","bottom-left","Position anchor","Defines position of the anchor for combos. Avaliable values: 'top-left','left','bottom-left','top-center','center','bottom-center','top-right','right','bottom-right'")
new SettingBool("showtimer", false, "Display timer", "Decides whether to show or hide combo expiration timer")
new SettingNumber("sizemult", 1.0, 0.1, null, 0.1, "Scale", "Controls scaling. where 0.1 is smallest at 10% of base size and 2 is bigger and 200% of base size")
new SettingBool("ffz", true, "Enable FFZ emotes", "Include FrankerFaceZ emotes in the set")
new SettingBool("showcounter", true, "Display counter", "Decides whether to show or hide combo counter")
new SettingBool("bttv", true, "Enable BTTV emotes", "Include BetterTTV emotes in the set")
new SettingBool("displayemotes", true, "Display emotes", "Decides whether to replace text with emotes")
new SettingBool("displaywords", true, "Display words", "Decides whether to count text combos. Meant as emote only mode, unless you turned emotes off and... bruh ._.")
new SettingBool("seventv", true, "Enable 7TV emotes", "Include 7TV emotes in the set")
new SettingBool("exclam", true, "Ignore !", "Ignore messages starting with exclamation mark (!) in combos")
new SettingBool("bots", true, "Ignore bot messages", "Ignore message if it was sent by bot")
new SettingBool("mentions", true, "Ignore mentions", "Ignore words that start with '@'")
new SettingBool("supercombobg", true, "Display super combo background", "Show or hide super combo flaming pipe background")
new SettingBool("samemessage", false, "Count spam combo", "Count same word in single message as separate repeats. Aka if someone types 'glorp glorp glorp' it will be counted 3 times")
new SettingArray("botarray", ["nightbot","streamelements","sery_bot","wizebot","moobot","tangiabot","streamlabs"], "Bot names", "List of bot channels to ignore if 'Ignore bot messages' setting is on. Can be used as user blacklist")
new SettingArray("blacklist", ["the", "a", "an", "in", "for", "from", "on", "to", "of", "or", "and", "we","you","i", "i'm", "im","she", "her","he","his","him","it","its","it's", "they", "them", "be", "is", "are", "am", "were", "was", "do",], "Common words filter", "List of words that will be ignored. Can be used as word blacklist")
new SettingNumber("lettersnumber", 20, -1, null, 1, "Visible letters", "Maximum amount of visible letters when displaying a word combo. -1 to display all")
new SettingColor("textcolor", "#ffff00ff", "Text color", "Text color of regular combo")
new SettingNumber("numberregular", 2, 0, null, 1,"Required repetitions: Regular", "Minimum number of repeats in chat to display combo. 0 means disabled")
new SettingNumber("durationregular", 10000, 0, null, 100,"Duration: Regular", "Time in milliseconds until combo expires. Values below 2500 practically mean combo expires before twitch api sends information")
new SettingNumber("numbermega", 10, 0, null, 1,"Required repetitions: Mega", "Minimum number of repeats in chat to display mega combo animation. 0 means disabled")
new SettingNumber("durationmega", 15000, 0, null, 100,"Duration: Mega", "Time in milliseconds until mega combo expires. Values below 2500 practically mean combo expires before twitch api sends information")
new SettingNumber("numbersuper", 25, 0, null, 1,"Required repetitions: Super", "Minimum number of repeats in chat to display super combo animation. 0 means disabled")
new SettingNumber("durationsuper", 20000, 0, null, 100,"Duration: Super", "Time in milliseconds until super combo expires. Values below 2500 practically mean combo expires before twitch api sends information")
new SettingNumber("volume", 100, 0, 100, 1,"Sound effects volume", "Volume of sound effects. cool description")

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
                case "left" : {
                    document.querySelectorAll(".combo-wrapper").forEach((el)=>{
                        el.className = ''
                        el.classList.add("combo-wrapper","pos-left")
                    })
                    break
                }
                case "top-left" : {
                    document.querySelectorAll(".combo-wrapper").forEach((el)=>{
                        el.className = ''
                        el.classList.add("combo-wrapper","pos-top-left")
                    })
                    break
                }
                case "top-right" : {
                    document.querySelectorAll(".combo-wrapper").forEach((el)=>{
                        el.className = ''
                        el.classList.add("combo-wrapper","pos-top-right")
                    })
                    break
                }
                case "bottom-right" : {
                    document.querySelectorAll(".combo-wrapper").forEach((el)=>{
                        el.className = ''
                        el.classList.add("combo-wrapper","pos-bottom-right")
                    })
                    break
                }
                case "right" : {
                    document.querySelectorAll(".combo-wrapper").forEach((el)=>{
                        el.className = ''
                        el.classList.add("combo-wrapper","pos-right")
                    })
                    break
                }
                case "top-center" : {
                    document.querySelectorAll(".combo-wrapper").forEach((el)=>{
                        el.className = ''
                        el.classList.add("combo-wrapper","pos-top-center")
                    })
                    break
                }
                case "bottom-center" : {
                    document.querySelectorAll(".combo-wrapper").forEach((el)=>{
                        el.className = ''
                        el.classList.add("combo-wrapper","pos-bottom-center")
                    })
                    break
                }
                case "center" : {
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
        case "numberregular" : {
            if (registeredSettings.get("numberregular").get() == 0) {
                document.querySelector("#preview-entry-regular").style.display = "none"
            } else {
                document.querySelector("#preview-entry-regular").style.display = ""
                let counter = document.querySelector("#preview-counter-regular")
                el = "<div class='letter'>X</div>"
                Array.from(registeredSettings.get("numberregular").get().toString()).forEach((letter)=>{el+="<div class='letter'>"+ letter +"</div>"})
                counter.innerHTML = el
            }
            break
        }
        case "numbermega" : {
            if (registeredSettings.get("numbermega").get() == 0) {
                document.querySelector("#preview-entry-mega").style.display = "none"
            } else {
                document.querySelector("#preview-entry-mega").style.display = ""
                let counter = document.querySelector("#preview-counter-mega")
                el = "<div class='letter'>X</div>"
                Array.from(registeredSettings.get("numbermega").get().toString()).forEach((letter)=>{el+="<div class='letter'>"+ letter +"</div>"})
                counter.innerHTML = el
            }
            break
        }
        case "numbersuper" : {
            if (registeredSettings.get("numbersuper").get() == 0) {
                document.querySelector("#preview-entry-super").style.display = "none"
            } else {
                document.querySelector("#preview-entry-super").style.display = ""
                let counter = document.querySelector("#preview-counter-super")
                el = "<div class='letter'>X</div>"
                Array.from(registeredSettings.get("numbersuper").get().toString()).forEach((letter)=>{el+="<div class='letter'>"+ letter +"</div>"})
                counter.innerHTML = el
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
    }
})
// #endregion
document.addEventListener("moduleready",(ev)=>{
    if (ev.module == "emotes" && registeredSettings.get("displayemotes").get() == true) {
        var notifId = uuidv4()
        document.querySelector("#notification").innerHTML += "<div data-id='" + notifId + "'>Loaded emotes for channels: " + channels.toString() + "</div>"
        document.querySelector("#notification").innerHTML += "<div data-id='" + notifId + "'>Total emotes loaded: " + (Object.keys(bttvEmoteCodeToId).length + Object.keys(ffzEmoteCodeToId).length + Object.keys(seventvEmoteCodeToId).length + Object.keys(twitchGlobalEmoteCodeToId).length + Object.keys(twitchChannelEmoteCodeToId).length) + "</div>"
        // document.querySelector("#notification").innerHTML += "<div data-id='" + notifId + "'>Twitch global: " + (Object.keys(twitchGlobalEmoteCodeToId).length) + "</div>"
        // document.querySelector("#notification").innerHTML += "<div data-id='" + notifId + "'>Twitch channel: " + (Object.keys(twitchChannelEmoteCodeToId).length) + "</div>"
        // document.querySelector("#notification").innerHTML += "<div data-id='" + notifId + "'>FFZ: " + (Object.keys(ffzEmoteCodeToId).length) + "</div>"
        // document.querySelector("#notification").innerHTML += "<div data-id='" + notifId + "'>BTTV: " + (Object.keys(bttvEmoteCodeToId).length) + "</div>"
        // document.querySelector("#notification").innerHTML += "<div data-id='" + notifId + "'>7TV: " + (Object.keys(seventvEmoteCodeToId).length) + "</div>"
        setTimeout(()=>{document.querySelectorAll("[data-id='" + notifId + "']").forEach((el)=>{el.remove()})}, 5000)
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
    
    var notifId = uuidv4()
    document.querySelector("#notification").innerHTML += "<div data-id='" + notifId + "'>Connected to chats: " + channels.toString() + "</div>"
    setTimeout(()=>{document.querySelectorAll("[data-id='" + notifId + "']").forEach((el)=>{el.remove()})}, 5000)
})
// #endregion
var client = null
let channels = []
async function start() {
    if (client && typeof(client.disconnect) == 'function') {
        client.disconnect()
    }
    reload()
    initSettings()
    if (registeredSettings.get("channelList").get().toString() === [].toString()) {
        var notifId = uuidv4()
        document.querySelector("#notification").innerHTML += "<div data-id='" + notifId + "'>No channel set. Aborting startup</div>"
        setTimeout(()=>{if(document.querySelector("[data-id='" + notifId + "']"))document.querySelector("[data-id='" + notifId + "']").remove()}, 5000)
        return
    } else {
        channels = []
        for await (let channel of Array.from(registeredSettings.get("channelList").get())) {
            const response = await fetch(`https://twitchapi.teklynk.com/getuserstatus.php?channel=${channel}`)
            let data = (await response.json())["data"]
            if (data.toString() === [].toString()) {
                var notifId2 = uuidv4()
                document.querySelector("#notification").innerHTML += "<div data-id='" + notifId2 + "'>Streamer not found: " + channel + "</div>"
                setTimeout(()=>{document.querySelectorAll("[data-id='" + notifId2 + "']").forEach((el)=>{el.remove()})}, 5000)
            } else {
                channels.push(channel)
            }
        }
        if (channels.toString() === [].toString()) {
            var notifId = uuidv4()
            document.querySelector("#notification").innerHTML += "<div data-id='" + notifId + "'>No valid channels set. Aborting startup</div>"
            setTimeout(()=>{if(document.querySelector("[data-id='" + notifId + "']"))document.querySelector("[data-id='" + notifId + "']").remove()}, 5000)
            return
        }
    }
    if (registeredSettings.get("displayemotes").get() == true) {
        var notifId = uuidv4()
        document.querySelector("#notification").innerHTML += "<div data-id='" + notifId + "'>Loading emotes for channels: " + channels.toString() + "</div>"
        setTimeout(()=>{if(document.querySelector("[data-id='" + notifId + "']"))document.querySelector("[data-id='" + notifId + "']").remove()}, 5000)
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
    }
    handleRepeats(foundWordRepeats, foundEmoteRepeats)
}
var comboWords = {}
function handleRepeats(words, emotes) {
    if (registeredSettings.get("displaywords")) {
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
                            break
                        }
                        case 2 : {
                            if (registeredSounds.get("mega_appear")) registeredSounds.get("mega_appear").play()
                            break
                        }
                        case 3 : {
                            if (registeredSounds.get("super_appear")) registeredSounds.get("super_appear").play()
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
    if (registeredSettings.get("displayemotes")) {
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
                            break
                        }
                        case 2 : {
                            if (registeredSounds.get("mega_appear")) registeredSounds.get("mega_appear").play()
                            break
                        }
                        case 3 : {
                            if (registeredSounds.get("super_appear")) registeredSounds.get("super_appear").play()
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
        console.log(url)
        el.querySelector(".word").innerHTML = `<img class="letter" src="${url}" onerror="this.src=${url}">`
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