import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const uploadDir = process.env.UPLOAD_DIR || 'server/uploads';
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^\w.-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

export const attachmentsRouter = Router();

attachmentsRouter.post(
  '/tickets/:ticketId/attachments',
  requireAuth,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Archivo requerido' });

    const ticketResult = await query('select id, requester_id from tickets where id = $1', [
      req.params.ticketId
    ]);
    const ticket = ticketResult.rows[0];

    if (!ticket || (req.user.role === 'Usuario' && ticket.requester_id !== req.user.id)) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    const result = await query(
      `insert into ticket_attachments
       (ticket_id, uploaded_by, filename, original_name, mime_type, size_bytes, url)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning *`,
      [
        req.params.ticketId,
        req.user.id,
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        `/uploads/${req.file.filename}`
      ]
    );

    return res.status(201).json(result.rows[0]);
  })
);

attachmentsRouter.get(
  '/attachments/:id/download',
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = await query('select * from ticket_attachments where id = $1', [req.params.id]);
    const attachment = result.rows[0];
    if (!attachment) return res.status(404).json({ error: 'Adjunto no encontrado' });

    return res.download(path.join(process.cwd(), uploadDir, attachment.filename), attachment.original_name);
  })
);
