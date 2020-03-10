const socket = io();

// elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const LocationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// bo dau hoi cham cua location.search // ?username=a&room=a (example)
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.on("mess", mess => {
  console.log(mess);
  const html = Mustache.render(messageTemplate, {
    username: mess.username,
    mess: mess.text,
    createdAt: moment(mess.createAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforebegin", html);
});

socket.on("locationMessage", message => {
  console.log(message);
  const html = Mustache.render(LocationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforebegin", html);
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  document.querySelector("#sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", e => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, error => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }
    console.log("Message delivered");
  });
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your brower");
  } else {
    $sendLocationButton.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition(position => {
      socket.emit(
        "sendLocation",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        () => {
          $sendLocationButton.removeAttribute("disabled");
          console.log("Location shared");
        }
      );
    });
  }
});

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
