// SOUNDMANAGER API
const SOUND_MANAGER = {
    context: false,
    sounds: {},
    audios: {},
    soundscustomvolume: {},
    soundsdelta: {},
    globalVolume: 1,
    freqPlaying: {},
    init: function(){
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        SOUND_MANAGER.context = new AudioContext();
    },
    copySound: function (originId, ...targetIds) {
        let originSound = this.sounds[originId];
        if (!originSound) {
            console.log("Attempted to copy " + originId + ", but no sound is linked !");
            return false;
        }
        for (let target of targetIds) {
            this.sounds[target] = originSound;
            console.log('Copied ' + originId + " to " + target + " !");
        }
        return true;
    },
    registerSound: function (id, url, customVolume = false) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';
        let refThis = this;
        xhr.onload = function () {
            refThis.context.decodeAudioData(xhr.response, function (buffer) {
                if (typeof id === "string") {
                    id = [id];
                }
                for (let tid of id) {
                    refThis.sounds[tid] = buffer;
                    refThis.audios[tid] = [];
                    if (customVolume) {
                        refThis.soundscustomvolume[tid] = customVolume;
                    }
                }
                console.log("Registered sound " + id + " !");
            }, err => {
                console.error('Unable to register ' + id + '(' + url + '): ', err);
            });
        };
        xhr.send();
    },
    playSound: function (id, vol = 1, pitch = 1, onend = false, onnearend = false, prespitch=false) { // Returns true if no sound is linked, meaning should retry later
        let snd = this.sounds[id];
        if (!snd) {
            console.log("Attempted to play " + id + ", but no sound is linked !");
            return false;
        }
        let src = this.context.createBufferSource();
        src.buffer = snd;
        // src.playbackRate.value = pitch;
        this.setPitch(id, src, pitch,prespitch);

        // src.connect(this.context.destination);

        let gainNode = this.context.createGain();
        src.connect(gainNode);
        src.gainNode = gainNode;
        gainNode.connect(this.context.destination);
        let cstm = this.soundscustomvolume[id] ? this.soundscustomvolume[id] : 1;
        gainNode.gain.value = this.globalVolume * vol * cstm;
        // console.log('Gain: '+gainNode.gain.value);


        let rthis = this;
        src.onended = () => {
            if (onend && typeof onend == "function") onend();
            let c = 0;
            for (let ad of rthis.audios[id]) {
                if (ad === src) {
                    rthis.audios[id].splice(c, 1);
                }
                c++;
            }
        }
        src.ontimeupdate = () => {
            if (src.currentTime > (src.buffer.duration - .5)) {
                if (onnearend) onnearend();
            }
        }
        src.start(0);
        this.audios[id].push(src);
        return src;
    },
    playFreq: function(hz, vol){
        // vol = Math.min((volRef-vol)/volRef, 1) * (volMult);
        // -3db = /2
        // -6db = /4
        // -9db = /8
        // etc
        let volMult = 2
        vol = 1 / Math.pow(2, (vol)/3);
        if(vol>1){
            console.error("Volume to high ! "+vol);
            return;
        }
        vol *= volMult;

        if(this.freqPlaying[hz]){
            this.freqPlaying[hz].gainNode.gain.value = vol;
            return;
        }

        //console.log(this.context)

        let oscillator = this.context.createOscillator();
        let gainNode = this.context.createGain();
        let convolver = this.context.createConvolver();

        oscillator.type = 'sine';
        oscillator.frequency.value = hz;
        oscillator.connect(gainNode);
        oscillator.gainNode = gainNode;
        oscillator.convolverNode = convolver;

        gainNode.connect(/*convolver*/this.context.destination);
        gainNode.gain.value = vol;

        // convolver.connect(this.context.destination);
        // convolver.gain.value = vol;

        this.freqPlaying[hz] = oscillator;

        oscillator.start();

        console.log('bip')
    },
    stopFreq: function(hz){
        if(this.freqPlaying[hz]){
            this.freqPlaying[hz].stop();
            delete this.freqPlaying[hz];
        }
    },
    /**
     * Stops every sound playing on given id, and avoid playing the onend
     * @param id registered ID of the sound
     */
    stopSound: function (id) {
        for (let idd in this.audios) {
            if (idd === id) {
                while (this.audios[id].length > 0) {
                    let a = this.audios[id].shift();
                    a.onended = () => {
                    };
                    a.stop();
                }
            }
        }
    },
    /**
     * Stops every sound playing on given id, but plays the onend
     * @param id registered ID of the sound
     */
    endSound: function (id) {
        for (let idd in this.audios) {
            if (idd === id) {
                while (this.audios[id].length > 0) {
                    let a = this.audios[id].shift();
                    a.stop();
                }
            }
        }
    },
    getPlayingSounds: function (id) {
        for (let idd in this.audios) {
            if (idd === id) {
                return this.audios[idd];
            }
        }
        return false;
    },
    isRegistered: function (id) {
        for (let idd in this.sounds) {
            if (idd === id) {
                return true;
            }
        }
        return false;
    },
    playBlob: async function (blob, volumeImmune = true) {
        let src = this.context.createBufferSource();
        src.buffer = await blob.arrayBuffer();

        let gainNode = this.context.createGain();
        src.connect(gainNode);
        src.gainNode = gainNode;
        gainNode.connect(this.context.destination);
        if (volumeImmune) gainNode.gain.value = this.globalVolume;

        src.start(0);
        return src;
    },
    loopSound: function(id, vol = 1, pitch = 1, prespitch = false){
        if(this.getPlayingSounds(id) && this.getPlayingSounds(id).length >= 1) {
            for(let sound of this.getPlayingSounds(id)){
                sound.gainNode.gain.value = vol;
                this.setPitch(id, sound, pitch, prespitch);
            }
            return;
        }
        let b = ()=>{
            this.playSound(id,vol,pitch,b);
        }
        b();
    },
    setPitch: (name, source, value, preserve=false) =>{
        if((value <0 && !SOUND_MANAGER.soundsdelta[name]) || (value >=0 && !!SOUND_MANAGER.soundsdelta[name])){
            let a = source.buffer;
            Array.prototype.reverse.call( a.getChannelData(0) );
            if(value < 0){
                SOUND_MANAGER.soundsdelta[name]=true;
            }else{
                SOUND_MANAGER.soundsdelta[name]=false;
            }
        }
        source.preservesPitch = true;
        // source.detune = 800;
        source.playbackRate.value = Math.abs(value);
    }
}
export default SOUND_MANAGER;