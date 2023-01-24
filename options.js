function query(nameElement) {
   const isElements = document.querySelectorAll(nameElement);
   return isElements.length === 1 ? isElements[0] : [...isElements]; 
}

function getResponseCallback(response){
   console.log("VOLUME RESPONSE", response)
   query('.level-volume').innerHTML = response.volume
}

function sendMessage(message) {
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
         tabs[0].id,
         message, 
         getResponseCallback
      )
   })
}

function onServiceVolumeBooster(message) {
   return function (){
      console.log("DENTRO DO LISTENER", this.value)
      sendMessage({ message, value: this.value })
   }
}

query('#volume').addEventListener('input', onServiceVolumeBooster('change'));