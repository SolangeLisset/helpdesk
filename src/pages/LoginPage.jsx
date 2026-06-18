import { LogIn, Ticket } from 'lucide-react';
import { useState } from 'react';
import { users } from '../mockData.js';
import { createFakeJwt, decodeFakeJwt } from '../utils/auth.js';

export function LoginPage({ onLogin }) {
  const [userId, setUserId] = useState(users[0].id);
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const selectedUser = users.find((user) => user.id === userId);

  function submit(event) {
    event.preventDefault();
    if (password !== 'demo123') {
      setError('Clave demo incorrecta. Usa demo123.');
      return;
    }
    const jwt = createFakeJwt(selectedUser);
    onLogin({ jwt, user: decodeFakeJwt(jwt) });
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="brand login-brand">
          <div className="brand-mark">
            <Ticket size={22} />
          </div>
          <div>
            <strong>Mesa de Ayuda</strong>
            <span>Acceso protegido</span>
          </div>
        </div>
        <div>
          <p className="eyebrow">Portal empresarial</p>
          <h1>Iniciar sesion</h1>
          <p className="login-copy">
            Selecciona un perfil demo para probar permisos, tickets y tablero Kanban.
          </p>
        </div>
        <form className="login-form" onSubmit={submit}>
          <label className="field">
            <span>Usuario</span>
            <select value={userId} onChange={(event) => setUserId(event.target.value)}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Clave</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button full" type="submit">
            <LogIn size={18} />
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
