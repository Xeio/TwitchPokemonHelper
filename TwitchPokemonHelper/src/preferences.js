class Preference{
    constructor(name, defaultValue){
        this.name = name;
        this.defaultValue = defaultValue;
    }
}

let preferences = {
    ENABLED: new Preference("Enabled", true),
    NEW_BADGE_ENABLED: new Preference("NewBadgesound", true),
    NEW_BADGE_VOLUME: new Preference("NewBadgeVolume", 1),
    EXISTING_BADGE_ENABLED: new Preference("ExistingBadgeSound", true),
    EXISTING_BADGE_VOLUME: new Preference("ExistingBadgeVolume", 1),

    prefValues: {},

    getAllPrefs: function(){
        return Object.keys(this).map(k => this[k]).filter(i => Preference.prototype.isPrototypeOf(i));
    },

    getPrefByKey: function(key){
        return this.getAllPrefs().find(pref => pref.name === key);
    },

    getPrefValue: function(pref){
        if(this.prefValues.hasOwnProperty(pref.name)){
            return this.prefValues[pref.name];
        }
        return pref.defaultValue;
    },

    setPrefValue: function(pref, value){
        this.prefValues[pref.name] = value;
    },

    load: function(){
        return new Promise((resolve, reject) => {
            let prefKeys = preferences.getAllPrefs().map(pref => pref.name);
        
            chrome.storage.local.get(prefKeys, (values) => {
                this.loadPrefs(values);
                resolve();
            });
        })
    },

    loadPrefs: function(loadedValues){
        this.getAllPrefs().forEach(pref => {
            let loadedValue = loadedValues[pref.name];
            if(loadedValue !== undefined){
                this.setPrefValue(pref, loadedValue);
            }
        });
    },

    saveAll: function(){
        this.getAllPrefs().forEach(pref => {
            if(this.prefValues.hasOwnProperty(pref.name)){
                chrome.storage.local.set({[pref.name]: this.getPrefValue(pref)});
            }
        });
    }
}