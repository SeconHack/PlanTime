import {Link} from 'react-router-dom'
import CustomInput from '../components/CustomInput';
// import axios from 'axios';
// import { client } from '../components/Api'

const Registration = () => {

    const register = (e) => {
        
        // e.preventDefault()        
        // axios.post(`${client.defaults.baseURL}/v1/auth/register`,{
        //     email: Email,
        //     password: Password,
        //     role: Role
        // })
        // .then(function(response){
        //     localStorage.setItem("accessToken", response.data.accessToken);
        //     localStorage.setItem("refreshToken", response.data.refreshToken);
        //     window.location = '/Posts'
        //     // redirect(Posts)
        // })
        // .catch(function(error){
        //     console.log(error);
        // })
    };

    return (
        <div className='flex min-h-screen flex-col justify-center items-center bg-[#023973]'>
            <div className='w-[520px] bg-[#FDE0B5] rounded-[45px] pl-[60px] pt-[60px] space-y-[30px] pb-[30px]'>
                <h4 className="text-2xl font-semibold font-[Montserrat] text-[#023973]">Создать аккаунт</h4>
                <form>
                    <CustomInput label={"Фамилия"} placeholder={"Введите фамилию"} type={"text"} name={'Reg_Last_Name'}/>
                    <CustomInput label={"Имя"} placeholder={"Введите имя"} type={"text"} name={'Reg_First_Name'}/>
                    <CustomInput label={"Отчество"} placeholder={"Введите отчество"} type={"text"} name={'Reg_Patronymoic'}/>
                    <CustomInput label={"Почта"} placeholder={"Введите почту"} type={"email"} name={'Reg_mail'}/>
                    <CustomInput label={"Номер телефона"} placeholder={"Введите телефон"} type={"tel"} name={'Reg_phone'}/>
                    <CustomInput label={"Пароль"} placeholder={"Введите пароль"} type={"password"} name={'Reg_password'}/>
                    <CustomInput label={"Повторите пароль"} placeholder={"Повторите пароль"} type={"password"} name={'Reg_password_repeat'}/>
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
                <button type='submit' className='cursor-pointer w-[400px] h-[40px] bg-[#023973] text-base text-white font-medium rounded-[10px] font-[Montserrat]'
                    onClick={register}>
                    Создать аккаунт
                </button>
                <div className='font-customFont text-slate-900'>
                    Уже есть аккаунт?
                    <Link className='text-indigo-500 font-customFont' to="/Login"> Войти</Link>
                </div>
            </div>
        </div>
    );
};

export default Registration;