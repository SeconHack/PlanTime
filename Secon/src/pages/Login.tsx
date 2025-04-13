import { useState } from 'react';
import axios from 'axios';
import CustomInput from '../components/CustomInput';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post('http://109.73.203.81:9090/v1/auth/login', {
                email,
                password
            });
            localStorage.setItem("accessToken", response.data.token);
            navigate('/MainPage');
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                if (error.response.status === 401 || error.response.status === 400 || error.response.status === 404) {
                    setError("Пользователь не найден или неверные учетные данные");
                } else {
                    setError("Ошибка сервера. Попробуйте позже.");
                }
            } else {
                setError("Не удалось подключиться к серверу.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-[Montserrat]">
            <section className="flex items-center justify-center p-6 min-h-screen">
                <div className="flex flex-col bg-white rounded-2xl shadow-xl max-w-6xl w-full">
                    <div className="p-8">
                        <h4
                            style={{
                                color: '#023973',
                                fontFamily: 'Montserrat, sans-serif',
                            }}
                            className="text-2xl font-semibold mb-6 text-center"
                        >
                            Вход
                        </h4>
                        <div
                            style={{ borderColor: '#023973' }}
                            className="bg-white border-2 rounded-lg p-6"
                        >
                            <form className="space-y-4">
                                <div>
                                    <CustomInput
                                        label="Почта"
                                        placeholder="Введите почту"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        style={{
                                            borderColor: '#023973',
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                            '--tw-ring-color': '#023973',
                                        }}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                    />
                                    {error && error.includes("учетные данные") && (
                                        <p className="text-red-600 text-sm mt-1">Неверная почта или пароль</p>
                                    )}
                                </div>
                                <div>
                                    <CustomInput
                                        label="Пароль"
                                        placeholder="Введите пароль"
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        style={{
                                            borderColor: '#023973',
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                            '--tw-ring-color': '#023973',
                                        }}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                    />
                                    {error && error.includes("учетные данные") && (
                                        <p className="text-red-600 text-sm mt-1">Неверная почта или пароль</p>
                                    )}
                                </div>
                                {error && !error.includes("учетные данные") && (
                                    <p className="text-red-600 text-sm text-center">{error}</p>
                                )}
                                <button
                                    onClick={login}
                                    type="submit"
                                    style={{
                                        backgroundColor: '#023973',
                                        color: 'white',
                                        transition: 'background-color 0.3s',
                                        fontFamily: 'Montserrat, sans-serif',
                                    }}
                                    className="w-full py-3 text-base font-medium rounded-lg hover:bg-[#012A5A]"
                                >
                                    Войти
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;