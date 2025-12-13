import { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import ChatList from "./ChatList";
import ChatView from "./ChatView";
import { useDispatch, useSelector } from "react-redux";
import { openChatSheet } from "@/store/slices/toggleSlice";
import { RootState } from "@/store/store";
import { openChat } from "@/store/slices/chatSlice";
import { socket } from "@/services/socket";
import { setOnlineUsers } from "@/store/slices/onlineSlice";

export default function ChatSheet() {

     const dispatch = useDispatch()
   const chatSheetIsVisible = useSelector((state: RootState) => state.toggle.chatSheetIsVisible);
     const currentChat = useSelector((state: RootState) => state.chat.currentChat);




 useEffect(() => {
  const handler = (online: any) => {
    dispatch(setOnlineUsers(online));
  };

  socket.on("online-users", handler);

  return () => {
    socket.off("online-users", handler);
  };
}, []);

  // const { isOpen, currentChat } = useSelector((state: any) => state.chat);

  // if (!isOpen || !currentChat) return null;

  return (
    <Sheet open={chatSheetIsVisible} onOpenChange={(value) => dispatch(openChatSheet(value))}>
      <SheetContent side="right" className="md:w-[380px] w-full p-0 bg-white">

        {/* ✅ ONLY ONE HEADER */}
        <SheetHeader className={`${!currentChat && 'p-3 border-b'}   flex items-center justify-between`}>
          <SheetTitle>
            {!currentChat && "Сообщения"}
          </SheetTitle>
        </SheetHeader>

        <div className={`${currentChat ? "hidden" : "block"}`}>
          <ChatList />
        </div>
        {currentChat && (
          <div className="h-full">
            <ChatView chat={currentChat} back={() => dispatch(openChat(null))} />
          </div>
        )}

      </SheetContent>
    </Sheet>
  );
}
