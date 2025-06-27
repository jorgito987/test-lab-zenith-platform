
import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TestList from '@/components/TestList';
import { Toaster } from 'sonner';

const Index = () => {
  const [userRole, setUserRole] = useState<'guest' | 'student' | 'owner' | 'editor' | 'admin'>('owner');
  const [userName] = useState('Juan Pérez');

  const handleCreateTest = () => {
    console.log('Crear nuevo test');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        userRole={userRole} 
        userName={userName}
      />
      
      <Hero userRole={userRole} />
      
      <TestList 
        userRole={userRole}
        onCreateTest={handleCreateTest}
      />

      {/* Footer simple */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-xl font-bold">TestPro</span>
              </div>
              <p className="text-gray-400 max-w-md">
                La plataforma más avanzada para crear y realizar tests educativos con IA integrada.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TestPro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Index;
