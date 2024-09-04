import { useEffect, useRef, useState } from 'react';
import './../App.css';
import { useParams } from 'react-router-dom';
import ValueContent from '../components/ValueContent';

export function FormValue() {
    const { id } = useParams();

    const [formDetail, setFormDetail] = useState([]);
    const [formValueData, setFormValueData] = useState([]);
    
    const hasRendered = useRef(false);

    const handleGetValues = async () => { 
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

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
        handleGetValues();
        console.log(formValueData)
    }, [])

    return (
        <div className='h-auto min-h-screen bg-neutral-50 '>
            <div className='flex' >
                <div className='md:w-1/4 sm:w-0 flex justify-start'>
                    
                </div>
                <div className='md:w-1/2 sm:w-full'>
                    <div >
                        <ValueContent id={id} formDetail={formDetail} formValueData={formValueData}/>
                    </div>
                </div>
                <div className='md:w-1/4 sm:w-0 flex justify-end overflow-y-auto'>
                    
                </div>
            </div>
        </div>
    )
} export default FormValue;