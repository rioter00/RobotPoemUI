// import * as Tone from 'tone';
// const Tone = 

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

window.onload = function () {
  console.log('on load?');
  let carrFreqVal;
  let modFreqVal;
  let modDepthVal;
  let modFreqVal2;
  let modDepthVal2;
  //
  console.log("Vocal GUA -controller.js");

  let details = document.getElementById("details");
  console.log("details", details);
  details.innerHTML = "popo";

  //
  var changeUsername = document.getElementById("change-username");

  socket = io("https://ch-server.herokuapp.com/hub", {
    query: {
      username: getCookie("ch_username") || "Vocal GUA Controller_",
    },
  });

  // console.log('socket id: ', socket.keys());

  socket.on("connect", function () {
    console.log('connects???');
    console.log('socket id: ', socket.id);
  });

  // if (window.DeviceOrientationEvent) {
  //   window.addEventListener('deviceorientation', deviceOrientationHandler, false);
  //   document.getElementById('doeSupported').innerText = 'Supported!';
  // } else {
  //   document.getElementById('doeSupported').innerText = 'Not supported :(';
  // }

  // if (typeof DeviceOrientationEvent['requestPermission'] === 'function') {
  //   DeviceOrientationEvent['requestPermission']()
  //   .then(permissionState => {
  //   if (permissionState === 'granted') {
  //   window.addEventListener('deviceorientation', (event) => {
  //   console.log('=====');
  //   console.log(event);
  //   this.currentCompass$.next(event['webkitCompassHeading']);
  //   });
  //   }
  //   })
  //   .catch(console.error);
  // }

  if ( location.protocol != "https:" ) {
    location.href = "https:" + window.location.href.substring( window.location.protocol.length );
    }
    function permission () {
      console.log('permission');
        if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
            // (optional) Do something before API request prompt.
            DeviceMotionEvent.requestPermission()
                .then( response => {
                // (optional) Do something after API prompt dismissed.
                if ( response == "granted" ) {
                    document.getElementById("doeSupported").innerText = "Permission granted!";
                    // let details = document.getElementById("details");s
                    window.addEventListener( "devicemotion", (e) => {
                        // do something for 'e' here.
                        let details = document.getElementById("details");
                        console.log(details);
                        details.innerHTML = "test?";
                        details.innerHTML = e.rotationRate.alpha + " " + e.rotationRate.beta + " " + e.rotationRate.gamma;
                    });
                }
            })
                .catch( console.error )
        } else {
            alert( "DeviceMotionEvent is not defined" );
        }
    }
    const btn = document.getElementById( "request" );
    btn.addEventListener( "click", permission );
};
