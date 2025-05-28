import React from "react";
import { IMaskInput } from "react-imask";

export interface FormData {
  name: string;
  email: string;
  cpf: string;
  birth: string;
  phone: string;
}

interface Props {
  formData: FormData;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfilePersonalInfo({
  formData,
  isEditing,
  handleChange,
}: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-secondary mb-4">
        Informações Pessoais
      </h2>
      <div className="relative">
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled={true}
          className={`w-full border rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500`}
        />
      </div>
      <div className="relative">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!isEditing}
          className={`w-full border rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500`}
        />
      </div>

      <div className="relative">
        <IMaskInput
          mask="000.000.000-00"
          value={formData.cpf}
          unmask={false}
          disabled={!isEditing}
          onAccept={(value) =>
            handleChange({
              target: {
                name: "cpf",
                value,
              },
            } as unknown as React.ChangeEvent<HTMLInputElement>)
          }
          placeholder="000.000.000-00"
          className="w-full border rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500"
          required
        />
      </div>

      <div className="relative">
        <input
          name="birth"
          type="date"
          value={formData.birth}
          onChange={handleChange}
          disabled={!isEditing}
          required
          className="w-full border rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>

      <div className="relative">
        <IMaskInput
          mask="(00) 00000-0000"
          value={formData.phone}
          unmask={false}
          disabled={!isEditing}
          onAccept={(value) =>
            handleChange({
              target: {
                name: "phone",
                value,
              },
            } as unknown as React.ChangeEvent<HTMLInputElement>)
          }
          placeholder="(00) 00000-0000"
          className="w-full border rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500"
          required
        />
      </div>
    </div>
  );
}
