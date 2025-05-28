import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo_WorkUp.png';
import { getCookie } from '../utils/cookies';

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('E-mail:', email);
        console.log('Senha:', password);

        navigate('/catalog');
    };

    useEffect(() => {
        const token = getCookie('token')
        if(token) navigate('/')
    }, [])

    return (
        <div className="min-h-screen bg-white">
            <header className="w-full bg-[#34495e] flex justify-center items-center py-4 shadow-md">
                <img src={Logo} alt="Logo WorkUp" className="w-16" />
            </header>

            <div className="max-w-md mx-auto mt-16 p-6 border rounded-xl shadow-md flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                    <div>
                        <label className="block mb-1">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="exemplo@email.com"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Senha</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-[#34495e] cursor-pointer mt-4 text-white py-2 rounded-lg transition-colors duration-300
                            hover:bg-gradient-to-r hover:from-[#2c3e50] hover:to-[#5d6d7e]"
                    >
                        Entrar
                    </button>
                </form>

                <button
                    onClick={() => navigate('/signup')}
                    className="text-[#34495e] py-2 rounded-xl cursor-pointer mt-4"
                >
                    Criar Conta
                </button>
            </div>
        </div>
    );
}
