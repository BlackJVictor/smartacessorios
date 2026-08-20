import React from 'react';
import logoImg from '../assets/images/smart_logo_1787165208646.jpg';

interface BrandLogoProps {
  subtitle?: string;
  badgeText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  subtitle = 'Smartphones • Capinhas • Fones de Ouvido',
  badgeText = 'OFICIAL',
  size = 'md',
}) => {
  const iconSize = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-13 h-13' : 'w-11 h-11';
  const titleSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className="flex items-center space-x-3 shrink-0 select-none">
      {/* Emblem Logo with Dark Sleek Theme */}
      <div className={`relative ${iconSize} rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-lg shadow-cyan-500/10 flex items-center justify-center group shrink-0 ring-1 ring-white/10`}>
        <img
          src={logoImg}
          alt="SmartAcessórios Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback if image fails to render
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Subtle glow border */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-cyan-400/20 pointer-events-none" />
      </div>

      {/* Typography */}
      <div>
        <div className="flex items-center space-x-2">
          <span className={`font-black ${titleSize} tracking-tight text-white leading-none`}>
            Smart<span className="text-red-500">Acessórios</span>
          </span>
          {badgeText && (
            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-gradient-to-r from-red-950 to-slate-900 text-red-300 border border-red-800/80 rounded-full tracking-wider uppercase shadow-sm">
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
