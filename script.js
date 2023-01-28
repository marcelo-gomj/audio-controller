function query(nameElement) {
   const isElements = document.querySelectorAll(nameElement);
   return [...isElements];
}

function createAudioContext() {
   const audioContext = new AudioContext();

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
   chrome.storage.local.set({ "volume" :  100});
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

if(chrome.tabCapture){
   chrome.tabCapture.capture({audio: true}, (stream) => {
      // Obtém o contexto de áudio
      let audioContext = new window.AudioContext();
      
      // Cria o gain node
      let gainNode = audioContext.createGain();
      
      // Conecta o gain node ao contexto de áudio
      gainNode.connect(audioContext.destination);
      
      // Obtém o fluxo de áudio da tab capturada
      let source = audioContext.createMediaStreamSource(stream);
      
      // Conecta o fluxo de áudio à entrada do gain node
      source.connect(gainNode);
      console.log("passou")
      // Controla o volume do som aqui
      gainNode.gain.value = 5;
    });

}
 