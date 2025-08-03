import { useState } from "react";

export default function Header({ onSend }) {
  const [inputText, setInputText] = useState("");

  function handleSend() {
    if (!inputText.trim()) return;
    onSend(inputText);
    setInputText("");
  }

  return (
    <div className="chat-header">
      <input
        placeholder="Ask anything…"
        value={inputText}
        onChange={e => setInputText(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}


 
