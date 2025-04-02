import React, { use, useEffect, useState } from 'react';
import { Search, Filter, CheckCircle, X, MessageSquare, UserCheck, Clock, Loader2 } from 'lucide-react';
import {URI_GETCHATS, URI_GETCHATS2,URI_PULLASESOR} from '../Services/Rutes.js'
import axios from 'axios';

import { getSocket } from '../Services/Sokect.js';
import { Await, useFetcher } from 'react-router-dom';



export function TutorAssignment({ id,seitioId}) {
  const [clients, setClients] = useState([]);
  const [searchClients, setSearchClients] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const [Chats, setChats] = useState([]);
  const [mensajesClientes, setmensjesClientes] = useState([]);
  const [mensajesAsesor, setmensAasesor] = useState([ ])
  const [ID_CHAT, setID_CHAT] = useState();
  const [ID_USER, setID_USER] = useState()
  const [Mensaje,setMensaje] = useState("");
  const [count, setCount] = useState([]);
  const socket = getSocket({ sitioId:seitioId,userId: id, rol:"coordinador" });
  
  const GETCHATS = async () => {
    try{ 
      const response = await axios.get(URI_GETCHATS,{withCredentials: true});
      setClients(response.data);
      if(response.status === 200){
        const data = response.data;
        console.log(data);
      }else{
        console.log("Error al obtener los datos");
      }

    }catch(error){
      console.error("Error al obtener los datos", error);
    }
  };

  
  const GETCHATS2 = async (id) => {
    try{
      const response = await axios.get(URI_GETCHATS2+id,{withCredentials: true});
      setChats(response.data);
      setmensjesClientes(response.data.mensajes.filter(mensaje => mensaje.enviado_por === "cliente"));
      setmensAasesor(response.data.mensajes.filter(mensaje => mensaje.enviado_por === "asesor"));
      if(response.status === 200){
        const data = response.data;
        console.log(data);
      }else{
        console.log("Error al obtener los datos");
      }
 
    }catch(error){
      console.error("Error al obtener los datos", error);
    }
  };



 console.log("LOCURAAAA",ID_CHAT)




  const handleCloseChat = () => {
    setShowChat(false);
  };


  const handleOpenChat = async () => {


    setShowChat(true,);

  };



 /*  const handleFinishChat = () => {
/*     setClients(clients.map(client =>
      client.id === selectedClient
        ? { ...client, status: 'completed' , isActive: false }
        : client
    )); */
 /*    setShowChat(false);
    setSelectedClient(null);
  };  */
/* 
  const filteredClients = clients.filter(client =>
    (client.studentName.toLowerCase().includes(searchClients.toLowerCase()) ||
    client.subject.toLowerCase().includes(searchClients.toLowerCase()))
  );

  const selectedClientData = clients.find(client => client.id === selectedClient);

 */


  
  const enviarMensaje =async () => {
    // Validación del mensaje
    if (!Mensaje.trim()) {
      console.warn("No se puede enviar un mensaje vacío.");
      return;
    }
  
    const timestamp = new Date().toISOString();
  
    // Mensaje unificado para el servidor
    const mensajeUnificado = {
      chatId: ID_CHAT,
      contenido: Mensaje,
      enviadoPor: "asesor",
      createdAt: timestamp,
    };
  
    // Actualización optimista del estado
    setChats((prevChats) => {
      const updatedChats = { ...prevChats };
      updatedChats.mensajes = [
        ...updatedChats.mensajes, 
        { 
          ...mensajeUnificado, 
          id: Date.now(),
          status: 'sending' // Añadir un estado de envío
        }
      ];
      return updatedChats;
    });
  
    // Enviar mensaje al servidor con callback de confirmación
    socket.emit("respuesta", mensajeUnificado, (error, response) => {
      if (error) {
        console.error("Error al enviar mensaje:", error);
        
        // Actualizar estado para marcar el mensaje como fallido
        setChats((prevChats) => {
          const updatedChats = { ...prevChats };
          updatedChats.mensajes = updatedChats.mensajes.map(mensaje => 
            mensaje.id === Date.now() 
              ? { ...mensaje, status: 'failed' } 
              : mensaje
          );
          return updatedChats;
        });
      } else {
        // Actualizar estado para marcar el mensaje como enviado
        setChats((prevChats) => {
          const updatedChats = { ...prevChats };
          updatedChats.mensajes = updatedChats.mensajes.map(mensaje => 
            mensaje.id === Date.now() 
              ? { ...mensaje, status: 'sent' } 
              : mensaje
          );
          return updatedChats;
        });
      }
    });
  
    // Limpiar el input de mensaje
    setMensaje("");
  };
  const Entratalchat = async () => {
    try {
      const response = await axios.post(URI_PULLASESOR+ID_CHAT,{id_asesor:id},{withCredentials: true});
      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al enviar mensaje:", error); 
    }
  }



  useEffect(() => {
    GETCHATS();

  }, []); 


  useEffect(() => {
    GETCHATS2();
  }, []);

  useEffect(() => {


    const handleMensaje = (data) => {
        console.log("📩 Mensaje recibido:", data);
        
        // Agregar el mensaje recibido al estado `chats`
        setChats((prevChats) => {
            return {
                ...prevChats,
                mensajes: [...prevChats.mensajes, { ...data, status: 'received' }]
            };
        });
    };

    socket.on("Mensaje23", handleMensaje);

    // Log para verificar listeners activos
    console.log("🎧 Listeners activos:", socket.listeners("Mensaje23"));

    return () => {
        console.log("🛑 Eliminando listener de Mensaje23");
        socket.off("Mensaje23", handleMensaje);
    };
}, []);


const Enviarseñal = async () => {
  setCount(count + 1);
 await socket.emit("Señal",count);
  }
  console.log("satossssssssssssss",clients)
  return (
    <div className="p-6">
    <div className="grid grid-cols-1 gap-6">
      { showChat ? (
        // Vista del chat
         <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={`https://cdn.pixabay.com/photo/2012/04/13/21/07/user-33638_1280.png`}

                  className="h-12 w-12 rounded-full"
                />
              {/*   <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  Chats.cliente.Estado==='Activo' ? 'bg-green-500' : 'bg-gray-500'
                }`}></span>  */}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{Chats.cliente.nombre}</h2>
                <p className="text-gray-500">{""}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={""}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <UserCheck className="h-5 w-5" />
                Marcar como atendido
              </button>
              <button
                onClick={handleCloseChat}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                title="Cerrar chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="h-[400px] flex flex-col  bg-gray-50 rounded-lg p-4 mb-4  gap-6 overflow-y-auto">

          {Chats.mensajes
  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Ordenar por fecha
  .map((chat, i) => (
    <div key={chat.id || i} className="space-y-4">
      {/* Mensajes del cliente (izquierda) */}
      {chat.enviado_por === "cliente" ? (
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <img
              src="https://cdn.pixabay.com/photo/2012/04/13/21/07/user-33638_1280.png"
              alt="Cliente"
              className="h-8 w-8 rounded-full"
            />
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
            <p className="text-sm text-gray-900">{chat.contenido}</p>
          </div>
        </div>
      ) : (
        /* Mensajes del asesor (derecha) */
        <div className="flex gap-3 justify-end">
          <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
            <p className="text-sm text-gray-900">{chat.contenido}</p>
          </div>
          <div className="flex-shrink-0">
            <img
              src="https://cdn.pixabay.com/photo/2014/04/03/11/47/avatar-312160_1280.png"
              alt="Asesor"
              className="h-8 w-8 rounded-full"
            />
          </div>
        </div>
      )}
    </div>
  ))}




          </div>

          <div className="flex gap-4">
          <input
  type="text"
  placeholder="Escribe un mensaje..."
  value={Mensaje}
  onChange={(e) => setMensaje(e.target.value)}
  className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
<button 
  onClick={async()=>{await enviarMensaje(),await Enviarseñal()}} 
  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
>
  Enviar
</button>
          </div>
        </div> 
      ) : (
        // Lista de clientes
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold mb-4">Clientes Conectados</h2>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
              /*     value={searchClients}
                  onChange={(e) => setSearchClients(e.target.value)} */
                  placeholder="Buscar clientes..."
                  className="w-full pl-9 pr-4 py-2 border rounded-md"
                />
              </div>
              <button className="p-2 border rounded-md hover:bg-gray-50">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="divide-y">
            {clients.map((client,i) => (
              <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={`https://cdn.pixabay.com/photo/2012/04/13/21/07/user-33638_1280.png`}
                     
                        className="h-10 w-10 rounded-full"
                      />
                       <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                        client.cliente.Estado==="Activo" ? 'bg-green-500' : 'bg-gray-500'
                      }`}></span> 
                    </div>
                    <div>
                      <h3 className="font-medium">{client.cliente.nombre}</h3>
                      <p className="text-sm text-gray-500">{"coenctado hace 5 mnutos"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/*  <span className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {client.timestamp}
                      </span> */}
                    <div className="flex items-center gap-2">
                    
                    <button
                          onClick={async()=> {await GETCHATS2(client.id),await Entratalchat(client.id),await handleOpenChat(),setID_CHAT(client.id),setID_USER(client.cliente.id)}}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 min-w-[140px] justify-center"
                        /*   disabled={!client.isActive || isLoading === client.id} */
                        >
                          
                           {isLoading === client.id ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>Cargando...</span>
                            </>
                          ) : (
                            <>
                              <MessageSquare className="h-5 w-5" />
                              <span>Entrar al chat</span>
                            </>
                          )} 
                        </button>
                    </div>
                  </div>
                </div>
            
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
  );
}