import './../App.css';

import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';

export function Create({ email, username }) {
    const [catalog, setCatalog] = useState([]);
    const navigate = useNavigate();

    const formId = useRef(null);
    const hasRendered = useRef(false);

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return;}
        handleGetAllForms();
    }, [])

    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    const handleGetAllForms = async () => {
        if (catalog != null) setCatalog([]);
        try {
            const response = await fetch("/create", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();

            if (res) {
                setCatalog(res);
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async () => {
        try {
            const response = await fetch("/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email : email, formId : formId.current})
            });
            const res = await response.json();

            if (res) {
                handleGetAllForms();
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };
    
    const handleDelete = async () => {
        try {
            const response = await fetch("/create/" + formId.current, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();

            if (res) {
                closeModal();
                handleGetAllForms();
                formId.current = null;
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    }

    const handleDuplicate = async () => {
        try {
            const response = await fetch("/create/" + formId.current, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();

            if (res) {
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className=''>
            <div className="justify-start items-start gap-14 px-4 py-6 inline-flex flex-wrap">
                <button className="w-[216px] h-[270px] rounded-lg shadow flex-col just  ify-start items-start inline-flex" onClick={handleAdd}>                    
                    <div className="w-[216px] h-[166px] rounded-t-lg bg-zinc-300 relative"> 
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className='absolute right-0 left-0 top-0 bottom-0 m-auto'>
                            <g clipPath="url(#clip0_453_3200)">
                                <path d="M30 60C13.4306 60 0 46.5694 0 30C0 13.4306 13.4306 0 30 0C46.5694 0 60 13.4306 60 30C60 37.9565 56.8393 45.5871 51.2132 51.2132C45.5871 56.8393 37.9565 60 30 60ZM30 3.75C15.5025 3.75 3.75 15.5025 3.75 30C3.75 44.4975 15.5025 56.25 30 56.25C44.4975 56.25 56.25 44.4975 56.25 30C56.25 23.0381 53.4844 16.3613 48.5616 11.4384C43.6387 6.51562 36.9619 3.75 30 3.75Z" fill="black" />
                                <path d="M43.125 28.125H31.875V16.875H28.125V28.125H16.875V31.875H28.125V43.125H31.875V31.875H43.125V28.125Z" fill="black" />
                            </g>
                            <defs>
                                <clipPath id="clip0_453_3200">
                                    <rect width="60" height="60" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div className="w-[216px] grow shrink rounded-b-lg basis-0 px-3 py-2 bg-white flex-col justify-center items-center gap-2 flex">
                        <div className="self-stretch text-center text-zinc-900 text-lg font-semibold font-['Inter'] leading-normal">Buat Kuesioner Baru</div>
                    </div>
                </button>
                {catalog.map((item, index) => (
                    <div key={'catalog' + index} className="w-[216px] rounded-lg shadow flex-col justify-start items-start inline-flex relative">
                        <Popup
                            trigger={
                                <button className='absolute mt-2.5 mr-1 right-0 top-0 cursor-pointer'>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.4 14C11.7635 14 11.153 13.7471 10.7029 13.2971C10.2529 12.847 10 12.2365 10 11.6C10 10.9635 10.2529 10.353 10.7029 9.90294C11.153 9.45286 11.7635 9.2 12.4 9.2C13.0365 9.2 13.647 9.45286 14.0971 9.90294C14.5471 10.353 14.8 10.9635 14.8 11.6C14.8 12.2365 14.5471 12.847 14.0971 13.2971C13.647 13.7471 13.0365 14 12.4 14ZM12.4 6.8C11.7635 6.8 11.153 6.54714 10.7029 6.09706C10.2529 5.64697 10 5.03652 10 4.4C10 3.76348 10.2529 3.15303 10.7029 2.70294C11.153 2.25286 11.7635 2 12.4 2C13.0365 2 13.647 2.25286 14.0971 2.70294C14.5471 3.15303 14.8 3.76348 14.8 4.4C14.8 5.03652 14.5471 5.64697 14.0971 6.09706C13.647 6.54714 13.0365 6.8 12.4 6.8ZM12.4 21.2C11.7635 21.2 11.153 20.9471 10.7029 20.4971C10.2529 20.047 10 19.4365 10 18.8C10 18.1635 10.2529 17.553 10.7029 17.1029C11.153 16.6529 11.7635 16.4 12.4 16.4C13.0365 16.4 13.647 16.6529 14.0971 17.1029C14.5471 17.553 14.8 18.1635 14.8 18.8C14.8 19.4365 14.5471 20.047 14.0971 20.4971C13.647 20.9471 13.0365 21.2 12.4 21.2Z" fill="black" />
                                    </svg>
                                </button>
                            }
                            position={'right top'}
                            nested={true}
                        >
                            
                            <div className="p-1 bg-white rounded-xl flex-col justify-start items-start gap-1 absolute border-b-2">
                                <button className="justify-start items-center gap-0.5 inline-flex" onClick={() => handleDuplicate()}>
                                    <div className="w-6 h-6 relative">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.24 2H11.346C9.582 2 8.184 2 7.091 2.148C5.965 2.3 5.054 2.62 4.336 3.341C3.617 4.062 3.298 4.977 3.147 6.107C3 7.205 3 8.608 3 10.379V16.217C3 17.725 3.92 19.017 5.227 19.559C5.16 18.649 5.16 17.374 5.16 16.312V11.302C5.16 10.021 5.16 8.916 5.278 8.032C5.405 7.084 5.691 6.176 6.425 5.439C7.159 4.702 8.064 4.415 9.008 4.287C9.888 4.169 10.988 4.169 12.265 4.169H15.335C16.611 4.169 17.709 4.169 18.59 4.287C18.326 3.61337 17.8652 3.03489 17.2676 2.62696C16.6701 2.21902 15.9635 2.00054 15.24 2Z" fill="black" />
                                            <path d="M6.60156 11.397C6.60156 8.671 6.60156 7.308 7.44556 6.461C8.28856 5.614 9.64556 5.614 12.3616 5.614H15.2416C17.9566 5.614 19.3146 5.614 20.1586 6.461C21.0016 7.308 21.0016 8.671 21.0016 11.397V16.217C21.0016 18.943 21.0016 20.306 20.1586 21.153C19.3146 22 17.9566 22 15.2416 22H12.3616C9.64656 22 8.28856 22 7.44556 21.153C6.60156 20.306 6.60156 18.943 6.60156 16.217V11.397Z" fill="black" />
                                        </svg>
                                    </div>
                                    <div className="text-black text-2xl font-normal font-['Segoe UI']">Duplicate</div>
                                </button>
                                <button className="w-[126px] justify-start items-center gap-0.5 inline-flex" onClick={() => setOpen(prev => !prev)}>
                                    <div className="w-6 h-6 relative">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#FF4853" />
                                        </svg>
                                    </div>
                                    <div className="text-[#FF4853] text-2xl font-normal font-['Segoe UI']">Delete</div>
                                </button>
                                <Popup
                                    modal
                                    position={'center center'}
                                    lockScroll={true}
                                    open={open}
                                    closeOnDocumentClick 
                                    onClose={closeModal}
                                >
                                    <div className="w-[600px] h-[276px]  relative">
                                        <div className="w-[600px] h-[276px] left-0 top-0 border-4 absolute bg-white rounded-[15px]" />
                                        <div className="left-[19px] top-[77px] absolute text-stone-900 text-2xl font-normal font-['Segoe UI']">Apakah Anda yakin ingin menghapus pertanyaan ini?</div>
                                        <div className="w-[120px] h-[60px] left-[375px] top-[174px] absolute">
                                            <div className="w-[120px] h-[60px] left-0 top-0 absolute bg-neutral-800 rounded-[10px]" />
                                            <button onClick={() => { formId.current = item.form_id; handleDelete();}}>
                                                <div className="left-[11px] top-[16px] absolute text-center text-white text-2xl font-normal font-['Cabin']">Ya, Hapus</div>
                                            </button>
                                        </div>
                                        <div className="w-[120px] h-[60px] left-[105px] top-[174px] absolute">
                                            <div className="w-[120px] h-[60px] left-0 top-0 absolute bg-white rounded-[10px] border border-black" />
                                            <button onClick={closeModal}>
                                                <div className="left-[17px] top-[16px] absolute text-center text-neutral-800 text-2xl font-normal font-['Cabin']">Batalkan</div>
                                            </button>
                                        </div>
                                    </div>
                                </Popup>
                            </div>
                        </Popup>
                        <div onClick={() => { formId.current = item.form_id; navigate("/form/" + item.form_id + "/edit") }}>  
                            <div className="w-[216px] h-[166px] rounded-t-lg bg-zinc-300" />
                            <div className="h-[104px] px-3 py-2 rounded-b-lg bg-white flex-col justify-start items-start gap-2 flex">
                                <div className="self-stretch text-center text-zinc-900 text-lg font-semibold font-['Inter'] leading-normal">{item.form_title}</div>
                                <div className="w-full justify-start items-center gap-2 inline-flex">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.146 12.1127 0.438 11.638C0.73 11.1633 1.11733 10.8007 1.6 10.55C2.63333 10.0333 3.68333 9.646 4.75 9.388C5.81667 9.13 6.9 9.00067 8 9C9.1 9 10.1833 9.12933 11.25 9.388C12.3167 9.64667 13.3667 10.034 14.4 10.55C14.8833 10.8 15.271 11.1627 15.563 11.638C15.855 12.1133 16.0007 12.634 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9543 12.85 13.863 12.7C13.7717 12.55 13.6507 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5627 10.775 11.338C9.85833 11.1133 8.93333 11.0007 8 11C7.06667 11 6.14167 11.1127 5.225 11.338C4.30833 11.5633 3.4 11.9007 2.5 12.35C2.35 12.4333 2.229 12.55 2.137 12.7C2.045 12.85 1.99933 13.0167 2 13.2V14ZM8 6C8.55 6 9.021 5.80433 9.413 5.413C9.805 5.02167 10.0007 4.55067 10 4C10 3.45 9.80433 2.97933 9.413 2.588C9.02167 2.19667 8.55067 2.00067 8 2C7.45 2 6.97933 2.196 6.588 2.588C6.19667 2.98 6.00067 3.45067 6 4C6 4.55 6.196 5.021 6.588 5.413C6.98 5.805 7.45067 6.00067 8 6Z" fill="black" />
                                    </svg>
                                    <div className="text-center text-black text-base font-normal font-['Inter'] leading-normal">{item.user_name}</div>
                                </div>
                                <div className="w-full justify-start items-center gap-2 inline-flex">
                                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 9H6V11H4V9ZM16 2H15V0H13V2H5V0H3V2H2C0.89 2 0.00999999 2.9 0.00999999 4L0 18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM16 18H2V8H16V18ZM16 6H2V4H16V6ZM12 9H14V11H12V9ZM8 9H10V11H8V9Z" fill="black" />
                                    </svg>
                                    <div className="text-center text-black text-base font-normal font-['Inter'] leading-normal">{format(item.date_of_creation, 'dd MMMM yyyy', { locale: id })}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 
export default Create;