import { useEffect, useRef, useState } from "react";
import { BarElement, CategoryScale, Chart, Filler, LinearScale, LineElement, PointElement, Ticks, TimeScale, Title, Tooltip } from 'chart.js';
import { Bar, getElementAtEvent } from 'react-chartjs-2';

const TrendChartCard = () => {
    const hasRendered = useRef(false);
    const [loadTrendFinish, setLoadTrendFinish] = useState(false);
    const [trendData, setTrendData] = useState();
    const HandleTrendLoad = async () => {
        try {
            const response = await fetch("/trend", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();
            if (res) {
                const data = {
                    labels: res.month,
                    datasets: [
                        {
                            label: 'Average',
                            data: res.average,
                            borderColor: [
                                '#1565C0'
                            ],
                            type: 'line',
                            lineCap : 'square',
                            borderJoinStyle: 'bevel',
                            fill:false,
                            borderWidth: 2,
                            radius: 0
                        },
                        {
                        label: 'Count',
                        data: res.count,
                        backgroundColor: [
                            '#64B5F6'
                        ],
                        borderWidth: 1
                        },
                    ],
                };
                setTrendData(data);
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadTrendFinish(true);
        }
    }

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
        HandleTrendLoad();
    }, [])

    Chart.register(BarElement, Tooltip, CategoryScale, LinearScale, Title, PointElement, LineElement, TimeScale, Filler);

    return (
        <div className='w-full h-full p-2.5 bg-neutral-50 rounded-[15px] border border-neutral-500 flex flex-wrap items-center relative'>
            <div>Rata-rata Jumlah Responden per Bulan</div>
            {
                loadTrendFinish && (
                    <Bar data={trendData} />
                )
            }
        </div>
    )
}
export default TrendChartCard;