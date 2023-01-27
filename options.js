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

function onServiceVolumeBooster(message) {
   let volume = 100;

   return function (){
      volume = this.value;
      query('.level-fulled').style.width = `${volume / 5}%`
      
      sendMessage({ message, value: volume })

      query('.level-volume').innerHTML = volume + ' %';
      chrome.storage.local.set({ "volume" :  volume});
   }
}

query('#volume').addEventListener('input', onServiceVolumeBooster('change'));

chrome.storage.local.get(["volume", "media_info", "media_title"], function (result){
   const { volume } = result;

   query('#volume').value =  volume
   query('.level-volume').innerHTML = volume + ' %';
   query('.level-fulled').style.width = `${Number(volume) / 5}%`

})