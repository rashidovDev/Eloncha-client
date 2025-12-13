import { GET } from "@/components/api/api";
import { openChat, setUnreadTotal } from "@/store/slices/chatSlice";
import { IChats } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAuth } from "@/components/Authcontext";
import { socket } from "@/services/socket";

// interface Props {
//   setActiveChat: (user: any) => void;
// }

export default function ChatList() {

  const dispatch = useDispatch()
  const [chats, setChats] = useState<IChats[]>([])
  const { user } = useAuth();
  const myId = user?._id;

   const { isLoading, refetch } = useQuery({
    queryKey: ['myChatList'],
    queryFn: getMyChatList,
  });

  async function getMyChatList (){
    const response : IChats[]  = await GET(`/chat/chats`)
    
    setChats(response)
    const totalUnread = response.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
    dispatch(setUnreadTotal(totalUnread));
    return response
  }

  const onlineUsers = useSelector((state: RootState) => state.online.users);

  useEffect(() => {
    const handler = (msg: any) => {
      if (!myId) return;
      if (msg.receiver === myId || msg.sender === myId) {
        refetch();
      }
    };

    socket.on("new_message", handler);

    return () => {
      socket.off("new_message", handler);
    };
  }, [myId, refetch]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="overflow-y-auto h-full bg-white">

      {chats.map(chat => (
        <button
          key={chat.chatId}
          onClick={() => dispatch(openChat(chat))}
          className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 text-left"
        >
          <div className="relative">
            <div  className="w-10 h-10 bg-gray-300 border-b-primary rounded-full" />
            <span
              className={`absolute -right-0 -bottom-0 w-3 h-3 rounded-full border-2 border-white ${
                onlineUsers.includes(chat.partner?._id) ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{chat.partner?.username}</p>
              {chat.unreadCount ? (
                <span className="bg-red-500 text-white text-[11px] rounded-full px-2 py-[1px]">
                  {chat.unreadCount}
                </span>
              ) : null}
            </div>
            <p className="text-xs text-gray-500">
              {chat.lastSender === myId ? `Вы: ${chat.lastMessage}` : chat.lastMessage}
            </p>
            {/* {chat.lastSender === myId && chat.lastStatus !== "seen" && (
              <p className="text-[11px] text-amber-600 mt-1">Не прочитано</p>
            )} */}
          </div>
        </button>
      ))}

    </div>
  );
}
