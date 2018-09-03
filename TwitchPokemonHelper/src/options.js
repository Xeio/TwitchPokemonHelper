document.addEventListener("DOMContentLoaded", function(event) { 
    chrome.extension.sendMessage({action: "getActivate"}, setActivated);
    chrome.extension.sendMessage({action: "getVolume"}, setVolume);
    document.getElementById("activator").onclick = toggleActivate;
    document.getElementById("volume").onclick = volumeChanged;
});

function toggleActivate(){
    chrome.extension.sendMessage({action: "toggleActivate"}, setActivated);
}

function volumeChanged(){
    chrome.extension.sendMessage({action: "setVolume", volume: document.getElementById("volume").value}, setVolume);
}

function setActivated(value){
    var activator = document.getElementById("activator");
    if(value){
        activator.src = chrome.runtime.getURL("media/icon-enabled.png");
        activator.title = "Sound Enabled";
    }
    else{
        activator.src = chrome.runtime.getURL("media/icon-disabled.png");
        activator.title = "Sound Disabled";
    }
}

function setVolume(value){
    document.getElementById("volume").value = value;
}