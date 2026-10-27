import React, { useState, useRef, useEffect } from 'react';
import { Upload, Type, Image as ImageIcon, Check } from 'lucide-react';

interface LogoGeneratorProps {
  companyName: string;
  currentLogoUrl?: string | null;
  onLogoChange: (file: File | null, dataUrl: string | null) => void;
}

const SOLID_COLORS = [
  { id: 'slate-900', name: 'Grafite Escuro', hex: '#0f172a', bgClass: 'bg-slate-900', textClass: 'text-white' },
  { id: 'indigo-800', name: 'Índigo Corporativo', hex: '#3730a3', bgClass: 'bg-indigo-800', textClass: 'text-white' },
  { id: 'blue-800', name: 'Azul Institucional', hex: '#1e40af', bgClass: 'bg-blue-800', textClass: 'text-white' },
  { id: 'emerald-800', name: 'Verde Floresta', hex: '#065f46', bgClass: 'bg-emerald-800', textClass: 'text-white' },
  { id: 'amber-800', name: 'Âmbar Clássico', hex: '#92400e', bgClass: 'bg-amber-800', textClass: 'text-white' },
  { id: 'slate-700', name: 'Cinza Metálico', hex: '#334155', bgClass: 'bg-slate-700', textClass: 'text-white' },
];

export const LogoGenerator: React.FC<LogoGeneratorProps> = ({
  companyName,
  currentLogoUrl,
  onLogoChange,
}) => {
  const [mode, setMode] = useState<'generate' | 'upload'>('generate');
  const [selectedColor, setSelectedColor] = useState(SOLID_COLORS[0]);
  const [customInitials, setCustomInitials] = useState('');
  const [shape, setShape] = useState<'rounded-xl' | 'rounded-full' | 'rounded-lg'>('rounded-xl');
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

  // Gera o logo monograma em SVG com cor sólida limpa
  const generateSvgDataUrl = (initials: string, color: typeof SOLID_COLORS[0], shapeType: string) => {
    const rx = shapeType === 'rounded-full' ? '50%' : shapeType === 'rounded-xl' ? '20' : '8';
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <rect width="120" height="120" rx="${rx}" fill="${color.hex}" />
        <text x="50%" y="54%" dominant-baseline="central" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="700" font-size="44" fill="#ffffff" letter-spacing="1">
          ${initials}
        </text>
      </svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  };

  useEffect(() => {
    if (mode === 'generate') {
      const dataUrl = generateSvgDataUrl(activeInitials, selectedColor, shape);
      setPreviewUrl(dataUrl);
      onLogoChange(null, dataUrl);
    }
  }, [activeInitials, selectedColor, shape, mode]);

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
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Identidade Visual / Logotipo
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Crie um monograma limpo com as iniciais da empresa ou envie um arquivo de imagem.
          </p>
        </div>

        {/* Alternador de Modo */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('generate')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'generate'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            Monograma
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'upload'
                ? 'bg-white text-slate-900 shadow-xs'
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
          <div className="relative">
            <div
              className={`w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center overflow-hidden border border-slate-300 bg-white ${shape}`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Prévia do logotipo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full ${selectedColor.bgClass} flex items-center justify-center text-white font-bold text-xl`}>
                  {activeInitials}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-0.5 rounded-full border border-white">
              <Check className="w-3 h-3" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-500">Visualização</span>
        </div>

        {/* Controles de Configuração */}
        <div className="flex-1 w-full space-y-3.5">
          {mode === 'generate' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Iniciais
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={customInitials}
                    onChange={(e) => setCustomInitials(e.target.value.toUpperCase())}
                    placeholder={derivedInitials || 'FG'}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg uppercase font-bold tracking-wider text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Formato da moldura
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'rounded-xl', label: 'Suave' },
                      { id: 'rounded-full', label: 'Circular' },
                      { id: 'rounded-lg', label: 'Sutil' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setShape(item.id as any)}
                        className={`py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                          shape === item.id
                            ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
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
                  Cor sólida institucional
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {SOLID_COLORS.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      title={col.name}
                      className={`h-8 rounded-lg ${col.bgClass} relative flex items-center justify-center transition-transform hover:opacity-90 cursor-pointer ${
                        selectedColor.id === col.id ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                      }`}
                    >
                      {selectedColor.id === col.id && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2.5">
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
                className="border-2 border-dashed border-slate-300 hover:border-slate-500 bg-white rounded-lg p-5 text-center cursor-pointer transition-colors"
              >
                <ImageIcon className="w-6 h-6 mx-auto text-slate-400 mb-1.5" />
                <p className="text-xs font-semibold text-slate-700">
                  Clique para selecionar uma imagem do computador
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, SVG ou WEBP (Máximo: 3MB)
                </p>
              </div>

              {previewUrl && (
                <div className="flex items-center justify-between text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-md">
                  <span>Arquivo selecionado</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      onLogoChange(null, null);
                    }}
                    className="text-rose-600 font-semibold hover:underline cursor-pointer"
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
