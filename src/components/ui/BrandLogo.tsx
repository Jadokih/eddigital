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
      {/* Símbolo Autoral: O Prisma Grid em Grafite Minimalista */}
      <svg
        width={pixelSizes.box}
        height={pixelSizes.box}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-hidden="true"
      >
        <rect
          width="64"
          height="64"
          rx="16"
          fill={isLight ? '#18181B' : '#09090B'}
        />
        <rect
          width="64"
          height="64"
          rx="16"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
        />

        {/* Quadrante Superior Esquerdo */}
        <path
          d="M32 12L16 22V38L32 28V12Z"
          fill="url(#prism-left)"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="0.75"
        />

        {/* Quadrante Superior Direito */}
        <path
          d="M32 12L48 22V38L32 28V12Z"
          fill="url(#prism-right)"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="0.75"
        />

        {/* Base do Prisma Grid */}
        <path
          d="M16 38L32 48L48 38L32 28L16 38Z"
          fill="url(#prism-base)"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.75"
        />

        {/* Linhas Conectoras do Grid de Construção */}
        <path
          d="M24 33L40 43"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M40 33L24 43"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Vértice Central Luminoso (Nó de Criação em Grafite Prateado) */}
        <circle cx="32" cy="28" r="3" fill="#E4E4E7" />
        <circle cx="32" cy="28" r="6" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" />

        <defs>
          <linearGradient id="prism-left" x1="16" y1="12" x2="32" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#27272A" />
            <stop offset="1" stopColor="#18181B" />
          </linearGradient>
          <linearGradient id="prism-right" x1="48" y1="12" x2="32" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3F3F46" />
            <stop offset="1" stopColor="#27272A" />
          </linearGradient>
          <linearGradient id="prism-base" x1="16" y1="28" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1F1F23" />
            <stop offset="1" stopColor="#111113" />
          </linearGradient>
        </defs>
      </svg>

      {/* Lettering Editorial Autoral com Tipografia Suave */}
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-serif tracking-tight font-normal ${
                isLight ? 'text-zinc-900' : 'text-zinc-100'
              } ${pixelSizes.text}`}
              style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
            >
              Founders
            </span>
            <span
              className={`font-sans font-medium tracking-wide ${
                isLight ? 'text-zinc-600' : 'text-zinc-400'
              }`}
              style={{ fontSize: size === 'lg' ? '1.15rem' : size === 'md' ? '0.9rem' : '0.8rem' }}
            >
              Grid
            </span>
          </div>
          <span
            className={`tracking-widest uppercase font-mono ${
              isLight ? 'text-zinc-500' : 'text-zinc-400'
            } ${pixelSizes.sub} mt-0.5`}
            style={{ letterSpacing: '0.12em' }}
          >
            Educação Digital
          </span>
        </div>
      )}
    </div>
  );
};
