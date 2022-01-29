chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        "id": "sampleContextMenu",
        "title": "Spend Amount",
        "contexts": ["selection"]
    }, function () {
        if (chrome.extension.lastError) {
            console.log("Got expected error: " + chrome.extension.lastError.message);
        }
    });
});


function isInt(value){
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

chrome.contextMenus.onClicked.addListener(function (clickData, tab) {

    if (clickData.menuItemId === "sampleContextMenu") {

        if(isInt(clickData.selectionText)){

            chrome.storage.sync.get(['total', 'limit'], function (budget) {
                var newTotal = 0;
                if (budget.total) {
                    newTotal += parseInt(budget.total);
                }

                var amount = parseInt(clickData.selectionText);
                if(amount>0){
                    newTotal += amount;
                }

                chrome.storage.sync.set({'total': newTotal}, function(){
                    if(newTotal >= budget.limit){
                        var notifOptions = {
                            type: 'basic',
                            iconUrl: 'icon48.png',
                            title: 'Limit Exceeded!',
                            message: "heh! looks like, you have reached your limit!"
                        }
                        chrome.notifications.create('limitNotification', notifOptions);
                    }
                });
            });
        }
        else{
            var notifOptions = {
                type: 'basic',
                iconUrl: 'icon48.png',
                title: 'check',
                message: clickData.selectionText + " is not integer"
            }
        
            chrome.notifications.create('limitNotification', notifOptions);
        }
    }
});

chrome.storage.onChanged.addListener(function(changes, storageName){
    chrome.browserAction.setBadgeText({"text": changes.total.newValue.toString()})
});