import React, { useState } from 'react';
import { Product } from '../../types';
import { 
  X, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  CheckCircle2, 
  Smartphone, 
  Shield, 
  Headphones, 
  CreditCard,
  QrCode,
  Barcode,
  Layers,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import { MarkdownView } from '../MarkdownView';

interface StorefrontProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedColor?: string) => void;
  onBuyNow: (product: Product, quantity: number, selectedColor?: string) => void;
}

export const StorefrontProductDetailModal: React.FC<StorefrontProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  if (!isOpen || !product) return null;

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.color || 'Preto');
  const [cepInput, setCepInput] = useState('');
  const [freteResult, setFreteResult] = useState<{ sedex: number; pac: number; days: string } | null>(null);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[selectedImgIndex] || null;

  const regularPrice = product.pricing.regularPrice;
  const promoPrice = product.pricing.promotionalPrice || regularPrice;
  const hasDiscount = product.pricing.promotionalPrice && product.pricing.promotionalPrice < regularPrice;
  const pixPrice = promoPrice * 0.95;
  const installmentValue = (promoPrice / 12).toFixed(2);

  const isSmartphone = product.category === 'smartphones';
  const isCase = product.category === 'cases';
  const isHeadphone = product.category === 'headphones';

  const handleCalcFrete = (e: React.FormEvent) => {
    e.preventDefault();
    if (cepInput.trim().length >= 8) {
      setFreteResult({
        sedex: promoPrice > 299 ? 0 : 24.9,
        pac: 0, // Free PAC
        days: '2 a 4 dias úteis',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl my-4 max-h-[92vh] flex flex-col relative animate-fadeIn">
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white p-2 rounded-full bg-slate-950/80 hover:bg-slate-800 border border-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Media Gallery (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Showcase Image */}
              <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-600">
                    {isSmartphone && <Smartphone className="w-16 h-16 text-cyan-500/40 mb-2" />}
                    {isCase && <Shield className="w-16 h-16 text-emerald-500/40 mb-2" />}
                    {isHeadphone && <Headphones className="w-16 h-16 text-violet-500/40 mb-2" />}
                    <span className="text-xs font-mono">Foto de Alta Resolução</span>
                  </div>
                )}

                {hasDiscount && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-black shadow-md uppercase tracking-wider">
                    Economize {Math.round(((regularPrice - promoPrice) / regularPrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                        selectedImgIndex === idx
                          ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                          : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-white block">Garantia Oficial</span>
                  <span className="text-[9px] text-slate-400">12 Meses Nacional</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                  <Truck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-white block">Envio Rápido</span>
                  <span className="text-[9px] text-slate-400">Despacho em 24h</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                  <RotateCcw className="w-4 h-4 text-violet-400 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-white block">Devolução Grátis</span>
                  <span className="text-[9px] text-slate-400">Até 7 dias corridos</span>
                </div>
              </div>
            </div>

            {/* Right Col: Product Info, Options & Buy Box (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold uppercase text-[10px]">
                    {product.brand}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-[11px]">SKU: {product.sku}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-300 font-bold">4.9 / 5.0</span>
                  <span className="text-xs text-slate-500">(148 avaliações de clientes verificados)</span>
                </div>
              </div>

              {/* Price Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-2">
                {hasDiscount && (
                  <span className="text-xs text-slate-500 line-through block">
                    De: {regularPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                )}
                <div className="flex items-baseline space-x-3">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {promoPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    Pronta Entrega
                  </span>
                </div>

                <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-emerald-300 block">
                        {pixPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} no PIX
                      </span>
                      <span className="text-[10px] text-emerald-400">Economia extra de 5% à vista</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-400">-5% OFF</span>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-300 pt-1">
                  <CreditCard className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Em até <strong>12x de R$ {installmentValue}</strong> sem juros no cartão de crédito</span>
                </div>
              </div>

              {/* Color & Quantity Selectors */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Cor Selecionada: <span className="text-cyan-400 font-bold">{selectedColor}</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    {['Titanium Black', 'Silver Frost', 'Deep Blue'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          selectedColor === c
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-semibold text-slate-300">Quantidade:</span>
                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-white min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock.available || 10, q + 1))}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    ({product.stock.available} disponíveis no armazém)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity, selectedColor);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-sm border border-slate-700 transition flex items-center justify-center space-x-2 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                  <span>Adicionar ao Carrinho</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, quantity, selectedColor);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white font-black text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Comprar Agora</span>
                </button>
              </div>

              {/* Frete Calculator */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Calcular Prazo e Frete</span>
                </span>
                <form onSubmit={handleCalcFrete} className="flex gap-2">
                  <input
                    type="text"
                    value={cepInput}
                    onChange={(e) => setCepInput(e.target.value)}
                    placeholder="Digite seu CEP (Ex: 01310-100)"
                    maxLength={9}
                    className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg transition"
                  >
                    Calcular
                  </button>
                </form>

                {freteResult && (
                  <div className="pt-2 text-xs space-y-1 border-t border-slate-900">
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>PAC Transportadora Exclusiva:</span>
                      <strong>GRÁTIS ({freteResult.days})</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>SEDEX Expresso Prioritário:</span>
                      <strong>
                        {freteResult.sedex === 0 ? 'GRÁTIS' : `R$ ${freteResult.sedex.toFixed(2)}`} (1 a 2 dias)
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Technical Specs & Description Accordion / Section */}
          <div className="mt-10 pt-8 border-t border-slate-800 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Descrição Técnica & Engenharia do Produto</span>
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Especificações detalhadas, homologação e diferenciais de construção.
              </p>
            </div>

            {/* Key Benefits Bullets */}
            {product.copy?.keyBenefitsBullets && product.copy.keyBenefitsBullets.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.copy.keyBenefitsBullets.map((b, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-200">{b}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Markdown Description */}
            {product.copy?.technicalMarkdownDescription && (
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                <MarkdownView content={product.copy.technicalMarkdownDescription} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
