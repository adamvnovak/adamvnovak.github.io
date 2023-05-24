document.getElementById("splitForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const longText = document.getElementById("longText").value;
  const maxTokens = document.getElementById("maxTokens").value;
  const realPrompt = document.getElementById("realPrompt").value;
  const results = document.getElementById("results");
  results.innerHTML = "";

  const prompts = splitPrompts(longText, maxTokens, realPrompt);
  prompts.forEach(prompt => {
      const resultDiv = document.createElement("div");
      resultDiv.classList.add("result");

      const resultText = document.createElement("span");
      resultText.classList.add("result-text");
      resultText.textContent = prompt;
      resultDiv.appendChild(resultText);

      const copyButton = document.createElement("button");
      copyButton.classList.add("copyButton");
      copyButton.textContent = "Copy";
      copyButton.onclick = () => {
          navigator.clipboard.writeText(prompt)
              .then(() => {
                  console.log('Text successfully copied to clipboard.');
              })
              .catch(err => {
                  console.error('Failed to copy text: ', err);
              });
      };

      resultDiv.appendChild(copyButton);
      results.appendChild(resultDiv);
  });
});

function splitPrompts(text, maxTokens, realPrompt) {
  const words = text.split(' ');
  const buffer = 5;
  const adjustedMaxTokens = maxTokens - buffer;
  const prompts = [];

  let currentPrompt = '';

  for (const word of words) {
      if ((currentPrompt.length + word.length + 1) <= adjustedMaxTokens) {
          currentPrompt += `${word} `;
      } else {
          prompts.push(currentPrompt.trim());
          currentPrompt = `${word} `;
      }
  }

  if (currentPrompt) {
      prompts.push(currentPrompt.trim());
  }

    // Add the necessary metadata for the AI bot
    const intro = "I'm going to send you a series of smaller messages that are part of a longer text. Your task is to simply add each message to your memory context. Do not interpret or analyze the content of these messages.";
    const reminder = "Remember, after each message, respond with 'Understood, ready for the next message.'";
    const outro = "pinkpanda " + realPrompt;

    // Prepend the intro and append the outro
    prompts[0] = intro + " " + prompts[0] + " " + reminder;
    prompts[prompts.length - 1] += " " + outro;

    // Add the reminder to all other split prompts
    for (let i = 1; i < prompts.length - 1; i++) {
        prompts[i] += " " + reminder;
    }

    return prompts;
}
