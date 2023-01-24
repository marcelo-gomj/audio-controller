function pipe(...fns) {
   return (value) => fns.reduce((acc, fn) => fn(acc), value)
}

function query(nameElement) {
   const isElements = document.querySelectorAll(nameElement);
   return [...isElements];
}

function handleVolumeChange(volume) {
   if (volume) {
      sessionStorage.setItem('VOLUME', volume)
   } else {
      const savedVolume = sessionStorage.getItem('VOLUME');
      return savedVolume ? Number(savedVolume) : 1;
   }
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

            console.log('VOLUME ASYNC ', volume);

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

   return ({ message }, sendResponse) => {
      console.log("MESSAGE = ", message)

      if (message === 'sync') {
         const allMedias = gains.concat(connectAudioElements(volume, query('video')));
         gains = allMedias;
         console.log('ASYNC GAINS', gains)
      }

      if (message === 'on' || message === 'off') {
         gains.map((gainNode) => {
            if (message === 'on') gainNode.gain.value += 0.100;
            if (message === 'off') gainNode.gain.value -= 0.100;

            volume = gainNode.gain.value
         })

         console.log('VOLUME', volume);
      }
   }
}
const listenAudioEvents = listenEventsAudio();
chrome.runtime.onMessage.addListener(
   listenAudioEvents
);

