let _debugMode = !chrome.runtime.getManifest().update_url;
const TWITCH_URL = "https://www.twitch.tv/twitchpresents";

preferences.load().then(updateIcon);
chrome.extension.onMessage.addListener(onMessage);
chrome.runtime.onMessageExternal.addListener(onMessage);
chrome.tabs.onUpdated.addListener(onTabsUpdated);

function onMessage(request, sender, sendResponse){
    if (request.action == "badge"){
        handleBadgeMessage(request);
        forwardMessageToTabs(request);
    }
    else if (request.action == "setPreference"){
        handleSetPreference(request);
    }
}

function forwardMessageToTabs(message){
    chrome.tabs.query({url:TWITCH_URL},
        (tabs) => tabs.forEach((tab) => chrome.tabs.sendMessage(tab.id, message)));
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
        console.log(`New pokemon detected ${pokemonInfo && pokemonInfo.nameEn}`)
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
    else if(request.preference.name == preferences.NEW_BADGE_VOLUME.name){
        play(true, true);
    }
    else if(request.preference.name == preferences.SHOW_BADGE_DURING_ADS.name){
        chrome.permissions.request({ origins: [TWITCH_URL] }, function(granted) {
            if (granted) {
                reloadTwitchTabs();
            } else {
                preferences.setPrefValue(preferences.SHOW_BADGE_DURING_ADS, false);
                preferences.saveAll();
            }
        });
    }

    updateIcon();
}

function updateIcon(){
    let enabled = preferences.getPrefValue(preferences.ENABLED);
    if(enabled){
        chrome.browserAction.setIcon({"path" : "media/icon-enabled.png"});
    }
    else{
        chrome.browserAction.setIcon({"path" : "media/icon-disabled.png"});
    }
}

function onTabsUpdated(tabId, changeInfo, tab) {
    if(changeInfo.status === "complete" && tab.url === TWITCH_URL){
        if(preferences.getPrefValue(preferences.SHOW_BADGE_DURING_ADS))
        {
            chrome.tabs.executeScript(tabId, {file: 'src/twitchPresentsInject.js'});
        }
    }
}

function reloadTwitchTabs(){
    chrome.tabs.query({url:TWITCH_URL},
        (tabs) => {
            tabs.forEach((t) => chrome.tabs.reload(t.id));
        });
}