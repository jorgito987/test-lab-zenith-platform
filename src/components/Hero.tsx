
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Plus, Book } from 'lucide-react';

interface HeroProps {
  userRole?: 'guest' | 'student' | 'owner' | 'editor' | 'admin';
}

const Hero: React.FC<HeroProps> = ({ userRole = 'guest' }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Book className="w-4 h-4 mr-2" />
            <span>Plataforma Educativa Avanzada</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Crea y realiza
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              tests extraordinarios
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            La plataforma más completa para crear, gestionar y realizar evaluaciones online. 
            Con IA integrada, feedback instantáneo y análisis avanzados.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {userRole === 'guest' ? (
              <>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Comenzar Gratis
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-6 border-2 hover:bg-gray-50 transition-all duration-300"
                >
                  <Book className="w-5 h-5 mr-2" />
                  Explorar Tests
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Crear Nuevo Test
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-6 border-2 hover:bg-gray-50 transition-all duration-300"
                >
                  <Book className="w-5 h-5 mr-2" />
                  Mis Tests
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">10k+</div>
              <div className="text-gray-600">Tests Creados</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl md:text-4xl font-bold text-secondary-600 mb-2">50k+</div>
              <div className="text-gray-600">Estudiantes Activos</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-3xl md:text-4xl font-bold text-accent-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
