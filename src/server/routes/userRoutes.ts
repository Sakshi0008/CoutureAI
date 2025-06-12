import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { protect } from '../middleware/auth';

// Define interface for authenticated requests
interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

const router = express.Router();

// Register
const registerHandler: RequestHandler = async (req, res, next) => {
  try {
    console.log('Registration attempt:', { email: req.body.email });
    const { fullName, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('Registration failed: User already exists', { email });
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create new user
    user = new User({
      fullName,
      email,
      password
    });

    // Hash password
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();
    console.log('User created successfully:', { userId: user.id, email: user.email });

    // Create JWT token
    const payload = {
      user: {
        _id: user._id
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      message: 'Account created successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    // Log the complete request body (except password)
    console.log('Login request received:', {
      body: {
        ...req.body,
        password: req.body.password ? '[REDACTED]' : undefined
      },
      headers: req.headers,
      method: req.method,
      url: req.url
    });

    const { email, password } = req.body;

    // Log the extracted credentials (with password masked)
    console.log('Extracted login credentials:', {
      email,
      hasPassword: !!password,
      passwordLength: password ? password.length : 0
    });

    // Validate required fields
    if (!email || !password) {
      console.log('Login failed: Missing required fields', {
        hasEmail: !!email,
        hasPassword: !!password,
        emailValue: email || 'missing',
        passwordLength: password ? password.length : 0
      });
      res.status(400).json({ 
        message: 'Email and password are required',
        details: {
          hasEmail: !!email,
          hasPassword: !!password
        }
      });
      return;
    }

    // Check if user exists and select password field
    const user = await User.findOne({ email }).select('+password');
    console.log('User lookup result:', {
      found: !!user,
      email: email
    });

    if (!user) {
      console.log('Login failed: User not found', { email });
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', {
      isMatch,
      email: email
    });

    if (!isMatch) {
      console.log('Login failed: Invalid password', { email });
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    console.log('Login successful:', { userId: user.id, email: user.email });

    // Create JWT token
    const payload = {
      user: {
        _id: user.id
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      message: 'Login successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
const profileHandler: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById((req as AuthRequest).user?._id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register routes
router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.get('/profile', profileHandler);

export default router; 