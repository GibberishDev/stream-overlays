// #region general
const INTEGRATION_TYPE = Object.freeze({
	NONE: 0, //no integration active
	SB: 1, //Streamer.Bot integration
	FB: 2, //FireBot integration
	MIU: 3, //MixItUp integration
})
var currentIntegration = 1
let registeredIntegrationEvents = new Map()
let registeredIntegrationBotEvents = new Map()

function connectIntegration() {
    switch (currentIntegration) {
        case INTEGRATION_TYPE.FB : {
            connectFB()
            break
        }
        case INTEGRATION_TYPE.SB : {
            connectSB()
            break
        }
        case INTEGRATION_TYPE.MIU : {
            connectMIU()
            break
        }
    }
}

function eventIntegrationFail() {
    var name = ""
    if (currentIntegration==INTEGRATION_TYPE.SB){name="Streamer.Bot"}
    else if (currentIntegration==INTEGRATION_TYPE.FB){name="Firebot"}
    else if (currentIntegration==INTEGRATION_TYPE.MIU)name="MixItUp"
    sendError(`Could not connect to ${name} integration`)
}

function dispatchEvent(id,data) {
    switch (currentIntegration) {
        case INTEGRATION_TYPE.FB : {
            dispatchFBEvent(id, data)            
            break
        }
        case INTEGRATION_TYPE.SB : {
            dispatchSBEvent(id, data)            
            break
        }
        case INTEGRATION_TYPE.MIU : {
            dispatchMIUEvent(id, data)            
            break
        }
    }
}

class IntegrationOverlayEvent {
    constructor(id, name, integrations=[INTEGRATION_TYPE.FB,INTEGRATION_TYPE.SB,INTEGRATION_TYPE.MIU]) {
        this.id = id
        this.name = name
        this.integrations = integrations
        registeredIntegrationEvents.set(this.id, this)
    }
    dispatch(data={}) {
        if (!this.integrations.includes(currentIntegration)) return
    }
}

class IntegrationBotEvent {
    constructor(id, handler) {
        this.id = id
        this.handler = handler
        registeredIntegrationBotEvents.set(this.id, this)
    }
}

// #endregion

// #region bot specific


// #region Firebot

var firebotWebsocket
var firebotEventsTotal
var firebotEventsFound

// #region init

function connectFB() {
    firebotEventsTotal = 0
    firebotEventsFound = 0
    setupWebsocket()
    getFBEvents()
}

async function getFBEvents() {
	let effectLists = await fetch(
		"http://localhost:7472/api/v1/effects/preset",
		{
			method:"GET",
			"headers":{"Content-Type": "application/json"}
		}
	).then((resp)=>resp.json()).catch(()=>{return})
	if (effectLists) {
        for (let eventId of registeredIntegrationEvents.keys()) {
            let event = registeredIntegrationEvents.get(eventId) 
            if (event.integrations.includes(INTEGRATION_TYPE.FB)){
                firebotEventsTotal++
                fetchFBEventId(effectLists, event)
            }
        }
        if (firebotEventsTotal > 0) {
            if (firebotEventsFound < firebotEventsTotal) {
                sendWarn("Found firebot effect lists: " + firebotEventsFound.toString() + "/" + firebotEventsTotal.toString())
            } else {
                sendNotification("Found firebot effect lists: " + firebotEventsFound.toString() + "/" + firebotEventsTotal.toString())
            }
        }
	} else {
		eventIntegrationFail()
    }
}

function fetchFBEventId(effectLists, event) {
    for (let effectList of effectLists) {
        if (effectList.name == event.name) {
            event.firebot_id = effectList.id
            firebotEventsFound++
            sendLog("Found firebot event: " + event.id)
            break
        }
    }
}

function setupWebsocket() {
    firebotWebsocket = new WebSocket("ws://localhost:7472")
    firebotWebsocket.onopen = (ev)=>{
        firebotWebsocket.send(JSON.stringify({
            "type": "invoke",
            "name": "subscribe-events"
        }))
    }
    firebotWebsocket.onmessage = (ev)=>{onFirebotMessage(ev)}
    firebotWebsocket.onerror = (ev)=>{
        console.error("Firebot websocket ERROR: ",ev)
        firebotWebsocket = undefined
    }
}

// #endregion

// #region handling

async function onFirebotMessage(event) {
    let data = await JSON.parse(event.data)
    if (data.type == "response" && data.name == "success") {
        sendNotification("Messaging from Firebot established")
    }
    let botEventId = data.name.replace("custom-event:","")
    if (registeredIntegrationBotEvents.get(botEventId)) {
        registeredIntegrationBotEvents.get(botEventId).handler(data.data)
    }
}

async function dispatchFBEvent(id, data) {
    let ev = registeredIntegrationEvents.get(id)
    data.eventId = ev.id
    let dataString = JSON.stringify(data)
    fetch(`http://localhost:7472/api/v1/effects/preset/${ev.firebot_id}/run`,{
		"method": "POST",
		"headers": {"Content-Type": "application/json"},
		"body": JSON.stringify({"args":dataString})
	})
}

// #endregion

// #endregion


// #region MixItUp

// var mixitupWebsocket - //04.2026 - no websocket avaliable in MIU
var mixitupEventsTotal
var mixitupEventsFound
// #region init
function connectMIU() {
    mixitupEventsTotal = 0
    mixitupEventsFound = 0
    getMIUEvents()
}

async function getMIUEvents() {
	let effectLists = await fetch("http://localhost:8911/api/v2/commands").then((responce)=>responce.json()).then((obj)=>{return obj["Commands"]}).catch(()=>{return})
    if (effectLists) {
        for (let eventId of registeredIntegrationEvents.keys()) {
            let event = registeredIntegrationEvents.get(eventId) 
            if (event.integrations.includes(INTEGRATION_TYPE.MIU)){
                mixitupEventsTotal++
                fetchMIUEventId(effectLists, event)
            }
        }
        if (mixitupEventsTotal > 0) {
            if (mixitupEventsFound < mixitupEventsTotal) {
                sendWarn("Found mixitup action groups: " + mixitupEventsFound.toString() + "/" + mixitupEventsTotal.toString())
            } else {
                sendNotification("Found mixitup action groups: " + mixitupEventsFound.toString() + "/" + mixitupEventsTotal.toString())
            }
        }

    } else {
        eventIntegrationFail()
    }
}

function fetchMIUEventId(effectLists, event) {
    for (let effectId in effectLists) {
        if (effectLists[effectId].Type == "Action Group" && effectLists[effectId].Name == event.id) {
            mixitupEventsFound++
            event.mixitup_id = effectLists[effectId].ID
        }
    }
}
// #endregion


// #region handling

async function dispatchMIUEvent(id, data) {
    let ev = registeredIntegrationEvents.get(id)
    data.eventId = ev.id
    let dataString = JSON.stringify(data)
	fetch("http://localhost:8911/api/v2/commands/" + ev.mixitup_id,{
		"method": "POST",
		"headers": {
			"Content-Type": "application/json"
		},
		"body": JSON.stringify({"SpecialIdentifiers":data})
	})
}

// #endregion

// #endregion


// #region Streamer.Bot


var streamerbotWebsocket = undefined
var sbPort = "8080"
var sbAwaitAuth = false
var sbEventsTotal
var sbEventsFound

// #region init


function connectSB() {
    sbEventsFound = 0
    sbEventsTotal = 0
	let url = "ws://" + getSetting("sb_ip").toString() + ":" + getSetting("sb_port").toString() + getSetting("sb_endpoint").toString()
	streamerbotWebsocket = new WebSocket(url)
	streamerbotWebsocket.onmessage = onMessageSB
    streamerbotWebsocket.onerror = (ev)=>{
        console.error("Streamer.Bot websocket ERROR: ",ev)
        streamerbotWebsocket = undefined
        eventIntegrationFail()
    }
}

async function sha256Base64(input) {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);

	// convert to base64
	const bytes = new Uint8Array(hashBuffer);
	let binary = "";
	bytes.forEach(b => binary += String.fromCharCode(b));
	return btoa(binary);
}

async function authenticate(data, password) {
	const { salt, challenge } = data.authentication;

	const secret = await sha256Base64(password + salt);
	const authentication = await sha256Base64(secret + challenge);

	const authRequest = {
		id: "1",
		request: "Authenticate",
		authentication
	};
	sbAwaitAuth = true
	streamerbotWebsocket.send(JSON.stringify(authRequest));
	
}

function requestSBActions() {
	streamerbotWebsocket.send(JSON.stringify({
		"request": "GetActions",
		"id": window.crypto.randomUUID()
	}))
}

function getSBEvents(actions) {
    for (let eventId of registeredIntegrationEvents.keys()) {
        let ev = registeredIntegrationEvents.get(eventId)
        if (ev.integrations.includes(INTEGRATION_TYPE.SB)) {
            sbEventsTotal++
            for (let action of actions) {
                if (action.name == ev.id) {
                    sbEventsFound++
                    ev.streamerbot_id = action.id
                }
            }
        }
    }
    
    if (sbEventsTotal > 0) {
        if (sbEventsFound < sbEventsTotal) {
            sendWarn("Found Streamer.Bot actions: " + sbEventsFound.toString() + "/" + sbEventsTotal.toString())
        } else {
            sendNotification("Found Streamer.Bot actions: " + sbEventsFound.toString() + "/" + sbEventsTotal.toString())
        }
    }
}

// #endregion 
// #region handling

async function onMessageSB(message) {
	const data = await JSON.parse(message.data)
	if (data.request && data.request == "Hello") {
		if (data.authentication) {
			await authenticate(data, getSetting("sb_password"))
			return
		} else {
            sendNotification("Connected to Streamer.Bot")
			requestSBActions()
			return
		}
	}
	if (sbAwaitAuth && data.status && data.status == "ok") {
		sbAwaitAuth = false
        sendNotification("Connected to Streamer.Bot")
		requestSBActions()
		return
	}
    if (data.actions) {
        getSBEvents(data.actions)
        return
    }
    // TODO: if there is a way to message back from streamer.bot i will implmnt it. Fuck this piece of shit software
}

function dispatchSBEvent(id, data) {
	let action = registeredIntegrationEvents.get(id)
    data.eventId = id
	let obj = JSON.stringify({
		"id": window.crypto.randomUUID(),
		"request": "DoAction",
		"action": {
            "id": action.streamerbot_id,
            "name": action.id
        },
		"args":data
	})
	streamerbotWebsocket.send(obj)
}

// #endregion 
// #endregion 


// #endregion bot specific