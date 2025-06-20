const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // "bot is typing..." animasi
  const typingIndicator = appendTyping();

  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMessage }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      removeTyping(typingIndicator);
      appendMessage('bot', data.reply);
    })
    .catch(error => {
      console.log('Error sending message: ', error);
      removeTyping(typingIndicator);
      appendMessage('bot', 'Error: Could not get a response.');
    });
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);

  const avatar = document.createElement('div');
  avatar.classList.add('avatar');


  avatar.style.backgroundImage = sender === 'user'
    ? "url('https://cdn-icons-png.flaticon.com/512/1946/1946429.png')" // user icon
    : "url('https://cdn-icons-png.flaticon.com/512/4712/4712105.png')"; // bot icon

  const textEl = document.createElement('div');
  textEl.classList.add('text');
  textEl.textContent = text;

  if (sender === 'user') {
    msg.appendChild(textEl);
    msg.appendChild(avatar);
  } else {
    msg.appendChild(avatar);
    msg.appendChild(textEl);
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendTyping() {
  const typing = document.createElement('div');
  typing.classList.add('message', 'bot');
  typing.setAttribute('id', 'typing-indicator');

  const avatar = document.createElement('div');
  avatar.classList.add('avatar');
  avatar.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/4712/4712105.png')";

  const text = document.createElement('div');
  text.classList.add('text', 'typing');
  text.textContent = 'Bot is typing...';

  typing.appendChild(avatar);
  typing.appendChild(text);
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;

  return typing;
}

function removeTyping(typingEl) {
  if (typingEl && typingEl.parentNode) {
    typingEl.parentNode.removeChild(typingEl);
  }
}
