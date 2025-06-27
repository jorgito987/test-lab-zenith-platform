
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface PdfUploaderProps {
  onTestGenerated: (questions: Question[]) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onTestGenerated }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Por favor, selecciona un archivo PDF válido');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('El archivo es demasiado grande. Máximo 10MB');
      return;
    }
    setSelectedFile(file);
    toast.success(`Archivo "${file.name}" seleccionado correctamente`);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadPdf = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecciona un archivo PDF');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      toast.info('Procesando PDF... Esto puede tomar unos minutos', {
        duration: 5000,
      });

      console.log('Enviando PDF al servidor...', selectedFile.name);
      
      const response = await fetch('/api/tests/pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error del servidor');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!data.questions || data.questions.length === 0) {
        throw new Error('No se pudieron generar preguntas del PDF');
      }

      onTestGenerated(data.questions);
      
      toast.success(
        `¡Test generado exitosamente! ${data.questions.length} preguntas creadas desde "${selectedFile.name}"`,
        { duration: 5000 }
      );
      
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Error generating test:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al generar el test: ${errorMessage}`, {
        duration: 8000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Generar Test desde PDF
        </CardTitle>
        <p className="text-sm text-gray-600">
          Sube un PDF y generaremos automáticamente un test de 30-40 preguntas
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="pdf-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <FileText className={`h-12 w-12 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-primary-600">Haz clic para subir</span> o arrastra tu PDF aquí
            </div>
            <div className="text-xs text-gray-500">Máximo 10MB • Solo archivos PDF</div>
          </label>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <span className="text-sm font-medium text-green-800">{selectedFile.name}</span>
                <div className="text-xs text-green-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
              className="text-green-700 hover:text-green-800 hover:bg-green-100"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button
          onClick={handleUploadPdf}
          disabled={!selectedFile || isUploading}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Procesando PDF y generando test...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Generar Test desde PDF
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>• El proceso puede tomar 1-3 minutos dependiendo del tamaño del PDF</p>
          <p>• Se generarán automáticamente 30-40 preguntas basadas en el contenido</p>
          <p>• Cada pregunta tendrá 4 opciones con solo una respuesta correcta</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfUploader;
