import './../App.css';

import { useEffect, useRef, useState } from 'react';
import ChartCard from '../components/ChartCard';

export function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const totalQuestionnaire = useRef(0);
    const totalRespondent = useRef(0);

    const handleLoadDashBoard = async () => {
        try {
            const response = await fetch("/dashboard", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();
            if (res) {
                setDashboardData(res);
            } else {
                throw new Error(res.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleLoadDashBoard();
    }, []);

    useEffect(() => {
        if (dashboardData) {
            totalQuestionnaire.current = Object.keys(dashboardData).length;
            let count = 0;
            Object.values(dashboardData).forEach((element) => {
                count += element.value_count;
            });
            totalRespondent.current = count;
        }
    }, [dashboardData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!dashboardData) {
        return <div>No data available</div>;
    }

    return (
        <div className='flex p-4 gap-4'>
            <ChartCard dashboardData={dashboardData}/>
            <div className="w-[200px] h-[164px] px-5 pt-2.5 pb-5 bg-neutral-50 rounded-[15px] border border-neutral-500 flex-col justify-start items-center gap-10 inline-flex">
                <div className="self-stretch h-[52px] flex-col justify-start items-center gap-5 flex">
                    <div className="w-[184px] h-[50px] text-center text-neutral-900 text-[26px] font-normal font-['Roboto'] leading-none">Total <br /> Kuesioner</div>
                    <div className="self-stretch h-[0px] border border-zinc-900"></div>
                    <div className="text-zinc-900 text-5xl font-normal font-['Roboto'] leading-none">{totalQuestionnaire.current}</div>
                </div>
            </div>
            <div className="w-[200px] h-[164px] px-5 pt-2.5 pb-5 bg-neutral-50 rounded-[15px] border border-neutral-500 flex-col justify-start items-center gap-10 inline-flex">
                <div className="self-stretch h-[52px] flex-col justify-start items-center gap-5 flex">
                    <div className="w-[184px] h-[50px] text-center text-neutral-900 text-[26px] font-normal font-['Roboto'] leading-none">Rerata  <br /> Responden</div>
                    <div className="self-stretch h-[0px] border border-zinc-900"></div>
                    <div className="text-zinc-900 text-5xl font-normal font-['Roboto'] leading-none">{totalQuestionnaire.current ? Math.floor(totalRespondent.current / totalQuestionnaire.current) : 0}</div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;