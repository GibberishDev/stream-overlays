
// #region settings init
new SettingNumber("time_seconds", 900, 0, null, 1, "Time", "Time in seconds")
new SettingNumber("scale_mult", 1.0, 0.1, null, 0.1, "Time", "Time in seconds")
new SettingBool("show_seconds", true, "Display seconds", "Decides whether to show or hide seconds counter")
new SettingBool("show_minutes", true, "Display minutes", "Decides whether to show or hide minutes counter")
new SettingBool("show_hours", true, "Display hours", "Decides whether to show or hide hours counter")
new SettingBool("show_days", true, "Display days", "Decides whether to show or hide days counter")
new SettingBool("countup", true, "Count up", "decides whether timer will start counting up after time ran out")
new SettingColor("color", "#ffffff", "Timer color", "Regular text color")
new SettingColor("color_timeout", "#ff8d8d", "Timer timeout color", "Timeout text color. displayed when timer ran out")
initSettings()
// #endregion

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