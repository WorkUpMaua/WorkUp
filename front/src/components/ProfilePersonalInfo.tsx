import React from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}

interface Props {
  formData: FormData;
  errors: Errors;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfilePersonalInfo({ formData, errors, isEditing, handleChange }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-secondary mb-4">Informações Pessoais</h2>
      <div className="relative">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!isEditing}
          className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      <div className="relative">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!isEditing}
          className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div className="relative">
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={!isEditing}
          className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500`}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>
      <div className="relative">
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>
    </div>
  );
}