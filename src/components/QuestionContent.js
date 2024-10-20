import { useRef } from 'react';
import './../App.css';
import QuestionContainer from './QuestionContainer';
import ResizableTextArea from './ResizableTextArea';

function QuestionContent({formDetail, formJson, setFormJson, focusIndex, setFocusIndex, handleDetailChange, handleChange, handleFocus, isDisabled}) {
    let sectionIndex = 0;

    const handleDelete = (event, index) => {
        if (focusIndex === index) setFocusIndex(null);
        if (focusIndex > index) setFocusIndex(focusIndex - 1);
        setFormJson(prev => (prev.filter((_, i) => i !== index)));
        event.stopPropagation();
    }

    const handleReplace = (question, index) => {
        setFormJson(prev => [
            ...prev.slice(0, index),
            question,
            ...prev.slice(index+1)
        ]);
    }
    return (
        <div className='h-full flex flex-col items-center gap-8 py-4 px-8'>
            <div className='w-full flex flex-wrap'>
                <div className='h-16 bg-sky-400 text-neutral-50 p-2 rounded-xl'>Judul Kuesioner</div>
                <div
                    id={'title'}
                    onClick={() => !isDisabled.edit ? handleFocus("title") : null}
                    className={`w-full pl-5 pr-3 py-3 -translate-y-6 bg-neutral-50 rounded-xl border border-sky-400 flex-col justify-start items-start gap-5 inline-flex relative cursor cursor-pointer select-none ${focusIndex == "title" ? 'border-l-4 border-r border-t-8 border-b border-sky-400' : ''}`}>
                    <label className='h-fit w-full flex text-black text-2xl font-normal relative flex-wrap'>
                        <ResizableTextArea type='text' className='w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto'
                            value={formDetail.formTitle || ""}
                            placeholder="Tuliskan Judul Kuisioner"
                            onChange={e => handleDetailChange('formTitle', e.target.value)} resize='vertical'
                            disabled={isDisabled.edit}
                        />
                        {   
                            (!isDisabled.edit || (!isDisabled.fill && formDetail.formDescription != "")) &&
                            <ResizableTextArea placeholder="Deskripsi Kuesioner (opsional)" type='text' className='w-3/4 bg-neutral-50 pt-4 px-2 flex-wrap overflow-auto'
                                value={formDetail.formDescription}
                                onChange={e => handleDetailChange('formDescription', e.target.value)} resize='vertical'
                                disabled={isDisabled.edit}
                            />
                        }
                    </label>
                </div>
            </div>
            
            {formJson.length > 0 ?
                formJson.map((item, index) => (
                    item.type === "section" && (sectionIndex += 1),
                    <QuestionContainer
                        key={"item" + index}
                        sectionIndex={sectionIndex}
                        question={item}
                        index={index}
                        handleChange={handleChange}
                        handleDelete={handleDelete}
                        focusIndex={focusIndex}
                        handleFocus={handleFocus}
                        isDisabled={isDisabled}
                        >
                    </QuestionContainer>
            )) : null
        } 
        </div>
    )
}
export default QuestionContent;