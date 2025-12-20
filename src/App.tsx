import React, { useEffect } from "react"
import './scss/main.scss'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BallTriangle} from "react-loader-spinner"
import { useDispatch, useSelector } from 'react-redux';
import { RootState} from "./types/types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Routes, Route} from "react-router-dom"
import Success from "./components/utils/Success";
import { IoChatboxEllipses } from "react-icons/io5";




import {Navbar, Login, ShowNavbar, NotFound, Header,ProductID, Cars, About, Contact} from './components/navigate/navigate'
import Profile from "./components/front/Profile/Profile";
import { AppDispatch } from "./store/store";
import { hideToggleFilterCity, hideToggleProfile, openChatSheet, toggleHideMessage } from "./store/slices/toggleSlice";
import { UserPrivateRoute } from "./components/front/private";
import AddAds from "./components/front/Profile/AddAds";
import MyAds from "./components/front/Profile/MyAds";
import SavedAds from "./components/front/Profile/SavedAds";
import GoogleSuccess from "./components/GoogleSuccess";

import EditMyAd from "./components/front/Profile/EditMyAd";

import EditProfile from "./components/front/Profile/EditProfile";
import Footer from "./components/front/Footer";
import { useAuth } from "./components/Authcontext";
import { socket } from "./services/socket";
import { adjustUnread, setUnreadTotal } from "./store/slices/chatSlice";
import { checkToken, GET } from "./components/api/api";
import { IChats } from "./types/types";

const App : React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const loader = useSelector((state : RootState) => state.loader.loader)
useEffect(() => {
if (!user?._id) return;

const registerOnline = () => socket.emit("user_online", user._id);
registerOnline();

socket.on("connect", registerOnline);

return () => {
  socket.off("connect", registerOnline);
};
}, [user?._id]);

useEffect(() => {
  if (!user?._id) return;

  const handler = (msg: any) => {
    if (msg.receiver === user._id) {
      dispatch(adjustUnread(1));
    }
  };

  socket.on("new_message", handler);

  return () => {
    socket.off("new_message", handler);
  };
}, [user?._id, dispatch]);

useEffect(() => {
  if (!user?._id) return;

  const fetchUnread = async () => {
    try {
      const response: IChats[] = await GET("/chat/chats");
      const totalUnread = response.reduce(
        (sum, chat) => sum + (chat.unreadCount || 0),
        0
      );
      dispatch(setUnreadTotal(totalUnread));
    } catch (error) {
      console.error("Failed to load unread chats", error);
    }
  };

  fetchUnread();
}, [user?._id, dispatch]);

return (
  <div className="w-full bg-white min-h-screen flex flex-col">
    {/* All page content MUST be inside one flex-1 container */}
    <div 
      onClick={() => {
        dispatch(toggleHideMessage())
        dispatch(hideToggleProfile())
        dispatch(hideToggleFilterCity())
      }}
      className="flex-1 min-h-screen"
    >
      <ToastContainer 
        position='top-right'
        autoClose={2000}
      />

      {/* Loader */}
      <div className="loader z-30 fixed">
        {loader && (
          <BallTriangle height={70} width={70} radius={5} color="#4fa94d" />
        )}
      </div>

      

      <Success />

      <ShowNavbar>
         <div  onClick={async (e)  => {
          await checkToken()
          e.stopPropagation();
          dispatch(openChatSheet(true))
        }} className="fixed bottom-32 z-40 md:right-24 right-12  cursor-pointer">
        <IoChatboxEllipses size={64} color="#2F6AF3" />
      </div>
      </ShowNavbar>

      <ShowNavbar>
        
        <Navbar/>
      </ShowNavbar>

      <div className="w-[95%] mx-auto">
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/product/:id" element={<ProductID />}/>
          
          {/* Pages */}
          <Route path="/cars" element={<Cars />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth */}
          <Route path="/user/login" element={<Login />} />
          <Route path="/google" element={<GoogleSuccess />} />

          {/* Private */}
          <Route path="/profile" element={<UserPrivateRoute />}>
            <Route path="" element={<Profile />} />
            <Route path="edit" element={<EditProfile />} />
            <Route path="add-ads" element={<AddAds />} />
            <Route path="add-ads/:id" element={<AddAds />} />
            <Route path="my-ads/edit" element={<EditMyAd />} />
            <Route path="my-ads" element={<MyAds />} />
            <Route path="saved-ads" element={<SavedAds />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>

    {/* Footer always stays at bottom */}
      <ShowNavbar>
     
    <Footer />
      </ShowNavbar>
  </div>
);
}

export default App
