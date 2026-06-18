import { KeyRound, LogIn, Mail, Ticket, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { api } from '../utils/apiClient.js';

const initialForms = {
  login: { email: '', password: '' },
  register: { name: '', email: '', password: '' },
  forgot: { email: '' },
  reset: { token: '', password: '' }
};

export function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [forms, setForms] = useState(initialForms);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function updateForm(formName, field, value) {
    setForms((current) => ({
      ...current,
      [formName]: {
        ...current[formName],
        [field]: value
      }
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const session = await api.login(forms.login);
        onLogin({ jwt: session.token, user: session.user });
      }

      if (mode === 'register') {
        const session = await api.register(forms.register);
        onLogin({ jwt: session.token, user: session.user });
      }

      if (mode === 'forgot') {
        const response = await api.forgotPassword(forms.forgot);
        setMessage(response.message);
        setMode('reset');
      }

      if (mode === 'reset') {
        const response = await api.resetPassword(forms.reset);
        setMessage(response.message);
        setMode('login');
      }
    } catch (err) {
      setError(err.message || 'No se pudo completar la accion');
    } finally {
      setLoading(false);
    }
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
          <h1>{getTitle(mode)}</h1>
          <p className="login-copy">{getCopy(mode)}</p>
        </div>

        <form className="login-form" onSubmit={submit}>
          {mode === 'login' && (
            <>
              <AuthInput
                label="Email"
                type="email"
                value={forms.login.email}
                onChange={(value) => updateForm('login', 'email', value)}
              />
              <AuthInput
                label="Clave"
                type="password"
                value={forms.login.password}
                onChange={(value) => updateForm('login', 'password', value)}
              />
            </>
          )}

          {mode === 'register' && (
            <>
              <AuthInput
                label="Nombre"
                value={forms.register.name}
                onChange={(value) => updateForm('register', 'name', value)}
              />
              <AuthInput
                label="Email"
                type="email"
                value={forms.register.email}
                onChange={(value) => updateForm('register', 'email', value)}
              />
              <AuthInput
                label="Clave"
                type="password"
                value={forms.register.password}
                onChange={(value) => updateForm('register', 'password', value)}
              />
            </>
          )}

          {mode === 'forgot' && (
            <AuthInput
              label="Email"
              type="email"
              value={forms.forgot.email}
              onChange={(value) => updateForm('forgot', 'email', value)}
            />
          )}

          {mode === 'reset' && (
            <>
              <AuthInput
                label="Token"
                value={forms.reset.token}
                onChange={(value) => updateForm('reset', 'token', value)}
              />
              <AuthInput
                label="Nueva clave"
                type="password"
                value={forms.reset.password}
                onChange={(value) => updateForm('reset', 'password', value)}
              />
            </>
          )}

          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}
          <button className="primary-button full" type="submit" disabled={loading}>
            {getIcon(mode)}
            {loading ? 'Procesando...' : getButtonText(mode)}
          </button>
        </form>

        <div className="auth-links">
          {mode !== 'login' && (
            <button type="button" onClick={() => setMode('login')}>
              Iniciar sesion
            </button>
          )}
          {mode !== 'register' && (
            <button type="button" onClick={() => setMode('register')}>
              Crear cuenta
            </button>
          )}
          {mode !== 'forgot' && (
            <button type="button" onClick={() => setMode('forgot')}>
              Olvide mi clave
            </button>
          )}
          {mode !== 'reset' && (
            <button type="button" onClick={() => setMode('reset')}>
              Tengo un token
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

function AuthInput({ label, onChange, type = 'text', value }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input required type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function getTitle(mode) {
  const titles = {
    login: 'Iniciar sesion',
    register: 'Crear cuenta',
    forgot: 'Recuperar clave',
    reset: 'Restablecer clave'
  };
  return titles[mode];
}

function getCopy(mode) {
  const copies = {
    login: 'Ingresa con tu cuenta para gestionar tickets reales desde la API.',
    register: 'Crea una cuenta de usuario para levantar solicitudes de soporte.',
    forgot: 'Solicita un token de recuperacion. En demo se muestra en logs del backend.',
    reset: 'Ingresa el token de recuperacion y define una nueva clave.'
  };
  return copies[mode];
}

function getButtonText(mode) {
  const labels = {
    login: 'Entrar',
    register: 'Registrarme',
    forgot: 'Enviar token',
    reset: 'Cambiar clave'
  };
  return labels[mode];
}

function getIcon(mode) {
  const icons = {
    login: <LogIn size={18} />,
    register: <UserPlus size={18} />,
    forgot: <Mail size={18} />,
    reset: <KeyRound size={18} />
  };
  return icons[mode];
}
