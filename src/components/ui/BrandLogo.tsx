import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'symbol';
  theme?: 'dark' | 'light';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'full',
  theme = 'light',
  className = '',
}) => {
  const pixelSizes = {
    sm: { box: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { box: 34, text: 'text-lg', sub: 'text-[10px]' },
    lg: { box: 44, text: 'text-2xl', sub: 'text-xs' },
  }[size];

  const isLight = theme === 'light';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Símbolo Autoral: O Prisma Grid */}
      <svg
        width={pixelSizes.box}
        height={pixelSizes.box}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        aria-hidden="true"
      >
        <rect
          width="64"
          height="64"
          rx="16"
          fill={isLight ? '#0B1726' : '#070B14'}
        />
        <rect
          width="64"
          height="64"
          rx="16"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
        />

        {/* Quadrante Superior Esquerdo */}
        <path
          d="M32 12L16 22V38L32 28V12Z"
          fill="url(#prism-left)"
          stroke="#0E2338"
          strokeWidth="0.75"
        />

        {/* Quadrante Superior Direito */}
        <path
          d="M32 12L48 22V38L32 28V12Z"
          fill="url(#prism-right)"
          stroke="#0E2338"
          strokeWidth="0.75"
        />

        {/* Base do Prisma Grid */}
        <path
          d="M16 38L32 48L48 38L32 28L16 38Z"
          fill="url(#prism-base)"
          stroke="rgba(16, 231, 157, 0.25)"
          strokeWidth="0.75"
        />

        {/* Linhas Conectoras do Grid de Construção */}
        <path
          d="M24 33L40 43"
          stroke="rgba(16, 231, 157, 0.4)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M40 33L24 43"
          stroke="rgba(16, 231, 157, 0.4)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Vértice Central Luminoso (Nó de Criação) */}
        <circle cx="32" cy="28" r="3" fill="#10E79D" />
        <circle cx="32" cy="28" r="7" stroke="rgba(16, 231, 157, 0.35)" strokeWidth="1" />

        <defs>
          <linearGradient id="prism-left" x1="16" y1="12" x2="32" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10253B" />
            <stop offset="1" stopColor="#081420" />
          </linearGradient>
          <linearGradient id="prism-right" x1="48" y1="12" x2="32" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#183D5C" />
            <stop offset="1" stopColor="#0A1D2D" />
          </linearGradient>
          <linearGradient id="prism-base" x1="16" y1="28" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A2230" />
            <stop offset="1" stopColor="#06131D" />
          </linearGradient>
        </defs>
      </svg>

      {/* Lettering Editorial Autoral */}
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1">
            <span
              className={`font-serif tracking-tight font-medium ${
                isLight ? 'text-slate-900' : 'text-slate-100'
              } ${pixelSizes.text}`}
              style={{ fontFamily: "'Newsreader', serif" }}
            >
              Founders
            </span>
            <span
              className={`font-sans font-semibold tracking-wider ${
                isLight ? 'text-emerald-700' : 'text-emerald-400'
              }`}
              style={{ fontSize: size === 'lg' ? '1.25rem' : size === 'md' ? '0.95rem' : '0.85rem' }}
            >
              Grid
            </span>
          </div>
          <span
            className={`tracking-widest uppercase font-mono ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            } ${pixelSizes.sub} mt-0.5`}
            style={{ letterSpacing: '0.14em' }}
          >
            Educação Digital
          </span>
        </div>
      )}
    </div>
  );
};

