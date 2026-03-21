let registeredSettings = new Map()
var settingsOpen = false
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
    saveSettings()
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
    NUMBER : 2,
    BOOL : 3,
    COLOR : 4,
    EMPTY: 5,
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
    get() {return this.value}
    set(value) {
        this.value = value
        console.log("value set for " + this.id + ": " + this.value)
        let ev = new Event("settingchanged")
        ev.id = this.id
        document.dispatchEvent(ev)
    }
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
class SettingNumber extends Setting {
    constructor (id, defaultValue, minValue=null, maxValue=null, step=1, name="Unnamed setting", description="No description provided.") {
        super (id, SETTING_TYPE.NUMBER, defaultValue, name, description)
        this.minValue = minValue
        this.maxValue = maxValue
        this.step = step
    }
    set(value) {
        if (isNaN(parseInt(value))) {
            return false
        }
        if (this.minValue) { if (value < this.minValue) value = this.minValue }
        if (this.maxValue) { if (value > this.maxValue) value = this.maxValue }
        if (this.step) if (value % this.step != 0) { value = Math.round(value / this.step) * this.step }
        this.value = value
        console.log("value set for " + this.id + ": " + this.value)
        let ev = new Event("settingchanged")
        ev.id = this.id
        document.dispatchEvent(ev)
        return value
    }
}
class SettingEmpty extends Setting {
    constructor() {
        super(uuidv4(),SETTING_TYPE.EMPTY,"","","")
    }
}
// #region html menu gen
const templateString = `
<div class="setting-title"></div>
<div class="setting-description"></div>
<div class="setting-data">
    <input class="input" value="" placeholder="">
</div>
`
const templateToggle = `
<div class="setting-title"></div>
<div class="setting-description"></div>
<div class="setting-data">
    <input class="input" type="checkbox">
    <div class="checkbox-vis"></div>
</div>
`
const templateColor = `
<div class="setting-title"></div>
<div class="setting-description"></div>
<div class="setting-data">
    <div class="color-preview"></div>
    <div class="slider hue" data-value="0">
        <div class="grabber"></div>
    </div>
    <div class="slider sat" data-value="0">
        <div class="grabber"></div>
    </div>
    <div class="slider val" data-value="0">
        <div class="grabber"></div>
    </div>
</div>
`
function genSettingsMenu() {
    document.querySelector("#content-preview").style.display = ""
    let elementsList = []
    document.querySelector("#open-settings").style.display = "none"
    document.querySelector("#settings-wrapper").classList.remove("hidden")
    document.querySelector("#settings-container").innerHTML = ""
    for (let id of registeredSettings.keys()) {
        let setting = registeredSettings.get(id)
        switch (setting.type) {
            case SETTING_TYPE.STRING : {
                let el = document.createElement('div')
                document.querySelector("#settings-container").appendChild(el)
                el.classList.add("settings-item","string")
                el.innerHTML = templateString
                el.querySelector(".setting-title").textContent = setting.name
                el.querySelector(".setting-description").textContent = setting.description
                el.querySelector(".input").value = setting.get()
                el.querySelector(".input").placeholder = "Enter string value here"
                hookStringInput(el.querySelector(".input"), setting.id)
                break
            }
            case SETTING_TYPE.ARRAY : {
                let el = document.createElement('div')
                document.querySelector("#settings-container").appendChild(el)
                el.classList.add("settings-item","string")
                el.innerHTML = templateString
                el.querySelector(".setting-title").textContent = setting.name
                el.querySelector(".setting-description").textContent = setting.description
                el.querySelector(".input").value = setting.get().toString()
                el.querySelector(".input").placeholder = "Enter comma separated values here"
                hookArrayInput(el.querySelector(".input"), setting.id)
                break
            }
            case SETTING_TYPE.NUMBER : {
                let el = document.createElement('div')
                document.querySelector("#settings-container").appendChild(el)
                el.classList.add("settings-item","string")
                el.innerHTML = templateString
                el.querySelector(".setting-title").textContent = setting.name
                el.querySelector(".setting-description").textContent = setting.description
                el.querySelector(".input").type = "number"
                if (setting.step) {
                    el.querySelector(".input").step = setting.step
                }
                if (setting.minValue) {
                    el.querySelector(".input").min = setting.minValue
                }
                if (setting.maxValue) {
                    el.querySelector(".input").max = setting.maxValue
                }
                el.querySelector(".input").value = setting.get()
                hookNumberInput(el.querySelector(".input"), setting.id)
                break
            }
            case SETTING_TYPE.BOOL : {
                let el = document.createElement('div')
                document.querySelector("#settings-container").appendChild(el)
                el.classList.add("settings-item","checkbox")
                el.innerHTML = templateToggle
                el.querySelector(".setting-title").textContent = setting.name
                el.querySelector(".setting-description").textContent = setting.description
                el.querySelector(".input").checked = setting.get()
                hookBoolInput(el.querySelector(".input"), setting.id)
                break
            }
            case SETTING_TYPE.COLOR : {
                let el = document.createElement('div')
                document.querySelector("#settings-container").appendChild(el)
                el.classList.add("settings-item","color")
                el.innerHTML = templateColor
                el.querySelector(".setting-title").textContent = setting.name
                el.querySelector(".setting-description").textContent = setting.description
                setTimeout(()=>{hookColorInput(el.querySelector(".setting-data"), setting.id)},1)
                break
            }
            case SETTING_TYPE.EMPTY : {
                let el = document.createElement('div')
                document.querySelector("#settings-container").appendChild(el)
                el.classList.add("settings-item","empty")
            }
        }
    }
}

function hookStringInput(el, id) {
    el.onblur = () => {
        registeredSettings.get(id).set(el.value)
    }
}
function hookArrayInput(el, id) {
    el.onblur = () => {
        let values = []
        el.value.split(",").forEach((item)=>values.push(item.trim()))
        registeredSettings.get(id).set(values)
    }
}
function hookNumberInput(el, id) {
    el.onfocus = ()=>{
        el.dataset.lastValue = registeredSettings.get(id).get()
    }
    el.onblur = () => {
        if (registeredSettings.get(id).set(el.value) !== false) {
            el.value = registeredSettings.get(id).get()
        } else {
            el.value = el.dataset.lastValue
        }
    }
}
function hookBoolInput(el, id) {
    el.onchange = ()=>{
        if (el.checked) {
            registeredSettings.get(id).set(true)
        } else {
            registeredSettings.get(id).set(false)
        }
    }
}
function hookColorInput(el, id) {
    let hue = el.querySelector(".hue")
    let sat = el.querySelector(".sat")
    let val = el.querySelector(".val")
    let color = new HSV().fromHex(registeredSettings.get(id).get())
    hue.dataset.value = color.h/360.0
    sat.dataset.value = color.s/100.0
    val.dataset.value = color.v/100.0
    sat.style.setProperty("--hue",new HSV(color.h,100,color.v).toHex())
    sat.style.setProperty("--val",new HSV(color.h,0,color.v).toHex())
    val.style.setProperty("--sat",new HSV(color.h,color.s,100).toHex())
    hue.querySelector(".grabber").style.left = (hue.dataset.value*(hue.offsetWidth - 10)) + "px"
    sat.querySelector(".grabber").style.left = (sat.dataset.value*(sat.offsetWidth - 10)) + "px"
    val.querySelector(".grabber").style.left = (val.dataset.value*(sat.offsetWidth - 10)) + "px"
    el.querySelector(".color-preview").style.setProperty("background",registeredSettings.get(id).get())
    hue.addEventListener("mousedown",(event)=>{
        handleColorDrag(event, hue, id)
        let inputEl = document.createElement("div")
        inputEl.classList.add("cover")
        document.body.appendChild(inputEl)
        inputEl.addEventListener("mousemove",(ev)=>handleColorDrag(ev, hue, id),{capture:true})
        document.addEventListener("mouseup",()=>{inputEl.remove()},{once:true})
    })
    sat.addEventListener("mousedown",(event)=>{
        handleColorDrag(event, sat, id)
        let inputEl = document.createElement("div")
        inputEl.classList.add("cover")
        document.body.appendChild(inputEl)
        inputEl.addEventListener("mousemove",(ev)=>handleColorDrag(ev, sat, id),{capture:true})
        document.addEventListener("mouseup",()=>{inputEl.remove()},{once:true})
    })
    val.addEventListener("mousedown",(event)=>{
        handleColorDrag(event, val, id)
        let inputEl = document.createElement("div")
        inputEl.classList.add("cover")
        document.body.appendChild(inputEl)
        inputEl.addEventListener("mousemove",(ev)=>handleColorDrag(ev, val, id),{capture:true})
        document.addEventListener("mouseup",()=>{inputEl.remove()},{once:true})
    })
}
function handleColorDrag(event,el,id) {
    let x = event.clientX - 5
    let rect = el.getBoundingClientRect()
    x -= rect.x
    x = Math.min(rect.width - 10, Math.max(0, x))
    el.querySelector(".grabber").style.left = x + "px"
    let val = x/(rect.width - 10)
    el.dataset.value = val
    let h = el.parentNode.querySelector(".hue").dataset.value * 360
    let s = el.parentNode.querySelector(".sat").dataset.value * 100
    let v = el.parentNode.querySelector(".val").dataset.value * 100
    let color = new HSV(h,s,v)
    el.parentNode.querySelector(".sat").style.setProperty("--hue",new HSV(h,100,v).toHex())
    el.parentNode.querySelector(".sat").style.setProperty("--val",new HSV(h,0,v).toHex())
    el.parentNode.querySelector(".val").style.setProperty("--sat",new HSV(h,s,100).toHex())
    el.parentNode.querySelector(".color-preview").style.setProperty("background",color.toHex())
    registeredSettings.get(id).set(color.toHex())
}
class HSV {
    constructor(h,s,v) {
        this.h = h
        this.s = s
        this.v = v
    }
    toHex = () => {
        var sat = this.s / 100;
        var val = this.v / 100;

        const c = val * sat;
        const x = c * (1 - Math.abs((this.h / 60) % 2 - 1));
        const m = val - c;

        let r = 0, g = 0, b = 0;

        if (this.h >= 0 && this.h < 60) {
            r = c; g = x; b = 0;
        } else if (this.h < 120) {
            r = x; g = c; b = 0;
        } else if (this.h < 180) {
            r = 0; g = c; b = x;
        } else if (this.h < 240) {
            r = 0; g = x; b = c;
        } else if (this.h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        const toHex = n =>
            Math.round((n + m) * 255)
            .toString(16)
            .padStart(2, "0");

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    fromHex = (hex) => {
        hex = hex.replace(/^#/, "");

        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        let hue = 0;
        let sat = 0;
        let val = max;

        if (delta !== 0) {
            sat = delta / max;

            switch (max) {
            case r:
                hue = ((g - b) / delta) % 6;
                break;
            case g:
                hue = (b - r) / delta + 2;
                break;
            case b:
                hue = (r - g) / delta + 4;
                break;
            }

            hue *= 60;
            if (hue < 0) hue += 360;
        }
        this.h = hue,
        this.s = sat * 100,
        this.v = val * 100
        return this
    }
}
function inputSaveSettings() {
    saveSettings()
    retrieveSettings()
    document.querySelector("#settings-container").innerHTML = ""
    document.querySelector("#settings-wrapper").classList.add("hidden")
    document.querySelector("#content-preview").style.display = "none"
    settingsOpen = false
    document.querySelector("#open-settings").style.display = ""
    start()
}
function inputCancelSettigns() {
    retrieveSettings()
    document.querySelector("#settings-container").innerHTML = ""
    document.querySelector("#settings-wrapper").classList.add("hidden")
    document.querySelector("#content-preview").style.display = "none"
    settingsOpen = false
    document.querySelector("#open-settings").style.display = ""
}
function inputResetSettings() {
    for (let id of registeredSettings.keys()) {
        registeredSettings.get(id).set(registeredSettings.get(id).defaultValue)
    }
    saveSettings()
    genSettingsMenu()
}
document.addEventListener("mousemove",()=>{triggerReflow(document.querySelector("#open-settings"))})
// #endregion