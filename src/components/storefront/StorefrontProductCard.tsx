import React from 'react';
import { Product } from '../../types';
import { ShoppingBag, Zap, Shield, Smartphone, Headphones, Check, Star, ArrowRight } from 'lucide-react';

interface StorefrontProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const StorefrontProductCard: React.FC<StorefrontProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
  onBuyNow,
}) => {
  const isSmartphone = product.category === 'smartphones';
  const isCase = product.category === 'cases';
  const isHeadphone = product.category === 'headphones';

  const regularPrice = product.pricing.regularPrice;
  const promoPrice = product.pricing.promotionalPrice || regularPrice;
  const hasDiscount = product.pricing.promotionalPrice && product.pricing.promotionalPrice < regularPrice;
  const discountPercent = hasDiscount ? Math.round(((regularPrice - promoPrice) / regularPrice) * 100) : 0;
  const pixPrice = promoPrice * 0.95; // 5% additional off on PIX
  const installmentValue = (promoPrice / 12).toFixed(2);

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;
  const isOutOfStock = product.stock.available <= 0;
  const isLowStock = product.stock.available > 0 && product.stock.available <= product.stock.minSafetyStock;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 flex flex-col overflow-hidden group shadow-lg hover:shadow-cyan-500/10">
      {/* Top Image Banner */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative w-full h-56 bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer"
      >
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-600">
            {isSmartphone && <Smartphone className="w-12 h-12 mb-2 text-cyan-500/40" />}
            {isCase && <Shield className="w-12 h-12 mb-2 text-emerald-500/40" />}
            {isHeadphone && <Headphones className="w-12 h-12 mb-2 text-violet-500/40" />}
            <span className="text-xs font-mono">Visual Tech Oficial</span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-600 text-white shadow-md uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 backdrop-blur-sm">
            {product.brand}
          </span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute bottom-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/90 text-rose-400 border border-rose-900/80">
              Esgotado
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-800/80">
              Restam {product.stock.available} un.
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Pronta Entrega</span>
            </span>
          )}
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center space-x-1 text-amber-400 text-xs mb-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>
            <span className="text-[11px] text-slate-400 ml-1">(4.9) • Oficial</span>
          </div>

          <h3 
            onClick={() => onViewDetails(product)}
            className="text-sm font-bold text-white group-hover:text-cyan-400 transition cursor-pointer line-clamp-2 leading-snug"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {product.copy?.shortPitch || `${product.brand} ${product.model} - Cor: ${product.color}`}
          </p>
        </div>

        {/* Pricing Block */}
        <div className="pt-2 border-t border-slate-800/80">
          {hasDiscount && (
            <span className="text-xs text-slate-500 line-through block">
              {regularPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          )}
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-extrabold text-white">
              {promoPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>
              {pixPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} à vista no PIX (-5%)
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            ou até 12x de R$ {installmentValue} sem juros
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-50 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center justify-center space-x-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Carrinho</span>
          </button>

          <button
            onClick={() => onBuyNow(product)}
            disabled={isOutOfStock}
            className="py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition flex items-center justify-center space-x-1"
          >
            <span>Comprar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
