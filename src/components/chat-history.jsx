"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import axios from  "axios"
import { URI_GETCHATS} from '../Services/Rutes.js'
import { Search, Filter } from "lucide-react"

// Mock data for chat history
const mockChats = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    lastMessage: "Hola, necesito ayuda con mi pedido",
    time: "10:30",
    status: "active",
  },
  {
    id: "2",
    name: "María López",
    email: "maria@example.com",
    lastMessage: "¿Cuándo estará disponible el producto?",
    time: "Ayer",
    status: "closed",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    lastMessage: "Gracias por la información",
    time: "Lun",
    status: "pending",
  },
]



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

        const formattedChats = data.map((chat) => ({
          id: chat.id.toString(),
          name: chat.cliente?.nombre || 'Sin nombre',
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
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Historial de Chats</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" />
              Filtrar
            </Button>
          </div>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar chats..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => handleFilterChange(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex justify-between">
                  <div className="font-medium">{chat.name}</div>
                  <div className="text-sm text-muted-foreground">{chat.time}</div>
                </div>
                <div className="text-sm text-muted-foreground">{chat.email}</div>
                <div className="text-sm mt-1 truncate">{chat.lastMessage}</div>
                <div className="mt-1">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      chat.status === "active"
                        ? "bg-green-100 text-green-800"
                        : chat.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {chat.status === "active" ? "Activo" : chat.status === "pending" ? "Pendiente" : "Cerrado"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No se encontraron chats</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

