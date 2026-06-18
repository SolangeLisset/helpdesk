import { useState } from 'react';
import { HelpDeskPage } from './pages/HelpDeskPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';

export function App() {
  const [session, setSession] = useState(null);

  if (!session) {
    return <LoginPage onLogin={setSession} />;
  }

  return <HelpDeskPage session={session} setSession={setSession} />;
}
