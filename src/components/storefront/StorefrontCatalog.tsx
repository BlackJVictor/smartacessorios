import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../../types';
import { StorefrontProductCard } from './StorefrontProductCard';
import { 
  Sparkles, 
  Smartphone, 
  Shield, 
  Headphones, 
  SlidersHorizontal, 
  Zap, 
  Truck, 
  RotateCcw, 
  CheckCircle2,
  PackageSearch
} from 'lucide-react';

interface StorefrontCatalogProps {
  products: Product[];
  selectedCategory: ProductCategory | 'all';
  searchQuery: string;
  onViewProductDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const StorefrontCatalog: React.FC<StorefrontCatalogProps> = ({
  products,
  selectedCategory,
  searchQuery,
  onViewProductDetails,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'discount'>('relevance');

  // Filter available brands based on current category
  const availableBrands = useMemo(() => {
    const list = products
      .filter((p) => selectedCategory === 'all' || p.category === selectedCategory)
      .map((p) => p.brand);
    return Array.from(new Set(list));
  }, [products, selectedCategory]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Only active products
        if (product.status !== 'active') return false;

        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
          return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchModel = product.model.toLowerCase().includes(q);
          const matchSku = product.sku.toLowerCase().includes(q);
          const matchPitch = product.copy?.shortPitch?.toLowerCase().includes(q);
          return matchName || matchBrand || matchModel || matchSku || matchPitch;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.pricing.promotionalPrice || a.pricing.regularPrice;
        const priceB = b.pricing.promotionalPrice || b.pricing.regularPrice;

        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'discount') {
          const discA = a.pricing.promotionalPrice ? a.pricing.regularPrice - a.pricing.promotionalPrice : 0;
          const discB = b.pricing.promotionalPrice ? b.pricing.regularPrice - b.pricing.promotionalPrice : 0;
          return discB - discA;
        }
        return 0; // relevance
      });
  }, [products, selectedCategory, selectedBrand, searchQuery, sortBy]);

  return (
    <div className="space-y-8 pb-12">
      {/* Featured Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950 to-indigo-950 border border-cyan-900/40 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SmartAcessórios • Engenharia de Alta Performance & Garantia Nacional</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Smartphones & Acessórios Premium Direto de Fábrica
          </h1>

          <p className="text-xs sm:text-sm text-slate-300">
            Descubra smartphones com processadores de última geração, cases em fibra de aramida militar e fones com cancelamento ativo de ruído Wi-Fi e Bluetooth.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-slate-300">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <Zap className="w-4 h-4" />
              <span>5% OFF no PIX</span>
            </div>
            <div className="flex items-center space-x-1.5 text-cyan-400">
              <Truck className="w-4 h-4" />
              <span>Frete Grátis &gt; R$ 299</span>
            </div>
            <div className="flex items-center space-x-1.5 text-violet-400">
              <RotateCcw className="w-4 h-4" />
              <span>Garantia 12 Meses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        {/* Brand chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Marcas:</span>
          </span>
          <button
            onClick={() => setSelectedBrand('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedBrand === 'all'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todas ({products.length})
          </button>
          {availableBrands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedBrand === b
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-semibold text-slate-400">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="relevance">Destaques da Loja</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
            <option value="discount">Maior Desconto (%)</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
          <PackageSearch className="w-16 h-16 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhum produto encontrado</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Não encontramos itens para o filtro selecionado. Tente alterar a marca, categoria ou termo de busca.
          </p>
          <button
            onClick={() => {
              setSelectedBrand('all');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded-xl transition"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <StorefrontProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewProductDetails}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      )}
    </div>
  );
};
