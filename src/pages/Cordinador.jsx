// Importaciones necesarias de React y componentes
import React, { useState,useEffect } from 'react';
import { Sidebar1 } from '../components/Sidebar';
import { Dashboard } from '../components/Dashboard';
import { TutorAssignment } from '../components/TutorAssignment';
import { ChatSupervision } from '../components/ChatSupervision';
import { URI_GETUSERINFO} from '../Services/Rutes.js';

import Dashboard2 from '../components/dashboard2.jsx';
import ChatSection from "../components/chat-section.jsx"
import ChatHistory from "../components/chat-history.jsx"
import axios from 'axios';

// Componente principal de la aplicación
function App() {
  // Estado para controlar la vista actual
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [selectedChat, setSelectedChat] = useState(null)
  // Manejador para cambiar entre diferentes vistas
  const handleNavigation = (view) => {
    setCurrentView(view);
  };


  const handleLogout = () => {
   

    setIsModalOpen(false);
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.get(URI_GETUSERINFO, { withCredentials: true });
      setUser(response.data);

    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
    }
  }
  useEffect(() => {
    getUserInfo();  
  }, []);




  return (
    // Contenedor principal con diseño flexible
    <div className="flex min-h-screen bg-gray-100">
    
      {/* Barra lateral con navegación */}
      <Sidebar1 onNavigate={handleNavigation} currentView={currentView} />
      {/* Contenido principal */}
      <main className="flex-1 ml-64">
        <div className="py-6">
          {/* Encabezado dinámico según la vista actual */}
          <div className="mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {currentView === 'dashboard' && 'Dashboard '} 
              {currentView === 'tutors' && ''}
              {currentView === 'chats' && 'Chat Supervision'}
       
            </h1>
          </div>
          {/* Renderizado condicional de componentes según la vista seleccionada */}
          <div className=" mx-auto px-4 sm:px-6 md:px-8">
            {currentView === 'dashboard' && < Dashboard2/>}
           
       {/*      {currentView === 'tutors' && <TutorAssignment id={user.id} seitioId={user.Sitio_id} />} */}
            {currentView === 'chats' && <ChatSupervision />}

            {(currentView === "tutors" || activeSection === "tutors") && !selectedChat && (
                  <ChatHistory onSelectChat={setSelectedChat} />
                )}

          {(currentView === "tutors" || activeSection === "tutors") && selectedChat && (
                  <ChatSection id={user.id} seitioId={user.Sitio_id} chatId={selectedChat} onBack={() => setSelectedChat(null)} />
              )}
          </div>
        </div>
      </main> 
    </div>
  );
}

export default App;