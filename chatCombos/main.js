import { fetchEmotes, getEmoteImageUrl, bttvEmoteCodeToId, ffzEmoteCodeToId, seventvEmoteCodeToId, twitchChannelEmoteCodeToId, twitchGlobalEmoteCodeToId } from "../core/scripts/emotes.js"
import { moduleReady, setModuleList } from "../core/scripts/ready.js"
import { Setting, SETTING_TYPE, SettingArray, SettingInt } from "../core/scripts/settings.js"

const stack = document.querySelector(".combo-stack")
const wrapper = document.querySelector("wrapper")
const wordsBlacklist = [
    "the", "a", "an",
    "in", "for", "from", "on", "to", "of", "or", "and",
    "we","you","i", "i'm", "im","she", "her","he","his","him","it", "they", "them",
    "be", "is", "are", "am", "were", "was", "do",
]

var settings = {
    timeoutRegular : 10000,
    timeoutMega : 15000,
    timeoutSuper : 20000,
    numberRegular : 2,
    numberMega : 10,
    numberSuper : 25,
    showTimer: true,
    megaEnabled : true,
    superEnabled : true,
    channel: "gibbdev",
}
var comboWords = {}

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function messageInput(message) {
    var words = new Set(message.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").split(" "))
    for (let word of words) {
        if (!getEmoteImageUrl(word)) {
            word = word.toLowerCase()
        }
        if (word == "" || word == "͏") continue /*empty and special character inserted by 7tv and other extensions to bypass delay*/
        if (wordsBlacklist.includes(word)) continue
        if (comboWords[word] == undefined) {
            comboWords[word] = {
                "timestamp" : new Date().getTime(),
                "repetitions" : 1,
                "selector" : uuidv4()
            }
        } else {
            comboWords[word].timestamp = new Date().getTime()
            comboWords[word].repetitions += 1
        }

        if (comboWords[word].repetitions < settings.numberMega) {
            comboWords[word].level = 0
        } else if (comboWords[word].repetitions < settings.numberSuper && settings.megaEnabled) {
            comboWords[word].level = 1
        } else if (settings.superEnabled) {
            comboWords[word].level = 2
        }
        addTimeout(word)
    }
    updateHTML(words)

}
// #region data handling
/**
    * Adds timeout checks for word combo ro attempt to remove the combo words when timer runs out
    * @param {String} word - word to add timeouts for
    */
function addTimeout(word) {
    if (comboWords[word].level < 1) {
        setTimeout(()=>{checkTimeouts(word)}, settings.timeoutRegular)
    } else if (comboWords[word].level < 2) {
        setTimeout(()=>{checkTimeouts(word)}, settings.timeoutMega)
    } else {
        setTimeout(()=>{checkTimeouts(word)}, settings.timeoutSuper)
    }
}

/**
    * Attempts to remove word combo from html and data if word timestamp is older than timeout
    * @param {*} word word to check for
    */
function checkTimeouts(word) {
    if (comboWords[word] == undefined) return
    if (comboWords[word].level < 1) {
        if (comboWords[word].timestamp + settings.timeoutRegular <= new Date().getTime()) {removeHTML(word)}
    } else if (comboWords[word].level < 2) {
        if (comboWords[word].timestamp + settings.timeoutMega <= new Date().getTime()) {removeHTML(word)}
    } else {
        if (comboWords[word].timestamp + settings.timeoutSuper <= new Date().getTime()) {removeHTML(word)}
    }
}
// #endregion
function updateHTML(words) {
    for (let word of words) {
        if (comboWords[word] == undefined) continue
        var entry = stack.querySelector("#word-" + comboWords[word].selector)
        if (entry != undefined) {
            if (comboWords[word].level < 1) {
                entry.querySelector(".word").classList.remove("wave","shake")
            } else if (comboWords[word].level < 2) {
                entry.querySelector(".word").classList.remove("shake")
                entry.querySelector(".word").classList.add("wave")
                if (settings.showTimer && entry.querySelector(".timer") != undefined) entry.querySelector(".timer").style.setProperty("--duration", parseInt(settings.timeoutMega) + "ms")
            } else {
                entry.querySelector(".word").classList.remove("wave")
                entry.querySelector(".word").classList.add("shake")
                if (settings.showTimer && entry.querySelector(".timer") != undefined) entry.querySelector(".timer").style.setProperty("--duration", parseInt(settings.timeoutSuper) + "ms")
            }
            entry.querySelector(".counter").textContent = "X" + comboWords[word].repetitions
            if (settings.showTimer && entry.querySelector(".timer") != undefined) triggerReflow(entry.querySelector(".timer"))
            triggerReflow(entry.querySelector(".counter"))
        } else {
            createWordHTML(word)
        }
    }
}

function createWordHTML(word) {
    if (comboWords[word] == undefined) return
    if (comboWords[word].repetitions < settings.numberRegular) {return}
    let el = document.createElement("div")
    stack.appendChild(el)
    el.id = "word-" + comboWords[word].selector
    el.classList.add("entry","combo-word")
    el.innerHTML = `<div class="word"></div><div class="counter"></div>`
    if (settings.showTimer) {
        el.innerHTML += "<div class='timer'></div>"
        el.querySelector(".timer").style.setProperty("--duration", parseInt(settings.timeoutRegular) + "ms")
    }
    if (getEmoteImageUrl(word)) {
        el.querySelector(".word").innerHTML = "<img class='letter' src='" + getEmoteImageUrl(word) + "'/>"
    } else {
        let i = 0;
        for (let letter of word.split("")) {
            let letterEl = document.createElement("div")
            letterEl.classList.add("letter")
            letterEl.innerText = letter.toUpperCase()
            letterEl.style.animationDelay = (0.1 * i) + "s"
            el.querySelector(".word").appendChild(letterEl)
            i++
        }
    }
    el.querySelector(".counter").textContent = "X" + comboWords[word].repetitions
}

function removeHTML(word) {
    let el = stack.querySelector("#word-"+ comboWords[word].selector)
    delete comboWords[word]
    if (el == undefined) return 
    el.classList.add("disappear")
    setTimeout(()=>{
        if (el != undefined) {el.remove()}
    }, 500)
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


function getOptions() {
    let params = new URLSearchParams(window.location.search)
    if (params.get("channel")) {
        settings.channel = params.get("channel").split(",")[0]
    }
    if (params.get("position")) {
        switch (params.get("position")) {
            case "left" : {
                document.querySelector(".wrapper").style.setProperty("justify-content","start")
                document.querySelector(".combo-stack").style.setProperty("justify-content","center")
                document.querySelector(".combo-stack").style.setProperty("flex-direction","column")
                break
            }
            case "right" : {
                document.querySelector(".wrapper").style.setProperty("justify-content","end")
                document.querySelector(".combo-stack").style.setProperty("justify-content","center")
                document.querySelector(".combo-stack").style.setProperty("flex-direction","column")
                break
            }
            case "center" : {
                document.querySelector(".wrapper").style.setProperty("justify-content","center")
                document.querySelector(".combo-stack").style.setProperty("justify-content","center")
                document.querySelector(".combo-stack").style.setProperty("flex-direction","column")
                break
            }
            case "top-left" : {
                document.querySelector(".wrapper").style.setProperty("justify-content","start")
                document.querySelector(".combo-stack").style.setProperty("justify-content","start")
                document.querySelector(".combo-stack").style.setProperty("flex-direction","column")
                break
            }
            case "top-right" : {
                document.querySelector(".wrapper").style.setProperty("justify-content","end")
                document.querySelector(".combo-stack").style.setProperty("justify-content","start")
                document.querySelector(".combo-stack").style.setProperty("flex-direction","column")
                break
            }
            case "top-center" : {
                document.querySelector(".wrapper").style.setProperty("justify-content","center")
                document.querySelector(".combo-stack").style.setProperty("justify-content","start")
                document.querySelector(".combo-stack").style.setProperty("flex-direction","column")
                break
            }
            case "bottom-left" : {
                document.querySelector(".wrapper").style.setProperty("justify-content","start")
                document.querySelector(".combo-stack").style.setProperty("justify-content","end")
                document.querySelector(".combo-stack").style.setProperty("flex-direction","column-reverse")
                break
            }
            case "bottom-right" : {
                document.querySelector(".wrapper").style.setProperty("justify-content","end")
                document.querySelector(".combo-stack").style.setProperty("justify-content","end")
                document.querySelector(".combo-stack").style.setProperty("flex-direction","column-reverse")
                break
            }
            case "bottom-center" : {
                document.querySelector(".wrapper").style.setProperty("justify-content","center")
                document.querySelector(".combo-stack").style.setProperty("justify-content","end")
                document.querySelector(".combo-stack").style.setProperty("flex-direction","column-reverse")

                
                break
            }
            case _ : {
                document.querySelector(".wrapper").style.setProperty("justify-content","end")
                document.querySelector(".combo-stack").style.setProperty("justify-content","end")
                document.querySelector(".combo-stack").style.setProperty("flex-direction","column-reverse")
                break
            }
        }
    } else {
        document.querySelector(".wrapper").style.setProperty("justify-content","start")
        document.querySelector(".combo-stack").style.setProperty("justify-content","end")
        document.querySelector(".combo-stack").style.setProperty("flex-direction","column-reverse")
    }
    if (params.get("show-timer")) {
        if (params.get("show-timer") == "false") {
            settings.showTimer = false
        } else {
            settings.showTimer = true
        }
    }
    if (params.get("number-regular")) {
        if (isNaN(parseInt(params.get("number-regular")))) {
            settings.numberRegular = 2
        } else {
            settings.numberRegular = parseInt(params.get("number-regular"))
        }
    }
    if (params.get("number-mega")) {
        if (isNaN(parseInt(params.get("number-mega")))) {
            settings.numberMega = 10
        } else {
            settings.numberMega = parseInt(params.get("number-mega"))
        }
    }
    if (params.get("number-super")) {
        if (isNaN(parseInt(params.get("number-super")))) {
            settings.numberSuper = 25
        } else {
            settings.numberSuper = parseInt(params.get("number-super"))
        }
    }
    if (params.get("timeout-super")) {
        if (isNaN(parseInt(params.get("timeout-super")))) {
            settings.timeoutSuper = 20000
        } else {
            settings.timeoutSuper = parseInt(params.get("timeout-super"))
        }
    }
    if (params.get("timeout-mega")) {
        if (isNaN(parseInt(params.get("timeout-mega")))) {
            settings.timeoutMega = 15000
        } else {
            settings.timeoutMega = parseInt(params.get("timeout-mega"))
        }
    }
    if (params.get("timeout-regular")) {
        if (isNaN(parseInt(params.get("timeout-regular")))) {
            settings.timeoutRegular = 15000
        } else {
            settings.timeoutRegular = parseInt(params.get("timeout-regular"))
        }
    }
}

getOptions()

document.addEventListener("allmodulesready", () => {
    document.querySelector("#notification").innerHTML = "<div class=''>Loaded emotes:</div>"
    document.querySelector("#notification").innerHTML += "<div class=''>Twitch native - " + (twitchGlobalEmoteCodeToId.size)  + "</div>"
    document.querySelector("#notification").innerHTML += "<div class=''>Twitch channel - " + (twitchChannelEmoteCodeToId.size)  + "</div>"
    document.querySelector("#notification").innerHTML += "<div class=''>7TV - " + (seventvEmoteCodeToId.size)  + "</div>"
    document.querySelector("#notification").innerHTML += "<div class=''>FFZ - " + (ffzEmoteCodeToId.size)  + "</div>"
    document.querySelector("#notification").innerHTML += "<div class=''>BTTV - " + (bttvEmoteCodeToId.size)  + "</div>"
    document.querySelector("#notification").innerHTML += "<div class=''>Total - " + (bttvEmoteCodeToId.size + ffzEmoteCodeToId.size + seventvEmoteCodeToId.size + twitchGlobalEmoteCodeToId.size + twitchChannelEmoteCodeToId.size)  + "</div>"
    document.querySelector("#notification").innerHTML += "<div class=''></div>"
    document.querySelector("#notification").innerHTML += "<div class=''>Awesome chat combos v1.0 by Gibbdev 2026</div>"
    setTimeout(()=>{document.querySelector("#notification").innerHTML = ""}, 5000)
    let cl = new tmi.Client({
        channels: ["j_shiba"],
        connection: {reconnect: true},
        skipMembership: true,
        skipUpdatingEmotesets: true,
    });
    cl.connect();
    cl.on("chat",(channel, tags, message, self)=>{messageInput(message)})
})

function reorder() {
    
}


let modules = ["settings","emotes"]
setModuleList(modules)
fetchEmotes(["j_shiba"])
moduleReady("settings")


// #region init
// #region settings
new SettingArray("channels", [], "Channels", "List of channels to track for combo messages")
new SettingInt("numberNormal")
// #endregion

// #endregion