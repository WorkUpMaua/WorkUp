import React from 'react';

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}  
interface Errors {
  newPassword?: string;
  confirmPassword?: string;
}
interface Props {
  formData: FormData;
  errors: Errors;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileSecurity({ formData, errors, isEditing, handleChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-secondary mb-4">Segurança</h2>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Senha atual"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div className="relative">
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Nova senha"
            className={`w-full border ${errors.newPassword ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500`}
          />
          {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
        </div>
        <div className="relative">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Confirmar nova senha"
            className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>
    </div>
  );
}