import React from 'react';


interface FormData {
  notifications: boolean;
  newsletter: boolean;
} 
interface Props {
  formData: FormData;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfilePreferences({ formData, isEditing, handleChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-secondary mb-4">Preferências</h2>
      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="notifications"
            checked={formData.notifications}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
          />
          <span className="text-text-dark">Receber notificações</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
          />
          <span className="text-text-dark">Receber newsletter</span>
        </label>
      </div>
    </div>
  );
}