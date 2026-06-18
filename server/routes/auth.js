import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createResetToken, signAccessToken } from '../utils/tokens.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const role = 'Usuario';

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y password son obligatorios' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      `insert into users (name, email, password_hash, role)
       values ($1, $2, $3, $4)
       returning id, name, email, role, created_at`,
      [name, email.toLowerCase(), passwordHash, role]
    );

    const user = result.rows[0];
    return res.status(201).json({ user, token: signAccessToken(user) });
  })
);

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await query('select * from users where email = $1', [email?.toLowerCase()]);
    const user = result.rows[0];
    const validPassword = user ? await bcrypt.compare(password ?? '', user.password_hash) : false;

    if (!user || !validPassword) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    return res.json({
      user: sanitizeUser(user),
      token: signAccessToken(user)
    });
  })
);

authRouter.post(
  '/forgot-password',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const userResult = await query('select id, email from users where email = $1', [email?.toLowerCase()]);
    const user = userResult.rows[0];

    if (user) {
      const token = createResetToken();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
      await query(
        `insert into password_reset_tokens (user_id, token, expires_at)
         values ($1, $2, $3)`,
        [user.id, token, expiresAt]
      );
      console.log(`Password reset token for ${user.email}: ${token}`);
    }

    return res.json({ message: 'Si el email existe, se genero un enlace de recuperacion' });
  })
);

authRouter.post(
  '/reset-password',
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const resetResult = await query(
      `select prt.id, prt.user_id
       from password_reset_tokens prt
       where prt.token = $1 and prt.used_at is null and prt.expires_at > now()`,
      [token]
    );
    const reset = resetResult.rows[0];

    if (!reset) {
      return res.status(400).json({ error: 'Token invalido o expirado' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await query('update users set password_hash = $1 where id = $2', [passwordHash, reset.user_id]);
    await query('update password_reset_tokens set used_at = now() where id = $1', [reset.id]);

    return res.json({ message: 'Password actualizado' });
  })
);

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at
  };
}
