import { useState } from 'react';
import { HelpDeskPage } from './pages/HelpDeskPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { clearStoredSession, getStoredSession, saveStoredSession } from './utils/apiClient.js';

export function App() {
  const [session, setSessionState] = useState(getStoredSession);

  function setSession(nextSession) {
    if (nextSession) {
      saveStoredSession(nextSession);
    } else {
      clearStoredSession();
    }
    setSessionState(nextSession);
  }

  if (!session) {
    return <LoginPage onLogin={setSession} />;
  }

  return <HelpDeskPage session={session} setSession={setSession} />;
}
