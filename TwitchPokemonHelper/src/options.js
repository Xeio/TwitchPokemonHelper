document.addEventListener("DOMContentLoaded", function(event) {
    preferences.load().then(loaded);
});

function loaded(){
    preferences.getAllPrefs().forEach(pref => {
        let element = document.getElementById(pref.name);
        if(element.type === "checkbox"){
            element.checked = preferences.getPrefValue(pref);
        }
        else{
            element.value = preferences.getPrefValue(pref);
        }
        element.onchange = onChange;
    });
}

function onChange(event){
    let preference = preferences.getPrefByKey(event.target.id);
    if(event.target.type === "checkbox"){
        chrome.extension.sendMessage({action: "setPreference", preference: preference, value: event.target.checked});
    }
    else{
        chrome.extension.sendMessage({action: "setPreference", preference: preference, value: event.target.value});
    }
}