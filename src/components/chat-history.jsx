"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import countryFlags from "../Paises.jsx"  
import axios from  "axios"
import { URI_GETCHATS} from '../Services/Rutes.js'
import { Search, Filter } from "lucide-react"


// Mock data for chat history




export default function ChatHistory({ onSelectChat }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);




  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(URI_GETCHATS);
        const data = response.data;
        console.log(data)
        const formattedChats = data.map((chat) => ({
          id: chat.id.toString(),
          name: chat.cliente?.nombre || 'Sin nombre',
          ip: chat.cliente.ip,
          email: `${chat.cliente?.nombre?.toLowerCase() || 'anonimo'}@example.com`,
          lastMessage: 'Último mensaje no disponible',
          time: 'Ahora',
          status:
            chat.estado === 'abierto'
              ? 'active'
              : chat.estado === 'pendiente'
              ? 'pending'
              : 'closed',
        }));

        setChats(formattedChats);
        setFilteredChats(formattedChats); // si luego aplicas filtros, ya está preparado
      } catch (error) {
        console.error('Error al obtener los chats:', error);
      }
    };

    fetchChats();
  }, []);





  const handleFilterChange = (searchText) => {
    const filtered = chats.filter((chat) => {
      const nameMatch = chat.name.toLowerCase().includes(searchText.toLowerCase());
      const statusMatch = chat.status === searchText.toLowerCase(); // si buscas por 'active' o 'closed'
      return nameMatch || statusMatch;
    });
    setFilteredChats(filtered);
  }

  return (
    <Card className="h-full bg-white shadow-lg border-0">
      <CardHeader className="pb-4 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-gray-900">Usuarios conectados</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="hover:bg-gray-100 active:scale-95 transition-all">
              <Filter size={16} className="mr-2 text-gray-600" />
              Filtrar
            </Button>
          </div>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar chats..."
            className="pl-10 py-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
            value={searchTerm}
            onChange={(e) => handleFilterChange(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="p-4 border border-gray-100 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:shadow-md hover:border-gray-200 transform hover:-translate-y-1"
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                      (() => {
                        const colors = [
                          'bg-blue-100 text-blue-600',
                          'bg-red-100 text-red-600',
                          'bg-green-100 text-green-600',
                          'bg-purple-100 text-purple-600',
                          'bg-pink-100 text-pink-600',
                          'bg-indigo-100 text-indigo-600',
                          'bg-yellow-100 text-yellow-600'
                        ];
                        const index = chat.name.charCodeAt(0) % colors.length;
                        return colors[index];
                      })()
                    }`}>
                      <span className="font-semibold text-lg">
                        {chat.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{chat.name}</div>
                      <div className="text-sm text-gray-500">{chat.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-500">{chat.time}</div>
                    <div className="transform hover:scale-110 transition-transform">
                      {countryFlags[chat.ip] || countryFlags["Colombia"]}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-3 line-clamp-2 hover:line-clamp-none">{chat.lastMessage}</div>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs px-4 py-1.5 rounded-full font-semibold tracking-wide ${
                      chat.status === "active"
                        ? "bg-green-100 text-green-700 border-2 border-green-200"
                        : chat.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-200"
                          : "bg-gray-100 text-gray-700 border-2 border-gray-200"
                    }`}
                  >
                    {chat.status === "active" ? "Activo" : chat.status === "pending" ? "Pendiente" : "Cerrado"}
                  </span>
                  <span className="text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-200 transition-all duration-200">
                    IP: {chat.ip || 'N/A'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 font-medium">No se encontraron chats</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

