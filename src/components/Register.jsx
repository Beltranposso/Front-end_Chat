import React, { useState } from 'react';
import axios from 'axios';
import { URI_REGISTRO } from '../Services/Rutes';

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    siteName: '',
    siteUrl: '',
  });

  /* const handleSubmit = async(e) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        alert('las constraseñas no coenciden!');
        return;
      }
      setStep(2);
      
      
      
    } else {
      console.log('Registration data:', formData);
      try {

       const response= axios.post(URI_REGISTRO,{nombreCoordinador:formData.username,passwordCoordinador:formData.password, urlSitio:formData.siteUrl,SitioNombre:formData.siteName});

        if (response.status == 200) {
          alert("registro exitoso");
        }else{
          alert("error en el registro");
        }

      }catch (error) {
        console.error("Error en el login:", error.response?.data || error.message);
      }
    }
  }; */


  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      setStep(2);
    } else {

      try {

        const response= axios.post(URI_REGISTRO,{nombreCoordinador:formData.username,passwordCoordinador:formData.password, urlSitio:formData.siteUrl,SitioNombre:formData.siteName});
        setShowSuccess(true);
        console.log("response",response.data)
         if (response.status == 200) {
           alert("registro exitoso"); 
          }
          
        }catch (error) {
          console.error("Error en el login:", error.response?.data || error.message);
        }
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          siteName: '',
          siteUrl: ''
        });
        setStep(1);
      }, 3000);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-green-50 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-green-800 mb-2">Registration Successful!</h3>
        <p className="text-green-600">Your account has been created successfully.</p>
      </div>
    );
  }



  return (
    <div className="relative">
    <div className="mb-4 flex justify-center">
      <div className="flex items-center">
        <div
          className={`w-3 h-3 rounded-full ${
            step === 1 ? 'bg-indigo-600' : 'bg-gray-300'
          }`}
        />
        <div className="w-12 h-1 bg-gray-300" />
        <div
          className={`w-3 h-3 rounded-full ${
            step === 2 ? 'bg-indigo-600' : 'bg-gray-300'
          }`}
        />
      </div>
    </div>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className="transition-all duration-300"
        style={{
          transform: `translateX(${step === 1 ? '0' : '-100%'})`,
          opacity: step === 1 ? 1 : 0,
          position: step === 1 ? 'relative' : 'absolute',
          width: '100%',
        }}
      >
        {step === 1 && (
          <>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </>
        )}
      </div>

      <div
        className="transition-all duration-300"
        style={{
          transform: `translateX(${step === 2 ? '0' : '100%'})`,
          opacity: step === 2 ? 1 : 0,
          position: step === 2 ? 'relative' : 'absolute',
          width: '100%',
        }}
      >
        {step === 2 && (
          <>
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                Nombre del Sitio
              </label>
              <input
                type="text"
                id="siteName"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700">
                URL del Sitio
              </label>
              <input
                type="url"
                id="siteUrl"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.siteUrl}
                onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                required
              />
            </div>

          </>
        )}
      </div>

      <div className="flex justify-between">
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className={`${
            step === 2 ? 'ml-auto' : 'w-full'
          } bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors`}
        >
          {step === 1 ? 'Next' : 'Register'}
        </button>
      </div>
    </form>
  </div>
  );
};

export default RegisterForm;