import './../App.css';
import ScrollIntoView from 'react-scroll-into-view'
import { getQuestionJsonTemplate } from '../data/QuestionData';
import { useEffect, useState } from 'react';

function QuestionList({ formJson, setFormJson, focusIndex }) {
    const [sections, setSections] = useState([]);
    const [sectionIndex, setSectionIndex] = useState(0); 

    const handleAddSection = () => {
        setFormJson(prev => [...prev, getQuestionJsonTemplate(0)])
    }

    const handleAddQuestion = () => {
        focusIndex != null ?
            setFormJson(prev => [
                ...prev.slice(0, focusIndex + 1),
                getQuestionJsonTemplate(),
                ...prev.slice(focusIndex + 1)
            ])
            :
            setFormJson(prev => [...prev, getQuestionJsonTemplate()])
    }
    
    useEffect(() => {
        setSections([{"id": "title", "name": "Halaman 1"}]);
        let i = 0;
        formJson.map((item, index) => {
            if (item.type === "section") {
                i += 1;
                setSections(prev =>
                    prev = [
                        ...prev,
                        {
                            "id": index,
                            "name": "Halaman " + i,
                        }
                    ]
                );
            }
        })
    }, [ formJson])

    useEffect(() => {
        if (0 > sectionIndex) setSectionIndex(sections.length-1);
        if (sections.length <= sectionIndex) setSectionIndex(0);
    }, [sectionIndex])


    return (
        <div className='h-full fixed w-1/4 justify-start items-start inline-flex shadow-sky-400 '>
            <div className='h-full w-full pt-[30px] pb-[60px] bg-neutral-50 border border-sky-400 flex-col justify-start items-center gap-[30px] inline-flex'>
                <img className="w-[79px] h-[50px]" src="/images/fti.png"/>
                <div className="justify-start items-center gap-1 flex">
                    <button onClick={() => { 
                            setSectionIndex(prev => prev - 1);
                        }}>
                        <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.5L1 8.5L9 0.5" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="text-black text-base font-normal">{sections[sectionIndex] ? sections[sectionIndex].name : null}</div>
                    <button onClick={() => {
                            setSectionIndex(prev => prev + 1);
                        }}>
                        <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 0.5L9 8.5L1 16.5" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className="justify-start items-center flex">
                    <button className='flex gap-1'>
                        <svg width="19" height="23" viewBox="0 0 19 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.5 11.5H9.5M9.5 11.5H12.5M9.5 11.5V8.5M9.5 11.5V14.5M1.5 20.9V2.1C1.5 1.94087 1.56321 1.78826 1.67574 1.67574C1.78826 1.56321 1.94087 1.5 2.1 1.5H13.752C13.9111 1.50014 14.0636 1.56345 14.176 1.676L17.324 4.824C17.38 4.8799 17.4243 4.94632 17.4545 5.01943C17.4847 5.09254 17.5002 5.1709 17.5 5.25V20.9C17.5 20.9788 17.4845 21.0568 17.4543 21.1296C17.4242 21.2024 17.38 21.2685 17.3243 21.3243C17.2685 21.38 17.2024 21.4242 17.1296 21.4543C17.0568 21.4845 16.9788 21.5 16.9 21.5H2.1C2.02121 21.5 1.94319 21.4845 1.87039 21.4543C1.79759 21.4242 1.73145 21.38 1.67574 21.3243C1.62002 21.2685 1.57583 21.2024 1.54567 21.1296C1.51552 21.0568 1.5 20.9788 1.5 20.9Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.5 1.5V4.9C13.5 5.05913 13.5632 5.21174 13.6757 5.32426C13.7883 5.43679 13.9409 5.5 14.1 5.5H17.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div onClick={handleAddSection} className="text-black text-base font-normal  underline">Tambah Halaman</div>
                    </button>
                </div>
                <div className="text-black text-base font-normal">Daftar Pertanyaan</div>
                <div className="w-[250px] h-px bg-sky-400" />
                <button className="flex gap-4" onClick={handleAddQuestion}>
                    <div className="w-6 h-6 relative">
                        <div className="w-[18px] h-[18px] left-[3px] top-[3px] absolute">
                            <div className="w-[18px] h-[18px] left-0 top-0 absolute">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <mask id="mask0_521_1372"  maskUnits="userSpaceOnUse" x="1" y="1" width="22" height="22">
                                        <path d="M19.5 3H4.5C3.67157 3 3 3.67157 3 4.5V19.5C3 20.3284 3.67157 21 4.5 21H19.5C20.3284 21 21 20.3284 21 19.5V4.5C21 3.67157 20.3284 3 19.5 3Z" fill="white" stroke="white" strokeWidth="4" strokeLinejoin="round" />
                                        <path d="M12 8V16M8 12H16" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    </mask>
                                    <g mask="url(#mask0_521_1372)">
                                        <path d="M0 0H24V24H0V0Z" fill="black" />
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className='text-base font-normal underline' >Tambah Pertanyaan</div>   
                </button>
                <div className='overflow-y-auto max-h-72 rounded-md pl-7 w-[250px] h-[300px] py-3 bg-neutral-50 shadow border border-zinc-900 justify-start items-start inline-flex'>
                    <ol className='w-full inline-flex flex-col gap-1 list-decimal list-outside'>
                        {formJson.length > 0 ? 
                            formJson.map((question, index) => (
                            <ScrollIntoView selector={'#question'+index} key={'list'+index} className='cursor-pointer'>
                                <li tabIndex="0" className={`w-full break all`}>
                                    {question.name}
                                </li>
                            </ScrollIntoView>
                            )) : null
                        }
                    </ol>
                </div>
            </div>
        </div>
    )
}
export default QuestionList;