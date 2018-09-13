var _playSound = true;
var _volume = 1;
var _debugMode = !chrome.runtime.getManifest().update_url;

load();

function load(){
    chrome.storage.local.get(["playSound", "volume"], function(value){
        if(value.playSound !== undefined){
            setPlaySound(value.playSound);
        }
        else {
            setPlaySound(true);
        }
        if(value.volume !== undefined){
            _volume = value.volume;
        }
        else{
            _volume = 1;
        }
    });
    chrome.extension.onMessage.addListener(onMessage);
    chrome.runtime.onMessageExternal.addListener(onMessage);
}

function onMessage(request, sender, sendResponse){
    if (request.action == "badge"){
        handleBadgeMessage(request);
    }
    else if (request.action == "getActivate"){
        sendResponse(_playSound);
    }
    else if (request.action == "toggleActivate"){
        setPlaySound(!_playSound);
        sendResponse(_playSound);
    }
    else if (request.action == "getVolume"){
        sendResponse(_volume);
    }
    else if (request.action == "setVolume"){
        setVolume(request.volume);
        sendResponse(_volume);
    }
}

function extensionButtonClick(tab){
    setPlaySound(!_playSound);
}

function setPlaySound(value){
    _playSound = value;
    chrome.storage.local.set({"playSound": value});
    if(_playSound){
        chrome.browserAction.setIcon({"path" : "media/icon-enabled.png"});
    }
    else{
        chrome.browserAction.setIcon({"path" : "media/icon-disabled.png"});
    }
}

function setVolume(value){
    _volume = value;
    chrome.storage.local.set({"volume": value});
    play();
}

function play(newPokemon){
    var audio = new Audio();
    audio.volume = _volume;
    if(!newPokemon){
        audio.src = "media/badge_notification.mp3"
    }
    else{
        audio.src = "media/new_pokemon_notification.mp3"
    }
    audio.play();
}

function handleBadgeMessage(request){
    if(_debugMode){
        console.log(request.message, request.pokemonData, request.collectionData);
    }

    let pokemonId = request.message.spawnedItem.itemId;
    let collectionInfo = request.collectionData.find(i => i.itemId == pokemonId);
    let newPokemon = !collectionInfo || !collectionInfo.collected;

    if(_debugMode && newPokemon){
        let pokemonInfo = request.pokemonData.find(i => i.id == pokemonId);
        console.log(`New pokemon detected ${pokemonInfo && pokemonId.nameEn}`)
    }

    if(!_playSound) return;
    play(newPokemon);
}