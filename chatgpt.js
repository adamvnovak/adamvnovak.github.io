$(document).ready(function () {
  const chatBox = $("#chat-box");
  const userInput = $("#user-input");
  const sendBtn = $("#send-btn");

  function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-bubble', sender);
    messageElement.textContent = text;
    chatBox.append(messageElement);
    chatBox.scrollTop(chatBox[0].scrollHeight);
  }  

async function sendRequestToOpenAI(text) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer whatttttt-GInCC2kj3tBXqjT2nL3oT3BlbkFJnK4NPcMgns4ETSP1TieY`,
      },
      body: JSON.stringify({
          model: "gpt-4",
          messages: [
              { "role": "system", "content": "You are a math tutor." },
              { "role": "user", "content": text },
          ],
      }),
  });
  const data = await response.json();
  if (data.error) {
      console.error("Error:", data.error);
      return "An error occurred. Please try again later.";
  }
  return data.choices[0].message.content.trim();
}


  function sendMessage() {
    const text = userInput.val();
    if (text) {
        userInput.val('');
        addMessage(text, 'user');
        sendRequestToOpenAI(text)
            .then((responseText) => {
                addMessage(responseText, 'bot');
            })
            .catch((error) => {
                console.error("Error:", error);
                addMessage("An error occurred. Please try again later.", 'bot');
            });
    }
}

userInput.on('keypress', (event) => {
    if (event.which === 13) {
        sendMessage();
    }
});

sendBtn.on('click', () => {
    sendMessage();
});
});
