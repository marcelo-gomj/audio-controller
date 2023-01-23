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
   return () => {
      sendMessage({ message })
   }
}

query('.button-low').addEventListener('click', onServiceVolumeBooster('off'));
query('.button-high').addEventListener('click', onServiceVolumeBooster('on'));