console.log('OPA!!')
function query(nameElement) {
   const isElements = document.querySelectorAll(nameElement);
   return isElements.length === 1 ? isElements[0] : [...isElements]; 
}

function onServiceVolumeBooster(event){
   console.log(this)
   this.classList.toggle('on-service');
   const isActive = this.classList.contains('on-service');

   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        //extension is active
         
         console.log(isActive)

         chrome.tabs.sendMessage(
         tabs[0].id,
         {
            message: "on",
            value: isActive
         })

   })
}

query('.button-on')
   .addEventListener('click', onServiceVolumeBooster);