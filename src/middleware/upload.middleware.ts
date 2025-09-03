import multer from 'multer';
import { AppError } from '../utils/errors';

// Configure multer for file uploads
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/svg+xml',
    'application/pdf'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPEG, PNG, SVG, and PDF files are allowed', 400));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only allow single file upload
  }
});

// Middleware for single file upload
export const uploadSingle = (fieldName: string = 'file') => {
  return upload.single(fieldName);
};

// Middleware for multiple file uploads
export const uploadMultiple = (fieldName: string = 'files', maxCount: number = 5) => {
  return upload.array(fieldName, maxCount);
};

// Asset-specific upload middleware
export const uploadAsset = (req: any, res: any, next: any) => {
  const upload = multer({
    storage,
    fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      const { type } = req.body;
      
      if (!type) {
        return cb(new AppError('Asset type is required', 400));
      }

      const allowedMimeTypesByType: Record<string, string[]> = {
        logo: ['image/png', 'image/jpeg', 'image/svg+xml'],
        signature: ['image/png', 'image/jpeg', 'image/svg+xml'],
        background: ['image/png', 'image/jpeg'],
        letterhead: ['image/png', 'image/jpeg', 'application/pdf']
      };

      const allowedForType = allowedMimeTypesByType[type];
      if (!allowedForType) {
        return cb(new AppError('Invalid asset type', 400));
      }

      if (allowedForType.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new AppError(`Invalid file type for ${type}. Allowed types: ${allowedForType.join(', ')}`, 400));
      }
    },
    limits: {
      fileSize: getFileSizeLimit(req.body.type),
      files: 1
    }
  }).single('file');

  upload(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File too large', 400));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new AppError('Too many files', 400));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new AppError('Unexpected file field', 400));
        }
      }
      return next(err);
    }
    next();
  });
};

// Get file size limit based on asset type
function getFileSizeLimit(type: string): number {
  const limits: Record<string, number> = {
    logo: 2 * 1024 * 1024, // 2MB for logos
    signature: 1 * 1024 * 1024, // 1MB for signatures
    background: 5 * 1024 * 1024, // 5MB for backgrounds
    letterhead: 10 * 1024 * 1024 // 10MB for letterheads
  };

  return limits[type] || 2 * 1024 * 1024; // Default 2MB
}

// Error handling middleware for multer
export const handleMulterError = (err: any, _req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large',
        error: 'LIMIT_FILE_SIZE'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files',
        error: 'LIMIT_FILE_COUNT'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field',
        error: 'LIMIT_UNEXPECTED_FILE'
      });
    }
  }
  next(err);
};