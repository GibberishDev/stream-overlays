const SETTING_TYPE = Object.freeze({
    STRING : 0,
    ARRAY : 1,
    NUMBER : 2,
    BOOL : 3,
    COLOR : 4,
    SELECT: 5
})
const LAYOUT_TYPE = Object.freeze({
    EMPTY : 0,
    BUTTON : 1,
    CATEGORY : 2,
    TEXT: 3,
    SETTING: 4,
    LOG: 5,
})
let registeredSettings = new Map()
let registeredLayoutObjects = []

// #region common methods

function initSettings() {
    retrieveSettings()
    if (typeof(sendLog)) sendLog("Initialised " + registeredSettings.size + " settings")
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

function getSetting(id) {
    if (registeredSettings.get(id)) {
        return registeredSettings.get(id).get()
    }
}
function setSetting(id, value) {
    if (registeredSettings.get(id)) {
        return registeredSettings.get(id).set(value)
    }
}

// #endregion

// #region classes
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
        let ev = new Event("settingchanged")
        ev.id = this.id
        document.dispatchEvent(ev)
    }
}
class SettingArray extends Setting {
    constructor (id, defaultValue, name="Unnamed setting", description="No description provided.", secure=false) {
        super (id, SETTING_TYPE.ARRAY, defaultValue, name, description)
    }
}
class SettingString extends Setting {
    constructor (id, defaultValue, name="Unnamed setting", description="No description provided.", secure=false) {
        super (id, SETTING_TYPE.STRING, defaultValue, name, description)
        this.secure = secure
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
    /**
     * Checks if new value is valid and can be set. returns set value. if value cannot be converted to a valid number returns false
     */
    set(value) {
        if (isNaN(parseInt(value))) {
            return false
        }
        if (this.minValue) { if (value < this.minValue) value = this.minValue }
        if (this.maxValue) { if (value > this.maxValue) value = this.maxValue }
        if (this.step) if (value % this.step != 0) { value = Math.round(value / this.step) * this.step }
        this.value = value
        let ev = new Event("settingchanged")
        ev.id = this.id
        document.dispatchEvent(ev)
        return value
    }
}
class SettingSelect extends Setting {
    constructor(id, defaultValueId, options={}, name="Unnamed setting", description="No description provided.") {
        super(id, SETTING_TYPE.SELECT,defaultValueId,name,description)
        this.options=options
    }
}

class LayoutCondition {
    constructor(settingId, value = "") {
        this.settingId = settingId
        this.value = value
    }
    get() {
        if (this.settingId == "always") return true
        return (getSetting(this.settingId).toString() == this.value.toString())
    }
}

class LayoutObject {
    constructor(id, type, condition, isWide=false, isFadedWhenInactive=true) {
        this.id = id
        this.type = type
        this.condition = condition
        this.isWide = isWide
        this.isFadedWhenInactive = isFadedWhenInactive
        this.el = undefined
        registeredLayoutObjects.push(this)
    }
    show() {
        if (this.el) {
            this.el.classList.remove("inactive","hidden")
        }
    }
    hide() {
        if (this.el) {
            if (this.isFadedWhenInactive) {
                this.el.classList.add("inactive")
            } else {
                this.el.classList.add("hidden")
            }
        }
    }
}
class LayoutEmpty extends LayoutObject {
    constructor(condition, isWide=false, isFadedWhenInactive=true) {
        super(window.crypto.randomUUID() , LAYOUT_TYPE.EMPTY,condition, isWide, isFadedWhenInactive)
    }
}
class LayoutButton extends LayoutObject {
    constructor(condition, callable, buttonText="", label="", description="", isWide=false, isFadedWhenInactive=true) {
        super(window.crypto.randomUUID() , LAYOUT_TYPE.BUTTON,condition, isWide, isFadedWhenInactive)
        this.callable = callable
        this.buttonText = buttonText
        this.label = label
        this.description = description
    }
}
class LayoutCategory extends LayoutObject {
    constructor(condition, layoutObjects=[], label="", isFolded=true, isFadedWhenInactive=true) {
        super(window.crypto.randomUUID() , LAYOUT_TYPE.CATEGORY,condition, true, isFadedWhenInactive)
        this.layoutObjects = layoutObjects
        this.label = label
        this.isFolded = isFolded
        for (let obj of layoutObjects) {
            const index = registeredLayoutObjects.indexOf(obj)
            if (index > -1) {
                registeredLayoutObjects.splice(index, 1)
            }
        }
    }
    fold() {
        if (this.el) {
            this.el.classList.add("collapsed")
        }
        this.isFolded = true
    }
    unfold() {
        if (this.el) {
            this.el.classList.remove("collapsed")
        }
        this.isFolded = false
    }
    toggle() {
        if (this.isFolded) {
            this.unfold()
        } else {
            this.fold()
        }
    }
} 
class LayoutText extends LayoutObject {
    constructor(condition, label="", description="", isWide=false, isFadedWhenInactive=true) {
        super(window.crypto.randomUUID() , LAYOUT_TYPE.TEXT,condition, isWide, isFadedWhenInactive)
        this.label = label
        this.description = description
    }
}
class LayoutSetting extends LayoutObject {
    constructor(condition, settingId, isWide=false, isFadedWhenInactive=true) {
        super(window.crypto.randomUUID() , LAYOUT_TYPE.SETTING, condition, isWide, isFadedWhenInactive)
        this.settingId = settingId
    }
}
class LayoutLog extends LayoutObject {
    constructor(condition,isWide,isFadedWhenInactive=true) {
        super(window.crypto.randomUUID(), LAYOUT_TYPE.LOG, condition, isWide, isFadedWhenInactive)
    }
}
// #endregion

// #region settings layout generation 

// #region templates
const templateString=`<div class="setting-label"></div><div class="setting-description"></div><input type="text" placeholder="Input text here">`
const templateCheckbox=`<div class="setting-label"></div><div class="setting-description"></div><div class="checkbox-container"><input type="checkbox"><div class="checkbox-vis"></div></div>`
const templateColor=`<div class="setting-label"></div><div class="setting-description"></div><div class="color-container"><div class="color-preview"></div><div class="slider hue" data-value="0"><div class="grabber"></div></div><div class="slider sat" data-value="0"><div class="grabber"></div></div><div class="slider val" data-value="0"><div class="grabber"></div></div></div>`
const templateSelect=`<div class="setting-label"></div><div class="setting-description"></div><div class="dropdown-input"><div class="dropdown-label"></div><div class="dropdown-vis"><</div></div>`
// #endregion

function genSettingElementData(id, wrapper) {
    switch (registeredSettings.get(id).type) {
        case SETTING_TYPE.STRING : {
            wrapper.innerHTML = templateString
            wrapper.classList.add("string")
            wrapper.querySelector("input").value = getSetting(id)
            if (registeredSettings.get(id).secure) wrapper.querySelector("input").style.setProperty("-webkit-text-security","disc")
            hookStringInput(wrapper, id)
            break
        }
        case SETTING_TYPE.ARRAY : {
            wrapper.innerHTML = templateString
            wrapper.classList.add("string")
            wrapper.querySelector("input").value = getSetting(id)
            if (registeredSettings.get(id).secure) wrapper.querySelector("input").style.setProperty("-webkit-text-security","disc")
            hookArrayInput(wrapper, id)
            break
        }
        case SETTING_TYPE.BOOL : {
            wrapper.innerHTML = templateCheckbox
            wrapper.classList.add("checkbox")
            wrapper.querySelector("input").checked = getSetting(id)
            hookBoolInput(wrapper, id)
            break
        }
        case SETTING_TYPE.NUMBER : {
            wrapper.innerHTML = templateString
            wrapper.classList.add("string")
            let setting = registeredSettings.get(id)
            wrapper.querySelector("input").type = "number"
            if (setting.step) {wrapper.querySelector("input").step = setting.step}
            if (setting.minValue) {wrapper.querySelector("input").min = setting.minValue}
            if (setting.maxValue) {wrapper.querySelector("input").max = setting.maxValue}
            wrapper.querySelector("input").value = getSetting(id)
            hookNumberInput(wrapper, id)
            break
        }
        case SETTING_TYPE.COLOR : {
            wrapper.innerHTML = templateColor
            wrapper.classList.add("color")
            setTimeout(()=>hookColorInput(wrapper, id),1)
            break
        }
        case SETTING_TYPE.SELECT : {
            wrapper.innerHTML = templateSelect
            wrapper.classList.add("dropdown")
            wrapper.querySelector(".dropdown-label").innerHTML = registeredSettings.get(id).options[getSetting(id)]
            hookSelectInput(wrapper, id)
            break
        }
    }
    wrapper.querySelector(".setting-label").innerHTML = registeredSettings.get(id).name
    wrapper.querySelector(".setting-description").innerHTML = registeredSettings.get(id).description
}

function hookStringInput(wrapper, id) {
    let el = wrapper.querySelector("input")
    el.onblur = () => {
        registeredSettings.get(id).set(el.value)
        populateSettingsDOM()
    }
}
function hookArrayInput(wrapper, id) {
    let el = wrapper.querySelector("input")
    el.onblur = () => {
        let values = []
        el.value.split(",").forEach((item)=>values.push(item.trim()))
        registeredSettings.get(id).set(values)
        populateSettingsDOM()
    }
}

function hookBoolInput(wrapper, id) {
    let el = wrapper.querySelector("input")
    el.onchange = () => {
        registeredSettings.get(id).set(el.checked)
        populateSettingsDOM()
    }
}

function hookNumberInput(wrapper, id) {
    let el = wrapper.querySelector("input")
    el.onfocus = ()=>{
        el.dataset.lastValue = registeredSettings.get(id).get()
    }
    el.onblur = () => {
        if (registeredSettings.get(id).set(el.value) !== false) {
            el.value = getSetting(id)
            populateSettingsDOM()
        } else {
            el.value = el.dataset.lastValue
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
    val.querySelector(".grabber").style.left = (val.dataset.value*(val.offsetWidth - 10)) + "px"
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

function hookSelectInput(wrapper, id) {
    let el = wrapper.querySelector(".dropdown-input")
    el.addEventListener("click",(event)=>{summonDropdown(event, el, id)})
}
function summonDropdown(event, el, id) {
    let dropdownWrapper = document.querySelector("#dropdown-wrapper")
    dropdownWrapper.querySelector(".dropdown-list").innerHTML = ""
    for (let optionId of Object.keys(registeredSettings.get(id).options)) {
        let optionEl = document.createElement("div")
        dropdownWrapper.querySelector(".dropdown-list").appendChild(optionEl)
        optionEl.classList.add("dropdown-option")
        optionEl.innerHTML = registeredSettings.get(id).options[optionId]
        optionEl.addEventListener("click",()=>{
            setSetting(id, optionId)
            hideDropdown()
            populateSettingsDOM()
        })
    }
    document.addEventListener("mousedown",()=>{setTimeout(hideDropdown,100)},{once:true})
    showDropdown(el)
}

function hideDropdown() {
    document.querySelector("#dropdown-wrapper").style.display = "none"
    document.querySelector("#dropdown-wrapper").querySelector(".dropdown-list").innerHTML = ""
}
function showDropdown(el) {
    let rect = el.getBoundingClientRect()
    let dropdownWrapper = document.querySelector("#dropdown-wrapper")
    dropdownWrapper.style.left = rect.x + "px"
    dropdownWrapper.style.top = (rect.y + rect.height) + "px"
    dropdownWrapper.style.width = rect.width + "px"
    dropdownWrapper.style.display = ""
}
//#endregion

// #region html generation
function populateSettingsDOM() {
    let wrapper = document.querySelector("#settings-container")
    wrapper.innerHTML = ""
    let elements = getDOMElements(registeredLayoutObjects)
    for (let el of elements) wrapper.appendChild(el)
}
function getDOMElements(layoutObjects) {
    var elements = []
    for (let layoutObj of layoutObjects) {
        switch (layoutObj.type) {
            case LAYOUT_TYPE.CATEGORY : {
                elements.push(getCategoryElement(layoutObj))
                break
            }
            case LAYOUT_TYPE.TEXT : {
                elements.push(getTextElement(layoutObj))
                break
            }
            case LAYOUT_TYPE.EMPTY : {
                elements.push(getEmptyElement(layoutObj))
                break
            }
            case LAYOUT_TYPE.SETTING : {
                elements.push(getSettingElement(layoutObj))
                break
            }
            case LAYOUT_TYPE.LOG : {
                elements.push(getLogElement(layoutObj))
                break
            }
            case LAYOUT_TYPE.BUTTON : {
                elements.push(getButtonElement(layoutObj))
                break
            }
        }
    }
    return elements
}


function getCategoryElement(layoutObj) {
    let el = document.createElement("div")
    layoutObj.el = el
    el.classList.add("settings-category","wide")
    if (!layoutObj.condition.get()) {
        if (layoutObj.isFadedWhenInactive) {
            el.classList.add("inactive")
        } else {
            el.classList.add("hidden")
        }
    }
    if (layoutObj.isFolded) {
        el.classList.add("collapsed")
    }
    el.innerHTML = `<div class="settings-category-label"></div><div class="settings-category-container"></div>`
    el.querySelector(".settings-category-label").innerHTML = layoutObj.label
    hookCategoryInput(el, layoutObj)
    populateCategoryDOM(el, layoutObj)
    return el
}
function hookCategoryInput(el, layoutObj) {
    el.querySelector(".settings-category-label").addEventListener("click",()=>{layoutObj.toggle()})
}
function populateCategoryDOM(el, layoutObj) {
    let container = el.querySelector(".settings-category-container")
    for (let catElement of getDOMElements(layoutObj.layoutObjects)) {
        container.appendChild(catElement)
    }
}

function getTextElement(layoutObj) {
    let el = document.createElement("div")
    layoutObj.el = el
    el.classList.add("setting")
    if (!layoutObj.condition.get()) {
        if (layoutObj.isFadedWhenInactive) {
            el.classList.add("inactive")
        } else {
            el.classList.add("hidden")
        }
    }
    if (layoutObj.isWide) el.classList.add("wide")
    el.innerHTML = `<div class="setting-label"></div><div class="setting-description"></div>`
    el.querySelector(".setting-label").innerHTML = layoutObj.label
    el.querySelector(".setting-description").innerHTML = layoutObj.description
    return el
}

function getEmptyElement(layoutObj) {
    let el = document.createElement("div")
    layoutObj.el = el
    el.classList.add("setting","spacer")
    if (!layoutObj.condition.get()) {
        if (layoutObj.isFadedWhenInactive) {
            el.classList.add("inactive")
        } else {
            el.classList.add("hidden")
        }
    }
    if (layoutObj.isWide) el.classList.add("wide")
    return el
}

function getSettingElement(layoutObj) {
    let el = document.createElement("div")
    layoutObj.el = el
    el.classList.add("setting")
    if (!layoutObj.condition.get()) {
        if (layoutObj.isFadedWhenInactive) {
            el.classList.add("inactive")
        } else {
            el.classList.add("hidden")
        }
    }
    if (layoutObj.isWide) el.classList.add("wide")
    genSettingElementData(layoutObj.settingId, el)
    return el
}

function getLogElement(layoutObj) {
    let el = document.createElement("div")
    layoutObj.el = el
    el.classList.add("setting","log")
    if (!layoutObj.condition.get()) {
        if (layoutObj.isFadedWhenInactive) {
            el.classList.add("inactive")
        } else {
            el.classList.add("hidden")
        }
    }
    if (layoutObj.isWide) el.classList.add("wide")
    el.innerHTML = `<div class="setting-label">Log</div><div class="setting-description"></div>`
    for (let logItem of log) {
        let time = padZero(logItem.timestamp.getHours()) + ":" + padZero(logItem.timestamp.getMinutes()) + ":" + padZero(logItem.timestamp.getSeconds())
        el.querySelector(".setting-description").innerHTML += `
        <div class='log-entry'>
            <span class='timestamp'>${time}</span>
            <span class='message log-${logItem.logType}'>${logItem.message}</span>
        </div>
        `
    }
    return el
}
function padZero(number) {
  // Convert to string and check length
  const str = number.toString();
  return str.length === 1 ? '0' + str : str;
}
// #endregion
// #region html control

function showSettingsMenu() {
    document.querySelector("#open-settings").style.setProperty("display","none")
    document.querySelector("#settings").style.setProperty("display","")
    populateSettingsDOM()
}

function hideSettingsMenu() {
    document.querySelector("#open-settings").style.setProperty("display","")
    document.querySelector("#settings").style.setProperty("display","none")
}
function inputSaveSettings() {
    hideSettingsMenu()
    saveSettings()
    if (typeof(start) == 'function') start()
}
function inputCancelSettings() {
    hideSettingsMenu()
    retrieveSettings()
}
function inputResetSettings() {
    localStorage.clear()
    for (let id of registeredSettings.keys()) {
        registeredSettings.get(id).set(registeredSettings.get(id).defaultValue)
    }
    saveSettings()
    populateSettingsDOM()
}
document.addEventListener("mousemove",()=>{triggerReflow(document.querySelector("#open-settings"))})
// #endregion