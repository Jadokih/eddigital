import React, { useEffect, useRef, useState } from 'react';
import { BrandLogo } from './ui/BrandLogo';
import { ArrowRight, LogIn, Building2 } from 'lucide-react';

interface HeroLandingProps {
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
}

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onOpenSignIn,
  onOpenSignUp,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, [prefersReducedMotion]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#09090B] text-white selection:bg-zinc-700 selection:text-white">
      {/* 1. FUNDO CINEMATOGRÁFICO: VÍDEO DIRETO E NÍTIDO (SEM CAMADA DE SOBREPOSIÇÃO ESCURA) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Imagem estática de fallback com atmosfera de grafite suave */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            videoLoaded && !prefersReducedMotion && !videoFailed ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.05) 0%, rgba(24, 24, 27, 0.8) 50%, #09090B 100%)',
          }}
        />

        {/* Vídeo em nitidez original, sem overlay colorido */}
        {!prefersReducedMotion && !videoFailed && (
          <video
            ref={videoRef}
            src={VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoFailed(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>

      {/* 2. BARRA SUPERIOR TRANSLÚCIDA EM LIQUID GLASS DISCRETO */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-6 flex items-center justify-between">
        <BrandLogo size="md" variant="full" theme="dark" />

        <div className="flex items-center gap-4">
          <a
            href="#/professor"
            className="text-xs font-mono text-zinc-300 hover:text-white transition-colors px-4 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 backdrop-blur-md"
          >
            Acesso do Professor
          </a>
        </div>
      </header>

      {/* 3. CONTEÚDO PRINCIPAL INSPIRADO NA REFERÊNCIA (TIPOGRAFIA SUAVE E HARMONIOSA) */}
      <main className="relative z-20 max-w-4xl mx-auto px-6 sm:px-8 py-10 text-center flex-1 flex flex-col justify-center items-center">
        {/* Título com Instrument Serif elegante e proporção serena */}
        <h1
          className="text-3xl sm:text-5xl md:text-6xl font-serif text-white font-normal tracking-tight leading-[1.18] mb-5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]"
          style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
        >
          Bem-vindo ao <span className="italic font-normal">Founders Grid</span>.
        </h1>

        {/* Subtítulo Editorial calmo e legível */}
        <p className="text-xs sm:text-sm md:text-base text-zinc-200/90 max-w-xl font-normal leading-relaxed mb-9 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
          Transforme ideias em empresas, explore desafios reais e desenvolva suas habilidades digitais.
        </p>

        {/* 4. BOTÕES DE AÇÃO: LIQUID GLASS E GRAFITE MODERNO */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          {/* Botão 1: Já tenho uma empresa (Liquid Glass Suave) */}
          <button
            type="button"
            onClick={onOpenSignIn}
            className="w-full sm:w-auto px-7 py-2.5 sm:py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 hover:border-white/40 text-white font-medium text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-lg flex items-center justify-center gap-2 group"
          >
            <LogIn className="w-3.5 h-3.5 text-zinc-200 transition-transform group-hover:-translate-x-0.5" />
            <span>Já tenho uma empresa</span>
          </button>

          {/* Botão 2: Criar Nova Empresa (Grafite Moderno com Liquid Glass) */}
          <button
            type="button"
            onClick={onOpenSignUp}
            className="w-full sm:w-auto px-7 py-2.5 sm:py-3 rounded-full bg-zinc-950/75 hover:bg-zinc-900/90 backdrop-blur-md border border-white/20 hover:border-white/40 text-white font-medium text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-xl flex items-center justify-center gap-2 group"
          >
            <Building2 className="w-3.5 h-3.5 text-zinc-300 transition-transform group-hover:scale-105" />
            <span>Criar Nova Empresa</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-300 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </main>

      {/* 5. RODAPÉ DISCRETO FLUTUANTE */}
      <footer className="relative z-20 w-full px-6 py-6 text-center">
        <p className="text-xs text-zinc-400 font-light tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          Feito com 🤍 por Jade Pereira
        </p>
      </footer>
    </div>
  );
};
