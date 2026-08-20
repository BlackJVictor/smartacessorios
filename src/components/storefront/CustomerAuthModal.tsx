import React, { useState } from 'react';
import { CustomerUser } from '../../types';
import { User, Mail, Phone, CreditCard, MapPin, X, CheckCircle2, Lock, UserPlus, LogIn } from 'lucide-react';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser | null;
  onLoginSuccess?: (user: CustomerUser) => void;
  onSaveUser?: (user: CustomerUser) => void;
  onLogout?: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onSaveUser,
  onLogout,
}) => {
  const [tab, setTab] = useState<'register' | 'login'>('register');
  
  // Registration fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  
  // Address fields
  const [zipCode, setZipCode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !cpf.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      cpf: cpf.trim(),
      address: {
        zipCode: zipCode || '01310-100',
        street: street || 'Av. Paulista',
        number: number || '1000',
        complement: complement || '',
        neighborhood: neighborhood || 'Bela Vista',
        city: city || 'São Paulo',
        state: state || 'SP',
      },
    };

    if (onLoginSuccess) onLoginSuccess(newUser);
    if (onSaveUser) onSaveUser(newUser);
    onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Informe seu e-mail e senha.');
      return;
    }

    // Demo customer login
    const loggedUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email: email.trim(),
      phone: '(11) 98765-4321',
      cpf: '123.456.789-00',
      address: {
        zipCode: '01310-100',
        street: 'Av. Paulista',
        number: '1000',
        complement: 'Apto 42',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
      },
    };

    if (onLoginSuccess) onLoginSuccess(loggedUser);
    if (onSaveUser) onSaveUser(loggedUser);
    onClose();
  };

  const handleDemoFill = () => {
    setName('Lucas Silva Tech');
    setEmail('lucas.tech@gmail.com');
    setPhone('(11) 99887-6655');
    setCpf('321.654.987-10');
    setZipCode('04571-010');
    setStreet('Av. Engenheiro Luís Carlos Berrini');
    setNumber('1050');
    setComplement('Conjunto 81');
    setNeighborhood('Brooklin');
    setCity('São Paulo');
    setState('SP');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {currentUser ? 'Perfil do Cliente' : tab === 'register' ? 'Criar Conta de Cliente' : 'Acessar Minha Conta'}
              </h3>
              <p className="text-xs text-slate-300">
                Acompanhe seus pedidos, fretes e realize pagamentos seguros.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-2 bg-slate-950 border-b border-slate-800">
          <button
            onClick={() => { setTab('register'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 ${
              tab === 'register' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Nova Conta</span>
          </button>
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 ${
              tab === 'login' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Já Tenho Conta</span>
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs">
            {error}
          </div>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Dados Pessoais
              </span>
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium underline"
              >
                ✨ Preencher Dados Exemplo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Lucas Silva"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">E-mail *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lucas@exemplo.com"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Telefone / WhatsApp *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CPF (para Nota Fiscal) *</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div className="pt-2 pb-1 border-b border-slate-800">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Endereço de Entrega
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CEP</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="01310-100"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Rua / Avenida</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Av. Paulista"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Número</label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="1000"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Complemento</label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Apto 42, Bloco B"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bairro</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Bela Vista"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cidade</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="São Paulo"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">UF</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  maxLength={2}
                  placeholder="SP"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-center font-bold uppercase"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center space-x-2 mt-4"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir Cadastro e Continuar</span>
            </button>
          </form>
        )}

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">E-mail Cadastrado</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center space-x-2 mt-4"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar na Minha Conta</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
