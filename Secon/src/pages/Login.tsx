import { useState } from 'react';
import axios from 'axios'
//import { client } from '../components/Api';
import CustomInput from '../components/CustomInput';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [Email, setMail] = useState("");
    const [Password, setPassword] = useState("");
    const navigate = useNavigate()

    const login = (e) => {
        e.preventDefault();
        axios.post(`http://109.73.203.81:9090/v1/auth/login`,{
            Email,
            Password
        })
        .then(function(response){
            console.log(response)
            localStorage.setItem("accessToken", response.data.token);
            navigate('/MainPage');
        })
        .catch(function(error){
            console.log(error);
        })
    }

    return (
        <div className='flex min-h-screen flex-col justify-center items-center bg-[#023973]'>
            <div className='w-[520px] bg-[#FDE0B5] rounded-[45px] pl-[60px] pt-[60px] space-y-[30px] pb-[30px]'>
                <h4 className="text-2xl font-semibold font-[Montserrat] text-[#023973]">Вход</h4>
                <form>
                    <CustomInput label={"Почта"} placeholder={"Введите почту"} type={"email"} name={'Reg_mail'} onChange={e => setMail(e.currentTarget.value)}/>
                    <CustomInput label={"Пароль"} placeholder={"Введите пароль"} type={"password"} name={'Reg_password'} onChange={e => setPassword(e.currentTarget.value)}/>
                    {/* <div className='space-y-[6px]'>
                        <label className="block text-sm font-medium text-left text-slate-900">Выберите роль</label>
                        <div className='overflow-hidden w-[166px] h-[42px] bg-tabsColor flex justify-center items-center rounded-[6px]'>
                            <button id='reader' className='tabs w-[89px] h-8 bg-white float-left cursor-pointer font-customFont text-sm font-medium rounded-[3px]
                            text-slate-900 hover:bg-white py-1.5 px-3 outline-none border-none shadow-none'
                                onClick={handleClick}>
                                Читатель
                            </button>
                            <button id='writer' className='tabs w-[67px] h-8 bg-tabsColor float-left cursor-pointer font-customFont text-sm font-medium rounded-[3px]
                            text-slate-900 hover:bg-white py-1.5 px-3 outline-none border-none shadow-none'
                                onClick={handleClick}>
                                Автор
                            </button>
                        </div>
                    </div> */}
                </form>
                <button onClick={login} type='submit' className='cursor-pointer w-[400px] h-[40px] bg-[#023973] text-base text-white font-medium
                    rounded-[10px] font-[Montserrat]'>
                    Войти
                </button>
                {/* <div className='font-customFont text-slate-900'>
                    Нет аккаунта?
                    <Link className='text-indigo-500 font-customFont' to="/Registration"> Создать аккаунт</Link>
                </div> */}
            </div>
        </div>
    );
};

export default Login;