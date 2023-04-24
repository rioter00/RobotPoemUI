const theD = 73.42;
const notes = ["D2", "Eb2", "C2", "D1"];

const vol1 = new Tone.Volume(-20).toDestination();
const vol2 = new Tone.Volume(-9).toDestination();

const fb1 = new Tone.FeedbackDelay(.2, 0.7).connect(vol1);
const fil1 = new Tone.Filter(0, "lowpass").connect(fb1);

const fb2 = new Tone.FeedbackDelay(.2, 0.3).connect(vol2);
const fil2 = new Tone.Filter(5000, "lowpass").connect(fb2);

const bumpy = new Tone.MembraneSynth().connect(fil2);
const noiseSynth = new Tone.NoiseSynth().connect(fil2);

fil1.connect(vol1);
fil2.connect(vol2);

const drone1 = new Tone.Oscillator( { frequency: theD, type: "sawtooth" } ).connect(fil1).start();
const drone2 = new Tone.Oscillator( { frequency: theD, type: "sawtooth" } ).connect(fil1).start();
const drone3 = new Tone.Oscillator( { frequency: theD, type: "sawtooth" } ).connect(fil1).start();
const drone4 = new Tone.Oscillator( { frequency: theD, type: "sawtooth" } ).connect(fil1).start();

function changeDrone(data) {
    let filterFreq = (Math.abs(data)*15);
    let freqScale = data*.025;
    fil1.frequency.value = filterFreq;
    drone2.frequency.value = theD+(freqScale*1.1);
    drone3.frequency.value = theD+(freqScale*1.2);
    drone4.frequency.value = theD+(freqScale*1.5);
}

function bump() {
    let chance = Math.floor(Math.random() * 3);
    if (chance == 0) {
        noiseSynth.triggerAttackRelease();
    }
    else {
        let pitch = notes[Math.floor(Math.random() * 4)];
        bumpy.triggerAttackRelease(pitch, "8n");
    }
}

function droneVol(state) {
    if (state) {
        vol1.volume.rampTo(-20, 10);
    }
    else { 
        vol1.volume.rampTo(-80, 10);
    }
}