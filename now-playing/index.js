let interval = 1000 //File contents check interval in ms.

var lastTrackData = JSON.parse("{}") //Variable of now playing track details from last check for new file to be compared against


/*
Example data from MPRIS source (MPRIS is cause i dont have access to spotify even if i wanted it):
{
    "album":"Vandereer",
    "artists":["El Huervo"],
    "cover_path":"file:///tmp/.org.chromium.Chromium.yW3OjF",
    "cover_url":"http://localhost:1608/cover.png",
    "duration":192655,
    "lyrics":"n/a",
    "playback_date":"2025.09.29",
    "playback_time":"22:35:36",
    "status":"playing",
    "status_id":0,
    "title":"All About You (Too)"
}
*/

/**
 * Performs fetch request on a local file. I did not want to bother with all the default browser security stuff
 * so its basically bshing rocks against other rocks here.
 */
function fetchFile() {
    fetch("data.json") /*Fetch file*/ 
        .then(responce => {
            if (!responce.ok) {return "null"} /* no file -> fkn die */
            responce.text() /* get string contents of file */
            .then(text => {
                if (text === "null") {return "null"} /* "null" id default no track playing return from Tuna plugin in obs. aka no music -> fkn die */
                let json_object = null /* check if valid json */
                try {json_object = JSON.parse(text)} 
                catch (e) {return "null"} /* not valid json -> fkn die */
                checkData(json_object) /* send to next method to check the contents of the fetched data */
            })
        })
}
/**
 * Compares new track data to last one to see if update to DOM content is needed
 * 
 * @param {JSON} trackData new data to be compared against lastTrackData
 */
function checkData(trackData) {
    var newData = { 
        "title": trackData.title,
        "artists": trackData.artists
    } /* construct data object with track data we are interested in */
    if (newData.title != lastTrackData.title) { /* if not same as last one -> update DOM */
        console.log("aaa")
        lastTrackData = newData
        updateDomContent()
    }
}


/**
 * Updates dom content with new data and triggers css styling aniamtions reflow
 */
function updateDomContent() {
    document.querySelector("#disc-image").src = "cover.png?t=" + String(new Date().getTime()) /* Set new image. Use Date thingie to not use chached result. This might be a memory leak but its insignificat and i dont care. I have no idea how to clear web cache through code */
    document.querySelector("#music-title").innerHTML = lastTrackData.title /* Set new title */
    document.querySelector("#music-artists").innerHTML = lastTrackData.artists[0] /* Set new artists text. First array element used cus my MPRIS source returns all artists in a string as a first element. If you dont have it like that... I guess deal with it. If ya look here ya prob know what ya're doing */
    triggerReflow(document.querySelector("#anchor")) /* retrigger aniamtion of the anchor DOM element */
}

/**
 * Trigger element styling reflow to restart animations and update css forsibly
 * 
 * @param {DOMElement} element - elements we want to reflow
 */
function triggerReflow(element) {
    element.style.animation = 'none';
    void element.offsetHeight;
    element.style.animation = null;
}

/**
 * triggers fetch file in intervals
 */
function ticker() {
    console.log(lastTrackData)
    fetchFile()
    setTimeout(ticker, interval) /* restart self */
}
ticker() /* kickstart */