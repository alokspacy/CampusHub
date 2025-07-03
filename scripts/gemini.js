const chatbotButton = document.getElementById('chatbot-button');
const chatDialog = document.getElementById('chat-dialog');
const closeChatBtn = document.getElementById('close-chat');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');


chatbotButton.addEventListener('click', () => {
  chatDialog.style.display = 'flex';
  userInput.focus();
});


closeChatBtn.addEventListener('click', () => {
  chatDialog.style.display = 'none';
  chatbotButton.focus();
});


document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && chatDialog.style.display === 'flex') {
    chatDialog.style.display = 'none';
    chatbotButton.focus();
  }
});


function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function appendMessage(text, sender) {
  const div = document.createElement('div');
  div.className = sender === 'user' ? 'user-msg' : 'bot-msg';
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

const staticAnswers = {
  "What is CampusHub?": "CampusHub is a student-to-student marketplace where students can offer and avail services like web development, video editing, note sharing, and more.",
  "How does CampusHub work?": "Students sign up, post services or requests, and connect with peers who can help or hire them—it's an internal student economy.",
  "What is the revenue model of CampusHub?": "CampusHub plans to generate revenue by taking a small commission on each transaction, along with optional promotional listings.",
  "What is the aim of CampusHub?": "To empower students by building a local, affordable, skill-sharing platform within the campus community."
};

async function fetchWithRetry(url, options, retries = 2) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    if (retries > 0) {
      console.warn("Retrying Gemini API call... attempts left:", retries);
      await new Promise((r) => setTimeout(r, 1000)); // wait 1 second
      return fetchWithRetry(url, options, retries - 1);
    } else {
      throw error;
    }
  }
}

async function sendMessage() {
  const userText = userInput.value.trim();
  if (!userText) return;

  appendMessage(userText, 'user');
  userInput.value = '';
  userInput.disabled = true;
  sendButton.disabled = true;

  if (staticAnswers[userText]) {
    appendMessage(staticAnswers[userText], 'bot');
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
    return;
  }

  try {
    const apiURL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBtaryXW5I-jCxuG1im4IbBUtp7Ujw6z9k";
    const body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: userText
            }
          ]
        }
      ]
    };

    const data = await fetchWithRetry(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn’t understand.";
    appendMessage(reply, 'bot');
  } catch (error) {
    console.error("Final fetch error:", error);
    appendMessage("❌ Gemini is currently unavailable. Please try again later.", 'bot');
  }

  userInput.disabled = false;
  sendButton.disabled = false;
  userInput.focus();
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    userInput.value = btn.textContent;
    sendMessage();
  });
});