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
      asyncAudioContext(audioContext, elements)
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

console.log(elementAudio('video'))

// function createGainNodeFromAudioContext(mediaStream) {
//    const audioContext = new AudioContext();

//    console.log("AUDIO-CONTEXT", audioContext);
   
//    const mediaElementAudioSourceNode = audioContext.createMediaElementSource(mediaStream);
   
//    console.log("mediaElement", mediaElementAudioSourceNode);

//    const gainNode = audioContext.createGain();
//    gainNode.gain.value = 1;

//    console.log("GAIN NODE", gainNode);

//    mediaElementAudioSourceNode.connect(gainNode);
//    gainNode.connect(audioContext.destination);

//    return gainNode;
// }
