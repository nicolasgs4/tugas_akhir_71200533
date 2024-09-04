import { useEffect, useRef, useState } from 'react';

import './../App.css';
import QuestionInspector from '../components/QuestionInspector';
import QuestionContent from '../components/QuestionContent';
import QuestionList from '../components/QuestionList';
import { useParams } from 'react-router-dom';
import myData from './../output.json';
import { useCookies } from 'react-cookie';

export function Form() {
    const { id } = useParams();
    const cookie = useCookies(['skripsi-form']);

    const [formDetail, setFormDetail] = useState([])
    const [formJson, setFormJson] = useState([])

    const hasRendered = useRef(false);
    const allowChange = useRef(false);

    const [focusIndex, setFocusIndex] = useState(null)
    if (focusIndex < 0) setFocusIndex(null);

    const [isDisabled, setIsDisabled] = useState({ edit: false, fill: false });

    const handleLoad = async (data) => {
        try {
            const response = await fetch("/main", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const res = await response.json();

            if (res) {
                setIsDisabled(prev => ({ ...prev, edit: false, fill: true }));
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGetForm = async () => {
        try {
            const response = await fetch("/form/"+id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();
            if (res) {
                setFormDetail({ formTitle: res.form_title, formDescription: (res.form_description) })
                if (res.form_question != null) {
                    JSON.parse(res.form_question);
                    setFormJson(JSON.parse(res.form_question));
                } 
                else{
                    setFormJson([]);
                }
                allowChange.current = true;
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    const handleQuestionsChange = async () => {
        if (!allowChange.current) return;
        try {
            const response = await fetch("/form/" + id + "?edit=question", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ formJson: formJson})
            });
            const res = await response.json();

            if (res) {
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };
    
    const handleFormChange = async () => {
        if (!allowChange.current) return;
        try {
            const response = await fetch("/form/" + id + "?edit=detail", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ formTitle: formDetail.formTitle, formDescription: formDetail.formDescription})
            });
            const res = await response.json();

            if (res) {
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    // const handlePostValues = async () => {
    //     if (!allowChange.current) return;

    //     for (let i = 0; i < myData.length; i++) {
    //         try {
    //             const response = await fetch("/form/" + id + "/fill", {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({ values: myData[i].values.join('|'), timestamp: new Date(myData[i].timestamp).toISOString().slice(0, 19).replace('T', ' ')})
    //             });
    //             const res = await response.json();

    //             // if (res) {
    //             //     return;
    //             // }
    //             // throw new Error(res.message);
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }    
    // };

    const handlePostValues = async () => {
        if (!allowChange.current) return;
        const combinedValues = [];
        formJson.forEach(element => {
            combinedValues.push({"id": element.id, "value": element.value, "type": element.type})
            element.value = [];
        })
        console.log(combinedValues)
        try {
            const response = await fetch("/form/" + id + "/fill", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ values: combinedValues, timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ') })
            });
            const res = await response.json();

            if (res) {
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
        if (cookie[0]['skripsi-form']) handleLoad({token: cookie[0]['skripsi-form']}); 
        else setIsDisabled(prev => ({ ...prev, edit: true, fill: false }));
        handleGetForm();
    }, [])

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
        handleFormChange();
    }, [formDetail])

    useEffect(() => {
        if (!hasRendered.current) {hasRendered.current = true; return;}
        if (formJson.length < 0) return;
        console.log(formJson)
        handleQuestionsChange();
    }, [formJson])

    const handleChange = (key, value, index) => {
        const keyJson = key.split('.');
        const count = keyJson.length;
        setFormJson(prev => {
            var updatedFormJson = [...prev];
            
            if (count > 1) {
                var element = updatedFormJson[index];
                keyJson.map((keyJson, i) => (
                    (i < count - 1? element = element[keyJson] :
                        element = {
                            ...element ,
                            [keyJson] : value,
                        }
                    )
                ))
                updatedFormJson[index][keyJson[0]] = element
            } else {
                updatedFormJson[index] = {
                    ...updatedFormJson[index],
                    [keyJson] : value
                }
            }
            return updatedFormJson;
        });
    }

    const handleDetailChange = (detail, value) => {
        setFormDetail(prevState => ({
            ...prevState,
            [detail]: value
        }));
    }

    const handleFocus = (index) => {
        setFocusIndex(index);
    }

    document.addEventListener(
        "mousedown",
        () => {
            if (isDisabled.edit && isDisabled.fill) {
                setIsDisabled({ edit: false, fill: true });
                setFocusIndex(null);
            }
        }
    );

    return (
        <div className='w-screen h-auto min-h-screen bg-neutral-50 '>
            <div className='flex flex-wrap' >
                <div className='md:w-1/4 sm:w-0 flex justify-start'>
                    {
                        !isDisabled.edit && isDisabled.fill ?
                            <QuestionList formTitle={formDetail.formTitle} formJson={formJson} setFormJson={setFormJson} focusIndex={focusIndex}></QuestionList>
                        : null
                    }
                </div>
                <div className='md:w-1/2 sm:w-full'>
                    <div className="h-[76px] px-10 py-[15px] bg-neutral-50 border border-blue-400 justify-start items-center gap-2.5 flex">
                        <div className="text-sky-400 text-2xl font-black font-['Montserrat']">Pembuatan Kuesioner</div>
                    </div>
                    <div >
                        {/* <button onClick={() => handlePostValues()}>Click</button> */}
                        <QuestionContent
                            formDetail={formDetail}
                            formJson={formJson}
                            setFormJson={setFormJson}
                            focusIndex={focusIndex}
                            setFocusIndex={setFocusIndex}
                            handleDetailChange={handleDetailChange}
                            handleChange={handleChange}
                            handleFocus={handleFocus}
                            isDisabled={isDisabled}
                        />
                        {
                            isDisabled.edit && !isDisabled.fill ?
                            <div className='flex flex-wrap'>
                                <div className='ml-8 bg-sky-400 text-neutral-50 p-2 rounded-xl' onClick={() => handlePostValues()}>SUBMIT</div>
                            </div>
                            : null
                        }
                    </div>
                </div>
                <div className='md:w-1/4 sm:w-0 flex justify-end overflow-y-auto'>
                    {
                        !isDisabled.edit && isDisabled.fill ?
                            <QuestionInspector formJson={formJson} focusIndex={focusIndex} handleChange={handleChange} setIsDisabled={setIsDisabled}/>
                        : null
                    }
                </div>
            </div>
        </div>
    );
}
export default Form;