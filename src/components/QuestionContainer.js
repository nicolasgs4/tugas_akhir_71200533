import './../App.css';
import { getQuestionTypeValue } from '../data/QuestionData';
import { useEffect, useRef, useState } from 'react';
import ResizableTextArea from './ResizableTextArea';

function QuestionContainer({
    sectionIndex,
    question,
    index,
    handleChange, handleDelete,
    focusIndex, handleFocus,
    isDisabled }
) {
    const activeIndex = getQuestionTypeValue(question.type);

    const [toggleArr, setToggleArr] = useState();

    const addToggleElement = (value, index) => {
        const newToggleArr = [...toggleArr];

        if (index === 0) {
            newToggleArr[0] = value;
        }
        if (index === 1) {
            if (toggleArr.length <= 0) newToggleArr[0] = "";
            newToggleArr[1] = value;
        }

        setToggleArr(newToggleArr);

    };

    const textAreaSplitter = (value) => {
        const combinedValue = value.split('\n')
        var answerElementItem = [];
        combinedValue.map((element, elementIndex) =>
            answerElementItem = [...answerElementItem, elementIndex = element]
        )
        if (answerElementItem <= 0 && answerElementItem == '') answerElementItem = null
        return answerElementItem;
    }

    const scaleElement = () => {
        var scaleElementItem = [];
        for (var i = 0; i < question['setting']['scaleSize'] * 2 + 3; i++) {
            const j = i;
            scaleElementItem = [...scaleElementItem,
            <button key={"circle" + i} checked={question['value'] == i} onClick={() => handleChange('value', j, index)} disabled={isDisabled.fill}>
                {
                    question['value'] >= i && typeof (question['value']) == "number" ?
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="25" cy="25" r="23.5" stroke="black" strokeWidth="3" />
                            <circle cx="25" cy="25" r="18.5" fill="black" />
                        </svg>
                        :
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="25" cy="25" r="23.5" stroke="black" strokeWidth="3" />
                        </svg>
                }
            </button>
            ]
        }
        return scaleElementItem;
    }

    const [multiValue, setMultiValue] = useState([]);
    const [onEdit, setOnEdit] = useState(false);

    const hasRendered = useRef(false);


    useEffect(() => {
        setToggleArr(question['answerElement'] === null ? [] : question['answerElement']);
    }, [])

    useEffect(() => {
        if (toggleArr !== null && toggleArr !== undefined && toggleArr.length > 0) {
            console.log(toggleArr)
            handleChange('answerElement', toggleArr, index)
        }
    }, [toggleArr])

    useEffect(() => {
        multiValue.sort((a, b) => a - b);
        handleChange('value', multiValue, index)
    }, [multiValue])

    return (
        <div className='w-full '>
            {
                activeIndex == 0 ?
                    <div className='flex flex-wrap'>
                        <div className='h-16 bg-sky-400 text-neutral-50 p-2 rounded-xl'>Halaman {sectionIndex}</div>
                    </div>
                    : null
            }

            <div id={'question' + index} key={index} tabIndex="0"
                onClick={() => handleFocus(index)}
                className={`w-full -translate-y-6 pl-5 pr-3 py-3 bg-neutral-50 rounded-xl border border-sky-400 flex-col justify-start items-start gap-5 inline-flex relative cursor cursor-pointer select-none ${focusIndex == index ? 'border-l-4 border-r border-t-8 border-b border-sky-400' : ''}`}
            >
                <label className='h-fit w-full flex text-black text-2xl font-normal relative flex-wrap'>
                    {
                        question.type == "section" ?
                            null :
                            <a className='mt-4'>{index + 1 + '. '}</a>
                    }
                    <ResizableTextArea disabled={isDisabled.edit} type='text' className='w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto' value={question.name} onChange={e => handleChange('name', e.target.value, index)} resize='vertical' />
                    <a hidden={!question.isRequired} className='text-red-500 absolute rigth-[12px]'>*</a>
                </label>
                {
                    !isDisabled.edit ?
                        <button className="absolute right-0 mr-3" onClick={(event) => handleDelete(event, index)}>
                            <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.89432 16C1.89432 17.1 2.79676 18 3.89975 18H11.9215C13.0245 18 13.9269 17.1 13.9269 16V4H1.89432V16ZM14.9296 1H11.4201L10.4174 0H5.40383L4.40111 1H0.891602V3H14.9296V1Z" fill="black" />
                            </svg>
                        </button>
                        : null
                }
                {
                    activeIndex === 1 &&
                    <div className='w-full h-fit'>
                        <ResizableTextArea
                            className='md:w-3/4 sm:w-full min-h-6 bg-neutral-50 rounded-xl border border-black overflow-auto p-4 text-2xl flex-wrap '
                            onChange={e => handleChange('value', e.target.value, index)}
                            placeholder={'Tuliskan sesuatu di sini!'}
                            question={question}
                            index={index}
                            value={question.value || ''}
                            maxLength={(question.setting.maxChar)}
                            resize={"vertical"}
                            disabled={isDisabled.fill}
                        />
                    </div>
                }
                {
                    activeIndex === 2 &&
                    <div className='relative pr-5'>
                        <label>
                            <input type="radio" checked={question.value[0] === 0} onChange={e => handleChange('value', [0], index)} disabled={isDisabled.fill} />
                            <input type="text" value={question['answerElement'] === null ? "" : question['answerElement'][0]} onChange={e => (addToggleElement(e.target.value, 0))} disabled={isDisabled.edit} />
                        </label>
                        <label>
                            <input type="radio" checked={question.value[0] === 1} onChange={e => handleChange('value', [1], index)} disabled={isDisabled.fill} />
                            <input type="text" value={question['answerElement'] === null ? "" : question['answerElement'][1]} onChange={e => (addToggleElement(e.target.value, 1))} disabled={isDisabled.edit} />
                        </label>
                    </div>
                }

                {
                    activeIndex === 3 &&
                    <div className='w-3/4'>
                        {
                            onEdit ?
                                <div>
                                    <ResizableTextArea
                                        className='w-full bg-zinc-300 rounded-[10px] border border-black overflow-auto p-4 text-2xl flex-wrap'
                                        defaultValue={
                                            question['answerElement'] != null ?
                                                question['answerElement'].join('\n')
                                                :
                                                null
                                        }
                                        onBlur={
                                            e => (
                                                handleChange('answerElement',
                                                    textAreaSplitter(e.target.value),
                                                    index),
                                                setOnEdit(!onEdit),
                                                setMultiValue([])
                                            )
                                        }
                                        autoFocus={true}
                                        resize={"vertical"}
                                    />
                                </div>
                                :
                                <div className='flex flex-col gap-2'>
                                    {question['answerElement'] != null &&
                                        question['answerElement'].map((element, elementIndex) =>
                                            <label key={'multi' + elementIndex} className='flex items-center'>
                                                <input
                                                    type={question['setting'].isMultipleSelection ? "checkbox" : "radio"}
                                                    className='hidden'
                                                    disabled={isDisabled.fill}
                                                    onChange={e => {
                                                        e.target.checked ??
                                                            question['value'].some(value => value == elementIndex) ?
                                                            setMultiValue(prev => [...prev, elementIndex])
                                                            :
                                                            setMultiValue(multiValue.filter((i) => i != elementIndex))
                                                    }
                                                    } />
                                                {
                                                    question['value'].some(value => value == elementIndex) ?
                                                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="20.0543" height="20" rx="4" fill="black" />
                                                            <path d="M14.3587 7L7.92459 13.4167L5 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg> :
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#AEAEB2" />
                                                        </svg>
                                                }
                                                <p>{element}</p>
                                            </label>
                                        )
                                    }
                                    {!isDisabled.edit ?
                                        <div>
                                            <button onClick={e => setOnEdit(!onEdit)} className='flex items-center gap-2'>
                                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 7.993C3 7.79409 3.07923 7.60332 3.22027 7.46267C3.3613 7.32202 3.55259 7.243 3.75204 7.243H7.25453V3.75C7.25453 3.55109 7.33376 3.36032 7.4748 3.21967C7.61583 3.07902 7.80712 3 8.00657 3C8.20602 3 8.3973 3.07902 8.53834 3.21967C8.67937 3.36032 8.75861 3.55109 8.75861 3.75V7.243H12.2611C12.4606 7.243 12.6518 7.32202 12.7929 7.46267C12.9339 7.60332 13.0131 7.79409 13.0131 7.993C13.0131 8.19191 12.9339 8.38268 12.7929 8.52333C12.6518 8.66398 12.4606 8.743 12.2611 8.743H8.75861V12.236C8.75861 12.4349 8.67937 12.6257 8.53834 12.7663C8.3973 12.907 8.20602 12.986 8.00657 12.986C7.80712 12.986 7.61583 12.907 7.4748 12.7663C7.33376 12.6257 7.25453 12.4349 7.25453 12.236V8.743H3.75204C3.55259 8.743 3.3613 8.66398 3.22027 8.52333C3.07923 8.38268 3 8.19191 3 7.993Z" fill="black" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.80322 0.258781C6.92415 -0.0862605 10.0738 -0.0862605 13.1947 0.258781C15.0266 0.462781 16.5056 1.90178 16.7202 3.73878C17.0912 6.89578 17.0912 10.0848 16.7202 13.2418C16.5046 15.0788 15.0256 16.5168 13.1947 16.7218C10.0738 17.0668 6.92415 17.0668 3.80322 16.7218C1.97126 16.5168 0.492251 15.0788 0.277669 13.2418C-0.0925563 10.0849 -0.0925563 6.89569 0.277669 3.73878C0.492251 1.90178 1.97226 0.462781 3.80322 0.258781ZM13.0282 1.74878C10.0179 1.41602 6.97997 1.41602 3.96967 1.74878C3.41241 1.81044 2.89226 2.05766 2.49325 2.4505C2.09425 2.84334 1.83969 3.35886 1.77071 3.91378C1.4141 6.95475 1.4141 10.0268 1.77071 13.0678C1.8399 13.6225 2.09455 14.1378 2.49353 14.5305C2.89252 14.9231 3.41256 15.1702 3.96967 15.2318C6.95476 15.5638 10.0431 15.5638 13.0282 15.2318C13.5852 15.17 14.105 14.9228 14.5038 14.5302C14.9025 14.1375 15.157 13.6224 15.2262 13.0678C15.5828 10.0268 15.5828 6.95475 15.2262 3.91378C15.1568 3.35937 14.9022 2.84443 14.5035 2.452C14.1047 2.05958 13.585 1.81256 13.0282 1.75078" fill="black" />
                                                </svg>
                                                Tambah Pilihan
                                            </button>
                                        </div> : null
                                    }

                                </div>
                        }
                    </div>
                }

                {
                    activeIndex === 4 &&
                    <div>
                    </div>
                }

                {
                    activeIndex === 5 &&
                    <div className='relative'>
                        {
                            scaleElement()
                        }
                            <input type='text' value={question['setting']['minInfo']} onChange={e => handleChange("setting.minInfo", e.target.value, index)}></input>
                            <input type='text' value={question['setting']['maxInfo']} onChange={e => handleChange("setting.maxInfo", e.target.value, index)}></input>
                    </div>
                }
            </div>
        </div>
    )
}
export default QuestionContainer;