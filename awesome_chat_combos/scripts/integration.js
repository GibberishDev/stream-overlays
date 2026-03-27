const INTEGRATION_TYPE = Object.freeze({
	NONE: 0, //no integration active
	SB: 1, //Streamer.Bot integration
	FB: 2, //FireBot integration
	MIU: 3, //MixItUp integration
})
const INTEGRATION_STATES = Object.freeze({
	NONE: 0, //no integration active
	READY: 1, //integration working and got responce if applicable from bot software
	CONNECTING: 2, //integration is in process of connecting to bot software
	FAILED: 3 //integration failed to connect to bot software
})
var activeIntegration = INTEGRATION_TYPE.NONE
var integrationState = INTEGRATION_STATES.NONE

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
			connectSB(registeredSettings.get("sb_port").get(),registeredSettings.get("sb_password").get())
			break
		}
	}
}

let integrationEvents = new Map()

function sendData(eventId,data={}) {
	switch (activeIntegration) {
		case INTEGRATION_TYPE.SB : {
			if (integrationEvents.get(eventId)) {
				doSBAction(eventId, data)
			}
			break
		}
		case INTEGRATION_TYPE.MIU : {
			doMIUCommand(eventId, data)
			break
		}
	}
}
function eventIntegrationReady() {
	moduleReady("integration")
}


// #region mixitup

var miu_command

async function connectMIU() {
	let commands = await fetch("http://localhost:8911/api/v2/commands").then((responce)=>responce.json()).then((obj)=>{return obj["Commands"]})
	for (let i in commands) {
		let command = commands[i]
		if (command.GroupName == "ACC") {
			miu_command = command
		}
	}
	if (miu_command) {
		console.log("miu connected")
	} else {
		console.log("fuck you")
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

var ws = undefined
var sbPort
var sbPassword
var sbAwaitAuth = false

function connectSB(port, password="") {
	sbPort = port
	sbPassword = password
	ws = new WebSocket("ws://127.0.0.1:"+port)

	ws.onmessage = onMessageSB
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
						integrationEvents.set("combo_achieved_regular", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						break
					}
					case "combo achieved - mega" : {
						integrationEvents.set("combo_achieved_mega", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						
						break
					}
					case "combo achieved - super" : {
						integrationEvents.set("combo_achieved_super", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						
						break
					}
					case "combo expired" : {
						integrationEvents.set("combo_expired", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						
						break
					}
					case "combo expired - regular" : {
						integrationEvents.set("combo_expired_regular", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						break
					}
					case "combo expired - mega" : {
						integrationEvents.set("combo_expired_mega", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						break
					}
					case "combo expired - super" : {
						integrationEvents.set("combo_expired_super", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						break
					}
					case "overlay connected" : {
						integrationEvents.set("integration_connected", {
							type: INTEGRATION_TYPE.SB,
							action: action
						})
						break
					}
				}
			}
		}
		if (integrationEvents.get("integration_connected")) sendData("integration_connected")
	}
}

function doSBAction(actionId, args) {
	let action = integrationEvents.get(actionId).action
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
