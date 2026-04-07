// #region settings declarations

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
// #endregion

// #region settings menu layout
new LayoutCategory(new LayoutCondition("always"),[
	new LayoutSetting(new LayoutCondition("always"), "integrationtype", true, true),
	new LayoutSetting(new LayoutCondition("integrationtype",1), "sb_ip", false, true),
	new LayoutSetting(new LayoutCondition("integrationtype",1), "sb_port", false, true),
	new LayoutSetting(new LayoutCondition("integrationtype",1), "sb_endpoint", false, true),
	new LayoutSetting(new LayoutCondition("integrationtype",1), "sb_password", false, true),
],"Bot integration",true, false)
// #endregion

// #region integration init

new IntegrationOverlayEvent("timer_started","timer_started")

new IntegrationBotEvent("add_time",addTime)

// #endregion

function start() {
	connectIntegration()
}

function addTime(data) {
	let timeToAdd = data.time
}

start()