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
   let connectAudioElements = null;
   let gains = [];

   return ({ message, value }) => {
      if(!connectAudioElements){
         connectAudioElements = createAudioContext();
         gains = connectAudioElements(volume, query('video'))
      }
   
      if(connectAudioElements){
         if(message === 'sync'){
            const videos = query('video');
            const checkVideos = gains.concat(connectAudioElements(volume, videos));
            gains = checkVideos;

            console.log('VIDEOS', gains);
         }
         
         if(message === 'change'){

            gains.map((gainNode) => {
               gainNode.gain.value = (Number(value) / 100);
               volume = gainNode.gain.value
            })
         }
      }


   }
}


const listenAudioEvents = listenEventsAudio();
chrome.runtime.onMessage.addListener(
   listenAudioEvents
);