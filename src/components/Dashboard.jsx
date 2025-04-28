import React from 'react';
import { Users, MessageSquare, CheckCircle, Clock, Bell, UserPlus } from 'lucide-react';
import axios from 'axios';
import {URI_GETCHATSABIERTOS, URI_GETCHATSCERRADOS } from '../Services/Rutes.js';

import { useState, useEffect } from'react';

const stats = [
  { name: 'Active Sessions', value: '12', icon: MessageSquare, color: 'bg-green-500' },
  { name: 'Completed Today', value: '48', icon: CheckCircle, color: 'bg-purple-500' },
];

// Datos de ejemplo para nuevos chats
const recentChatsExample = [
  { id: 1, name: 'María López', message: 'Necesito ayuda con mi pedido', time: '2 min', isNew: true },
  { id: 2, name: 'Carlos Rodríguez', message: 'Tengo un problema con el pago', time: '5 min', isNew: true },
  { id: 3, name: 'Ana Martínez', message: 'No puedo acceder a mi cuenta', time: '10 min', isNew: false },
];

export function Dashboard() {
const [chatsAbiertos, setChatsAbiertos] = useState();
const [chatsCerrados, setChatsCerrados] = useState();
const [recentChats, setRecentChats] = useState(recentChatsExample);
const [nextChatId, setNextChatId] = useState(100);

const getChatsAbiertos = async () => {
try {
  const response = await axios.get(URI_GETCHATSABIERTOS,{withCredentials:true});
  setChatsAbiertos(response.data);
  console.log("ssssssss",response.data)
} catch (error) {
  console.error('Error al obtener los chats:', error);
}
}

const getChatsCerrados = async () => {
  try {
    const response = await axios.get(URI_GETCHATSCERRADOS,{withCredentials:true});
    setChatsCerrados(response.data);
    console.log("aaaaaa",response.data)
  
  } catch (error) {
    console.error('Error al obtener los chats:', error);
  }
}

// Simulación de recepción de nuevos chats
useEffect(() => {
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
  
useEffect(() => {
  getChatsAbiertos();
  getChatsCerrados();
       
 },[]);

  return (
    <div className="p-8 bg-gray-50">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="relative overflow-hidden rounded-xl bg-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <dt>
              <div className={`absolute rounded-lg bg-green-500 p-3 transform transition-transform duration-300 hover:scale-110`}>
                <CheckCircle className="h-7 w-7 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-600">
                {"Sesiones completadas"}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pt-2">
              <p className="text-3xl font-bold text-gray-900">{chatsCerrados||0}</p>
              <span className="ml-2 text-sm text-gray-500">sesiones</span>
            </dd>
          </div>
          <div
            className="relative overflow-hidden rounded-xl bg-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <dt>
              <div className={`absolute rounded-lg bg-purple-500 p-3 transform transition-transform duration-300 hover:scale-110`}>
                <MessageSquare className="h-7 w-7 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-600">
                {"Sesiones Activas"}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pt-2">
              <p className="text-3xl font-bold text-gray-900">{chatsAbiertos||0}</p>
              <span className="ml-2 text-sm text-gray-500">sesiones</span>
            </dd>
          </div>
          <div
            className="relative overflow-hidden rounded-xl bg-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 col-span-1 sm:col-span-2 lg:col-span-2"
          >
            <dt className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`rounded-lg bg-indigo-500 p-3 transform transition-transform duration-300 hover:scale-110`}>
                  <Bell className="h-7 w-7 text-white" aria-hidden="true" />
                </div>
                <p className="ml-3 text-lg font-medium text-gray-800">
                  {"Chats Recientes"}
                </p>
              </div>
              <span className="text-xs font-medium text-white bg-indigo-600 px-2 py-1 rounded-full">
                {recentChats.length} nuevos
              </span>
            </dt>
            <dd className="mt-1">
              <div className="max-h-64 overflow-y-auto pr-2 -mr-2">
                {recentChats.map((chat) => (
                  <div 
                    key={chat.id} 
                    className={`mb-3 p-3 rounded-lg ${
                      chat.isNew ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'bg-gray-50 border-l-4 border-gray-300'
                    } transition-all duration-200 hover:shadow-md cursor-pointer group`}
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
                          <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors duration-200">
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
                ))}
                {recentChats.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <UserPlus className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p>No hay chats recientes</p>
                  </div>
                )}
              </div>
            </dd>
          </div>
      </div>
    </div>
  );
}