import React from 'react';
import { LogOut } from 'lucide-react';
import { User } from '../types';
import { Button } from './Button';
import { Logo } from './Logo';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md safe-top">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-auto" />
          <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
            Inteli 59
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 p-[2px]">
               <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full bg-slate-900 object-cover" />
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="p-2 text-slate-400 hover:text-white">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};