import { useState } from 'react';
import axios from 'axios';
import CustomInput from '../components/CustomInput';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [Email, setMail] = useState("");
    const [Password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();
        setError("");
        axios.post(`http://109.73.203.81:9090/v1/auth/login`, {
            Email,
            Password
        })
            .then(function(response) {
                console.log(response);
                localStorage.setItem("accessToken", response.data.token);
                navigate('/MainPage');
            })
            .catch(function(error) {
                console.error(error);
                if (error.response) {
                    if (error.response.status === 401 || error.response.status === 400 || error.response.status === 404) {
                        setError("Пользователь не найден или неверные учетные данные");
                    } else {
                        setError("Ошибка сервера. Попробуйте позже.");
                    }
                } else {
                    setError("Не удалось подключиться к серверу.");
                }
            });
    };

    return (
        <div className='flex min-h-screen flex-col justify-center items-center bg-[#023973]'>
            <div className='w-[520px] bg-[#FDE0B5] rounded-[45px] pl-[60px] pr-[60px] pt-[30px] space-y-[30px] pb-[30px]'>
                <h4 className="text-2xl font-semibold font-[Montserrat] text-[#023973] text-center">Вход</h4>
                <form>
                    <CustomInput
                        label={"Почта"}
                        placeholder={"Введите почту"}
                        type={"email"}
                        name={'Reg_mail'}
                        onChange={e => setMail(e.currentTarget.value)}
                    />
                    <CustomInput
                        label={"Пароль"}
                        placeholder={"Введите пароль"}
                        type={"password"}
                        name={'Reg_password'}
                        onChange={e => setPassword(e.currentTarget.value)}
                    />
                </form>
                {error && (
                    <p className="text-red-600 text-sm font-[Montserrat] text-center mx-auto max-w-[400px]">{error}</p>
                )}
                <button
                    onClick={login}
                    type='submit'
                    className='cursor-pointer w-[400px] h-[40px] bg-[#023973] text-base text-white font-medium rounded-[10px] font-[Montserrat] mx-auto block'
                >
                    Войти
                </button>
            </div>
        </div>
    );
};

export default Login;