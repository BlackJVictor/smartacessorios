import React, { useState } from 'react';
import { RepairOrder, RepairStatus, RepairDeviceType } from '../types';
import { 
  Wrench, 
  Smartphone, 
  Laptop, 
  Clock, 
  Search, 
  Filter, 
  Phone, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  DollarSign, 
  FileText, 
  Copy, 
  Check, 
  Plus, 
  ExternalLink,
  ChevronDown,
  User
} from 'lucide-react';

interface RepairOrdersManagerProps {
  repairs: RepairOrder[];
  onUpdateRepairStatus: (id: string, status: RepairStatus, quotedPrice?: number, technicianNotes?: string) => void;
  onDeleteRepair: (id: string) => void;
}

export const RepairOrdersManager: React.FC<RepairOrdersManagerProps> = ({
  repairs,
  onUpdateRepairStatus,
  onDeleteRepair,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeviceFilter, setSelectedDeviceFilter] = useState<'all' | RepairDeviceType>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | RepairStatus>('all');
  const [editingRepair, setEditingRepair] = useState<RepairOrder | null>(null);
  const [editStatus, setEditStatus] = useState<RepairStatus>('pending');
  const [editPrice, setEditPrice] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Status mapping and colors
  const statusConfig: Record<RepairStatus, { label: string; bg: string; text: string; border: string }> = {
    pending: { label: 'Pendente', bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-800' },
    analyzing: { label: 'Em Análise', bg: 'bg-cyan-950/80', text: 'text-cyan-300', border: 'border-cyan-800' },
    waiting_parts: { label: 'Aguardando Peça', bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-800' },
    repairing: { label: 'Em Reparo', bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-800' },
    completed: { label: 'Concluído', bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-800' },
    delivered: { label: 'Entregue ao Cliente', bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' },
  };

  // Metrics
  const totalRepairs = repairs.length;
  const pendingCount = repairs.filter((r) => r.status === 'pending' || r.status === 'analyzing').length;
  const inProgressCount = repairs.filter((r) => r.status === 'repairing' || r.status === 'waiting_parts').length;
  const completedCount = repairs.filter((r) => r.status === 'completed' || r.status === 'delivered').length;

  // Filtered list
  const filteredRepairs = repairs
    .filter((r) => {
      if (selectedDeviceFilter !== 'all' && r.deviceType !== selectedDeviceFilter) {
        return false;
      }
      if (selectedStatusFilter !== 'all' && r.status !== selectedStatusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchProtocol = r.protocol.toLowerCase().includes(q);
        const matchCustomer = r.customerName.toLowerCase().includes(q);
        const matchPhone = r.customerPhone.toLowerCase().includes(q);
        const matchModel = r.model.toLowerCase().includes(q);
        const matchBrand = r.brand.toLowerCase().includes(q);
        const matchDesc = r.problemDescription.toLowerCase().includes(q);
        return matchProtocol || matchCustomer || matchPhone || matchModel || matchBrand || matchDesc;
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleOpenEdit = (repair: RepairOrder) => {
    setEditingRepair(repair);
    setEditStatus(repair.status);
    setEditPrice(repair.quotedPrice ? String(repair.quotedPrice) : '');
    setEditNotes(repair.technicianNotes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRepair) return;

    const parsedPrice = editPrice ? parseFloat(editPrice.replace(',', '.')) : undefined;
    onUpdateRepairStatus(editingRepair.id, editStatus, parsedPrice, editNotes.trim());
    setEditingRepair(null);
  };

  const handleCopyProtocol = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header and Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20 text-white">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                Gestão de Assistência Técnica & Ordens de Serviço
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-red-950 text-red-300 border border-red-800 rounded-full">
                {totalRepairs} Chamados
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Acompanhe ordens de serviço recebidas pelo site, prazos (3 dias celular / 15 dias notebook) e contato com clientes.
            </p>
          </div>
        </div>

        {/* Quick Metric Chips */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="px-3 py-1.5 bg-amber-950/60 border border-amber-800/80 rounded-xl text-center">
            <span className="text-[10px] text-amber-400 block font-semibold">Pendentes</span>
            <strong className="text-sm text-white font-bold">{pendingCount}</strong>
          </div>
          <div className="px-3 py-1.5 bg-blue-950/60 border border-blue-800/80 rounded-xl text-center">
            <span className="text-[10px] text-blue-400 block font-semibold">Em Reparo</span>
            <strong className="text-sm text-white font-bold">{inProgressCount}</strong>
          </div>
          <div className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-center">
            <span className="text-[10px] text-emerald-400 block font-semibold">Concluídos</span>
            <strong className="text-sm text-white font-bold">{completedCount}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por protocolo, cliente, modelo, defeito..."
            className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Device Filter */}
        <div>
          <select
            value={selectedDeviceFilter}
            onChange={(e: any) => setSelectedDeviceFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-red-500 font-medium"
          >
            <option value="all">Todos os Dispositivos (Celular + Notebook)</option>
            <option value="smartphone">📱 Somente Celulares (~3 dias)</option>
            <option value="notebook">💻 Somente Notebooks (~15 dias)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatusFilter}
            onChange={(e: any) => setSelectedStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-red-500 font-medium"
          >
            <option value="all">Todos os Status de Reparo</option>
            <option value="pending">Pendente</option>
            <option value="analyzing">Em Análise Técnica</option>
            <option value="waiting_parts">Aguardando Peça</option>
            <option value="repairing">Em Reparo na Bancada</option>
            <option value="completed">Concluído (Pronto para Retirada)</option>
            <option value="delivered">Entregue ao Cliente</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredRepairs.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
          <Wrench className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhuma Ordem de Serviço Encontrada</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Não há chamados de assistência técnica correspondentes aos filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRepairs.map((repair) => {
            const cleanPhone = repair.customerPhone.replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(`Olá ${repair.customerName}, tudo bem? Aqui é da assistência técnica SmartAcessórios referente à sua Ordem de Serviço ${repair.protocol} do aparelho ${repair.brand} ${repair.model}.`)}`;
            const currentStatus = statusConfig[repair.status] || statusConfig.pending;

            return (
              <div
                key={repair.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl transition space-y-4"
              >
                {/* Top Row: Protocol, Device, Status, Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
                      <span>{repair.protocol}</span>
                      <button
                        onClick={() => handleCopyProtocol(repair.protocol, repair.id)}
                        className="text-slate-400 hover:text-white"
                        title="Copiar Protocolo"
                      >
                        {copiedId === repair.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </span>

                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1.5 ${
                      repair.deviceType === 'smartphone' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800' : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800'
                    }`}>
                      {repair.deviceType === 'smartphone' ? <Smartphone className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
                      <span>{repair.deviceType === 'smartphone' ? 'Celular' : 'Notebook'}</span>
                    </span>

                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}>
                      {currentStatus.label}
                    </span>

                    <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Prazo Estipulado: {repair.estimatedDays} dias</span>
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 flex items-center space-x-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Aberto em: {new Date(repair.createdAt).toLocaleDateString('pt-BR')}</span>
                  </span>
                </div>

                {/* Middle Grid: Device Specs & Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Device info */}
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                      Equipamento
                    </span>
                    <h4 className="text-sm font-black text-white">
                      {repair.brand} {repair.model}
                    </h4>
                    <span className="text-slate-400 block text-[11px]">
                      Ano de Fabricação: <strong className="text-slate-200">{repair.year}</strong>
                    </span>
                  </div>

                  {/* Customer details */}
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Cliente & Contato
                    </span>
                    <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{repair.customerName}</span>
                    </h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-slate-300 font-medium">{repair.customerPhone}</span>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-400" />
                        <span>Chamar WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Pricing & Tech note */}
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Orçamento & Técnico
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Valor Orçado:</span>
                      <strong className="text-sm text-emerald-400 font-bold">
                        {repair.quotedPrice
                          ? repair.quotedPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                          : 'Aguardando Avaliação'}
                      </strong>
                    </div>
                    {repair.technicianNotes && (
                      <p className="text-[11px] text-slate-300 italic truncate" title={repair.technicianNotes}>
                        "{repair.technicianNotes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Problem Description */}
                <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-bold block mb-1">
                    Relato do Defeito / Problema pelo Cliente:
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {repair.problemDescription}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-400">
                    Última atualização: {new Date(repair.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(repair)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Atualizar Status & Orçamento</span>
                    </button>

                    <button
                      onClick={() => onDeleteRepair(repair.id)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 transition"
                      title="Excluir Ordem de Serviço"
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

      {/* Edit Repair Modal */}
      {editingRepair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Atualizar OS: <span className="font-mono text-cyan-400">{editingRepair.protocol}</span>
                  </h3>
                  <span className="text-xs text-slate-400">{editingRepair.brand} {editingRepair.model}</span>
                </div>
              </div>

              <button
                onClick={() => setEditingRepair(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Status Atual da Ordem de Serviço
                </label>
                <select
                  value={editStatus}
                  onChange={(e: any) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  <option value="pending">Pendente (Recebido no site)</option>
                  <option value="analyzing">Em Análise Técnica (Bancada)</option>
                  <option value="waiting_parts">Aguardando Peça / Fornecedor</option>
                  <option value="repairing">Em Reparo / Montagem</option>
                  <option value="completed">Concluído (Pronto para Retirada)</option>
                  <option value="delivered">Entregue ao Cliente</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Valor Orçado do Reparo (R$)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="Ex: 350.00"
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Notas Técnicas do Especialista
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Ex: Tela original substituída e testada; bateria calibrada; pronto para entrega..."
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setEditingRepair(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
