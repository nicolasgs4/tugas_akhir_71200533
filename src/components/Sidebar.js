import './../App';
import { useNavigate } from "react-router-dom"

const Sidebar = ({content}) => {
    const navigate = useNavigate();

    return (
        <div className="w-1/4 h-screen pt-[60px] pb-5 bg-neutral-50 border border-blue-400 justify-start items-start gap-2.5 inline-flex">
            <div className="w-[312px] h-full flex-col justify-start items-center gap-2.5 inline-flex">
                <img className="w-[79px] h-[50px]" src="/images/fti.png" />
                <div className="w-[250px] h-20 justify-start items-end gap-3.5 inline-flex">
                    <div className="text-center text-zinc-900 text-base font-normal font-['Inter'] leading-normal">Kuesioner</div>
                    <div className="w-[50px] h-[30px] bg-neutral-50" />
                </div>
                <div className="w-[250px] h-px bg-blue-400" />

                <div className="flex-col justify-start items-start gap-5 flex">

                    <button className={`w-[280px] h-14 pl-10 justify-start items-center gap-3 inline-flex hover:bg-sky-400 rounded-[15px] ${content == 0 ? 'bg-sky-400' : null}`}
                        onClick={() => navigate("/dashboard")}>
                        <div className="w-8 h-8 relative">
                            <div className="w-[26.67px] h-[25.33px] absolute">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="carbon:dashboard">
                                        <path id="Vector" d="M24 21H26V26H24V21ZM20 16H22V26H20V16ZM11 26C9.67441 25.9984 8.40356 25.4711 7.46622 24.5338C6.52888 23.5964 6.00159 22.3256 6 21H8C8 21.5933 8.17595 22.1734 8.50559 22.6667C8.83524 23.1601 9.30377 23.5446 9.85195 23.7716C10.4001 23.9987 11.0033 24.0581 11.5853 23.9424C12.1672 23.8266 12.7018 23.5409 13.1213 23.1213C13.5409 22.7018 13.8266 22.1672 13.9424 21.5853C14.0581 21.0033 13.9987 20.4001 13.7716 19.8519C13.5446 19.3038 13.1601 18.8352 12.6667 18.5056C12.1734 18.1759 11.5933 18 11 18V16C12.3261 16 13.5979 16.5268 14.5355 17.4645C15.4732 18.4021 16 19.6739 16 21C16 22.3261 15.4732 23.5979 14.5355 24.5355C13.5979 25.4732 12.3261 26 11 26Z" fill="black" />
                                        <path id="Vector_2" d="M28 2H4C3.46973 2.00053 2.96133 2.21141 2.58637 2.58637C2.21141 2.96133 2.00053 3.46973 2 4V28C2.00053 28.5303 2.21141 29.0387 2.58637 29.4136C2.96133 29.7886 3.46973 29.9995 4 30H28C28.5302 29.9992 29.0384 29.7882 29.4133 29.4133C29.7882 29.0384 29.9992 28.5302 30 28V4C29.9995 3.46973 29.7886 2.96133 29.4136 2.58637C29.0387 2.21141 28.5303 2.00053 28 2ZM28 11H14V4H28V11ZM12 4V11H4V4H12ZM4 28V13H28L28.002 28H4Z" fill="#1A1A1A" />
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div className="text-zinc-900 text-base font-normal font-['Inter'] leading-normal">Dashboard</div>
                    </button>

                    <button className={`w-[280px] h-14 pl-10 justify-start items-center gap-3 inline-flex hover:bg-sky-400 rounded-[15px] ${content == 1 ? 'bg-sky-400' : null} rounded-[15px]`}
                        onClick={() => navigate("/create")}>
                        <div className="w-8 h-8 relative">
                            <div className="w-[26.67px] h-[25.33px] absolute">
                                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.3265 4.42859H5.40816C4.23905 4.42859 3.11781 4.8917 2.29112 5.71603C1.46443 6.54037 1 7.65841 1 8.82419V28.6044C1 29.7702 1.46443 30.8882 2.29112 31.7126C3.11781 32.5369 4.23905 33 5.40816 33H27.449C28.6181 33 29.7393 32.5369 30.566 31.7126C31.3927 30.8882 31.8571 29.7702 31.8571 28.6044V18.7143" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M27.7083 6.64877L29.8005 8.94268M32.0992 1.98527C32.6845 2.6176 33.0085 3.46487 33.0016 4.3445C32.9946 5.22413 32.6571 6.06567 32.0619 6.68777L16.7309 22.7061L10.1445 25L12.34 18.1183L27.6797 1.95545C28.219 1.38766 28.9406 1.04898 29.7051 1.00491C30.4695 0.960845 31.2224 1.21452 31.8182 1.71688L32.0992 1.98527Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-zinc-900 text-base font-normal font-['Inter'] leading-normal">Buat</div>
                    </button>

                    <button className={`w-[280px] h-14 pl-10 justify-start items-center gap-3 inline-flex hover:bg-sky-400 rounded-[15px] ${content == 2 ? 'bg-sky-400' : null} rounded-[15px]`} 
                        onClick={() => navigate("/view")}>
                        <div className="w-8 h-8 relative">
                            <div className="w-[26.67px] h-[25.33px] absolute">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 27.3334C22.6273 27.3334 28 21.7854 28 18C28 14.2147 22.6273 8.66669 16 8.66669C9.37267 8.66669 4 14.2187 4 18C4 21.7814 9.37267 27.3334 16 27.3334Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
                                    <path d="M16 22C17.0609 22 18.0783 21.5786 18.8284 20.8284C19.5786 20.0783 20 19.0609 20 18C20 16.9391 19.5786 15.9217 18.8284 15.1716C18.0783 14.4214 17.0609 14 16 14C14.9391 14 13.9217 14.4214 13.1716 15.1716C12.4214 15.9217 12 16.9391 12 18C12 19.0609 12.4214 20.0783 13.1716 20.8284C13.9217 21.5786 14.9391 22 16 22Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
                                    <path d="M8.84375 7.51069L10.5731 9.92402M23.7511 7.80669L22.0211 10.22M16.0071 4.66669V8.66669" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-zinc-900 text-base font-normal font-['Inter'] leading-normal ">Lihat</div>
                    </button>

                    <button 
                        className={`w-[280px] h-14 pl-10 justify-start items-center gap-3 inline-flex hover:bg-sky-400 rounded-[15px] ${content == 3 ? 'bg-sky-400' : null} rounded-[15px]`}
                        onClick={() => navigate("/analysis")}>
                        <div className="w-8 h-8 relative">
                            <div className="w-[26.67px] h-[25.33px] absolute">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M29.3346 3.33331H2.66797V11.3333H29.3346V3.33331Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
                                    <path d="M2.66797 27.3533L10.7853 19.1533L15.1713 23.3533L20.5333 18L23.52 20.912" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M29.3346 10.7813V28.1146M2.66797 10.7813V20.1146M8.67863 28.6666H29.3346M11.3346 7.3333H25.3346M6.66797 7.3313H7.33464" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-zinc-900 text-base font-normal font-['Inter'] leading-normal">Analisis</div>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Sidebar;