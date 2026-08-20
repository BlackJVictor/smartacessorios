import React, { useState, useRef, useEffect } from 'react';
import { 
  Product, 
  ChatMessage 
} from '../types';
import { MarkdownView } from './MarkdownView';
import { 
  MessageSquareCode, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Copy, 
  Check, 
  RefreshCw, 
  Code2, 
  Zap, 
  Layers,
  Smartphone,
  Shield,
  Headphones,
  FileJson
} from 'lucide-react';

interface AIChatCopilotProps {
  products: Product[];
  activeProduct?: Product | null;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: `Olá! Sou o seu **Especialista em E-commerce, Arquitetura de Software e Copywriting Técnico**.

Estou preparado para apoiar você em todo o ciclo tecnológico da sua loja virtual focada em **Smartphones, Capinhas e Fones de Ouvido**:

* **✍️ Copywriting Técnico de Alta Conversão:** Títulos para Mercado Livre/Amazon, Fichas Técnicas em Markdown, especificações de engenharia de materiais e SEO.
* **🧩 Arquitetura de Software & Payloads JSON:** Contratos REST, Webhooks de sincronização de estoque WMS, modelagem de banco de dados e Schemas Schema.org.
* **📦 Engenharia de Estoque:** Cálculos de ROP (Reorder Point), Estoque de Segurança, estratégias de kits/cross-selling e prevenção de rupturas.

Como posso estruturar ou redigir o seu catálogo agora? Escolha um atalho abaixo ou digite sua solicitação.`,
    timestamp: new Date().toISOString(),
  },
];

const PROMPT_SHORTCUTS = [
  {
    label: '📄 Payload JSON para VTEX / ERP',
    prompt: 'Estruture um payload JSON completo e validado para a API de catálogo de um Smartphone topo de linha com Snapdragon 8 Gen 3, especificações de RAM LPDDR5X e estoque multi-armazém.',
  },
  {
    label: '✍️ Copy Técnico Fone ANC LDAC',
    prompt: 'Gere uma descrição técnica em Markdown para um headphone premium com cancelamento ativo de ruído de 38dB, drivers de fibra de carbono 30mm, suporte a codec LDAC e autonomia de 30 horas.',
  },
  {
    label: '🛡️ Matriz Capas Kevlar vs Silicone',
    prompt: 'Crie uma matriz comparativa de engenharia de materiais entre Capas de Fibra de Aramida (Kevlar 1500D) e Silicone Líquido com ímãs MagSafe Neodímio N52.',
  },
  {
    label: '📦 Estratégia de Estoque e ROP',
    prompt: 'Qual a fórmula recomendada de Ponto de Pedido (ROP) e Estoque de Segurança para uma loja de acessórios de smartphone com lead time de 14 dias e desvio de demanda?',
  },
  {
    label: '⚙️ Arquitetura de Microsserviços',
    prompt: 'Desenhe a arquitetura de software recomendada para desacoplar a ingestão de catálogo e a sincronização em tempo real de estoque entre o WMS e múltiplos canais de venda (Mercado Livre, Amazon, Loja Virtual).',
  },
];

export const AIChatCopilot: React.FC<AIChatCopilotProps> = ({
  products,
  activeProduct,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContextProductId, setSelectedContextProductId] = useState<string>(activeProduct?.id || 'none');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const contextProduct = products.find((p) => p.id === selectedContextProductId) || null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
          contextProduct: contextProduct,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro na resposta do copilot');
      }

      const assistantMessage: ChatMessage = {
        id: `assist-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Erro ao consultar especialista:** ${err.message || 'Falha na conexão com o servidor'}. Por favor, verifique se a chave GEMINI_API_KEY está configurada.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-violet-950/30 to-slate-900 p-4.5 rounded-2xl border border-violet-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/40">
            <MessageSquareCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">
              Copilot Especialista em E-commerce & Arquitetura Tech
            </h2>
            <p className="text-xs text-slate-300">
              Consultoria avançada de copywriting técnico, estruturas JSON, padrões REST/Event-Driven e logística.
            </p>
          </div>
        </div>

        {/* Product Context Selector */}
        <div className="flex items-center space-x-2 bg-slate-950/90 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium pl-1.5">Contexto:</span>
          <select
            value={selectedContextProductId}
            onChange={(e) => setSelectedContextProductId(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-700 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-violet-500"
          >
            <option value="none">🌐 Sem produto específico</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.category.toUpperCase()}] {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[650px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-950/50">
          {messages.map((msg) => {
            const isAssistant = msg.role === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
              >
                {isAssistant && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs space-y-2 relative group shadow-md ${
                  isAssistant 
                    ? 'bg-slate-900 border border-slate-800 text-slate-200' 
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium'
                }`}>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/80 pb-1 mb-1">
                    <span className="font-semibold text-slate-300">
                      {isAssistant ? 'Especialista Tech' : 'Você'}
                    </span>
                    <button
                      onClick={() => handleCopyMessage(msg.content, msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-white flex items-center space-x-1"
                      title="Copiar resposta"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  {isAssistant ? (
                    <MarkdownView content={msg.content} />
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  )}
                </div>

                {!isAssistant && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-medium text-cyan-300">Analisando arquitetura e especificações de hardware...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 overflow-x-auto flex items-center space-x-2">
          <span className="text-[10px] text-slate-400 font-mono flex items-center flex-shrink-0">
            <Sparkles className="w-3 h-3 mr-1 text-cyan-400" />
            Atalhos:
          </span>
          {PROMPT_SHORTCUTS.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(item.prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 text-[11px] font-medium border border-slate-800 whitespace-nowrap transition"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
          <input
            id="chat-input-field"
            type="text"
            placeholder="Pergunte sobre arquitetura de software, copy técnico para smartphones, capinhas ou fones..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />

          <button
            id="btn-send-chat-msg"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-600/20 transition active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
