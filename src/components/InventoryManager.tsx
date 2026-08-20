import React, { useState } from 'react';
import { 
  Product, 
  ProductCategory 
} from '../types';
import { 
  Warehouse, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Smartphone, 
  Shield, 
  Headphones, 
  Layers, 
  Plus, 
  Minus, 
  ArrowUpRight,
  Truck,
  MapPin,
  Calendar,
  Camera,
  BarChart3,
  Sliders
} from 'lucide-react';
import { VisionInventoryFlow } from './VisionInventoryFlow';

interface InventoryManagerProps {
  products: Product[];
  onUpdateStock: (productId: string, newStock: Partial<Product['stock']>) => void;
  onOpenProductDetail: (product: Product, tab: 'overview' | 'specs' | 'copy' | 'payload' | 'stock') => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  products,
  onUpdateStock,
  onOpenProductDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'wms' | 'vision-ai'>('wms');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [filterAlertsOnly, setFilterAlertsOnly] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<any | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Financial and Logistics Calculations
  const inventoryStats = React.useMemo(() => {
    const totalPhysicalUnits = products.reduce((acc, p) => acc + p.stock.physical, 0);
    const totalReservedUnits = products.reduce((acc, p) => acc + p.stock.reserved, 0);
    const totalAvailableUnits = products.reduce((acc, p) => acc + p.stock.available, 0);
    const totalCostValuation = products.reduce((acc, p) => acc + p.stock.physical * p.pricing.costPrice, 0);
    const totalRetailValuation = products.reduce(
      (acc, p) => acc + p.stock.physical * (p.pricing.promotionalPrice || p.pricing.regularPrice),
      0
    );
    const projectedGrossMargin = totalRetailValuation - totalCostValuation;
    const overallMarginPct = totalRetailValuation > 0 ? (projectedGrossMargin / totalRetailValuation) * 100 : 0;
    const lowStockCount = products.filter((p) => p.stock.available <= p.stock.reorderPoint).length;
    const criticalStockCount = products.filter((p) => p.stock.available <= p.stock.minSafetyStock).length;

    return {
      totalPhysicalUnits,
      totalReservedUnits,
      totalAvailableUnits,
      totalCostValuation,
      totalRetailValuation,
      projectedGrossMargin,
      overallMarginPct,
      lowStockCount,
      criticalStockCount,
    };
  }, [products]);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (filterAlertsOnly && p.stock.available > p.stock.reorderPoint) return false;
    return true;
  });

  const handleRunAiAudit = async () => {
    setIsAuditing(true);
    setAuditError(null);

    try {
      const response = await fetch('/api/ai/inventory-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao processar diagnóstico de estoque');
      }

      setAuditReport(data.analysis);
    } catch (err: any) {
      setAuditError(err.message || 'Erro ao comunicar com a IA');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleAdjustPhysical = (product: Product, delta: number) => {
    const newPhysical = Math.max(0, product.stock.physical + delta);
    const newAvailable = Math.max(0, newPhysical - product.stock.reserved);
    onUpdateStock(product.id, {
      physical: newPhysical,
      available: newAvailable,
    });
  };

  const handleAdjustReserved = (product: Product, delta: number) => {
    const newReserved = Math.max(0, Math.min(product.stock.physical, product.stock.reserved + delta));
    const newAvailable = Math.max(0, product.stock.physical - newReserved);
    onUpdateStock(product.id, {
      reserved: newReserved,
      available: newAvailable,
    });
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('wms')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'wms'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Warehouse className="w-4 h-4" />
          <span>Matriz de Estoque WMS</span>
        </button>

        <button
          id="btn-tab-vision-ai"
          onClick={() => setActiveTab('vision-ai')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition relative ${
            activeTab === 'vision-ai'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Camera className="w-4 h-4 text-cyan-400" />
          <span>Câmera por IA & Gráficos em Tempo Real</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </button>
      </div>

      {/* VIEW 1: Vision AI & Machine Learning Real-Time Flow */}
      {activeTab === 'vision-ai' && (
        <VisionInventoryFlow
          products={products}
          onUpdateStock={onUpdateStock}
        />
      )}

      {/* VIEW 2: Standard WMS Matrix & Safety Stock */}
      {activeTab === 'wms' && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 p-5 rounded-2xl border border-amber-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Warehouse className="w-4 h-4" />
                </span>
                <h2 className="text-lg font-extrabold text-white tracking-tight">
                  Gestão de Estoque Tech, WMS & Ponto de Reposição
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Monitore o estoque físico versus alocações de pedidos, estoque de segurança e ponto de pedido (ROP) para smartphones, capinhas e fones.
              </p>
            </div>

            <button
              id="btn-run-ai-stock-audit"
              onClick={handleRunAiAudit}
              disabled={isAuditing}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-600/20 transition active:scale-95 disabled:opacity-50"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditando Estoque com IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Auditoria de Estoque com IA</span>
                </>
              )}
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Estoque Físico / Saldo</span>
              <div className="text-2xl font-bold text-white mt-1">
                {inventoryStats.totalPhysicalUnits} <span className="text-xs font-normal text-slate-400">unidades</span>
              </div>
              <div className="text-[11px] text-cyan-400 mt-1 flex justify-between">
                <span>Disponíveis: <strong>{inventoryStats.totalAvailableUnits}</strong></span>
                <span>Reservadas: <strong>{inventoryStats.totalReservedUnits}</strong></span>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Valoração em Custo (Imobilizado)</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {inventoryStats.totalCostValuation.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Preço médio de aquisição
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Receita Bruta Projetada</span>
              <div className="text-2xl font-bold text-white mt-1">
                {inventoryStats.totalRetailValuation.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
                Margem Geral: {inventoryStats.overallMarginPct.toFixed(1)}% ({inventoryStats.projectedGrossMargin.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Risco de Ruptura & ROP</span>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                {inventoryStats.lowStockCount} <span className="text-xs font-normal text-slate-400">SKUs em alerta</span>
              </div>
              <div className="text-[11px] text-rose-400 mt-1">
                {inventoryStats.criticalStockCount} em nível crítico de segurança
              </div>
            </div>
          </div>

          {/* AI Audit Report Banner (if generated) */}
          {auditReport && (
            <div className="bg-slate-900 border border-amber-800/80 rounded-2xl p-5 space-y-4 shadow-xl animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">Relatório de Inteligência de Estoque & WMS</h3>
                    <p className="text-xs text-slate-400">Score de Saúde do Estoque: <strong className="text-emerald-400">{auditReport.inventoryHealthScore}/100</strong></p>
                  </div>
                </div>

                <button
                  onClick={() => setAuditReport(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Fechar Relatório
                </button>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {auditReport.summary}
              </p>

              {/* Critical Alerts from AI */}
              {auditReport.criticalAlerts && auditReport.criticalAlerts.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-amber-400 uppercase">Alertas & Recomendações de Compra</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {auditReport.criticalAlerts.map((alert: any, i: number) => (
                      <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{alert.productName}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            alert.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{alert.issue}</p>
                        <p className="text-cyan-300 text-[11px] font-medium pt-1 border-t border-slate-900">
                          ➔ {alert.recommendedAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optimization Tips */}
              {auditReport.turnoverOptimizationTips && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <span className="font-semibold text-emerald-400 uppercase">Dicas de Giro & Cross-Selling Tech</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {auditReport.turnoverOptimizationTips.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {auditError && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-xl">
              {auditError}
            </div>
          )}

          {/* Filter and Table Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-4 p-4">
            {/* Table Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-1.5 overflow-x-auto">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedCategory === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Todos ({products.length})
                </button>
                <button
                  onClick={() => setSelectedCategory('smartphones')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedCategory === 'smartphones' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Smartphones
                </button>
                <button
                  onClick={() => setSelectedCategory('cases')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedCategory === 'cases' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Capinhas
                </button>
                <button
                  onClick={() => setSelectedCategory('headphones')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedCategory === 'headphones' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Fones
                </button>
              </div>

              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterAlertsOnly}
                  onChange={(e) => setFilterAlertsOnly(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span>Exibir apenas itens em alerta de reposição ⚠️</span>
              </label>
            </div>

            {/* Stock Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">SKU & Produto</th>
                    <th className="p-3">Localização WMS</th>
                    <th className="p-3 text-center">Físico</th>
                    <th className="p-3 text-center">Reservado</th>
                    <th className="p-3 text-center">Disponível</th>
                    <th className="p-3 text-center">Pto. Pedido</th>
                    <th className="p-3 text-right">Valoração Custo</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Ajuste Rápido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProducts.map((product) => {
                    const isCritical = product.stock.available <= product.stock.minSafetyStock;
                    const isLow = product.stock.available <= product.stock.reorderPoint;

                    return (
                      <tr key={product.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                                {product.category === 'smartphones' && <Smartphone className="w-4 h-4 text-cyan-400" />}
                                {product.category === 'cases' && <Shield className="w-4 h-4 text-emerald-400" />}
                                {product.category === 'headphones' && <Headphones className="w-4 h-4 text-violet-400" />}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div 
                                onClick={() => onOpenProductDetail(product, 'stock')}
                                className="font-bold text-white hover:text-cyan-400 cursor-pointer line-clamp-1"
                              >
                                {product.name}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">
                                {product.sku} • EAN: {product.ean}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 font-mono text-[11px] text-slate-300">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span className="truncate max-w-[180px]">{product.stock.warehouseLocation}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">Lote: {product.stock.batchNumber}</div>
                        </td>

                        <td className="p-3 text-center font-bold text-white">
                          {product.stock.physical}
                        </td>

                        <td className="p-3 text-center text-amber-400 font-medium">
                          {product.stock.reserved}
                        </td>

                        <td className="p-3 text-center font-bold">
                          <span className={isCritical ? 'text-rose-400' : isLow ? 'text-amber-300' : 'text-cyan-300'}>
                            {product.stock.available}
                          </span>
                        </td>

                        <td className="p-3 text-center font-mono text-slate-400">
                          {product.stock.reorderPoint} un
                        </td>

                        <td className="p-3 text-right font-mono text-slate-200">
                          {(product.stock.physical * product.pricing.costPrice).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>

                        <td className="p-3 text-center">
                          {isCritical ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
                              Crítico
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                              Repor
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                              Normal
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => handleAdjustPhysical(product, -1)}
                              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                              title="Reduzir 1 unidade física"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleAdjustPhysical(product, 1)}
                              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                              title="Adicionar 1 unidade física"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
