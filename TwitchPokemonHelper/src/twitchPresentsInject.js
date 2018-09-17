chrome.extension.onMessage.addListener(onMessage);

function onMessage(request, sender, sendResponse){
    if (request.action == "badge"){
        hideAdClickThroughOverlay();
    }
}

function hideAdClickThroughOverlay(){
    //Ensure the badge extension is visible
    let extensionContainers = document.getElementsByClassName('extension-container');
    if(extensionContainers.length > 0 && extensionContainers[0].classList.contains('invisible')){
        extensionContainers[0].classList.remove('invisible');
    }
    //Temporarily hide the click-through overlay itself
    let adOverlay = document.querySelector(".player-root > div > .pl-overlay");
    if(adOverlay){
        let parent = adOverlay.parentElement;
        parent.style.display = "none";
        //Restore the ad overlay after the badge has gone
        //(badges only last 8 seconds, plus a few seconds of time to appear/dissapear)
        setTimeout(() => {
            parent.style.display = "";
        }, 12000);
    }
}