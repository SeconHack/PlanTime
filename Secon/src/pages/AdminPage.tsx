import logo from '../images/logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Для навигации

const AdminPage = () => {
    const navigate = useNavigate(); // Хук для навигации
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Состояние для выпадающего меню профиля

    // Тестовые данные для групп коллизий
    const initialGroups = {
        'Группа 1': [
            { id: 1, lastName: 'Иванов', email: 'ivanov@example.com', startDate: '2025-02-01', endDate: '2025-02-05' },
            { id: 2, lastName: 'Петров', email: 'petrov@example.com', startDate: '2025-02-03', endDate: '2025-02-07' },
            { id: 3, lastName: 'Сидоров', email: 'sidorov@example.com', startDate: '2025-02-04', endDate: '2025-02-06' },
        ],
        'Группа 2': [
            { id: 4, lastName: 'Козлов', email: 'kozlov@example.com', startDate: '2025-02-10', endDate: '2025-02-12' },
            { id: 5, lastName: 'Смирнов', email: 'smirnov@example.com', startDate: '2025-02-10', endDate: '2025-02-15' },
        ],
        'Группа 3': [
            { id: 6, lastName: 'Федоров', email: 'fedorov@example.com', startDate: '2025-02-05', endDate: '2025-02-09' },
            { id: 7, lastName: 'Михайлов', email: 'mikhailov@example.com', startDate: '2025-02-07', endDate: '2025-02-10' },
        ],
    };

    const [groups, setGroups] = useState(initialGroups);
    const [selectedGroup, setSelectedGroup] = useState('Группа 1'); // Текущая активная группа
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Функция для определения коллизий внутри текущей группы
    const hasCollision = (employee, groupName) => {
        const currentGroup = groups[groupName];
        return currentGroup.some((otherEmployee) => {
            if (employee.id === otherEmployee.id) return false; // Пропускаем сравнение с самим собой
            const start1 = new Date(employee.startDate);
            const end1 = new Date(employee.endDate);
            const start2 = new Date(otherEmployee.startDate);
            const end2 = new Date(otherEmployee.endDate);
            return start1 <= end2 && start2 <= end1; // Проверка пересечения дат
        });
    };

    // Обработка клика по сотруднику
    const handleEmployeeClick = (employee) => {
        setSelectedEmployee(employee);
    };

    // Удаление сотрудника из группы и проверка, нужно ли удалить группу
    const removeEmployeeFromGroup = () => {
        if (!selectedEmployee) {
            alert('Пожалуйста, выберите сотрудника.');
            return;
        }

        // Удаляем сотрудника из текущей группы
        const updatedGroup = groups[selectedGroup].filter((emp) => emp.id !== selectedEmployee.id);

        // Если в группе остался 1 сотрудник, удаляем группу
        if (updatedGroup.length === 1) {
            const newGroups = { ...groups };
            delete newGroups[selectedGroup]; // Удаляем группу
            setGroups(newGroups);

            // Переключаемся на следующую доступную группу
            const groupNames = Object.keys(newGroups);
            if (groupNames.length > 0) {
                setSelectedGroup(groupNames[0]); // Переключаемся на первую группу
            } else {
                setSelectedGroup(null); // Если групп больше нет
            }
        } else {
            // Если в группе осталось больше 1 сотрудника, просто обновляем группу
            setGroups({
                ...groups,
                [selectedGroup]: updatedGroup,
            });
        }
        setSelectedEmployee(null); // Сбрасываем выбор
    };

    // Отправка запроса на изменение и удаление сотрудника из группы
    const handleSendRequest = () => {
        if (selectedEmployee) {
            console.log(
                `Отправка запроса на изменение на ${selectedEmployee.email} по отпуску с ${selectedEmployee.startDate} по ${selectedEmployee.endDate}`
            );
            alert(`Запрос на изменение отправлен на ${selectedEmployee.email}`);
            removeEmployeeFromGroup();
        } else {
            alert('Пожалуйста, выберите сотрудника для отправки запроса.');
        }
    };

    // Игнорирование коллизии
    const handleIgnore = () => {
        removeEmployeeFromGroup();
    };

    // Сохранение отчёта
    const handleSaveReport = () => {
        const reportData = JSON.stringify(groups, null, 2);
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
        window.location.href = 'https://penza.tns-e.ru/population/'; // Перенаправление на сайт
    };

    // Обработка выхода
    const handleLogout = () => {
        alert('Выход из профиля');
        // Здесь можно добавить реальную логику выхода, например, очистку токена или редирект на страницу логина
        navigate('/login'); // Предполагаемый маршрут для страницы логина
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
                    {/* Группы коллизий */}
                    <div className="box-border flex flex-col items-stretch justify-start w-full pb-[128px] px-[40px]">
                        <h4 className="text-2xl font-semibold font-[Montserrat] text-[#023973] mb-[20px]">
                            Коллизии
                        </h4>
                        {/* Вкладки для переключения групп */}
                        <div className="flex space-x-[10px] mb-[20px] overflow-x-auto">
                            {Object.keys(groups).map((groupName) => (
                                <button
                                    key={groupName}
                                    onClick={() => {
                                        setSelectedGroup(groupName);
                                        setSelectedEmployee(null); // Сбрасываем выбор при смене группы
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
                        {/* Список сотрудников в текущей группе */}
                        {selectedGroup && groups[selectedGroup] ? (
                            <div className="bg-white border-[2px] border-[#023973] rounded-[6px] h-[400px] overflow-y-auto">
                                <ul className="space-y-[10px] p-4">
                                    {groups[selectedGroup].map((employee) => (
                                        <li
                                            key={employee.id}
                                            onClick={() => handleEmployeeClick(employee)}
                                            className={`cursor-pointer p-2 rounded-[6px] font-[Montserrat] text-[#023973] ${
                                                selectedEmployee && selectedEmployee.id === employee.id
                                                    ? 'bg-[#F5A623] text-white'
                                                    : hasCollision(employee, selectedGroup)
                                                        ? 'bg-red-200'
                                                        : 'bg-white'
                                            }`}
                                        >
                                            {employee.lastName}, {employee.email}, Отпуск: {employee.startDate} – {employee.endDate}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-white border-[2px] border-[#023973] rounded-[6px] h-[400px] flex items-center justify-center font-[Montserrat] text-[#023973]">
                                Нет групп с коллизиями
                            </div>
                        )}
                        {/* Кнопки, растянутые на всю ширину */}
                        <button
                            onClick={handleSendRequest}
                            className="mt-[20px] cursor-pointer w-full h-[40px] bg-[#023973] text-base text-white font-medium rounded-[10px] font-[Montserrat]"
                        >
                            Отправить запрос на изменение
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