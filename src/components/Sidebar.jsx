import React, { useEffect, useState, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  FileBarChart, 
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  PlusCircle
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

// Datos de ejemplo para nuevos chats
const chatNotificationsExample = [
  { id: 1, name: 'María López', message: 'Necesito ayuda con mi pedido', time: '2 min', isNew: true, viewed: false },
  { id: 2, name: 'Carlos Rodríguez', message: 'Tengo un problema con el pago', time: '5 min', isNew: true, viewed: false },
  { id: 3, name: 'Ana Martínez', message: 'No puedo acceder a mi cuenta', time: '10 min', isNew: true, viewed: false },
];

export function Sidebar1({ onNavigate, currentView }) {
const [isModalOpen, setIsModalOpen] = useState(false);
const [user, setUser] = React.useState([]);
const [isCollapsed, setIsCollapsed] = useState(false);
const [showNotifications, setShowNotifications] = useState(false);
const [notifications, setNotifications] = useState(chatNotificationsExample);
const [blinkingNotifications, setBlinkingNotifications] = useState(true);

// Referencia para generar IDs únicos
const nextIdRef = useRef(100);

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

// Función para añadir un nuevo chat manualmente (simulación)
const addNewChat = () => {
  const names = ['Juan Pérez', 'Laura García', 'Miguel Sánchez', 'Sofía Ramírez', 'Diego Torres'];
  const messages = [
    'Hola, necesito ayuda con mi compra',
    '¿Cómo puedo cambiar mi contraseña?',
    'Mi pedido no ha llegado todavía',
    'Tengo un problema con el producto',
    '¿Puedo solicitar un reembolso?'
  ];
  
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  const newChat = {
    id: nextIdRef.current++,
    name: randomName,
    message: randomMessage,
    time: 'ahora',
    isNew: true,
    viewed: false
  };
  
  setNotifications(prev => [newChat, ...prev.slice(0, 9)]); // Mantenemos solo los 10 más recientes
  setBlinkingNotifications(true);
};

// Marcar un chat como visto
const markAsViewed = (id) => {
  setNotifications(prev => {
    const updatedNotifications = prev.map(chat => 
      chat.id === id ? { ...chat, viewed: true } : chat
    );
    
    // Verificar si todos los chats han sido vistos usando la versión actualizada
    const allViewed = updatedNotifications.every(chat => chat.viewed);
    if (allViewed) {
      setBlinkingNotifications(false);
    }
    
    return updatedNotifications;
  });
};

// Simulación de recepción de nuevos chats
useEffect(() => {
  const interval = setInterval(() => {
    // Simulamos la llegada de un nuevo chat cada 30 segundos
    if (Math.random() > 0.7) { // 30% de probabilidad de recibir un nuevo chat
      const newChat = {
        id: nextIdRef.current++,
        name: `Cliente ${Math.floor(Math.random() * 100)}`,
        message: 'Nuevo mensaje de ayuda',
        time: 'ahora',
        isNew: true,
        viewed: false
      };
      setNotifications(prev => [newChat, ...prev.slice(0, 9)]); // Mantenemos solo los 10 más recientes
      setBlinkingNotifications(true);
    }
  }, 30000);
  
  return () => clearInterval(interval);
}, []);

useEffect(() => {
  getUserInfo();  
}, []);

  return (
    <aside 
      className={`fixed left-0 top-0 bottom-0 flex flex-col justify-between bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out z-10 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <Modal
        isopen={isModalOpen}
        isClose={() => setIsModalOpen(false)}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <div className={`flex h-16 items-center justify-between ${isCollapsed ? 'px-3' : 'px-6'} bg-gray-900 border-b border-gray-800`}>
          <div className="flex items-center overflow-hidden">
            <MessageSquare className="h-8 w-8 text-indigo-500 flex-shrink-0 transition-colors duration-200" />
            <span className={`text-xl font-semibold text-white ml-2 whitespace-nowrap transition-opacity duration-200 ${
              isCollapsed ? 'opacity-0' : 'opacity-100'
            }`}>chat</span>
          </div>
          <div className="flex items-center">
            <div className="relative mr-2">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors duration-200 relative ${
                  blinkingNotifications ? 'animate-pulse' : ''
                }`}
                aria-label="Notificaciones"
              >
                <Bell className={`h-5 w-5 ${blinkingNotifications ? 'text-indigo-400' : ''}`} />
                {notifications.length > 0 && (
                  <span className={`absolute top-0 right-0 h-4 w-4 ${
                    blinkingNotifications ? 'bg-red-500 animate-ping' : 'bg-red-500'
                  } rounded-full text-xs flex items-center justify-center text-white`}>
                    {notifications.length} 
                  </span>
                )}
              </button>
              
              {/* Panel de notificaciones - Modificado para que aparezca también cuando el sidebar está contraído */}
              {showNotifications && (
                <div className={`absolute ${isCollapsed ? 'left-16' : 'left-0'} mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-20 border border-gray-700`}>
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Bell className="h-4 w-4 text-indigo-400" />
                      Nuevos Chats
                    </h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addNewChat();
                        }}
                        className="text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded-md transition-all duration-200 flex items-center gap-1"
                        title="Simular nuevo chat"
                      >
                        <PlusCircle className="h-3 w-3" />
                        <span>Nuevo</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotifications([]);
                          setBlinkingNotifications(false);
                        }}
                        className="text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-700 px-2 py-1 rounded-md transition-all duration-200"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(chat => (
                        <div 
                          key={chat.id} 
                          className={`p-4 border-b border-gray-700 hover:bg-gray-700 transition-all duration-200 cursor-pointer group ${
                            !chat.viewed ? 'bg-indigo-900/20 animate-pulse' : ''
                          }`}
                          onClick={() => {
                            markAsViewed(chat.id);
                            onNavigate('tutors');
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${
                                !chat.viewed ? 'bg-indigo-600 animate-pulse' : 'bg-indigo-600'
                              } flex items-center justify-center`}>
                                <span className="text-sm font-bold text-white">
                                  {chat.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="font-medium text-sm text-white group-hover:text-indigo-400 transition-colors duration-200">
                                {chat.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
                              {chat.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mt-2 ml-11 group-hover:text-gray-100 transition-colors duration-200">
                            {chat.message}
                          </p>
                          {!chat.viewed && (
                            <span className="ml-11 mt-2 inline-block px-2 py-0.5 bg-indigo-500 text-xs rounded-full text-white">
                              Nuevo
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <span className="block text-gray-400 text-sm">No hay nuevos chats</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors duration-200"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => onNavigate(item.href)}
              className={`w-full group flex items-center ${
                isCollapsed ? 'justify-center px-2' : 'px-4'
              } py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out ${
                currentView === item.href
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 ${
                isCollapsed ? '' : 'mr-3'
              }`} />
              <span className={`transition-opacity duration-200 ${
                isCollapsed ? 'opacity-0 absolute' : 'opacity-100'
              }`}>
                {item.name}
              </span>
            </button>
          ))}
        </nav>
      </div> 

      {/* Contenedor de nuevos chats para modo colapsado - Mejorado */}
      {isCollapsed && notifications.length > 0 && (
        <div className="px-2 py-3 border-t border-gray-800 overflow-hidden">
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={addNewChat}
              className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center hover:bg-indigo-600 transition-colors duration-200 shadow-md"
              title="Simular nuevo chat"
            >
              <PlusCircle className="h-5 w-5 text-white" />
            </button>
            
            {notifications.slice(0, 3).map(chat => (
              <button
                key={chat.id}
                className={`w-10 h-10 rounded-full ${
                  !chat.viewed ? 'bg-indigo-600 animate-pulse' : 'bg-indigo-600'
                } flex items-center justify-center relative hover:bg-indigo-700 transition-colors duration-200 shadow-md`}
                title={`${chat.name}: ${chat.message}`}
                onClick={() => {
                  markAsViewed(chat.id);
                  onNavigate('tutors');
                }}
              >
                <span className="text-xs font-bold text-white">
                  {chat.name.split(' ').map(n => n[0]).join('')}
                </span>
                {!chat.viewed && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 animate-ping rounded-full text-xs flex items-center justify-center text-white shadow-sm">
                    !
                  </span>
                )}
              </button>
            ))}
            {notifications.length > 3 && (
              <span className="text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded-full mt-1">+{notifications.length - 3}</span>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-gray-800 p-4 bg-gray-900/50">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          {!isCollapsed && (
            <>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User"
                className="h-9 w-9 rounded-full ring-2 ring-gray-700 transition-transform duration-200 hover:scale-105"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">John Cooper</p>
                <p className="text-xs text-gray-400 truncate">Coordinator</p>
              </div>
            </>
          )}
          <button 
            className="hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200"  
            onClick={() => setIsModalOpen(true)}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5 text-gray-400 hover:text-white transition-colors duration-200" />
          </button>
        </div>
      </div>
    </aside>
  );
}