import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsRoot = path.resolve('uploads'); 
if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsRoot);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

function fileFilter(req: any, file: any, cb: multer.FileFilterCallback) {
  const allowed = ['.png', '.jpg', '.jpeg', '.heic'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only images are allowed'));
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
export default upload;
