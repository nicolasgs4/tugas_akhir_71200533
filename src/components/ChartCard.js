import { ArcElement, Chart, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './../App.css';
import { getElementAtEvent, Pie } from 'react-chartjs-2';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select'
import randomColor from 'randomcolor';
import { ChromePicker } from 'react-color';
import { useCookies } from 'react-cookie';

const ChartCard = ({valueData}) => {
    const [form, setForm] = useState({form_id: null, value_id: null, question_type: null})
    const [data, setData] = useState();
    const chartRef = useRef();
    const titleOptions =  useRef([]);
    const questionOptions = useRef([]);

    const questionSelect = useRef();

    const [colorSelected, setColorSelected] = useState();
    const elementIndex = useRef();
    const clickPos = useRef();

    const [cookie, setCookie, removeCookie] = useCookies(['cookies-n-cream']);

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
    
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
    
    const handleClick = (color) => {
        setDisplayColorPicker(true);
        setColorSelected(color);
    };

    const handleClose = () => {
        setDisplayColorPicker(false);
        setColorSelected();
    };

    const handleChangeComplete = (color, e) => {
        setColorSelected(color.hex);
        const colorSet = data.datasets[0].backgroundColor;
        colorSet[elementIndex.current] = color.hex

        setData((prev) => ({
            ...prev,
            datasets: [
                {
                    ...prev.datasets[0],
                    backgroundColor: colorSet,
                },
            ],
        }));
    };

    const handleGetFormValue = async () => {
        try {
            const response = await fetch("/value/" + form.form_id + "?index=" + form.value_id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();
            if (res) {
                if (res.length <= 0) return;
                if (data) chartRef.current.reset();
                const randomizedColor = [];
                for (let i = 0; i < Object.keys(res[0]).length; i++) {
                    randomizedColor.push(randomColor());
                }
                setData({
                    labels: Object.keys(res[0]),
                    datasets: [
                        {
                            label: 'Jumlah',
                            data: Object.values(res[0]),
                            backgroundColor: defaultbackgroundColor.slice(0, Object.keys(res[0]).length),
                            borderWidth: 0
                        }
                    ]
                })
                // setCookie("cookies-n-cream", JSON.parse(defaultbackgroundColor));
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };
    
    const handleCopyChart = () => {
        const canvas = chartRef.current.canvas;
        if (canvas) {
            canvas.toBlob((blob) => {
                if (blob) {
                    const item = new ClipboardItem({ 'image/png': blob });
                    navigator.clipboard.write([item]).then(() => {
                        console.log('Canvas copied to clipboard');
                    }).catch((error) => {
                        console.error('Error copying to clipboard: ', error);
                    });
                }
            })
        }
    }

    const hasRendered = useRef(false);

    useEffect(() => {
        titleOptions.current = Object.entries(valueData).map(([key, value]) => ({
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

    Chart.defaults.set('plugins.datalabels', {
        color: '#000000'
    });

    return (
        <div className="h-full p-2.5 bg-neutral-50 rounded-[15px] border border-neutral-500 flex-col items-center gap-2.5 flex">
            <div className="flex-col justify-start items-start gap-2 flex">
                <div className="text-center text-zinc-900 text-base font-normal font-['Inter'] leading-normal">Custom Chart</div>
            </div>
            <div className='w-full'>
                <Select
                    options={titleOptions.current}
                    onChange={e => {
                        setForm(prev => ({ ...prev, form_id: e.value, value_id: null }));
                        questionOptions.current = Object.entries(valueData[e.value].question_type)
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
                    setForm(prev => ({ ...prev, value_id: e.value, question_type: valueData[form.form_id].question_type[e.value] }));
                }} />
            </div>
            <div className='w-full flex relative justify-center'>
                <div className='w-[250px]'>
                    {
                        data != null
                            && <Pie 
                                ref={chartRef} 
                                data={data}
                                plugins={[ChartDataLabels]} 
                                onClick={e => {
                                    if (getElementAtEvent(chartRef.current, e).length <= 0) return;
                                    handleClick(getElementAtEvent(chartRef.current, e)[0].element.options.backgroundColor);
                                    elementIndex.current = getElementAtEvent(chartRef.current, e)[0].index;
                                    clickPos.current = { x: e.pageX + 'px', y: e.pageY + 'px' };
                                }
                            } />
                    }
                </div>
                {data != null &&
                    <button className='absolute right-0' onClick={handleCopyChart}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0075b6"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" /></svg>
                    </button>
                }
            </div>
            
            {displayColorPicker &&
                <div className={`absolute z-[2]`} style={{left: clickPos.current.x, top: clickPos.current.y}}>
                    <div className='fixed top-0 right-0 left-0 bottom-0' onClick={handleClose} />
                    <ChromePicker color={colorSelected} disableAlpha={true} onChange={handleChangeComplete}/>
                </div> 
            }
            
            
            
        </div>
    )
}
export default ChartCard;