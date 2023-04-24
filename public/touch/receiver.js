var ping;
var cnv;
var touch = false;
var index = 1;
//
var socket;
//
var section = 0;

var xPos, yPos;

var coords = [];
var users = {};
var watercolor;

// var image1 = new Image();
// var image2 = new Image();
// var image3 = new Image();
// var image4 = new Image();

$(function () {
  var changeUsername = document.getElementById("change-username");

  socket = io("http://ch-server.herokuapp.com/hub", {
    query: {
      username: "You're the Product Receiver",
    },
  });

  socket.on("control", (data) => {
    if (data.header === "userTouchToggle") {
      console.log("userTouchToggle?", data.from);
      userTouchToggle(data.values, data.from);
    }
    if (data.header === "userTouch") {
      // checkColor(socket.id);
      userTouch(data.values[0], data.values[1], data.from);
      // console.log("touch? " + data.values[0], data.values[1]);
    }
    if (data.header === "bgColor") {
      // console.log("!!!");
      // console.log("bgColor " + data.values);
      $("body").css("background-color", data.values);
    }

    if (data.header === "setPerformanceSection") {
      // let _img = get();
      // // console.log();
      // console.log(_img);
      
      // background(255, 255, 255);
      // image(_img, 0, 0);

      save(`myCanvas+${data.values}.jpg`);
      sectionChange(data.values);
      section = data.values;
      // document.getElementById("performance-section").innerHTML = data.values;
    }
  });

  var practice_button = document.getElementById("practice-button");
  var performance_button = document.getElementById("performance-button");

  var practice_interface = document.getElementById("practice-interface");
  var performance_interface = document.getElementById("performance-interface");
});

function sectionChange(data) {
  console.log("Performance Section " + data);
  if (data == 1) {
    // console.log("Watercolor?");
    watercolor = new Watercolor();
    watercolor.setup();
    console.log("Watercolor?: " + watercolor);
  }
  if(data == 2){
    background(120, 130, 30); 
  }

  if(data == 3){
    background(20, 230, 230);
  }

  if(data == 4){
    background(120, 210, 230);
  }

  if(data == 5){
    background(230, 250, 240);
  }

  if (Object.keys(users).length > 0) {
    Object.keys(users).forEach((user) => {
      users[user].setSection(data);
    });
  }
}

function setup() {
  cnv = createCanvas(windowWidth * 0.9, windowHeight * 0.9);
  // cnv = createCanvas(400, 200);
  cnv.parent(document.getElementById("canvas-node"));
  // cnv.touchStarted(touchStarted);
  // console.log("cnv? " + cnv.width + " x " + cnv.height);
  angleMode(DEGREES);
  frameRate(40);
}

function draw() {
  if (section == 0) {
    background(100);
  }

  if (section == 1) {
    background(0, 130, 30);
  }

  // // tracing circles
  // if (section == 1) {
  //   if(watercolor == null) {
  //     watercolor = new Watercolor();
  //     watercolor.setup();
  //   }
  //   watercolor.draw();
  // }

  if (section == 2) {
    // background(120, 130, 30);
  }

  if (section == 3) {
    // background(20, 230, 230);
  }

  if (section == 4) {
    // background(120, 210, 230);
  }

  Object.keys(users).forEach((user) => {
    users[user].draw();
  });
}

function userTouchToggle(state, id) {
  touch = state;
  console.log("userTouchToggle", state, id);
  if (state == true || state == "true") {
    if (!Object.keys(users).includes(id)) {
      // include canvas
      users[id] = new user(id, cnv.width, cnv.height);
      // console.log("adding user:", users[id].getID());
      // console.log("------ users-----");
      // console.dir(users);
    }
    users[id].setActive(true);
  } else {
    if (Object.keys(users).includes(id)) {
      users[id].setActive(false);
      users[id].clearPreviousPositions();
    }
  }
}

function userTouch(xP, yP, id) {
  // console.log("user touch: " + xP, yP, id);
  if(users[id]== null || users[id] == undefined) return;
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
