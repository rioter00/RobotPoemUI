// import * as Tone from 'tone';
// const Tone = require('tone');

// const { random } = require("lodash");

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
//
var socket;

var xPos, yPos;

var coords = [];
var users = {};

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
  // console.log("CMS-controller.js");

  //
  var changeUsername = document.getElementById("change-username");

  socket = io("http://ch-server.herokuapp.com/hub", {
    query: {
      username: getCookie("username") || "performance_renderer",
    },
  });

  socket.on("control", (data) => {
    if (data.header === "userTouchToggle") {
      console.log('userTouchToggle?', data.from);
      userTouchToggle(data.values, data.from);
    }
    if (data.header === "userTouch") {
      // checkColor(socket.id);
      userTouch(data.values[0], data.values[1], data.from);
      // console.log("touch? " + data.values[0], data.values[1]);
    }
  });

  socket.on("allUsers", (data) => {
    // console.log(data.users.length);
    let groupNum = data.users.length % 3;
    // console.log(`joining room${groupNum}`);
    socket.emit("joinRoom", {
      room: "Room" + groupNum.toString(),
    });
    setCookie("roomname", "Room" + groupNum.toString(), 1);
  });

  socket.on("control", (data) => {
    // console.log(data);
    if (data.header === "setInstructions") {
      document.getElementById("description").innerHTML = data.values;
    }
    if (data.header === "setTimeRemaining") {
      // console.log(data.values);
      document.getElementById("time-remaining").innerHTML = data.values;
    }
    if (data.header === "bgColor") {
      // console.log("!!!");
      // console.log("bgColor " + data.values);
      $("body").css("background-color", data.values);
    }
  });

  var practice_button = document.getElementById("practice-button");
  var performance_button = document.getElementById("performance-button");

  var practice_interface = document.getElementById("practice-interface");
  var performance_interface = document.getElementById("performance-interface");
});

function setup() {
  cnv = createCanvas(windowWidth * 0.7, 200);
  // cnv = createCanvas(400, 200);
  cnv.parent(document.getElementById("canvas-node"));
  // cnv.touchStarted(touchStarted);
  console.log("cnv? " + width + " " + height);
}

function draw() {
  background(180);
  // console.log(typeof touch);

  // if (touch == "true" || touch == true) {
    // console.log('drawing?');
    // console.log("-----line: " + coords[users].x + " - " + coords[users].y);
    // console.dir(users);
    // console.log("Users length: " + users.length);
    Object.keys(users).forEach(user => {
    // console.log("-----line: " + coords[users].x + " - " + coords[users].y);
      // console.log("drawing user color? " + user, users[user].position.x, users[user].pos);
      // fill(users[user]);
    // horizontal line
      // stroke(users[user].color.x, users[user].color.y, users[user].color.z);
    // let x = users[user].position.x;
    // let y = users[user].position.y;

    // line(0, y, width, y);
    // // vertical
    // line(x, 0, x, height);
    // let freqString = parseFloat(freq).toFixed(2);
    // let indexString = parseFloat(index).toFixed(2);
    // let volumeString = parseFloat(volume).toFixed(2);
    // text(`freq: ${freqString}, harm: ${harm}, index: ${indexString}, vol: ${volumeString}`, 10, 20);
    // ellipse(x, y, 20, 20);
    users[user].draw();
    });
  // }
}

function userTouchToggle(state, id) {
  touch = state;
  console.log('userTouchToggle', state, id);
  if (state == true || state == "true") {
    if (!Object.keys(users).includes(id)) {
      users[id] = new user(id);
      console.log('adding user:', users[id].getID());
      console.log('------ users-----');
      console.dir(users);
    }
    users[id].setActive(true);
  } else {
    users[id].setActive(false);
    users[id].clearPreviousPositions();
  }
}

function userTouch(xP, yP, id) {
  // console.log("user touch: " + xP, yP, id);
  users[id].setPosition(xP, yP);
  // users[id].position = {
  //   x: xP,
  //   y: yP
  // }
  // coords[id] = createVector(xP, yP);
  // xPos = xP;
  // yPos = yP;

  // // horizontal line
  // console.log("line: " + xPos + " - " + yPos, touch);
  // line(0, yPos, width, yPos);
  // // vertical
  // line(xPos, 0, xPos, height);
  // let freqString = parseFloat(freq).toFixed(2);
  // let indexString = parseFloat(index).toFixed(2);
  // let volumeString = parseFloat(volume).toFixed(2);
  // // text(`freq: ${freqString}, harm: ${harm}, index: ${indexString}, vol: ${volumeString}`, 10, 20);
  // ellipse(xPos, yPos, 20, 20);
}

// function touchStarted() {
//   console.log("touch started");
//   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//     touch = true;
//     Tone.now();
//     if (fmOsc.state !== "started") {
//       fmOsc.start();
//     }
//   }
// }

// function touchMoved() {
//   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//     touch = true;
//     if (fmOsc.state !== "started") {
//       fmOsc.start();
//     }
//     freq = map(mouseX, 0, width, 100, 600);
//     fmOsc.frequency.value = freq;
//     // harm = map(height-mouseY, 0, height, 0, 2);
//     index = map(height - mouseY, 0, height, 0.1, 4);
//     fmOsc.modulationIndex.value = index;
//     // fmOsc.harmonicity.value = harm;
//     volume = map(height - mouseY, 0, height, -32, -10);
//     if (volume < -32) {
//       volume = -32;
//     }
//     if (volume > -10) {
//       volume = -10;
//     }

//     vol.volume.value = volume;

//     //
//     socket.emit("control", {
//       header: "touch",
//       mode: "push",
//       target: "all",
//       from: socket.id,
//       values: [mouseX, mouseY],
//     });
//   } else {
//     touch = false;
//     if (fmOsc.state === "started") {
//       fmOsc.stop();
//     }
//   }
// }

// function touchEnded() {
//   console.log("touch ended");
//   touch = false;
//   if (fmOsc.state === "started") {
//     fmOsc.stop();
//   }
// }

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
  })
    .connect(vol)
    .toDestination();

  // fmOsc.chain(distortion, Tone.Destination);
  // .start();
}

function keyPressed() {
  console.log(`key pressed: ${key}`);
  if (key === "1") {
    harm = 1.2;
  }
  if (key === "2") {
    harm = 0.8;
  }
  if (key === "3") {
    harm = 4;
  }
  if (key === "4") {
    harm = 0.5;
  }
  console.log(`harm: ${harm}`);
  fmOsc.harmonicity.value = harm;
}

function changeHarm() {
  // harm = document.getElementById("harm").value;
  fmOsc.harmonicity.value = harm;
}

function checkColor(socketid) {
  console.log("check color");
  if (!Object.keys(colors).includes(socketid)) {
    console.log("colors does not have this socketid");
    colors[socket.id] = 27;
    return 27;
  } else {
    console.log("user found");
    return colors[socket.id];
  }
  // returns a color
}

ToneSetup();
