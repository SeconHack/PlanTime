import logo from '../images/logo.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HRdepartmentPage = () => {
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [name, setName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Для проверки авторизации
    const [isAuthorized, setIsAuthorized] = useState(false); // Для проверки роли

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
            setError(null);
            setSuccessMessage(null);
        }
    };

    // Отправка файла на сервер
    const handleSendFile = async () => {
        if (!selectedFile) {
            setError('Пожалуйста, выберите файл для загрузки.');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

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
            setSuccessMessage('Файл успешно отправлен!');
            setSelectedFile(null);
        } catch (error) {
            console.error('Ошибка при отправке файла:', error);
            if (error.response) {
                console.error('Response error:', error.response.data, error.response.status);
                if (error.response.status === 401) {
                    navigate('/login', { replace: true });
                } else if (error.response.status === 400) {
                    setError('Некорректный формат файла или данные.');
                } else if (error.response.status === 403) {
                    setError('Доступ запрещен. Проверьте права доступа.');
                } else {
                    setError(`Ошибка сервера: ${error.response.status}. Попробуйте позже.`);
                }
            } else if (error.request) {
                console.error('No response received:', error.request);
                setError('Сервер недоступен. Проверьте подключение к интернету.');
            } else {
                console.error('Request setup error:', error.message);
                setError(`Ошибка: ${error.message}`);
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
        <>
            <header className="flex justify-between items-center p-[1rem] bg-white">
                <div className="flex items-center space-x-4">
                    <img
                        src={logo}
                        alt="Logo"
                        className="cursor-pointer"
                        onClick={handleLogoClick}
                    />
                    <button
                        onClick={handleBackToMain}
                        className="w-[240px] h-[48px] bg-[#023973] text-white font-[Montserrat] font-medium rounded-[10px] text-lg"
                    >
                        На главную
                    </button>
                </div>
                <div className="relative">
                    <div
                        className="rounded-[6px] w-[280px] h-[48px] border-[2px] pt-[10px] pl-[24px] bg-white font-[Montserrat] text-[#023973] font-semibold cursor-pointer text-lg truncate"
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                        {name || 'Профиль'}
                    </div>
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-[280px] bg-white border-[2px] border-[#023973] rounded-[6px] shadow-lg z-10">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 font-[Montserrat] text-[#023973] text-lg hover:bg-gray-100"
                            >
                                Выйти
                            </button>
                        </div>
                    )}
                </div>
            </header>
            <section className="h-screen bg-[#FDE0B5] flex items-center justify-center">
                <div className="box-border flex items-start justify-between min-w-[1128px] bg-white pt-[60px]">
                    <div className="box-border flex flex-col items-stretch justify-start w-full pb-[128px] px-[40px]">
                        <h4 className="text-2xl font-semibold font-[Montserrat] text-[#023973] mb-[20px]">
                            Личный кабинет HR
                        </h4>
                        <div className="bg-white border-[2px] border-[#023973] rounded-[6px] p-4 mb-4">
                            <button
                                onClick={handleAddUser}
                                className="w-full h-[40px] text-base text-white font-medium rounded-[10px] font-[Montserrat] bg-[#023973] cursor-pointer mb-4"
                            >
                                Добавить нового пользователя
                            </button>
                            <div className="mb-4">
                                <label
                                    htmlFor="file-upload"
                                    className="block font-[Montserrat] text-[#023973] mb-2"
                                >
                                    Выберите файл для загрузки
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border-[1px] border-[#023973] rounded-[6px] font-[Montserrat] text-[#023973]"
                                />
                                {selectedFile && (
                                    <p className="mt-2 font-[Montserrat] text-[#023973]">
                                        Выбранный файл: {selectedFile.name}
                                    </p>
                                )}
                            </div>
                            {isLoading ? (
                                <div className="h-[100px] flex items-center justify-center font-[Montserrat] text-[#023973]">
                                    Загрузка...
                                </div>
                            ) : error ? (
                                <div className="h-[100px] flex items-center justify-center font-[Montserrat] text-red-600">
                                    {error}
                                </div>
                            ) : successMessage ? (
                                <div className="h-[100px] flex items-center justify-center font-[Montserrat] text-green-600">
                                    {successMessage}
                                </div>
                            ) : (
                                <div className="h-[100px] flex items-center justify-center font-[Montserrat] text-[#023973]">
                                    {selectedFile
                                        ? 'Файл готов к отправке'
                                        : 'Файл не выбран'}
                                </div>
                            )}
                            <button
                                onClick={handleSendFile}
                                disabled={isLoading}
                                className={`w-full h-[40px] text-base text-white font-medium rounded-[10px] font-[Montserrat] ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#023973] cursor-pointer'
                                }`}
                            >
                                Отправить
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HRdepartmentPage;