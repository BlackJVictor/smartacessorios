import React, { useState, useMemo } from 'react';
import { 
  Product, 
  ProductCategory 
} from '../types';
import { 
  Smartphone, 
  Shield, 
  Headphones, 
  Search, 
  Sparkles, 
  FileJson, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Eye, 
  ArrowUpRight,
  Package,
  Layers,
  Zap,
  Tag,
  Image as ImageIcon
} from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product, tab?: 'overview' | 'specs' | 'copy' | 'payload' | 'stock') => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenCopywriterForProduct: (product: Product) => void;
  onOpenPayloadForProduct: (product: Product) => void;
  onQuickStockUpdate: (productId: string, delta: number) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
  onOpenCopywriterForProduct,
  onOpenPayloadForProduct,
  onQuickStockUpdate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'margin'>('name');

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (searchQuery.trim() === '') return true;
        const query = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.ean.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'stock') return a.stock.available - b.stock.available;
        if (sortBy === 'price') return (b.pricing.promotionalPrice || b.pricing.regularPrice) - (a.pricing.promotionalPrice || a.pricing.regularPrice);
        if (sortBy === 'margin') return b.pricing.marginPercent - a.pricing.marginPercent;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Overall catalog stats
  const stats = useMemo(() => {
    const totalItems = products.length;
    const totalPhysicalStock = products.reduce((acc, p) => acc + p.stock.physical, 0);
    const totalInventoryValueCost = products.reduce((acc, p) => acc + p.stock.physical * p.pricing.costPrice, 0);
    const lowStockItems = products.filter((p) => p.stock.available <= p.stock.reorderPoint).length;
    return { totalItems, totalPhysicalStock, totalInventoryValueCost, lowStockItems };
  }, [products]);

  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case 'smartphones':
        return <Smartphone className="w-4 h-4 text-cyan-400" />;
      case 'cases':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'headphones':
        return <Headphones className="w-4 h-4 text-violet-400" />;
    }
  };

  const getCategoryBadge = (category: ProductCategory) => {
    switch (category) {
      case 'smartphones':
        return 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60';
      case 'cases':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60';
      case 'headphones':
        return 'bg-violet-950/70 text-violet-300 border-violet-800/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Total de SKUs Tech</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats.totalItems} <span className="text-xs font-normal text-slate-400">itens ativos</span>
          </div>
          <div className="text-[11px] text-cyan-400/90 mt-1 flex items-center">
            <span>3 nichos de hardware catalogados</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Estoque Físico Total</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats.totalPhysicalStock} <span className="text-xs font-normal text-slate-400">unidades</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            <span>Sincronização WMS Ativa</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Valoração em Estoque (Custo)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats.totalInventoryValueCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Patrimônio ativo em armazém
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Ponto de Reposição</span>
            <AlertTriangle className={`w-4 h-4 ${stats.lowStockItems > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
          </div>
          <div className={`text-2xl font-bold tracking-tight ${stats.lowStockItems > 0 ? 'text-amber-400' : 'text-white'}`}>
            {stats.lowStockItems} <span className="text-xs font-normal text-slate-400">SKUs em alerta</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.lowStockItems > 0 ? 'Requer emissão de Purchase Order' : 'Nenhum risco de ruptura'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
        {/* Category Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            id="filter-cat-all"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Todos ({products.length})
          </button>
          <button
            id="filter-cat-smartphones"
            onClick={() => setSelectedCategory('smartphones')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'smartphones'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Smartphones ({products.filter((p) => p.category === 'smartphones').length})</span>
          </button>
          <button
            id="filter-cat-cases"
            onClick={() => setSelectedCategory('cases')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'cases'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Capinhas ({products.filter((p) => p.category === 'cases').length})</span>
          </button>
          <button
            id="filter-cat-headphones"
            onClick={() => setSelectedCategory('headphones')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'headphones'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-violet-300 hover:bg-slate-800'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Fones ({products.filter((p) => p.category === 'headphones').length})</span>
          </button>
        </div>

        {/* Search input & Sort */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-products-input"
              type="text"
              placeholder="Buscar SKU, EAN, Modelo, Tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <select
            id="sort-products-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-700/80 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="name">Ordenar por Nome</option>
            <option value="stock">Estoque Crítico ⚠️</option>
            <option value="price">Maior Preço R$</option>
            <option value="margin">Maior Margem %</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">Nenhum produto encontrado</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Não encontramos produtos correspondentes ao filtro atual. Tente alterar o termo de busca ou adicione um novo produto.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const isLowStock = product.stock.available <= product.stock.reorderPoint;
            const isCriticalStock = product.stock.available <= product.stock.minSafetyStock;

            const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-cyan-950/20 transition group"
              >
                {/* Product Image Banner */}
                <div 
                  onClick={() => onSelectProduct(product)}
                  className="relative w-full h-44 bg-slate-950 overflow-hidden cursor-pointer border-b border-slate-800/80"
                >
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-600">
                      <ImageIcon className="w-8 h-8 mb-1 opacity-40" />
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Sem Foto</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none" />

                  {/* Top Badges over image */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border backdrop-blur-md flex items-center space-x-1 ${getCategoryBadge(product.category)}`}>
                      {getCategoryIcon(product.category)}
                      <span className="capitalize">{product.category}</span>
                    </span>

                    {/* Stock Alert Badge */}
                    <div className="flex items-center space-x-1">
                      {isCriticalStock ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-800 backdrop-blur-md animate-pulse flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Estoque Crítico</span>
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/90 text-amber-300 border border-amber-800 backdrop-blur-md flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Ponto de Pedido</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-950/80 text-emerald-300 border border-emerald-800/60 backdrop-blur-md flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{product.stock.available} un</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Brand & Year Tag Bottom of Image */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/60 backdrop-blur-sm">
                      {product.brand} • {product.releaseYear}
                    </span>
                    <span className="text-slate-400 flex items-center space-x-1 text-[10px]">
                      <Eye className="w-3 h-3" />
                      <span>Ver Ficha</span>
                    </span>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-4 space-y-3">

                  {/* Title & SKU */}
                  <div>
                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="text-sm font-bold text-white hover:text-cyan-400 cursor-pointer transition line-clamp-2"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1 font-mono text-[11px] text-slate-400">
                      <span>SKU: <strong className="text-slate-300">{product.sku}</strong></span>
                      <span>•</span>
                      <span>EAN: {product.ean}</span>
                    </div>
                  </div>

                  {/* Tech Specs Snippet */}
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 text-xs space-y-1.5">
                    {product.category === 'smartphones' && product.smartphoneSpecs && (
                      <>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">SoC:</span>
                          <span className="font-semibold text-cyan-300 truncate max-w-[190px]">{product.smartphoneSpecs.chipset.split('(')[0]}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">Memória / Câmera:</span>
                          <span className="font-medium text-slate-200">
                            {product.smartphoneSpecs.ramGb}GB / {product.smartphoneSpecs.storageGb}GB • {product.smartphoneSpecs.cameraMainMp}MP
                          </span>
                        </div>
                      </>
                    )}

                    {product.category === 'cases' && product.caseSpecs && (
                      <>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">Material:</span>
                          <span className="font-semibold text-emerald-300 truncate max-w-[190px]">{product.caseSpecs.material.split('(')[0]}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">Drop Test / MagSafe:</span>
                          <span className="font-medium text-slate-200">
                            {product.caseSpecs.dropProtectionRatingMeters}m ({product.caseSpecs.militaryStandard.split(' ')[0]}) • {product.caseSpecs.magSafeCompatible ? 'Sim (N52)' : 'Não'}
                          </span>
                        </div>
                      </>
                    )}

                    {product.category === 'headphones' && product.headphoneSpecs && (
                      <>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">Acústica & Codecs:</span>
                          <span className="font-semibold text-violet-300 truncate max-w-[190px]">{product.headphoneSpecs.codecs.slice(0, 3).join(', ')}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">ANC / Bateria:</span>
                          <span className="font-medium text-slate-200">
                            -{product.headphoneSpecs.ancAttenuationDb}dB • até {product.headphoneSpecs.batteryWithAncHours}h de autonomia
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Stock & Pricing Matrix */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Preço de Venda</span>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-sm font-extrabold text-white">
                          {(product.pricing.promotionalPrice || product.pricing.regularPrice).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                        {product.pricing.promotionalPrice && (
                          <span className="text-[10px] line-through text-slate-500">
                            {product.pricing.regularPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        Margem: {product.pricing.marginPercent.toFixed(1)}%
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Disponível / Físico</span>
                      <div className="text-sm font-bold text-white">
                        <span className={isCriticalStock ? 'text-rose-400' : isLowStock ? 'text-amber-300' : 'text-cyan-300'}>
                          {product.stock.available}
                        </span>
                        <span className="text-xs text-slate-400 font-normal"> / {product.stock.physical} un</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        P. Pedido: {product.stock.reorderPoint} un
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 4).map((tag, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons Toolbar */}
                <div className="bg-slate-950/80 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between gap-1 text-xs">
                  <div className="flex items-center space-x-1">
                    <button
                      id={`btn-view-${product.id}`}
                      onClick={() => onSelectProduct(product)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition"
                      title="Ver Ficha Técnica Completa"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`btn-copy-${product.id}`}
                      onClick={() => onOpenCopywriterForProduct(product)}
                      className="p-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 transition"
                      title="Gerar Copywriting Técnico com IA"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`btn-json-${product.id}`}
                      onClick={() => onOpenPayloadForProduct(product)}
                      className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 transition"
                      title="Ver Payloads JSON de Arquitetura"
                    >
                      <FileJson className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick Stock Controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onQuickStockUpdate(product.id, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                      title="Diminuir estoque (-1)"
                    >
                      -
                    </button>
                    <button
                      onClick={() => onQuickStockUpdate(product.id, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                      title="Aumentar estoque (+1)"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      id={`btn-edit-${product.id}`}
                      onClick={() => onEditProduct(product)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition"
                      title="Editar SKU"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`btn-del-${product.id}`}
                      onClick={() => onDeleteProduct(product.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition"
                      title="Excluir Produto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
