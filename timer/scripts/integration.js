// #region general
const INTEGRATION_TYPE = Object.freeze({
	NONE: 0, //no integration active
	SB: 1, //Streamer.Bot integration
	FB: 2, //FireBot integration
	MIU: 3, //MixItUp integration
})
var currentIntegration = INTEGRATION_TYPE.FB

function connectIntegration() {
    switch (currentIntegration) {
        case INTEGRATION_TYPE.FB : {
            connectFB()
            break
        }
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
        console.info("Messaging from Firebot established")
    }
}

// #endregion

// #endregion


// #endregion bot specific