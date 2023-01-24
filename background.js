chrome.tabs.onUpdated.addListener(
   function (tabId, changeInfo, tab) {
      console.log(changeInfo)
      if(changeInfo.audible){
         console.log('===ENVIOU SYNC===')
         chrome.tabs.sendMessage(
            tabId,
            { message: 'sync' }
         )
      }
   }
)
