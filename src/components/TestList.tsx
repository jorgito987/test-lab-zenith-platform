
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TestCard from './TestCard';
import { Search, Filter, Plus } from 'lucide-react';

interface Test {
  id: string;
  title: string;
  description: string;
  author: string;
  questionsCount: number;
  duration: number;
  difficulty: 'fácil' | 'medio' | 'difícil';
  category: string;
  isPublic: boolean;
  completions: number;
  isOwner: boolean;
}

interface TestListProps {
  userRole?: 'guest' | 'student' | 'owner' | 'editor' | 'admin';
  onCreateTest?: () => void;
}

const TestList: React.FC<TestListProps> = ({ 
  userRole = 'guest', 
  onCreateTest 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Datos de ejemplo
  const sampleTests: Test[] = [
    {
      id: '1',
      title: 'Matemáticas Básicas - Álgebra',
      description: 'Test completo de álgebra básica incluyendo ecuaciones lineales, factorización y sistemas de ecuaciones.',
      author: 'Prof. María García',
      questionsCount: 30,
      duration: 45,
      difficulty: 'medio',
      category: 'Matemáticas',
      isPublic: true,
      completions: 1250,
      isOwner: false
    },
    {
      id: '2',
      title: 'Historia Universal - Edad Media',
      description: 'Evaluación sobre los principales eventos, personajes y características del período medieval europeo.',
      author: 'Dr. Carlos Ruiz',
      questionsCount: 25,
      duration: 35,
      difficulty: 'difícil',
      category: 'Historia',
      isPublic: true,
      completions: 890,
      isOwner: false
    },
    {
      id: '3',
      title: 'Programación JavaScript - Fundamentos',
      description: 'Test básico de JavaScript cubriendo variables, funciones, arrays y objetos.',
      author: 'Ana López',
      questionsCount: 40,
      duration: 60,
      difficulty: 'fácil',
      category: 'Programación',
      isPublic: true,
      completions: 2100,
      isOwner: userRole === 'owner'
    },
    {
      id: '4',
      title: 'Biología Celular Avanzada',
      description: 'Examen detallado sobre estructura celular, metabolismo y procesos de división celular.',
      author: 'Dra. Elena Martín',
      questionsCount: 35,
      duration: 50,
      difficulty: 'difícil',
      category: 'Ciencias',
      isPublic: false,
      completions: 156,
      isOwner: false
    },
    {
      id: '5',
      title: 'Inglés Intermedio - Grammar',
      description: 'Test de gramática inglesa nivel B1-B2 con ejercicios de tiempos verbales y estructuras.',
      author: 'Michael Johnson',
      questionsCount: 28,
      duration: 40,
      difficulty: 'medio',
      category: 'Idiomas',
      isPublic: true,
      completions: 1680,
      isOwner: false
    },
    {
      id: '6',
      title: 'Marketing Digital 2024',
      description: 'Evaluación actualizada sobre estrategias de marketing digital, SEO, SEM y redes sociales.',
      author: 'Sofia Hernández',
      questionsCount: 32,
      duration: 55,
      difficulty: 'medio',
      category: 'Marketing',
      isPublic: true,
      completions: 945,
      isOwner: userRole === 'owner'
    }
  ];

  const categories = ['all', 'Matemáticas', 'Historia', 'Programación', 'Ciencias', 'Idiomas', 'Marketing'];
  const difficulties = ['all', 'fácil', 'medio', 'difícil'];

  const filteredTests = sampleTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || test.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const canCreateTests = ['owner', 'editor', 'admin'].includes(userRole);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Tests Disponibles
            </h2>
            <p className="text-lg text-gray-600">
              Explora nuestra colección de {sampleTests.length} tests educativos
            </p>
          </div>
          
          {canCreateTests && (
            <Button
              onClick={onCreateTest}
              size="lg"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              Crear Test
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Category filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'Todas las categorías' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Difficulty filter */}
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Dificultad" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'Todas las dificultades' : difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredTests.length} de {sampleTests.length} tests
          </p>
        </div>

        {/* Tests grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test, index) => (
            <div
              key={test.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TestCard
                {...test}
                userRole={userRole}
                onStart={() => console.log(`Starting test ${test.id}`)}
                onEdit={() => console.log(`Editing test ${test.id}`)}
              />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredTests.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron tests
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar los filtros de búsqueda
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestList;
