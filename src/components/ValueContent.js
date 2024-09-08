import './../App.css';
import ValueContainer from '../components/ValueContainer';
import ResizableTextArea from './ResizableTextArea';
import randomColor from 'randomcolor';
import { useEffect, useRef, useState } from 'react';

export default function ValueContent({ id, formValueData }) {

    const hasRendered = useRef(false);
    const allowChange = useRef(false);

    useEffect(() => {
        if (!hasRendered.current) { hasRendered.current = true; return; }
    }, [])

    return (
        <div className='h-full flex flex-col items-center gap-8 py-4 px-4'>
            {
                formValueData.length > 0 &&
                    formValueData.map((item, index) => (
                        <ValueContainer key={"value" + index} id={id} index={index} question={item} questionType={formValueData[index].id}/>
                    )) 
            }
        </div>
    )
}