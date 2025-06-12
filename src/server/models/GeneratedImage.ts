import mongoose from 'mongoose';

export interface IGeneratedImage extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  prompt: string;
  fabric: string;
  style: string;
  occasion: string;
  filters: {
    color?: string;
    pattern?: string;
    texture?: string;
  };
  isPublic: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const generatedImageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  fabric: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    required: true,
  },
  occasion: {
    type: String,
    required: true,
  },
  filters: {
    color: String,
    pattern: String,
    texture: String,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for faster queries
generatedImageSchema.index({ userId: 1, createdAt: -1 });
generatedImageSchema.index({ isPublic: 1, createdAt: -1 });

export const GeneratedImage = mongoose.model<IGeneratedImage>('GeneratedImage', generatedImageSchema); 