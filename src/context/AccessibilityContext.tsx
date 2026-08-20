import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSizeLevel = 'normal' | 'large' | 'extralarge';
export type ContrastMode = 'default' | 'high-contrast' | 'monochrome' | 'yellow-on-black';

export interface AccessibilitySettings {
  fontSize: FontSizeLevel;
  contrast: ContrastMode;
  dyslexicFont: boolean;
  highlightLinks: boolean;
  reducedMotion: boolean;
  readingGuide: boolean;
  lineSpacing: 'normal' | 'spacious';
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (partial: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  isToolbarOpen: boolean;
  setIsToolbarOpen: (open: boolean) => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'normal',
  contrast: 'default',
  dyslexicFont: false,
  highlightLinks: false,
  reducedMotion: false,
  readingGuide: false,
  lineSpacing: 'normal',
};

const STORAGE_KEY = 'smartacessorios_accessibility_v1';

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Erro ao carregar preferências de acessibilidade', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouseY, setMouseY] = useState(0);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Erro ao salvar preferências de acessibilidade', e);
    }
  }, [settings]);

  // Apply root classes and attributes based on settings
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.classList.remove('text-size-large', 'text-size-extralarge');
    if (settings.fontSize === 'large') root.classList.add('text-size-large');
    if (settings.fontSize === 'extralarge') root.classList.add('text-size-extralarge');

    // Contrast modes
    root.classList.remove('mode-high-contrast', 'mode-monochrome', 'mode-yellow-on-black');
    if (settings.contrast === 'high-contrast') root.classList.add('mode-high-contrast');
    if (settings.contrast === 'monochrome') root.classList.add('mode-monochrome');
    if (settings.contrast === 'yellow-on-black') root.classList.add('mode-yellow-on-black');

    // Dyslexic font
    if (settings.dyslexicFont) {
      root.classList.add('font-dyslexic');
    } else {
      root.classList.remove('font-dyslexic');
    }

    // Highlight links
    if (settings.highlightLinks) {
      root.classList.add('highlight-links');
    } else {
      root.classList.remove('highlight-links');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Line spacing
    if (settings.lineSpacing === 'spacious') {
      root.classList.add('line-spacing-spacious');
    } else {
      root.classList.remove('line-spacing-spacious');
    }
  }, [settings]);

  // Mouse move tracker for Reading Guide Line
  useEffect(() => {
    if (!settings.readingGuide) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.readingGuide]);

  const updateSettings = (partial: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    stopSpeaking();
  };

  // Text-to-Speech (Leitor de Tela / Voz)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis não é suportado neste navegador.');
      return;
    }

    window.speechSynthesis.cancel();

    if (!text || !text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        isToolbarOpen,
        setIsToolbarOpen,
        speakText,
        stopSpeaking,
        isSpeaking,
      }}
    >
      {/* Skip to Content Link (Navegação por teclado) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-cyan-500 focus:text-slate-950 focus:font-black focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white text-xs"
      >
        Pular para o conteúdo principal (Alt + 1)
      </a>

      {/* Reading Guide Line */}
      {settings.readingGuide && (
        <div
          className="pointer-events-none fixed left-0 right-0 z-[9998] h-1.5 bg-yellow-400 shadow-[0_0_14px_rgba(250,204,21,0.9)] transition-all duration-75"
          style={{ top: `${mouseY}px` }}
          aria-hidden="true"
        />
      )}

      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
