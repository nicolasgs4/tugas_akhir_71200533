import './../App.css';

import { useEffect, useRef, useState } from 'react';
import ChartCard from '../components/ChartCard';
import ProgressChartCard from '../components/ProgressChartCard';
import TrendChartCard from '../components/TrendChartCard';

export function Dashboard() {
    const [valueData, setValueData] = useState(null);
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
                //set value data buat obj
                setValueData(res);
            } else {
                throw new Error(res.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

//jalan 1x ketika load halaman
    useEffect(() => {
        handleLoadDashBoard();
    }, []);

    useEffect(() => {
        if (valueData) {
            totalQuestionnaire.current = Object.keys(valueData).length;
            let count = 0;
            Object.values(valueData).forEach((element) => {
                count += element.value_count;
            });
            totalRespondent.current = count;
        }
    }, [valueData]);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!valueData) {
        return <div>No data available</div>;
    }

    return (
        <div className='h-full'>

        {/* Overview Chart */}
            <div className='h-full p-4 gap-4 grid grid-cols-8 grid-rows-6 '>
                <div className='row-span-4 col-span-4'>
                {/* Value data buat komponen  */}
                <ChartCard valueData={valueData} />
            </div>
            
{/* Kuesioner */}
            

            {/* Trend Chart */}
            <div className='row-span-2 col-span-4'>
                <ProgressChartCard />
            </div>
            <div className='row-span-4 col-span-4'>
                <TrendChartCard />
            </div>
            
            <div className='row-span-2 col-span-4 p-2.5 bg-neutral-50 rounded-[15px] border border-neutral-500 flex flex-wrap items-center justify-center relative'>
                <div className="flex-col items-center gap-5 flex flex-wrap">
                    <div className="w-[184px] h-[50px] text-center text-neutral-900 text-[26px] font-normal font-['Roboto'] leading-none">Total <br /> Kuesioner</div>
                    <div className="self-stretch h-[0px] border border-zinc-900"></div>
                    <div className="text-zinc-900 text-5xl font-normal font-['Roboto'] leading-none">{totalQuestionnaire.current}</div>
                </div>
                <div className="flex-col items-center gap-5 flex flex-wrap">
                    <div className="w-[184px] h-[50px] text-center text-neutral-900 text-[26px] font-normal font-['Roboto'] leading-none">Rerata  <br /> Responden</div>
                    <div className="self-stretch h-[0px] border border-zinc-900"></div>
                    <div className="text-zinc-900 text-5xl font-normal font-['Roboto'] leading-none">{totalQuestionnaire.current ? Math.floor(totalRespondent.current / totalQuestionnaire.current) : 0}</div>
                </div>
            </div>
            
            {/* Progress Chart */}
            

            
            </div>
            
        </div>
        
    );
}
export default Dashboard;