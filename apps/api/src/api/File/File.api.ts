import { Router } from 'express';
import * as Multer from 'multer';
import { requireAuth } from '../../middleware/auth.middleware';
import { uploadFile } from './File.api.handlers';

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = Router();

router.post('/', multer.single('file'), requireAuth, uploadFile);

export default router;
