import logo from '../images/logo.png';
import { useState } from 'react';

const MainPage = () => {
    // Состояние для текущего месяца (0 - Январь, 1 - Февраль и т.д.)
    const [currentMonth, setCurrentMonth] = useState(1); // Начинаем с февраля

    // Массив месяцев и их количества дней (2025 - не високосный год)
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

    // Генерация массива дней для текущего месяца
    const days = Array.from({ length: months[currentMonth].days }, (_, i) => i + 1);

    const [form, setForm] = useState({ start: '', end: '' });
    const [selectedDates, setSelectedDates] = useState([]); // Храним даты как объекты { month, day }
    const remainingVacationDays = 28; // Пример: общее количество дней отпуска
    const maxSelectableDays = remainingVacationDays - 1; // Максимум можно выбрать на 1 день меньше

    // Вычисляем количество дней между двумя датами
    const calculateUsedDays = (start, end) => {
        if (!start || !end) return 0;

        const startMonthIndex = start.month;
        const endMonthIndex = end.month;

        if (startMonthIndex === endMonthIndex) {
            return end.day - start.day + 1;
        }

        // Если даты в разных месяцах
        let totalDays = 0;
        // Дни в первом месяце (от start.day до конца месяца)
        totalDays += months[startMonthIndex].days - start.day + 1;
        // Дни в последнем месяце (от начала до end.day)
        totalDays += end.day;
        // Дни в промежуточных месяцах (если есть)
        for (let i = startMonthIndex + 1; i < endMonthIndex; i++) {
            totalDays += months[i].days;
        }
        return totalDays;
    };

    // Функция для обработки клика по дню
    const handleDayClick = (day) => {
        let updatedDates = [...selectedDates];

        if (updatedDates.length < 2) {
            // Добавляем новую дату
            updatedDates.push({ month: currentMonth, day });
        } else {
            // Если уже выбрано две даты, заменяем ближайшую
            const [start, end] = updatedDates;
            const startDateValue = start.month * 100 + start.day;
            const endDateValue = end.month * 100 + end.day;
            const newDateValue = currentMonth * 100 + day;

            const distToStart = Math.abs(newDateValue - startDateValue);
            const distToEnd = Math.abs(newDateValue - endDateValue);

            if (distToStart <= distToEnd) {
                updatedDates[0] = { month: currentMonth, day }; // Заменяем начало
            } else {
                updatedDates[1] = { month: currentMonth, day }; // Заменяем конец
            }
        }

        // Сортируем даты по возрастанию
        updatedDates.sort((a, b) => {
            const aValue = a.month * 100 + a.day;
            const bValue = b.month * 100 + b.day;
            return aValue - bValue;
        });

        // Проверяем, не превышает ли диапазон максимальное количество дней
        if (updatedDates.length === 2) {
            let [start, end] = updatedDates;
            let totalDays = calculateUsedDays(start, end);

            if (totalDays > maxSelectableDays) {
                // Корректируем вторую дату, чтобы уложиться в лимит (maxSelectableDays)
                let remainingDays = maxSelectableDays;
                let newEndMonth = start.month;
                let newEndDay = start.day;

                // Добавляем дни, начиная с начальной даты
                while (remainingDays > 0) {
                    if (newEndDay < months[newEndMonth].days) {
                        newEndDay++;
                        remainingDays--;
                    } else {
                        newEndMonth++;
                        newEndDay = 0;
                        if (newEndMonth >= months.length) break; // Если вышли за пределы года
                    }
                }

                // Если вышли за пределы года или месяца, корректируем
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

        // Обновляем даты в полях "Начало" и "Конец"
        if (updatedDates.length > 0) {
            const monthIndexStart = updatedDates[0].month + 1; // Январь - 1, Февраль - 2 и т.д.
            const startDate = `2025-${monthIndexStart.toString().padStart(2, '0')}-${updatedDates[0].day.toString().padStart(2, '0')}`; // Формат YYYY-MM-DD
            const endDate = updatedDates[1]
                ? `2025-${(updatedDates[1].month + 1).toString().padStart(2, '0')}-${updatedDates[1].day.toString().padStart(2, '0')}`
                : '';
            setForm({ start: startDate, end: endDate });
        } else {
            setForm({ start: '', end: '' });
        }
    };

    // Проверка, входит ли день в выделенный диапазон
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
    const daysLeft = remainingVacationDays - usedVacationDays; // Оставшиеся дни

    // Переключение на предыдущий месяц
    const handlePrevMonth = () => {
        if (currentMonth > 0) {
            setCurrentMonth(currentMonth - 1);
        }
    };

    // Переключение на следующий месяц
    const handleNextMonth = () => {
        if (currentMonth < months.length - 1) {
            setCurrentMonth(currentMonth + 1);
        }
    };

    function handleSubmit(e) {
        e.preventDefault();
        console.log(form);
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function InfiniteDivs() {
        return (
            <div className="box-border flex flex-[0_0_auto] flex-row flex-wrap gap-[16px] items-end justify-start h-[488px] mt-[24px] pl-[40px]">
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

    return (
        <>
            <header className="flex justify-between items-center p-[1rem] bg-white">
                <img src={logo} alt="Logo" />
                <div className="rounded-[6px] w-[232px] h-[40px] border-[2px] pt-[7px] pl-[20px] bg-white font-[Montserrat] text-[#023973] font-semibold">
                    Профиль
                </div>
            </header>
            <section className="h-screen bg-[#FDE0B5] flex items-center justify-center">
                <div className="box-border flex items-start justify-between min-w-[1128px] bg-white border-[15px] pt-[60px]">
                    {/* Календарь */}
                    <div className="box-border flex flex-col items-stretch justify-start w-[872px] pb-[128px]">
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

                    {/* Форма */}
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
                            {/* Отображение оставшихся дней */}
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