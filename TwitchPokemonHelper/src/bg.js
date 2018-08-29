var playSound = true;

function load(){
    chrome.storage.local.get(["playSound"], function(value){
        if(value.playSound !== undefined){
            setPlaySound(value.playSound);
        }
        else {
            setPlaySound(true);
        }
    });
    chrome.browserAction.onClicked.addListener(extensionButtonClick);
    chrome.extension.onMessage.addListener(onMessage);
}

function onMessage(request, sender, response){
    if (request.action == "badge"){
        if(!playSound) return;
        var audio = new Audio();
        audio.src = "media/badge_notification.mp3"
        audio.play();
    }
}

function extensionButtonClick(tab){
    setPlaySound(!playSound);
}

function setPlaySound(value){
    playSound = value;
    chrome.storage.local.set({"playSound": value});
    if(playSound){
        chrome.browserAction.setIcon({"path" : "media/icon-enabled.png"});
    }
    else{
        chrome.browserAction.setIcon({"path" : "media/icon-disabled.png"});
    }
}

load();