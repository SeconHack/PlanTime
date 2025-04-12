const CustomInput = ({label, ...props}) => {
    return (
        <div className='mt-[6px] space-y-[6px]'>
            <label className="block font-[Montserrat] text-[#023973] text-base font-semibold text-left">{label}</label>
            <input className="rounded-[6px] w-[400px] h-[40px] p-[20px] border-3 outline-none
                 focus:border-[#F89807] border-[#FBCC83] bg-white placeholder:text-[#FBCC83] font-[Montserrat]"
                {...props}>
            </input>
        </div>
    );
};

export default CustomInput;