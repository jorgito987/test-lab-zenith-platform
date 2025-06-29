import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TestCard from './TestCard';
import PdfUploader from './PdfUploader';
import { Search, Filter, Plus, CheckCircle, XCircle } from 'lucide-react';

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

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
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
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [showUploader, setShowUploader] = useState(false);

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

  const handleTestGenerated = (questions: Question[]) => {
    console.log('Test generado con', questions.length, 'preguntas');
    setGeneratedQuestions(questions);
    setShowUploader(false);
    
    // Scroll to generated questions
    setTimeout(() => {
      document.getElementById('generated-test')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

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
              Explora nuestra colección de {sampleTests.length} tests educativos o genera uno desde tu PDF
            </p>
          </div>
          
          {canCreateTests && (
            <div className="flex gap-2">
              <Button
                onClick={() => setShowUploader(!showUploader)}
                size="lg"
                variant={showUploader ? "default" : "outline"}
                className={showUploader 
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600" 
                  : "border-primary-200 text-primary-700 hover:bg-primary-50"
                }
              >
                <Plus className="h-5 w-5 mr-2" />
                {showUploader ? 'Ocultar Subida' : 'Subir PDF'}
              </Button>
              <Button
                onClick={onCreateTest}
                size="lg"
                variant="outline"
                className="border-secondary-200 text-secondary-700 hover:bg-secondary-50"
              >
                <Plus className="h-5 w-5 mr-2" />
                Crear Manual
              </Button>
            </div>
          )}
        </div>

        {/* PDF Uploader */}
        {showUploader && canCreateTests && (
          <PdfUploader onTestGenerated={handleTestGenerated} />
        )}

        {/* Generated Questions Display */}
        {generatedQuestions.length > 0 && (
          <div id="generated-test" className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Test Generado ({generatedQuestions.length} preguntas)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGeneratedQuestions([])}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cerrar
              </Button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedQuestions.map((question, index) => (
                <div key={question.id} className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {index + 1}. {question.question}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-md text-sm transition-colors ${
                          optionIndex === question.correctIndex
                            ? 'bg-green-200 text-green-800 font-medium border border-green-300'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-semibold mr-2">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        {option}
                        {optionIndex === question.correctIndex && (
                          <CheckCircle className="inline h-4 w-4 ml-2 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>¡Test listo!</strong> Puedes usar estas preguntas para crear un test completo. 
                Las respuestas correctas están marcadas en verde.
              </p>
            </div>
          </div>
        )}

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
