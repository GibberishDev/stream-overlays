let registeredSounds = new Map()
var soundsNumber = 0
var readyCounter = 0
var soundQueue = {}

class sfx {
    constructor(id, path) {
        if (path == undefined) return
        this.id = id
        registeredSounds.set(this.id, this)
        this.path = path
        this.sound = new Audio(this.path)
        this.sound.addEventListener("error",(ev)=>{
            console.error("Failed to register sound with id " + id + ". File not found: "+ path);
            registeredSounds.delete(id)
            readyCounter++
            checkReadySounds()
            return
        })
        this.loaded = false
        this.sound.style.display='none'
        this.sound.addEventListener("loadeddata",(ev)=>{
            let event = new Event("soundloaded")
            event.id = this.id
            this.loaded = true
            readyCounter++
            checkReadySounds()
            document.dispatchEvent(event)
        })
    }
    play() {
        if (this.loaded) {
            let id = uuidv4()
            soundQueue[id] = this.sound.cloneNode(true)
            if (typeof(registeredSettings) == 'object' && registeredSettings.get("volume")) soundQueue[id].volume = registeredSettings.get("volume").get() / 100.0
            soundQueue[id].play()
            soundQueue[id].addEventListener("ended",()=>{soundQueue[id].remove();delete soundQueue[id]})
        } else {
            console.log("queued " + this.id + " to play")
            document.addEventListener("soundloaded",(ev)=>{
                if (ev.id == this.id) {
                    this.play()
                    console.log("played " + this.id)
                }
            },{once:true})
        }
    }
}

function initSounds() {
    soundsNumber = registeredSounds.size
}

function checkReadySounds() {
    if (readyCounter < soundsNumber) return
    let readySounds = 0
    for (let sound of registeredSounds.values()) {
        console.log(sound)
        if (sound.loaded) readySounds++
    }
    if (soundsNumber != 0 && readySounds == registeredSounds.size) {
        if (typeof(moduleReady) == 'function') moduleReady("sounds")
    }
}