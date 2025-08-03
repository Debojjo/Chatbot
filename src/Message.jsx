export default function Message({ message, sender }) {
  return (
    <div className={`message ${sender}`}>
      {sender === "bot" && (
        <img src="/bot.svg" width="20px" alt="Bot avatar" />
      )}
      <span>{message}</span>
      {sender === "user" && (
        <img src="/person.svg" width="20px" alt="User avatar" />
      )}
    </div>
  );
}


