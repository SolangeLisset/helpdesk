import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const usersRouter = Router();

usersRouter.get(
  '/',
  requireAuth,
  requireRole('Administrador'),
  asyncHandler(async (_req, res) => {
    const result = await query(
      'select id, name, email, role, created_at from users order by created_at desc'
    );
    return res.json(result.rows);
  })
);

usersRouter.get(
  '/technicians',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const result = await query(
      `select id, name, email, role, created_at
       from users
       where role in ('Tecnico', 'Administrador')
       order by name asc`
    );
    return res.json(result.rows);
  })
);
