const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "";
const PERSON_IMG = "";
const BOT_NAME = "Notsy";
const PERSON_NAME = "User";

msgerForm.addEventListener("submit", event => {
  event.preventDefault();
  let pdfname = document.querySelector('#pdfName').value;
  let question = msgerInput.value;
  if (!question) return;

  // Send the question to the backend
  sendQuestionToBackend(question,pdfname);

  appendMessage(PERSON_NAME, PERSON_IMG, "right", question);
  msgerInput.value = "";
});








function appendMessage(name, img, side, text) {
  const msgHTML = `
    <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>

        <div class="msg-bubble">
            <div class="msg-info">
                <div class="msg-info-name">${name}</div>
                <div class="msg-info-time">${formatDate(new Date())}</div>
            </div>

            <div class="msg-text">${text}</div>
        </div>
    </div>
    `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function sendQuestionToBackend(question,name) {
  fetch('/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question: question,Name:name }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle response from the backend if needed
      console.log('Response from backend:', data);
      console.log(typeof(data));
      botResponse(data); // After sending the question, you can trigger botResponse
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
}

function botResponse(data) {
  // Assuming your API returns the answer in a property named 'answer'
  const answerFromAPI = data.ans;

  // Use the answer from the API
  const answer = answerFromAPI || "generic response";

  const delay = answer.split(" ").length * 100;

  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", answer);
  }, delay);
  // answer variable stores answer of the input msgerInput obtained from chat pdf api
  // const answer = "generic response";
  // const delay = answer.split(" ").length * 100;
  // setTimeout(() => {
  //   appendMessage(BOT_NAME, BOT_IMG, "left", answer);
  // }, delay);
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}
