import './../App.css';
import React from 'react';

const ButtonSwitch = (props) => {
    const keyJson = props.keyJson;
    const formJson = props.formJson;
    const question = props.question;
    const focusIndex = props.focusIndex;
    const handleChange = props.handleChange;

    var isChecked = formJson ? formJson[focusIndex] : question;
    const keyJsonItem = keyJson.split('.');
    keyJsonItem.map((k) => (
        isChecked = isChecked[k]
    ))

    return (
        <div className='w-full flex gap-2 items-center relative px-2.5'>
            <div>{props.children}</div>
            <label className='flex cursor-pointer select-none items-center absolute right-2.5'>
                <div className='relative'>
                    <input
                        type='checkbox'
                        checked={isChecked}
                        onChange={() => handleChange(keyJson, !isChecked, focusIndex)}
                        className='sr-only'
                    />
                    <div className={`block h-8 w-14 rounded-full ${isChecked ? 'bg-sky-400' : 'bg-gray-200'}`}></div>
                    <div className={`dot absolute top-1 h-6 w-6 rounded-full bg-white left-1 duration-200 ${isChecked ? 'bg-white translate-x-6' : ''}`}></div>
                </div>
            </label>
        </div>
        )
    }
export default ButtonSwitch;