import React, { use, useState,useEffect } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { URI_GETCHATS3,URI_GETCHATS2 } from '../Services/Rutes.js';



export function ChatSupervision() {
  const [selectedChat, setSelectedChat] = useState();
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]) 
  const [Mensajes, setMensajes] = useState([""]); 
  const [asesorName, setAsesorName] = useState("");
  const [clienteName, setClienteName] = useState("");
console.log("sssssss",selectedChat)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    

    console.log('Sending coordinator message:', message);
    setMessage('');
  };



  const GETCHATS = async () => {
    try{ 
      const response = await axios.get(URI_GETCHATS3,{withCredentials: true});
      setChats(response.data);
      
    }catch(error){
      console.error("Error al obtener los datos", error);
    }
  };
const getid =async (id) => {
setSelectedChat(id);

}
  const GETCHATS2 = async () => {
    try{ 
      const response = await axios.get(URI_GETCHATS2+selectedChat,{withCredentials: true});
      setMensajes(response.data);
      console.log("mensajesssssssssssss",response.data)
      setAsesorName(response.data.asesor.nombre);
      setClienteName(response.data.cliente.nombre);
   
    }catch(error){
      console.error("Error al obtener los datos", error);
    }
  };




console.log(chats)

  useEffect(() => {
    GETCHATS(); 
  },[])





  return (
    <div className="grid grid-cols-3 gap-6 p-6 ">
      {/* Active Chats List */}
      <div className="col-span-1 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Sesiones Activas</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {chats.map((chat,i) => (
            <div
              key={i}
              onClick={async() => {await getid(chat.id),await GETCHATS2()}}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                selectedChat === chat.id ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className='flex flex-col '>
                <h3 className="font-medium">{"Cliente: "+chat.cliente.nombre}</h3>
                <h3 className="">{"Asesor: "+chat.asesor.nombre}</h3>

                </div>
                <span className="text-xs text-gray-500">{"Time 5 Minutes"}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{"estado"}</p>
              
            </div>
          ))}
        </div>
      </div>

      {/* Chat View */}
      {
      <div className="col-span-2 bg-white rounded-lg shadow flex flex-col h-[600px]">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">{clienteName}</h2>
            <p className="text-sm text-gray-500">Session started at 14:30</p>
          </div>
          <button className="p-2 text-blue-400 hover:bg-blue-50 rounded-md">
            <AlertCircle className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-scroll space-y-4">


        {Mensajes?.mensajes &&
  Array.isArray(Mensajes.mensajes) &&
  Mensajes.mensajes.length > 0 ? (
    Mensajes.mensajes
      .filter((mensaje) => mensaje.enviado_por === "cliente") // Filtra solo los mensajes del cliente
      .map((mensaje, index) => (
        <div key={index} className="flex gap-3">
          <img    
            src="https://unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="Alice" 
            className="h-8 w-8 rounded-full" 
          />
          <div className="flex-1">
            <p className="text-sm text-gray-500">{clienteName}</p>
            <div className="mt-1 bg-gray-100 rounded-lg p-3">
              <p>{mensaje.contenido}</p>
            </div> 
          </div> 
        </div> 
      ))
  ) : (
    <p className="text-sm text-gray-500">No hay mensajes disponibles.</p>
  )}
{Mensajes?.mensajes?.length > 0 ? (
  Mensajes.mensajes
    .filter((mensaje) => mensaje.enviado_por === "asesor") // Filtra solo los mensajes de asesores
    .map((mensaje, index) => (
      <div key={index} className="flex gap-3 justify-end">
        <div className="flex-1 text-right">
          <p className="text-sm text-gray-500">{asesorName}</p>
          <div className="mt-1 bg-indigo-100 rounded-lg p-3 inline-block text-left">
            <p>{mensaje.contenido}</p>
          </div>
        </div>
        <img
          src="https://cdn.pixabay.com/photo/2014/04/03/11/47/avatar-312160_1280.png"
          alt="Asesor"
          className="h-8 w-8 rounded-full"
        />
      </div>
    ))
) : (
  <p className="text-sm text-gray-500">No hay mensajes de asesores disponibles.</p>
)}
        </div>

        <div className="p-4 border-t">
       
        </div>
      </div>
      }
    </div>
  );
}