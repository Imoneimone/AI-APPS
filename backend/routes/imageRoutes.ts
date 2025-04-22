import express from 'express';
import axios from 'axios';
import config from '../config/config';

const router = express.Router();

// Endpoint for generating images using Hugging Face Stable Diffusion
router.post('/generate', async (req: express.Request, res: express.Response) => {
  try {
    const { prompt, negative_prompt = "", num_inference_steps = 30, guidance_scale = 7.5 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Using Hugging Face Inference API (free tier)
    // Note: This requires a Hugging Face account and token
    // For completely free usage, we're using a public model with limited requests
    const response = await axios({
      url: 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.huggingFaceToken || 'hf_dummy_token'}`,
        'Content-Type': 'application/json'
      },
      data: {
        inputs: prompt,
        parameters: {
          negative_prompt,
          num_inference_steps,
          guidance_scale
        }
      },
      responseType: 'arraybuffer'
    });
    
    // If no token is provided, return a placeholder message
    if (!config.huggingFaceToken) {
      return res.status(200).json({ 
        message: 'Demo mode: No Hugging Face token provided. In a real setup, this would generate an image based on your prompt.',
        prompt,
        demoMode: true
      });
    }
    
    // Convert image buffer to base64
    const imageBase64 = Buffer.from(response.data).toString('base64');
    
    res.status(200).json({
      image: `data:image/jpeg;base64,${imageBase64}`,
      prompt
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    
    // Handle rate limiting or other API errors
    if (error.response && error.response.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate image',
      message: error.message || 'Unknown error',
      // Provide fallback for demo purposes
      demoMode: true,
      prompt: req.body.prompt
    });
  }
});

// Alternative endpoint using Replicate API (has free credits)
router.post('/generate-replicate', async (req: express.Request, res: express.Response) => {
  try {
    const { prompt, negative_prompt = "", num_inference_steps = 30, guidance_scale = 7.5 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // If no token is provided, return a placeholder message
    if (!config.replicateToken) {
      return res.status(200).json({ 
        message: 'Demo mode: No Replicate token provided. In a real setup, this would generate an image based on your prompt.',
        prompt,
        demoMode: true
      });
    }
    
    // Using Replicate API (requires token but offers free credits)
    const response = await axios({
      url: 'https://api.replicate.com/v1/predictions',
      method: 'POST',
      headers: {
        'Authorization': `Token ${config.replicateToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        version: "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
        input: {
          prompt,
          negative_prompt,
          num_inference_steps,
          guidance_scale
        }
      }
    });
    
    // Replicate returns a prediction ID that needs to be polled
    const predictionId = response.data.id;
    
    res.status(202).json({
      message: 'Image generation started',
      predictionId,
      prompt
    });
  } catch (error: any) {
    console.error('Error generating image with Replicate:', error);
    
    res.status(500).json({ 
      error: 'Failed to generate image with Replicate',
      message: error.message || 'Unknown error',
      // Provide fallback for demo purposes
      demoMode: true,
      prompt: req.body.prompt
    });
  }
});

// Endpoint to check status of Replicate prediction
router.get('/replicate-status/:predictionId', async (req: express.Request, res: express.Response) => {
  try {
    const { predictionId } = req.params;
    
    if (!config.replicateToken) {
      return res.status(200).json({ 
        message: 'Demo mode: No Replicate token provided.',
        demoMode: true,
        status: 'succeeded',
        imageUrl: 'https://replicate.delivery/placeholder.jpg' // Placeholder
      });
    }
    
    const response = await axios({
      url: `https://api.replicate.com/v1/predictions/${predictionId}`,
      method: 'GET',
      headers: {
        'Authorization': `Token ${config.replicateToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.status(200).json({
      status: response.data.status,
      imageUrl: response.data.output && response.data.output[0],
      prompt: response.data.input.prompt
    });
  } catch (error: any) {
    console.error('Error checking Replicate prediction status:', error);
    
    res.status(500).json({ 
      error: 'Failed to check prediction status',
      message: error.message || 'Unknown error'
    });
  }
});

export default router;
