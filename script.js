function pipe(...fns) {
   return (value) => fns.reduce((acc, fn) => fn(acc), value)
}

function query(nameElement) {
   const isElements = document.querySelectorAll(nameElement);
   return [...isElements];
}

function createAudioContext() {
   const audioContext = new AudioContext();
   console.log('Criou o áudio context');

   return (volume, elements) => {
      return elements.map((element, index) => {
         try{
         const gainNode = audioContext.createGain();
         const mediaSource = audioContext.createMediaElementSource(element);

         gainNode.gain.value = volume;

         gainNode.connect(audioContext.destination)
         mediaSource.connect(gainNode)

         return gainNode
         }catch(error){
            return;
         }
      })
         .filter(isConnect => isConnect)
}}


function listenEventsAudio() {
   let volume = 1;
   const connectAudioElements = createAudioContext();
   let gains = connectAudioElements(volume, query('video'));

   return ({ message, value }) => {
      if(message === 'sync'){
         const videos = query('video');
         const checkVideos = gains.concat(connectAudioElements(volume, videos));
         gains = checkVideos;
      }
      
      if(message === 'change'){
         gains.map((gainNode) => {
            gainNode.gain.value = (Number(value) / 100);
            volume = gainNode.gain.value
         })
      }
   }
}


const listenAudioEvents = listenEventsAudio();
chrome.runtime.onMessage.addListener(
   listenAudioEvents
);