// #region init

setModuleList([
    "settings",
    "emotes",
])

new SettingArray("channels", [], "Channels", "List of channels to track chat messages from")
new SettingString("position","bottom-left","Position anchor","Defines position of the anchor for combos. Avaliable values: 'top-left','left','bottom-left','top-right','right','bottom-right'")
new SettingBool("showtimer", true, "Display timer", "Decides whether to show or hide combo expiration timer")
new SettingBool("ffz", true, "Enable FFZ emotes", "Include FrankerFaceZ emotes in the set")
new SettingBool("showcounter", true, "Display counter", "Decides whether to show or hide combo counter")
new SettingBool("bttv", true, "Enable BTTV emotes", "Include BetterTTV emotes in the set")
new SettingBool("displayemotes", true, "Display emotes", "Decides whether to replace text with emotes")
new SettingBool("seventv", true, "Enable 7TV emotes", "Include 7TV emotes in the set")
new SettingBool("exclam", false, "Include !", "Include words starting with exclamation mark (!) in combos")
new SettingBool("bots", true, "Ignore bot messages", "Ignore message if it was sent by bot")
new SettingArray("botarray", ["nightbot","streamelements","sery_bot","wizebot","moobot","tangiabot","streamlabs"], "Bot names", "List of bot channels to ignore if 'Ignore bot messages' setting is on")
new SettingEmpty()
new SettingNumber("lettersnumber", 20, -1, null, 1, "Visible letters", "Maximum amount of visible letters when displaying a word combo. -1 to display all")
new SettingEmpty()
new SettingColor("textcolor", "#ffff00ff", "Text color", "Text color of regular combo")
new SettingEmpty()
new SettingEmpty()
new SettingEmpty()
new SettingNumber("numberregular", 2, -1, null, 1,"Required repetitions: Regular", "Minimum number of repeats in chat to display combo. -1 means disabled")
new SettingNumber("numbermega", 10, -1, null, 1,"Required repetitions: Mega", "Minimum number of repeats in chat to display mega combo animation. -1 means disabled")
new SettingNumber("numbersuper", 25, -1, null, 1,"Required repetitions: Super", "Minimum number of repeats in chat to display super combo animation. -1 means disabled")
new SettingNumber("durationregular", 10000, 0, null, 100,"Duration: Regular", "Time in milliseconds until combo expires. Values below 2500 practically mean combo expires before twitch api sends information")
new SettingNumber("durationmega", 15000, 0, null, 100,"Duration: Mega", "Time in milliseconds until mega combo expires. Values below 2500 practically mean combo expires before twitch api sends information")
new SettingNumber("durationsuper", 20000, 0, null, 100,"Duration: Super", "Time in milliseconds until super combo expires. Values below 2500 practically mean combo expires before twitch api sends information")

initSettings()
// #endregion
function start() {
    if (registeredSettings.get("channels").get().toString() === [].toString()) {
        document.querySelector("#notification").innerHTML += "<div>No channel set. Aborting startup</div>"
    } else {
        if (registeredSettings.get("displayemotes").get() == true) {
            var notifId = uuidv4()
            document.querySelector("#notification").innerHTML += "<div data-id='" + notifId + "'>Loading emotes for channels: " + registeredSettings.get("channels").value.toString() + "</div>"
            setTimeout(()=>{document.querySelector("[data-id='" + notifId + "']").remove()}, 5000)
            fetchEmotes(registeredSettings.get("channels").value)
            document.addEventListener("moduleready",(ev)=>{if(ev.module == "emotes"){
                var notifId = uuidv4()
                document.querySelector("#notification").innerHTML += "<div data-id='" + notifId + "'>Loaded emotes for channels: " + registeredSettings.get("channels").value.toString() + "</div>"
                setTimeout(()=>{document.querySelector("[data-id='" + notifId + "']").remove()}, 5000)
                var notifId2 = uuidv4()
                document.querySelector("#notification").innerHTML += "<div data-id='" + notifId2 + "'>Total emotes loaded: " + (bttvEmoteCodeToId.size + ffzEmoteCodeToId.size + seventvEmoteCodeToId.size + twitchGlobalEmoteCodeToId.size + twitchChannelEmoteCodeToId.size) + "</div>"
                setTimeout(()=>{document.querySelector("[data-id='" + notifId2 + "']").remove()}, 5000)
            }})
        }
    }
}

document.addEventListener("settingchanged",(ev)=>{
    switch (ev.id) {
        case "textcolor" : {
            document.documentElement.style.setProperty("--text-color",registeredSettings.get("textcolor").value)
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
    }
})













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

start()