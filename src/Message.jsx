export default function Message(props) {
  const { message, sender } = props;

  return (
    <div className={`message ${sender}`}>
      {sender === "bot" && <img src="./public/bot.svg" width="20px" alt="Bot" />}
      <span>{message}</span>
      {sender === "user" && <img src="./public/person.svg" width="20px" alt="User" />}
    </div>
  );
}

