// #region ready

setModuleList([
	"settings"
])


// #endregion


// #region settings

// #region integration settings
new SettingSelect("integrationtype", 0,{
	0:"None",
	1:"<img style='height:24px;width:36px;object-fit:contain;display:inline-block;position:relative;margin:0;margin-right:8px;' src='./assets/sb_logo.svg'>Streamer.Bot",
	2:"<img style='height:24px;width:36px;object-fit:contain;display:inline-block;position:relative;margin:0;margin-right:8px;' src='./assets/miu_logo.ico'>MixItUp",
	3:"<img style='height:24px;width:36px;object-fit:contain;display:inline-block;position:relative;margin:0;margin-right:8px;' src='./assets/fb_logo.png'>FireBot"
},"Bot integration type", "Allows sending events to chat bots")
new SettingString("sb_ip", "127.0.0.1","Streamerbot websocket ip", "In case you set up custom websocket server ip enter it here")
new SettingNumber("sb_port", 8080, 0, 655353, 1,"Streamerbot websocket port", "Port number of streamer.bot websocket server. default is 8080")
new SettingString("sb_endpoint", "/", "Streamerbot websocket endpoint", "In case you set up custom endpoint for websocket server enter it here")
new SettingString("sb_password", "","Streamerbot websocket password", "In case you set up connection password enter it here", true)

// #endregion


// #region debug settings
new SettingBool("debug",false,"Show debug options","Toggles display of debbuging tools and information")
new SettingBool("show_notifications",true,"Show notifications","Toggles display of notification popups")
new SettingBool("show_notifications_debug",false,"Show debug notifications","Toggles display of debug notification popups. includes more precises info of what overlay is currently doing")
new SettingBool("show_fps",false,"Show FPS")

// #endregion


// #region settings event hooks

document.addEventListener("settingchanged",(ev)=>{
	switch (ev.id) {
		case "show_fps" : {
			if (getSetting("show_fps")) {
				document.getElementById("fps").style.display = ""
			} else {
				document.getElementById("fps").style.display = "none"
			}
			break
		}
		case "show_notifications_debug" : {
			if (getSetting("show_notifications_debug")) {
				document.documentElement.style.setProperty("--notifications-logs-display","block")
			} else {
				document.documentElement.style.setProperty("--notifications-logs-display","none")
			}
		}
		case "show_notifications" : {
			if (getSetting("show_notifications")) {
				document.querySelector("#notifications-wrapper").style.display = ""
			} else {
				document.querySelector("#notifications-wrapper").style.display = "none"
			}
		}

		
	}
})

// #endregion


initSettings()
// #endregion

// #region settings menu layout
new LayoutCategory(new LayoutCondition("always"),[
	new LayoutSetting(new LayoutCondition("always"), "integrationtype", true, true),
	new LayoutText(new LayoutCondition("integrationtype",1),"","StreamerBot integration is done through network websocket connection that is hosted in Streamer.Bot client app. Unfortunatelly right now that allows only to execute actions in StreamerBot. Recieving data from it to overlay is not implemented yet. (idk if its possible without huge perfomance overhead. StreamerBot sucks anyway <img style='max-height:24px;display:inline-block;' src='https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_30da040e9052460688ad37dd8c0d0c4a/default/dark/1.0' alt='₍^. ‸ .^₎⟆'><br><span>To enable websocket set it up in sidebar via `Servers/Clients > WebSocket Server`. Edit settings if you know what you are doing and copy them below.</span><br><br>", true, false),
	new LayoutText(new LayoutCondition("integrationtype",2),"","<span>Firebot integration is done through localhosted api and localhosted WebSocket. this allows to send event execution requests to firebot AND recieve signals from it via websocket.</span><br><span>Should work out of the box. If overlay requires additional effect lists check `assets` foulder for setup</span>", true, false),
	new LayoutText(new LayoutCondition("integrationtype",3),"","<span>MixItUp integration is done through localhosted api on port 8911</span><br><span>To enable it please got o mixitup settings and </span>", true, false),
	new LayoutSetting(new LayoutCondition("integrationtype",1), "sb_ip", false, false),
	new LayoutSetting(new LayoutCondition("integrationtype",1), "sb_port", false, false),
	new LayoutSetting(new LayoutCondition("integrationtype",1), "sb_endpoint", false, false),
	new LayoutSetting(new LayoutCondition("integrationtype",1), "sb_password", false, false),
],"Bot integration",true, false)
new LayoutCategory(new LayoutCondition("always"),[
	new LayoutSetting(new LayoutCondition("always"),"debug"),
	new LayoutSetting(new LayoutCondition("always"),"show_notifications"),
	new LayoutSetting(new LayoutCondition("debug",true),"show_notifications_debug", false, false),
	new LayoutSetting(new LayoutCondition("debug",true),"show_fps", false, false),
	new LayoutLog(new LayoutCondition("debug",true),true,false)
],"Debug",true,false)
// #endregion

// #region integration init

new IntegrationOverlayEvent("timer_started","timer_started")

new IntegrationBotEvent("add_time",addTime)

// #endregion

function start() {
	connectIntegration()
}

function logSpam() {
	sendLog("AAAAAA")
	setTimeout(logSpam,3000)
}

function addTime(data) {
	let timeToAdd = data.time
}

start()