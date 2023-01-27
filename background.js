function sendMessage(tabID, message) {
   chrome.tabs.sendMessage(
      tabID,
      { message }
   )
}

chrome.tabs.onUpdated.addListener(
   function (tabId, { audible, status }, tab) {

      if(status === "loading"){
         return;
      }

      if( audible !== undefined ) {
         sendMessage(tabId, 'sync');
      }
   }
)