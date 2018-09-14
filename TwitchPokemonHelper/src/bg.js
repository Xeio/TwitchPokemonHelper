var _debugMode = !chrome.runtime.getManifest().update_url;

preferences.load().then(updateIcon);
chrome.extension.onMessage.addListener(onMessage);
chrome.runtime.onMessageExternal.addListener(onMessage);

function onMessage(request, sender, sendResponse){
    if (request.action == "badge"){
        handleBadgeMessage(request);
    }
    else if (request.action == "setPreference"){
        handleSetPreference(request);
    }
}

function play(newPokemon, preview){
    if(!preferences.getPrefValue(preferences.ENABLED) && !preview){
        return;
    }

    if(newPokemon && (preview || preferences.getPrefValue(preferences.NEW_BADGE_ENABLED))){
        let audio = new Audio();
        audio.volume = preferences.getPrefValue(preferences.NEW_BADGE_VOLUME);
        audio.src = "media/new_pokemon_notification.mp3"
        audio.play();
    }
    else if(!newPokemon && (preview || preferences.getPrefValue(preferences.EXISTING_BADGE_ENABLED))){
        let audio = new Audio();
        audio.volume = preferences.getPrefValue(preferences.EXISTING_BADGE_VOLUME);
        audio.src = "media/badge_notification.mp3"
        audio.play();
    }
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

    play(newPokemon);
}

function handleSetPreference(request){
    preferences.setPrefValue(request.preference, request.value);
    preferences.saveAll();

    //Play previews for new volumes
    if(request.preference.name == preferences.EXISTING_BADGE_VOLUME.name){
        play(false, true);
    }
    if(request.preference.name == preferences.NEW_BADGE_VOLUME.name){
        play(true, true);
    }

    updateIcon();
}

function updateIcon(){
    var enabled = preferences.getPrefValue(preferences.ENABLED);
    if(enabled){
        chrome.browserAction.setIcon({"path" : "media/icon-enabled.png"});
    }
    else{
        chrome.browserAction.setIcon({"path" : "media/icon-disabled.png"});
    }
}