//Collab-Hub Web Interface
console.log("Collab-Hub Web Interface");
var socket;
var timeText;
var ch1 = document.getElementById("slider_1");
var ch2 = document.getElementById("slider_2");
var ch3 = document.getElementById("slider_3");
var ch4 = document.getElementById("slider_4");

window.onload = () => {
  // connect to the collab-hub server at namespace '/hub'
  socket = io.connect("https://ch-server.herokuapp.com/hub", {
    // automatically connect with a username
    query: {
      username: "example_username_NME",
    },
  });

  timeText = document.getElementById("time");
  console.log(timeText);

  // after connected, register event handlers
  socket.on("connect", () => {
     console.log("Connected to server");
  });  
  
  socket.on("control", (data) => {

    if(data.header == "time"){
      // console.log(`time: ${data.values}`);
    timeText.innerHTML = data.values.toString();
    }

    if(data.header == "ch1"){
      console.log(`ch1: ${data.values}`);
      ch1.value = data.values;
    }
    if(data.header == "ch2"){
      console.log(`ch2: ${data.values}`);
      ch2.value = data.values;
    }
    if(data.header == "ch3"){
      console.log(`ch3: ${data.values}`);
      ch3.value = data.values;
    }
    if(data.header == "ch4"){
      console.log(`ch4: ${data.values}`);
      ch4.value = data.values;
    }
    
  });

  registerEventHandlers(socket);
};

displayTime = (data) => {
  
}

registerEventHandlers = (socket) => {
  // Find the DOM elements and register interaction handlers
  const sliders = Array.from(document.querySelectorAll(".slider"));
  sliders.forEach((slider) => {
    console.log(slider);
    slider.oninput = emitControl;
  });

  // register a handler for the 'event' event
  const buttons = Array.from(document.querySelectorAll(".button"));
  console.log(typeof buttons);
  buttons.forEach((button) => {
    console.log(button);
    button.onclick = emitEvent;
  });
};

emitEvent = (input) => {
  console.log(`ooooo button clicked: ${input.target.attributes.header.value}`);
  // Send a message to the server
  socket.emit("event", {
    header: input.target.attributes.header.value,
    mode: "push",
    target: "all",
  });
};

emitControl = (input) => {
    console.log(`control`);
    console.dir(input);
    console.log(`slider header: ${input.target.attributes.header.value}`);
    console.log(`slider value: ${input.target.value}`);
    // Send a message to the server
    socket.emit("control", {
      header: input.target.attributes.header.value,
      mode: "push",
      target: "all",
      values: input.target.value,
    });
  };
