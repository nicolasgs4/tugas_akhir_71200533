import './../App.css';
import ButtonSwitch from './ButtonSwitch';
import Select from 'react-select'
import { getQuestionSettingTemplate, getQuestionTypeValue } from '../data/QuestionData';
import QuestionInspectorSetting from './QuestionInspectorSetting';
import Popup from 'reactjs-popup';
import { PublishPopup } from '../pages/PublishPopup';
import { useState } from 'react';


function QuestionInspector({ formJson, focusIndex, handleChange, setIsDisabled }) {
    const questionTypeDropdown = [
        { value: 'text', label: 'Isian'},
        { value: 'toggle', label: 'Ya/Tidak'},
        { value: 'multi', label: 'Pilihan'},
        { value: 'rating', label: 'Rating'},
        { value: 'scale', label: 'Skala'}
    ]

    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    return (
        <div className='h-full fixed w-1/4 items-start inline-flex'> 
            <div className='h-full w-full pt-[30px] pb-[60px] bg-neutral-50 border border-sky-400 flex-col justify-start items-center gap-[30px] inline-flex'>
                <div className="justify-start items-start gap-5 inline-flex">
                    <button className="w-[120px] h-[60px] relative" onClick={() => setIsDisabled({ edit: true, fill: true })}>
                        <div className="w-[120px] h-[60px] left-0 top-0 absolute bg-white rounded-[10px] border border-black" />
                        <div className="left-[20px] top-[16px] absolute text-center text-neutral-800 text-2xl font-normal">Preview</div>
                    </button>
                    <button className="w-[120px] h-[60px] relative" onClick={() => setOpen(prev => !prev)}>
                        <div className="w-[120px] h-[60px] left-0 top-0 absolute bg-stone-900 rounded-[10px] border border-black" />
                        <div className="left-[23px] top-[16px] absolute text-center text-neutral-50 text-2xl font-normal">Publish</div>
                    </button>
                    <Popup
                        modal
                        position={'center center'}
                        lockScroll={true}
                        closeOnDocumentClick={false}
                        open={open}
                    >
                        <PublishPopup closeModal={closeModal}/>
                    </Popup>
                    
                </div>
                <div className="text-neutral-900 text-2xl font-normal font-['Segoe UI']">Detail</div>
                <div className="w-[250px] h-[1.10px] bg-sky-400" />
                {
                    formJson[focusIndex] && formJson[focusIndex].type != "section"?
                        <>
                            {/* <div className='text-neutral-900 text-2xl font-normal'>Nama</div>
                            <div className="w-[250px] h-[1.10px] bg-sky-400" />
                            <input type='text' className='flex w-full bg-white rounded-md p-1 ' value={formJson[focusIndex].name} onChange={e => handleChange('name', e.target.value, focusIndex)}></input> */}
                            
                            <div className=''>
                                <div className="text-neutral-900 text-lg font-normal font-['Segoe UI'] ">Jenis Pertanyaan</div>
                                <Select options={
                                    questionTypeDropdown
                                    }
                                    value={{
                                        value: formJson[focusIndex].type,
                                        label: questionTypeDropdown[questionTypeDropdown.findIndex(item => item.value === formJson[focusIndex].type)].label
                                    }}
                                    onChange={e => {
                                        handleChange('type', e.value, focusIndex);
                                        handleChange('setting', getQuestionSettingTemplate(getQuestionTypeValue(e.value)), focusIndex);
                                        handleChange('answerElement', null, focusIndex);
                                    }}
                                    isSearchable={false}
                                    className='w-60 bg-neutral-50 rounded-lg shadow border border-sky-400 justify-stretch items-center'
                                />
                            </div>
                            <div className="w-[250px] h-[1.10px] bg-sky-400" />

                            <div className="text-zinc-900 text-xl font-normal font-['Segoe UI']">Pengaturan</div>

                            <ButtonSwitch keyJson='isRequired' formJson={formJson} focusIndex={focusIndex} handleChange={handleChange}>Required</ButtonSwitch>
                            <div className="">Jumlah Skala : </div>
                            <QuestionInspectorSetting index={getQuestionTypeValue(formJson[focusIndex].type)} formJson={formJson} focusIndex={focusIndex} handleChange={handleChange} />
                        </> 
                        :
                        <div className='align-middle'>Pertanyaan tidak ada yang dipilih</div>
                }
            </div>
        </div>
    )
}
export default QuestionInspector;