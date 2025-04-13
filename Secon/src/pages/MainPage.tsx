import logo from '../images/logo.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MainPage = () => {
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(1);
    const [remainingVacationDays, setRemainingVacationDays] = useState(0); // Динамическое значение
    const [loading, setLoading] = useState(true); // Для отслеживания загрузки
    const [error, setError] = useState(null); // Для ошибок API
    const [Name, setName] = useState();

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

    const [form, setForm] = useState({ start: '', end: '' });
    const [selectedDates, setSelectedDates] = useState([]);
    const maxSelectableDays = remainingVacationDays > 0 ? remainingVacationDays - 1 : 0;

    // Загрузка countVacationDays при монтировании компонента и получение ФИО
    useEffect(() => {
        const fetchVacationDays = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
                navigate('/login');
                return;
            }

            try {
                const apiUrl = 'http://109.73.203.81:9090/v1/profile/me'; // Для локального тестирования: http://localhost:9090
                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Profile data:', response.data);
                setRemainingVacationDays(response.data.countVacationDays || 0);
                setName(response.data.lastName + " " + response.data.firstName + " " + response.data.middleName)
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error);
                setError('Не удалось загрузить данные профиля.');
                setLoading(false);
                if (error.response?.status === 401) {
                    alert('Сессия истекла, пожалуйста, войдите снова.');
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
            return aValue - bValue + 1;
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
            alert('Пожалуйста, выберите даты начала и конца отпуска.');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
            navigate('/login');
            return;
        }

        const startDate = new Date(form.start);
        const endDate = new Date(form.end);
        if (isNaN(startDate) || isNaN(endDate)) {
            alert('Пожалуйста, выберите корректные даты.');
            return;
        }

        const startDateOnly = new Date(form.start.split('T')[0]);
        const endDateOnly = new Date(form.end.split('T')[0]);
        if (startDateOnly.getTime() >= endDateOnly.getTime()) {
            alert('Дата окончания должна быть хотя бы на день позже даты начала.');
            return;
        }

        const payload = {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        };

        const apiUrl = 'http://109.73.203.81:9090/v1/vacation'; // Для локального тестирования: http://localhost:9090
        console.log('Submitting:', { payload, token, url: apiUrl });

        try {
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Заявка успешно отправлена:', response.data);
            alert('Заявка на отпуск успешно отправлена!');
            setForm({ start: '', end: '' });
            setSelectedDates([]);
            // Обновляем remainingVacationDays после успешной заявки
            const profileResponse = await axios.get('http://109.73.203.81:9090/v1/profile/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setRemainingVacationDays(profileResponse.data.countVacationDays || 0);
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
            if (error.response) {
                console.error('Response error:', error.response.data, error.response.status);
                if (error.response.status === 401) {
                    alert('Сессия истекла, пожалуйста, войдите снова.');
                    navigate('/login');
                } else if (error.response.status === 400) {
                    alert('Некорректные данные в запросе. Проверьте выбранные даты.');
                } else if (error.response.status === 403) {
                    alert('Доступ запрещен. Проверьте правильность токена.');
                } else {
                    alert(`Ошибка сервера: ${error.response.status}. Попробуйте позже.`);
                }
            } else if (error.request) {
                console.error('No response received:', error.request);
                alert('Сервер недоступен. Проверьте адрес сервера или подключение к интернету.');
            } else {
                console.error('Request setup error:', error.message);
                alert(`Ошибка при отправке заявки: ${error.message}`);
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

    function InfiniteDivs() {
        return (
            <div className="box-border grid grid-cols-7 gap-y-6 items-end mt-[24px] pl-[40px]">
                {days.map((element) => (
                    <div
                        key={element}
                        onClick={() => handleDayClick(element)}
                        className={`box-border flex flex-[0_0_auto] w-[80px] h-[80px] overflow-hidden text-white items-center justify-center font-[Montserrat] text-2xl cursor-pointer ${
                            isDayInRange(element, currentMonth) ? 'bg-[#F5A623]' : 'bg-[#023973]'
                        }`}
                    >
                        {element}
                    </div>
                ))}
            </div>
        );
    }

    const handleLogoClick = () => {
        window.location.href = 'https://penza.tns-e.ru/population/';
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        alert('Выход из профиля');
        navigate('/login');
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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
                        {Name}
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
                    <div className="box-border flex flex-col items-stretch justify-start w-[872px] h-[656px] pb-[128px]">
                        <div className="flex items-center justify-center space-x-[20px]">
                            <button
                                onClick={handlePrevMonth}
                                disabled={currentMonth === 0}
                                className={`w-[40px] h-[40px] rounded-full font-[Montserrat] text-2xl ${
                                    currentMonth === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#023973] text-white'
                                }`}
                            >
                                ←
                            </button>
                            <p className="flex-[0_0_auto] p-0 m-0 font-[Montserrat] font-semibold text-2xl text-black">
                                {months[currentMonth].name}
                            </p>
                            <button
                                onClick={handleNextMonth}
                                disabled={currentMonth === months.length - 1}
                                className={`w-[40px] h-[40px] rounded-full font-[Montserrat] text-2xl ml-[20px] ${
                                    currentMonth === months.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#023973] text-white'
                                }`}
                            >
                                →
                            </button>
                        </div>
                        <InfiniteDivs />
                    </div>

                    <div className="w-[520px] pr-[60px] space-y-[30px]">
                        <h4 className="text-2xl font-semibold font-[Montserrat] text-[#023973]">
                            Заявка
                        </h4>
                        <form className="space-y-[30px]" onSubmit={handleSubmit}>
                            <div className="space-y-[6px]">
                                <label className="block text-sm font-medium text-left text-[#023973] font-[Montserrat]">
                                    Начало
                                </label>
                                <input
                                    type="date"
                                    name="start"
                                    value={form.start}
                                    onChange={handleChange}
                                    className="w-[400px] h-[40px] border-[2px] border-[#023973] rounded-[6px] px-[10px] font-[Montserrat] text-[#023973] focus:outline-none"
                                />
                            </div>
                            <div className="space-y-[6px]">
                                <label className="block text-sm font-medium text-left text-[#023973] font-[Montserrat]">
                                    Конец
                                </label>
                                <input
                                    type="date"
                                    name="end"
                                    value={form.end}
                                    onChange={handleChange}
                                    className="w-[400px] h-[40px] border-[2px] border-[#023973] rounded-[6px] px-[10px] font-[Montserrat] text-[#023973] focus:outline-none"
                                />
                            </div>
                            <div className="space-y-[6px]">
                                <label className="block text-sm font-medium text-left text-[#023973] font-[Montserrat]">
                                    Отчет
                                </label>
                                <div className="w-[400px] h-[40px] border-[2px] border-[#023973] rounded-[6px] px-[10px] font-[Montserrat] text-[#023973] flex items-center">
                                    Осталось дней отпуска: {daysLeft}
                                </div>
                            </div>
                            <div className="flex space-x-[20px]">
                                <button
                                    type="submit"
                                    className="cursor-pointer w-[190px] h-[40px] bg-[#023973] text-base text-white font-medium rounded-[10px] font-[Montserrat]"
                                >
                                    Отправить
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForm({ start: '', end: '' });
                                        setSelectedDates([]);
                                    }}
                                    className="cursor-pointer w-[190px] h-[40px] bg-[#023973] text-base text-white font-medium rounded-[10px] font-[Montserrat]"
                                >
                                    Очистить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MainPage;