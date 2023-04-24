console.log("wac controller started");

// Instrument

var distort;
var filt;
var ampEnv1;
var ampEnv2;
var ampEnv3;
var osc1;
var osc2;
var noise;

// CH and Web-Related functions

$(function () {
  // called when DOM is ready

  const socket = io("/hub");

  setInterval(() => {
    const start = Date.now();
    const pingObject = { start };
    socket.volatile.emit("chPing", pingObject);
  }, 3000);

  socket.on("event", function (data) {
    console.log(data);
    if (data.header === "drumTrigger1") {
      triggerDrum();
    }
  });

  socket.on("control", function (data) {
    console.log("received control: " + data.values);
    // if(data.header !== "drumVariation") return;
    if (data.values == 1 || data.values == "1") {
      setPreset1();
    }

    if (data.values == 2 || data.values == "2") {
      setPreset2();
    }

    if (data.values == 3 || data.values == "3") {
      setPreset3();
    }
  });

  // interface functions
  $("#enable-button").click(function () {
    console.log("audio enabled...");
    Tone.start();
    this.style.display = "none";
    document.getElementById("drum-trigger").style.display = "block";
    document.getElementById("drum-own").style.display = "block";
  });

  $("#drum-trigger").click(function () {
    let eventObj = {
      header: "drumTrigger1",
      mode: "push",
      target: "all",
    };
    socket.emit("event", eventObj);
    return false; // false does not reload the page
  });

  $("#drum-own").click(function () {
    triggerDrum();
  });

  $("#preset-button1").click(function () {
    setPreset1();
    let eventObj = {
      header: "drumVariation",
      values: 1,
      mode: "push",
      target: "all",
    };
    socket.emit("control", eventObj);
    console.log("preset1 triggered");
    return false; // false does not reload the page
  });

  $("#preset-button2").click(function () {
    setPreset2();
    let eventObj = {
      header: "drumVariation",
      values: 2,
      mode: "push",
      target: "all",
    };
    socket.emit("control", eventObj);
    console.log("preset2 triggered");
    return false; // false does not reload the page
  });

  $("#preset-button3").click(function () {
    setPreset3();
    let eventObj = {
      header: "drumVariation",
      values: 3,
      mode: "push",
      target: "all",
    };
    socket.emit("control", eventObj);
    console.log("preset3triggered");
    return false; // false does not reload the page
  });

  const triggerDrum = () => {
    filt.set({ frequency: 200 });
    Tone.start();
    ampEnv1.triggerAttackRelease("2t");
    ampEnv2.triggerAttackRelease("2t");
    ampEnv3.triggerAttackRelease("2t");
    filt.frequency.rampTo(40, 0.3);
  };

  function ToneSetup() {
    console.log("Tone setup");
    // Instrument

    distort = new Tone.Distortion(0.9).toDestination();

    filt = new Tone.Filter(200, "bandpass").connect(distort);
    filt.Q = 200;

    ampEnv1 = new Tone.AmplitudeEnvelope({
      attack: 0.0,
      decay: 0.01,
      sustain: 0.016,
      release: 0.15,
    }).connect(filt);
    ampEnv1.attackCurve = "exponential";
    ampEnv1.decayCurve = "exponential";

    ampEnv2 = new Tone.AmplitudeEnvelope({
      attack: 0.0,
      decay: 0.01,
      sustain: 0.015,
      release: 0.1,
    }).connect(filt);
    ampEnv2.attackCurve = "exponential";
    ampEnv2.decayCurve = "exponential";

    ampEnv3 = new Tone.AmplitudeEnvelope({
      attack: 0.0,
      decay: 0.01,
      sustain: 0.02,
      release: 0.2,
    }).connect(filt);
    ampEnv3.attackCurve = "exponential";
    ampEnv3.decayCurve = "exponential";
    osc1 = new Tone.Oscillator(59, "sawtooth").connect(ampEnv1).start();
    osc2 = new Tone.Oscillator(61, "sawtooth").connect(ampEnv2).start();
    noise = new Tone.Noise("white").connect(ampEnv3).start();
  }
  
  console.log("tone? " + Tone);

  setTimeout(
      () => {
        console.log("tone2? " + Tone);
      }
  , 1000);

  ToneSetup();
});

const setPreset1 = () => {
  console.log("setting preset1");
  osc1.set({ frequency: 58 });
  osc2.set({ frequency: 61 });
  distort.set({ distortion: 0.2 });
};

const setPreset2 = () => {
  console.log("setting preset2");
  osc1.set({ frequency: 56 });
  osc2.set({ frequency: 54 });
  distort.set({ distortion: 0.6 });
};

const setPreset3 = () => {
  console.log("setting preset3");
  osc1.set({ frequency: 50 });
  osc2.set({ frequency: 51 });
  distort.set({ distortion: 0.9 });
};
