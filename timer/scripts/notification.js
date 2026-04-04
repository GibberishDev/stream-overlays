var notificationsWrapper = undefined

function setup(){
    notificationsWrapper = document.querySelector("#notifications-wrapper")
    if (notificationsWrapper == undefined) {
        let el = document.createElement("div")
        document.body.appendChild(el)
        notificationsWrapper = el
        el.id = "notifications-wrapper"
    }
    sendLog(`Notifications ready`)
}

function sendNotification(notificationBody) {
    let el = document.createElement("div")
    el.classList.add("notification")
    el.innerHTML = "<div style='display:flex;flex-direction:row;'><span style='width:36px;text-align:center;'>ⓘ</span>" + notificationBody + "</div>"
    notificationsWrapper.appendChild(el)
    setTimeout(()=>el.remove(),8000)
}
function sendError(notificationBody) {
    let el = document.createElement("div")
    el.classList.add("notification","error")
    el.innerHTML = "<div style='display:flex;flex-direction:row;'><span style='width:36px;text-align:center;'>⊘</span>" + notificationBody + "</div>"
    notificationsWrapper.appendChild(el)
    setTimeout(()=>el.remove(),8000)
}
function sendWarn(notificationBody) {
    let el = document.createElement("div")
    el.classList.add("notification","warn")
    el.innerHTML = "<div style='display:flex;flex-direction:row;'><span style='width:36px;text-align:center;'>⚠︎</span>" + notificationBody + "</div>"
    notificationsWrapper.appendChild(el)
    setTimeout(()=>el.remove(),8000)
}
function sendLog(notificationBody) {
    let el = document.createElement("div")
    el.classList.add("notification","log")
    el.innerHTML = "<div style='display:flex;flex-direction:row;'><span style='width:36px;text-align:center;'>⚙</span>" + notificationBody + "</div>"
    notificationsWrapper.appendChild(el)
    setTimeout(()=>el.remove(),8000)
}

setup()