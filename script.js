function sendMessage() {
    var messageInput = document.getElementById("message-input");
    var messageText = messageInput.value.trim();
  
    if (messageText !== "") {
      var chatWindow = document.getElementById("chat-window");
  
      var messageElement = document.createElement("div");
      messageElement.classList.add("message", "sent");
      messageElement.innerHTML = '<span class="message-content">' + messageText + '</span>';
  
      chatWindow.appendChild(messageElement);
      messageInput.value = "";
      
      // Optionally, scroll chat window to bottom after new message
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }
  