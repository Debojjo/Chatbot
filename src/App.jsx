import './App.css';
import { useState, useEffect, useRef } from 'react';
import Header from './Header.jsx';
import Message from './Message.jsx';
import { getBotReplyWithFallback } from './Response.js';

export default function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  async function handleSendMessage(userText) {
    if (!userText.trim()) return;

    // Remove welcome once the user starts
    if (!hasStarted) setHasStarted(true);

    const userMessage = { message: userText, sender: "user" };
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const reply = await getBotReplyWithFallback(userText);
      setChatMessages(prev => [...prev, { message: reply, sender: "bot" }]);
    } catch (err) {
      console.error('Error getting bot reply:', err);

      let errorMessage = "⚠️ Sorry, I couldn't fetch a reply.";

      if (err.message.includes('API key')) {
        errorMessage = "🔑 API key issue. Please check your Groq API key.";
      } else if (err.message.includes('rate limit')) {
        errorMessage = "⏳ Too many requests. Please try again in a moment.";
      } else if (err.message.includes('network')) {
        errorMessage = "🌐 Network error. Please check your connection.";
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
    <>
      <div className="chat-container">
        <div className="messages">
          {!hasStarted && (
            <div className="welcome-message">
              <p>👋 Hello! Ask me anything to get started.</p>
            </div>
          )}

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
      </div>

      <Header onSend={handleSendMessage} isLoading={isLoading} />
    </>
  );
}
