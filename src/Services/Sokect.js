import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001/";
let socket;

export const getSocket = ({ sitioId, userId, rol }) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true, // Conecta automáticamente al instanciar
      reconnection: true, // Permite reconexión automática // Intentos de reconexión antes de fallar
      reconnectionDelay: 3000, // Tiempo de espera entre intentos
      query: {
        sitioId, // ID del sitio donde trabaja el asesor
        userId,  // ID del asesor o coordinador
        rol,     // Puede ser 'asesor' o 'coordinador'
      },
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Servidor desconectado");
    });
  }

  return socket;
};