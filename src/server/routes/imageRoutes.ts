import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { GeneratedImage } from '../models/GeneratedImage';
import { protect, AuthRequest } from '../middleware/auth';
import { upload } from '../config/cloudinary';

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

// Register routes
router.post('/', protect, upload.single('image'), createImageHandler);
router.get('/', getPublicImagesHandler);
router.get('/my-images', protect, getUserImagesHandler);
router.put('/:id/like', protect, likeImageHandler);
router.delete('/:id', protect, deleteImageHandler);

export default router; 