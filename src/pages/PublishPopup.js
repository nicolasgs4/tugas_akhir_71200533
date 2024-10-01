import './../App.css';

import QRCode from 'react-qr-code';
import { useParams } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useRef, useState } from 'react';
import  { registerLocale } from 'react-datepicker';
import Datepicker from "react-tailwindcss-datepicker";
import { id } from 'date-fns/locale/id';
import { formatISO, parseISO } from 'date-fns';

registerLocale('id', id)

export function PublishPopup({ closeModal }) {
    const { id } = useParams();
    const [activeIndex, setActiveIndex] = useState(0);
    const [minRespondent, setMinRespondent] = useState(0);
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });

    const handleGetPublish = async () => {
        try {
            const response = await fetch("/publishes/" + id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();
            if (res) {
                setValue(prev => ({
                    ...prev,
                    startDate: new Date(res.date_now),
                    endDate: new Date(res.date_now)
                }));             
                if (res.publish_end != null) {
                    setValue(prev => ({
                        ...prev,
                        endDate: new Date(res.publish_end)
                    }));        
                    if (new Date(res.publish_end) - new Date() <= 0) {
                        setActiveIndex(0);
                    }
                    else {
                        setActiveIndex(1);
                    }
                    return;
                } 
                setActiveIndex(0);
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePostPublish = async () => {
        try {
            const response = await fetch("/publish/" + id, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, 
                body: JSON.stringify({
                    start: value.startDate, end: value.endDate, min_respondent: minRespondent
                })
            });
            const res = await response.json();
            if (res) {

                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        } finally {
            setActiveIndex(1);
        }
    };

    const hasRendered = useRef(false);
    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
        handleGetPublish();
    }, [])

    useEffect(() => {
        console.log(value)
    }, [value])
    

    return (
        <div className={"w-[600px] h-[500px] fixed inset-0 m-auto flex flex-wrap items-center justify-center "}>
            <div className="w-[600px] h-[500px] left-0 top-0 rounded-xl bg-stone-900 p-6 flex flex-col bg-[#005595] gap-5 relative">
                <button className='absolute right-4 top-4' onClick={closeModal}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 2C8.2 2 2 8.2 2 16C2 23.8 8.2 30 16 30C23.8 30 30 23.8 30 16C30 8.2 23.8 2 16 2ZM16 28C9.4 28 4 22.6 4 16C4 9.4 9.4 4 16 4C22.6 4 28 9.4 28 16C28 22.6 22.6 28 16 28Z" fill="white" />
                        <path d="M21.4 23L16 17.6L10.6 23L9 21.4L14.4 16L9 10.6L10.6 9L16 14.4L21.4 9L23 10.6L17.6 16L23 21.4L21.4 23Z" fill="white" />
                    </svg>
                </button>
                
                {
                    activeIndex === 0 &&
                    <>
                        <Datepicker
                            primaryColor={"orange"}
                            i18n={"id"}
                            startWeekOn="mon"
                            startFrom={value.startDate}
                            minDate={value.startDate}
                            separator='sampai'
                            value={value}
                            onChange={newValue => setValue(prev => ({
                                ...prev,
                                endDate: newValue.endDate
                            }))}
                            placeholderText="Select date"
                            dateFormat="YYYY-MM-dd HH:mm:ss" 
                            classNames=''
                            
                        />

                        <form className="max-w-[8rem] mx-auto">
                            <label htmlFor="time" className="block mb-2 text-sm font-medium text-white *:dark:text-white">Select time:</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input type="time" id="time" className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" value={
                                    String(new Date(value.endDate).getHours()).padStart(2, '0') + ":" +
                                    String(new Date(value.endDate).getMinutes()).padStart(2, '0')
                                } required 
                                    onChange={e => {
                                        const [hours, minutes] = e.target.value.split(":")
                                        const date = new Date(value.endDate).setHours(hours, minutes, 0);
                                        setValue(prev => ({
                                            ...prev,
                                            endDate: new Date(date)
                                        }))
                                    }}
                                />
                            </div>
                        </form>

                        <input type='number' onChange={e => setMinRespondent(e.target.value)}></input>
                        <button className='w-[100px] rounded-lg items-center justify-center text-white border-2 border-solid border-white' onClick={() => handlePostPublish()}>Publish</button>
                    </>
                }   
                {
                    activeIndex === 1 && 
                    <>
                        <div className="text-white text-2xl font-normal font-['Segoe UI']">Kuesioner anda berhasil dipublikasikan!</div>
                        <div className="text-white text-2xl font-normal font-['Segoe UI']">
                            Anda dapat menyebarkan kuesioner ini dengan link sebagai berikut:
                        </div>
                        <div className="h-10 bg-white rounded-xl relative px-4">
                            <div className="absolute top-1 left-2 text-stone-900 text-2xl font-normal font-['Segoe UI']">{`http://192.168.1.4:3000/form/${id}`}</div>
                            <button className='absolute top-2 right-2' onClick={() => navigator.clipboard.writeText(`http://192.168.1.4:3000/form/${id}`)}>
                                <svg className='' width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.75 0H8.694C6.856 0 5.4 0 4.261 0.153C3.089 0.311 2.14 0.643 1.391 1.391C0.643 2.14 0.311 3.089 0.153 4.261C1.19209e-07 5.401 0 6.856 0 8.694V14.75C2.41393e-05 15.6434 0.318936 16.5075 0.899337 17.1867C1.47974 17.8659 2.28351 18.3157 3.166 18.455C3.303 19.219 3.568 19.871 4.098 20.402C4.7 21.004 5.458 21.262 6.358 21.384C7.225 21.5 8.328 21.5 9.695 21.5H12.805C14.172 21.5 15.275 21.5 16.142 21.384C17.042 21.262 17.8 21.004 18.402 20.402C19.004 19.8 19.262 19.042 19.384 18.142C19.5 17.275 19.5 16.172 19.5 14.805V9.695C19.5 8.328 19.5 7.225 19.384 6.358C19.262 5.458 19.004 4.7 18.402 4.098C17.871 3.568 17.219 3.303 16.455 3.166C16.3157 2.28351 15.8659 1.47974 15.1867 0.899337C14.5075 0.318936 13.6434 2.41393e-05 12.75 0ZM14.88 3.021C14.7279 2.577 14.4408 2.19166 14.0589 1.91893C13.677 1.64619 13.2193 1.49971 12.75 1.5H8.75C6.843 1.5 5.489 1.502 4.46 1.64C3.455 1.775 2.875 2.029 2.452 2.452C2.029 2.875 1.775 3.455 1.64 4.461C1.502 5.489 1.5 6.843 1.5 8.75V14.75C1.49971 15.2193 1.64619 15.677 1.91892 16.0589C2.19166 16.4408 2.577 16.7279 3.021 16.88C3 16.27 3 15.58 3 14.805V9.695C3 8.328 3 7.225 3.117 6.358C3.237 5.458 3.497 4.7 4.098 4.098C4.7 3.496 5.458 3.238 6.358 3.117C7.225 3 8.328 3 9.695 3H12.805C13.58 3 14.27 3 14.88 3.021ZM5.158 5.16C5.435 4.883 5.823 4.703 6.558 4.604C7.312 4.503 8.314 4.501 9.749 4.501H12.749C14.184 4.501 15.185 4.503 15.941 4.604C16.675 4.703 17.063 4.884 17.34 5.16C17.617 5.437 17.797 5.825 17.896 6.56C17.997 7.314 17.999 8.316 17.999 9.751V14.751C17.999 16.186 17.997 17.187 17.896 17.943C17.797 18.677 17.616 19.065 17.34 19.342C17.063 19.619 16.675 19.799 15.94 19.898C15.185 19.999 14.184 20.001 12.749 20.001H9.749C8.314 20.001 7.312 19.999 6.557 19.898C5.823 19.799 5.435 19.618 5.158 19.342C4.881 19.065 4.701 18.677 4.602 17.942C4.501 17.187 4.499 16.186 4.499 14.751V9.751C4.499 8.316 4.501 7.314 4.602 6.559C4.701 5.825 4.882 5.437 5.158 5.16Z" fill="black" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-white text-2xl font-normal font-['Segoe UI']">
                            Atau dengan Kode QR berikut:
                        </div>
                        <div className='w-full flex flex-wrap justify-center'>
                            <div className='bg-white p-2'>
                                <QRCode className="" size={192} value={`http://192.168.0.119:3000/form/${id}`} />
                            </div>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}