"use client"

import { useState, useEffect } from "react"
import StatsPanel from "./stats-panel"
import { useMediaQuery } from "../hooks"
import { Bell, UserPlus, Clock } from 'lucide-react';
import StatCard from "./CardInfo"
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedChat, setSelectedChat] = useState(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [recentChats, setRecentChats] = useState([])
  const [nextChatId, setNextChatId] = useState(100)

  // Simulación de recepción de nuevos chats
  useEffect(() => {
    // Inicializar con algunos chats de ejemplo
    setRecentChats([
      { id: 1, name: 'María López', message: 'Necesito ayuda con mi pedido', time: '2 min', isNew: true },
      { id: 2, name: 'Carlos Rodríguez', message: 'Tengo un problema con el pago', time: '5 min', isNew: true },
      { id: 3, name: 'Ana Martínez', message: 'No puedo acceder a mi cuenta', time: '10 min', isNew: false },
      { id: 3, name: 'Ana Martínez', message: 'No puedo acceder a mi cuenta', time: '10 min', isNew: false },
      { id: 3, name: 'Ana Martínez', message: 'No puedo acceder a mi cuenta', time: '10 min', isNew: false },
      { id: 3, name: 'Ana Martínez', message: 'No puedo acceder a mi cuenta', time: '10 min', isNew: false },
      { id: 3, name: 'Ana Martínez', message: 'No puedo acceder a mi cuenta', time: '10 min', isNew: false }, 
      { id: 3, name: 'Ana Martínez', message: 'No puedo acceder a mi cuenta', time: '10 min', isNew: false }

    ]);

    const interval = setInterval(() => {
      // Simulamos la llegada de un nuevo chat cada 30 segundos
      if (Math.random() > 0.7) { // 30% de probabilidad de recibir un nuevo chat
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
          id: nextChatId,
          name: randomName,
          message: randomMessage,
          time: 'ahora',
          isNew: true
        };
        
        setNextChatId(prev => prev + 1);
        setRecentChats(prev => [newChat, ...prev.slice(0, 4)]); // Mantenemos solo los 5 más recientes
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [nextChatId]);

  // Función para marcar un chat como visto
  const markAsViewed = (id) => {
    setRecentChats(prev => 
      prev.map(chat => 
        chat.id === id ? { ...chat, isNew: false } : chat
      )
    );
  };

  const MessageIcon = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  )
  const UserPlusIcon = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle>
      <line x1="20" y1="8" x2="20" y2="14"></line>
      <line x1="23" y1="11" x2="17" y2="11"></line>
    </svg>
  )
  
  return (
    <div className="p-8 bg-gray-50 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-1 sm:col-span-1 lg:col-span-1">
        <StatCard
              title="Conversaciones"
              value={200}
              change={""}
              trend={null}
              description="Últimos 7 días"
              icon={<MessageIcon className="h-5 w-5 text-blue-600" />}
            />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-1">
        <StatCard
              title="Clientes nuevos"
              value={35}
              change={""}
              trend={null}
              description="este mes"
              icon={<UserPlusIcon className="h-5 w-5 text-orange-600" />}
            />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-1">
        <StatCard
              title="Tiempo de respuesta"
              value={35}
              change={""}
              trend={null}
              description="Propmedio diario"
              icon={<Clock className="h-5 w-5 text-green-600" />}
            />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-1">
          <StatsPanel title="Informes" sentiment="0%" commitment="0%" availability="0.0%" />
        </div>
        
        {/* Nuevo contenedor para chats recientes */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
            <div className="flex items-center">
              <div className="rounded-lg bg-indigo-500 p-2 mr-3">
                <Bell className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Chats Recientes
              </h3>
            </div>
            <span className="text-xs font-medium text-white bg-indigo-600 px-2 py-1 rounded-full">
              {recentChats.filter(chat => chat.isNew).length} nuevos
            </span>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentChats.length > 0 ? (
                recentChats.map((chat) => (
                  <div 
                    key={chat.id} 
                    className={`p-4 rounded-lg ${
                      chat.isNew ? 'bg-indigo-50 border-l-4 border-indigo-500 animate-pulse' : 'bg-gray-50 border-l-4 border-gray-300'
                    } transition-all duration-200 hover:shadow-md cursor-pointer`}
                    onClick={() => markAsViewed(chat.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full ${
                          chat.isNew ? 'bg-indigo-600' : 'bg-gray-600'
                        } flex items-center justify-center flex-shrink-0`}>
                          <span className="text-sm font-bold text-white">
                            {chat.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 hover:text-indigo-700 transition-colors duration-200">
                            {chat.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {chat.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                          {chat.time}
                        </span>
                        {chat.isNew && (
                          <span className="mt-1 text-xs text-white bg-indigo-500 px-2 py-0.5 rounded-full">
                            Nuevo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  <UserPlus className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p>No hay chats recientes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

