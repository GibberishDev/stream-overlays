let bttvEmoteCodeToId = {}
let ffzEmoteCodeToId = {}
let seventvEmoteCodeToId = {}
let twitchGlobalEmoteCodeToId = {}
let twitchChannelEmoteCodeToId = {}

// Uses teklynk's https://github.com/teklynk/twitch_api_public
async function fetchEmotes(channels,ffz=true,bttv=true,seventv=true) {
    bttvEmoteCodeToId = {}
    ffzEmoteCodeToId = {}
    seventvEmoteCodeToId = {}
    twitchGlobalEmoteCodeToId = {}
    twitchChannelEmoteCodeToId = {}
    let response = await fetch("https://twitchapi.teklynk.com/getglobalemotes.php")
    var emotes = (await response.json())["data"]
    for (let item in emotes) {
        twitchGlobalEmoteCodeToId[emotes[item]["name"]]=emotes[item]["id"]
    }
    
    for await (let channel of channels) {
        response = await fetch(`https://twitchapi.teklynk.com/getuseremotes.php?channel=${channel}`)
        emotes = (await response.json())["data"]
        for (let item in emotes) {
            twitchChannelEmoteCodeToId[emotes[item]["name"]]=emotes[item]["id"]
        }
        
        if (seventv) {
            response = await fetch(`https://twitchapi.teklynk.com/get7tvemotes.php?channel=${channel}`)
            if (response.ok) {
                let responseJson = await response.json()
                emotes = responseJson["emotes"]
                
                if (Array.isArray(emotes)) {
                    for (let item in emotes) {
                        seventvEmoteCodeToId[emotes[item]["name"]]=emotes[item]["id"]
                    }
                }
                // 'emote_set' emotes may be a subset of 'emote_sets' emotes, can implement more querying if needed
                if (responseJson["emote_set"] != undefined) {
                    let emoteSetEmotes = responseJson["emote_set"]["emotes"]
                    if (Array.isArray(emoteSetEmotes)) {
                        for (let emoteSetEmote of emoteSetEmotes) {
                            seventvEmoteCodeToId[emoteSetEmote["name"]]= emoteSetEmote["id"]
                        }
                    }
                }
            }
        }

        if (bttv) {
            response = await fetch(`https://twitchapi.teklynk.com/getbttvemotes.php?channel=${channel}`)
            if (response.ok) {
                emotes = await response.json()
                if (Array.isArray(emotes)) {
                    for (let item in emotes) {
                        bttvEmoteCodeToId[emotes[item]["code"]]=emotes[item]["id"]
                    }
                }
            }
        }

        if (ffz) {
            response = await fetch(`https://twitchapi.teklynk.com/getffzemotes.php?channel=${channel}`)
            if (response.ok) {
                emotes = await response.json()
                if (Array.isArray(emotes)) {
                    for (let item in emotes) {
                        ffzEmoteCodeToId[emotes[item]["code"]]=emotes[item]["id"]
                    }
                }
            }
        }
    }
    if (typeof moduleReady === 'function') moduleReady("emotes")
}

function getEmoteImageUrl(word) {
    var id = ""
    if (Object.keys(twitchGlobalEmoteCodeToId).includes(word)) {
        id = twitchGlobalEmoteCodeToId[word]
        return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0`
    }
    if (Object.keys(twitchChannelEmoteCodeToId).includes(word)) {
        id = twitchChannelEmoteCodeToId[word]
        return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0`
    }
    if (Object.keys(bttvEmoteCodeToId).includes(word)) {
        id = bttvEmoteCodeToId[word]
        return `https://cdn.betterttv.net/emote/${id}/3x`
    }
    if (Object.keys(ffzEmoteCodeToId).includes(word)) {
        id = ffzEmoteCodeToId[word]
        return `https://cdn.frankerfacez.com/emote/${id}/4`
    }
    if (Object.keys(seventvEmoteCodeToId).includes(word)) {
        id = seventvEmoteCodeToId[word]
        return `https://cdn.7tv.app/emote/${id}/4x.webp`
    }
    return null
}
/**
 * Parses message emotes from tmi.js emote data.
 * For example message "BOO bullet362Rage"
 * with data {"emotesv2_28a0eb74e5de47f19caa4c9ad3cfa379":["4-16"}
 * would be parsed as a JS Map with key:value pair {"bullet362Rage":{"id":"emotesv2_28a0eb74e5de47f19caa4c9ad3cfa379","occurances":[{"from":4,"to":17}]}
 * @param {String} message message text
 * @param {Object} tmiEmoteData Object that is returned on message events from tmi.js
 * @returns {Object} returns object with emote name ids and occurances
 */
function getOtherChannelTwitchEmotes(message, tmiEmoteData) {
    let emotes = {}
    for (let emoteID in tmiEmoteData) {
        var occurancesStr = tmiEmoteData[emoteID]
        let occurances = []
        for (let str of occurancesStr) {
            occurances.push({
                "from":parseInt(str.split("-")[0]),
                "to": parseInt(str.split("-")[1]) + 1
            })
        }
        let name = message.slice(occurances[0].from, occurances[0].to)
        emotes[name]={
            "id": emoteID,
            "occurances": occurances
        }
    }
    return emotes
}