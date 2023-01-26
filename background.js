function connectTabMessage(tabID) {
   return (response) => {
      chrome.tabs.sendMessage(
         tabID,
         response
      )
   }
}

chrome.tabs.onUpdated.addListener(
   function (tabId, { audible }, tab) {
      
      const connectMessages = {
         "sync": audible !== undefined,
      }
      
      if (connectMessages) {
         const sendMessage = connectTabMessage(tabId);
         Object.entries(connectMessages).map(([message, value]) => {
            if (value) sendMessage({ message, value })
         })

      }
   }
)