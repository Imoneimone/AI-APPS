import express from 'express';
import axios from 'axios';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config/config';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.json', '.txt', '.xlsx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV, JSON, TXT, and XLSX files are allowed.') as any);
    }
  }
});

// Basic text analysis endpoint using Hugging Face
router.post('/analyze-text', async (req: express.Request, res: express.Response) => {
  try {
    const { text, task = 'sentiment-analysis' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // If no token is provided, return demo data
    if (!config.huggingFaceToken) {
      // Return mock analysis data for demo purposes
      return res.status(200).json({
        analysis: task === 'sentiment-analysis' 
          ? [{ label: 'POSITIVE', score: 0.9 }] 
          : [{ entity: 'example', type: 'ORG' }],
        demoMode: true,
        message: 'Demo mode: No Hugging Face token provided. This is simulated data.'
      });
    }
    
    // Select appropriate model based on task
    let model = 'distilbert-base-uncased-finetuned-sst-2-english'; // Default sentiment model
    if (task === 'ner') {
      model = 'dbmdz/bert-large-cased-finetuned-conll03-english';
    } else if (task === 'summarization') {
      model = 'facebook/bart-large-cnn';
    }
    
    // Call Hugging Face Inference API
    const response = await axios({
      url: `https://api-inference.huggingface.co/models/${model}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.huggingFaceToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        inputs: text
      }
    });
    
    res.status(200).json({
      analysis: response.data,
      task
    });
  } catch (error: any) {
    console.error('Error analyzing text:', error);
    
    // Handle rate limiting or other API errors
    if (error.response && error.response.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    
    res.status(500).json({ 
      error: 'Failed to analyze text',
      message: error.message || 'Unknown error',
      // Provide fallback for demo purposes
      demoMode: true,
      analysis: [{ label: 'NEUTRAL', score: 0.5 }]
    });
  }
});

// Data file analysis endpoint
router.post('/analyze-file', upload.single('file'), async (req: express.Request, res: express.Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    // In a real implementation, we would process the file based on its type
    // For demo purposes, we'll return mock statistics
    
    // Mock data analysis results
    const analysisResult = {
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: fileExt,
      summary: {
        rowCount: 1000,
        columnCount: 5,
        missingValues: 25,
        duplicateRows: 3
      },
      statistics: {
        numericColumns: ['value1', 'value2'],
        categoricalColumns: ['category1', 'category2'],
        correlations: [
          { column1: 'value1', column2: 'value2', correlation: 0.75 }
        ]
      },
      demoMode: true,
      message: 'This is simulated data analysis. In a production environment, we would process the actual file content.'
    };
    
    // Clean up the uploaded file
    fs.unlinkSync(filePath);
    
    res.status(200).json(analysisResult);
  } catch (error: any) {
    console.error('Error analyzing file:', error);
    
    // Clean up the uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to analyze file',
      message: error.message || 'Unknown error'
    });
  }
});

// Time series forecasting endpoint (demo)
router.post('/forecast', async (req: express.Request, res: express.Response) => {
  try {
    const { data, periods = 5 } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Valid time series data array is required' });
    }
    
    // In a real implementation, we would use a forecasting algorithm
    // For demo purposes, we'll generate mock forecast data
    
    // Get the last value from the input data
    const lastValue = data[data.length - 1];
    
    // Generate mock forecast with slight random variations
    const forecast = Array.from({ length: periods }, (_, i) => {
      const trend = 0.05; // Slight upward trend
      const randomVariation = (Math.random() - 0.5) * 0.1;
      return lastValue * (1 + trend * (i + 1) + randomVariation);
    });
    
    res.status(200).json({
      inputData: data,
      forecast,
      periods,
      demoMode: true,
      message: 'This is a simulated forecast. In a production environment, we would use proper time series forecasting algorithms.'
    });
  } catch (error: any) {
    console.error('Error generating forecast:', error);
    
    res.status(500).json({ 
      error: 'Failed to generate forecast',
      message: error.message || 'Unknown error'
    });
  }
});

export default router;
