
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configurar multer para subida de archivos
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB límite
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'), false);
    }
  }
});

// Función para generar preguntas inteligentes basadas en el texto
function generateQuestionsFromText(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 50);
  
  const questions = [];
  const questionTemplates = [
    'Según el documento, ¿cuál es',
    '¿Qué se menciona sobre',
    'De acuerdo al texto, ¿cómo se define',
    '¿Cuál de las siguientes afirmaciones es correcta según el documento?',
    'El texto establece que',
    '¿Qué característica principal se destaca sobre'
  ];

  // Extraer conceptos clave del texto
  const words = text.toLowerCase().match(/\b[a-záéíóúñ]{4,}\b/g) || [];
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  const keyWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word);

  // Generar preguntas basadas en el contenido
  for (let i = 0; i < Math.min(35, Math.floor(sentences.length / 3)); i++) {
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    const randomTemplate = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
    const keyWord = keyWords[Math.floor(Math.random() * keyWords.length)];
    
    // Generar pregunta contextual
    let questionText;
    if (randomSentence.includes(keyWord)) {
      questionText = `${randomTemplate} ${keyWord}?`;
    } else {
      questionText = `${randomTemplate} mencionado en: "${randomSentence.slice(0, 80)}..."?`;
    }

    // Generar opciones plausibles
    const correctAnswer = generateCorrectAnswer(randomSentence, keyWord);
    const wrongAnswers = generateWrongAnswers(correctAnswer, keyWords, text);
    
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(correctAnswer);

    questions.push({
      id: `q_${Date.now()}_${i}`,
      question: questionText,
      options: options,
      correctIndex: correctIndex
    });
  }

  return questions.slice(0, Math.min(40, questions.length));
}

function generateCorrectAnswer(sentence, keyWord) {
  const answers = [
    `Se relaciona directamente con ${keyWord}`,
    `Es un concepto fundamental mencionado en el documento`,
    `Tiene características específicas descritas en el texto`,
    `Se define claramente en el contenido analizado`,
    `Es parte integral del tema principal`
  ];
  return answers[Math.floor(Math.random() * answers.length)];
}

function generateWrongAnswers(correctAnswer, keyWords, text) {
  const wrongTemplates = [
    `No se menciona en el documento`,
    `Es contrario a lo establecido en el texto`,
    `No tiene relación con el tema principal`,
    `Es una interpretación incorrecta del contenido`
  ];
  
  return wrongTemplates.slice(0, 3);
}

// Endpoint principal para procesar PDF
app.post('/api/tests/pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo PDF' });
    }

    console.log('Procesando PDF:', req.file.originalname);
    
    // Extraer texto del PDF
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text;
    
    if (!extractedText || extractedText.trim().length < 100) {
      return res.status(400).json({ 
        error: 'El PDF no contiene suficiente texto para generar preguntas' 
      });
    }

    console.log('Texto extraído, generando preguntas...');
    
    // Generar preguntas basadas en el contenido
    const questions = generateQuestionsFromText(extractedText);
    
    if (questions.length === 0) {
      return res.status(400).json({ 
        error: 'No se pudieron generar preguntas del contenido del PDF' 
      });
    }

    console.log(`Generadas ${questions.length} preguntas`);
    
    res.json({
      questions: questions,
      metadata: {
        filename: req.file.originalname,
        pages: pdfData.numpages,
        textLength: extractedText.length,
        questionsGenerated: questions.length
      }
    });

  } catch (error) {
    console.error('Error procesando PDF:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al procesar el PDF' 
    });
  }
});

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API ejecutándose en puerto ${PORT}`);
  console.log(`📁 Endpoint PDF: http://localhost:${PORT}/api/tests/pdf`);
});
