import './App.css';
import { useState, useEffect, useRef } from 'react';
import Header from './Header.jsx';
import Message from './Message.jsx';
import { getBotReplyWithFallback } from './Response.js';

export default function App() {
  const [chatMessages, setChatMessages] = useState([
    { message: "Hi 👋 — ask me anything!", sender: "bot" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  async function handleSendMessage(userText) {
    if (!userText.trim()) return;

    // Add user message immediately
    const userMessage = { message: userText, sender: "user" };
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get bot reply with fallback handling
      const reply = await getBotReplyWithFallback(userText);
      
      // Add bot response
      setChatMessages(prev => [...prev, { message: reply, sender: "bot" }]);
      
    } catch (err) {
      console.error('Error getting bot reply:', err);
      
      // More specific error messages
      let errorMessage = "⚠️ Sorry, I couldn't fetch a reply.";
      
      if (err.message.includes('API key')) {
        errorMessage = "🔑 API key configuration issue. Please check your settings.";
      } else if (err.message.includes('loading')) {
        errorMessage = "⏳ AI model is loading. Please try again in a moment.";
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        errorMessage = "🌐 Network error. Please check your connection and try again.";
      }
      
      setChatMessages(prev => [
        ...prev,
        { message: errorMessage, sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {chatMessages.map((msg, i) => (
          <Message key={i} message={msg.message} sender={msg.sender} />
        ))}
        
        {isLoading && (
          <div className="message bot">
            <div className="typing-indicator">
              <div className="typing-dots">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <Header onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}