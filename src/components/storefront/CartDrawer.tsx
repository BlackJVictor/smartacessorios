import React, { useState } from 'react';
import { CartItem } from '../../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Zap,
  Check
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const price = item.product.pricing.promotionalPrice || item.product.pricing.regularPrice;
    return acc + price * item.quantity;
  }, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'TECH10') {
      const discountVal = subtotal * 0.1;
      setAppliedDiscount(discountVal);
      setCouponMessage('Cupom TECH10 aplicado! 10% de desconto.');
    } else if (couponCode.trim().toUpperCase() === 'PRIMEIRACOMPRA') {
      const discountVal = subtotal * 0.15;
      setAppliedDiscount(discountVal);
      setCouponMessage('Cupom PRIMEIRACOMPRA aplicado! 15% de desconto.');
    } else {
      setCouponMessage('Cupom inválido ou expirado.');
      setAppliedDiscount(0);
    }
  };

  const shippingCost = subtotal > 299 || subtotal === 0 ? 0 : 25.0;
  const freeShippingThreshold = 299;
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const total = Math.max(0, subtotal - appliedDiscount + shippingCost);
  const pixTotal = total * 0.95;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Carrinho SmartAcessórios</h2>
                <p className="text-xs text-slate-400">
                  {items.length} {items.length === 1 ? 'item selecionado' : 'itens selecionados'}
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

          {/* Free Shipping Progress */}
          <div className="px-5 py-3 bg-slate-950 border-b border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300 flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {subtotal >= freeShippingThreshold
                    ? 'Parabéns! Você ganhou Frete Grátis 🚚'
                    : `Faltam R$ ${missingForFreeShipping.toFixed(2)} para Frete Grátis`}
                </span>
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <ShoppingBag className="w-16 h-16 stroke-1 text-slate-700 mb-3" />
                <h3 className="text-base font-bold text-slate-300">Seu carrinho está vazio</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Navegue pelo nosso catálogo de smartphones, capinhas e fones de ouvido para adicionar produtos.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold transition"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map((item) => {
                const price = item.product.pricing.promotionalPrice || item.product.pricing.regularPrice;
                const img = item.product.images && item.product.images.length > 0 ? item.product.images[0] : null;

                return (
                  <div 
                    key={item.product.id}
                    className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex space-x-3.5 relative group"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                      {img ? (
                        <img 
                          src={img} 
                          alt={item.product.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-[10px] text-slate-600 font-mono">Foto</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Cor: {item.selectedColor || item.product.color}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 text-slate-400 hover:text-white rounded transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 text-slate-400 hover:text-white rounded transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs font-bold text-white">
                            {(price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-600 hover:text-rose-400 p-1 transition"
                      title="Remover do carrinho"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-3.5">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Cupom (Ex: TECH10)"
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg pl-8 pr-2 py-2 uppercase focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg transition"
                >
                  Aplicar
                </button>
              </form>

              {couponMessage && (
                <p className={`text-[11px] font-medium ${appliedDiscount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {couponMessage}
                </p>
              )}

              {/* Financial values */}
              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-900">
                <div className="flex justify-between">
                  <span>Subtotal dos Produtos:</span>
                  <span className="text-white font-medium">
                    {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto do Cupom:</span>
                    <span>-{appliedDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frete Nacional:</span>
                  <span className={shippingCost === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                    {shippingCost === 0 ? 'GRÁTIS' : shippingCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                  <span>Total:</span>
                  <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                  <span className="flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>No PIX com 5% de desconto:</span>
                  </span>
                  <span>{pixTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onProceedToCheckout();
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-lg shadow-cyan-500/25 transition active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
