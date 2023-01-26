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

   return (volume, elements) =>

      elements.map((element) => {
         try {
            const mediaSource = audioContext.createMediaElementSource(element);
            const gainNode = audioContext.createGain();

            gainNode.gain.value = volume;

            gainNode.connect(audioContext.destination)
            mediaSource.connect(gainNode)


            return gainNode
         } catch (error) {
            return null
         }
      })
         .filter(isConnect => isConnect)
}

function listenEventsAudio() {
   const connectAudioElements = createAudioContext();
   let volume = 1;
   let gains = connectAudioElements(volume, query('video'));

   return ({ message, value }) => {
      if(message === 'sync'){
         const videos = query('video')
         if(videos.length !== gains.length){
            const allMedias = gains.concat(connectAudioElements(volume, videos));
            gains = allMedias;
         }
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
