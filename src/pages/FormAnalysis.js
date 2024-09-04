import { useEffect, useRef, useState } from 'react';
import './../App.css';
import { useParams } from 'react-router-dom';
import ValueContent from '../components/ValueContent';
import ResizableTextArea from '../components/ResizableTextArea';
import Select from 'react-select';
import { formatISO, parseISO } from 'date-fns';
import { list } from 'postcss';

export function FormAnalysis() {
    const { id } = useParams();

    const [formDetail, setFormDetail] = useState([]);
    const [formValueData, setFormValueData] = useState([]);

    const [publishOptions, setPublishOptions] = useState([]);
    const [publishValue, setPublishValue] = useState({0 : 0, 1 : 0 });

    const hasRendered = useRef(false);

    const formatDateToIso = (date) => {
        return formatISO(date, { representation: 'datetime' }).slice(0, 19).replace('T', ' ')
    }

    const handleGetPublish = async () => {
        try {
            const response = await fetch("/publish/" + id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();
            if (res) {
                console.log(res)
                const options = [];
                for (let i = 0; i < res.length; i++) {
                    options.push({ value: res[i].publish_start, label: formatDateToIso(res[i].publish_start) } )
                } 
                setPublishOptions(options)
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGetForm = async () => {
        try {
            const response = await fetch("/form/" + id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();
            if (res) {
                setFormDetail({ formTitle: res.form_title, formDescription: (res.form_description) })
                if (res.form_question != null) {
                    setFormValueData([]);
                    JSON.parse(res.form_question).forEach(element => {
                        setFormValueData(prev => [...prev, {
                            id: element.id,
                            name: element.name,
                            type: element.type,
                            answerElement: element.answerElement
                        }])
                    })
                }
                else {
                    setFormValueData([]);
                }
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGetValue = async () => {
        try {
            const response = await fetch("/value/" + id + "?publish_start=" + "2024-08-22T05:06:05.000Z" + "&publish_end=" + "2024-08-28T16:26:40.000Z"
                , {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();
            if (res) {
                console.log(res)
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
        handleGetForm();
        handleGetPublish();
        handleGetValue();
        console.log("bruh")
    }, [])

    useEffect(() => {
        console.log(formValueData)
    }, [formValueData])

    return (
        <div className='h-auto min-h-screen bg-neutral-50 flex justify-center'>
            <div className='w-1/2 h-auto flex justify-center'>
                <div className=''>
                    <div
                        id={'title'}
                        className='w-full pl-5 pr-3 py-3 -translate-y-6 bg-neutral-50 rounded-xl border border-sky-400 flex-col justify-start items-start gap-5 inline-flex relative cursor cursor-pointer select-none'>
                        <label className='h-fit w-full flex text-black text-2xl font-normal relative flex-wrap'>
                            <ResizableTextArea type='text' className='w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto'
                                value={formDetail.formTitle}
                                resize='vertical'
                                disabled={true}
                            />
                            <ResizableTextArea type='text' className='w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto'
                                value={formDetail.formDescription}
                                resize='vertical'
                                disabled={true}
                            />
                        </label>
                    </div>
                    <Select
                        options={
                            publishOptions
                        }
                        value={publishOptions[publishValue[0]]}
                        onChange={e => {
                            setPublishValue(prev => ({ ...prev, 0: publishOptions.indexOf(e) }))
                        }}
                        isSearchable={false}
                        className='w-60 bg-neutral-50 rounded-lg shadow border border-sky-400 justify-stretch items-center'
                    />
                    <Select options={
                        publishOptions
                    }
                        value={publishOptions[publishValue[1]]}
                        onChange={e => {
                            setPublishValue(prev => ({ ...prev, 1: publishOptions.indexOf(e) }))
                        }}
                        isSearchable={false}
                        className='w-60 bg-neutral-50 rounded-lg shadow border border-sky-400 justify-stretch items-center'
                    />
                    <div
                        id={'title'}
                        className='w-full pl-5 pr-3 py-3 bg-neutral-50 rounded-xl border border-sky-400 flex-col justify-start items-start gap-5 inline-flex relative cursor cursor-pointer select-none'>
                        <label className='h-fit w-full flex text-black text-2xl font-normal relative flex-wrap'>
                            <ResizableTextArea type='text' className='w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto'
                                value={formDetail.formTitle}
                                resize='vertical'
                                disabled={true}
                            />
                            <ResizableTextArea type='text' className='w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto'
                                value={formDetail.formDescription}
                                resize='vertical'
                                disabled={true}
                            />
                        </label>
                    </div>
                    <ValueContent id={id} formDetail={formDetail} formValueData={formValueData} />
                </div>
            </div>
        </div>
    )
} export default FormAnalysis;