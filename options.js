function query(nameElement) {
   const isElements = document.querySelectorAll(nameElement);
   return isElements.length === 1 ? isElements[0] : [...isElements]; 
}

function getResponseCallback(response){
   if(response){
      const { volume } = response;

      console.log("VOLUME RESPONSE", volume)
      query('.level-volume').innerHTML = volume + ' %';

   }
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
      query('.level-fulled').style.width = `${((Number(this.value) - 1 ) / 5)}%`

      sendMessage({ message, value: this.value })
   }
}

query('#volume').addEventListener('input', onServiceVolumeBooster('change'));