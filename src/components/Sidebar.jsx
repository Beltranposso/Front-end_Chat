import React, { useEffect,useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  FileBarChart, 
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {URI_GETUSERINFO,} from '../Services/Rutes.js';
import axios from 'axios';
import Modal from '../Modals/ModalConfrimacionLogout.jsx';
import {URI_LOGOUT} from '../Services/Rutes.js';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: 'dashboard' },
  { name: 'Chats activos', icon: Users, href: 'tutors' },
  { name: 'Supervision de chats', icon: MessageSquare, href: 'chats' },

];

export function Sidebar1({ onNavigate, currentView }) {
const [isModalOpen, setIsModalOpen] = useState(false);
const [user, setUser] = React.useState([]);
const [isCollapsed, setIsCollapsed] = useState(false);
const handleLogout = async() => {
  try {
    const response = await axios.post(URI_LOGOUT,{withCredentials: true});
    console.log('Logout successful:', response.data);
    setIsModalOpen(false);
    window.location.href = '/';
  }catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

const getUserInfo = async () => {
  try {
    const response = await axios.get(URI_GETUSERINFO, { withCredentials: true });
    setUser(response.data);
    console.log("sssssssssssssssssssssssssssssssss",response.data);
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error);
  }
}
useEffect(() => {
  getUserInfo();  
}, []);

  return (
    <div 
    className={`fixed left-0 top-0 bottom-0 flex flex-col justify-between bg-gray-900 transition-all duration-300 z-10 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}
  >
    <Modal
     isopen={isModalOpen}
     isClose={() => setIsModalOpen(false)}
     handleLogout={handleLogout}
   />

    <div className="flex-1 flex flex-col min-h-0">
      <div className={`flex h-16 items-center justify-between ${isCollapsed ? 'px-3' : 'px-6'} bg-gray-900`}>
        <div className="flex items-center">
          <MessageSquare className="h-8 w-8 text-indigo-500 flex-shrink-0" />
          {!isCollapsed && <span className="text-xl font-semibold text-white ml-2">chat</span>}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => onNavigate(item.href)}
            className={`w-full group flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-2 text-sm font-medium rounded-md ${
              currentView === item.href
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && item.name}
          </button>
        ))}
      </nav>
    </div>

    <div className="border-t border-gray-700 p-4">
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'}`}>
        {!isCollapsed && (
          <>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User"
              className="h-8 w-8 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">John Cooper</p>
              <p className="text-xs text-gray-400">Coordinator</p>
            </div>
          </>
        )}
        <button className="hover:bg-gray-700 p-1 rounded"  onClick={() => setIsModalOpen(true)}>

        <LogOut className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
        </button>
      </div>
    </div>
  </div>

  );
}
/*  <div className="flex h-full flex-col bg-gray-900 w-64 fixed left-0 top-0">
       <Modal
     isopen={isModalOpen}
     isClose={() => setIsModalOpen(false)}
     handleLogout={handleLogout}
   />
   <div className="flex h-16 items-center gap-2 px-6 bg-gray-900">
     <MessageSquare className="h-8 w-8 text-indigo-500" />
     <span className="text-xl font-semibold text-white">Chat</span>
   </div>
   
   <nav className="flex-1 space-y-1 px-2 py-4">
     {navigation.map((item) => (
       <button
         key={item.name}
         onClick={() => onNavigate(item.href)}
         className={`w-full group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
           currentView === item.href
             ? 'bg-gray-800 text-white'
             : 'text-gray-300 hover:bg-gray-800 hover:text-white'
         }`}
       >
         <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
         {item.name}
       </button>
     ))}
   </nav>

   <div className="flex items-center gap-2 p-4 bg-gray-800">
     <img
       src="https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png"
       alt="User"
       className="h-8 w-8 rounded-full"
     />
     <div className="flex-1">
       <p className="text-sm font-medium text-white">{user.Nombre}</p>
       <p className="text-xs text-gray-400">{user.rol}</p>
     </div>
     <button     onClick={() => setIsModalOpen(true)} className="hover:bg-gray-700 p-1 rounded">
       <LogOut className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
     </button>
   </div>
 </div> */