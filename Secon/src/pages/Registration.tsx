import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/CustomInput';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Registration = () => {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        email: '',
        phone: '',
        password: '',
        passwordRepeat: '',
        role: '',
        profession: '',
        department: ''
    });
    const [errors, setErrors] = useState({});
    const [roles, setRoles] = useState([]);
    const [professions, setProfessions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        const fetchData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };

                const [rolesRes, professionsRes, departmentsRes] = await Promise.all([
                    axios.get('http://109.73.203.81:9090/v1/role', { headers }),
                    axios.get('http://109.73.203.81:9090/v1/profession', { headers }),
                    axios.get('http://109.73.203.81:9090/v1/division', { headers }),
                ]);

                setRoles(rolesRes.data);
                setProfessions(professionsRes.data);
                setDepartments(departmentsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response?.status === 401) {
                    navigate('/login', { replace: true });
                }
            }
        };

        fetchData();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        validateField(name, value);
    };

    const handleSelectChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        validateField(e.target.name, e.target.value);
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'lastName':
            case 'firstName':
            case 'middleName':
                if (value && !/^[А-Яа-яЁё]{1,30}$/.test(value)) {
                    newErrors[name] = 'Только русские буквы, от 1 до 30 символов';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'email':
                if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                    newErrors[name] = 'Некорректный формат почты';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'phone':
                if (!/^8[0-9]{10}$/.test(value)) {
                    newErrors[name] = 'Номер должен начинаться с 8 и содержать 11 цифр';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'password':
                if (!/^[^\u0400-\u04FF]{6,}$/.test(value)) {
                    newErrors[name] = 'Минимум 6 символов, без русских букв';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'passwordRepeat':
                if (value !== formData.password) {
                    newErrors[name] = 'Пароли не совпадают';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'role':
            case 'profession':
            case 'department':
                if (!value) {
                    newErrors[name] = `Выберите ${name === 'role' ? 'роль' : name === 'profession' ? 'профессию' : 'подразделение'}`;
                } else {
                    delete newErrors[name];
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!/^[А-Яа-яЁё]{1,30}$/.test(formData.lastName)) {
            newErrors.lastName = 'Только русские буквы, от 1 до 30 символов';
        }
        if (!/^[А-Яа-яЁё]{1,30}$/.test(formData.firstName)) {
            newErrors.firstName = 'Только русские буквы, от 1 до 30 символов';
        }
        if (formData.middleName && !/^[А-Яа-яЁё]{1,30}$/.test(formData.middleName)) {
            newErrors.middleName = 'Только русские буквы, от 1 до 30 символов';
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            newErrors.email = 'Некорректный формат почты';
        }
        if (!/^8[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = 'Номер должен начинаться с 8 и содержать 11 цифр';
        }
        if (!/^[^\u0400-\u04FF]{6,}$/.test(formData.password)) {
            newErrors.password = 'Минимум 6 символов, без русских букв';
        }
        if (formData.password !== formData.passwordRepeat) {
            newErrors.passwordRepeat = 'Пароли не совпадают';
        }
        if (!formData.role) {
            newErrors.role = 'Выберите роль';
        }
        if (!formData.profession) {
            newErrors.profession = 'Выберите профессию';
        }
        if (!formData.department) {
            newErrors.department = 'Выберите подразделение';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const register = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        const selectedRole = roles.find(role => role.roleName === formData.role);
        const selectedProfession = professions.find(prof => prof.professionName === formData.profession);
        const selectedDepartment = departments.find(dept => dept.divisionName === formData.department);

        if (!selectedRole || !selectedProfession || !selectedDepartment) {
            alert('Пожалуйста, выберите роль, профессию и подразделение');
            return;
        }

        const payload = {
            email: formData.email,
            lastName: formData.lastName,
            firstName: formData.firstName,
            middleName: formData.middleName,
            phone: formData.phone,
            professionId: selectedProfession.id,
            roleId: selectedRole.id,
            divisionId: selectedDepartment.id,
            password: formData.password
        };

        try {
            const token = localStorage.getItem('accessToken');
            await axios.post('http://109.73.203.81:9090/v1/auth/register', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            navigate('/HRdepartmentPage', { state: { successMessage: 'Пользователь успешно добавлен' } });
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response?.status === 400 || error.response?.status === 409) {
                setErrors({ ...errors, email: 'Эта почта уже зарегистрирована' });
                alert('Ошибка: Эта почта уже зарегистрирована');
            } else if (error.response?.status === 401) {
                navigate('/login', { replace: true });
            } else {
                alert('Ошибка при регистрации: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleBackToHR = () => {
        navigate('/HRdepartmentPage');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-[Montserrat]">
            <header className="flex justify-between items-center p-4 bg-white shadow-md">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleBackToHR}
                        style={{
                            backgroundColor: '#023973',
                            color: 'white',
                            transition: 'background-color 0.3s',
                            fontFamily: 'Montserrat, sans-serif',
                        }}
                        className="px-6 py-2 rounded-lg hover:bg-[#012A5A]"
                    >
                        Назад
                    </button>
                </div>
            </header>
            <section className="flex items-center justify-center p-6">
                <div className="flex flex-col bg-white rounded-2xl shadow-xl max-w-6xl w-full">
                    <div className="p-8">
                        <h4
                            style={{
                                color: '#023973',
                                fontFamily: 'Montserrat, sans-serif',
                            }}
                            className="text-2xl font-semibold mb-6"
                        >
                            Создать аккаунт
                        </h4>
                        <div
                            style={{ borderColor: '#023973' }}
                            className="bg-white border-2 rounded-lg p-6"
                        >
                            <form className="space-y-4">
                                <div>
                                    <CustomInput
                                        label="Фамилия"
                                        placeholder="Введите фамилию"
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        style={{
                                            borderColor: '#023973',
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                            '--tw-ring-color': '#023973',
                                        }}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                                    )}
                                </div>
                                <div>
                                    <CustomInput
                                        label="Имя"
                                        placeholder="Введите имя"
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        style={{
                                            borderColor: '#023973',
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                            '--tw-ring-color': '#023973',
                                        }}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                                    )}
                                </div>
                                <div>
                                    <CustomInput
                                        label="Отчество"
                                        placeholder="Введите отчество"
                                        type="text"
                                        name="middleName"
                                        value={formData.middleName}
                                        onChange={handleInputChange}
                                        style={{
                                            borderColor: '#023973',
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                            '--tw-ring-color': '#023973',
                                        }}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                    />
                                    {errors.middleName && (
                                        <p className="text-red-600 text-sm mt-1">{errors.middleName}</p>
                                    )}
                                </div>
                                <div>
                                    <CustomInput
                                        label="Почта"
                                        placeholder="Введите почту"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        style={{
                                            borderColor: '#023973',
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                            '--tw-ring-color': '#023973',
                                        }}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                    />
                                    {errors.email && (
                                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <CustomInput
                                        label="Номер телефона"
                                        placeholder="Введите телефон"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        style={{
                                            borderColor: '#023973',
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                            '--tw-ring-color': '#023973',
                                        }}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>
                                <div>
                                    <CustomInput
                                        label="Пароль"
                                        placeholder="Введите пароль"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        style={{
                                            borderColor: '#023973',
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                            '--tw-ring-color': '#023973',
                                        }}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                    />
                                    {errors.password && (
                                        <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                                    )}
                                </div>
                                <div>
                                    <CustomInput
                                        label="Повторите пароль"
                                        placeholder="Повторите пароль"
                                        type="password"
                                        name="passwordRepeat"
                                        value={formData.passwordRepeat}
                                        onChange={handleInputChange}
                                        style={{
                                            borderColor: '#023973',
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                            '--tw-ring-color': '#023973',
                                        }}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                    />
                                    {errors.passwordRepeat && (
                                        <p className="text-red-600 text-sm mt-1">{errors.passwordRepeat}</p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        style={{
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                        }}
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Роль
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleSelectChange}
                                        style={{
                                            borderColor: '#023973',
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                            '--tw-ring-color': '#023973',
                                        }}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                    >
                                        <option value="" disabled>Выберите роль</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.roleName}>
                                                {role.roleName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.role && (
                                        <p className="text-red-600 text-sm mt-1">{errors.role}</p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        style={{
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                        }}
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Профессия
                                    </label>
                                    <select
                                        name="profession"
                                        value={formData.profession}
                                        onChange={handleSelectChange}
                                        style={{
                                            borderColor: '#023973',
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                            '--tw-ring-color': '#023973',
                                        }}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                    >
                                        <option value="" disabled>Выберите профессию</option>
                                        {professions.map((prof) => (
                                            <option key={prof.id} value={prof.professionName}>
                                                {prof.professionName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.profession && (
                                        <p className="text-red-600 text-sm mt-1">{errors.profession}</p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        style={{
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                        }}
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Подразделение
                                    </label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleSelectChange}
                                        style={{
                                            borderColor: '#023973',
                                            color: '#023973',
                                            fontFamily: 'Montserrat, sans-serif',
                                            '--tw-ring-color': '#023973',
                                        }}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:border-[#023973]"
                                    >
                                        <option value="" disabled>Выберите подразделение</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.divisionName}>
                                                {dept.divisionName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.department && (
                                        <p className="text-red-600 text-sm mt-1">{errors.department}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    onClick={register}
                                    style={{
                                        backgroundColor: '#023973',
                                        color: 'white',
                                        transition: 'background-color 0.3s',
                                        fontFamily: 'Montserrat, sans-serif',
                                    }}
                                    className="w-full py-3 text-base font-medium rounded-lg hover:bg-[#012A5A]"
                                >
                                    Создать аккаунт
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Registration;