// src/components/NoAccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NoAccess = ({ message, redirectTo = '/' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso denegado</h2>
        <p className="text-gray-600 mb-6">
          {message || "No tienes permisos para acceder a esta sección."}
        </p>
        <Link
          to={redirectTo}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NoAccess;