let socket = io();

		let messageArea = document.getElementById("messageArea");
		let messageInput = document.getElementById("messageInput");
		let sendMessageButton = document.getElementById("sendMessageButton");
		let usernameModal = document.getElementById("usernameModal");
		let usernameInput = document.getElementById("usernameInput");
		let usernameSubmit = document.getElementById("usernameSubmit");
		let username = ""; // Store the username

		// Show username modal on page load
		window.onload = function () {
			usernameModal.classList.remove("hidden");
		};

		// Hide username modal and emit "user joined" event
		usernameSubmit.addEventListener("click", function () {
			username = usernameInput.value.trim(); // Store the entered username
			if (username !== "") {
				socket.emit('user joined', username);
				usernameModal.classList.add("hidden");
				usernameInput.disabled = true; // Disable the username input field
			} else {
				alert("Please enter a username.");
			}
		});

		// Handle send message button click event
		sendMessageButton.addEventListener("click", function () {
			sendMessage();
		});

		// Handle form submission on Enter key press
		messageInput.addEventListener("keypress", function (event) {
			if (event.key === "Enter") {
				sendMessage();
			}
		});

		// Function to send message
		function sendMessage() {
			let messageValue = messageInput.value.trim();
			if (messageValue !== "") {
				socket.emit('send message', { username: username, message: messageValue });
				messageInput.value = "";
			}
		}

		socket.on("send message", (data) => {
			let chatContent = document.createElement("p");
			chatContent.textContent = `${data.username}: ${data.message}`;
			chatContent.classList.add(data.username === username ? 'message-right' : 'message-left');
			// chatContent.style.padding = "2px";
			chatContent.style.marginTop = "11px";
			messageArea.appendChild(chatContent);
			// Scroll to the bottom of the message area
			messageArea.scrollTop = messageArea.scrollHeight;
		});

		// Handle "user joined" event to display a message
		socket.on("user joined", (username) => {
			let joinMessage = document.createElement("p");
			joinMessage.textContent = username + " has joined the chat.";
			joinMessage.style.fontWeight = "bold";
			messageArea.appendChild(joinMessage);
			// Scroll to the bottom of the message area
			messageArea.scrollTop = messageArea.scrollHeight;
		});