import React, { useState, useEffect } from 'react';
import { CustomerUser, UserNoteChecklist, UserChecklistItem, UserItemType, Order, RepairOrder } from '../../types';
import { isSupabaseConfigured, saveUserNoteChecklistToCloud, fetchUserNotesChecklistsFromCloud } from '../../lib/supabase';
import { 
  User, 
  CheckSquare, 
  FileText, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Cloud, 
  CloudOff, 
  Sparkles, 
  Clock, 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  ShoppingBag, 
  Wrench, 
  Edit2, 
  Save, 
  AlertCircle
} from 'lucide-react';

interface UserWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser;
  onUpdateUser: (updated: CustomerUser) => void;
  onLogout: () => void;
  userOrders?: Order[];
  userRepairs?: RepairOrder[];
}

export const UserWorkspaceModal: React.FC<UserWorkspaceModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onLogout,
  userOrders = [],
  userRepairs = [],
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'notes' | 'checklists' | 'events' | 'profile'>('notes');
  const [items, setItems] = useState<UserNoteChecklist[]>(() => {
    try {
      const saved = localStorage.getItem(`user_items_${currentUser.id}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load user items', e);
    }
    // Default welcome items for new users
    return [
      {
        id: `item-${Date.now()}-1`,
        userId: currentUser.id,
        type: 'note',
        title: 'Preferências de Acessórios & Modelos',
        content: 'Ficar de olho em lançamentos de capinhas em fibra de aramida e películas 9H para troca anual de aparelho.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `item-${Date.now()}-2`,
        userId: currentUser.id,
        type: 'checklist',
        title: 'Checklist de Manutenção & Acessórios',
        checklistItems: [
          { id: '1', text: 'Trocar película de vidro após 6 meses', done: true },
          { id: '2', text: 'Limpar conector de carga com ar comprimido', done: false },
          { id: '3', text: 'Verificar saúde da bateria no laboratório técnico', done: false },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `item-${Date.now()}-3`,
        userId: currentUser.id,
        type: 'event',
        title: 'Revisão Técnica Preventiva',
        content: 'Agendamento de limpeza interna do cooler e troca de pasta térmica.',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  });

  // New item inputs
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');
  const [tempChecklistItems, setTempChecklistItems] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Sync with cloud on mount if Supabase is active
  useEffect(() => {
    const loadCloudItems = async () => {
      if (isSupabaseConfigured()) {
        setIsCloudSyncing(true);
        const cloudData = await fetchUserNotesChecklistsFromCloud(currentUser.id);
        if (cloudData && cloudData.length > 0) {
          setItems(cloudData);
          localStorage.setItem(`user_items_${currentUser.id}`, JSON.stringify(cloudData));
        }
        setIsCloudSyncing(false);
      }
    };
    loadCloudItems();
  }, [currentUser.id]);

  // Persist locally & to cloud on changes
  const saveAndSyncItems = async (updatedList: UserNoteChecklist[]) => {
    setItems(updatedList);
    localStorage.setItem(`user_items_${currentUser.id}`, JSON.stringify(updatedList));

    if (isSupabaseConfigured()) {
      setIsCloudSyncing(true);
      for (const item of updatedList) {
        await saveUserNoteChecklistToCloud(item);
      }
      setIsCloudSyncing(false);
    }
  };

  const handleCreateNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let itemType: UserItemType = 'note';
    if (activeTab === 'checklists') itemType = 'checklist';
    if (activeTab === 'events') itemType = 'event';

    const newItem: UserNoteChecklist = {
      id: `item-${Date.now()}`,
      userId: currentUser.id,
      type: itemType,
      title: newTitle.trim(),
      content: newContent.trim() || undefined,
      dueDate: newDueDate || undefined,
      checklistItems: itemType === 'checklist' ? tempChecklistItems : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newItem, ...items];
    await saveAndSyncItems(updated);

    // Reset inputs
    setNewTitle('');
    setNewContent('');
    setNewDueDate('');
    setTempChecklistItems([]);
    setIsAddingItem(false);
  };

  const handleAddTempChecklistEntry = () => {
    if (!newChecklistText.trim()) return;
    setTempChecklistItems((prev) => [
      ...prev,
      { id: String(Date.now()), text: newChecklistText.trim(), done: false },
    ]);
    setNewChecklistText('');
  };

  const handleToggleChecklistItem = async (itemId: string, checkId: string) => {
    const updated = items.map((item) => {
      if (item.id === itemId && item.checklistItems) {
        const updatedChecklist = item.checklistItems.map((c) =>
          c.id === checkId ? { ...c, done: !c.done } : c
        );
        return { ...item, checklistItems: updatedChecklist, updatedAt: new Date().toISOString() };
      }
      return item;
    });
    await saveAndSyncItems(updated);
  };

  const handleDeleteItem = async (itemId: string) => {
    const updated = items.filter((i) => i.id !== itemId);
    await saveAndSyncItems(updated);
  };

  const cloudActive = isSupabaseConfigured();

  // Filter items by active tab
  const displayedItems = items.filter((item) => {
    if (activeTab === 'notes') return item.type === 'note';
    if (activeTab === 'checklists') return item.type === 'checklist';
    if (activeTab === 'events') return item.type === 'event' || item.type === 'reminder';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl my-6 flex flex-col relative max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-600/20 font-black text-lg">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-white">{currentUser.name}</h2>
                {cloudActive ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
                    <Cloud className="w-3 h-3 text-emerald-400" />
                    <span>Supabase Conectado</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1">
                    <CloudOff className="w-3 h-3 text-slate-400" />
                    <span>Armazenamento Local Ativo</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">{currentUser.email} • {currentUser.phone}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950/80 px-6 pt-3 border-b border-slate-800 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setActiveTab('notes'); setIsAddingItem(false); }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
                activeTab === 'notes'
                  ? 'bg-slate-900 text-cyan-400 border-cyan-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Minhas Notas</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {items.filter((i) => i.type === 'note').length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('checklists'); setIsAddingItem(false); }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
                activeTab === 'checklists'
                  ? 'bg-slate-900 text-emerald-400 border-emerald-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Checklists</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {items.filter((i) => i.type === 'checklist').length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('events'); setIsAddingItem(false); }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
                activeTab === 'events'
                  ? 'bg-slate-900 text-amber-400 border-amber-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Eventos & Lembretes</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {items.filter((i) => i.type === 'event' || i.type === 'reminder').length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('profile'); setIsAddingItem(false); }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-violet-400 border-violet-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Dados da Conta</span>
            </button>
          </div>

          {activeTab !== 'profile' && (
            <button
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-1.5 transition mb-2 shrink-0 shadow-md shadow-cyan-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingItem ? 'Fechar Criação' : 'Novo Item'}</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-slate-900">
          {/* Adding Form Block */}
          {isAddingItem && (
            <form onSubmit={handleCreateNewItem} className="p-5 bg-slate-950 rounded-2xl border border-cyan-900/60 space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {activeTab === 'notes' && 'Criar Nova Nota'}
                  {activeTab === 'checklists' && 'Criar Novo Checklist'}
                  {activeTab === 'events' && 'Agendar Evento / Lembrete'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {cloudActive ? 'Sincronizado automaticamente no Supabase' : 'Salvo localmente com segurança'}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Título *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    activeTab === 'notes'
                      ? 'Ex: Especificações do meu próximo iPhone'
                      : activeTab === 'checklists'
                      ? 'Ex: Itens para viagem & trabalho'
                      : 'Ex: Fim da garantia do notebook'
                  }
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              {activeTab === 'notes' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Conteúdo da Nota</label>
                  <textarea
                    rows={3}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Escreva suas anotações, referências de modelos, preços ou ideias..."
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {activeTab === 'events' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Data Prevista *</label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Detalhes Adicionais</label>
                    <input
                      type="text"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Ex: Levar carregador original na assistência"
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'checklists' && (
                <div className="space-y-3">
                  <label className="block text-[11px] font-semibold text-slate-300">Itens da Lista</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newChecklistText}
                      onChange={(e) => setNewChecklistText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTempChecklistEntry();
                        }
                      }}
                      placeholder="Digite um item e aperte Adicionar ou Enter..."
                      className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddTempChecklistEntry}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700"
                    >
                      Adicionar Item
                    </button>
                  </div>

                  {tempChecklistItems.length > 0 && (
                    <div className="space-y-1.5 p-3 bg-slate-900 rounded-xl border border-slate-800 max-h-32 overflow-y-auto">
                      {tempChecklistItems.map((item, idx) => (
                        <div key={item.id} className="flex items-center justify-between text-xs text-slate-200">
                          <span>• {item.text}</span>
                          <button
                            type="button"
                            onClick={() => setTempChecklistItems(prev => prev.filter((_, i) => i !== idx))}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20"
                >
                  Salvar Item
                </button>
              </div>
            </form>
          )}

          {/* Tab 1, 2, 3: Items Grid */}
          {activeTab !== 'profile' && (
            <div>
              {displayedItems.length === 0 ? (
                <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-3">
                  <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    Nenhum item cadastrado nesta categoria ainda. Clique em <strong>"Novo Item"</strong> para criar.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 transition"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.content && (
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-wrap">
                            {item.content}
                          </p>
                        )}

                        {/* Checklist Entries */}
                        {item.type === 'checklist' && item.checklistItems && item.checklistItems.length > 0 && (
                          <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-800/80">
                            {item.checklistItems.map((c) => (
                              <div
                                key={c.id}
                                onClick={() => handleToggleChecklistItem(item.id, c.id)}
                                className="flex items-center space-x-2 text-xs cursor-pointer select-none p-1 rounded-lg hover:bg-slate-900 transition"
                              >
                                <input
                                  type="checkbox"
                                  checked={c.done}
                                  onChange={() => {}}
                                  className="rounded text-emerald-500 focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-700"
                                />
                                <span className={c.done ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}>
                                  {c.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Due date tag */}
                        {item.dueDate && (
                          <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-900/50 w-fit font-medium">
                            <Clock className="w-3 h-3" />
                            <span>Data: {new Date(item.dueDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/50 flex items-center justify-between">
                        <span>Atualizado em {new Date(item.updatedAt).toLocaleDateString('pt-BR')}</span>
                        <span className="font-mono text-cyan-400/80">{cloudActive ? '☁️ Supabase Cloud' : '💾 Local Storage'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Profile & Saved Addresses & Cloud Info */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Details Card */}
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  Informações Pessoais do Usuário
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Nome Completo</span>
                    <strong className="text-white text-sm">{currentUser.name}</strong>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">E-mail de Acesso</span>
                    <strong className="text-white text-sm font-mono">{currentUser.email}</strong>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">WhatsApp / Telefone</span>
                    <strong className="text-white text-sm font-mono">{currentUser.phone}</strong>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">CPF do Titular</span>
                    <strong className="text-white text-sm font-mono">{currentUser.cpf}</strong>
                  </div>
                </div>

                {currentUser.address && (
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 block text-[11px] font-semibold">Endereço de Entrega Principal</span>
                    <p className="text-slate-200">
                      {currentUser.address.street}, {currentUser.address.number} {currentUser.address.complement && `- ${currentUser.address.complement}`}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {currentUser.address.neighborhood} • {currentUser.address.city}/{currentUser.address.state} • CEP: {currentUser.address.zipCode}
                    </p>
                  </div>
                )}
              </div>

              {/* Supabase Cloud Connection Status Card */}
              <div className="p-5 bg-gradient-to-r from-indigo-950/60 to-slate-950 rounded-2xl border border-indigo-900/60 space-y-3">
                <div className="flex items-center space-x-2.5">
                  <Cloud className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">Status da Conexão com Supabase Database</h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {cloudActive
                    ? 'Seu projeto está conectado ao banco de dados Supabase Cloud. Todos os seus cadastros, notas, eventos, checklists e compras são sincronizados com replicação em nuvem.'
                    : 'O banco de dados está operando em modo Local Storage seguro com suporte automático ao Supabase assim que as credenciais forem adicionadas nos Secrets.'}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                    Tabela: <code>customers</code>
                  </span>
                  <span className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                    Tabela: <code>user_notes_checklists</code>
                  </span>
                  <span className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                    Tabela: <code>orders</code>
                  </span>
                  <span className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                    Tabela: <code>repair_orders</code>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold transition"
          >
            Sair da Conta
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
