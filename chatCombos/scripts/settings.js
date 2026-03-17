export var comboSettings = {
    timeoutRegular : 10000,
    timeoutMega : 15000,
    timeoutSuper : 20000,
    numberRegular : 2,
    numberMega : 10,
    numberSuper : 25,
    showTimer: true,
    megaEnabled : true,
    superEnabled : true,
    channel: "gibbdev",
}

function loadSettings() {
    moduleReady("settings")
}