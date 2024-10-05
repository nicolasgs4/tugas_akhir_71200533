// import './../App.css';
// import { getQuestionTypeValue } from '../data/QuestionData';
// import { useEffect, useRef, useState } from 'react';
// import ResizableTextArea from './ResizableTextArea';
// import randomColor from 'randomcolor';
// import { ArcElement, BarElement, CategoryScale, Chart, Filler, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip } from 'chart.js';
// import { Bar, getElementAtEvent, Pie } from 'react-chartjs-2';


// export default function ValueContainer({ id, index, question, publishArray }) {
//     const activeIndex = getQuestionTypeValue(question.type);
//     const [valueData, setValueData] = useState(null);
//     const chartRef = useRef();

//     const defaultbackgroundColor = [
//         '#FF4853',
//         '#3BC0ED',
//         '#03F1A3',
//         '#FDEA5F',
//         '#FF3136',
//         '#0075B6',
//         '#11D983',
//         '#F4A631',
//         '#FF4853',
//         '#0098DC',
//         '#00E376',
//         '#FEC60C'
//     ]

//     const hasRendered = useRef(false);

//     const HandleGetFormValue = async () => {
//         try {
//             const response = await fetch("/value/" + id + "?index=" + index
//                 + "&publish_start[]="
//                 + publishArray[0].publish_start
//                 + "&publish_start[]="
//                 + publishArray[1].publish_start
//                 + "&publish_end[]="
//                 + publishArray[0].publish_end
//                 + "&publish_end[]="
//                 + publishArray[1].publish_end
//                 , {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                     }
//                 });
//             const res = await response.json();
//             if (res) {
//                 if (activeIndex === 0) return;
//                 if (activeIndex === 1) {
//                     setValueData([])
//                     setValueData(prev => [...prev, Object.values(res[0])]);
//                     if (res.length > 1) setValueData(prev => [...prev, Object.values(res[1])]);
//                 }
//                 else {
//                     if (valueData) chartRef.current.reset();
//                     const randomizedColor = [];
//                     for (let i = 0; i < Object.keys(res).length; i++) {
//                         randomizedColor.push(randomColor());
//                     }
                    
//                     const datasets = [];

//                     if (res.length > 0) {
//                         datasets.push({
//                             label: 'Jumlah',
//                             data: Object.values(res[0]),
//                             backgroundColor: '#FF4853',
//                             borderWidth: 0
//                         });
//                     }

//                     if (res.length > 1) {
//                         datasets.push({
//                             label: 'Jumlah',
//                             data: Object.values(res[1]),
//                             backgroundColor: '#3BC0ED',
//                             borderWidth: 0
//                         });
//                     }

//                     setValueData({
//                         labels: res.length > 0 ? Object.keys(res[0]) : [],
//                         datasets: datasets
//                     });

//                     // setValueData({
//                     //     labels: ["Chocolate", "Vanilla"],
//                     //     datasets: [
//                     //         {
//                     //             label: "Blue",
//                     //             backgroundColor: '#FF4853',
//                     //             data: [3,7]
//                     //         },
//                     //         {
//                     //             label: "Red",
//                     //             backgroundColor: '#3BC0ED',
//                     //             data: [4,3]
//                     //         }
//                     //     ]
//                     // })
//                 }
//                 return;
//             }
//             throw new Error(res.message);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     useEffect(() => {
//         if (!hasRendered.current) { hasRendered.current = true; return; }
//             HandleGetFormValue();
//             console.log(valueData)
//     }, [publishArray])

//     Chart.register(ArcElement, BarElement, Tooltip, CategoryScale, LinearScale, Title, PointElement, LineElement, TimeScale, Filler);

//     return (
//         <div className='w-full h-wrap'>
//             {
//                 activeIndex == 0 &&
//                     <div className='flex flex-wrap translate-y-6'>
//                         <div className='h-16 bg-sky-400 text-neutral-50 p-2 rounded-xl'>Judul Kuesioner</div>
//                     </div>
//             }
//             <div id={'question' + index} key={index} tabIndex="0"
//                 className={`w-full pl-5 pr-3 bg-neutral-50 rounded-xl border border-sky-400 justify-start items-start flex flex-wrap relative cursor cursor-pointer select-none ${activeIndex === 0 ? '' : 'h-[400px]'}`}
//             >
//                 <label className='h-fit w-full flex text-black text-2xl font-normal relative flex-wrap'>
//                     {
//                         question.type == "section" ?
//                             null :
//                             <a className='mt-4'>{index + 1 + '. '}</a>
//                     }
//                     <ResizableTextArea disabled={true} type='text' className='w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto' value={question.name} resize='vertical' />
//                 </label>
//                 <div className='w-full max-h-[270px] flex'>
//                     {
//                         activeIndex === 1 && (
//                             <div className=''>
//                                 <div className='flex space-x-12'>
//                                     {valueData != null &&
//                                         valueData.map((element,index) => (
//                                             <ul key={index} className='list-none space-y-4 overflow-y-scroll max-h-[300px]'>
//                                                 {
//                                                     element.map((item, index) => (
//                                                         <li key={index} tabIndex="0" className="h-10 p-2.5 bg-[#fcfcfc] rounded-[10px] border border-[#3bc0ed] justify-start items-center gap-2.5 flex">
//                                                             <div className="text-black text-base font-normal font-['Montserrat']">{item}</div>
//                                                         </li>
//                                                     ))
//                                                 }
//                                             </ul>
//                                         ))
//                                     }
//                                     {/* <ul className='list-none space-y-4 '>
//                                         {valueData != null &&
//                                             valueData.map((element, index) => (
//                                                 <li key={index} tabIndex="0" className="w-[250px] h-10 p-2.5 bg-[#fcfcfc] rounded-[10px] border border-[#3bc0ed] justify-start items-center gap-2.5 flex">
//                                                     <div className="text-black text-base font-normal font-['Montserrat']">{element}</div>
//                                                 </li>
//                                             ))
//                                         }
//                                     </ul>
//                                     <ul className='list-none space-y-4 '>
//                                         {valueData != null &&
//                                             valueData.map((element, index) => (
//                                                 <li key={index} tabIndex="0" className="w-[250px] h-10 p-2.5 bg-[#fcfcfc] rounded-[10px] border border-[#3bc0ed] justify-start items-center gap-2.5 flex">
//                                                     <div className="text-black text-base font-normal font-['Montserrat']">{element}</div>
//                                                 </li>
//                                             ))
//                                         }
//                                     </ul> */}
//                                 </div>
//                             </div>
//                         )
//                     }
//                     {
//                         activeIndex > 1 &&
//                         <div className='w-full '>
//                             {/* {
//                             valueData != null
//                                 ? <Pie ref={chartRef} data={valueData} onClick={e => { console.log(getElementAtEvent(chartRef.current, e)) }} />
//                                 : null
//                             } */}
//                             {
//                                 valueData != null
//                                 && <Bar ref={chartRef} data={valueData} onClick={e => { console.log(getElementAtEvent(chartRef.current, e)) }} />
//                             }
//                         </div>
//                     }
                    
//                 </div>
//             </div>
//         </div>
//     )
// }

// import './../App.css';
// import { getQuestionTypeValue } from '../data/QuestionData';
// import { useEffect, useRef, useState } from 'react';
// import ResizableTextArea from './ResizableTextArea';
// import randomColor from 'randomcolor';
// import { ArcElement, BarElement, CategoryScale, Chart, Filler, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip } from 'chart.js';
// import { Bar, getElementAtEvent, Pie } from 'react-chartjs-2';


// export default function ValueContainer({ id, index, question, publishArray }) {
//     const activeIndex = getQuestionTypeValue(question.type);
//     const [valueData, setValueData] = useState(null);
//     const chartRef = useRef();

//     const defaultbackgroundColor = [
//         '#FF4853',
//         '#3BC0ED',
//         '#03F1A3',
//         '#FDEA5F',
//         '#FF3136',
//         '#0075B6',
//         '#11D983',
//         '#F4A631',
//         '#FF4853',
//         '#0098DC',
//         '#00E376',
//         '#FEC60C'
//     ]

//     const hasRendered = useRef(false);

//     const HandleGetFormValue = async () => {
//         try {
//             const response = await fetch("/value/" + id + "?index=" + index
//                 + "&publish_start[]="
//                 + publishArray[0].publish_start
//                 + "&publish_start[]="
//                 + publishArray[1].publish_start
//                 + "&publish_end[]="
//                 + publishArray[0].publish_end
//                 + "&publish_end[]="
//                 + publishArray[1].publish_end
//                 , {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                     }
//                 });
//             const res = await response.json();
//             if (res) {
//                 if (activeIndex === 0) return;
//                 if (activeIndex === 1) {
//                     setValueData([])
//                     setValueData(prev => [...prev, Object.values(res[0])]);
//                     if (res.length > 1) setValueData(prev => [...prev, Object.values(res[1])]);
//                 }
//                 else {
//                     if (valueData) chartRef.current.reset();
//                     const randomizedColor = [];
//                     for (let i = 0; i < Object.keys(res).length; i++) {
//                         randomizedColor.push(randomColor());
//                     }
                    
//                     const datasets = [];

//                     if (res.length > 0) {
//                         datasets.push({
//                             label: 'Jumlah',
//                             data: Object.values(res[0]),
//                             backgroundColor: '#FF4853',
//                             borderWidth: 0
//                         });
//                     }

//                     if (res.length > 1) {
//                         datasets.push({
//                             label: 'Jumlah',
//                             data: Object.values(res[1]),
//                             backgroundColor: '#3BC0ED',
//                             borderWidth: 0
//                         });
//                     }

//                     setValueData({
//                         labels: res.length > 0 ? Object.keys(res[0]) : [],
//                         datasets: datasets
//                     });

//                     // setValueData({
//                     //     labels: ["Chocolate", "Vanilla"],
//                     //     datasets: [
//                     //         {
//                     //             label: "Blue",
//                     //             backgroundColor: '#FF4853',
//                     //             data: [3,7]
//                     //         },
//                     //         {
//                     //             label: "Red",
//                     //             backgroundColor: '#3BC0ED',
//                     //             data: [4,3]
//                     //         }
//                     //     ]
//                     // })
//                 }
//                 return;
//             }
//             throw new Error(res.message);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     useEffect(() => {
//         if (!hasRendered.current) { hasRendered.current = true; return; }
//             HandleGetFormValue();
//             console.log(valueData)
//     }, [publishArray])

//     Chart.register(ArcElement, BarElement, Tooltip, CategoryScale, LinearScale, Title, PointElement, LineElement, TimeScale, Filler);

//     return (
//         <div className='w-full h-wrap'>
//             {
//                 activeIndex == 0 &&
//                     <div className='flex flex-wrap translate-y-6'>
//                         <div className='h-16 bg-sky-400 text-neutral-50 p-2 rounded-xl'>Judul Kuesioner</div>
//                     </div>
//             }
//             <div id={'question' + index} key={index} tabIndex="0"
//                 className={`w-full pl-5 pr-3 bg-neutral-50 rounded-xl border border-sky-400 justify-start items-start flex flex-wrap relative cursor cursor-pointer select-none ${activeIndex === 0 ? '' : 'h-[400px]'}`}
//             >
//                 <label className='h-fit w-full flex text-black text-2xl font-normal relative flex-wrap'>
//                     {
//                         question.type == "section" ?
//                             null :
//                             <a className='mt-4'>{index + 1 + '. '}</a>
//                     }
//                     <ResizableTextArea disabled={true} type='text' className='w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto' value={question.name} resize='vertical' />
//                 </label>
//                 <div className='w-full max-h-[270px] flex'>
//                     {
//                         activeIndex === 1 && (
//                             <div className=''>
//                                 <div className='flex space-x-12'>
//                                     {valueData != null &&
//                                         valueData.map((element,index) => (
//                                             <ul key={index} className='list-none space-y-4 overflow-y-scroll max-h-[300px]'>
//                                                 {
//                                                     element.map((item, index) => (
//                                                         <li key={index} tabIndex="0" className="h-10 p-2.5 bg-[#fcfcfc] rounded-[10px] border border-[#3bc0ed] justify-start items-center gap-2.5 flex">
//                                                             <div className="text-black text-base font-normal font-['Montserrat']">{item}</div>
//                                                         </li>
//                                                     ))
//                                                 }
//                                             </ul>
//                                         ))
//                                     }
//                                     {/* <ul className='list-none space-y-4 '>
//                                         {valueData != null &&
//                                             valueData.map((element, index) => (
//                                                 <li key={index} tabIndex="0" className="w-[250px] h-10 p-2.5 bg-[#fcfcfc] rounded-[10px] border border-[#3bc0ed] justify-start items-center gap-2.5 flex">
//                                                     <div className="text-black text-base font-normal font-['Montserrat']">{element}</div>
//                                                 </li>
//                                             ))
//                                         }
//                                     </ul>
//                                     <ul className='list-none space-y-4 '>
//                                         {valueData != null &&
//                                             valueData.map((element, index) => (
//                                                 <li key={index} tabIndex="0" className="w-[250px] h-10 p-2.5 bg-[#fcfcfc] rounded-[10px] border border-[#3bc0ed] justify-start items-center gap-2.5 flex">
//                                                     <div className="text-black text-base font-normal font-['Montserrat']">{element}</div>
//                                                 </li>
//                                             ))
//                                         }
//                                     </ul> */}
//                                 </div>
//                             </div>
//                         )
//                     }
//                     {
//                         activeIndex > 1 &&
//                         <div className='w-full '>
//                             {/* {
//                             valueData != null
//                                 ? <Pie ref={chartRef} data={valueData} onClick={e => { console.log(getElementAtEvent(chartRef.current, e)) }} />
//                                 : null
//                             } */}
//                             {
//                                 valueData != null
//                                 && <Bar ref={chartRef} data={valueData} onClick={e => { console.log(getElementAtEvent(chartRef.current, e)) }} />
//                             }
//                         </div>
//                     }
                    
//                 </div>
//             </div>
//         </div>
//     )
// }

import './../App.css';
import { getQuestionTypeValue } from '../data/QuestionData';
import { useEffect, useRef, useState } from 'react';
import ResizableTextArea from './ResizableTextArea';
import randomColor from 'randomcolor';
import { 
    
    ArcElement, 
    
    BarElement, 
    
    CategoryScale, 
    
    Chart, 
    
    Filler, 
    
    LinearScale, 
    
    LineElement, 
    
    PointElement, 
    
    TimeScale, 
    
    Title, 
    
    Tooltip 

} from 'chart.js';
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
            let publishArrayString = ""
            publishArray.map((element, index) => {
                publishArrayString += "&publish_start[]=" + element.publish_start
                publishArrayString += "&publish_end[]=" + element.publish_end
            })
            const response = await fetch("/value/" + id + "?index=" + index
                + publishArrayString
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
                    setValueData([]);
                    res.map((element) => {
                        setValueData(prev => [...prev, Object.values(element)]);
                    })
                }
                else {
                    if (valueData) chartRef.current.reset();
                    const randomizedColor = [];
                    for (let i = 0; i < Object.keys(res).length; i++) {
                        randomizedColor.push(randomColor());
                    }
                    
                    const datasets = [];

                    res.map((element, index) => {
                        datasets.push({
                            label: 'Jumlah',
                            data: Object.values(element),
                            backgroundColor: defaultbackgroundColor[index],
                            borderWidth: 0
                        });
                    })

                    setValueData({
                        labels: res.length > 0 ? Object.keys(res[0]) : [],
                        datasets: datasets
                    });
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

    // **1. Define Custom Options for the Bar Chart**
    const truncateLabel = (label, maxLength = 10) => {
        if (label.length > maxLength) {
            return label.substring(0, maxLength) + '...';
        }
        return label;
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    callback: function(value, index, ticks) {
                        const label = this.getLabelForValue(value);
                        return truncateLabel(label, 10); // Adjust maxLength as needed
                    },
                    maxRotation: 0, // Prevent label rotation if desired
                    autoSkip: false, // Show all labels or handle spacing as needed
                }
            },
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: function(context) {
                        // Show full label as the tooltip title
                        return context[0].label;
                    },
                    label: function(context) {
                        // Customize the tooltip label if needed
                        return `Value: ${context.parsed.y}`;
                    }
                }
            },
            legend: {
                display: true,
                position: 'top'
            },
            title: {
                display: false,
                text: 'Bar Chart'
            }
        },
        // Optional: Add other customization options here
    };

    return (
        <div className='w-full h-wrap'>
            {
                activeIndex == 0 &&
                    <div className='flex flex-wrap translate-y-6'>
                        <div className='h-16 bg-sky-400 text-neutral-50 p-2 rounded-xl'>Judul Kuesioner</div>
                    </div>
            }
            <div id={'question' + index} key={index} tabIndex="0"
                className={`w-full pl-5 pr-3 bg-neutral-50 rounded-xl border border-sky-400 justify-start items-start flex flex-wrap relative cursor cursor-pointer select-none ${activeIndex === 0 ? '' : 'h-[400px]'}`}
            >
                <label className='h-fit w-full flex text-black text-2xl font-normal relative flex-wrap'>
                    {
                        question.type == "section" ?
                            null :
                            <a className='mt-4'>{index + 1 + '. '}</a>
                    }
                    <ResizableTextArea disabled={true} type='text' className='w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto' value={question.name} resize='vertical' />
                </label>
                <div className='w-full max-h-[270px] flex'>
                    {
                        activeIndex === 1 && (
                            <div className=''>
                                <div className='flex space-x-12'>
                                    {valueData != null &&
                                        valueData
                                        .map((element, index) => (
                                            <ul key={index} className='list-none space-y-4 overflow-y-scroll max-h-[300px]'>
                                                {
                                                    element.map((item, index) => (
                                                        <li key={index} tabIndex="0" className="h-10 p-2.5 bg-[#fcfcfc] rounded-[10px] border border-[#3bc0ed] justify-start items-center gap-2.5 flex">
                                                            <div className="text-black text-base font-normal font-['Montserrat']">{item}</div>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                    {
                        activeIndex > 1 &&
                        <div className='w-full '>
                            {
                                valueData != null &&
                                <Bar 
                                    ref={chartRef} 
                                    data={valueData} 
                                    options={options} // **2. Pass the Custom Options Here**
                                    onClick={e => { console.log(getElementAtEvent(chartRef.current, e)) }} 
                                />
                            {
                                valueData != null &&
                                <Bar 
                                    ref={chartRef} 
                                    data={valueData} 
                                    options={options} // **2. Pass the Custom Options Here**
                                    onClick={e => { console.log(getElementAtEvent(chartRef.current, e)) }} 
                                />
                            }
                        </div>
                    }
                    
                </div>
            </div>
        </div>
    )
}
