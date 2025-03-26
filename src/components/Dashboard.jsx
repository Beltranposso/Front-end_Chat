import React from 'react';
import { Users, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import {URI_GETCHATSABIERTOS,URI_GETCHATSCERRADOS } from '../Services/Rutes.js';

import { useState, useEffect } from'react';

const stats = [

  { name: 'Active Sessions', value: '12', icon: MessageSquare, color: 'bg-green-500' },
  { name: 'Completed Today', value: '48', icon: CheckCircle, color: 'bg-purple-500' },
];

export function Dashboard() {
const [chatsAbiertos, setChatsAbiertos] = useState();
const [chatsCerrados, setChatsCerrados] = useState();




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
  
useEffect(() => {
  getChatsAbiertos();
  getChatsCerrados();
       
 },[]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          <div
           
            className="relative overflow-hidden rounded-lg bg-white p-6 shadow z-[0]"
          >
            <dt>
              <div className={`absolute rounded-md bg-green-500 p-3`}>
                <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {"Seciones completadas"}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{chatsCerrados||0}</p>
            </dd>
          </div>
          <div
            
            className="relative overflow-hidden rounded-lg bg-white p-6 shadow z-[0]"
          >
            <dt>
              <div className={`absolute rounded-md bg-purple-500 p-3`}>
                <MessageSquare className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {"Seciones Activas"}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{chatsAbiertos||0}</p>
            </dd>
          </div>
      </div>
    </div>
  );
}