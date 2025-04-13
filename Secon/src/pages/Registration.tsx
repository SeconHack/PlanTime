import { Link, useNavigate } from 'react-router-dom';
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
        // Получение списка ролей
        axios.get('http://109.73.203.81:9090/v1/role')
            .then(response => {
                setRoles(response.data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });

        // Получение списка профессий
        axios.get('http://109.73.203.81:9090/v1/profession')
            .then(response => {
                setProfessions(response.data);
            })
            .catch(error => {
                console.error('Error fetching professions:', error);
            });

        // Получение списка подразделений
        axios.get('http://109.73.203.81:9090/v1/division')
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Валидация в реальном времени
        validateField(name, value);
    };

    const handleSelectChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'lastName':
            case 'firstName':
            case 'middleName':
                if (!/^[А-Яа-яЁё]{1,30}$/.test(value)) {
                    newErrors[name] = 'Должны быть только русские буквы, от 1 до 30 символов';
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
            default:
                break;
        }

        setErrors(newErrors);
    };

    const validateForm = () => {
        const newErrors = {};

        // Проверка Фамилии, Имени, Отчества
        if (!/^[А-Яа-яЁё]{1,30}$/.test(formData.lastName)) {
            newErrors.lastName = 'Должны быть только русские буквы, от 1 до 30 символов';
        }
        if (!/^[А-Яа-яЁё]{1,30}$/.test(formData.firstName)) {
            newErrors.firstName = 'Должны быть только русские буквы, от 1 до 30 символов';
        }
        if (formData.middleName && !/^[А-Яа-яЁё]{1,30}$/.test(formData.middleName)) {
            newErrors.middleName = 'Должны быть только русские буквы, от 1 до 30 символов';
        }

        // Проверка почты
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            newErrors.email = 'Некорректный формат почты';
        }

        // Проверка телефона
        if (!/^8[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = 'Номер должен начинаться с 8 и содержать 11 цифр';
        }

        // Проверка пароля
        if (!/^[^\u0400-\u04FF]{6,}$/.test(formData.password)) {
            newErrors.password = 'Минимум 6 символов, без русских букв';
        }

        // Проверка повторного пароля
        if (formData.password !== formData.passwordRepeat) {
            newErrors.passwordRepeat = 'Пароли не совпадают';
        }

        // Проверка выбора роли, профессии, подразделения
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

        // Поиск ID для выбранных значений
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
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/HRdepartmentPage', { state: { successMessage: 'Пользователь успешно добавлен' } });
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response?.status === 400 || error.response?.status === 409) {
                setErrors({ ...errors, email: 'Эта почта уже зарегистрирована' });
                alert('Ошибка: Эта почта уже зарегистрирована');
            } else {
                alert('Ошибка при регистрации: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    return (
        <div className='flex min-h-screen flex-col justify-center items-center bg-[#023973]'>
            <div className='w-[520px] bg-[#FDE0B5] rounded-[45px] pl-[60px] pt-[60px] space-y-[30px] pb-[30px]'>
                <h4 className="text-2xl font-semibold font-[Montserrat] text-[#023973]">Создать аккаунт</h4>
                <form>
                    <div className="relative">
                        <CustomInput
                            label={"Фамилия"}
                            placeholder={"Введите фамилию"}
                            type={"text"}
                            name={'lastName'}
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                        {errors.lastName && (
                            <p className="text-red-600 text-sm font-[Montserrat] mt-1">{errors.lastName}</p>
                        )}
                    </div>
                    <div className="relative">
                        <CustomInput
                            label={"Имя"}
                            placeholder={"Введите имя"}
                            type={"text"}
                            name={'firstName'}
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                        {errors.firstName && (
                            <p className="text-red-600 text-sm font-[Montserrat] mt-1">{errors.firstName}</p>
                        )}
                    </div>
                    <div className="relative">
                        <CustomInput
                            label={"Отчество"}
                            placeholder={"Введите отчество"}
                            type={"text"}
                            name={'middleName'}
                            value={formData.middleName}
                            onChange={handleInputChange}
                        />
                        {errors.middleName && (
                            <p className="text-red-600 text-sm font-[Montserrat] mt-1">{errors.middleName}</p>
                        )}
                    </div>
                    <div className="relative">
                        <CustomInput
                            label={"Почта"}
                            placeholder={"Введите почту"}
                            type={"email"}
                            name={'email'}
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm font-[Montserrat] mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div className="relative">
                        <CustomInput
                            label={"Номер телефона"}
                            placeholder={"Введите телефон"}
                            type={"tel"}
                            name={'phone'}
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                        {errors.phone && (
                            <p className="text-red-600 text-sm font-[Montserrat] mt-1">{errors.phone}</p>
                        )}
                    </div>
                    <div className="relative">
                        <CustomInput
                            label={"Пароль"}
                            placeholder={"Введите пароль"}
                            type={"password"}
                            name={'password'}
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        {errors.password && (
                            <p className="text-red-600 text-sm font-[Montserrat] mt-1">{errors.password}</p>
                        )}
                    </div>
                    <div className="relative">
                        <CustomInput
                            label={"Повторите пароль"}
                            placeholder={"Повторите пароль"}
                            type={"password"}
                            name={'passwordRepeat'}
                            value={formData.passwordRepeat}
                            onChange={handleInputChange}
                        />
                        {errors.passwordRepeat && (
                            <p className="text-red-600 text-sm font-[Montserrat] mt-1">{errors.passwordRepeat}</p>
                        )}
                    </div>

                    {/* Combobox для Роли */}
                    <div className='mt-[6px] space-y-[6px]'>
                        <label className="block font-[Montserrat] text-[#023973] text-base font-semibold text-left">
                            Роль
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleSelectChange}
                            className='rounded-[6px] w-[400px] h-[40px] px-[20px] border-3 outline-none focus:border-[#F89807] border-[#FBCC83] bg-white font-[Montserrat] text-[#023973] text-base'
                        >
                            <option value="" disabled>Выберите роль</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.roleName}>
                                    {role.roleName}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p className="text-red-600 text-sm font-[Montserrat] mt-1">{errors.role}</p>
                        )}
                    </div>

                    {/* Combobox для Профессии */}
                    <div className='mt-[6px] space-y-[6px]'>
                        <label className="block font-[Montserrat] text-[#023973] text-base font-semibold text-left">
                            Профессия
                        </label>
                        <select
                            name="profession"
                            value={formData.profession}
                            onChange={handleSelectChange}
                            className='rounded-[6px] w-[400px] h-[40px] px-[20px] border-3 outline-none focus:border-[#F89807] border-[#FBCC83] bg-white font-[Montserrat] text-[#023973] text-base'
                        >
                            <option value="" disabled>Выберите профессию</option>
                            {professions.map((prof) => (
                                <option key={prof.id} value={prof.professionName}>
                                    {prof.professionName}
                                </option>
                            ))}
                        </select>
                        {errors.profession && (
                            <p className="text-red-600 text-sm font-[Montserrat] mt-1">{errors.profession}</p>
                        )}
                    </div>

                    {/* Combobox для Подразделения */}
                    <div className='mt-[6px] space-y-[6px]'>
                        <label className="block font-[Montserrat] text-[#023973] text-base font-semibold text-left">
                            Подразделение
                        </label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleSelectChange}
                            className='rounded-[6px] w-[400px] h-[40px] px-[20px] border-3 outline-none focus:border-[#F89807] border-[#FBCC83] bg-white font-[Montserrat] text-[#023973] text-base'
                        >
                            <option value="" disabled>Выберите подразделение</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.divisionName}>
                                    {dept.divisionName}
                                </option>
                            ))}
                        </select>
                        {errors.department && (
                            <p className="text-red-600 text-sm font-[Montserrat] mt-1">{errors.department}</p>
                        )}
                    </div>
                </form>
                <button
                    type='submit'
                    className='cursor-pointer w-[400px] h-[40px] bg-[#023973] text-base text-white font-medium rounded-[10px] font-[Montserrat]'
                    onClick={register}
                >
                    Создать аккаунт
                </button>
            </div>
        </div>
    );
};

export default Registration;