const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'notes',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `pdf-${timestamp}`;
    },
    format: 'pdf'
  }
});

exports.upload = multer({ storage: storage });
