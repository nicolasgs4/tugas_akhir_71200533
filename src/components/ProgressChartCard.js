import './../App.css';
import { getQuestionTypeValue } from '../data/QuestionData';
import { useEffect, useRef, useState } from 'react';
import ResizableTextArea from './ResizableTextArea';
import randomColor from 'randomcolor';
import { BarElement, CategoryScale, Chart, Filler, LinearScale, LineElement, PointElement, Ticks, TimeScale, Title, Tooltip } from 'chart.js';
import { Bar, getElementAtEvent} from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

const ProgressChartCard = () => {
    const hasRendered = useRef(false);
    const [loadProgressFinish, setLoadProgressFinish] = useState(false);

    const barColor = [
        "#FF4853",
        "#FDEA5F",
        "#03F1A3"
    ]
    
    const barOptions = {
        respnsive: true,
        indexAxis: 'y',
        scales: { 
            x: { display: false, min: 0, max: "100%", stacked: true }, 
            y: { display: false, min: 0, max: 0, stacked: true}
        },
        maintainAspectRatio : false,
        events: []
    };
    
    const [progressBarData, setProgressBarData] = useState([]);

    var curQuest = 0;
    var totQuest = 0;

    const HandleProgressLoad = async () => {
        //setProgressBarData([]);
        try {
            const response = await fetch("/progress", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();
            if (res) {
                if (res.length <= 0) return;
                res.forEach(element => {
                    // const preLimit = Math.max(element.value_count, 0);
                    // const minLimit = Math.max(element.min_respondent - element.value_count, 0);
                    // const postLimit = Math.max(element.value_count - element.min_respondent, 0);
                    // const offset = parseInt(Math.max(element.min_respondent * 0.25 - postLimit, 0));

                    const preLimit = Math.max(100, 0);
                    const minLimit = Math.max(500 - 100, 0);
                    const postLimit = Math.max(100 - 500, 0);
                    const offset = parseInt(Math.max(500 * 0.25 - postLimit, 0));
                    console.log(res)

                    const data = {
                        info: {
                            publish_end: element.publish_end,
                            min_respondent: element.min_respondent,
                            form_title: element.form_title,
                            value_count: element.value_count
                        },
                        labels: "Respondent Progress",
                        datasets: [
                            {
                                label: 'Pre-Limit',
                                data: [preLimit],
                                borderWidth: 2,
                                borderColor: "#000000",
                                backgroundColor: '#3BC0ED',
                                borderSkipped: "end",
                            },
                            {
                                label: 'Min Limit',
                                data: [minLimit],
                                borderWidth: 2,
                                borderColor: "#000000",
                                backgroundColor: '#FFFFFF',
                                borderSkipped: "start",
                            },
                            {
                                label: 'Post-Limit',
                                data: [postLimit],
                                borderWidth: 2,
                                borderColor: "#000000",
                                backgroundColor: '#FF4853',
                                borderSkipped: "start",
                            },
                            {
                                label: 'Offset',
                                data: [offset],
                                borderWidth: 2,
                                borderColor: "#000000",
                                backgroundColor: '#FFFFFF',
                                borderSkipped: "start",
                            }
                        ]
                    };

                    setProgressBarData(prev => [...prev, data]);
                });
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadProgressFinish(true);
        }
    }

    const progressBar = (data) => {
        return (
            <div className='inline-flex flex-col-2 w-full px-6 items-center'>
                <div className='w-1/4 h-2.5 text-black/40 text-[14px] font-normal'>{data.info.form_title}</div>
                <div className='gap-3 w-full'>
                    <div className=''>Jumlah Responden</div>
                    <div className='flex  h-6 relative'>
                        <div className='absolute left-0'>{data.info.value_count + " dari " + data.info.min_respondent}</div>
                        <div className='absolute right-0'>Berakhir: {format(parseISO(data.info.publish_end), "dd MMMM yyyy, HH:mm", { locale: id })}</div>
                    </div>
                    <div className='flex'>
                        <Bar className='h-[24px] flex' data={data} options={barOptions} />
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
        HandleProgressLoad()
    }, [])

    Chart.register(BarElement, Tooltip, CategoryScale, LinearScale, Title, PointElement, LineElement, TimeScale, Filler);

    return (
        <div className='w-full h-full p-2.5 bg-neutral-50 rounded-[15px] border border-neutral-500 inline-flex flex-col items-center gap-2.5 relative'>
            <div>Progres Kuesioner</div>
            <div>{curQuest + " dari " + totQuest + " mencapati target pengisian"}</div>
            <div className='flex flex-col w-full overflow-y-scroll'>
                {
                    loadProgressFinish && (
                        progressBarData.map((element, index) =>
                            <div key={'progressBar' + index}>
                                {progressBar(element)}
                            </div>
                        )
                    )
                }
                
            </div>
        </div>
    )
}

export default ProgressChartCard;