import React, { useState } from 'react';
import './App.css';

const TestCalendar = () => {
    
    const [form, setForm] = useState({destination: '', start: '', end: ''});

    function handleSubmit() {
        console.log(form);
    }
    
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    return (
        <div className='container'>
            <form className='form'>
                <div className='input'>
                    <input type="text" name="location"/>
                </div>
                <div className='input'>
                    <input type="date" name="start"/>
                </div>
                <div className='input'>
                    <input type="date" name="end"/>
                </div>
                <div className='input'>
                    <button onClick={handleSubmit} type='button'>Search</button>
                </div>
            </form>
        </div >
    )
}

export default TestCalendar;