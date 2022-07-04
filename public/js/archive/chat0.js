const socket = io();

// get data from server and show on client
// updatecount is
socket.on("message", (msg) => {
  console.log(msg);
});

document.querySelector("#form").addEventListener("submit", (e) => {
  e.preventDefault();

  //   const message =  document.querySelector("#input").value
  const message = e.target.elements.message.value;
  //   socket.emit("newMessage", message, (msg) => {
  socket.emit("newMessage", message, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log("the message was delivered");
  });
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);
    // const location = `location: ${} , ${}`;
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log("location shared");
      }
    );
  });
});
