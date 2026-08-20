import React, { useState } from 'react';
import { Lock, ShieldCheck, User, KeyRound, AlertCircle, X, Eye, EyeOff, ShieldAlert } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Por favor, preencha o usuário e a senha.');
      return;
    }

    if (username.trim().toLowerCase() === 'admin' && password.trim() === 'admin') {
      setError(null);
      onSuccess();
    } else {
      setError('Usuário ou senha incorretos. Acesso restrito a administradores autorizados.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 p-6 border-b border-slate-800 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/20">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight">
            Autenticação Administrativa
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Área restrita e criptografada para gestão de estoque, pedidos e catálogo.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-center space-x-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Identificação de Administrador
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="admin-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Insira seu usuário"
                autoComplete="username"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Chave Secreta de Acesso
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Insira sua senha segura"
                autoComplete="current-password"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Tentativas de acesso não autorizadas são registradas por segurança.</span>
          </div>

          <button
            type="submit"
            id="admin-login-submit-btn"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Autenticar e Acessar Backoffice</span>
          </button>
        </form>
      </div>
    </div>
  );
};
