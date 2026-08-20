import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Type, 
  Sun, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  X, 
  Maximize2, 
  Minimize2, 
  Sparkles,
  MousePointer,
  AlignLeft,
  Check
} from 'lucide-react';

export interface AccessibilitySettings {
  fontSizeLevel: number; // 0 = 100%, 1 = 110%, 2 = 120%, 3 = 130%
  highContrast: boolean;
  monochrome: boolean;
  dyslexiaFont: boolean;
  increasedLineHeight: boolean;
  largeCursor: boolean;
  screenReaderVoice: boolean;
  underlineLinks: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSizeLevel: 0,
  highContrast: false,
  monochrome: false,
  dyslexiaFont: false,
  increasedLineHeight: false,
  largeCursor: false,
  screenReaderVoice: false,
  underlineLinks: false,
};

const A11Y_STORAGE_KEY = 'smartacessorios_a11y_v1';

export const AccessibilityWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(A11Y_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load a11y settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Apply settings to document root
  useEffect(() => {
    try {
      localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save a11y settings', e);
    }

    const root = document.documentElement;
    const body = document.body;

    // Font size scaling
    const fontScales = ['100%', '110%', '120%', '130%'];
    root.style.fontSize = fontScales[settings.fontSizeLevel] || '100%';

    // High Contrast
    if (settings.highContrast) {
      root.classList.add('a11y-high-contrast');
    } else {
      root.classList.remove('a11y-high-contrast');
    }

    // Monochrome
    if (settings.monochrome) {
      root.classList.add('a11y-monochrome');
    } else {
      root.classList.remove('a11y-monochrome');
    }

    // Dyslexia-friendly Font
    if (settings.dyslexiaFont) {
      body.classList.add('a11y-dyslexia');
    } else {
      body.classList.remove('a11y-dyslexia');
    }

    // Line Height
    if (settings.increasedLineHeight) {
      body.classList.add('a11y-line-height');
    } else {
      body.classList.remove('a11y-line-height');
    }

    // Large Cursor
    if (settings.largeCursor) {
      body.classList.add('a11y-large-cursor');
    } else {
      body.classList.remove('a11y-large-cursor');
    }

    // Underline links
    if (settings.underlineLinks) {
      body.classList.add('a11y-underline-links');
    } else {
      body.classList.remove('a11y-underline-links');
    }
  }, [settings]);

  // Voice narration helper
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta leitura por voz nativa.');
      return;
    }

    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const readPageOverview = () => {
    const activeText = `Você está na loja SmartAcessórios. Especialista em Smartphones de última geração, Capinhas de alta proteção, Fones de Ouvido Wi-Fi e Assistência Técnica Especializada com prazo de 3 dias para celulares e 15 dias para notebooks. Use a barra de busca ou navegue pelas categorias de produtos.`;
    speakText(activeText);
  };

  const handleReset = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <>
      {/* Floating Accessibility Trigger Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          id="btn-accessibility-menu"
          aria-label="Abrir Menu de Acessibilidade"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3.5 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-2xl shadow-cyan-600/50 transition transform hover:scale-105 active:scale-95 border-2 border-white/20 focus:outline-none focus:ring-4 focus:ring-cyan-400"
          title="Opções de Acessibilidade (Tamanho da fonte, alto contraste, leitor de voz)"
        >
          <Eye className="w-5 h-5 text-white animate-pulse" />
          <span className="text-xs font-bold hidden sm:inline">Acessibilidade</span>
        </button>
      </div>

      {/* Accessibility Settings Drawer / Modal */}
      {isOpen && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-label="Painel de Ferramentas de Acessibilidade"
          className="fixed bottom-20 left-4 sm:left-6 z-50 w-[92vw] max-w-sm bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-3xl p-5 shadow-2xl shadow-black/80 text-white animate-fadeIn"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Menu de Acessibilidade</h3>
                <p className="text-[10px] text-slate-400">Personalize sua experiência de navegação</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fechar menu de acessibilidade"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* 1. Tamanho da Fonte */}
            <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                  <Type className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tamanho do Texto</span>
                </span>
                <span className="text-[11px] font-mono text-cyan-400 font-bold">
                  {settings.fontSizeLevel === 0 && '100% (Padrão)'}
                  {settings.fontSizeLevel === 1 && '110% (Médio)'}
                  {settings.fontSizeLevel === 2 && '120% (Grande)'}
                  {settings.fontSizeLevel === 3 && '130% (Extra)'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[0, 1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSettings((s) => ({ ...s, fontSizeLevel: lvl }))}
                    className={`py-1.5 rounded-xl text-xs font-bold transition border ${
                      settings.fontSizeLevel === lvl
                        ? 'bg-cyan-600 border-cyan-400 text-white shadow-md shadow-cyan-600/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {lvl === 0 ? 'A' : lvl === 1 ? 'A+' : lvl === 2 ? 'A++' : 'A+++'}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Leitor de Texto por Voz */}
            <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Leitor de Página por Voz</span>
                </span>
                <p className="text-[10px] text-slate-400">Ouve o resumo da loja em português</p>
              </div>

              <button
                onClick={readPageOverview}
                aria-label={isSpeaking ? 'Parar leitura por voz' : 'Iniciar leitura por voz'}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition border ${
                  isSpeaking
                    ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                    : 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Parar' : 'Ouvir'}</span>
              </button>
            </div>

            {/* 3. Toggles de Contraste e Visual */}
            <div className="space-y-2">
              {/* Alto Contraste */}
              <button
                onClick={() => setSettings((s) => ({ ...s, highContrast: !s.highContrast }))}
                className={`w-full p-2.5 rounded-2xl border flex items-center justify-between text-xs font-semibold transition ${
                  settings.highContrast
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modo Alto Contraste</span>
                </div>
                {settings.highContrast && <Check className="w-4 h-4 text-amber-400" />}
              </button>

              {/* Fonte Amigável para Dislexia */}
              <button
                onClick={() => setSettings((s) => ({ ...s, dyslexiaFont: !s.dyslexiaFont }))}
                className={`w-full p-2.5 rounded-2xl border flex items-center justify-between text-xs font-semibold transition ${
                  settings.dyslexiaFont
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Fonte para Dislexia</span>
                </div>
                {settings.dyslexiaFont && <Check className="w-4 h-4 text-indigo-400" />}
              </button>

              {/* Espaçamento de Linha Aumentado */}
              <button
                onClick={() => setSettings((s) => ({ ...s, increasedLineHeight: !s.increasedLineHeight }))}
                className={`w-full p-2.5 rounded-2xl border flex items-center justify-between text-xs font-semibold transition ${
                  settings.increasedLineHeight
                    ? 'bg-teal-950/60 border-teal-500 text-teal-300'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <AlignLeft className="w-3.5 h-3.5 text-teal-400" />
                  <span>Espaçamento de Linhas Maior</span>
                </div>
                {settings.increasedLineHeight && <Check className="w-4 h-4 text-teal-400" />}
              </button>

              {/* Sublinhar Links */}
              <button
                onClick={() => setSettings((s) => ({ ...s, underlineLinks: !s.underlineLinks }))}
                className={`w-full p-2.5 rounded-2xl border flex items-center justify-between text-xs font-semibold transition ${
                  settings.underlineLinks
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Type className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Destacar / Sublinhar Links</span>
                </div>
                {settings.underlineLinks && <Check className="w-4 h-4 text-cyan-400" />}
              </button>

              {/* Cursor Ampliado */}
              <button
                onClick={() => setSettings((s) => ({ ...s, largeCursor: !s.largeCursor }))}
                className={`w-full p-2.5 rounded-2xl border flex items-center justify-between text-xs font-semibold transition ${
                  settings.largeCursor
                    ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MousePointer className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cursor Ampliado</span>
                </div>
                {settings.largeCursor && <Check className="w-4 h-4 text-purple-400" />}
              </button>
            </div>
          </div>

          {/* Footer Reset */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-rose-300 flex items-center space-x-1 transition font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar Padrões</span>
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
            >
              Pronto
            </button>
          </div>
        </div>
      )}
    </>
  );
};
