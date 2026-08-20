import React from 'react';
import { useAccessibility, ContrastMode, FontSizeLevel } from '../context/AccessibilityContext';
import {
  Eye,
  Type,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  RotateCcw,
  X,
  Sparkles,
  Link,
  ZapOff,
  SplitSquareVertical,
  Sliders,
  Check
} from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetSettings,
    isToolbarOpen,
    setIsToolbarOpen,
    speakText,
    stopSpeaking,
    isSpeaking,
  } = useAccessibility();

  const handleReadCurrentPage = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const pageSummary =
        'Você está no SmartAcessórios. Loja especialista em smartphones premium, capinhas de alta proteção militar e fones de alta fidelidade sonora. Utilize os botões do painel para ajustar o tamanho da fonte, modos de alto contraste e guias de leitura conforme sua preferência.';
      speakText(pageSummary);
    }
  };

  return (
    <>
      {/* Botão Flutuante de Acessibilidade */}
      <button
        id="btn-accessibility-trigger"
        onClick={() => setIsToolbarOpen(!isToolbarOpen)}
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-2xl shadow-cyan-600/50 border-2 border-white/20 transition transform hover:scale-105 active:scale-95 flex items-center justify-center group focus:outline-none focus:ring-4 focus:ring-cyan-400"
        title="Menu de Acessibilidade Visual e Auditiva (Alt + A)"
        aria-label="Abrir menu de opções de acessibilidade"
        aria-expanded={isToolbarOpen}
      >
        <Eye className="w-6 h-6 group-hover:rotate-12 transition" />
        <span className="sr-only">Opções de Acessibilidade</span>
      </button>

      {/* Painel Lateral / Modal de Acessibilidade */}
      {isToolbarOpen && (
        <div
          role="dialog"
          aria-labelledby="accessibility-panel-title"
          aria-modal="true"
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-5 space-y-5 animate-scaleUp"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 id="accessibility-panel-title" className="text-sm font-bold text-white leading-tight">
                  Painel de Acessibilidade
                </h3>
                <span className="text-[10px] text-slate-400">Recursos de inclusão visual & áudio</span>
              </div>
            </div>
            <button
              onClick={() => setIsToolbarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Fechar painel de acessibilidade"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Tamanho do Texto */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Tamanho do Texto</span>
              <span className="text-[10px] text-cyan-400 uppercase font-bold">{settings.fontSize}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'normal', label: 'Normal (100%)', icon: 'A' },
                  { id: 'large', label: 'Grande (+20%)', icon: 'A+' },
                  { id: 'extralarge', label: 'Extra (+40%)', icon: 'A++' },
                ] as { id: FontSizeLevel; label: string; icon: string }[]
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => updateSettings({ fontSize: f.id })}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border ${
                    settings.fontSize === f.id
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                  aria-pressed={settings.fontSize === f.id}
                >
                  <span className="text-sm font-black">{f.icon}</span>
                  <span className="text-[9px] mt-0.5 opacity-90">{f.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Modos de Contraste e Cor */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Modos de Contraste e Cores</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSettings({ contrast: 'default' })}
                className={`p-2.5 rounded-xl text-left text-xs font-semibold transition border flex items-center justify-between ${
                  settings.contrast === 'default'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>Padrão Escuro</span>
                {settings.contrast === 'default' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              <button
                onClick={() => updateSettings({ contrast: 'high-contrast' })}
                className={`p-2.5 rounded-xl text-left text-xs font-semibold transition border flex items-center justify-between ${
                  settings.contrast === 'high-contrast'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>Alto Contraste</span>
                {settings.contrast === 'high-contrast' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              <button
                onClick={() => updateSettings({ contrast: 'monochrome' })}
                className={`p-2.5 rounded-xl text-left text-xs font-semibold transition border flex items-center justify-between ${
                  settings.contrast === 'monochrome'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>Escala de Cinza</span>
                {settings.contrast === 'monochrome' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              <button
                onClick={() => updateSettings({ contrast: 'yellow-on-black' })}
                className={`p-2.5 rounded-xl text-left text-xs font-semibold transition border flex items-center justify-between ${
                  settings.contrast === 'yellow-on-black'
                    ? 'bg-yellow-950 text-yellow-300 border-yellow-500'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>Amarelo / Preto (AAA)</span>
                {settings.contrast === 'yellow-on-black' && <Check className="w-3.5 h-3.5 text-yellow-400" />}
              </button>
            </div>
          </div>

          {/* 3. Recursos de Leitura e Foco */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Recursos de Leitura & Foco</label>

            {/* Fonte para Dislexia */}
            <button
              onClick={() => updateSettings({ dyslexicFont: !settings.dyslexicFont })}
              className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold transition border flex items-center justify-between ${
                settings.dyslexicFont
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Type className="w-4 h-4 text-cyan-400" />
                <span>Fonte Otimizada (Dislexia)</span>
              </div>
              <span className="text-[10px] uppercase font-bold">
                {settings.dyslexicFont ? 'Ativo' : 'Inativo'}
              </span>
            </button>

            {/* Guia de Leitura */}
            <button
              onClick={() => updateSettings({ readingGuide: !settings.readingGuide })}
              className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold transition border flex items-center justify-between ${
                settings.readingGuide
                  ? 'bg-yellow-950 text-yellow-300 border-yellow-500'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <SplitSquareVertical className="w-4 h-4 text-yellow-400" />
                <span>Linha Guia de Leitura</span>
              </div>
              <span className="text-[10px] uppercase font-bold">
                {settings.readingGuide ? 'Ativo' : 'Inativo'}
              </span>
            </button>

            {/* Destacar Links e Botões */}
            <button
              onClick={() => updateSettings({ highlightLinks: !settings.highlightLinks })}
              className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold transition border flex items-center justify-between ${
                settings.highlightLinks
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Link className="w-4 h-4 text-cyan-400" />
                <span>Destacar Links & Botões</span>
              </div>
              <span className="text-[10px] uppercase font-bold">
                {settings.highlightLinks ? 'Ativo' : 'Inativo'}
              </span>
            </button>

            {/* Redução de Movimento */}
            <button
              onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold transition border flex items-center justify-between ${
                settings.reducedMotion
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ZapOff className="w-4 h-4 text-cyan-400" />
                <span>Reduzir Animações</span>
              </div>
              <span className="text-[10px] uppercase font-bold">
                {settings.reducedMotion ? 'Ativo' : 'Inativo'}
              </span>
            </button>
          </div>

          {/* 4. Leitor de Tela em Voz Alta (Text-to-Speech) */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              onClick={handleReadCurrentPage}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 border shadow-sm ${
                isSpeaking
                  ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-500/50'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Parar Leitura em Voz Alta</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Ouvir Apresentação da Loja</span>
                </>
              )}
            </button>
          </div>

          {/* Footer & Reset */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={resetSettings}
              className="text-slate-400 hover:text-slate-200 flex items-center space-x-1.5 transition text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrões</span>
            </button>
            <span className="text-[10px] text-cyan-500 font-mono">WCAG 2.1 AA / AAA</span>
          </div>
        </div>
      )}
    </>
  );
};
