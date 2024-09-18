import './../App.css';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom';

export function Analysis() {
    const [catalog, setCatalog] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        handleGetAllForms();
    }, [])

    const handleGetAllForms = async () => {
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

    return (
        <div>
            <div className="justify-start items-start gap-14 px-4 py-6 inline-flex flex-wrap">
                {catalog.map((item, index) => (
                    <button key={'catalog' + index} className="w-[216px] rounded-lg shadow flex-col justify-start items-start inline-flex"
                        onClick={e => navigate("/form/" + item.form_id + "/analysis")}>
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
                    </button>
                ))}
            </div>
        </div>
    )
}
export default Analysis;