let registeredSettings = new Map()

var params = new URLSearchParams(window.location.search)

function initSettings() {
    retrieveSettings()
    if (typeof(moduleReady)) moduleReady("settings")
}

function retrieveSettings() {
    if (localStorage.settings) {
        let settingsObject = JSON.parse(localStorage.settings);
        for (let item in settingsObject) {
            if (registeredSettings.get(item)) {
                registeredSettings.get(item).set(settingsObject[item])
            }
        }
    }
}

function saveSettings() {
    let settingsObject = {}
    for (let item of registeredSettings.keys()) {
        let setting = registeredSettings.get(item)
        settingsObject[setting.id] = setting.value
    }
    localStorage.settings = JSON.stringify(settingsObject)
}

const SETTING_TYPE = Object.freeze({
    STRING : 0,
    ARRAY : 1,
    INT : 2,
    FLOAT : 3,
    BOOL : 4,
    COLOR : 5,
})

class Setting {
    constructor(id, type, defaultValue, name="Unnamed setting", description="No description provided.") {
        this.id = id,
        this.type = type,
        this.defaultValue = defaultValue
        this.value = defaultValue
        this.name = name
        this.description = description
        if (registeredSettings.get(id)) console.warn("Setting with id '" + id + "' already exists. Overwriting...")
        registeredSettings.set(id, this)
    }
    set(value) { this.value = value }
}

class SettingArray extends Setting {
    constructor (id, defaultValue, name="Unnamed setting", description="No description provided.") {
        super (id, SETTING_TYPE.ARRAY, defaultValue, name, description)
    }
}
class SettingString extends Setting {
    constructor (id, defaultValue, name="Unnamed setting", description="No description provided.") {
        super (id, SETTING_TYPE.STRING, defaultValue, name, description)
    }
}
class SettingBool extends Setting {
    constructor (id, defaultValue, name="Unnamed setting", description="No description provided.") {
        super (id, SETTING_TYPE.BOOL, defaultValue, name, description)
    }
}
class SettingColor extends Setting {
    constructor (id, defaultValue, name="Unnamed setting", description="No description provided.") {
        super (id, SETTING_TYPE.COLOR, defaultValue, name, description)
    }
}
class SettingInt extends Setting {
    constructor (id, defaultValue, minValue=null, maxValue=null, step=1, name="Unnamed setting", description="No description provided.") {
        super (id, SETTING_TYPE.ARRAY, defaultValue, name, description)
    }
    set(value) {
        if (isNaN(parseInt(value))) {
            console.error("ERROR: Cannot set value " + value + " to setting " + id + ". Not an Integer")
            return false
        }
        if (this.minValue) { if (value < this.minValue) value = this.minValue }
        if (this.maxValue) { if (value > this.maxValue) value = this.maxValue }
        if (this.step) if (value % this.step != 0) { value = Math.round(value / this.step) * this.step }
        this.value = value
    }
}
