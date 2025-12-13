import { socket } from "@/services/socket";
import React, { useState } from "react";
import { Send } from "react-feather";

interface ChatInputProps {
  onSend: (text: string) => void;
  chat: any;
  myId : string | undefined
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, chat, myId }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className=" p-3 flex gap-2 items-center  ">
      <input
        value={text}
        onChange={(e) => {
          if (chat?.chatId && myId) {
            socket.emit("typing", {
              chatId: chat.chatId,
              from: myId,
            });
          }
          setText(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Написать сообщение..."
        className="flex-1 border w-[90%] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <button
        onClick={handleSend}
        className="bg-primary text-white w-[10%] text-center rounded px-3  text-sm py-2 flex items-center gap-1 "
      >
        <Send size={16} />
        {/* <span>Отправить</span> */}
      </button>
    </div>
  );
};

export default ChatInput;
