
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Clock, BookOpen, Play, Edit, MoreVertical } from 'lucide-react';

interface TestCardProps {
  id: string;
  title: string;
  description: string;
  author: string;
  questionsCount: number;
  duration: number; // en minutos
  difficulty: 'fácil' | 'medio' | 'difícil';
  category: string;
  isPublic: boolean;
  completions: number;
  userRole?: 'guest' | 'student' | 'owner' | 'editor' | 'admin';
  isOwner?: boolean;
  onStart?: () => void;
  onEdit?: () => void;
  onView?: () => void;
}

const TestCard: React.FC<TestCardProps> = ({
  id,
  title,
  description,
  author,
  questionsCount,
  duration,
  difficulty,
  category,
  isPublic,
  completions,
  userRole = 'guest',
  isOwner = false,
  onStart,
  onEdit,
  onView
}) => {
  const difficultyColors = {
    fácil: 'bg-green-100 text-green-700 border-green-200',
    medio: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    difícil: 'bg-red-100 text-red-700 border-red-200'
  };

  const canEdit = isOwner || userRole === 'editor' || userRole === 'admin';
  const canStart = userRole !== 'guest' || isPublic;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2">
              {title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {description}
            </p>
          </div>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onEdit}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Tags and badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <Badge 
            className={`text-xs border ${difficultyColors[difficulty]}`}
            variant="outline"
          >
            {difficulty}
          </Badge>
          {!isPublic && (
            <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50">
              Privado
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4 text-primary-500" />
            <span>{questionsCount} preguntas</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-secondary-500" />
            <span>{duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4 text-accent-500" />
            <span>{completions} realizados</span>
          </div>
        </div>

        {/* Author */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Creado por <span className="font-medium text-gray-700">{author}</span>
          </p>
        </div>
      </CardContent>

      <CardFooter className="relative">
        <div className="flex gap-2 w-full">
          {userRole === 'guest' && !isPublic ? (
            <Button className="flex-1" disabled>
              Inicia sesión para acceder
            </Button>
          ) : (
            <>
              <Button
                onClick={onStart}
                className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-300"
                disabled={!canStart}
              >
                <Play className="h-4 w-4 mr-2" />
                {userRole === 'guest' ? 'Vista previa' : 'Iniciar Test'}
              </Button>
              
              {canEdit && (
                <Button
                  variant="outline"
                  onClick={onEdit}
                  className="hover:bg-primary-50 hover:border-primary-300 transition-all duration-300"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestCard;
