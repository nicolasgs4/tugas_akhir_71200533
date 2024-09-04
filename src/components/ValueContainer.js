import './../App.css';
import { getQuestionTypeValue } from '../data/QuestionData';
import { useEffect, useRef, useState } from 'react';
import ResizableTextArea from './ResizableTextArea';
import { ArcElement, Chart, Tooltip } from 'chart.js';
import randomColor from 'randomcolor';
import { getElementAtEvent, Pie } from 'react-chartjs-2';


export default function ValueContainer({id, index, question }) {
    const activeIndex = getQuestionTypeValue(question.type);
    const [data, setData] = useState();
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

    const handleGetFormValue = async () => {
        try {
            const response = await fetch("/value/" + id + "?value=" + index + "&type=" + question.type, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();
            if (res) {
                if (activeIndex === 0) return;
                if (activeIndex === 1) setData(Object.values(res))
                else {
                    if (data) chartRef.current.reset();
                    const randomizedColor = [];
                    for (let i = 0; i < Object.keys(res).length; i++) {
                        randomizedColor.push(randomColor());
                    }
                    setData({
                        labels: Object.keys(res),
                        datasets: [
                            {
                                label: 'Jumlah',
                                data: Object.values(res),
                                backgroundColor: defaultbackgroundColor.slice(0, Object.keys(res).length),
                                borderWidth: 0
                            }
                        ]
                    })
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
        handleGetFormValue();
    }, [])

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
        console.log(data)
    }, [data])

    Chart.register(ArcElement, Tooltip)


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
                {
                    activeIndex === 1 &&
                    <div className='w-full h-auto'>
                        {
                            data != null && data.map((element, index) => {
                                return (
                                    <ResizableTextArea
                                        key={"answer" + index}
                                        className='w-full bg-neutral-50 rounded-xl border border-black overflow-auto p-4 text-2xl flex-wrap '
                                        value={element}
                                        resize={"vertical"}
                                        disabled={true}
                                    />
                                )
                            })
                        }
                    </div>
                    }
                {
                    activeIndex === 2 || activeIndex === 3 || activeIndex === 4 || activeIndex === 5 &&
                    <div className='w-full h-fit'>
                        {
                            data != null && 
                            <Pie ref={chartRef} data={data} onClick={e => { console.log(getElementAtEvent(chartRef.current, e)) }} />
                        }
                    </div>
                }
            </div>
        </div>
    )
}