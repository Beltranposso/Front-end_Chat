import React, { useState } from 'react';
import axios from 'axios';
import { URI_AUTENTICACION } from '../Services/Rutes';
const LoginForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const response = await axios.post(URI_AUTENTICACION, formData, {
        withCredentials: true, // Habilita el envío de cookies
      });
    
        if (response.status == 200) {
            const cargo =  response.data.usuario?.Cargo; // Extract user role from response
            console.log("rutaaaaa", cargo)
          // Determinar la ruta según el cargo del usuario
          let ruta;
          switch (cargo) {
              case 'coordinador':
                  ruta = '/c/u';
                  break;
              case 'asesor':
                  ruta = '';
                  break;
              default:
                  throw new Error('Cargo no reconocido'); // Manejo de cargos no válidos
          }

          // Redirigir a la ruta correspondiente
          window.location.href = ruta;
        }
      
      // Puedes guardar el token o redirigir al usuario según la respuesta
    } catch (error) {
      console.error("Error en el login:", error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;