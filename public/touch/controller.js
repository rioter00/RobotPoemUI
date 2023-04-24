// import * as Tone from 'tone';
// const Tone = 
// test
var ping;
var cnv;
var touch = false;
var fmOsc;
var freq;
var harm = 1;
var index = 1;
var fmEnv;
var volume = -6;
var vol;

var socket;
//

console.log('controller loaded');

// document.addEventListener('contextmenu', event => event.preventDefault());

// document.ontouchmove = function (event) {
//   event.preventDefault();
// };

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

$(function () {
  let carrFreqVal;
  let modFreqVal;
  let modDepthVal;
  let modFreqVal2;
  let modDepthVal2;
  //

  //
  var changeUsername = document.getElementById("change-username");

  socket = io("http://ch-server.herokuapp.com/hub", {
    query: {
      username: getCookie("username") || "Audience_Performance_",
    },
  });

  socket.on("connect", function () {
    console.log('connects???');
    console.log('socket id: ', socket.id);
  });

  socket.on("allUsers", (data) => {
    // console.log(data.users.length);
    let groupNum = data.users.length % 3;
    // console.log(`joining room${groupNum}`);
    socket.emit("joinRoom", {
      room: "Room"+groupNum.toString(),
    });
    setCookie("roomname", "Room"+groupNum.toString(), 1);
  });

  socket.on("control", (data) => {
    if(data.header === "setInstructions"){
      document.getElementById("description").innerHTML = data.values;
    }
    if(data.header === "setTimeRemaining"){
      document.getElementById("time-remaining").innerHTML = data.values;
    }
    if(data.header === "bgColor"){
      $("body").css("background-color", data.values);
    }
  });
  


  var modal = document.getElementById("username-modal");
  var modal_content = document.getElementById("username-modal-content");
  var username = document.getElementById("username-submit");
  username.onclick = addUsername;

  function addUsername() {
    let username = document.getElementById("username-input").value;
    username = username.replace(/\s/g, "");
    username = username.replace(/ /g, "");
    if (username == "" || username.length < 1) {
      // shake modal
      modal_content.classList.add("shake");
      setTimeout(function () {
        modal_content.classList.remove("shake");
      }, 300);
      document.getElementById("username-input").value = "";
      document.getElementById("username-input").placeholder =
        "Pls enter a username";
    } else {
      let usernameField = document.getElementById("username-input");
      let username = usernameField.value;
      username = username.replace(/\s/g, "");
      username = username + Math.floor(Math.random() * 100 + 1).toString();
      socket.emit("addUsername", { username: username });
      document.getElementById("username").innerHTML = username;
      setCookie("username", username, 10);
      modal.style.display = "none";
      usernameField.value = "";
      changeUsername.style.display = "block";
    }
  }

  if (getCookie("username") != "") {
    document.getElementById("username").innerHTML = getCookie("username");
    modal.style.display = "none";
    changeUsername.style.display = "block";
  }

  if(getCookie("roomname") != ""){
    socket.emit("joinRoom", {
      room: getCookie("roomname"),
    });
  }

  var usernameinput = document.getElementById("username-input");
  usernameinput.onchange = addUsername;

  var changeUsername = document.getElementById("change-username");
  changeUsername.onclick = function () {
    modal.style.display = "flex";
    changeUsername.style.display = "none";
    setCookie("username", "", -1);
  };

  // var fm_destination = document.getElementById("fm-destination");
  // fm_destination.onchange = function (e) {
  //   switch (fm_destination.value) {
  //     case "carr_freq":
  //       console.log("changing minmax");
  //       document.getElementById("fm-slider").min = "20";
  //       document.getElementById("fm-slider").max = "1000";
  //       document.getElementById("fm-slider").value = carrFreqVal || "400.00";
  //       document.getElementById("fm-slider").step = ".1";
  //       document.getElementById("fm-slider-value").innerHTML =
  //         carrFreqVal || "400.00";
  //       break;
  //     case "harm":
  //       document.getElementById("fm-slider").min = "0";
  //       document.getElementById("fm-slider").max = "8";
  //       document.getElementById("fm-slider").value = modFreqVal || "1";
  //       document.getElementById("fm-slider").step = ".01";
  //       document.getElementById("fm-slider-value").innerHTML =
  //         modFreqVal || "1.0";
  //       break;
  //     case "mod_index":
  //       document.getElementById("fm-slider").min = "0";
  //       document.getElementById("fm-slider").max = "2";
  //       document.getElementById("fm-slider").value = modDepthVal || "1.00";
  //       document.getElementById("fm-slider").step = ".01";
  //       document.getElementById("fm-slider-value").innerHTML =
  //         modDepthVal || "1.00";
  //       break;
  //     case "mod2_freq":
  //       document.getElementById("fm-slider").min = "20";
  //       document.getElementById("fm-slider").max = "20000";
  //       document.getElementById("fm-slider").value = modFreqVal2 || "10000.0";
  //       document.getElementById("fm-slider").step = "1";
  //       document.getElementById("fm-slider-value").innerHTML =
  //         modFreqVal2 || "10000.00";
  //       break;
  //     case "mod2_depth":
  //       console.log("changing minmax");
  //       document.getElementById("fm-slider").min = "0";
  //       document.getElementById("fm-slider").max = "4";
  //       document.getElementById("fm-slider").value = modDepthVal2 || "2.0";
  //       document.getElementById("fm-slider").step = ".01";
  //       document.getElementById("fm-slider-value").innerHTML =
  //         modDepthVal2 || "4.00";
  //       break;
  //     default:
  //       console.log("//");
  //       break;
  //   }
  // };

  // var slider = document.getElementById("fm-slider");
  // slider.oninput = function (e) {
  //   let val = parseFloat(slider.value).toFixed(2);
  //   document.getElementById("fm-slider-value").innerHTML = val;
  //   // store latest value;
  //   switch (fm_destination.value) {
  //     case "carr_freq":
  //       carrFreqVal = val;
  //       break;
  //     case "mod_freq":
  //       modFreqVal = val;
  //       break;
  //     case "mod_depth":
  //       modDepthVal = val;
  //       break;
  //     case "mod2_freq":
  //       modFreqVal2 = val;
  //       break;
  //     case "mod2_depth":
  //       modDepthVal2 = val;
  //       break;
  //     default:
  //       break;
  //   }
  //   let obj = {
  //     header: document.getElementById("fm-destination").value,
  //     values: val,
  //     mode: "push",
  //     target: "all",
  //   };
  //   socket.emit("control", obj);
  // };

  var harm_setting = document.getElementById("harm-setting");
  harm_setting.onchange = function (e) {
    let val = harm_setting.value;
    if(harm_setting.value === "1"){
      harm = 1.2;
    }
    if(val === "2"){
      harm = 0.8;
    }
    if(val === "3"){
      harm = 4;
    }
    if(val === "4"){
      harm = 0.5;
    }
    console.log(`harm: ${harm}`);
    fmOsc.harmonicity.value = harm;
  };

  var start_audio = document.getElementById("start-audio");
  start_audio.onclick = function (e) {
    console.log("audio enabled...");
    if(Tone.context.state !== 'running'){
      Tone.context.resume();
    }
  };

  var practice_button = document.getElementById("practice-button");
  var performance_button = document.getElementById("performance-button");
  practice_button.onclick = function (e) {
    console.log("practice button");
    practice_interface.classList.add("active");
    console.log("audio enabled...");
    Tone.start();
  };
  performance_button.onclick = function (e) {
    console.log("performance button");
    performance_interface.classList.add("active");
    console.log("audio enabled...");
    Tone.start();
  };

  var practice_interface = document.getElementById("practice-interface");
  var performance_interface = document.getElementById("performance-interface");

  var close_button = document.getElementById("close-button1");
  close_button.onclick = close;
  var close_button2 = document.getElementById("close-button2");
  close_button2.onclick = close;

  function close() {
    console.log("close button");
    practice_interface.classList.remove("active");
    performance_interface.classList.remove("active");
  }

  //https://rbyers.github.io/paint.html
  // modal.style.display = "none";
});

function setup() {
  cnv = createCanvas(windowWidth * .7, windowWidth * .4);
  // cnv = createCanvas(400, 200);
  cnv.parent(document.getElementById("practice-canvas-node"));
  // cnv.touchStarted(touchStarted);
  console.log("cnv? " + width + " " + height);
}

function draw() {
  background(180);
  // fill(255);
  if (touch == true || touch == "true") {
    // horizontal line
    line(0, mouseY, width, mouseY);
    // vertical
    line(mouseX, 0, mouseX, height);
    let freqString = parseFloat(freq).toFixed(2);
    let indexString = parseFloat(index).toFixed(2);
    let volumeString = parseFloat(volume).toFixed(2);
    text(`freq: ${freqString}, harm: ${harm}, index: ${indexString}, vol: ${volumeString}`, 10, 20);
    ellipse(mouseX, mouseY, 20, 20);
  }
}

function touchStarted() {
  console.log("touch started :", socket.id);
  socket.emit('control', {
    header: "userTouchToggle",
    mode: "push",
    target: "all",
    values: "true", 
    from: socket.id
  });
  //

  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    touch = true;
    Tone.now();
    if(fmOsc.state !== "started"){
      fmOsc.start();
    }
  }
}

function touchMoved() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    touch = true;
    if(fmOsc.state !== "started"){
      fmOsc.start();
    }
    freq = map(mouseX, 0, width, 100, 600);
    fmOsc.frequency.value = freq;
    // harm = map(height-mouseY, 0, height, 0, 2);
    index = map(height-mouseY, 0, height, .1, 4);
    fmOsc.modulationIndex.value = index;
    // fmOsc.harmonicity.value = harm;
    volume = map(height-mouseY, 0, height, -32, -10);
    if(volume < -32){
      volume = -32;
    }
    if(volume > -10){
      volume = -10;
    }

    vol.volume.value = volume;

    console.log("mouse", mouseX, mouseY, mouseX/width, mouseY/height);
    //
    let obj = {
      header: "userTouch", 
      mode: "push",
      target: "all",
      from: socket.id,
      values: [mouseX / width, mouseY / height]
    }
    socket.emit("control", obj);
    console.log('userTouch', obj);
  } else {
    touch = false;
  }
}

function touchEnded() {
  socket.emit('control', {
    header: "userTouchToggle",
    mode: "push",
    target: "all",
    values: "false", 
    from: socket.id
  });
  console.log("touch ended");
  touch = false;
  if(fmOsc.state === "started"){
    fmOsc.stop();
  }
}


function ToneSetup2() {
  // Instrument

  const distort = new Tone.Distortion(0.9).toDestination();

  const filt = new Tone.Filter(200, "bandpass").connect(distort);
  filt.Q = 200;

  const ampEnv1 = new Tone.AmplitudeEnvelope({
    attack: 0.0,
    decay: 0.01,
    sustain: 0.016,
    release: 0.15,
  }).connect(filt);
  ampEnv1.attackCurve = "exponential";
  ampEnv1.decayCurve = "exponential";

  const ampEnv2 = new Tone.AmplitudeEnvelope({
    attack: 0.0,
    decay: 0.01,
    sustain: 0.015,
    release: 0.1,
  }).connect(filt);
  ampEnv2.attackCurve = "exponential";
  ampEnv2.decayCurve = "exponential";

  const ampEnv3 = new Tone.AmplitudeEnvelope({
    attack: 0.0,
    decay: 0.01,
    sustain: 0.02,
    release: 0.2,
  }).connect(filt);
  ampEnv3.attackCurve = "exponential";
  ampEnv3.decayCurve = "exponential";

  const osc1 = new Tone.Oscillator(59, "sawtooth").connect(ampEnv1).start();
  const osc2 = new Tone.Oscillator(61, "sawtooth").connect(ampEnv2).start();
  const noise = new Tone.Noise("white").connect(ampEnv3).start();
}

function ToneSetup() {

  vol = new Tone.Volume(-6).toDestination();
  vol.volume.value = volume;

  fmOsc = new Tone.FMOscillator({
    frequency: 200,
    type: "sine",
    modulationType: "triangle",
    harmonicity: 0.2,
    modulationIndex: 3,
  }).connect(vol).toDestination();


  // fmOsc.chain(distortion, Tone.Destination);
    // .start();
}

function mousePressed() {
  console.log('mouse pressed?');
  touchStarted();
}

function keyPressed(){
  console.log(`key pressed: ${key}`);
  if(key === "1"){
    harm = 1.2;
  }
  if(key === "2"){
    harm = 0.8;
  }
  if(key === "3"){
    harm = 4;
  }
  if(key === "4"){
    harm = 0.5;
  }
  console.log(`harm: ${harm}`);
  fmOsc.harmonicity.value = harm;
}

function changeHarm(){
  // harm = document.getElementById("harm").value;
  fmOsc.harmonicity.value = harm;
}


  ToneSetup();

