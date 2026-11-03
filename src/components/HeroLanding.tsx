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
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#060B14] text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. FUNDO CINEMATOGRÁFICO: VÍDEO ATMOSFÉRICO COM FALLBACK */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Imagem estática de fallback / poster com luz difusa azul-petróleo */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            videoLoaded && !prefersReducedMotion && !videoFailed ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 30%, rgba(16, 231, 157, 0.08) 0%, rgba(10, 29, 55, 0.6) 45%, #060B14 85%)',
          }}
        />

        {/* Vídeo Cinematográfico de Fundo */}
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
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-40' : 'opacity-0'
            }`}
          />
        )}

        {/* Camada de Gradiente Noturno para Máximo Contraste e Legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060B14]/85 via-[#060B14]/65 to-[#060B14]/95" />

        {/* Efeito sutil de iluminação esmeralda ambiente */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. BARRA SUPERIOR DISCRETA (LIQUID GLASS) */}
      <header className="relative z-20 w-full px-6 sm:px-10 py-5 flex items-center justify-between border-b border-white/10 bg-[#060B14]/40 backdrop-blur-md">
        <BrandLogo size="md" variant="full" theme="dark" />

        <div className="flex items-center gap-4">
          <a
            href="#/professor"
            className="text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/15 bg-white/[0.02]"
          >
            Acesso do Professor
          </a>
        </div>
      </header>

      {/* 3. CONTEÚDO PRINCIPAL: APRESENTAÇÃO EDITORIAL CINEMATOGRÁFICA */}
      <main className="relative z-20 max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24 text-center flex-1 flex flex-col justify-center items-center">
        {/* Badge Institucional Minimalista */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-slate-300 mb-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Educação Digital • Ensino Médio</span>
        </div>

        {/* Título com Instrument Serif */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white font-normal tracking-tight leading-[1.08] mb-6 drop-shadow-md animate-in fade-in slide-in-from-bottom-3 duration-700"
          style={{ fontFamily: "'Instrument Serif', 'Newsreader', serif" }}
        >
          Bem-vindo ao Founders Grid.
        </h1>

        {/* Subtítulo Editorial */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed mb-10 sm:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Transforme ideias em empresas, explore desafios reais e desenvolva suas habilidades digitais.
        </p>

        {/* 4. APENAS DOIS BOTÕES DE AÇÃO (GRANDES, EQUILIBRADOS E CLAROS) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Botão 1: Já tenho uma empresa */}
          <button
            type="button"
            onClick={onOpenSignIn}
            className="w-full sm:w-auto min-w-[220px] py-4 px-8 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm sm:text-base transition-all duration-200 cursor-pointer shadow-xl hover:shadow-2xl flex items-center justify-center gap-2.5 group"
          >
            <LogIn className="w-4 h-4 text-slate-800 transition-transform group-hover:-translate-x-0.5" />
            <span>Já tenho uma empresa</span>
          </button>

          {/* Botão 2: Criar Nova Empresa */}
          <button
            type="button"
            onClick={onOpenSignUp}
            className="w-full sm:w-auto min-w-[220px] py-4 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm sm:text-base transition-all duration-200 cursor-pointer shadow-xl hover:shadow-emerald-500/20 flex items-center justify-center gap-2.5 group"
          >
            <Building2 className="w-4 h-4 text-slate-950 transition-transform group-hover:scale-110" />
            <span>Criar Nova Empresa</span>
            <ArrowRight className="w-4 h-4 text-slate-950 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </main>

      {/* 5. RODAPÉ CINEMATOGRÁFICO: CRÉDITO DISCRETO E ELEGANTE */}
      <footer className="relative z-20 w-full px-6 py-6 text-center border-t border-white/5 bg-[#060B14]/30 backdrop-blur-xs">
        <p className="text-xs sm:text-sm text-slate-400 font-light tracking-wide">
          Feito com 🤍 por Jade Pereira
        </p>
      </footer>
    </div>
  );
};
