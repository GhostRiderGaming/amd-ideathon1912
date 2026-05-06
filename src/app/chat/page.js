'use client';
import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(localStorage.getItem('nourishai_userId') || 'default-user');
  }, []);

  return (
    <main className="page chat-page">
      <div className="chat-header-bar">
        <h1 className="page-title">AI Nutritionist</h1>
        <p className="page-subtitle">Powered by Google Gemini</p>
      </div>
      {userId && <ChatInterface userId={userId} />}
    </main>
  );
}
