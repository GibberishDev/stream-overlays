var moduleStates = new Map()
var readyCount = 0

export function moduleReady(moduleID) {
    let ev = new Event("moduleready")
    ev.module = moduleID
    document.dispatchEvent(ev)
    if (moduleStates.get(moduleID) == undefined) {
        console.warn("-/" + moduleStates.size + " - undeclared module ready: " + moduleID)
        return
    } else if (moduleStates.get(moduleID)){
        console.warn(readyCount +  "/" + moduleStates.size + " - repeated module ready: " + moduleID)
        return
    }
    moduleStates.set(moduleID, true)
    readyCount++
    console.info(readyCount +  "/" + moduleStates.size + " - module ready: " + moduleID)
    checkModules()
}

export function setModuleList(moduleList) {
    for (let module of moduleList) {
        moduleStates.set(module, false)
    }
}

function checkModules() {
    for (let state of moduleStates.values()) if (!state) return
    ready()
}

function ready() {
    let ev = new Event("allmodulesready")
    document.dispatchEvent(ev)
    console.info("ALL - all modules ready")
}