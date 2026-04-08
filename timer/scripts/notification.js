var notificationsWrapper = undefined
var log = []

function setup(){
    notificationsWrapper = document.querySelector("#notifications-wrapper")
    if (notificationsWrapper == undefined) {
        let el = document.createElement("div")
        document.body.appendChild(el)
        notificationsWrapper = el
        el.id = "notifications-wrapper"
    }
    sendLog(`Notifications module ready`)
}

function sendNotification(notificationBody) {
    let el = document.createElement("div")
    el.classList.add("notification")
    el.innerHTML = "<div style='display:flex;flex-direction:row;'><span style='width:36px;text-align:center;'>ⓘ</span>" + notificationBody + "</div>"
    notificationsWrapper.appendChild(el)
    setTimeout(()=>el.remove(),8000)
    logMessage(notificationBody,"notif")
}
function sendError(notificationBody) {
    let el = document.createElement("div")
    el.classList.add("notification","error")
    el.innerHTML = "<div style='display:flex;flex-direction:row;'><span style='width:36px;text-align:center;'>⊘</span>" + notificationBody + "</div>"
    notificationsWrapper.appendChild(el)
    setTimeout(()=>el.remove(),8000)
    logMessage(notificationBody,"err")
}
function sendWarn(notificationBody) {
    let el = document.createElement("div")
    el.classList.add("notification","warn")
    el.innerHTML = "<div style='display:flex;flex-direction:row;'><span style='width:36px;text-align:center;'>⚠︎</span>" + notificationBody + "</div>"
    notificationsWrapper.appendChild(el)
    setTimeout(()=>el.remove(),8000)
    logMessage(notificationBody,"warn")
}
function sendLog(notificationBody) {
    let el = document.createElement("div")
    el.classList.add("notification","log")
    el.innerHTML = "<div style='display:flex;flex-direction:row;'><span style='width:36px;text-align:center;'>⚙</span>" + notificationBody + "</div>"
    notificationsWrapper.appendChild(el)
    setTimeout(()=>el.remove(),8000)
    logMessage(notificationBody,"log")
}

function logMessage(message, type) {
    message = sanitizeHTML(message)
    let timestamp = new Date()
    log.push({
        "timestamp":timestamp,
        "message":message,
        "logType":type
    })
}


setup()
