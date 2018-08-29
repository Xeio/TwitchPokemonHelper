chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
            if (document.readyState === "complete") {
                clearInterval(readyStateCheckInterval);

                var hasPokeball = document.getElementsByClassName("pokeball--icon").length > 0;

                if(hasPokeball){
                    var observerOptions = { childList: true, subtree: true };
                    var observer = new MutationObserver(checkForImages);
                    observer.observe(document, observerOptions);
                }
            }
        }, 100);
});

function checkForImages(){
    var badgeNode = document.querySelector("img[alt='badge']");
    if(badgeNode){
        chrome.extension.sendMessage({action: "badge"});
    }
}