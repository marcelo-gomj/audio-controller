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

function onServiceVolumeBooster(message, level, levelFulled) {
   return function (){
      const volume  = this.value;

      sendMessage({ message, value : volume })
      levelFulled.style.width = `${volume / 5}%`
      level.textContent = volume + ' %';
      
      chrome.storage.local.set({ "volume" :  volume });
   }
}

function getStorageInformations(range, level, levelFulled) {
   return ({ volume }) => {
      range.value =  volume;
      level.textContent = volume + ' %';
      levelFulled.style.width = `${ Number(volume) / 5 }%`
   }
}

const rangeInput = query('#volume');
const levelVolume = query('.level-volume');
const levelFulled = query('.level-fulled');

query('#volume').addEventListener('input', onServiceVolumeBooster(
   'change', 
   levelVolume,
   levelFulled
));   
   
const informations = ["volume", "media_info", "media_title"];

chrome.storage.local.get( informations, getStorageInformations(
   rangeInput, 
   levelVolume,
   levelFulled
))