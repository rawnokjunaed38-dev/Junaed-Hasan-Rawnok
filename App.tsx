import React, { useState } from 'react';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { Studio } from './components/Studio';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    // Mock user login
    setUser({
      name: 'Google User',
      email: 'user@example.com',
      avatar: 'https://lh3.googleusercontent.com/a/default-user'
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full flex-col bg-slate-900 overflow-hidden">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="flex-1 w-full pt-16">
        <Studio />
      </main>
    </div>
  );
};

export default App;