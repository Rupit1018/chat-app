import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("https://chat-backend-7gj1.onrender.com");


const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("send_message", { message });
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data.message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ padding: "10px", width: "60%" }}
      />
      <button onClick={sendMessage} style={{ padding: "10px", marginLeft: "10px" }}>
        Send
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3>Messages:</h3>
        {chat.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default Chat;
