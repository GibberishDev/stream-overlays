const INTEGRATION_TYPE = Object.freeze({
	NONE: 0, //no integration active
	SB: 1, //Streamer.Bot integration
	FB: 2, //FireBot integration
	MIU: 3, //MixItUp integration
})
var activeIntegration = INTEGRATION_TYPE.NONE

function integrationConnect() {
	switch (activeIntegration) {
		case INTEGRATION_TYPE.NONE : {
			return false
		}
		case INTEGRATION_TYPE.MIU : {
			connectMIU()
			break
		}
		case INTEGRATION_TYPE.SB : {
			if (typeof(getSetting) == 'function') sbPassword = getSetting("sb_password")
			connectSB()
			break
		}
		case INTEGRATION_TYPE.FB : {
			connectFB()
			break
		}
	}
}

function sendData(eventId,data={}) {
	switch (activeIntegration) {
		case INTEGRATION_TYPE.SB : {
			if (streamerbotActions.get(eventId)) {
				doSBAction(eventId, data)
			}
			break
		}
		case INTEGRATION_TYPE.MIU : {
			doMIUCommand(eventId, data)
			break
		}
		case INTEGRATION_TYPE.FB : {
			doFBCommand(eventId, data)
			break
		}
	}
}
function eventIntegrationReady() {
	moduleReady("integration")
	var integrationName
	switch (activeIntegration) {
		case INTEGRATION_TYPE.NONE : {
			return
		}
		case INTEGRATION_TYPE.FB : {
			integrationName = "Firebot"
			break
		}
		case INTEGRATION_TYPE.SB : {
			integrationName = "Streamer.Bot"
			break
		}
		case INTEGRATION_TYPE.MIU : {
			integrationName = "MixItUp"
			break
		}
	}
	postNotification("Connected to bot integration: " + integrationName)
	sendData("integration_connected")
}
function eventIntegrationFail() {
	postNotification("<span style='color:red;font-weight:bold;'>Failed to connect to chatbot integration. Continuing without integration...</span>")
	moduleReady("integration")

}

// #region mixitup

var miu_command

async function connectMIU() {
	let commands = await fetch("http://localhost:8911/api/v2/commands").then((responce)=>responce.json()).then((obj)=>{return obj["Commands"]}).catch((err)=>{
		eventIntegrationFail()
		return
	})
	for (let i in commands) {
		let command = commands[i]
		if (command.GroupName == "ACC") {
			miu_command = command
		}
	}
	if (miu_command) {
		eventIntegrationReady()
	}
}

function doMIUCommand(id,data) {
	switch (id) {
		case "combo_achieved_regular" : data.accEventType = "achievedRegular"; break
		case "combo_achieved_mega" : data.accEventType = "achievedMega"; break
		case "combo_achieved_super" : data.accEventType = "achievedSuper"; break
		case "combo_expired_regular" : data.accEventType = "expiredRegular"; break
		case "combo_expired_mega" : data.accEventType = "expiredMega"; break
		case "combo_expired_super" : data.accEventType = "expiredSuper"; break
		case "combo_expired" : data.accEventType = "expired"; break
		case "integration_connected" : data.accEventType = "connected"; break
	}
	fetch("http://localhost:8911/api/v2/commands/" + miu_command.ID,{
		"method": "POST",
		"headers": {
			"Content-Type": "application/json"
		},
		"body": JSON.stringify({"SpecialIdentifiers":data})
	})
}
// #endregion

// #region streamerbot

let streamerbotActions = new Map()
var ws = undefined
var sbPort
var sbPassword
var sbAwaitAuth = false
var sbAwaitGreet = false

function connectSB() {
	let url = "ws://" + (registeredSettings.get("sb_ip").get()).toString() + ":" + (registeredSettings.get("sb_port").get()).toString() + (registeredSettings.get("sb_endpoint").get()).toString()
	ws = new WebSocket(url)
	ws.onmessage = onMessageSB
	sbAwaitGreet = true
	setTimeout(sbGreetingFail,3000)
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

function sbGreetingFail() {
	if (sbAwaitGreet) {
		eventIntegrationFail()
	}
}

async function authenticate(ws, data, password) {
	const { salt, challenge } = data.authentication;

	const secret = await sha256Base64(password + salt);
	const authentication = await sha256Base64(secret + challenge);

	const authRequest = {
		id: "1",
		request: "Authenticate",
		authentication
	};
	sbAwaitAuth = true
	ws.send(JSON.stringify(authRequest));
	
}

function getSBActions() {
	ws.send(JSON.stringify({
		"request": "GetActions",
		"id": uuidv4()
	}))
}

async function onMessageSB(message) {
	const data = await JSON.parse(message.data)
	if (data.request && data.request == "Hello") {
		sbAwaitGreet = false
		if (data.authentication) {
			await authenticate(ws, data, sbPassword)
			return
		} else {
			let event = new Event("sb_authenticated")
			document.dispatchEvent(event)
			getSBActions()
			return
		}
	}
	if (sbAwaitAuth && data.status && data.status == "ok") {
		sbAwaitAuth = false
		let event = new Event("sb_authenticated")
		document.dispatchEvent(event)
		getSBActions()
		return
	}
	if (data.actions) {
		for (let action of data.actions) {
			if (action.group == "ACC") {
				switch (action.name) {
					case "combo achieved - regular" : {
						streamerbotActions.set("combo_achieved_regular", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						break
					}
					case "combo achieved - mega" : {
						streamerbotActions.set("combo_achieved_mega", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						
						break
					}
					case "combo achieved - super" : {
						streamerbotActions.set("combo_achieved_super", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						
						break
					}
					case "combo expired" : {
						streamerbotActions.set("combo_expired", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						
						break
					}
					case "combo expired - regular" : {
						streamerbotActions.set("combo_expired_regular", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						break
					}
					case "combo expired - mega" : {
						streamerbotActions.set("combo_expired_mega", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						break
					}
					case "combo expired - super" : {
						streamerbotActions.set("combo_expired_super", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						break
					}
					case "overlay connected" : {
						streamerbotActions.set("integration_connected", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						break
					}
				}
			}
		}
		if (streamerbotActions.get("integration_connected")) {
			sendData("integration_connected")
			eventIntegrationReady()
		}
	}
}

function doSBAction(actionId, args) {
	let action = streamerbotActions.get(actionId).action
	let obj = JSON.stringify({
		"id": uuidv4(),
		"request": "DoAction",
		"action": {
			"id": action.id,
			"name": action.name
		},
		"args":args
	})
	ws.send(obj)
}
// #endregion

// #region firebot

var fb_effectListID = ""

async function connectFB() {
	let effectLists = await fetch(
		"http://localhost:7472/api/v1/effects/preset",
		{
			method:"GET",
			"headers":{"Content-Type": "application/json"}
		}
	).then((resp)=>resp.json()).catch((err)=>{
		eventIntegrationFail()
		return
	})
	if (effectLists) {
		for (let effectList of effectLists) {
			if (effectList.name == "ACC") {
				fb_effectListID = effectList.id
				break
			}
		}
		if (fb_effectListID) eventIntegrationReady()
	}
}

function doFBCommand(id,data) {
	switch (id) {
		case "combo_achieved_regular" : data.accEventType = "achievedRegular"; break
		case "combo_achieved_mega" : data.accEventType = "achievedMega"; break
		case "combo_achieved_super" : data.accEventType = "achievedSuper"; break
		case "combo_expired_regular" : data.accEventType = "expiredRegular"; break
		case "combo_expired_mega" : data.accEventType = "expiredMega"; break
		case "combo_expired_super" : data.accEventType = "expiredSuper"; break
		case "combo_expired" : data.accEventType = "expired"; break
		case "integration_connected" : data.accEventType = "connected"; break
	}
	fetch(`http://localhost:7472/api/v1/effects/preset/${fb_effectListID}/run`,{
		"method": "POST",
		"headers": {
			"Content-Type": "application/json"
		},
		"body": JSON.stringify({"args":data})
	})
}

// #endregion

// #recieve data

let fbws = new WebSocket("ws://localhost:7472")
fbws.onopen = (ev)=>{
    console.log("OPENED: ",ev)
    fbws.send(JSON.stringify({
        "type": "invoke",
        "id": 0,
        "name": "subscribe-events",
        "data": []
    }))
}
fbws.onmessage = (ev)=>{
    console.log("MESSAGE: ",ev)
}
fbws.onclose = (ev)=>{
    console.log("CLOSED: ",ev)
}
fbws.onerror = (ev)=>{
    console.log("ERROR: ",ev)
}
console.log(fbws)
// #endregion