import React, { useState } from 'react';
import { CartItem, CustomerUser, Order, PaymentMethod } from '../../types';
import { 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Barcode, 
  Truck, 
  User, 
  MapPin, 
  CheckCircle2, 
  Copy, 
  Check, 
  Lock, 
  ArrowLeft, 
  Zap, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface CheckoutViewProps {
  items: CartItem[];
  currentUser: CustomerUser | null;
  onBackToStore: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  currentUser,
  onBackToStore,
  onOrderCompleted,
}) => {
  // Step 1: Customer info
  const [name, setName] = useState(currentUser?.name || 'Lucas Silva');
  const [email, setEmail] = useState(currentUser?.email || 'lucas.tech@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '(11) 99887-6655');
  const [cpf, setCpf] = useState(currentUser?.cpf || '321.654.987-10');

  // Address
  const [zipCode, setZipCode] = useState(currentUser?.address?.zipCode || '01310-100');
  const [street, setStreet] = useState(currentUser?.address?.street || 'Av. Paulista');
  const [number, setNumber] = useState(currentUser?.address?.number || '1000');
  const [complement, setComplement] = useState(currentUser?.address?.complement || 'Apto 42');
  const [neighborhood, setNeighborhood] = useState(currentUser?.address?.neighborhood || 'Bela Vista');
  const [city, setCity] = useState(currentUser?.address?.city || 'São Paulo');
  const [state, setState] = useState(currentUser?.address?.state || 'SP');

  // Step 2: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [cardHolder, setCardHolder] = useState('LUCAS SILVA');
  const [cardNumber, setCardNumber] = useState('4532 8921 4455 7890');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('883');
  const [installments, setInstallments] = useState(1);

  // States
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedBoleto, setCopiedBoleto] = useState(false);

  // Calculations
  const subtotal = items.reduce((acc, item) => {
    const price = item.product.pricing.promotionalPrice || item.product.pricing.regularPrice;
    return acc + price * item.quantity;
  }, 0);

  const shippingCost = subtotal > 299 ? 0 : 25.0;
  const pixDiscount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const total = Math.max(0, subtotal - pixDiscount + shippingCost);

  // Mock static codes
  const mockPixCode = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2, 15)}5204000053039865802BR5920SMARTACESSORIOS STORE6009SAO PAULO62070503***6304${Math.floor(1000 + Math.random() * 9000)}`;
  const mockBoletoCode = '34191.79001 01043.510047 91020.150008 4 94520000' + Math.floor(total).toString().padStart(4, '0');

  const handleCopyPix = () => {
    navigator.clipboard.writeText(mockPixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleCopyBoleto = () => {
    navigator.clipboard.writeText(mockBoletoCode);
    setCopiedBoleto(true);
    setTimeout(() => setCopiedBoleto(false), 2000);
  };

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `TECH-${Math.floor(100000 + Math.random() * 900000)}`,
        customer: {
          id: currentUser?.id || `cust-${Date.now()}`,
          name,
          email,
          phone,
          cpf,
          address: {
            zipCode,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
          },
        },
        items,
        subtotal,
        shippingCost,
        discount: pixDiscount,
        total,
        paymentMethod,
        paymentDetails: {
          cardLast4: paymentMethod === 'credit_card' ? cardNumber.slice(-4) : undefined,
          cardHolderName: paymentMethod === 'credit_card' ? cardHolder : undefined,
          installments: paymentMethod === 'credit_card' ? installments : undefined,
          pixQrCode: paymentMethod === 'pix' ? 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(mockPixCode) : undefined,
          pixCopyPaste: paymentMethod === 'pix' ? mockPixCode : undefined,
          boletoBarcode: paymentMethod === 'boleto' ? mockBoletoCode : undefined,
          boletoDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        },
        paymentStatus: paymentMethod === 'credit_card' ? 'paid' : 'pending',
        createdAt: new Date().toISOString(),
      };

      setIsProcessing(false);
      onOrderCompleted(newOrder);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToStore}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Loja</span>
        </button>

        <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Checkout Seguro com Criptografia SSL 256-bit</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer and Payment (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Customer Data */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>1. Identificação do Cliente & Nota Fiscal</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">E-mail para Confirmação</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">CPF (Documento)</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>2. Endereço de Entrega</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">CEP</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Rua / Logradouro</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Número</label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Complemento</label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Bairro</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Cidade</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Estado (UF)</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  maxLength={2}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-center font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-violet-400" />
                <span>3. Escolha a Forma de Pagamento</span>
              </h2>
              <span className="text-xs text-slate-400">100% Seguro</span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-3">
              {/* PIX Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3 rounded-2xl border-2 transition text-left flex flex-col justify-between ${
                  paymentMethod === 'pix'
                    ? 'border-emerald-500 bg-emerald-950/30'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] font-extrabold bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded">
                    5% OFF
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">PIX Instantâneo</span>
                  <span className="text-[10px] text-slate-400">Aprovação imediata</span>
                </div>
              </button>

              {/* Credit Card Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 rounded-2xl border-2 transition text-left flex flex-col justify-between ${
                  paymentMethod === 'credit_card'
                    ? 'border-cyan-500 bg-cyan-950/30'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  <span className="text-[10px] font-bold text-cyan-400">Até 12x</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Cartão de Crédito</span>
                  <span className="text-[10px] text-slate-400">Sem juros</span>
                </div>
              </button>

              {/* Boleto Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`p-3 rounded-2xl border-2 transition text-left flex flex-col justify-between ${
                  paymentMethod === 'boleto'
                    ? 'border-amber-500 bg-amber-950/30'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Barcode className="w-5 h-5 text-amber-400" />
                  <span className="text-[10px] font-bold text-slate-400">Bancário</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Boleto Bancário</span>
                  <span className="text-[10px] text-slate-400">Vencimento em 3 dias</span>
                </div>
              </button>
            </div>

            {/* PIX Payment Details Box */}
            {paymentMethod === 'pix' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300">
                      Desconto de 5% aplicado no PIX!
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white">
                    Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Ao clicar em <strong>Confirmar Pedido</strong>, você receberá o QR Code dinâmico e o código Copia e Cola para pagamento imediato no app do seu banco.
                </p>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-300 truncate max-w-xs">
                    {mockPixCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="ml-2 px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 rounded-lg text-xs font-semibold flex items-center space-x-1 shrink-0"
                  >
                    {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar Chave'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Credit Card Form */}
            {paymentMethod === 'credit_card' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-900/50 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nome Impresso no Cartão</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="LUCAS SILVA"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Validade (MM/AA)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Código CVV</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Opções de Parcelamento</label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 10, 12].map((n) => (
                      <option key={n} value={n}>
                        {n}x de {(total / n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros (Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Boleto Bancário Box */}
            {paymentMethod === 'boleto' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-amber-900/50 space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">
                    Boleto Bancário Registrado
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  O boleto pode ser pago em qualquer agência bancária, lotéricas ou internet banking até o vencimento. O prazo de compensação é de até 1 dia útil após o pagamento.
                </p>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-300 truncate max-w-xs">
                    {mockBoletoCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyBoleto}
                    className="ml-2 px-3 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700 rounded-lg text-xs font-semibold flex items-center space-x-1 shrink-0"
                  >
                    {copiedBoleto ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBoleto ? 'Copiado!' : 'Copiar Linha'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 sticky top-20">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Resumo do Pedido</span>
              <span className="text-xs font-mono text-cyan-400">{items.length} itens</span>
            </h3>

            {/* Products preview */}
            <div className="divide-y divide-slate-800 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => {
                const price = item.product.pricing.promotionalPrice || item.product.pricing.regularPrice;
                const img = item.product.images && item.product.images.length > 0 ? item.product.images[0] : null;

                return (
                  <div key={item.product.id} className="py-2.5 flex items-center space-x-3 text-xs">
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                      {img ? (
                        <img src={img} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] font-mono text-slate-500">Tech</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-white truncate block">{item.product.name}</span>
                      <span className="text-[10px] text-slate-400">{item.quantity}x • {item.selectedColor || item.product.color}</span>
                    </div>
                    <span className="font-bold text-white shrink-0">
                      {(price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Financial breakdown */}
            <div className="space-y-2 text-xs text-slate-400 pt-3 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-white font-medium">
                  {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>

              {pixDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Desconto PIX (5%):</span>
                  <span>-{pixDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Frete Especial:</span>
                <span className={shippingCost === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                  {shippingCost === 0 ? 'GRÁTIS' : shippingCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>Total a Pagar:</span>
                <span className="text-cyan-400">
                  {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleFinishOrder}
              disabled={isProcessing || items.length === 0}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-xl shadow-cyan-500/25 transition active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processando Pagamento Seguro...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <span>Confirmar & Finalizar Pedido</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
