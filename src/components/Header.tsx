
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Plus, Book, Settings } from 'lucide-react';

interface HeaderProps {
  userRole?: 'guest' | 'student' | 'owner' | 'editor' | 'admin';
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userRole = 'guest', userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Tests', href: '#tests', icon: Book },
    { name: 'Crear Test', href: '#create', icon: Plus, roles: ['owner', 'editor', 'admin'] },
    { name: 'Panel Admin', href: '#admin', icon: Settings, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(
    item => !item.roles || item.roles.includes(userRole)
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
              <Book className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              TestPro
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {filteredNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {userRole === 'guest' ? (
              <>
                <Button variant="outline" size="sm">
                  Iniciar Sesión
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600">
                  Registrarse
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{userName || 'Usuario'}</span>
                  <span className="text-xs bg-primary-200 px-2 py-0.5 rounded-full capitalize">
                    {userRole}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  Salir
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {filteredNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <item.icon className="h-5 w-5 text-gray-500" />
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
            <div className="pt-4 border-t">
              {userRole === 'guest' ? (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Iniciar Sesión
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500">
                    Registrarse
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Conectado como: <span className="font-medium">{userName}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Salir
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
