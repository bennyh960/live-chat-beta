const socket = io();

// ? ADDING CB as 3 arg of the socket func
// ? RENDER TO SCREEN WITH LIBARY MUSTCH

// Elements
const $messageForm = document.querySelector("#form");
const $messageFormInput = document.querySelector("#input");
const $messageFormButton = document.querySelector("button");
const $messages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#message-template").innerHTML;

socket.on("message", (msg) => {
  console.log(msg);
  const html = Mustache.render(messageTemplate, {
    message: msg,
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //   console.log("x");
  const text = e.target.elements.message.value;
  socket.emit("newMessage", text, (arg) => {
    $messageFormInput.value = "";
    $messageFormInput.focus();
    console.log(arg);
  });
});
