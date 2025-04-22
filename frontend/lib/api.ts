"use client";

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Image Generation API
export const generateImage = async (prompt: string, negativePrompt: string = '') => {
  try {
    const response = await axios.post(`${API_URL}/image/generate`, {
      prompt,
      negative_prompt: negativePrompt
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export const generateImageWithReplicate = async (prompt: string, negativePrompt: string = '') => {
  try {
    const response = await axios.post(`${API_URL}/image/generate-replicate`, {
      prompt,
      negative_prompt: negativePrompt
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating image with Replicate:', error);
    throw error;
  }
};

export const checkReplicateStatus = async (predictionId: string) => {
  try {
    const response = await axios.get(`${API_URL}/image/replicate-status/${predictionId}`);
    
    return response.data;
  } catch (error) {
    console.error('Error checking Replicate status:', error);
    throw error;
  }
};

// Data Analysis API
export const analyzeText = async (text: string, task: string = 'sentiment-analysis') => {
  try {
    const response = await axios.post(`${API_URL}/data/analyze-text`, {
      text,
      task
    });
    
    return response.data;
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw error;
  }
};

export const analyzeFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/data/analyze-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error analyzing file:', error);
    throw error;
  }
};

export const generateForecast = async (data: number[], periods: number = 5) => {
  try {
    const response = await axios.post(`${API_URL}/data/forecast`, {
      data,
      periods
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating forecast:', error);
    throw error;
  }
};
