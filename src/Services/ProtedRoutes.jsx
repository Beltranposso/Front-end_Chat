import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import {URI_GETUSERINFO} from '../Services/Rutes';
/* import Loading from '../components/loadingpestaña'; */

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState(null); // Almacena el rol del usuario
  const [isLoading, setIsLoading] = useState(true); // Indica si estamos cargando la validación
  const [isAuthorized, setIsAuthorized] = useState(false); // Define si el usuario está autorizado

  useEffect(() => {

    // Realizamos la solicitud al backend para validar el token y obtener el rol
    axios.get(URI_GETUSERINFO, { withCredentials: true })
    .then(response => {
      const { rol } = response.data; // Aquí se accede correctamente a Cargo
      if (!rol) throw new Error("Cargo no encontrado");
  
      console.log("cargoooooo::::::::::::.", rol);
      setUserRole(rol);
      setIsAuthorized(allowedRoles.includes(rol));
  
      const C = rol ? btoa(rol) : "";
      localStorage.setItem("C", C);
    })
    .catch(error => {
      console.error("Error al obtener la información del usuario:", error);
      setIsAuthorized(false);
    })
    .finally(() => {
      setIsLoading(false);
    });
    }, []);


  if (isLoading) {
    return "Nda que hacer"; // Mostrar un indicador mientras cargamos
  }

  if (!isAuthorized) {
    return (<Navigate to={'/'}></Navigate>
    ) // Redirigir si no está autorizado
  }

  return children; // Renderizar la ruta protegida si está autorizado
};

export default ProtectedRoute;
