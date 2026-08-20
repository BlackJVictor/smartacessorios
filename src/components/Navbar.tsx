import React from 'react';
import { BrandLogo } from './BrandLogo';
import { 
  Boxes, 
  Sparkles, 
  Warehouse, 
  Plus, 
  Download, 
  Store,
  LogOut,
  Wrench
} from 'lucide-react';

export type StudioTab = 'catalog' | 'copywriter' | 'inventory' | 'repairs' | 'payloads' | 'copilot';

interface NavbarProps {
  activeTab: StudioTab;
  setActiveTab?: (tab: StudioTab) => void;
  onSelectTab?: (tab: StudioTab) => void;
  onOpenNewProduct?: () => void;
  onOpenNewProductModal?: () => void;
  onOpenExport?: () => void;
  onSwitchToStorefront?: () => void;
  onLogoutAdmin?: () => void;
  productCount?: number;
  totalProductsCount?: number;
  lowStockCount?: number;
  pendingRepairsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectTab,
  onOpenNewProduct,
  onOpenNewProductModal,
  onOpenExport,
  onSwitchToStorefront,
  onLogoutAdmin,
  productCount,
  totalProductsCount,
  lowStockCount = 0,
  pendingRepairsCount = 0,
}) => {
  const handleTabClick = (tab: StudioTab) => {
    if (typeof setActiveTab === 'function') {
      setActiveTab(tab);
    } else if (typeof onSelectTab === 'function') {
      onSelectTab(tab);
    }
  };

  const handleNewProduct = () => {
    if (typeof onOpenNewProductModal === 'function') {
      onOpenNewProductModal();
    } else if (typeof onOpenNewProduct === 'function') {
      onOpenNewProduct();
    }
  };

  const totalCount = totalProductsCount ?? productCount ?? 0;
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <BrandLogo 
            subtitle="Gestão de Estoque WMS & Catálogo" 
            badgeText="ADMIN PRO" 
          />

          {/* Navigation Tabs (Admin visible: Catalog, Copywriter, Inventory, Repairs) */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              id="nav-tab-catalog"
              onClick={() => handleTabClick('catalog')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>Catálogo Tech</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'catalog' ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {totalCount}
              </span>
            </button>

            <button
              id="nav-tab-copywriter"
              onClick={() => handleTabClick('copywriter')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'copywriter'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Copywriting IA</span>
            </button>

            <button
              id="nav-tab-inventory"
              onClick={() => handleTabClick('inventory')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'inventory'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Warehouse className="w-4 h-4 text-amber-400" />
              <span>Estoque & WMS</span>
              {lowStockCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {lowStockCount} alertas
                </span>
              )}
            </button>

            <button
              id="nav-tab-repairs"
              onClick={() => handleTabClick('repairs')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'repairs'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Wrench className="w-4 h-4 text-red-400" />
              <span>Assistência & Reparos</span>
              {pendingRepairsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-bold animate-pulse">
                  {pendingRepairsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Actions & Storefront Switch */}
          <div className="flex items-center space-x-2">
            {/* Go to storefront button */}
            {onSwitchToStorefront && (
              <button
                id="btn-switch-storefront"
                onClick={onSwitchToStorefront}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold border border-slate-700 transition"
                title="Acessar visão do cliente / Loja Virtual"
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ver Loja</span>
              </button>
            )}

            {onOpenExport && (
              <button
                id="btn-export-catalog"
                onClick={onOpenExport}
                className="hidden lg:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                title="Exportar dados do catálogo em JSON"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Exportar</span>
              </button>
            )}

            <button
              id="btn-add-product"
              onClick={handleNewProduct}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </button>

            {/* Logout Admin */}
            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 transition"
                title="Sair do Modo Administrador"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 space-x-1 border-t border-slate-800">
          <button
            onClick={() => handleTabClick('catalog')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'catalog' ? 'bg-cyan-600 text-white' : 'text-slate-400'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Catálogo</span>
          </button>
          <button
            onClick={() => handleTabClick('copywriter')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'copywriter' ? 'bg-cyan-600 text-white' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Copywriting</span>
          </button>
          <button
            onClick={() => handleTabClick('inventory')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'inventory' ? 'bg-cyan-600 text-white' : 'text-slate-400'
            }`}
          >
            <Warehouse className="w-3.5 h-3.5" />
            <span>Estoque</span>
          </button>
        </div>
      </div>
    </header>
  );
};
