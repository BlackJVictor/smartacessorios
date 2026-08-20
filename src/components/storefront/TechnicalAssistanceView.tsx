import React, { useState } from 'react';
import { RepairOrder, RepairDeviceType, CustomerUser } from '../../types';
import phoneRepairImg from '../../assets/images/repair_phone_1787166156197.jpg';
import laptopRepairImg from '../../assets/images/repair_laptop_1787166168517.jpg';
import { 
  Wrench, 
  Smartphone, 
  Laptop, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  User, 
  Mail, 
  Cpu, 
  Check, 
  Copy, 
  MessageSquare,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface TechnicalAssistanceViewProps {
  currentUser: CustomerUser | null;
  onSubmitRepair: (repair: Omit<RepairOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const TechnicalAssistanceView: React.FC<TechnicalAssistanceViewProps> = ({
  currentUser,
  onSubmitRepair,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<RepairDeviceType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [deviceType, setDeviceType] = useState<RepairDeviceType>('smartphone');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [error, setError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<RepairOrder | null>(null);
  const [copiedProtocol, setCopiedProtocol] = useState(false);

  const handleOpenFormForDevice = (type: RepairDeviceType) => {
    setDeviceType(type);
    setSelectedDevice(type);
    setIsFormOpen(true);
    setError(null);
    setSubmittedOrder(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !model.trim() || !year.trim() || !problemDescription.trim() || !customerName.trim() || !customerPhone.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios para abrir a Ordem de Serviço.');
      return;
    }

    const estimatedDays = deviceType === 'smartphone' ? 3 : 15;
    const randomProtocolNum = Math.floor(1000 + Math.random() * 9000);
    const protocol = `OS-2024-${randomProtocolNum}`;

    const newRepairData: Omit<RepairOrder, 'id' | 'createdAt' | 'updatedAt'> = {
      protocol,
      deviceType,
      brand: brand.trim(),
      model: model.trim(),
      year: year.trim(),
      problemDescription: problemDescription.trim(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      estimatedDays,
      status: 'pending',
    };

    onSubmitRepair(newRepairData);

    const fullOrder: RepairOrder = {
      ...newRepairData,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSubmittedOrder(fullOrder);
    setIsFormOpen(false);
  };

  const handleCopyProtocol = (proto: string) => {
    navigator.clipboard.writeText(proto);
    setCopiedProtocol(true);
    setTimeout(() => setCopiedProtocol(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-4 h-4" />
            <span>Laboratório Especializado SmartAcessórios</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Assistência Técnica & Reparo Avançado
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Selecione abaixo o seu dispositivo para abrir uma solicitação de reparo imediata com prazo pré-definido. Nossos técnicos certificados realizam diagnóstico minucioso com peças de primeira linha e garantia oficial de 90 dias.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Celulares</span>
              <strong className="text-xs sm:text-sm font-black text-cyan-400">Prazo: ~3 Dias</strong>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Notebooks</span>
              <strong className="text-xs sm:text-sm font-black text-indigo-400">Prazo: ~15 Dias</strong>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Garantia</span>
              <strong className="text-xs sm:text-sm font-black text-emerald-400">90 Dias de Reparo</strong>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Atendimento</span>
              <strong className="text-xs sm:text-sm font-black text-amber-400">Via WhatsApp</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Success Receipt Feedback */}
      {submittedOrder && (
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-3xl shadow-2xl space-y-4 animate-scaleUp">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Solicitação Enviada com Sucesso para a Equipe Técnica
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Ordem de Serviço Aberta: <span className="text-cyan-400 font-mono">{submittedOrder.protocol}</span>
                </h3>
              </div>
            </div>

            <button
              onClick={() => handleCopyProtocol(submittedOrder.protocol)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shrink-0 transition"
            >
              {copiedProtocol ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedProtocol ? 'Protocolo Copiado!' : 'Copiar Protocolo'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300 pt-1">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">Dispositivo Cadastrado</span>
              <strong className="text-white text-sm block">
                {submittedOrder.deviceType === 'smartphone' ? '📱 Celular' : '💻 Notebook'} {submittedOrder.brand} {submittedOrder.model} ({submittedOrder.year})
              </strong>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">Prazo Médio Estimado</span>
              <strong className="text-cyan-400 text-sm flex items-center space-x-1.5">
                <Clock className="w-4 h-4" />
                <span>{submittedOrder.estimatedDays} Dias Úteis</span>
              </strong>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">Cliente & WhatsApp</span>
              <strong className="text-white text-sm block">{submittedOrder.customerName}</strong>
              <span className="text-slate-400 font-mono">{submittedOrder.customerPhone}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
            <span className="text-slate-400 font-semibold block mb-1">Defeito Informado:</span>
            <p className="text-slate-200">{submittedOrder.problemDescription}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
            <p className="text-slate-400 text-center sm:text-left">
              💬 Nosso laboratório já recebeu o chamado e entrará em contato via WhatsApp para confirmar o envio ou entrega do equipamento.
            </p>
            <button
              onClick={() => setSubmittedOrder(null)}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shrink-0 transition"
            >
              Nova Solicitação
            </button>
          </div>
        </div>
      )}

      {/* The Two Main Repair Selection Cards */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Selecione o Tipo de Equipamento para Reparo:
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Conserto de Celular */}
          <div
            id="card-repair-smartphone"
            onClick={() => handleOpenFormForDevice('smartphone')}
            className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-500/60 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer flex flex-col justify-between"
          >
            {/* Image Container */}
            <div className="relative h-56 rounded-2xl overflow-hidden mb-5 bg-slate-950 border border-slate-800">
              <img
                src={phoneRepairImg}
                alt="Conserto de Celular SmartAcessórios"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute top-3 left-3 px-3 py-1 bg-cyan-950/90 text-cyan-300 border border-cyan-800 rounded-full text-xs font-bold flex items-center space-x-1.5 backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Prazo Médio: 3 Dias Úteis</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-cyan-600/90 text-white shadow-md">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight leading-tight">
                      Conserto de Celular
                    </h2>
                    <span className="text-xs text-cyan-300 font-medium">
                      Smartphones iOS & Android
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-4 flex-1">
              <p className="text-xs text-slate-300 leading-relaxed">
                Especialistas em troca de telas originais AMOLED/Retina, substituição de baterias com saúde degradada, reparo em placas com curto-circuito, conectores USB-C/Lightning e desoxidação.
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Troca de Tela Rápida</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Bateria Original</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Conector de Carga</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Câmeras & Sensores</span>
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-1 text-cyan-400 text-xs font-bold">
                <span>Prazo Rápido: 3 Dias</span>
              </div>

              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:from-cyan-500 group-hover:to-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-600/20 transition active:scale-95"
              >
                <span>Solicitar Conserto</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: Conserto de Notebook */}
          <div
            id="card-repair-notebook"
            onClick={() => handleOpenFormForDevice('notebook')}
            className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500/60 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between"
          >
            {/* Image Container */}
            <div className="relative h-56 rounded-2xl overflow-hidden mb-5 bg-slate-950 border border-slate-800">
              <img
                src={laptopRepairImg}
                alt="Conserto de Notebook SmartAcessórios"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute top-3 left-3 px-3 py-1 bg-indigo-950/90 text-indigo-300 border border-indigo-800 rounded-full text-xs font-bold flex items-center space-x-1.5 backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Prazo Médio: 15 Dias Úteis</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-indigo-600/90 text-white shadow-md">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight leading-tight">
                      Conserto de Notebook
                    </h2>
                    <span className="text-xs text-indigo-300 font-medium">
                      Laptops, MacBooks & Ultrabooks
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-4 flex-1">
              <p className="text-xs text-slate-300 leading-relaxed">
                Reparo avançado em placa-mãe (micro-soldagem BGA e troca de CI de carga), substituição de teclados e telas IPS, desoxidação, troca de pasta térmica de alto rendimento e upgrades de SSD/RAM.
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Reparo de Placa-Mãe</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Troca de Tela / Display</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Limpeza & Pasta Térmica</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Teclado & Carcaça</span>
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-1 text-indigo-400 text-xs font-bold">
                <span>Prazo Detalhado: 15 Dias</span>
              </div>

              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 group-hover:from-indigo-500 group-hover:to-violet-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20 transition active:scale-95"
              >
                <span>Solicitar Conserto</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Repair Order Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-6 relative flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-2xl ${deviceType === 'smartphone' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}>
                  {deviceType === 'smartphone' ? <Smartphone className="w-6 h-6" /> : <Laptop className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Solicitação de Reparo: {deviceType === 'smartphone' ? 'Conserto de Celular' : 'Conserto de Notebook'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Preencha os dados técnicos do equipamento e seu contato para envio imediato.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {error && (
                <div className="p-3.5 bg-rose-950/80 border border-rose-800 rounded-2xl text-rose-200 text-xs flex items-center space-x-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Device Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Tipo de Equipamento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeviceType('smartphone')}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-2 ${
                      deviceType === 'smartphone'
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/20'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Celular (Prazo ~3 Dias)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeviceType('notebook')}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-2 ${
                      deviceType === 'notebook'
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Laptop className="w-4 h-4" />
                    <span>Notebook (Prazo ~15 Dias)</span>
                  </button>
                </div>
              </div>

              {/* Device Info */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-4">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  1. Dados Técnicos do Aparelho
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Marca *
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder={deviceType === 'smartphone' ? 'Ex: Apple, Samsung, Xiaomi' : 'Ex: Dell, Lenovo, Apple, Asus'}
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Modelo do Aparelho *
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder={deviceType === 'smartphone' ? 'Ex: iPhone 14 Pro / S23' : 'Ex: Inspiron 15 / MacBook Air M1'}
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Ano de Fabricação / Compra *
                    </label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="Ex: 2023"
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Descrição do Problema / Defeito Apresentado *
                  </label>
                  <textarea
                    rows={3}
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Descreva o que aconteceu: tela apagada, queda, não carrega, travamentos, teclado com defeito, contato com líquidos..."
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  2. Dados do Cliente para Contato
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ex: Lucas Silva"
                        className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Celular / WhatsApp para Contato *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Ex: (11) 98765-4321"
                        className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-500 font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    E-mail (opcional)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Ex: cliente@gmail.com"
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Deadline & SLA Notice */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-cyan-900/40 flex items-center space-x-3 text-xs">
                <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block">
                    Prazo Médio de Reparo: {deviceType === 'smartphone' ? '3 Dias Úteis' : '15 Dias Úteis'}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Após a chegada no laboratório, o diagnóstico é feito em 24h e o reparo finalizado dentro do prazo estipulado.
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  id="btn-submit-repair-order"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Solicitação de Reparo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
