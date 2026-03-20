// #region init

setModuleList([
    "settings",
    "emotes",
])

new SettingArray("channels", [], "Channels", "List of channels to trach chat messages from")
new SettingColor("textcolor", "#ffff00ff", "Text color", "Text color of regular combo")
new SettingBool("showtimer", true, "Display timer", "Decides whether to show or hide combo expiration timer")
new SettingBool("showcounter", true, "Display counter", "Decides whether to show or hide combo counter")
new SettingBool("displayemote", true, "Display counter", "Decides whether to show or hide combo counter")
new SettingNumber("lettersnumber", 20, -1, null, 1, "Visible letters", "Maximum amount of visible letters when displaying a word combo. -1 to display all")
new SettingNumber("numberregular", 2, -1, null, 1,"Required repetitions: Regular", "Minimum number of repeats in chat to display combo. -1 means disabled")
new SettingNumber("numbermega", 10, -1, null, 1,"Required repetitions: Mega", "Minimum number of repeats in chat to display mega combo animation. -1 means disabled")
new SettingNumber("numbersuper", 25, -1, null, 1,"Required repetitions: Super", "Minimum number of repeats in chat to display super combo animation. -1 means disabled")
new SettingNumber("durationregular", 10000, 0, null, 100,"Duration: Regular", "Time in milliseconds until combo expires. Values below 2500 practically mean combo expires before twitch api sends information")
new SettingNumber("durationmega", 15000, 0, null, 100,"Duration: Mega", "Time in milliseconds until mega combo expires. Values below 2500 practically mean combo expires before twitch api sends information")
new SettingNumber("durationsuper", 20000, 0, null, 100,"Duration: Super", "Time in milliseconds until super combo expires. Values below 2500 practically mean combo expires before twitch api sends information")

initSettings()
// #endregion

if (registeredSettings.get("channels").value = []) console.info("No channel set. Abborting startup")

function triggerReflow(element) {
    element.style.animation = 'none';
    void element.offsetHeight;
    element.style.animation = null;
}