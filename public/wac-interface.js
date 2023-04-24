let socket;
let droneState;

document.addEventListener('DOMContentLoaded', (event) => {
  
  console.log("Ready!");
  socket = io("/hub");

  socket.on("serverMessage", (incoming) => {
    console.log(incoming.message);
  });

  socket.on("event", (incoming) => {
    let event = incoming.header;
    if (event == "audienceScore") {
      changeScore();
    }
    if (event == "audienceEnd") {
      document.getElementById("score").src = "wac-score/SHP11.jpg";
    }
    if (event == "droneDown") {
      droneVol(0);
    }
    if (event == "droneUp") {
      droneVol(1);
    }
  });

});

setInterval(sliderToServer, 200);

function sliderToServer() {
  let value = document.getElementById("slider").value;
  let outgoing = {
    header: "wacSlider",
    values: value,
    mode: "push",
    target: "all"
  };
  socket.emit("control", outgoing);
}

function bangToServer() {
  let outgoing = {
    header: "wacBang",
    mode: "push",
    target: "all"
  };
  socket.emit("event", outgoing);
}

function changeScore() {
  let scoreNum = Math.floor(Math.random() * 10) + 1;
  document.getElementById("score").src = "wac-score/SHP" + scoreNum + ".jpg";
}

function showStuff() {
  document.getElementById("score").style.display = "block";
  document.getElementById("slider").style.display = "block";
  document.getElementById("bump-button").style.display = "block";
  document.getElementById("start-button-wrapper").style.display = "none";
  Tone.start();
} 