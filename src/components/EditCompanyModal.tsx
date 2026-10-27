import React, { useState } from 'react';
import type { Group, ClassName, UpdateGroupInput } from '../types';
import { LogoGenerator } from './LogoGenerator';
import { X, Building2, Save } from 'lucide-react';

interface EditCompanyModalProps {
  isOpen: boolean;
  group: Group;
  onClose: () => void;
  onSave: (input: UpdateGroupInput) => Promise<void>;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
  isOpen,
  group,
  onClose,
  onSave,
  showToast,
}) => {
  const [companyName, setCompanyName] = useState(group.company_name);
  const [businessSector, setBusinessSector] = useState(group.business_sector);
  const [description, setDescription] = useState(group.description);
  const [members, setMembers] = useState(group.members);
  const [className, setClassName] = useState<ClassName>(group.class_name);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(group.logo_url);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim() || !businessSector.trim() || !description.trim() || !members.trim()) {
      showToast('error', 'Campos obrigatórios', 'Por favor, preencha todos os campos.');
      return;
    }

    setSaving(true);
    try {
      const input: UpdateGroupInput = {
        company_name: companyName.trim(),
        business_sector: businessSector.trim(),
        description: description.trim(),
        members: members.trim(),
        class_name: className,
        logo_file: logoFile,
        logo_url: logoUrl,
      };

      await onSave(input);
      showToast('success', 'Dados atualizados!', 'As informações da empresa foram salvas com sucesso.');
      onClose();
    } catch (err: any) {
      showToast('error', 'Erro ao salvar', err.message || 'Falha ao atualizar dados da empresa.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_#0f172a] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b-2 border-slate-900 bg-[#FAF9F5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-slate-900">Editar Dados da Empresa</h3>
              <p className="text-xs text-slate-600">
                Atualize o nome, setor, integrantes e logotipo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-300 hover:border-slate-900 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nome da empresa *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Ramo de atuação *
              </label>
              <input
                type="text"
                required
                value={businessSector}
                onChange={(e) => setBusinessSector(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Turma escolar *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['2º2', '2º3'] as ClassName[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setClassName(c)}
                    className={`py-1.5 px-3 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      className === c
                        ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Integrantes da equipe *
              </label>
              <textarea
                rows={2}
                required
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Descrição da empresa *
            </label>
            <textarea
              rows={3}
              required
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-900 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 leading-relaxed"
            />
          </div>

          <LogoGenerator
            companyName={companyName}
            currentLogoUrl={logoUrl}
            onLogoChange={(file, dataUrl) => {
              setLogoFile(file);
              setLogoUrl(dataUrl);
            }}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-slate-900">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-[2px_2px_0px_#22c55e] disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
