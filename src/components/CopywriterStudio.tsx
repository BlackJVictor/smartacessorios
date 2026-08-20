import React, { useState } from 'react';
import { 
  Product, 
  ProductCategory 
} from '../types';
import { MarkdownView } from './MarkdownView';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Smartphone, 
  Shield, 
  Headphones, 
  Save, 
  RefreshCw, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Search,
  ExternalLink,
  Code,
  FileText
} from 'lucide-react';

interface CopywriterStudioProps {
  products: Product[];
  activeProduct?: Product | null;
  onApplyCopywriterToProduct: (productId: string, generatedCopy: any) => void;
  onCreateProductFromCopy: (generatedData: any, category: ProductCategory, brand: string, modelName: string) => void;
}

export const CopywriterStudio: React.FC<CopywriterStudioProps> = ({
  products,
  activeProduct,
  onApplyCopywriterToProduct,
  onCreateProductFromCopy,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(activeProduct?.id || (products[0]?.id || 'custom'));
  const [category, setCategory] = useState<ProductCategory>(activeProduct?.category || 'smartphones');
  const [brand, setBrand] = useState(activeProduct?.brand || 'Samsung');
  const [modelName, setModelName] = useState(activeProduct?.name || 'Galaxy S24 Ultra 5G Titânio 512GB');
  const [targetChannel, setTargetChannel] = useState('E-commerce Próprio D2C e Marketplaces');
  const [copyTone, setCopyTone] = useState('Técnico de Alta Conversão com Engenharia de Destaque');
  const [customSpecs, setCustomSpecs] = useState(
    'Snapdragon 8 Gen 3, 12GB RAM LPDDR5X, 512GB UFS 4.0, Câmera 200MP, Tela 6.8" 120Hz 2600 nits, Bateria 5000mAh 45W, Chassi Titânio Grau 2'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<any | null>(activeProduct ? activeProduct.copy : null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // When user picks an existing product from dropdown
  const handleSelectProduct = (pId: string) => {
    setSelectedProductId(pId);
    if (pId === 'custom') {
      setBrand('');
      setModelName('');
      setCustomSpecs('');
      setGeneratedResult(null);
    } else {
      const prod = products.find((p) => p.id === pId);
      if (prod) {
        setCategory(prod.category);
        setBrand(prod.brand);
        setModelName(prod.name);
        setGeneratedResult(prod.copy);
        
        let specsString = '';
        if (prod.category === 'smartphones' && prod.smartphoneSpecs) {
          specsString = `${prod.smartphoneSpecs.chipset}, ${prod.smartphoneSpecs.ramGb}GB RAM ${prod.smartphoneSpecs.ramType}, ${prod.smartphoneSpecs.storageGb}GB ${prod.smartphoneSpecs.storageType}, Câmera ${prod.smartphoneSpecs.cameraMainMp}MP, Tela ${prod.smartphoneSpecs.displaySizeInches}" ${prod.smartphoneSpecs.refreshRateHz}Hz ${prod.smartphoneSpecs.peakBrightnessNits} nits, Bateria ${prod.smartphoneSpecs.batteryMah}mAh ${prod.smartphoneSpecs.chargingSpeedWatts}W`;
        } else if (prod.category === 'cases' && prod.caseSpecs) {
          specsString = `${prod.caseSpecs.material}, Drop-Test ${prod.caseSpecs.dropProtectionRatingMeters}m (${prod.caseSpecs.militaryStandard}), MagSafe ${prod.caseSpecs.magSafeCompatible ? 'Sim' : 'Não'}, Espessura ${prod.caseSpecs.thicknessMm}mm, Aro Câmera ${prod.caseSpecs.raisedLipCameraMm}mm`;
        } else if (prod.category === 'headphones' && prod.headphoneSpecs) {
          specsString = `Driver ${prod.headphoneSpecs.driverSizeMm}mm ${prod.headphoneSpecs.driverType}, Codecs: ${prod.headphoneSpecs.codecs.join(', ')}, ANC ${prod.headphoneSpecs.ancAttenuationDb}dB, Bateria ${prod.headphoneSpecs.batteryWithAncHours}h com ANC, Bluetooth ${prod.headphoneSpecs.bluetoothVer}`;
        }
        setCustomSpecs(specsString);
      }
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/ai/copywrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          brand,
          modelName,
          rawSpecs: customSpecs,
          targetChannel,
          copyTone,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao processar copywriting');
      }

      setGeneratedResult(data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao conectar com a IA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveToCurrentProduct = () => {
    if (!generatedResult) return;
    if (selectedProductId && selectedProductId !== 'custom') {
      onApplyCopywriterToProduct(selectedProductId, generatedResult);
      setSuccessMessage('Copywriting aplicado com sucesso ao SKU selecionado!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      onCreateProductFromCopy(generatedResult, category, brand, modelName);
      setSuccessMessage('Novo produto criado a partir do copywriting gerado!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-5 rounded-2xl border border-cyan-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Studio de Copywriting Técnico & SEO E-commerce
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Gere descrições focadas em especificações técnicas reais, engenharia de componentes e diferenciais de conversão para Smartphones, Capinhas de Proteção e Fones de Ouvido.
          </p>
        </div>

        {/* Category badges */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCategory('smartphones')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              category === 'smartphones'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Smartphones</span>
          </button>
          <button
            onClick={() => setCategory('cases')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              category === 'cases'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Capinhas</span>
          </button>
          <button
            onClick={() => setCategory('headphones')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              category === 'headphones'
                ? 'bg-violet-950 text-violet-300 border-violet-700'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Fones</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Config Inputs + Live Output Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Entrada de Parâmetros Técnicos</span>
            </h3>

            {/* Select product source */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Carregar do Catálogo ou Criar Novo
              </label>
              <select
                id="select-copy-source-product"
                value={selectedProductId}
                onChange={(e) => handleSelectProduct(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="custom">✨ Novo Produto Manual (Do Zero)</option>
                <optgroup label="Produtos do Catálogo">
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.category.toUpperCase()}] {p.brand} - {p.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Selected Product Snapshot Card if chosen from catalog */}
            {selectedProductId !== 'custom' && (() => {
              const currentProd = products.find((p) => p.id === selectedProductId);
              if (!currentProd) return null;
              const img = currentProd.images && currentProd.images.length > 0 ? currentProd.images[0] : null;

              return (
                <div className="flex items-center space-x-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  {img ? (
                    <img
                      src={img}
                      alt={currentProd.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      <Smartphone className="w-6 h-6 text-slate-600" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                      SKU: {currentProd.sku} • {currentProd.color}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">{currentProd.name}</h4>
                    <span className="text-[11px] text-slate-400">
                      Estoque: <strong className="text-emerald-400">{currentProd.stock.available} un</strong> • Preço:{' '}
                      <strong className="text-slate-200">
                        {(currentProd.pricing.promotionalPrice || currentProd.pricing.regularPrice).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </strong>
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Brand & Model */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Marca / Fabricante</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ex: Apple, Samsung, Sony"
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Modelo / Linha</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="Ex: S24 Ultra, WH-1000XM5"
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Target Channel & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Canal de Publicação</label>
                <select
                  value={targetChannel}
                  onChange={(e) => setTargetChannel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-cyan-500"
                >
                  <option value="E-commerce Próprio D2C e Marketplaces">E-commerce Próprio & Marketplaces</option>
                  <option value="Mercado Livre Pro & Full">Mercado Livre (Foco em Título & Bullets)</option>
                  <option value="Amazon Brasil Tech Store">Amazon Brasil (A+ Content & Features)</option>
                  <option value="Landing Page de Lançamento VIP">Landing Page VIP (Storytelling Técnico)</option>
                  <option value="B2B Tech Wholesale Feed">Catálogo Técnico B2B Atacado</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Tom de Copywriting</label>
                <select
                  value={copyTone}
                  onChange={(e) => setCopyTone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Técnico de Alta Conversão com Engenharia de Destaque">Técnico & Engenharia de Ponta</option>
                  <option value="Comercial Agressivo de Alto CTR e Benefícios">Comercial de Alto CTR</option>
                  <option value="Foco em Durabilidade, Materiais e Testes Militares">Durabilidade & Padrão Militar</option>
                  <option value="Audiófilo e Acústico de Alta Fidelidade">Audiófilo & Hi-Res Lossless</option>
                </select>
              </div>
            </div>

            {/* Raw Specs */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Especificações Brutas / Destaques do Hardware
              </label>
              <textarea
                rows={4}
                value={customSpecs}
                onChange={(e) => setCustomSpecs(e.target.value)}
                placeholder="Insira as especificações técnicas (SoC, drivers, materiais, bateria, codecs, etc)..."
                className="w-full bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Generate Button */}
            <button
              id="btn-generate-ai-copy"
              onClick={handleGenerate}
              disabled={isLoading || !modelName.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/25 transition active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gerando Copy Técnico com Gemini IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Copywriting Técnico Completo</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-xl">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output / Generated Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {!generatedResult && !isLoading ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-white">Nenhum copywriting gerado ainda</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Preencha os dados do hardware ao lado e clique em "Gerar Copywriting Técnico Completo" para produzir títulos otimizados, meta tags e ficha técnica em Markdown.
              </p>
            </div>
          ) : isLoading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-white">Processando Arquitetura & Copywriting</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Analisando especificações técnicas de {brand} {modelName} e estruturando Markdown de alta conversão...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Top Action Bar */}
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Copywriting Gerado com Sucesso</span>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    id="btn-apply-copy-to-catalog"
                    onClick={handleSaveToCurrentProduct}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{selectedProductId === 'custom' ? 'Criar Produto com este Copy' : 'Salvar no Produto'}</span>
                  </button>
                </div>
              </div>

              {/* Marketplace Title */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Título de Alta Conversão (Marketplace)
                  </span>
                  <button
                    onClick={() => handleCopy(generatedResult.marketplaceTitle, 'title')}
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    {copiedKey === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'title' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-bold text-white font-mono select-all">
                  {generatedResult.marketplaceTitle}
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>Comprimento: {generatedResult.marketplaceTitle?.length || 0} caracteres</span>
                  <span className="text-emerald-400">Ideal para Mercado Livre / Amazon</span>
                </div>
              </div>

              {/* Google SERP Snippet Preview */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                    <Search className="w-3.5 h-3.5 text-blue-400" />
                    <span>Pré-Visualização SERP (Google Search)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(`${generatedResult.seoMetaTitle}\n${generatedResult.seoMetaDescription}`, 'seo')}
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    {copiedKey === 'seo' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'seo' ? 'Copiado!' : 'Copiar SEO'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-xs text-emerald-400 font-mono">
                    https://techcommerce.com.br › p › {modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  </div>
                  <div className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer">
                    {generatedResult.seoMetaTitle}
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {generatedResult.seoMetaDescription}
                  </div>
                </div>
              </div>

              {/* Engineering Bullets */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Destaques de Engenharia & Performance
                  </span>
                  <button
                    onClick={() => handleCopy(generatedResult.keyBenefitsBullets?.join('\n• '), 'bullets')}
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    {copiedKey === 'bullets' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'bullets' ? 'Copiado!' : 'Copiar Bullets'}</span>
                  </button>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {generatedResult.keyBenefitsBullets?.map((b: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-cyan-400 font-bold">⚡</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Full Technical Markdown */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ficha Técnica Completa em Markdown</span>
                  </span>
                  <button
                    onClick={() => handleCopy(generatedResult.technicalMarkdownDescription, 'md')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold"
                  >
                    {copiedKey === 'md' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'md' ? 'Copiado!' : 'Copiar Código Markdown'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/90 max-h-[500px] overflow-y-auto">
                  <MarkdownView content={generatedResult.technicalMarkdownDescription} />
                </div>
              </div>

              {/* Box contents & Compatibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-semibold text-white uppercase">Itens Inclusos na Embalagem</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {generatedResult.boxContents?.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-semibold text-white uppercase">Perfil do Comprador & Dores</span>
                  <p className="text-slate-300 leading-relaxed">
                    {generatedResult.targetAudienceProfile}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
