const socket = io();

const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

// Get username and room name
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// Join room
socket.emit("joinRoom", { username, room });

// Get room and users details
socket.on("roomUsers", ({ room, users }) => {
    displayRoomName(room);
    displayConnectedUsers(users);
});

// Message from server
socket.on("message", (message) => {
    displayMessage(message);

    // Scroll to bottom of chat
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit("chatMessage", msg);

    // Clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

// Display message to DOM
const displayMessage = (message) => {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.message}
    </p>`;
    console.log(message);
    chatMessage.appendChild(div);
};

// Display room name
const displayRoomName = (room) => {
    roomName.innerText = room;
};

// Display All connected users
const displayConnectedUsers = (users) => {
    usersList.innerHTML = users
        .map((user) => `<li>${user.username}</li>`)
        .join("");
};
