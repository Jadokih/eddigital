import React, { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, Image as ImageIcon, Check } from 'lucide-react';

interface LogoGeneratorProps {
  companyName: string;
  currentLogoUrl?: string | null;
  onLogoChange: (file: File | null, dataUrl: string | null) => void;
}

const GRADIENTS = [
  { id: 'indigo-purple', name: 'Índigo Real', class: 'from-indigo-600 to-purple-600', textClass: 'text-white' },
  { id: 'blue-cyan', name: 'Oceano Digital', class: 'from-blue-600 to-cyan-500', textClass: 'text-white' },
  { id: 'emerald-teal', name: 'Bio & Verde', class: 'from-emerald-600 to-teal-500', textClass: 'text-white' },
  { id: 'amber-orange', name: 'Energia Solar', class: 'from-amber-500 to-orange-600', textClass: 'text-white' },
  { id: 'rose-pink', name: 'Criativo & Coral', class: 'from-rose-500 to-pink-600', textClass: 'text-white' },
  { id: 'slate-zinc', name: 'Minimalista Escuro', class: 'from-slate-800 to-slate-950', textClass: 'text-indigo-400' },
];

export const LogoGenerator: React.FC<LogoGeneratorProps> = ({
  companyName,
  currentLogoUrl,
  onLogoChange,
}) => {
  const [mode, setMode] = useState<'upload' | 'generate'>('generate');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
  const [customInitials, setCustomInitials] = useState('');
  const [shape, setShape] = useState<'rounded-2xl' | 'rounded-full' | 'rounded-xl'>('rounded-2xl');
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deriva as iniciais automáticas a partir do nome da empresa
  const derivedInitials = (companyName || 'Empresa')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

  const activeInitials = customInitials.trim() || derivedInitials || 'FG';

  // Gera o logo monograma em SVG e converte para DataURL
  const generateSvgDataUrl = (initials: string, gradient: typeof GRADIENTS[0], shapeType: string) => {
    const rx = shapeType === 'rounded-full' ? '50%' : shapeType === 'rounded-2xl' ? '28' : '16';
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${getGradientStop(gradient.id, 0)}" />
            <stop offset="100%" stop-color="${getGradientStop(gradient.id, 1)}" />
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="${rx}" fill="url(#grad)" />
        <text x="50%" y="54%" dominant-baseline="central" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="44" fill="#ffffff" letter-spacing="1">
          ${initials}
        </text>
      </svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  };

  const getGradientStop = (id: string, index: number) => {
    switch (id) {
      case 'indigo-purple':
        return index === 0 ? '#4f46e5' : '#9333ea';
      case 'blue-cyan':
        return index === 0 ? '#2563eb' : '#06b6d4';
      case 'emerald-teal':
        return index === 0 ? '#059669' : '#14b8a6';
      case 'amber-orange':
        return index === 0 ? '#f59e0b' : '#ea580c';
      case 'rose-pink':
        return index === 0 ? '#f43f5e' : '#db2777';
      case 'slate-zinc':
        return index === 0 ? '#1e293b' : '#020617';
      default:
        return index === 0 ? '#4f46e5' : '#9333ea';
    }
  };

  // Atualiza o SVG gerado sempre que os parâmetros mudam (se estiver no modo gerador)
  useEffect(() => {
    if (mode === 'generate') {
      const dataUrl = generateSvgDataUrl(activeInitials, selectedGradient, shape);
      setPreviewUrl(dataUrl);
      onLogoChange(null, dataUrl);
    }
  }, [activeInitials, selectedGradient, shape, mode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('O arquivo da imagem é muito grande. Escolha uma imagem de até 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onLogoChange(file, result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Logotipo da Empresa
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Envie uma imagem do computador ou gere um monograma com as iniciais.
          </p>
        </div>

        {/* Alternador de Modo */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('generate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'generate'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Criar com Iniciais
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'upload'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Enviar Imagem
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Preview do Logotipo */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative group">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shadow-md overflow-hidden border-2 border-white ring-2 ring-slate-200 transition-all ${shape}`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Pré-visualização do logotipo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${selectedGradient.class} flex items-center justify-center text-white font-bold text-2xl`}>
                  {activeInitials}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow">
              <Check className="w-3 h-3" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-500">Prévia do Logo</span>
        </div>

        {/* Controles de Configuração */}
        <div className="flex-1 w-full space-y-4">
          {mode === 'generate' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Iniciais exibidas
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={customInitials}
                    onChange={(e) => setCustomInitials(e.target.value.toUpperCase())}
                    placeholder={derivedInitials || 'FG'}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl uppercase font-bold tracking-wider text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Formato da moldura
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'rounded-2xl', label: 'Suave' },
                      { id: 'rounded-full', label: 'Circular' },
                      { id: 'rounded-xl', label: 'Compacto' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setShape(item.id as any)}
                        className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                          shape === item.id
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Paleta de cores em gradiente
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {GRADIENTS.map((grad) => (
                    <button
                      key={grad.id}
                      type="button"
                      onClick={() => setSelectedGradient(grad)}
                      title={grad.name}
                      className={`h-9 rounded-xl bg-gradient-to-br ${grad.class} relative flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${
                        selectedGradient.id === grad.id ? 'ring-2 ring-offset-2 ring-indigo-600' : ''
                      }`}
                    >
                      {selectedGradient.id === grad.id && (
                        <Check className="w-4 h-4 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={handleFileUpload}
                className="hidden"
                id="logo-file-input"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-white rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-indigo-50/20"
              >
                <ImageIcon className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  Clique aqui para selecionar uma imagem do computador
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Formatos aceitos: PNG, JPG, SVG ou WEBP (Máximo: 3MB)
                </p>
              </div>

              {previewUrl && (
                <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
                  <span>Imagem selecionada pronta para uso</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      onLogoChange(null, null);
                    }}
                    className="text-rose-600 font-semibold hover:underline"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
