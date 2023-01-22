function pipe (...fns){
   return (value) => fns.reduce((acc, fn) => fn(acc), value)
}

function query(nameElement) {
   const isElements = document.querySelectorAll(nameElement);
   return isElements.length === 1 ? isElements[0] : [...isElements]; 
}

function hasVideosElements(elements) {
   return elements || query('audio')
}

function captureMediaElement(elements) {
   if(!elements){
      return null
   }
   
   const audioContext = new AudioContext();

   return Array.isArray(elements) ? (
      elements.map((elem) => asyncAudioContext(audioContext, elem)) 
   )
   : (
      [asyncAudioContext(audioContext, elements)]
   )
}

function asyncAudioContext(context, element) {
   const mediaAudioSource = context.createMediaElementSource(element);
   const gainNode = context.createGain();
   
   gainNode.gain.value = 3;

   mediaAudioSource.connect(gainNode)
   gainNode.connect(context.destination)

   return gainNode
}

const elementAudio = pipe(
   query,
   hasVideosElements,
   captureMediaElement
)

function listenButtons(request) {
   if(request.value){
      elementAudio('video')
   } 
}

chrome.runtime.onMessage.addListener( listenButtons );

