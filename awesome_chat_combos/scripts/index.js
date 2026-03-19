// #region init

setModuleList([
    "settings",
    "emotes",
])

new SettingArray("channels", [], "Channels", "List of channels to trach chat messages from")
new SettingInt("numberregular", 2, -1, null, 1,"Required repetitions: Regular", "Minimum number of repeats in chat to display combo. -1 means disabled")
new SettingInt("numbermega", 10, -1, null, 1,"Required repetitions: Mega", "Minimum number of repeats in chat to display mega combo animation. -1 means disabled")
new SettingInt("numbersuper", 25, -1, null, 1,"Required repetitions: Super", "Minimum number of repeats in chat to display super combo animation. -1 means disabled")
new SettingInt("durationregular", 10000, -1, null, 100,"Duration: Regular", "Time in milliseconds until combo expires. Values below 2500 practically mean combo expires before twitch api sends information")
new SettingInt("durationmega", 15000, -1, null, 100,"Duration: Mega", "Time in milliseconds until mega combo expires. Values below 2500 practically mean combo expires before twitch api sends information")
new SettingInt("durationsuper", 20000, -1, null, 100,"Duration: Super", "Time in milliseconds until super combo expires. Values below 2500 practically mean combo expires before twitch api sends information")
new SettingBool("showtimer", true, "Display timer", "Decides whether to show or hide combo expiration timer")
new SettingColor("textcolor", "#ffff00ff", "Text color", "Text color of regular combo")
new SettingInt("lettersnumber", 2, -1, null, 1, "Required repetitions: Regular", "Minimum number of repeats in chat to display combo. -1 means disabled")

initSettings()
// #endregion

if (registeredSettings.get("channels").value = []) console.info("No channel set. Abborting startup")