import './../App.css';
import { getQuestionTypeValue } from '../data/QuestionData';
import { useEffect, useRef, useState } from 'react';
import ResizableTextArea from './ResizableTextArea';
import randomColor from 'randomcolor';
import { ArcElement, BarElement, CategoryScale, Chart, Filler, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip } from 'chart.js';
import { Bar, getElementAtEvent, Pie } from 'react-chartjs-2';


export default function ValueContainer({ id, index, question, publishArray }) {
    const activeIndex = getQuestionTypeValue(question.type);
    const [valueData, setValueData] = useState(null);
    const chartRef = useRef();

    const defaultbackgroundColor = [
        '#FF4853',
        '#3BC0ED',
        '#03F1A3',
        '#FDEA5F',
        '#FF3136',
        '#0075B6',
        '#11D983',
        '#F4A631',
        '#FF4853',
        '#0098DC',
        '#00E376',
        '#FEC60C'
    ]

    const hasRendered = useRef(false);

    const HandleGetFormValue = async () => {
        try {
            const response = await fetch("/value/" + id + "?index=" + index
                + "&publish_start[]="
                + publishArray[0].publish_start
                + "&publish_start[]="
                + publishArray[1].publish_start
                + "&publish_end[]="
                + publishArray[0].publish_end
                + "&publish_end[]="
                + publishArray[1].publish_end
                , {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
            const res = await response.json();
            if (res) {
                console.log(res)
                if (activeIndex === 0) return;
                if (activeIndex === 1) {
                    setValueData(Object.values(res[0]))
                }
                else {
                    if (valueData) chartRef.current.reset();
                    const randomizedColor = [];
                    for (let i = 0; i < Object.keys(res).length; i++) {
                        randomizedColor.push(randomColor());
                    }
                    
                    const datasets = [];

                    if (res.length > 0) {
                        datasets.push({
                            label: 'Jumlah',
                            data: Object.values(res[0]),
                            backgroundColor: '#FF4853',
                            borderWidth: 0
                        });
                    }

                    if (res.length > 1) {
                        datasets.push({
                            label: 'Jumlah',
                            data: Object.values(res[1]),
                            backgroundColor: '#3BC0ED',
                            borderWidth: 0
                        });
                    }

                    setValueData({
                        labels: res.length > 0 ? Object.keys(res[0]) : [],
                        datasets: datasets
                    });

                    // setValueData({
                    //     labels: ["Chocolate", "Vanilla"],
                    //     datasets: [
                    //         {
                    //             label: "Blue",
                    //             backgroundColor: '#FF4853',
                    //             data: [3,7]
                    //         },
                    //         {
                    //             label: "Red",
                    //             backgroundColor: '#3BC0ED',
                    //             data: [4,3]
                    //         }
                    //     ]
                    // })
                }
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
            HandleGetFormValue();
            console.log(valueData)
    }, [publishArray])

    Chart.register(ArcElement, BarElement, Tooltip, CategoryScale, LinearScale, Title, PointElement, LineElement, TimeScale, Filler);

    return (
        <div className='w-full '>
            <div id={'question' + index} key={index} tabIndex="0"
                className={`w-full pl-5 pr-3 py-3 bg-neutral-50 rounded-xl border border-sky-400 flex-col justify-start items-start gap-5 inline-flex relative cursor cursor-pointer select-none`}
            >
                <label className='h-fit w-full flex text-black text-2xl font-normal relative flex-wrap'>
                    {
                        question.type == "section" ?
                            null :
                            <a className='mt-4'>{index + 1 + '. '}</a>
                    }
                    <ResizableTextArea disabled={true} type='text' className='w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto' value={question.name} resize='vertical' />
                </label>
                <div className='w-[600px] h-[300px] flex'>
                    {
                        activeIndex === 1 &&
                        <ul className='list-decimal'>
                            { valueData != null &&
                                valueData.map((element, index) => {
                                    <li tabIndex="0" className={`w-full h-full break all`}>
                                        dawda
                                    </li>
                                })
                            }   
                        </ul>
                        
                    }
                    {
                        activeIndex > 1 &&
                        <div className='w-full'>
                            {/* {
                            valueData != null
                                ? <Pie ref={chartRef} data={valueData} onClick={e => { console.log(getElementAtEvent(chartRef.current, e)) }} />
                                : null
                            } */}
                            {
                                valueData != null
                                && <Bar ref={chartRef} data={valueData} onClick={e => { console.log(getElementAtEvent(chartRef.current, e)) }} />
                            }
                        </div>
                    }
                    
                </div>
            </div>
        </div>
    )
}