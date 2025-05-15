import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo_WorkUp.png';
import Notificacao from '../assets/icon_notificacao.png';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  bio: string;
  notifications: boolean;
  newsletter: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

function UserProfile(): React.ReactElement {
  const [formData, setFormData] = useState<FormData>({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    company: 'Tech Solutions',
    position: 'Desenvolvedor Full Stack',
    bio: 'Desenvolvedor apaixonado por criar soluções inovadoras.',
    notifications: true,
    newsletter: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required fields
    const requiredFields = ['name', 'email', 'phone'];
    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = 'Este campo é obrigatório';
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Password validation
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'A senha deve ter pelo menos 6 caracteres';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically make an API call to update the user's profile
      setSuccessMessage('Perfil atualizado com sucesso!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-light to-gray-100">
      <header className="fixed top-0 left-0 w-full h-20 bg-primary text-white flex items-center justify-between px-8 z-40 shadow-md">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2.5 text-base bg-white/20 border-none cursor-pointer transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/30">
            <i className="fas fa-arrow-left"></i>
            <span className="font-medium">Voltar</span>
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <img src={Logo} alt="WorkUp Logo" className="h-11 filter brightness-0 invert" />
        </div>

        <div className="flex items-center justify-end gap-6">
          <div className="relative cursor-pointer">
            <img src={Notificacao} alt="Notificações" className="w-6 h-6 filter brightness-0 invert" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-xs font-bold">3</span>
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="Usuário"
              className="w-6 h-6 rounded-full border-2 border-white"
            />
            <span className="text-sm font-medium">Olá, Usuário</span>
          </div>
        </div>
      </header>

      <main className="mt-20 p-10 w-full min-h-[calc(100vh-80px)] flex justify-center">
        <div className="w-full max-w-[1000px] mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-secondary">Perfil do Usuário</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-primary text-white border-none px-6 py-2.5 rounded-lg cursor-pointer font-medium text-sm transition-all duration-300 hover:bg-primary-dark hover:-translate-y-0.5"
                >
                  {isEditing ? 'Cancelar' : 'Editar Perfil'}
                </button>
              </div>
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 animate-fade-in">
                  <span className="block sm:inline">{successMessage}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                  <div className="relative">
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-secondary mb-4">Biografia</h2>
                  <div className="relative">
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-base text-text-dark shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(52,152,219,0.2)] disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                    ></textarea>
                  </div>

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
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-white border-none px-8 py-3 rounded-lg cursor-pointer font-medium text-base transition-all duration-300 hover:bg-primary-dark hover:-translate-y-0.5"
                  >
                    Salvar Alterações
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserProfile; 