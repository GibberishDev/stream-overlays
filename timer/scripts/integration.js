// #region general
const INTEGRATION_TYPE = Object.freeze({
	NONE: 0, //no integration active
	SB: 1, //Streamer.Bot integration
	FB: 2, //FireBot integration
	MIU: 3, //MixItUp integration
})
var currentIntegration = INTEGRATION_TYPE.FB
let registeredIntegrationEvents = new Map()
let registeredIntegrationSignals = new Map()

function connectIntegration() {
    switch (currentIntegration) {
        case INTEGRATION_TYPE.FB : {
            connectFB()
            break
        }
    }
}

class IntegrationSignal {
    constructor(id, name, group="", integrations=[]) {
        this.id = id
        this.integrations = integrations
        if (this.integrations.toString() == "") {
            this.integrations = [INTEGRATION_TYPE.FB,INTEGRATION_TYPE.SB,INTEGRATION_TYPE.MIU]
        }
        registeredIntegrationEvents.set(this.id, this)
    }
    dispatch(data={}) {
        if (!this.integrations.includes(currentIntegration)) return
    }
}
class IntegrationEvent {
    constructor(id, handler) {

    }
}

// #endregion

// #region bot specific


// #region Firebot

var firebotWebsocket

// #region init

function connectFB() {
    setupWebsocket()
}

function setupWebsocket() {
    firebotWebsocket = new WebSocket("ws://localhost:7472")
    firebotWebsocket.onopen = (ev)=>{
        firebotWebsocket.send(JSON.stringify({
            "type": "invoke",
            "id": 0,
            "name": "subscribe-events",
            "data": []
        }))
    }
    firebotWebsocket.onmessage = (ev)=>{onFirebotMessage(ev)}
    firebotWebsocket.onclose = (ev)=>{console.info("Firebot websocket closed: ",ev.reason)}
    firebotWebsocket.onerror = (ev)=>{console.error("Firebot websocket ERROR: ",ev)}
}

async function onFirebotMessage(event) {
    let data = await JSON.parse(event.data)
    if (data.type == "response" && data.name == "success") {
        sendNotification("Messaging from Firebot established")
    }
}

async function dispatchEvent(id, data) {

}

// #endregion

// #endregion


// #endregion bot specific