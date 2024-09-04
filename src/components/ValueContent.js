import './../App.css';
import ValueContainer from '../components/ValueContainer';
import ResizableTextArea from './ResizableTextArea';
import randomColor from 'randomcolor';
import { useEffect, useRef, useState } from 'react';

export default function ValueContent({id, formDetail, formValueData}) {
    const [questionType, setQuestionType] = useState(null);

    const hasRendered = useRef(false);
    const allowChange = useRef(false);

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
    
    const handleLoadDashBoard = async () => {
        try {
            const response = await fetch("/dashboard", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const res = await response.json();
            if (res) {
                setQuestionType(res[id]['question_type']);
                allowChange.current = true;
            } else {
                throw new Error(res.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
        handleLoadDashBoard();
    }, [])

    

    return (
        <div className='h-full flex flex-col items-center gap-8 py-4 px-4'>
            {
                formValueData.length > 0 && questionType !== null &&
                    formValueData.map((item, index) => (
                        <ValueContainer key={"value" + index} id={id} index={index} question={item} questionType={questionType[index]}/>
                    )) 
            }
        </div>
    )
}