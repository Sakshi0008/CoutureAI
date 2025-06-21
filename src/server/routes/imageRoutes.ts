import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { GeneratedImage } from '../models/GeneratedImage';
import { protect, AuthRequest } from '../middleware/auth';
import { upload } from '../config/cloudinary';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const router = express.Router();

// Define interface for file upload request
interface FileUploadRequest extends AuthRequest {
  file?: Express.Multer.File;
}

// @desc    Create a new generated image
// @route   POST /api/images
// @access  Private
const createImageHandler: RequestHandler = async (req, res, next) => {
  try {
    const { prompt, fabric, style, occasion, filters, isPublic } = req.body;
    const authReq = req as FileUploadRequest;
    
    const image = await GeneratedImage.create({
      userId: authReq.user?._id,
      imageUrl: authReq.file?.path,
      prompt,
      fabric,
      style,
      occasion,
      filters: JSON.parse(filters || '{}'),
      isPublic: isPublic === 'true',
    });

    res.status(201).json(image);
  } catch (error) {
    console.error('Error creating image:', error);
    res.status(400).json({ message: 'Error creating image' });
  }
};

// @desc    Get all public images
// @route   GET /api/images
// @access  Public
const getPublicImagesHandler: RequestHandler = async (req, res, next) => {
  try {
    const images = await GeneratedImage.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate('userId', 'name avatar');
    
    res.json(images);
  } catch (error) {
    console.error('Error fetching public images:', error);
    res.status(400).json({ message: 'Error fetching images' });
  }
};

// @desc    Get user's images
// @route   GET /api/images/my-images
// @access  Private
const getUserImagesHandler: RequestHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthRequest;
    const images = await GeneratedImage.find({ userId: authReq.user?._id })
      .sort({ createdAt: -1 });
    
    res.json(images);
  } catch (error) {
    console.error('Error fetching user images:', error);
    res.status(400).json({ message: 'Error fetching user images' });
  }
};

// @desc    Like/Unlike an image
// @route   PUT /api/images/:id/like
// @access  Private
const likeImageHandler: RequestHandler = async (req, res, next) => {
  try {
    const image = await GeneratedImage.findById(req.params.id);
    
    if (!image) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }

    // Check if user has already liked the image
    const hasLiked = image.likes > 0;
    
    // Toggle like
    image.likes = hasLiked ? 0 : 1;
    await image.save();

    res.json(image);
  } catch (error) {
    console.error('Error updating like:', error);
    res.status(400).json({ message: 'Error updating like' });
  }
};

// @desc    Delete an image
// @route   DELETE /api/images/:id
// @access  Private
const deleteImageHandler: RequestHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthRequest;
    const image = await GeneratedImage.findById(req.params.id);
    
    if (!image) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }

    // Check if user owns the image
    if (image.userId.toString() !== authReq.user?._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await image.deleteOne();
    res.json({ message: 'Image removed' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(400).json({ message: 'Error deleting image' });
  }
};

// @desc    Generate an image using Stable Diffusion and save it
// @route   POST /api/images/generate
// @access  Private
router.post('/generate', protect, async (req: AuthRequest, res) => {
  try {
    const { prompt, fabric, style, occasion, filters, isPublic } = req.body;
    const userId = req.user!._id;
    // Compose the prompt for the model
    let fullPrompt = prompt;
    if (fabric) fullPrompt += `, fabric: ${fabric}`;
    if (style) fullPrompt += `, style: ${style}`;
    if (occasion) fullPrompt += `, occasion: ${occasion}`;
    if (filters) {
      const f = typeof filters === 'string' ? JSON.parse(filters) : filters;
      if (f.color) fullPrompt += `, color: ${f.color}`;
      if (f.pattern) fullPrompt += `, pattern: ${f.pattern}`;
      if (f.texture) fullPrompt += `, texture: ${f.texture}`;
    }

    // 1. Call Hugging Face Stable Diffusion API
    const hfResponse = await axios.post(
      // 'https://api-inference.huggingface.co/models/sd-legacy/stable-diffusion-v1-5',
      'https://api-inference.huggingface.co/models/stable-diffusion-v1-5/stable-diffusion-v1-5',
      {
        inputs: fullPrompt,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'image/png'
        },
        responseType: 'arraybuffer', // Get image as buffer
      }
    );

    // 2. Upload to Cloudinary from buffer
    const uploadFromBuffer = (buffer: Buffer) => {
      return new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'coutureai' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const imageBuffer = Buffer.from(hfResponse.data as Buffer);
    const uploadResult = await uploadFromBuffer(imageBuffer);

    // 3. Save to DB
    const newImage = await GeneratedImage.create({
      userId,
      imageUrl: uploadResult.secure_url,
      prompt,
      fabric,
      style,
      occasion,
      filters: typeof filters === 'string' ? JSON.parse(filters) : filters,
      isPublic: isPublic === 'true' || isPublic === true,
    });

    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ message: 'Error generating image' });
  }
});

// Register routes
router.post('/', protect, upload.single('image'), createImageHandler);
router.get('/', getPublicImagesHandler);
router.get('/my-images', protect, getUserImagesHandler);
router.put('/:id/like', protect, likeImageHandler);
router.delete('/:id', protect, deleteImageHandler);

export default router; 