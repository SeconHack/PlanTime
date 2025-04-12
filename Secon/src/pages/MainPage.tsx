import logo from '../images/logo.png'

const MainPage = () => {

    const days = [1, 2, 3, 4, 5, 6, 7,
                  8, 9, 10, 11, 12, 13, 14,
                  15, 16, 17, 18, 19, 20, 21,
                  22, 23, 24, 25, 26, 27, 28]
    function InfiniteDivs() {
        return (
          <div className="box-border flex flex-[0 0 auto] flex-row flex-wrap gap-[24px] items-end justify-start h-[488px] mt-[64px]">
            {days.map(element =>
                <div className="box-border flex flex-[0 0 auto] w-[104px] h-[104px] overflow-hidden bg-[#023973] text-white items-center justify-center font-[Montserrat] text-4xl">{element}</div>
            )}
          </div>
        );
    }

    return(
        <>
            <header className='flex justify-between items-center p-[1rem] bg-white'>
                <img src={logo} alt="Logo"></img>
                <div className="rounded-[6px] w-[232px] h-[40px] border-[2px] pt-[7px] pl-[20px] bg-white font-[Montserrat] text-[#023973] text- font-semibold">
                    Профиль
                </div>
            </header>
            <section className='h-screen bg-[#FDE0B5] flex items-center justify-center'>
                <div className="box-border flex flex-col items-center justify-start min-w-[1128px] bg-white border-[15px]">
                    <div className="box-border flex flex-col items-stretch justify-center w-[872px] pt-[130px] pb-[128px]">
                        <p className="flex-[0 0 auto] self-center p-0 m-0 font-[Montserrat] font-semibold text-2xl text-black">ФЕВРАЛЬ-МАРТ</p>
                        <InfiniteDivs/>
                    </div>
                </div>
            </section>
        </>
    )
}

export default MainPage