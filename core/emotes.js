import {moduleReady} from "./ready.js"

export let bttvEmoteCodeToId = new Map()
export let ffzEmoteCodeToId = new Map()
export let seventvEmoteCodeToId = new Map()
export let twitchGlobalEmoteCodeToId = new Map()
export let twitchChannelEmoteCodeToId = new Map()

// Uses teklynk's https://github.com/teklynk/twitch_api_public
export async function fetchEmotes(channels) {
    let response = await fetch("https://twitchapi.teklynk.com/getglobalemotes.php")
    var emotes = (await response.json())["data"]
    twitchGlobalEmoteCodeToId = new Map(emotes.map(emote => [emote["name"], emote["id"]]))
    for await (let channel of channels) {
        response = await fetch(`https://twitchapi.teklynk.com/getuseremotes.php?channel=${channel}`)
        emotes = (await response.json())["data"]
        emotes.forEach(emote => twitchChannelEmoteCodeToId.getOrInsert(emote["name"], emote["id"]))
        
        response = await fetch(`https://twitchapi.teklynk.com/get7tvemotes.php?channel=${channel}`)
        if (response.ok) {
            let responseJson = await response.json()
            emotes = responseJson["emotes"]
            
            if (Array.isArray(emotes)) {
                emotes.map(emote => seventvEmoteCodeToId.getOrInsert(emote["name"], emote["id"]))
            }
            // 'emote_set' emotes may be a subset of 'emote_sets' emotes, can implement more querying if needed
            if (responseJson["emote_set"] != undefined) {
                let emoteSetEmotes = responseJson["emote_set"]["emotes"]
                if (Array.isArray(emoteSetEmotes)) {
                    for (let emoteSetEmote of emoteSetEmotes) {
                        seventvEmoteCodeToId.getOrInsert(emoteSetEmote["name"], emoteSetEmote["id"])
                    }
                }
            }
        }

        response = await fetch(`https://twitchapi.teklynk.com/getbttvemotes.php?channel=${channel}`)
        if (response.ok) {
            emotes = await response.json()
            if (Array.isArray(emotes)) {
                emotes.map(emote => bttvEmoteCodeToId.getOrInsert(emote["code"], emote["id"]))
            }
        }

        response = await fetch(`https://twitchapi.teklynk.com/getffzemotes.php?channel=${channel}`)
        if (response.ok) {
            emotes = await response.json()
            if (Array.isArray(emotes)) {
                emotes.map(emote => ffzEmoteCodeToId.getOrInsert(emote["code"], emote["id"]))
            }
        }
    }
    moduleReady("emotes")
}

export function getEmoteImageUrl(word) {
    let id = twitchGlobalEmoteCodeToId.get(word)
    if (id) return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0`
    id = twitchChannelEmoteCodeToId.get(word)
    if (id) return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0`
    id = bttvEmoteCodeToId.get(word)
    if (id) return `https://cdn.betterttv.net/emote/${id}/3x`
    id = ffzEmoteCodeToId.get(word)
    if (id) return `https://cdn.frankerfacez.com/emote/${id}/4`
    id = seventvEmoteCodeToId.get(word)
    if (id) return `https://cdn.7tv.app/emote/${id}/4x.webp`
    return null
}
