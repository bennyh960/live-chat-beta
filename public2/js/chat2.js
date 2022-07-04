const socket = io();

// ? BASIC LOGIC HOW SOCKET CLIENT-SERVER WORK

// Elements
const $messageForm = document.querySelector("#form");
const $messageFormInput = document.querySelector("#input");
const $messageFormButton = document.querySelector("button");

socket.on("message", (msg) => {
  console.log(msg);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //   console.log("x");
  const text = e.target.elements.message.value;
  socket.emit("newMessage", text);
  $messageFormInput.value = "";
  $messageFormInput.focus();
});
