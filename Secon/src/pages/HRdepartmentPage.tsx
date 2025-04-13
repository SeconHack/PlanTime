import logo from '../images/logo.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HRdepartmentPage = () => {
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(''); // Новое состояние для сообщений
    const [name, setName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Функция для отображения сообщения с автоматическим исчезновением
    const showMessage = (text, isError = false) => {
        setMessage({ text, isError });
        setTimeout(() => setMessage(''), 5000); // Сообщение исчезает через 5 секунд
    };

    // Получение данных профиля и проверка роли
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        setIsAuthenticated(true);

        const fetchProfile = async () => {
            try {
                const profileUrl = 'http://109.73.203.81:9090/v1/profile/me';
                const response = await axios.get(profileUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setName(
                    `${response.data.lastName} ${response.data.firstName} ${response.data.middleName}`
                );
                if (response.data.roleId === 2) {
                    navigate('/MainPage', { replace: true });
                } else {
                    setIsAuthorized(true);
                }
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error);
                if (error.response?.status === 401) {
                    navigate('/login', { replace: true });
                }
            }
        };

        fetchProfile();
    }, [navigate]);

    // Обработка выбора файла
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setMessage(''); // Очищаем сообщения при выборе нового файла
        }
    };

    // Отправка файла на сервер
    const handleSendFile = async () => {
        if (!selectedFile) {
            showMessage('Пожалуйста, выберите файл для загрузки.', true);
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        setIsLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('file', selectedFile);

        const apiUrl = 'http://109.73.203.81:9090/v1/auth/registerfromfile';

        try {
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('File upload response:', response.data);
            showMessage('Файл успешно отправлен!');
            setSelectedFile(null);
        } catch (error) {
            console.error('Ошибка при отправке файла:', error);
            if (error.response) {
                console.error('Response error:', error.response.data, error.response.status);
                if (error.response.status === 401) {
                    navigate('/login', { replace: true });
                } else if (error.response.status === 400) {
                    showMessage('Некорректный формат файла или данные.', true);
                } else if (error.response.status === 403) {
                    showMessage('Доступ запрещен. Проверьте права доступа.', true);
                } else {
                    showMessage(`Ошибка сервера: ${error.response.status}. Попробуйте позже.`, true);
                }
            } else if (error.request) {
                console.error('No response received:', error.request);
                showMessage('Сервер недоступен. Проверьте подключение к интернету.', true);
            } else {
                console.error('Request setup error:', error.message);
                showMessage(`Ошибка: ${error.message}`, true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Обработка клика по логотипу
    const handleLogoClick = () => {
        window.location.href = 'https://penza.tns-e.ru/population/';
    };

    // Обработка выхода
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login', { replace: true });
    };

    // Переход на страницу регистрации
    const handleAddUser = () => {
        navigate('/Registration');
    };

    // Обработка возврата на MainPage
    const handleBackToMain = () => {
        navigate('/MainPage');
    };

    // Если пользователь не авторизован или не имеет права доступа, не рендерим страницу
    if (!isAuthenticated || !isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
            <header className="flex justify-between items-center p-4 bg-white shadow-md">
                <div className="flex items-center space-x-4">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-12 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleLogoClick}
                    />
                    <button
                        onClick={handleBackToMain}
                        style={{
                            backgroundColor: '#023973',
                            color: 'white',
                            transition: 'background-color 0.3s',
                            fontFamily: 'Montserrat, sans-serif',
                        }}
                        className="px-6 py-2 rounded-lg hover:bg-[#012A5A]"
                    >
                        На главную
                    </button>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        style={{
                            borderColor: '#023973',
                            color: '#023973',
                            transition: 'background-color 0.3s',
                        }}
                        className="flex items-center px-4 py-2 border-2 rounded-lg hover:bg-gray-100"
                    >
                        <span className="truncate max-w-[200px]">{name || 'Профиль'}</span>
                        <svg
                            className="ml-2 w-5 h-5"
                            fill="none"
                            stroke="#023973"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button
                                onClick={handleLogout}
                                style={{ color: '#023973', transition: 'background-color 0.3s' }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                            >
                                Выйти
                            </button>
                        </div>
                    )}
                </div>
            </header>
            <section className="flex items-center justify-center p-6 relative">
                {/* Контейнер для сообщений */}
                {message && (
                    <div
                        style={{
                            backgroundColor: message.isError ? '#DC2626' : '#023973',
                            color: 'white',
                        }}
                        className="absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-20 animate-fade-in"
                    >
                        {message.text}
                    </div>
                )}
                <div className="flex flex-col bg-white rounded-2xl shadow-xl max-w-6xl w-full">
                    <div className="p-8">
                        <h4
                            style={{
                                color: '#023973',
                                fontFamily: 'Montserrat, sans-serif',
                            }}
                            className="text-2xl font-semibold mb-6"
                        >
                            Личный кабинет HR
                        </h4>
                        <div
                            style={{ borderColor: '#023973' }}
                            className="bg-white border-2 rounded-lg p-6"
                        >
                            <button
                                onClick={handleAddUser}
                                style={{
                                    backgroundColor: '#023973',
                                    color: 'white',
                                    transition: 'background-color 0.3s',
                                    fontFamily: 'Montserrat, sans-serif',
                                }}
                                className="w-full py-3 text-base font-medium rounded-lg hover:bg-[#012A5A] mb-6"
                            >
                                Добавить нового пользователя
                            </button>
                            <div className="mb-6">
                                <label
                                    htmlFor="file-upload"
                                    style={{
                                        color: '#023973',
                                        fontFamily: 'Montserrat, sans-serif',
                                    }}
                                    className="block text-sm font-medium mb-2"
                                >
                                    Выберите файл для загрузки
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={handleFileChange}
                                    style={{
                                        borderColor: '#023973',
                                        color: '#023973',
                                        fontFamily: 'Montserrat, sans-serif',
                                        '--tw-ring-color': '#023973',
                                        transition: 'border-color 0.3s, box-shadow 0.3s',
                                    }}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                />
                                {selectedFile && (
                                    <p
                                        style={{
                                            color: '#F89807',
                                            fontFamily: 'Montserrat, sans-serif',
                                        }}
                                        className="mt-2"
                                    >
                                        Выбранный файл: {selectedFile.name}
                                    </p>
                                )}
                            </div>
                            {isLoading ? (
                                <div
                                    style={{
                                        color: '#023973',
                                        fontFamily: 'Montserrat, sans-serif',
                                    }}
                                    className="h-[100px] flex items-center justify-center"
                                >
                                    Загрузка...
                                </div>
                            ) : (
                                <div
                                    style={{
                                        color: '#023973',
                                        fontFamily: 'Montserrat, sans-serif',
                                    }}
                                    className="h-[100px] flex items-center justify-center"
                                >
                                    {selectedFile
                                        ? 'Файл готов к отправке'
                                        : 'Файл не выбран'}
                                </div>
                            )}
                            <button
                                onClick={handleSendFile}
                                disabled={isLoading}
                                style={{
                                    backgroundColor: isLoading ? '' : '#023973',
                                    color: isLoading ? '' : 'white',
                                    transition: 'background-color 0.3s',
                                    fontFamily: 'Montserrat, sans-serif',
                                }}
                                className={`w-full py-3 text-base font-medium rounded-lg ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'hover:bg-[#012A5A]'
                                }`}
                            >
                                Отправить
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HRdepartmentPage;