const DropdownList = ({...props}) => {
    return (
        <div className='mt-[6px] space-y-[6px]'>
            <label className="block font-[Montserrat] text-[#023973] text-base font-semibold text-left">{props.label}</label>
            <select className="rounded-[6px] w-[400px] h-[40px] outline-0 bg-white font-[Montserrat] text-[#023973] text-sm font-semibold ">
                {props.array?.map(element => 
                    <option>{element}</option>
                )}
            </select>
        </div>
    );
};

export default DropdownList;