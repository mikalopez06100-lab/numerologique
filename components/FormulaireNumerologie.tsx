'use client';

import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { FormulaireNumerologie as FormulaireType } from '@/types/numerologie';
import { validerDate, convertirDateHTMLVersFormat, convertirFormatVersDateHTML } from '@/lib/numerologie';

interface FormulaireNumerologieProps {
  onSubmit: (data: FormulaireType) => Promise<void>;
  isLoading?: boolean;
}

export const FormulaireNumerologie: React.FC<FormulaireNumerologieProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<FormulaireType>({
    prenom: '',
    nom: '',
    dateNaissance: '',
  });

  // État pour le date picker HTML (format YYYY-MM-DD)
  const [dateHTML, setDateHTML] = useState<string>('');

  const [errors, setErrors] = useState<Partial<Record<keyof FormulaireType, string>>>({});

  const handleChange = (field: keyof FormulaireType) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setDateHTML(dateValue);
    
    // Convertir en format DD/MM/YYYY pour le formulaire
    if (dateValue) {
      const dateFormat = convertirDateHTMLVersFormat(dateValue);
      setFormData((prev) => ({
        ...prev,
        dateNaissance: dateFormat,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        dateNaissance: '',
      }));
    }
    
    // Effacer l'erreur si présente
    if (errors.dateNaissance) {
      setErrors((prev) => ({
        ...prev,
        dateNaissance: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormulaireType, string>> = {};

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.dateNaissance.trim()) {
      newErrors.dateNaissance = 'La date de naissance est requise';
    } else if (!validerDate(formData.dateNaissance)) {
      newErrors.dateNaissance = 'Format invalide. Utilisez JJ/MM/AAAA';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Prénom"
          value={formData.prenom}
          onChange={handleChange('prenom')}
          placeholder="Votre prénom"
          error={errors.prenom}
          disabled={isLoading}
        />
        
        <Input
          label="Nom"
          value={formData.nom}
          onChange={handleChange('nom')}
          placeholder="Votre nom"
          error={errors.nom}
          disabled={isLoading}
        />
        
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">
            Date de naissance
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateHTML}
              onChange={handleDateChange}
              disabled={isLoading}
              max={new Date().toISOString().split('T')[0]} // Pas de dates futures
              className={`
                w-full px-4 py-3 rounded-lg
                bg-white/10 backdrop-blur-sm
                border border-white/20
                text-white placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                transition-all duration-200
                ${errors.dateNaissance ? 'border-red-500/50' : ''}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                [color-scheme:dark]
              `}
              style={{
                colorScheme: 'dark',
              }}
            />
            {errors.dateNaissance && (
              <span className="text-xs text-red-400 mt-1 block">{errors.dateNaissance}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button type="submit" isLoading={isLoading} className="min-w-[200px]">
          Lancer mon analyse →
        </Button>
      </div>
    </form>
  );
};
