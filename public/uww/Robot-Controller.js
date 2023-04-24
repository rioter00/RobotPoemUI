// import * as Tone from 'tone';
// const Tone = require('tone');

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
  //

  //
  var changeUsername = document.getElementById("change-username");

  const socket = io("http://ch-server.herokuapp.com/hub", {
    query: {
      username: getCookie("username") || "Audience_Performance_",
    },
  });

  // console.log("CMScontroller");

  //   setInterval(() => {
  //     const start = Date.now();
  //     const pingObject = { start };
  //     socket.volatile.emit("chPing", pingObject);
  //   }, 3000);

  //   socket.on("chPingBack", (data) => {
  //     const tempPing = Date.now() - data.start;
  //     if (tempPing !== ping) {
  //       //   $("#ping").text("Ping: "+ tempPing + " ms");
  //       ping = tempPing;
  //     }
  //   });

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
    // console.log(data);
    if(data.header === "setInstructions"){
      document.getElementById("description").innerHTML = data.values;
    }
    if(data.header === "setTimeRemaining"){
      // console.log(data.values);
      document.getElementById("time-remaining").innerHTML = data.values;
    }
    if(data.header === "bgColor"){
      console.log("!!!");
      console.log("bgColor " + data.values);
      $("body").css("background-color", data.values);
    }
  });


  var modal = document.getElementById("username-modal");
  var modal_content = document.getElementById("username-modal-content");
  console.log("modal: " + modal);
  var username = document.getElementById("username-submit");
  username.onclick = addUsername;

  function addUsername() {
    let username = document.getElementById("username-input").value;
    username = username.replace(/\s/g, "");
    username = username.replace(/ /g, "");
    username = username.replace(/[^a-zA-Z ]+/g, "");
    console.log("username: " + username);
    console.log("username: " + username.length);
    if (username == "" || username.length < 1) {
      // shake modal
      modal_content.classList.add("shake");
      setTimeout(function () {
        modal_content.classList.remove("shake");
      }, 300);
      document.getElementById("username-input").value = "";
      document.getElementById("username-input").placeholder =
        "Pls use one word.";
    } 
    else {
      // console.log("username submit");
      // let wordForm = document.getElementById("username-input");
      // let word = wordForm.value;
      // word = word.replace(/\s/g, "");

      let chatObject = {
        chat: username,
        target: "All",
      };
      socket.emit("chat", chatObject);

      document.getElementById("username-input").value = "";
      // modal.style.display = "none";
    }
  }
});


