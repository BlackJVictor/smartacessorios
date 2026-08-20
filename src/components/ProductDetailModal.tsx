import React, { useState } from 'react';
import { 
  Product, 
  PayloadSchemaType 
} from '../types';
import { generateProductPayload } from '../utils/payloadGenerator';
import { MarkdownView } from './MarkdownView';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Smartphone, 
  Shield, 
  Headphones, 
  FileJson, 
  Layers, 
  TrendingUp, 
  Warehouse, 
  Package, 
  Search, 
  ExternalLink,
  Code2,
  Box,
  Send,
  AlertCircle,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  initialTab?: 'overview' | 'specs' | 'copy' | 'payload' | 'stock';
  onUpdateProductCopy?: (productId: string, newCopy: any) => void;
  onOpenCopywriterTab?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  initialTab = 'overview',
  onOpenCopywriterTab,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'copy' | 'payload' | 'stock'>(initialTab);
  const [selectedSchema, setSelectedSchema] = useState<PayloadSchemaType>('rest_catalog_ingest');
  const [copied, setCopied] = useState(false);
  const [testResponse, setTestResponse] = useState<any | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[selectedImageIndex] || images[0] || null;

  const currentPayload = generateProductPayload(product, selectedSchema);
  const payloadString = JSON.stringify(currentPayload, null, 2);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPayload = () => {
    const blob = new Blob([payloadString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.sku.toLowerCase()}_${selectedSchema}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSimulateApiDispatch = () => {
    setIsTestingApi(true);
    setTestResponse(null);
    setTimeout(() => {
      setIsTestingApi(false);
      setTestResponse({
        http_status: 201,
        status_message: 'CREATED / SYNCED',
        gateway: 'KONG_API_GATEWAY_V3',
        schema_validated: true,
        latency_ms: 38,
        record_id: `rec_${Date.now()}`,
        timestamp: new Date().toISOString(),
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="modal-product-detail"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
              {product.category === 'smartphones' && <Smartphone className="w-5 h-5 text-cyan-400" />}
              {product.category === 'cases' && <Shield className="w-5 h-5 text-emerald-400" />}
              {product.category === 'headphones' && <Headphones className="w-5 h-5 text-violet-400" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{product.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {product.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                SKU: <span className="text-cyan-300 font-semibold">{product.sku}</span> • EAN: {product.ean} • Marca: {product.brand}
              </p>
            </div>
          </div>

          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 border-b border-slate-800 bg-slate-950 px-4 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-cyan-500 text-cyan-400 bg-slate-900/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 Visão Geral & Preço
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-cyan-500 text-cyan-400 bg-slate-900/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚙️ Especificações de Engenharia
          </button>
          <button
            onClick={() => setActiveTab('copy')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'copy'
                ? 'border-cyan-500 text-cyan-400 bg-slate-900/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ✍️ Copywriting & Markdown
          </button>
          <button
            onClick={() => setActiveTab('payload')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'payload'
                ? 'border-cyan-500 text-cyan-400 bg-slate-900/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🧩 Payloads JSON & Arquitetura
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'stock'
                ? 'border-cyan-500 text-cyan-400 bg-slate-900/60 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📦 Estoque & WMS
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Product Gallery Showcase */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  {/* Main Large Image */}
                  <div className="md:col-span-8 relative bg-slate-950/80 flex items-center justify-center min-h-[300px] sm:min-h-[380px] p-6 border-b md:border-b-0 md:border-r border-slate-800">
                    {currentImage ? (
                      <div className="relative group/img max-w-full max-h-[360px] flex items-center justify-center">
                        <img
                          src={currentImage}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="max-h-[340px] w-auto object-contain rounded-xl shadow-2xl drop-shadow-lg transition-transform duration-300 group-hover/img:scale-[1.02]"
                        />
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-500">
                        <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-30" />
                        <p className="text-xs font-mono">Nenhuma imagem cadastrada para este produto</p>
                      </div>
                    )}

                    {/* Navigation Arrows if multiple images */}
                    {images.length > 1 && (
                      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
                        <button
                          onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                          className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-cyan-600 border border-slate-700/80 backdrop-blur-md pointer-events-auto transition shadow-lg"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                          className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-cyan-600 border border-slate-700/80 backdrop-blur-md pointer-events-auto transition shadow-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Image Counter & Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-slate-900/90 text-cyan-300 border border-slate-700/80 backdrop-blur-md">
                        Foto {images.length > 0 ? selectedImageIndex + 1 : 0} de {images.length}
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-slate-900/90 text-slate-400 border border-slate-700/80 backdrop-blur-md">
                        Studio 4K Shot
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail List & Image Info Side */}
                  <div className="md:col-span-4 p-4 flex flex-col justify-between space-y-4 bg-slate-900/40">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-white mb-3">
                        <span className="flex items-center space-x-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Galeria de Mídia do Produto</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{images.length} fotos</span>
                      </div>

                      {/* Thumbnails */}
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`relative aspect-square rounded-lg overflow-hidden border transition-all ${
                              selectedImageIndex === idx
                                ? 'border-cyan-400 ring-2 ring-cyan-500/30 scale-95'
                                : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Thumbnail ${idx + 1}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            {selectedImageIndex === idx && (
                              <div className="absolute inset-0 bg-cyan-500/10 border-2 border-cyan-400 rounded-lg pointer-events-none" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Specs Callout */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Modelo:</span>
                        <span className="font-mono text-cyan-300">{product.model}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Acabamento:</span>
                        <span className="text-white font-medium">{product.color}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Dimensões:</span>
                        <span className="text-slate-300 font-mono text-[11px]">
                          {product.smartphoneSpecs?.dimensionsMm || product.caseSpecs?.thicknessMm ? `${product.caseSpecs?.thicknessMm}mm` : 'Padrão'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Margins Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Preço de Custo</span>
                  <div className="text-lg font-bold text-white mt-1">
                    {product.pricing.costPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <span className="text-[11px] text-slate-500">Custo de aquisição CIF</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Preço Regular (De)</span>
                  <div className="text-lg font-bold text-slate-200 mt-1">
                    {product.pricing.regularPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <span className="text-[11px] text-slate-500">Tabela de catálogo</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Preço Promocional (Por)</span>
                  <div className="text-lg font-bold text-cyan-400 mt-1">
                    {(product.pricing.promotionalPrice || product.pricing.regularPrice).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </div>
                  <span className="text-[11px] text-cyan-500/80 font-medium">Preço à vista / PIX</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Margem de Contribuição</span>
                  <div className="text-lg font-bold text-emerald-400 mt-1">
                    {product.pricing.marginPercent.toFixed(1)}%
                  </div>
                  <span className="text-[11px] text-emerald-500/80 font-medium">Margem líquida estimada</span>
                </div>
              </div>

              {/* Pitch and Highlights */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Pitch Técnico de Posicionamento
                </span>
                <p className="text-sm text-slate-200 leading-relaxed italic">
                  "{product.copy.shortPitch}"
                </p>
                <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                  {product.tags.map((t, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-semibold text-white">Identificação & SKU</h4>
                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex justify-between"><span className="text-slate-400">Modelo:</span> <span className="font-mono text-white">{product.model}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Cor / Acabamento:</span> <span>{product.color}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Ano Lançamento:</span> <span>{product.releaseYear}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Status no ERP:</span> <span className="text-emerald-400 uppercase font-semibold">{product.status}</span></div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-semibold text-white">Logística & Armazenamento</h4>
                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex justify-between"><span className="text-slate-400">Estoque Disponível:</span> <span className="font-bold text-cyan-400">{product.stock.available} un</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Estoque Físico:</span> <span>{product.stock.physical} un</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Localização Física:</span> <span className="font-mono text-slate-200">{product.stock.warehouseLocation}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Lote Fabricação:</span> <span className="font-mono text-slate-200">{product.stock.batchNumber}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Matriz de Especificações de Engenharia</span>
                  <span className="text-xs font-normal text-slate-400">({product.category.toUpperCase()})</span>
                </h3>
              </div>

              {/* Smartphone Specs */}
              {product.category === 'smartphones' && product.smartphoneSpecs && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-cyan-400 border-b border-slate-800/80 pb-1">Processamento & Silício</h4>
                    <div className="space-y-1.5 text-slate-300">
                      <div className="flex justify-between"><span className="text-slate-400">Chipset SoC:</span> <span className="font-semibold text-white text-right max-w-[200px]">{product.smartphoneSpecs.chipset}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">GPU:</span> <span className="text-right text-white">{product.smartphoneSpecs.gpu}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">RAM:</span> <span className="font-mono text-white">{product.smartphoneSpecs.ramGb} GB ({product.smartphoneSpecs.ramType})</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Armazenamento:</span> <span className="font-mono text-white">{product.smartphoneSpecs.storageGb} GB ({product.smartphoneSpecs.storageType})</span></div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-cyan-400 border-b border-slate-800/80 pb-1">Display & Óptica</h4>
                    <div className="space-y-1.5 text-slate-300">
                      <div className="flex justify-between"><span className="text-slate-400">Painel:</span> <span className="text-right text-white">{product.smartphoneSpecs.displayType}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Tamanho / Hz:</span> <span className="font-mono text-white">{product.smartphoneSpecs.displaySizeInches}" • {product.smartphoneSpecs.refreshRateHz} Hz</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Resolução:</span> <span className="font-mono text-white">{product.smartphoneSpecs.resolution}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Brilho Pico:</span> <span className="font-semibold text-amber-400">{product.smartphoneSpecs.peakBrightnessNits} nits</span></div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-cyan-400 border-b border-slate-800/80 pb-1">Conjunto de Câmeras</h4>
                    <div className="space-y-1.5 text-slate-300">
                      <div className="flex justify-between"><span className="text-slate-400">Câmera Principal:</span> <span className="font-bold text-white">{product.smartphoneSpecs.cameraMainMp} MP ({product.smartphoneSpecs.cameraMainSensor})</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Telefoto / Zoom:</span> <span className="text-right text-white">{product.smartphoneSpecs.opticalZoom}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Ultra-Wide:</span> <span>{product.smartphoneSpecs.cameraUltraWideMp} MP</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Gravação Vídeo:</span> <span className="font-mono text-cyan-300 text-right">{product.smartphoneSpecs.videoRecordingMax}</span></div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-cyan-400 border-b border-slate-800/80 pb-1">Bateria, Rede & Chassi</h4>
                    <div className="space-y-1.5 text-slate-300">
                      <div className="flex justify-between"><span className="text-slate-400">Bateria / Carga:</span> <span className="font-bold text-white">{product.smartphoneSpecs.batteryMah} mAh • {product.smartphoneSpecs.chargingSpeedWatts}W</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Conectividade:</span> <span className="font-mono text-white">{product.smartphoneSpecs.wifiGen} • BT {product.smartphoneSpecs.bluetoothVer}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Proteção IP:</span> <span className="font-mono text-emerald-400">{product.smartphoneSpecs.ipRating}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Dimensões / Peso:</span> <span className="font-mono text-white">{product.smartphoneSpecs.dimensionsMm} • {product.smartphoneSpecs.weightGrams}g</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Case Specs */}
              {product.category === 'cases' && product.caseSpecs && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-emerald-400 border-b border-slate-800/80 pb-1">Engenharia de Materiais</h4>
                    <div className="space-y-1.5 text-slate-300">
                      <div className="flex justify-between"><span className="text-slate-400">Composição:</span> <span className="font-semibold text-white text-right max-w-[220px]">{product.caseSpecs.material}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Espessura de Parede:</span> <span className="font-mono text-white">{product.caseSpecs.thicknessMm} mm</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Forro Interno:</span> <span className="text-right text-white">{product.caseSpecs.innerLining}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Peso Líquido:</span> <span className="font-mono text-white">{product.caseSpecs.weightGrams} g</span></div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-emerald-400 border-b border-slate-800/80 pb-1">Proteção contra Quedas & MagSafe</h4>
                    <div className="space-y-1.5 text-slate-300">
                      <div className="flex justify-between"><span className="text-slate-400">Classificação Drop-Test:</span> <span className="font-bold text-amber-400">{product.caseSpecs.dropProtectionRatingMeters} metros</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Padrão Militar:</span> <span className="font-mono text-white">{product.caseSpecs.militaryStandard}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">MagSafe / Ímãs:</span> <span className="font-bold text-emerald-400">{product.caseSpecs.magSafeCompatible ? `Sim (${product.caseSpecs.magnetStrengthGauss} Gauss)` : 'Não'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Bordas Elevadas (Lentes):</span> <span className="font-mono text-white">+{product.caseSpecs.raisedLipCameraMm} mm</span></div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-emerald-400 border-b border-slate-800/80 pb-1">Modelos Compatíveis & Recursos Exclusivos</h4>
                    <div className="text-slate-300 space-y-2">
                      <div>
                        <span className="text-slate-400">Dispositivos Homologados:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {product.caseSpecs.compatibleModels.map((m, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Recursos Especiais:</span>
                        <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 mt-1">
                          {product.caseSpecs.specialFeatures.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Headphone Specs */}
              {product.category === 'headphones' && product.headphoneSpecs && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-violet-400 border-b border-slate-800/80 pb-1">Acústica & Drivers</h4>
                    <div className="space-y-1.5 text-slate-300">
                      <div className="flex justify-between"><span className="text-slate-400">Formato / Design:</span> <span className="font-semibold text-white uppercase">{product.headphoneSpecs.formFactor} ({product.headphoneSpecs.acousticDesign})</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Tamanho Driver:</span> <span className="font-mono text-white">{product.headphoneSpecs.driverSizeMm} mm</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Tipo Transdutor:</span> <span className="text-right text-white max-w-[200px]">{product.headphoneSpecs.driverType}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Resposta Frequência:</span> <span className="font-mono text-cyan-300">{product.headphoneSpecs.frequencyResponse}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Impedância / Sensibilidade:</span> <span className="font-mono text-white">{product.headphoneSpecs.impedanceOhms} Ω • {product.headphoneSpecs.sensitivityDb} dB</span></div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-violet-400 border-b border-slate-800/80 pb-1">Cancelamento de Ruído (ANC) & DSP</h4>
                    <div className="space-y-1.5 text-slate-300">
                      <div className="flex justify-between"><span className="text-slate-400">Tipo de ANC:</span> <span className="font-bold text-violet-300 uppercase">{product.headphoneSpecs.ancType}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Atenuação Máxima:</span> <span className="font-bold text-emerald-400">-{product.headphoneSpecs.ancAttenuationDb} dB</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Modo Transparência:</span> <span>{product.headphoneSpecs.transparencyMode ? 'Sim (Ambiente Dinâmico)' : 'Não'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Microfones & IA:</span> <span className="font-mono text-white">{product.headphoneSpecs.microphonesCount} Microfones</span></div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-violet-400 border-b border-slate-800/80 pb-1">Codecs de Áudio & Conectividade</h4>
                    <div className="space-y-1.5 text-slate-300">
                      <div>
                        <span className="text-slate-400 block mb-1">Codecs Bluetooth Suportados:</span>
                        <div className="flex flex-wrap gap-1">
                          {product.headphoneSpecs.codecs.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-violet-950/80 text-violet-300 border border-violet-800/60 font-mono text-[11px]">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between pt-1"><span className="text-slate-400">Versão Bluetooth:</span> <span className="font-mono text-white">{product.headphoneSpecs.bluetoothVer}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Conexão Multiponto:</span> <span>{product.headphoneSpecs.multipointSupport ? 'Sim (2 dispositivos)' : 'Não'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Latência Gaming:</span> <span className="font-mono text-cyan-300">{product.headphoneSpecs.latencyMs} ms</span></div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-violet-400 border-b border-slate-800/80 pb-1">Bateria & Recarga</h4>
                    <div className="space-y-1.5 text-slate-300">
                      <div className="flex justify-between"><span className="text-slate-400">Autonomia com ANC:</span> <span className="font-bold text-white">{product.headphoneSpecs.batteryWithAncHours} horas</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Total com Estojo:</span> <span className="font-bold text-cyan-400">{product.headphoneSpecs.batteryTotalWithCaseHours} horas</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Carga Rápida:</span> <span className="text-right text-emerald-400">{product.headphoneSpecs.fastChargeSpecs}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Resistência IP:</span> <span className="font-mono text-white">{product.headphoneSpecs.ipRating}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COPYWRITING & MARKDOWN */}
          {activeTab === 'copy' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Copywriting Técnico de Alta Conversão</h3>
                  <p className="text-xs text-slate-400">Otimizado para Marketplaces, SEO e Landing Pages</p>
                </div>
                {onOpenCopywriterTab && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCopywriterTab(product);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-semibold border border-cyan-800/80 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Personalizar no Studio de Copy</span>
                  </button>
                )}
              </div>

              {/* Title & SEO Meta */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase">Título Otimizado para Marketplace</span>
                  <div className="text-sm font-bold text-white mt-0.5 bg-slate-900 p-2.5 rounded-lg border border-slate-800 select-all font-mono">
                    {product.copy.marketplaceTitle}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase">SEO Meta Title (Google SERP)</span>
                    <p className="text-xs text-slate-200 bg-slate-900 p-2 rounded-lg border border-slate-800 mt-0.5">
                      {product.copy.seoMetaTitle}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase">SEO Meta Description</span>
                    <p className="text-xs text-slate-200 bg-slate-900 p-2 rounded-lg border border-slate-800 mt-0.5">
                      {product.copy.seoMetaDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bullet points */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-cyan-400 uppercase">Destaques Técnicos de Engenharia (Bullets)</span>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {product.copy.keyBenefitsBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-cyan-400 mt-0.5 font-bold">✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Full Markdown Datasheet */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-semibold text-white uppercase">Descrição Técnica Completa em Markdown</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(product.copy.technicalMarkdownDescription);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar Markdown'}</span>
                  </button>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                  <MarkdownView content={product.copy.technicalMarkdownDescription} />
                </div>
              </div>

              {/* Box contents & Target Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-semibold text-white uppercase">Conteúdo da Embalagem</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {product.copy.boxContents.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-semibold text-white uppercase">Perfil do Comprador Técnico</span>
                  <p className="text-slate-300 leading-relaxed">
                    {product.copy.targetAudienceProfile}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: JSON PAYLOADS & ARCHITECTURE */}
          {activeTab === 'payload' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span>Payloads de Integração & Arquitetura de Software</span>
                  </h3>
                  <p className="text-xs text-slate-400">Contratos de dados prontos para APIs REST, Webhooks e Marketplaces</p>
                </div>

                {/* Schema Selector */}
                <div className="flex items-center space-x-2">
                  <select
                    id="select-schema-type"
                    value={selectedSchema}
                    onChange={(e) => setSelectedSchema(e.target.value as PayloadSchemaType)}
                    className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    <option value="rest_catalog_ingest">POST /api/v1/products (REST Ingest)</option>
                    <option value="stock_sync_webhook">Webhook: inventory.level.changed</option>
                    <option value="marketplace_feed">Omnichannel Marketplace Feed</option>
                    <option value="schema_org_json_ld">Schema.org Product (SEO JSON-LD)</option>
                    <option value="vtex_product_payload">VTEX / Shopify Ingestion Schema</option>
                  </select>
                </div>
              </div>

              {/* Actions toolbar */}
              <div className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-mono text-[10px]">
                    VALID_JSON_SCHEMA
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {payloadString.length} bytes • UTF-8
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    id="btn-test-payload-api"
                    onClick={handleSimulateApiDispatch}
                    disabled={isTestingApi}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isTestingApi ? 'Despachando...' : 'Simular POST API'}</span>
                  </button>

                  <button
                    id="btn-copy-json"
                    onClick={handleCopyPayload}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
                  </button>

                  <button
                    id="btn-download-json"
                    onClick={handleDownloadPayload}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 font-medium transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar</span>
                  </button>
                </div>
              </div>

              {/* Code viewer */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <pre className="p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto max-h-96 leading-relaxed">
                  <code>{payloadString}</code>
                </pre>
              </div>

              {/* API Dispatch Simulation Result */}
              {testResponse && (
                <div className="bg-emerald-950/40 border border-emerald-800/80 p-3.5 rounded-xl text-xs space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span className="flex items-center space-x-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Resposta do Gateway Mock ({testResponse.gateway})</span>
                    </span>
                    <span className="font-mono bg-emerald-900/60 px-2 py-0.5 rounded text-[10px]">
                      HTTP {testResponse.http_status} • {testResponse.latency_ms}ms
                    </span>
                  </div>
                  <p className="text-slate-300 font-mono text-[11px]">
                    Payload validado e ingerido com sucesso no cluster. Registro ID: <span className="text-cyan-300">{testResponse.record_id}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: STOCK & WMS */}
          {activeTab === 'stock' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Painel WMS & Movimentação de Estoque</h3>
                  <p className="text-xs text-slate-400">Controle de saldos físicos, reservas de pedidos e lote</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Saldo Físico (On Hand)</span>
                  <div className="text-2xl font-bold text-white mt-1">
                    {product.stock.physical} <span className="text-xs font-normal text-slate-400">unidades</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Presente no armazém</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Pedidos Alocados (Reservado)</span>
                  <div className="text-2xl font-bold text-amber-400 mt-1">
                    {product.stock.reserved} <span className="text-xs font-normal text-slate-400">unidades</span>
                  </div>
                  <span className="text-[11px] text-amber-500/80">Aguardando faturamento/picking</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Estoque Disponível para Venda</span>
                  <div className="text-2xl font-bold text-cyan-400 mt-1">
                    {product.stock.available} <span className="text-xs font-normal text-slate-400">unidades</span>
                  </div>
                  <span className="text-[11px] text-cyan-500/80">Sincronizado nos canais</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Parâmetros de Reabastecimento</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Estoque de Segurança:</span>
                    <span className="font-bold text-white mt-1 block">{product.stock.minSafetyStock} un</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Ponto de Pedido (ROP):</span>
                    <span className="font-bold text-amber-300 mt-1 block">{product.stock.reorderPoint} un</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Lead Time Fornecedor:</span>
                    <span className="font-bold text-white mt-1 block">{product.stock.leadTimeDays} dias</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Último Recebimento:</span>
                    <span className="font-mono text-slate-200 mt-1 block">{product.stock.lastRestockedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
