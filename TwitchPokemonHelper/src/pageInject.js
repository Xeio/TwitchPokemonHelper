var hasPokeball = document.getElementsByClassName("pokeball--icon").length > 0;
var pokemonData = [];
var collectionData = [];

if(hasPokeball){
    var interval = setInterval(() => {
        if(window.Twitch && window.Twitch.ext){
            clearInterval(interval);
            window.Twitch.ext.listen("global", handleTwitchMessage);
        }
    }, 1000);

    //This is kinda hacky, want to find the pokemon list and list of current pokemon but viewer.js doesn't expose any state objects
    //So we'll temporarily hijack Array.prototype methods to capture it then pass-through
    arrayFindPrototype = Array.prototype.find;
    Array.prototype.find = function(f){
        if(this.length > 0 && this[0].generation && this[0].region){
            pokemonData = this;
            Array.prototype.find = arrayFindPrototype;
        }
        return arrayFindPrototype.call(this, f);
    }

    arrayMapPrototype = Array.prototype.map;
    Array.prototype.map = function(f, thisArg){
        if(this.length > 0 && this[0].userId && this[0].spawnId && this[0].itemId){
            collectionData = this;
            //Note that the collection data changes during use, so we need to keep capturing this every time
        }
        return arrayMapPrototype.call(thisArg || this, f);
    }
}

function handleTwitchMessage(messageChannel, messageType, messageContent) {
    var message = JSON.parse(messageContent);
    if(message.env === "production" && message.spawnedItem){
        chrome.runtime.sendMessage(window.pokemonHelperExtensionId, {action: "badge", message: message, pokemonData: pokemonData, collectionData: collectionData});
    }
}