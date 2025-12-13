import { ArrowLeft } from "react-feather";
import ChatInput from "./ChatInput";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PUT } from "@/components/api/api";
import { useAuth } from "@/components/Authcontext";
import { useCallback, useEffect, useRef, useState } from "react";
import { IMessage } from "@/types/types";
import { socket } from "@/services/socket";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { adjustUnread } from "@/store/slices/chatSlice";

interface Props {
  chat: any;
  back: () => void;
}

export default function ChatView({ chat, back }: Props) {
  const { user } = useAuth();
  const myId = user?._id;
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const queryClient = useQueryClient();

  // -----------------------------
  // JOIN ROOM
  // -----------------------------
useEffect(() => {
  if (chat?.chatId) {
    socket.emit("join_chat", chat.chatId);
  }
}, [chat?.chatId]);

const markAsRead = useCallback(async () => {
  if (!chat?.chatId || !myId) return;
  try {
    const res = await PUT(`/chat/${chat.chatId}/read`);
    if (res?.updatedIds?.length) {
      setMessages((prev) =>
        prev.map((msg) =>
          res.updatedIds.includes(msg._id) ? { ...msg, status: "seen" } : msg
        )
      );
      queryClient.invalidateQueries({ queryKey: ["myChatList"] });
      dispatch(adjustUnread(-res.updatedIds.length));
    }
  } catch (error) {
    console.log("READ ERROR:", error);
  }
}, [chat?.chatId, myId, queryClient, dispatch]);

// -----------------------------
// SOCKET LISTENER (no duplicates)
// -----------------------------
useEffect(() => {
  const handler = (msg: IMessage) => {
    if (msg.chatId !== chat?.chatId) return;

    // ⛔ Skip messages sent by myself (they are already in UI)
    if (msg.sender === myId) return;

    setMessages((prev) => {
      const exists = prev.some((m) => m._id === msg._id);
      return exists ? prev : [...prev, msg];
    });

    if (msg.receiver === myId) {
      markAsRead();
    }
  };

  socket.on("new_message", handler);

  return () => {
    socket.off("new_message", handler);
  };
}, [chat?.chatId, markAsRead, myId]);


const typingTimeout = useRef<any>(null);

useEffect(() => {
  const handler = ({ from, chatId }: { from: string; chatId: string }) => {
    if (from === myId || chatId !== chat?.chatId) return; // ignore myself or other chats

    setIsTyping(true);

    // clear previous timeout
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    // hide typing after 1.2 seconds
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
    }, 1200);
  };

  socket.on("typing", handler);

  return () => {
    socket.off("typing", handler);
    clearTimeout(typingTimeout.current);
  };
}, [chat?.chatId, myId]);

useEffect(() => {
  if (!chat?.chatId || !myId) return;
  const handler = ({ chatId, readerId }: { chatId: string; readerId: string }) => {
    if (chatId !== chat.chatId || readerId === myId) return;
    setMessages((prev) =>
      prev.map((msg) =>
        msg.sender === myId && msg.status !== "seen"
          ? { ...msg, status: "seen" }
          : msg
      )
    );
  };

  socket.on("messages_read", handler);

  return () => {
    socket.off("messages_read", handler);
  };
}, [chat?.chatId, myId]);


  // -----------------------------
  // FETCH OLD MESSAGES
  // -----------------------------
  const { isLoading } = useQuery({
    queryKey: ["chat-messages", chat.chatId],
    queryFn: async () => {
      const data = await GET(`/chat/${chat.chatId}`);
      setMessages(data);
      return data;
    },
    enabled: !!chat?.chatId,
  });

  useEffect(() => {
    if (!myId) return;
    const hasUnread = messages.some(
      (msg) => msg.receiver === myId && msg.status === "sent"
    );
    if (hasUnread) {
      markAsRead();
    }
  }, [messages, markAsRead, myId]);

  // -----------------------------
  // SEND MESSAGE (Optimistic UI)
  // -----------------------------
  const handleSend = async (text: string) => {
    if (!text.trim() || !chat?.partner?._id) return;

    const tempId = `temp-${Date.now()}`;

    // ---- UI Optimistic Add ----
    setMessages((prev) => [
      ...prev,
      {
        _id: tempId,
        text,
        sender: myId,
        chatId: chat.chatId,
        receiver: chat.partner._id,
        status: "sent",
        temp: true,
      } as any,
    ]);

    try {
      const sent = await POST("/chat/send-message", {
        text,
        receiverId: chat.partner._id,
      });

      // Replace temp with real message
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempId ? sent : msg))
      );
    } catch (err) {
      console.log("SEND ERROR:", err);
    }
  };

  if (isLoading) return <p className="p-4">Loading...</p>;

  return (
    <div className="flex flex-col h-screen">
      {/* HEADER */}
      <div className="p-3 border-b flex items-center gap-3 flex-shrink-0">
        <button onClick={back}>
          <ArrowLeft size={18} />
        </button>
        <div className="font-medium">{chat.partner.username}{isTyping &&  
          <span className="text-muted text-xs">typing...</span>} </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {messages.map((m) => {
          const isMine = m.sender === myId;
          return (
            <div
              key={m._id}
              className={`max-w-[70%] p-2 rounded-lg text-sm ${
                isMine
                  ? "bg-primary text-white ml-auto"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <p>{m.text}</p>
              {isMine && (
                <span className="block text-[10px] mt-1 text-right text-white/80">
                  {m.status === "seen" ? "Read" : "Not read"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="border-t bg-white sticky bottom-0">
        <ChatInput onSend={handleSend} myId={myId} chat={chat}/>
      </div>
    </div>
  );
}
