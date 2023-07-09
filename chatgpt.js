
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getRemoteConfig, getValue, fetchAndActivate } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-remote-config.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCno7_GhOA98zkhPIYRYHxeKV32ayFUAmk",
  authDomain: "adamvnovakcom.firebaseapp.com",
  projectId: "adamvnovakcom",
  storageBucket: "adamvnovakcom.appspot.com",
  messagingSenderId: "495229176170",
  appId: "1:495229176170:web:21e50fb836a1df8bc4fd13",
  measurementId: "G-SM179W4KPT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const remoteConfig = getRemoteConfig(app);
remoteConfig.settings.minimumFetchIntervalMillis = 0;
var apikey = "";
let chatHistory = [{ "role": "system", "content": "You are a helpful assistant. If the user asks for help with coding, you should think step by step, and offer complete code solutions when possible" }]

$(document).ready(function () {
  const chatBox = $("#chat-box");
  const userInput = $("#user-input");
  const sendBtn = $("#send-btn");

  fetchAndActivate(remoteConfig).then(() => {
    apikey = getValue(remoteConfig, "openai_apikey").asString();
  }).catch((err) => {
    console.log("OOPS", err)
  });

  function addMessage(text, sender) {
    chatHistory.push({ role: sender, content: text });

    let messageElement;
    if (sender === "user") {
      messageElement = document.createElement('div');
      messageElement.classList.add('chat-bubble', sender);
      messageElement.textContent = text;
      chatBox.append(messageElement);
      return;
    }

    const messageParts = text.split('```');
    for (let i = 0; i < messageParts.length; i++) {
        messageElement = document.createElement('div');
        messageElement.classList.add('chat-bubble', sender);
        
        // If index is odd, this part is a code snippet
        if (i % 2 === 1) {
            const code = messageParts[i];
            const preElem = document.createElement('pre');
            const codeElem = document.createElement('code');
            messageElement.appendChild(preElem);
            preElem.appendChild(codeElem);
            codeElem.textContent = code.trim();
            const firstLine = code.trim().split("\n")[0];
            codeElem.classList.add(`language-${firstLine}`);
            hljs.highlightBlock(codeElem);
        } else {
            messageElement.textContent = messageParts[i].trim();
        }
        chatBox.append(messageElement);
    }
    chatBox.scrollTop(chatBox[0].scrollHeight);
}

  async function sendRequestToOpenAI(text) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apikey}`,
      },
      body: JSON.stringify({
          model: "gpt-4",
          messages: chatHistory
          // stream: true,
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
              console.log(responseText);
              addMessage(responseText, 'assistant');
          })
          .catch((error) => {
              console.error("Error:", error);
              addMessage(`An error occurred: ${error}`, 'assistant');
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
