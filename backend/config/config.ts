require('dotenv').config();

export default {
  port: process.env.PORT || 3001,
  huggingFaceToken: process.env.HUGGING_FACE_TOKEN || '',
  replicateToken: process.env.REPLICATE_TOKEN || '',
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000']
};
