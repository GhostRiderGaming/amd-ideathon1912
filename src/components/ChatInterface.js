'use client';
import { useState, useRef, useEffect } from 'react';

export default function ChatInterface({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (userId) loadHistory();
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await fetch(`/api/chat/${userId}`);
      const data = await res.json();
      if (data?.messages) {
        setMessages(data.messages);
        setConversationId(data.id);
      }
    } catch {}
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim(), createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: text.trim(), conversationId }),
      });
      const data = await res.json();
      if (data.conversationId) setConversationId(data.conversationId);
      setMessages(prev => [...prev, {
        role: 'assistant', content: data.reply, createdAt: new Date().toISOString(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant', content: 'Sorry, something went wrong. Please try again.', createdAt: new Date().toISOString(),
      }]);
    }
    setLoading(false);
  };

  const quickPrompts = [
    'What should I eat for my next meal?',
    'Am I on track with my goals today?',
    'Give me a high-protein snack idea',
    'How can I improve my diet?',
  ];

  return (
    <div className="chat-interface" role="region" aria-label="AI Nutritionist Chat">
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <span className="chat-welcome-icon">🥗</span>
            <h3>Hi! I'm your AI Nutritionist</h3>
            <p>Ask me anything about nutrition, meal planning, or your health goals.</p>
            <div className="chat-quick-prompts">
              {quickPrompts.map((p, i) => (
                <button key={i} className="quick-prompt-btn" onClick={() => sendMessage(p)}>{p}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`} role="article">
            <div className="chat-message-avatar">
              {msg.role === 'user' ? '👤' : '🥗'}
            </div>
            <div className="chat-message-bubble">
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            <div className="chat-message-avatar">🥗</div>
            <div className="chat-message-bubble typing">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form className="chat-input-bar" onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about nutrition, meals, or goals..."
          className="chat-input"
          disabled={loading}
          aria-label="Type your message"
          id="chat-input"
        />
        <button type="submit" className="chat-send-btn" disabled={!input.trim() || loading} aria-label="Send message">
          ➤
        </button>
      </form>
    </div>
  );
}
