function pipe(...fns) {
   return (value) => fns.reduce((acc, fn) => fn(acc), value)
}

function query(nameElement) {
   const isElements = document.querySelectorAll(nameElement);
   return [...isElements];
}

function hasVideosElements(elements) {
   return elements || query('audio')
}

function captureMediaElement(elements) {
   if (!elements) {
      return null
   }

   const audioContext = new AudioContext();

   return elements
      .map((element) => asyncAudioContext(audioContext, element))
      .filter(nodesConntect => nodesConntect)
}

function asyncAudioContext(context, element) {
   try{
      const mediaAudioSource = context.createMediaElementSource(element);
      const gainNode = context.createGain();
   
      // gainNode.gain.value = 1;
   
      mediaAudioSource.connect(gainNode)
      gainNode.connect(context.destination)
   
      return gainNode
   }catch(error){
      return null
   }
}

const elementAudio = pipe(
   query,
   hasVideosElements,
   captureMediaElement
)


function listenButtons() {
   let gains = elementAudio('video');

   return ({ message }) => {
      let elements = query('video');
      if (!elements) elements = query('audio');
      
      if(elements && gains.length !== elements.length) {
         const otherGainNodes = elementAudio('video')
         gains = gains.concat(otherGainNodes);
      } 


      if(gains){
         gains.map((gainNode) => {
            if (message === 'on') gainNode.gain.value += 1;
            if (message === 'off') gainNode.gain.value -= 1;
   
            console.log(gainNode.gain.value);
         })
      }
   }
}

chrome.runtime.onMessage.addListener(
   listenButtons()
);

