import React, { useContext, useState } from 'react';
import Sidebar from '../components/Sidebar';
import RighSideBar from '../components/RighSideBar';
import ChatContainer from '../components/ChatContainer';
import { ChatContext } from '../../context/ChatContext';

const HomePage = () => {
  const {selectedUser} = useContext(ChatContext)

  return (
    <div className="w-full h-screen flex items-center justify-center sm:px-[5%] sm:py-[3%]">
      <div
        className={`
          backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden 
          w-full h-full 
          grid relative
          ${selectedUser 
            ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' 
            : 'md:grid-cols-[1fr_2fr]'
          }
        `}
      >
        {/* Sidebar (always visible) */}
        <Sidebar  />

        {/* Chat container (main section) */}
        <ChatContainer  />

        {/* Right sidebar (only shows if selectedUser is true) */}
       <RighSideBar  />
      </div>
    </div>
  );
};

export default HomePage;
