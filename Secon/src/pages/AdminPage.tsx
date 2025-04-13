import logo from '../images/logo.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPage = () => {
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [groups, setGroups] = useState({});
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [message, setMessage] = useState(''); // Новое состояние для сообщений

    // Форматирование даты в читаемый формат (DD.MM.YYYY)
    const formatDate = (isoDate) => {
        if (!isoDate) return '—';
        const date = new Date(isoDate);
        if (isNaN(date)) return '—';
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Функция для отображения сообщения с автоматическим исчезновением
    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(''), 5000); // Сообщение исчезает через 5 секунд
    };

    // Получение данных профиля и коллизий
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        setIsAuthenticated(true);

        // Запрос профиля для получения имени и роли
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
                if (response.data.roleId !== 2) {
                    navigate('/MainPage', { replace: true });
                } else {
                    setIsAuthorized(true);
                }
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/login', { replace: true });
                }
            }
        };

        // Запрос коллизий
        const fetchCollisions = async () => {
            setIsLoading(true);
            setError(null);
            const apiUrl = 'http://109.73.203.81:9090/api/report/vacations/intersections';
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const collisionLists = response.data;
                console.log('Collision data:', collisionLists);
                const transformedLists = collisionLists.map((list) =>
                    list.map((item) => ({
                        id: item.userId,
                        vacationId: item.vacationId,
                        email: item.email || 'Не указан',
                        lastName: item.lastName || 'Сотрудник',
                        divisionName: item.divisionName || 'Не указан',
                        startDate: item.vacationStartDate,
                        endDate: item.vacationEndDate,
                    }))
                );
                const groupsObject = transformedLists.reduce((acc, list, index) => {
                    acc[`Группа ${index + 1}`] = list;
                    return acc;
                }, {});
                setGroups(groupsObject);
                if (transformedLists.length > 0) {
                    setSelectedGroup('Группа 1');
                } else {
                    setSelectedGroup(null);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Ошибка при получении коллизий:', error);
                setIsLoading(false);
                if (error.response) {
                    console.error('Response error:', error.response.data, error.response.status);
                    if (error.response.status === 401) {
                        localStorage.removeItem('accessToken');
                        navigate('/login', { replace: true });
                    } else {
                        setError(`Ошибка сервера: ${error.response.status}. Попробуйте позже.`);
                    }
                } else if (error.request) {
                    console.error('No response received:', error.request);
                    setError('Сервер недоступен. Проверьте адрес сервера или подключение к интернету.');
                } else {
                    console.error('Request setup error:', error.message);
                    setError(`Ошибка: ${error.message}`);
                }
            }
        };

        fetchProfile();
        fetchCollisions();
    }, [navigate]);

    // Проверка коллизий
    const hasCollision = (employee, groupName) => {
        const currentGroup = groups[groupName];
        return currentGroup.some((otherEmployee) => {
            if (employee.id === otherEmployee.id) return false;
            const start1 = new Date(employee.startDate);
            const end1 = new Date(employee.endDate);
            const start2 = new Date(otherEmployee.startDate);
            const end2 = new Date(otherEmployee.endDate);
            return start1 <= end2 && start2 <= end1;
        });
    };

    // Обработка клика по сотруднику
    const handleEmployeeClick = (employee) => {
        setSelectedEmployee(employee);
    };

    // Удаление сотрудника из группы
    const removeEmployeeFromGroup = () => {
        if (!selectedEmployee) {
            showMessage('Пожалуйста, выберите сотрудника.');
            return;
        }

        const updatedGroup = groups[selectedGroup].filter(
            (emp) => !(emp.id === selectedEmployee.id && emp.vacationId === selectedEmployee.vacationId)
        );

        if (updatedGroup.length <= 1) {
            const newGroups = { ...groups };
            delete newGroups[selectedGroup];
            setGroups(newGroups);

            const groupNames = Object.keys(newGroups);
            if (groupNames.length > 0) {
                setSelectedGroup(groupNames[0]);
            } else {
                setSelectedGroup(null);
            }
        } else {
            setGroups({
                ...groups,
                [selectedGroup]: updatedGroup,
            });
        }
        setSelectedEmployee(null);
    };

    // Отправка запроса на удаление отпуска
    const handleSendRequest = async () => {
        if (!selectedEmployee) {
            showMessage('Пожалуйста, выберите сотрудника для отправки запроса.');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        const apiUrl = `http://109.73.203.81:9090/api/report/vacations/${selectedEmployee.vacationId}`;
        console.log('Sending delete request:', {
            url: apiUrl,
            vacationId: selectedEmployee.vacationId,
            email: selectedEmployee.email,
        });

        try {
            await axios.delete(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Отпуск успешно удален');
            showMessage(`Запрос на удаление отпуска отправлен для ${selectedEmployee.email}`);
            removeEmployeeFromGroup();
        } catch (error) {
            console.error('Ошибка при удалении отпуска:', error);
            if (error.response) {
                console.error('Response error:', error.response.data, error.response.status);
                if (error.response.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/login', { replace: true });
                } else if (error.response.status === 400) {
                    showMessage('Некорректные данные в запросе.');
                } else if (error.response.status === 403) {
                    showMessage('Доступ запрещен. Проверьте права доступа.');
                } else if (error.response.status === 404) {
                    showMessage('Отпуск не найден.');
                } else {
                    showMessage(`Ошибка сервера: ${error.response.status}. Попробуйте позже.`);
                }
            } else if (error.request) {
                console.error('No response received:', error.request);
                showMessage('Сервер недоступен. Проверьте адрес сервера или подключение к интернету.');
            } else {
                console.error('Request setup error:', error.message);
                showMessage(`Ошибка: ${error.message}`);
            }
        }
    };

    // Игнорирование коллизии
    const handleIgnore = () => {
        removeEmployeeFromGroup();
    };

    // Сохранение отчета на сервер (без скачивания файла)
    const handleSaveReport = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        const apiUrl = 'http://109.73.203.81:9090/api/report/vacations/save-report';
        try {
            await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Отчет успешно сохранен на сервере');
            showMessage('Отчет успешно сохранен на сервере');
        } catch (error) {
            console.error('Ошибка при сохранении отчета:', error);
            if (error.response) {
                console.error('Response error:', error.response.status);
                if (error.response.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/login', { replace: true });
                } else if (error.response.status === 405) {
                    showMessage('Метод не поддерживается сервером.');
                } else {
                    showMessage(`Ошибка сервера: ${error.response.status}. Попробуйте позже.`);
                }
            } else if (error.request) {
                console.error('No response received:', error.request);
                showMessage('Сервер недоступен. Проверьте адрес сервера или подключение к интернету.');
            } else {
                console.error('Request setup error:', error.message);
                showMessage(`Ошибка: ${error.message}`);
            }
        }
    };

    // Отправка финального отчета и скачивание файла
    const handleSendFinalReport = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        const apiUrl = 'http://109.73.203.81:9090/api/report/vacations/create-from-template';
        try {
            const response = await axios.post(apiUrl, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': '*/*',
                },
                responseType: 'blob', // Для получения файла
            });

            // Извлечение имени файла из заголовка content-disposition
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'ERSheet.xlsx'; // Значение по умолчанию
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            // Создание ссылки для скачивания файла
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            console.log('Финальный отчет успешно отправлен и файл загружен');
            showMessage('Финальный отчет успешно отправлен, файл загружен');
        } catch (error) {
            console.error('Ошибка при отправке финального отчета:', error);
            if (error.response) {
                console.error('Response error:', error.response.status);
                if (error.response.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/login', { replace: true });
                } else if (error.response.status === 404) {
                    showMessage('Эндпоинт не найден. Проверьте URL или обратитесь к администратору.');
                } else if (error.response.status === 403) {
                    showMessage('Доступ запрещен. Проверьте права доступа.');
                } else {
                    showMessage(`Ошибка сервера: ${error.response.status}. Попробуйте позже.`);
                }
            } else if (error.request) {
                console.error('No response received:', error.request);
                showMessage('Сервер недоступен. Проверьте адрес сервера или подключение к интернету.');
            } else {
                console.error('Request setup error:', error.message);
                showMessage(`Ошибка: ${error.message}`);
            }
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

    // Обработка возврата на MainPage
    const handleBackToMain = () => {
        navigate('/MainPage');
    };

    // Если пользователь не авторизован или не имеет права доступа, не рендерим страницу
    if (!isAuthenticated || !isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-[Montserrat]">
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
                                style={{
                                    color: '#023973',
                                    transition: 'background-color 0.3s',
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                            >
                                Выйти
                            </button>
                        </div>
                    )}
                </div>
            </header>
            <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center relative">
                {/* Контейнер для сообщений */}
                {message && (
                    <div
                        style={{ backgroundColor: '#023973', color: 'white' }}
                        className="absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-20 animate-fade-in"
                    >
                        {message}
                    </div>
                )}
                <div className="box-border flex items-start justify-between min-w-[1128px] bg-white pt-[60px] rounded-2xl shadow-xl">
                    <div className="box-border flex flex-col items-stretch justify-start w-full pb-[128px] px-[40px]">
                        <h4
                            style={{
                                color: '#023973',
                                fontFamily: 'Montserrat, sans-serif',
                            }}
                            className="text-2xl font-semibold mb-[20px]"
                        >
                            Коллизии
                        </h4>
                        <div className="flex space-x-[10px] mb-[20px] overflow-x-auto">
                            {Object.keys(groups).map((groupName) => (
                                <button
                                    key={groupName}
                                    onClick={() => {
                                        setSelectedGroup(groupName);
                                        setSelectedEmployee(null);
                                    }}
                                    style={{
                                        backgroundColor:
                                            selectedGroup === groupName ? '#023973' : '',
                                        color: selectedGroup === groupName ? 'white' : '#023973',
                                        transition: 'background-color 0.3s, color 0.3s',
                                        fontFamily: 'Montserrat, sans-serif',
                                    }}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                                        selectedGroup === groupName ? '' : 'bg-gray-200'
                                    } hover:bg-[#012A5A] hover:text-white`}
                                >
                                    {groupName}
                                </button>
                            ))}
                        </div>
                        {isLoading ? (
                            <div
                                style={{
                                    borderColor: '#023973',
                                    color: '#023973',
                                    fontFamily: 'Montserrat, sans-serif',
                                }}
                                className="bg-white border-2 rounded-lg h-[400px] flex items-center justify-center"
                            >
                                Загрузка...
                            </div>
                        ) : error ? (
                            <div
                                style={{
                                    borderColor: '#023973',
                                    color: '#023973',
                                    fontFamily: 'Montserrat, sans-serif',
                                }}
                                className="bg-white border-2 rounded-lg h-[400px] flex items-center justify-center"
                            >
                                {error}
                            </div>
                        ) : selectedGroup && groups[selectedGroup] ? (
                            <div
                                style={{ borderColor: '#023973' }}
                                className="bg-white border-2 rounded-lg h-[400px] overflow-y-auto"
                            >
                                <ul className="space-y-[10px] p-4">
                                    {groups[selectedGroup].map((employee) => (
                                        <li
                                            key={`${employee.id}-${employee.vacationId}`}
                                            onClick={() => handleEmployeeClick(employee)}
                                            style={{
                                                backgroundColor:
                                                    selectedEmployee &&
                                                    selectedEmployee.id === employee.id &&
                                                    selectedEmployee.vacationId ===
                                                    employee.vacationId
                                                        ? '#F89807'
                                                        : hasCollision(employee, selectedGroup)
                                                            ? ''
                                                            : '',
                                                color:
                                                    selectedEmployee &&
                                                    selectedEmployee.id === employee.id &&
                                                    selectedEmployee.vacationId ===
                                                    employee.vacationId
                                                        ? 'white'
                                                        : '#023973',
                                                transition: 'background-color 0.3s, color 0.3s',
                                                fontFamily: 'Montserrat, sans-serif',
                                            }}
                                            className={`cursor-pointer p-2 rounded-lg ${
                                                selectedEmployee &&
                                                selectedEmployee.id === employee.id &&
                                                selectedEmployee.vacationId === employee.vacationId
                                                    ? 'hover:bg-[#D87E06]'
                                                    : hasCollision(employee, selectedGroup)
                                                        ? 'bg-red-200'
                                                        : 'bg-white'
                                            }`}
                                        >
                                            {employee.lastName} ({employee.email},{' '}
                                            {employee.divisionName}), Отпуск:{' '}
                                            {formatDate(employee.startDate)} –{' '}
                                            {formatDate(employee.endDate)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div
                                style={{
                                    borderColor: '#023973',
                                    color: '#023973',
                                    fontFamily: 'Montserrat, sans-serif',
                                }}
                                className="bg-white border-2 rounded-lg h-[400px] flex items-center justify-center"
                            >
                                Нет групп с коллизиями
                            </div>
                        )}
                        <button
                            onClick={handleSendRequest}
                            style={{
                                backgroundColor: '#023973',
                                color: 'white',
                                transition: 'background-color 0.3s',
                                fontFamily: 'Montserrat, sans-serif',
                            }}
                            className="mt-[20px] cursor-pointer w-full h-[40px] text-base font-medium rounded-lg hover:bg-[#012A5A]"
                        >
                            Отправить запрос на удаление
                        </button>
                        <button
                            onClick={handleIgnore}
                            style={{
                                backgroundColor: '#023973',
                                color: 'white',
                                transition: 'background-color 0.3s',
                                fontFamily: 'Montserrat, sans-serif',
                            }}
                            className="mt-[10px] cursor-pointer w-full h-[40px] text-base font-medium rounded-lg hover:bg-[#012A5A]"
                        >
                            Игнорировать
                        </button>
                        <button
                            onClick={handleSaveReport}
                            style={{
                                backgroundColor: '#023973',
                                color: 'white',
                                transition: 'background-color 0.3s',
                                fontFamily: 'Montserrat, sans-serif',
                            }}
                            className="mt-[10px] cursor-pointer w-full h-[40px] text-base font-medium rounded-lg hover:bg-[#012A5A]"
                        >
                            Сохранить отчёт
                        </button>
                        <button
                            onClick={handleSendFinalReport}
                            style={{
                                backgroundColor: '#023973',
                                color: 'white',
                                transition: 'background-color 0.3s',
                                fontFamily: 'Montserrat, sans-serif',
                            }}
                            className="mt-[10px] cursor-pointer w-full h-[40px] text-base font-medium rounded-lg hover:bg-[#012A5A]"
                        >
                            Отправить финальный отчёт
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminPage;