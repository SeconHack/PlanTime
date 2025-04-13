import logo from '../images/logo.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MainPage = () => {
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(0);
    const [remainingVacationDays, setRemainingVacationDays] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [roleId, setRoleId] = useState(null);
    const [form, setForm] = useState({ start: '', end: '' });
    const [selectedDates, setSelectedDates] = useState([]);
    const [message, setMessage] = useState(''); // Новое состояние для сообщений

    const months = [
        { name: 'ЯНВАРЬ', days: 31 },
        { name: 'ФЕВРАЛЬ', days: 28 },
        { name: 'МАРТ', days: 31 },
        { name: 'АПРЕЛЬ', days: 30 },
        { name: 'МАЙ', days: 31 },
        { name: 'ИЮНЬ', days: 30 },
        { name: 'ИЮЛЬ', days: 31 },
        { name: 'АВГУСТ', days: 31 },
        { name: 'СЕНТЯБРЬ', days: 30 },
        { name: 'ОКТЯБРЬ', days: 31 },
        { name: 'НОЯБРЬ', days: 30 },
        { name: 'ДЕКАБРЬ', days: 31 },
    ];

    const days = Array.from({ length: months[currentMonth].days }, (_, i) => i + 1);
    const maxSelectableDays = remainingVacationDays > 0 ? remainingVacationDays - 1 : 0;

    // Функция для отображения сообщения с автоматическим исчезновением
    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(''), 5000); // Сообщение исчезает через 5 секунд
    };

    // Загрузка данных профиля
    useEffect(() => {
        const fetchVacationDays = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                showMessage('Вы не авторизованы. Пожалуйста, войдите в систему.');
                navigate('/login');
                return;
            }

            try {
                const apiUrl = 'http://109.73.203.81:9090/v1/profile/me';
                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setRemainingVacationDays(response.data.countVacationDays || 0);
                setName(
                    `${response.data.lastName} ${response.data.firstName} ${response.data.middleName}`
                );
                setRoleId(response.data.roleId || null);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error);
                setError('Не удалось загрузить данные профиля.');
                setLoading(false);
                if (error.response?.status === 401) {
                    showMessage('Сессия истекла, пожалуйста, войдите снова.');
                    navigate('/login');
                }
            }
        };
        fetchVacationDays();
    }, [navigate]);

    const calculateUsedDays = (start, end) => {
        if (!start || !end) return 0;

        const startMonthIndex = start.month;
        const endMonthIndex = end.month;

        if (startMonthIndex === endMonthIndex) {
            return end.day - start.day + 1;
        }

        let totalDays = 0;
        totalDays += months[startMonthIndex].days - start.day + 1;
        totalDays += end.day;
        for (let i = startMonthIndex + 1; i < endMonthIndex; i++) {
            totalDays += months[i].days;
        }
        return totalDays;
    };

    const handleDayClick = (day) => {
        let updatedDates = [...selectedDates];

        if (updatedDates.length < 2) {
            updatedDates.push({ month: currentMonth, day });
        } else {
            const [start, end] = updatedDates;
            const startDateValue = start.month * 100 + start.day;
            const endDateValue = end.month * 100 + end.day;
            const newDateValue = currentMonth * 100 + day;

            const distToStart = Math.abs(newDateValue - startDateValue);
            const distToEnd = Math.abs(newDateValue - endDateValue);

            if (distToStart <= distToEnd) {
                updatedDates[0] = { month: currentMonth, day };
            } else {
                updatedDates[1] = { month: currentMonth, day };
            }
        }

        updatedDates.sort((a, b) => {
            const aValue = a.month * 100 + a.day;
            const bValue = b.month * 100 + b.day;
            return aValue - bValue;
        });

        if (updatedDates.length === 2) {
            let [start, end] = updatedDates;
            let totalDays = calculateUsedDays(start, end);

            if (totalDays > maxSelectableDays) {
                let remainingDays = maxSelectableDays;
                let newEndMonth = start.month;
                let newEndDay = start.day;

                while (remainingDays > 0) {
                    if (newEndDay < months[newEndMonth].days) {
                        newEndDay++;
                        remainingDays--;
                    } else {
                        newEndMonth++;
                        newEndDay = 0;
                        if (newEndMonth >= months.length) break;
                    }
                }

                if (newEndMonth >= months.length) {
                    newEndMonth = months.length - 1;
                    newEndDay = months[newEndMonth].days;
                } else if (newEndDay === 0) {
                    newEndDay = 1;
                }

                updatedDates[1] = { month: newEndMonth, day: newEndDay };
            }
        }

        setSelectedDates(updatedDates);

        if (updatedDates.length > 0) {
            const monthIndexStart = updatedDates[0].month + 1;
            const startDate = `2025-${monthIndexStart.toString().padStart(2, '0')}-${updatedDates[0].day.toString().padStart(2, '0')}`;
            const endDate = updatedDates[1]
                ? `2025-${(updatedDates[1].month + 1).toString().padStart(2, '0')}-${updatedDates[1].day.toString().padStart(2, '0')}`
                : '';
            setForm({ start: startDate, end: endDate });
        } else {
            setForm({ start: '', end: '' });
        }
    };

    const isDayInRange = (day, monthIndex) => {
        if (selectedDates.length < 2) {
            return selectedDates.some((date) => date.month === monthIndex && date.day === day);
        }

        const [start, end] = selectedDates;
        const currentDateValue = monthIndex * 100 + day;
        const startDateValue = start.month * 100 + start.day;
        const endDateValue = end.month * 100 + end.day;

        return currentDateValue >= startDateValue && currentDateValue <= endDateValue;
    };

    const usedVacationDays = calculateUsedDays(selectedDates[0], selectedDates[1]);
    const daysLeft = remainingVacationDays - usedVacationDays;

    const handlePrevMonth = () => {
        if (currentMonth > 0) {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth < months.length - 1) {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.start || !form.end) {
            showMessage('Пожалуйста, выберите даты начала и конца отпуска.');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            showMessage('Вы не авторизованы. Пожалуйста, войдите в систему.');
            navigate('/login');
            return;
        }

        const startDate = new Date(form.start);
        const endDate = new Date(form.end);
        if (isNaN(startDate) || isNaN(endDate)) {
            showMessage('Пожалуйста, выберите корректные даты.');
            return;
        }

        const startDateOnly = new Date(form.start.split('T')[0]);
        const endDateOnly = new Date(form.end.split('T')[0]);
        if (startDateOnly.getTime() >= endDateOnly.getTime()) {
            showMessage('Дата окончания должна быть хотя бы на день позже даты начала.');
            return;
        }

        const payload = {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        };

        const apiUrl = 'http://109.73.203.81:9090/v1/vacation';

        try {
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            showMessage('Заявка на отпуск успешно отправлена!');
            setForm({ start: '', end: '' });
            setSelectedDates([]);
            const profileResponse = await axios.get('http://109.73.203.81:9090/v1/profile/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setRemainingVacationDays(profileResponse.data.countVacationDays || 0);
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
            if (error.response?.status === 401) {
                showMessage('Сессия истекла, пожалуйста, войдите снова.');
                navigate('/login');
            } else if (error.response?.status === 400) {
                showMessage('Некорректные данные в запросе. Проверьте выбранные даты.');
            } else {
                showMessage('Ошибка при отправке заявки. Попробуйте позже.');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (value) {
            const [year, month, day] = value.split('-').map(Number);
            if (name === 'start') {
                setSelectedDates([{ month: month - 1, day }, selectedDates[1] || null]);
            } else if (name === 'end') {
                setSelectedDates([selectedDates[0] || null, { month: month - 1, day }]);
            }
        }
    };

    const handleLogoClick = () => {
        window.location.href = 'https://penza.tns-e.ru/population/';
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        showMessage('Выход из профиля');
        navigate('/login');
    };

    const handleAdminPageClick = () => {
        navigate('/AdminPage');
    };

    const handleHRPageClick = () => {
        navigate('/HRdepartmentPage');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-2xl font-semibold text-gray-700 animate-pulse">Загрузка...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-white shadow-md">
                <div className="flex items-center space-x-4">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-12 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleLogoClick}
                    />
                    {roleId === 2 && (
                        <button
                            onClick={handleAdminPageClick}
                            style={{
                                backgroundColor: '#023973',
                                color: 'white',
                                transition: 'background-color 0.3s',
                            }}
                            className="px-6 py-2 rounded-lg hover:bg-[#012A5A]"
                        >
                            Панель администратора
                        </button>
                    )}
                    {roleId === 3 && (
                        <button
                            onClick={handleHRPageClick}
                            style={{
                                backgroundColor: '#023973',
                                color: 'white',
                                transition: 'background-color 0.3s',
                            }}
                            className="px-6 py-2 rounded-lg hover:bg-[#012A5A]"
                        >
                            Отдел кадров
                        </button>
                    )}
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

            {/* Main Content */}
            <main className="flex justify-center p-6 relative">
                {/* Контейнер для сообщений */}
                {message && (
                    <div
                        style={{ backgroundColor: '#023973', color: 'white' }}
                        className="absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-20 animate-fade-in"
                    >
                        {message}
                    </div>
                )}
                <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-xl max-w-6xl w-full overflow-hidden">
                    {/* Calendar Section */}
                    <div className="p-8 flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={handlePrevMonth}
                                disabled={currentMonth === 0}
                                style={{
                                    backgroundColor: currentMonth === 0 ? '' : '#023973',
                                    color: currentMonth === 0 ? '' : 'white',
                                    transition: 'background-color 0.3s',
                                }}
                                className={`p-2 rounded-full ${
                                    currentMonth === 0
                                        ? 'bg-gray-200 cursor-not-allowed'
                                        : 'hover:bg-[#012A5A]'
                                }`}
                            >
                                ←
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {months[currentMonth].name}
                            </h2>
                            <button
                                onClick={handleNextMonth}
                                disabled={currentMonth === months.length - 1}
                                style={{
                                    backgroundColor:
                                        currentMonth === months.length - 1 ? '' : '#023973',
                                    color: currentMonth === months.length - 1 ? '' : 'white',
                                    transition: 'background-color 0.3s',
                                }}
                                className={`p-2 rounded-full ${
                                    currentMonth === months.length - 1
                                        ? 'bg-gray-200 cursor-not-allowed'
                                        : 'hover:bg-[#012A5A]'
                                }`}
                            >
                                →
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {days.map((day) => (
                                <button
                                    key={day}
                                    onClick={() => handleDayClick(day)}
                                    style={{
                                        backgroundColor: isDayInRange(day, currentMonth)
                                            ? '#F89807'
                                            : '#023973',
                                        color: 'white',
                                        transition: 'background-color 0.3s',
                                    }}
                                    className={`p-4 rounded-lg text-lg font-medium hover:${
                                        isDayInRange(day, currentMonth)
                                            ? 'bg-[#D87E06]'
                                            : 'bg-[#012A5A]'
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-8 bg-gray-50 w-full lg:w-96">
                        <h3
                            style={{ color: '#023973' }}
                            className="text-xl font-semibold mb-6"
                        >
                            Заявка
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Начало
                                </label>
                                <input
                                    type="date"
                                    name="start"
                                    value={form.start}
                                    onChange={handleChange}
                                    style={{
                                        borderColor: '#023973',
                                        '--tw-ring-color': '#023973',
                                        transition: 'border-color 0.3s, box-shadow 0.3s',
                                    }}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Конец
                                </label>
                                <input
                                    type="date"
                                    name="end"
                                    value={form.end}
                                    onChange={handleChange}
                                    style={{
                                        borderColor: '#023973',
                                        '--tw-ring-color': '#023973',
                                        transition: 'border-color 0.3s, box-shadow 0.3s',
                                    }}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Отчет
                                </label>
                                <div className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg">
                                    Осталось дней отпуска: {daysLeft}
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    style={{
                                        backgroundColor: '#023973',
                                        color: 'white',
                                        transition: 'background-color 0.3s',
                                    }}
                                    className="flex-1 py-2 rounded-lg hover:bg-[#012A5A]"
                                >
                                    Отправить
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForm({ start: '', end: '' });
                                        setSelectedDates([]);
                                    }}
                                    className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Очистить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainPage;