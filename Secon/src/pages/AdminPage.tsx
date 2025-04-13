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

    // Получение данных из бэкенда
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
            navigate('/login');
            return;
        }

        setIsLoading(true);
        setError(null);
        const apiUrl = 'http://109.73.203.81:9090/api/report/vacations/intersections'; // Для локального тестирования: http://localhost:9090
        axios
            .get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                const collisionLists = response.data;
                console.log('Collision data:', collisionLists);
                // Преобразуем данные
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
                // Формируем группы
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
            })
            .catch((error) => {
                console.error('Ошибка при получении коллизий:', error);
                setIsLoading(false);
                if (error.response) {
                    console.error('Response error:', error.response.data, error.response.status);
                    if (error.response.status === 401) {
                        alert('Сессия истекла, пожалуйста, войдите снова.');
                        navigate('/login');
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
            });
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
            alert('Пожалуйста, выберите сотрудника.');
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
            alert('Пожалуйста, выберите сотрудника для отправки запроса.');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
            navigate('/login');
            return;
        }

        const apiUrl = `http://109.73.203.81:9090/api/report/vacations/${selectedEmployee.vacationId}`; // Для локального тестирования: http://localhost:9090
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
            alert(`Запрос на удаление отпуска отправлен для ${selectedEmployee.email}`);
            removeEmployeeFromGroup();
        } catch (error) {
            console.error('Ошибка при удалении отпуска:', error);
            if (error.response) {
                console.error('Response error:', error.response.data, error.response.status);
                if (error.response.status === 401) {
                    alert('Сессия истекла, пожалуйста, войдите снова.');
                    navigate('/login');
                } else if (error.response.status === 400) {
                    alert('Некорректные данные в запросе.');
                } else if (error.response.status === 403) {
                    alert('Доступ запрещен. Проверьте права доступа.');
                } else if (error.response.status === 404) {
                    alert('Отпуск не найден.');
                } else {
                    alert(`Ошибка сервера: ${error.response.status}. Попробуйте позже.`);
                }
            } else if (error.request) {
                console.error('No response received:', error.request);
                alert('Сервер недоступен. Проверьте адрес сервера или подключение к интернету.');
            } else {
                console.error('Request setup error:', error.message);
                alert(`Ошибка: ${error.message}`);
            }
        }
    };

    // Игнорирование коллизии
    const handleIgnore = () => {
        removeEmployeeFromGroup();
    };

    // Сохранение отчета
    const handleSaveReport = () => {
        const reportData = JSON.stringify(
            Object.entries(groups).map(([name, employees]) => ({
                group: name,
                employees: employees.map((emp) => ({
                    id: emp.id,
                    email: emp.email,
                    lastName: emp.lastName,
                    divisionName: emp.divisionName,
                    startDate: formatDate(emp.startDate),
                    endDate: formatDate(emp.endDate),
                })),
            })),
            null,
            2
        );
        const blob = new Blob([reportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'groups_report.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    // Обработка клика по логотипу
    const handleLogoClick = () => {
        window.location.href = 'https://penza.tns-e.ru/population/';
    };

    // Обработка выхода
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        alert('Выход из профиля');
        navigate('/login');
    };

    return (
        <>
            <header className="flex justify-between items-center p-[1rem] bg-white">
                <img
                    src={logo}
                    alt="Logo"
                    className="cursor-pointer"
                    onClick={handleLogoClick}
                />
                <div className="relative">
                    <div
                        className="rounded-[6px] w-[232px] h-[40px] border-[2px] pt-[7px] pl-[20px] bg-white font-[Montserrat] text-[#023973] font-semibold cursor-pointer"
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                        Профиль
                    </div>
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-[232px] bg-white border-[2px] border-[#023973] rounded-[6px] shadow-lg">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 font-[Montserrat] text-[#023973] hover:bg-gray-100"
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
                                    className={`px-4 py-2 rounded-[6px] font-[Montserrat] text-[#023973] whitespace-nowrap ${
                                        selectedGroup === groupName
                                            ? 'bg-[#023973] text-white'
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    {groupName}
                                </button>
                            ))}
                        </div>
                        {isLoading ? (
                            <div className="bg-white border-[2px] border-[#023973] rounded-[6px] h-[400px] flex items-center justify-center font-[Montserrat] text-[#023973]">
                                Загрузка...
                            </div>
                        ) : error ? (
                            <div className="bg-white border-[2px] border-[#023973] rounded-[6px] h-[400px] flex items-center justify-center font-[Montserrat] text-[#023973]">
                                {error}
                            </div>
                        ) : selectedGroup && groups[selectedGroup] ? (
                            <div className="bg-white border-[2px] border-[#023973] rounded-[6px] h-[400px] overflow-y-auto">
                                <ul className="space-y-[10px] p-4">
                                    {groups[selectedGroup].map((employee) => (
                                        <li
                                            key={`${employee.id}-${employee.vacationId}`}
                                            onClick={() => handleEmployeeClick(employee)}
                                            className={`cursor-pointer p-2 rounded-[6px] font-[Montserrat] text-[#023973] ${
                                                selectedEmployee &&
                                                selectedEmployee.id === employee.id &&
                                                selectedEmployee.vacationId === employee.vacationId
                                                    ? 'bg-[#F5A623] text-white'
                                                    : hasCollision(employee, selectedGroup)
                                                        ? 'bg-red-200'
                                                        : 'bg-white'
                                            }`}
                                        >
                                            {employee.lastName} ({employee.email}, {employee.divisionName}), Отпуск:{' '}
                                            {formatDate(employee.startDate)} –{' '}
                                            {formatDate(employee.endDate)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-white border-[2px] border-[#023973] rounded-[6px] h-[400px] flex items-center justify-center font-[Montserrat] text-[#023973]">
                                Нет групп с коллизиями
                            </div>
                        )}
                        <button
                            onClick={handleSendRequest}
                            className="mt-[20px] cursor-pointer w-full h-[40px] bg-[#023973] text-base text-white font-medium rounded-[10px] font-[Montserrat]"
                        >
                            Отправить запрос на удаление
                        </button>
                        <button
                            onClick={handleIgnore}
                            className="mt-[10px] cursor-pointer w-full h-[40px] bg-[#023973] text-base text-white font-medium rounded-[10px] font-[Montserrat]"
                        >
                            Игнорировать
                        </button>
                        <button
                            onClick={handleSaveReport}
                            className="mt-[10px] cursor-pointer w-full h-[40px] bg-[#023973] text-base text-white font-medium rounded-[10px] font-[Montserrat]"
                        >
                            Сохранить отчёт
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdminPage;