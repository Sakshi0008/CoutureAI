import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const router = express.Router();




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_IMAGE_PATH = path.join(__dirname, 'test.png');

/**
 * @route GET /api/images/test-upload
 * @description Test Cloudinary upload with a local test image
 * @access Public (for testing only)
 */
router.get('/test-upload', async (req, res) => {
  try {
    // Verify test image exists
    if (!fs.existsSync(TEST_IMAGE_PATH)) {
      return res.status(400).json({
        success: false,
        message: `Test image not found at ${TEST_IMAGE_PATH}. Please place a test image named 'test-image.jpg' in the routes directory.`
      });
    }

    console.log('Attempting to upload test image...');
    
    // Upload the test image
    const result = await cloudinary.uploader.upload(TEST_IMAGE_PATH, {
      folder: 'coutureai-test',
      resource_type: 'image'
    });

    console.log('Upload successful:', result.secure_url);

    res.json({
      success: true,
      message: 'Test upload successful',
      imageUrl: result.secure_url,
      details: {
        public_id: result.public_id,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height
      }
    });

  } catch (error) {
    console.error('Test upload failed:', error);
    res.status(500).json({
      success: false,
      message: 'Test upload failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      // Only show partial Cloudinary config for security
      config: {
        cloud_name: cloudinary.config().cloud_name,
        api_key: cloudinary.config().api_key ? 'configured' : 'missing',
        api_secret: cloudinary.config().api_secret ? 'configured' : 'missing'
      }
    });
  }
});

export default router;