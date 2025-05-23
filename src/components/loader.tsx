import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
      <div className="animate-rotate rounded-full border-4 border-t-4 border-gray-200 border-t-gray-500 h-12 w-12 mb-4"></div>
      <h2 className="text-center text-white text-xl font-semibold">
        Carregando...
      </h2>
    </div>
  );
};

export default Loader;
