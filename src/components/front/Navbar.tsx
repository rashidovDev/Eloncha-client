import React, { useEffect } from 'react'
import { Link, NavLink, } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux'
import { ChevronDown } from 'react-feather'
import { AppDispatch, RootState } from '../../store/store'
import { useAuth } from '../Authcontext';
import { hideToggleProfile, openChatSheet, toggleHideMessage } from '../../store/slices/toggleSlice';
import { checkToken, GET } from '../api/api';
import { Bell } from "react-feather";
import ChatSheet from './Chat/ChatSheet';
import { AVAILABLE_LANGUAGES, useLanguage } from '../LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NAV_TEXT } from '@/utils/const';
import { setUnreadTotal } from '@/store/slices/chatSlice';
import { IChats } from '@/types/types';



const BASE_URL_IMAGE = import.meta.env.VITE_SERVER;



const Navbar: React.FC = () => {


  const profileIsVisible = useSelector((state: RootState) => state.toggle.profileIsVisible);
  const notificationCount = useSelector((state: RootState) => state.chat.unreadTotal);
  const dispatch = useDispatch<AppDispatch>();

  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();


   const selected = AVAILABLE_LANGUAGES.find((l) => l.code === language);

  useEffect(() => {
    let isMounted = true;
    if (!user?._id) return;

    const fetchUnread = async () => {
      try {
        const response: IChats[] = await GET("/chat/chats");
        if (!isMounted) return;
        const total = response.reduce(
          (sum, chat) => sum + (chat.unreadCount || 0),
          0
        );
        dispatch(setUnreadTotal(total));
      } catch (error) {
        console.error("Failed to fetch unread chats", error);
      }
    };

    fetchUnread();

    return () => {
      isMounted = false;
    };
  }, [user?._id, dispatch]);

  return (
    <nav className='flex bg-white pb-7 justify-between items-center pt-3 md:mb-5'>
      <div className='flex w-[95%]  mx-auto  justify-between items-center '>

        <div className='flex justify-between items-center '>
          <p className='md:text-[36px] text-[32px] font-bold '><NavLink to={'/'}>Eloncha</NavLink> </p>

          <ul className='md:flex hidden cursor-pointer mt-1 ml-[40px] text-primary'>
            <li className='p-2 ml-4 text-[14px] text-primary tracking-wide'><NavLink to={"/"}>{NAV_TEXT.home[language]}</NavLink> </li>
            {/* <li className='p-2 ml-4  text-[14px] text-blue-500 tracking-wide
        '><NavLink to={"/cars"}> {NAV_TEXT.cars[language]}</NavLink>  </li> */}

            <li className='p-2 ml-4  text-[14px] text-blue-500 tracking-wide
        '><NavLink to={"/about"}> {NAV_TEXT.about[language]}</NavLink>  </li>
            <li className='p-2 ml-4 text-[14px] text-blue-500 tracking-wide
        '> <NavLink to={"/contact"}> {NAV_TEXT.contact[language]}</NavLink> </li>
          </ul>
         
        </div>

   
        <div onClick={(e) => e.stopPropagation()} className='relative flex items-center'>
        <div className='mr-5'>
     <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 border px-2 py-1 rounded-md bg-white text-sm">
        <img src={selected!.icon} width={20} height={20} alt={selected!.label} />
        {selected!.label}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-32  bg-white">
        {AVAILABLE_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src={lang.icon} width={18} height={18} alt={lang.label} />
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
    {user ? (
  <div className="flex items-center md:gap-4 ">
   
    

    {/* NOTIFICATION ICON */}
 <div
  onClick={async (e)  => {
    await checkToken()
    e.stopPropagation();
    dispatch(openChatSheet(true))
  }}
  className="relative cursor-pointer md:mr-0 mr-3"
>
  <Bell size={18} className="text-gray-700 hover:text-primary transition" />

  {notificationCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px]
      w-[14px] h-[14px] flex items-center justify-center rounded-full">
      {notificationCount}
    </span>
  )}
</div>

{/* ✅ Render sheet OUTSIDE clickable container */}
<ChatSheet   />


    {/* PROFILE BLOCK */}
    <div
      onClick={async () => {
        await checkToken()
        dispatch(toggleHideMessage())
        dispatch({ type: 'toggle/toggleProfile' })
      }}
      className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
    >

      {user.avatar ? (
        <img
          src={`${BASE_URL_IMAGE}/${user.avatar}`}
          alt="Avatar"
          className="md:w-[28px] md:h-[28px] w-[24px] h-[24px] rounded-full object-cover border"
        />
      ) : (
        <span className="w-[28px] h-[28px] rounded-full bg-primary flex items-center justify-center text-xs text-white font-medium">
          {user.username.slice(0, 2).toUpperCase()}
        </span>
      )}

      <span className="hidden md:flex text-sm font-medium">{user.username}</span>
      <ChevronDown size={14} className='mr-1'/>
    </div>

  </div>
) : (
  <NavLink className="text-blue-500 hover:underline" to="/user/login">
    {NAV_TEXT.login[language]}
  </NavLink>
)}

          <AnimatePresence>
            {profileIsVisible && (
              <motion.div
                key="profile-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-0 mt-2 w-[200px] bg-white border rounded-lg shadow-lg z-10 px-2 py-2"
              >
                <ul>
                  <li className='border-b my-2'>
                    <Link to="/profile" onClick={() => dispatch(hideToggleProfile())}  className="block px-4 py-2 hover:bg-gray-100 text-[12px]">{NAV_TEXT.profile[language]}</Link>
                  </li>
                  <li className='border-b my-2'>
                    <Link to="/profile/my-ads" onClick={() => dispatch(hideToggleProfile())} className="block px-4 py-2 hover:bg-gray-100 text-[12px]">{NAV_TEXT.myAds[language]}</Link>
                  </li>
                  <li className='border-b my-2'>
                    <Link to="/profile/saved-ads" onClick={() => dispatch(hideToggleProfile())} className="block px-4 py-2 hover:bg-gray-100 text-[12px]">{NAV_TEXT.savedAds[language]}</Link>
                  </li>
                  <li  className='border-b my-2'>
                    <Link  to="/profile/add-ads"  onClick={() => dispatch(hideToggleProfile())} className="block px-4 py-2 hover:bg-gray-100 text-[12px]">{NAV_TEXT.addAds[language]}</Link>
                  </li>
                  <div className='flex justify-center items-center mt-5'>
                    <button
                      onClick={() => {
                        logout()
                        dispatch(hideToggleProfile())
                      }}
                      type="button"
                      className="w-full text-[12px] bg-blue-500 text-white px-4 py-2 hover:bg-blue-400 rounded-xl"
                    >
                      {NAV_TEXT.logout[language]}
                    </button>
                  </div>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </nav>
  )
}

export default Navbar
