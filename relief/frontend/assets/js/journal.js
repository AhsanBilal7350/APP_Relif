document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearBtn = document.getElementById('clearChat');

    if (!chatInput || !sendBtn) return;

    // Conversation history for AI context
    let chatHistory = [];

    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Clear chat
    clearBtn.addEventListener('click', () => {
        chatHistory = [];
        chatMessages.innerHTML = `
            <div class="chat-welcome-msg">
                <div class="welcome-icon">🌿</div>
                <h3 class="serif">Hello, I'm here for you</h3>
                <p>Share whatever is on your mind — your feelings, your day, or anything you'd like to talk about. I'll listen and offer supportive insights.</p>
            </div>
        `;
    });

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Remove welcome message if it's the first message
        const welcome = chatMessages.querySelector('.chat-welcome-msg');
        if (welcome) welcome.remove();

        // Add user message bubble
        addMessage('user', text);
        chatInput.value = '';
        chatInput.focus();

        // Show typing indicator
        const typingEl = addTypingIndicator();

        // Disable input while waiting
        chatInput.disabled = true;
        sendBtn.disabled = true;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: chatHistory
                })
            });

            // Remove typing indicator
            typingEl.remove();

            if (response.ok) {
                const data = await response.json();
                addMessage('assistant', data.response);

                // Update history for context
                chatHistory.push({ role: 'user', content: text });
                chatHistory.push({ role: 'assistant', content: data.response });

                // Keep history manageable (last 20 messages)
                if (chatHistory.length > 20) {
                    chatHistory = chatHistory.slice(-20);
                }
            } else {
                addMessage('assistant', 'Sorry, I had trouble processing that. Please try again.');
            }
        } catch (err) {
            typingEl.remove();
            console.error('Fetch error:', err);
            addMessage('assistant', 'Could not connect to the server. Make sure the backend is running.');
        } finally {
            chatInput.disabled = false;
            sendBtn.disabled = false;
            chatInput.focus();
        }
    }

    function addMessage(role, content) {
        const wrapper = document.createElement('div');
        wrapper.className = `chat-bubble-wrapper ${role}`;

        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${role}`;
        bubble.textContent = content;

        const time = document.createElement('span');
        time.className = 'chat-time';
        const now = new Date();
        time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        wrapper.appendChild(bubble);
        wrapper.appendChild(time);
        chatMessages.appendChild(wrapper);

        // Smooth scroll to bottom
        chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
    }

    function addTypingIndicator() {
        const wrapper = document.createElement('div');
        wrapper.className = 'chat-bubble-wrapper assistant';

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble assistant typing-indicator';
        bubble.innerHTML = '<span></span><span></span><span></span>';

        wrapper.appendChild(bubble);
        chatMessages.appendChild(wrapper);
        chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });

        return wrapper;
    }
});