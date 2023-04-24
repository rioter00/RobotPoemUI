var ping;
document.ontouchmove = function (event) {
  event.preventDefault();
};

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
  console.log("CMS-controller.js");

  //
  var changeUsername = document.getElementById("change-username");

  const socket = io("/hub", {
    query: {
      username: getCookie("username") || "CMSUser1",
    },
  });

  console.log("CMScontroller");

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

  socket.on("bgColor", (data) => {
      console.log("!!!");
    console.log("bgColor " + data.values);
    $("body").css("background-color", data.values);
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
        "Pls enter a username";
    } else {
      console.log("username submit");
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
    console.log("user name cookie found");
    document.getElementById("username").innerHTML = getCookie("username");
    modal.style.display = "none";
    changeUsername.style.display = "block";
  }

  var usernameinput = document.getElementById("username-input");
  usernameinput.onchange = addUsername;

  var changeUsername = document.getElementById("change-username");
  changeUsername.onclick = function () {
    modal.style.display = "flex";
    changeUsername.style.display = "none";
    setCookie("username", "", -1);
  };

  var fm_destination = document.getElementById("fm-destination");
  fm_destination.onchange = function (e) {
    console.log(fm_destination.value);
    switch (fm_destination.value) {
      case "carr_freq":
        console.log("changing minmax");
        document.getElementById("fm-slider").min = "20";
        document.getElementById("fm-slider").max = "1000";
        document.getElementById("fm-slider").value = carrFreqVal || "400.00";
        document.getElementById("fm-slider").step = ".1";
        document.getElementById("fm-slider-value").innerHTML =
          carrFreqVal || "400.00";
        break;
      case "harm":
        console.log("changing minmax");
        document.getElementById("fm-slider").min = "0";
        document.getElementById("fm-slider").max = "8";
        document.getElementById("fm-slider").value = modFreqVal || "1";
        document.getElementById("fm-slider").step = ".01";
        document.getElementById("fm-slider-value").innerHTML =
          modFreqVal || "1.0";
        break;
      case "mod_index":
        console.log("changing minmax");
        document.getElementById("fm-slider").min = "0";
        document.getElementById("fm-slider").max = "2";
        document.getElementById("fm-slider").value = modDepthVal || "1.00";
        document.getElementById("fm-slider").step = ".01";
        document.getElementById("fm-slider-value").innerHTML =
          modDepthVal || "1.00";
        break;
      case "mod2_freq":
        console.log("changing minmax");
        document.getElementById("fm-slider").min = "20";
        document.getElementById("fm-slider").max = "20000";
        document.getElementById("fm-slider").value = modFreqVal2 || "10000.0";
        document.getElementById("fm-slider").step = "1";
        document.getElementById("fm-slider-value").innerHTML =
          modFreqVal2 || "10000.00";
        break;
      case "mod2_depth":
        console.log("changing minmax");
        document.getElementById("fm-slider").min = "0";
        document.getElementById("fm-slider").max = "4";
        document.getElementById("fm-slider").value = modDepthVal2 || "2.0";
        document.getElementById("fm-slider").step = ".01";
        document.getElementById("fm-slider-value").innerHTML =
          modDepthVal2 || "4.00";
        break;
      default:
        console.log("//");
        break;
    }
  };

  var slider = document.getElementById("fm-slider");
  slider.oninput = function (e) {
    let val = parseFloat(slider.value).toFixed(2);
    document.getElementById("fm-slider-value").innerHTML = val;
    // store latest value;
    switch (fm_destination.value) {
      case "carr_freq":
        carrFreqVal = val;
        break;
      case "mod_freq":
        modFreqVal = val;
        break;
      case "mod_depth":
        modDepthVal = val;
        break;
      case "mod2_freq":
        modFreqVal2 = val;
        break;
      case "mod2_depth":
        modDepthVal2 = val;
        break;
      default:
        break;
    }
    let obj = {
      header: document.getElementById("fm-destination").value,
      values: val,
      mode: "push",
      target: "all",
    };
    socket.emit("control", obj);
  };

  var seq_destination = document.getElementById("seq-destination");
  seq_destination.onchange = function (e) {
    for (let i = 1; i < 9; i++) {
      document.getElementById("seq-" + i).checked = false;
    }
  }

  var seq_submit = document.getElementById("seq-submit");
  seq_submit.onclick = function (e) {
    console.log("seq submit");
    // get sequence
    let vals = [];
    for (let i = 1; i < 9; i++) {
      vals.push(document.getElementById("seq-" + i).checked ? 1 : 0);
    }
    console.log("sequence?");
    console.dir(vals);
    console.log(document.getElementById("seq-destination").value);
    let obj = {
      header: document.getElementById("seq-destination").value.toString(),
      values: vals,
      mode: "push",
      target: "all",
    };
    console.log("obj");
    console.dir(obj);
    socket.emit("control", obj);
  };

  var seq_button = document.getElementById("seq-button");
  var fm_button = document.getElementById("fm-button");
  seq_button.onclick = function (e) {
    console.log("seq button");
    seq_interface.classList.add("active");
  };
  fm_button.onclick = function (e) {
    console.log("fm button");
    fm_interface.classList.add("active");
  };

  var seq_interface = document.getElementById("seq-interface");
  var fm_interface = document.getElementById("fm-interface");

  var close_button = document.getElementById("close-button1");
  close_button.onclick = close;
  var close_button2 = document.getElementById("close-button2");
  close_button2.onclick = close;

  function close() {
    console.log("close button");
    seq_interface.classList.remove("active");
    fm_interface.classList.remove("active");
  }

  // modal.style.display = "none";
});
