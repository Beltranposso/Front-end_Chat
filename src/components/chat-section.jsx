"use client"

import {useState, useEffect, useRef} from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { getSocket } from '../Services/Sokect.js';
import { URI_GETCHATS2,URI_POSTMENSAJE} from '../Services/Rutes.js'
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  Ban,
  Ticket,
  Clock,
  UserX,
  FileText,
  Printer,
  MessageSquare,
  X,
} from "lucide-react"

export default function ChatSection({id, chatId, onBack, seitioId}) {
  const [newMessage, setNewMessage] = useState("")
  const [showSidebar, setShowSidebar] = useState(true)
  const [chats, setChats] = useState(null)
  const bottomRef = useRef(null)
  const initialScrollDone = useRef(false);
  const socket = getSocket({ sitioId: seitioId, userId: id, rol: "coordinador" })
  
  const getChatById = async (id) => {
    try {
      const res = await axios.get(URI_GETCHATS2+id)
      const data = res.data
      console.log("✅ Respuesta del servidor:", data)
      const chatAdaptado = {
        id: String(data.id),
        name: data.cliente?.nombre || "Anónimo",
        email: "sin-email@example.com",
        location: data.cliente?.Estado || "Desconocido",
        messages: data.mensajes.map((msg) => ({
          sender: msg.enviado_por === 'cliente' ? 'client' : 'agent',
          content: msg.contenido,
          Traduccion: msg.Traduccion ,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
      }
  
      return chatAdaptado
    } catch (error) {
      console.error("❌ Error al traer el chat con Axios:", error)
      return null
    }
  }

  const cargarChat = async () => {
    const chat = await getChatById(chatId)
    if (chat) {
      console.log("✅ Chat adaptado:", chat)
      setChats(chat)
    }
  }
  
  useEffect(() => {
    cargarChat()
  }, [chatId])


  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: initialScrollDone.current ? "smooth" : "auto"
      });
      initialScrollDone.current = true;
    }
  }, [newMessage]);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, []); 

const CreateMensaje =async(newMessage,DateNow)=>{
try{
const response = await axios.post(URI_POSTMENSAJE, {
  chatId: chatId, // Asegúrate de que chatId esté definido y sea una cadena de texto válida
  contenido: newMessage,
  enviadoPor: "asesor",
  DateNow: DateNow, 
})

 
if(response.status === 404){
console.log("Mensaje enviado con éxito")
}
}catch{
console.log("Error al enviar el mensaje")
}
}

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      console.warn("No se puede enviar un mensaje vacío.")
      return
    }
  
    const timestamp = new Date().toISOString()
  
    // Generar un ID básico basado en timestamp + contenido (evita duplicados)
    const messageId = `${timestamp}-${newMessage}`
    const mensajeUnificado = {
      chatId,
      contenido: newMessage,
      enviadoPor: "asesor",
      createdAt: timestamp,
      messageId,
    }
    CreateMensaje(newMessage, timestamp)
  
    // Actualización optimista del estado
    setChats((prevChat) => {
      if (!prevChat) return prevChat
  
      return {
        ...prevChat,
        messages: [
          ...prevChat.messages,
          {
            id: messageId,
            sender: 'agent',
            content: newMessage,
            timestamp: new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            }),
            status: 'sending'
          }
        ]
      }
    })
  
    // Enviar mensaje al servidor con callback
    socket.emit("respuesta", mensajeUnificado, (error) => {
      setChats((prevChats) => {
        if (!prevChats) return prevChats
  
        const updatedChats = { ...prevChats }
  
        updatedChats.messages = updatedChats.messages.map(mensaje =>
          mensaje.id === messageId
            ? { ...mensaje, status: error ? 'failed' : 'sent' }
            : mensaje
        )
  
        return updatedChats
      })
    })
  
    setNewMessage("")
  }




  useEffect(() => {
    if (!socket || !chatId) return;
  
    // 👉 Unirse a la sala del chat
    socket.emit("joinChat", chatId );
    console.log(`🧩 Cliente unido a sala chat_${chatId}`);
  
    // 👉 Escuchar mensajes de la sala
    function handleIncomingMessage(data) {
      console.log("📩 Nuevo mensaje recibido:", data);
    
      if (data.chatId === Number(chatId)) { 
        setChats((prevChat) => {
          if (!prevChat) return prevChat;
          
       
          
          // Adaptar el formato del mensaje recibido por socket al formato esperado por tu componente
          const nuevoMensaje = {
            sender: data.enviado_por === 'cliente' ? 'client' : 'agent',
            content: data.contenido,
            Traduccion: data.Traduccion,
            timestamp: new Date(data.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          };
          
          return {
            ...prevChat,
            messages: [...prevChat.messages, nuevoMensaje],
          };
        });
      } else {
        console.log(`⚠️ Mensaje ignorado: chatId ${data.chatId} no coincide con ${chatId}`);
      }
    };
  
    socket.on("mensaje", handleIncomingMessage);
  
    // 🧹 Limpieza al desmontar
    return () => {
      socket.off("mensaje", handleIncomingMessage);
    };
  }, [socket, chatId]);



  const formatTimestamp = (timestamp) => {
    if (timestamp.includes(":")) {
      return timestamp
    }
    return timestamp
  }

  const getMessageClass = (sender) => {
    switch (sender) {
      case "agent":
        return "bg-primary text-primary-foreground"
      case "client":
        return "bg-muted"
      case "system":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-muted"
    }
  }

  const getMessageTextClass = (sender) => {
    switch (sender) {
      case "agent":
        return "text-primary-foreground/70"
      case "system":
        return "text-blue-600"
      default:
        return "text-muted-foreground"
    }
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  if (!chats) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p>Chat no encontrado </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-grow">
            <CardTitle className="text-lg">{chats.name}</CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <p className="text-sm text-muted-foreground">{chats.email}</p>
              {chats.location && (
                <p className="text-sm text-muted-foreground sm:ml-2">
                  <span className="hidden sm:inline">•</span> {chats.location}
                </p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {showSidebar ? <X size={18} /> : <MessageSquare size={18} />}
          </Button>
        </div>
      </CardHeader>
      <div className="flex flex-grow overflow-hidden">
        {showSidebar && (
          <div className="w-64 border-r p-3 flex flex-col space-y-3 overflow-y-auto">
            <div className="text-sm font-medium text-muted-foreground mb-2">Acciones</div>

            <Button variant="outline" size="sm" className="justify-start hover:bg-red-100 hover:text-red-600 transition-colors">
              <Ban size={16} className="mr-2 text-red-500" />
              Bloquear usuario
            </Button>

            <Button variant="outline" size="sm" className="justify-start hover:bg-blue-100 hover:text-blue-600 transition-colors">
              <Ticket size={16} className="mr-2 text-blue-500" />
              Crear ticket
            </Button>

            <Button variant="outline" size="sm" className="justify-start hover:bg-purple-100 hover:text-purple-600 transition-colors">
              <Clock size={16} className="mr-2 text-purple-500" />
              Historial
            </Button>

            <Button variant="outline" size="sm" className="justify-start hover:bg-orange-100 hover:text-orange-600 transition-colors">
              <UserX size={16} className="mr-2 text-orange-500" />
              Banear IP 
            </Button>

            <Button variant="outline" size="sm" className="justify-start hover:bg-green-100 hover:text-green-600 transition-colors">
              <FileText size={16} className="mr-2 text-green-500" />
              Notas
            </Button>

            <Button variant="outline" size="sm" className="justify-start hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
              <Printer size={16} className="mr-2 text-indigo-500" />
              Imprimir chat
            </Button>

            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <div className="text-sm font-medium">Información</div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiempo:</span>
                  <span>00:09:35</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chats:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Página:</span>
                  <span className="truncate max-w-[120px]">Tercer Ciclo Radio</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-grow flex flex-col h-[500px] overflow-hidden">
          <CardContent className="flex-grow overflow-y-auto p-4">
            <div className="space-y-4">
{chats.messages.map((message, index) => (
  <div
    key={index}
    className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"} mb-4`}
  >
    <div 
      className={`
        relative
        max-w-[80%] 
        p-4  
        rounded-2xl
        ${message.sender === "agent" 
          ? "rounded-br-none bg-green-500 text-white shadow-lg" 
          : "rounded-bl-none bg-purple-500 text-white shadow-md"
        }
        ${getMessageClass(message.sender)}
      `}
    >
      {message.sender === "system" ? (
        message.content.startsWith("http") ? (
          <a
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all transition-colors"
          >
            {message.content}
          </a>
        ) : (
          <p className="text-base leading-relaxed">{message.content}</p>
        )
      ) : (
        <>
          <p className="text-base leading-relaxed">{message.content}</p>
          
          {/* Show translation only for client messages and if translation exists and is different from original */}
          {message.sender === "client" && 
           message.Traduccion && 
           message.Traduccion !== null &&
           message.Traduccion !== "Sin traducción" && 
           message.Traduccion !== message.content && (
            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-xs text-white/70 mb-1">Traducción:</p>
              <p className="text-base leading-relaxed">{message.Traduccion}</p> 
            </div>
          )}
        </>
      )}
      <p 
        className={`
          text-xs 
          mt-2
          opacity-75
          ${message.sender === "agent" ? "text-white/70" : "text-white/70"}
        `}
      >
        {formatTimestamp(message.timestamp)}
      </p>
    </div>
  </div>
))}
              <div ref={bottomRef} />
            </div>
          </CardContent>

          <CardFooter className="border-t p-3">
            <div className="flex w-full items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Paperclip size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Smile size={20} />
              </Button>
              <Input
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-grow"
              />
              <Button variant="default" size="icon" onClick={handleSendMessage} disabled={newMessage.trim() === ""}>
                <Send size={20} />
              </Button>
            </div>
          </CardFooter>

          <div className="flex border-t">
            <Button
              variant="ghost"
              className="flex-1 rounded-none py-2 h-12 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              <MessageSquare size={20} />
            </Button>
            <Button
              variant="ghost"
              className="flex-1 rounded-none py-2 h-12 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <X size={20} />
            </Button>
            <Button
              variant="ghost"
              className="flex-1 rounded-none py-2 h-12 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
            >
              <Paperclip size={20} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}