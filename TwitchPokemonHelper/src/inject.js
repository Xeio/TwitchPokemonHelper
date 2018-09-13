addPageInjectScript();

function addPageInjectScript(){
    var extensionIdScript = document.createElement('script');
    extensionIdScript.innerHTML = "window.pokemonHelperExtensionId = \"" + chrome.runtime.id + "\";";
    document.head.appendChild(extensionIdScript);
    
    var pageInjectScript = document.createElement('script');
    pageInjectScript.setAttribute("type", "text/javascript");
    pageInjectScript.src = chrome.runtime.getURL('src/pageInject.js');
    document.head.appendChild(pageInjectScript);
}