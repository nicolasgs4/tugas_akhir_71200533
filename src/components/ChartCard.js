import { ArcElement, Chart, Tooltip } from 'chart.js';
import './../App.css';
import { getElementAtEvent, Pie } from 'react-chartjs-2';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select'
import randomColor from 'randomcolor';

const ChartCard = ({dashboardData}) => {
    const [form, setForm] = useState({form_id: null, value_id: null, question_type: null})
    const [data, setData] = useState();
    const chartRef = useRef();
    const titleOptions =  useRef([]);
    const questionOptions = useRef([]);

    const questionSelect = useRef();

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
    
    const handleGetFormValue = async () => {
        try {
            const response = await fetch("/value/" + form.form_id + "?value=" + form.value_id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();
            if (res) {
                console.log(res)
                if (res.length <= 0) return;
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
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };
    
    const hasRendered = useRef(false);

    useEffect(() => {
        console.log(dashboardData)
        titleOptions.current = Object.entries(dashboardData).map(([key, value]) => ({
            value: key,
            label: value.form_title
        }));
    },[])

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
        if (form.form_id !== null && form.value_id !== null) handleGetFormValue();
    }, [form])

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
        if (data != null) chartRef.current.getDatasetMeta(0).data[0].hidden = false;
    }, [data])

    Chart.register(ArcElement, Tooltip);

    return (
        <div className="w-full p-2.5 bg-neutral-50 rounded-[15px] border border-neutral-500 flex-col  items-center gap-2.5 inline-flex relative">
            <div className="flex-col justify-start items-start gap-2 flex">
                <div className="text-center text-zinc-900 text-base font-normal font-['Inter'] leading-normal">Custom Chart</div>
            </div>
            <div className='w-full'>
                <Select
                    options={titleOptions.current}
                    onChange={e => {
                        setForm(prev => ({ ...prev, form_id: e.value, value_id: null }));
                        questionOptions.current = Object.entries(dashboardData[e.value].question_type)
                            .filter(([key, value]) => value !== "text")
                            .map(([key, value]) => ({
                                value: key,
                                label: "Pertanyaan ke-" + (parseInt(key) + 1)
                            }));
                    }}
                />
            </div>
            <div className='w-full'>
                <Select ref={questionSelect} options={questionOptions.current}  onChange={e => {
                    setForm(prev => ({ ...prev, value_id: e.value, question_type: dashboardData[form.form_id].question_type[e.value] }));
                }} />
            </div>
            <div className='w-[300px] h-[300px] flex'>
                {
                    data != null 
                    ? <Pie ref={chartRef} data={data} onClick={e => { console.log(getElementAtEvent(chartRef.current, e))}}/>
                    : null
                }
            </div>
            <div className="w-[111px] p-2.5 absolute right-0 top-0 bg-white rounded-[15px] shadow flex-col gap-2 flex">
                <div className="w-[91px] px-2.5 bg-white rounded-[15px] border border-neutral-500 justify-start items-start a gap-2 inline-flex">
                    <div className="text-neutral-900 text-base font-normal font-['Inter'] leading-normal">Edit</div>
                    <div className="w-6 h-6 relative" />
                </div>
                {/* {
                    data != null ? (
                        data.datasets[0].data.map((element, index) => (
                            <div key={index} className="justify-start items-center gap-[23px] inline-flex relative">
                                <div className={`w-5 h-5 rounded-[50px]`} style={{backgroundColor: `${data.datasets[0].backgroundColor[index]}`}}/> 
                                <button onClick={() => { chartRef.current.getDatasetMeta(0).data[index].hidden ? chartRef.current.show(0, index) : chartRef.current.hide(0, index)} }>{data.labels[index]}</button>
                            </div>
                        ))
                    ) : null
                } */}

            </div>
        </div>
    )
}
export default ChartCard;