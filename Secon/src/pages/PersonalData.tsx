//import {Link} from 'react-router-dom'
import React, { useState } from 'react'
import DropdownList from '../components/DropdownList';
//import axios from 'axios';
import { client } from '../components/Api'

const PersonalData = () => {

    const [professions, setProfessions] = useState();
    const [roles, setRoles] = useState();
    const [departments, setDepartments] = useState();

    React.useEffect(() => {
        client.get(`${client.defaults.baseURL}v1/role`)
        .then(response => {
            setRoles(response.data)
        })
        client.get(`${client.defaults.baseURL}v1/profession`)
        .then(response => {
            setProfessions(response.data)
        })
        client.get(`${client.defaults.baseURL}v1/division`)
        .then(response => {
            setDepartments(response.data)
        })
    }, [])

    return (
        <div className='flex min-h-screen flex-col justify-center items-center bg-[#023973]'>
            <div className='w-[520px] bg-[#FDE0B5] rounded-[45px] pl-[60px] pt-[60px] space-y-[30px] pb-[30px]'>
                <h4 className="text-2xl font-semibold font-[Montserrat] text-[#023973]">Рабочая информация</h4>
                <form>
                    <DropdownList label={"Должность"} array={professions} name='Professions'/>
                    <DropdownList label={"Роль"} array={roles} name='Roles'/>
                    <DropdownList label={"Подразделение"} array={departments} name='Departments'/>
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
                <button type='submit' className='cursor-pointer w-[400px] h-[40px] bg-[#023973] text-base text-white font-medium rounded-[10px] font-[Montserrat]'>
                    Создать аккаунт
                </button>
                {/* <div className='font-customFont text-slate-900'>
                    Нет аккаунта?
                    <Link className='text-indigo-500 font-customFont' to="/Registration"> Создать аккаунт</Link>
                </div> */}
            </div>
        </div>
    );
};

export default PersonalData;