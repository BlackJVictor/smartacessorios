import React from 'react';
import { StoreNavCategory, CustomerUser } from '../../types';
import { BrandLogo } from '../BrandLogo';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Lock, 
  Smartphone, 
  Shield, 
  Headphones, 
  Layers,
  Wrench,
  CheckSquare
} from 'lucide-react';

interface StorefrontHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: StoreNavCategory;
  onSelectCategory: (cat: StoreNavCategory) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  currentUser: CustomerUser | null;
  onOpenAuthModal: () => void;
  onOpenUserWorkspace?: () => void;
  onOpenAdminLogin: () => void;
}

export const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  cartCount,
  cartTotal,
  onOpenCart,
  currentUser,
  onOpenAuthModal,
  onOpenUserWorkspace,
  onOpenAdminLogin,
}) => {
  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 py-1.5 px-4 text-center">
        <p className="text-[11px] text-slate-300 flex items-center justify-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>
            ⚡ <strong>SmartAcessórios</strong>: FRETE GRÁTIS para todo o Brasil em compras acima de R$ 299 • <strong>5% OFF</strong> no PIX
          </span>
        </p>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <BrandLogo 
            subtitle="Smartphones • Capinhas • Fones Wi-Fi" 
            badgeText="LOJA OFICIAL" 
          />

          {/* Search Bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por modelo, marca (Samsung, Apple, Sony) ou especificações..."
                className="w-full bg-slate-950 border border-slate-700/80 text-xs text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons: Customer Auth, Cart, Admin Access */}
          <div className="flex items-center space-x-2.5">
            {/* Customer Account Button / Workspace */}
            <button
              onClick={() => {
                if (currentUser && onOpenUserWorkspace) {
                  onOpenUserWorkspace();
                } else {
                  onOpenAuthModal();
                }
              }}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition group"
              title={currentUser ? 'Minha Conta, Notas e Checklists' : 'Cadastro de Cliente e Login'}
            >
              <User className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
              <div className="text-left hidden sm:block">
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {currentUser ? 'Meu Espaço' : 'Entrar ou'}
                </span>
                <span className="text-xs font-bold text-white block leading-tight truncate max-w-[90px]">
                  {currentUser ? currentUser.name.split(' ')[0] : 'Cadastrar'}
                </span>
              </div>
              {currentUser && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="btn-open-cart"
              onClick={onOpenCart}
              className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition active:scale-95 relative"
            >
              <ShoppingBag className="w-4 h-4" />
              <div className="text-left hidden sm:block">
                <span className="text-[10px] text-cyan-200 block leading-tight">Carrinho</span>
                <span className="text-xs font-black block leading-tight">
                  {cartTotal > 0
                    ? cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : 'R$ 0,00'}
                </span>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center border-2 border-slate-900 shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Backoffice Button */}
            <button
              id="btn-admin-access"
              onClick={onOpenAdminLogin}
              className="flex items-center space-x-1.5 px-2.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 text-xs font-medium transition"
              title="Acesso Administrativo Restrito"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">Área Admin</span>
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar modelos e produtos..."
              className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-3 pb-1 border-t border-slate-800/60 mt-3 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-slate-100 text-slate-900 shadow-md font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Todos os Produtos</span>
          </button>

          <button
            onClick={() => onSelectCategory('smartphones')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'smartphones'
                ? 'bg-cyan-600 text-white shadow-md font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-cyan-300 border border-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Smartphones</span>
          </button>

          <button
            onClick={() => onSelectCategory('cases')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'cases'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-emerald-300 border border-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Capinhas & Proteção</span>
          </button>

          <button
            onClick={() => onSelectCategory('headphones')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'headphones'
                ? 'bg-violet-600 text-white shadow-md font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-violet-300 border border-slate-800'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Fones de Ouvido</span>
          </button>

          <button
            id="nav-pill-repairs"
            onClick={() => onSelectCategory('repairs')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'repairs'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md font-bold'
                : 'bg-slate-950 text-slate-300 hover:text-red-400 border border-slate-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-red-400" />
            <span>Assistência Técnica</span>
            <span className="px-1.5 py-0.2 bg-red-950 text-red-300 text-[9px] font-extrabold rounded-md border border-red-800">
              NOVO
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
