function query(nameElement) {
   const isElements = document.querySelectorAll(nameElement);
   return isElements.length === 1 ? isElements[0] : [...isElements]; 
}

function sendMessage(message) {
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
         tabs[0].id,
         message
      )
   })
}

let VOLUME = 34;
function onServiceVolumeBooster(message) {
   console.log("INICIOU...")

   return function (){
      VOLUME = this.value;
      query('.level-fulled').style.width = `${VOLUME / 5}%`
      
      sendMessage({ message, value: VOLUME })

      query('.level-volume').innerHTML = VOLUME + ' %';
      chrome.storage.local.set({ "volume" :  VOLUME});
   }
}

query('#volume').addEventListener('input', onServiceVolumeBooster('change'));

chrome.storage.local.get(["volume", "media_info", "media_title"], function (result){
   const { volume } = result;

   console.log(result);

   query('#volume').value =  volume
   query('.level-volume').innerHTML = volume + ' %';
   query('.level-fulled').style.width = `${Number(volume) / 5}%`

})

chrome.storage.onChanged.addListener(function (param1, param2) {
   console.log(param1, param2);
})
