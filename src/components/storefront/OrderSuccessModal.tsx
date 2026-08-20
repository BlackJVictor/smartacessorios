import React from 'react';
import { Order } from '../../types';
import { 
  CheckCircle2, 
  QrCode, 
  Barcode, 
  CreditCard, 
  Truck, 
  Copy, 
  Check, 
  ShoppingBag, 
  Download, 
  X, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-6 flex flex-col relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 p-6 border-b border-slate-800 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            Pedido Realizado com Sucesso
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            Obrigado pela sua compra, {order.customer.name.split(' ')[0]}!
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-mono">
            Número do Pedido: <strong className="text-cyan-400">{order.orderNumber}</strong>
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Payment Specific Action Block */}
          {order.paymentMethod === 'pix' && (
            <div className="p-5 bg-slate-950 rounded-2xl border border-emerald-900/60 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <QrCode className="w-4 h-4" />
                <span>Pague agora via PIX para envio imediato</span>
              </div>

              {/* QR Code visual simulation */}
              <div className="w-44 h-44 bg-white p-2 rounded-2xl mx-auto shadow-lg flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(order.paymentDetails.pixCopyPaste || order.orderNumber)}`}
                  alt="QR Code PIX"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs text-slate-400 block">
                  Ou utilize o código <strong>PIX Copia e Cola</strong> abaixo:
                </span>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-300 truncate max-w-md">
                    {order.paymentDetails.pixCopyPaste}
                  </span>
                  <button
                    onClick={() => handleCopyCode(order.paymentDetails.pixCopyPaste || '')}
                    className="ml-2 px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 rounded-lg text-xs font-semibold flex items-center space-x-1 shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {order.paymentMethod === 'boleto' && (
            <div className="p-5 bg-slate-950 rounded-2xl border border-amber-900/60 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Barcode className="w-4 h-4" />
                <span>Boleto Registrado Gerado</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-300 truncate max-w-md">
                  {order.paymentDetails.boletoBarcode}
                </span>
                <button
                  onClick={() => handleCopyCode(order.paymentDetails.boletoBarcode || '')}
                  className="ml-2 px-3 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700 rounded-lg text-xs font-semibold flex items-center space-x-1 shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Linha'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Vencimento do Boleto: <strong className="text-white">{order.paymentDetails.boletoDueDate}</strong>
              </p>
            </div>
          )}

          {order.paymentMethod === 'credit_card' && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-900/60 flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Pagamento Autorizado no Cartão • Final {order.paymentDetails.cardLast4}
                </span>
                <span className="text-[11px] text-slate-400">
                  Transação aprovada em {order.paymentDetails.installments || 1}x sem juros
                </span>
              </div>
            </div>
          )}

          {/* Delivery Details */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-300 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Endereço de Entrega Cadastrado</span>
            </span>
            <p className="text-slate-300">
              {order.customer.address?.street}, Nº {order.customer.address?.number} {order.customer.address?.complement ? `(${order.customer.address.complement})` : ''} - {order.customer.address?.neighborhood}, {order.customer.address?.city}/{order.customer.address?.state} - CEP: {order.customer.address?.zipCode}
            </p>
            <p className="text-slate-400 text-[11px]">
              Comprovante e rastreamento enviados para: <strong className="text-cyan-300">{order.customer.email}</strong>
            </p>
          </div>

          {/* Items Summary */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider text-[11px] block mb-1">
              Produtos Adquiridos
            </span>
            <div className="divide-y divide-slate-900">
              {order.items.map((item) => (
                <div key={item.product.id} className="py-2 flex justify-between items-center text-xs">
                  <span className="text-white font-medium">
                    {item.quantity}x {item.product.name} ({item.selectedColor || item.product.color})
                  </span>
                  <span className="font-mono text-slate-300 font-bold">
                    {((item.product.pricing.promotionalPrice || item.product.pricing.regularPrice) * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-black text-white">
              <span>Valor Total Pago:</span>
              <span className="text-emerald-400">
                {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrintReceipt}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Imprimir Comprovante</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center space-x-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continuar Comprando</span>
          </button>
        </div>
      </div>
    </div>
  );
};
