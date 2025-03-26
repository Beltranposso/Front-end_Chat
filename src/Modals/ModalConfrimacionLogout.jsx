import { X } from "lucide-react";

const ModalConfirmacionLogout = ({ isopen, isClose, handleLogout }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-300 z-[990] ${
        isopen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-transparent transition-opacity duration-300 ${
          isopen ? "bg-opacity-50 backdrop-blur-sm" : "bg-opacity-0 backdrop-blur-none"
        }`}
        onClick={isClose}
      />

      {/* Modal Content */}
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 ${
          isopen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        }`}
      >
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-t-2xl p-6">
          <h2 className="text-2xl font-semibold text-white">
            ¿Estás seguro de cerrar sesión?
          </h2>
          {/* Botón para cerrar */}
          <button
            onClick={isClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 bg-white rounded-b-2xl">
          <p className="text-gray-600 mb-6">
            Tu sesión se cerrará y tendrás que volver a iniciar sesión para acceder a tu cuenta.
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={isClose}
              className="px-6 py-2.5 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-300 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-300 shadow-md hover:shadow-lg font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacionLogout;
