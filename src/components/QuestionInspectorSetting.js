import './../App';

import ButtonSwitch from './ButtonSwitch';
import Select from 'react-select'

export default function QuestionInspectorSetting(props) {
    const activeIndex = props.index;

    const multiTypeDropdown = [
        { value: '0', label: 'Tidak Terbatas'},
        { value: '1', label: 'Jumlah'},
        { value: '2', label: 'Range'}
    ]

    const scaleSizeDropdown = [
        { value: '0', label: '3'},
        { value: '1', label: '5'},
        { value: '2', label: '7'}
    ]

    const multiTypeDropdownIndex = props.formJson[props.focusIndex].setting.multiTypeDropdown;
    const scaleSizeDropdownIndex = props.formJson[props.focusIndex].setting.scaleSize;

    return (
        <>  
            {/* {
                activeIndex === 1 ?
                <>
                    <ButtonSwitch keyJson='setting.hasMaxChar' formJson={props.formJson} focusIndex={props.focusIndex} handleChange={props.handleChange}>Max Character</ButtonSwitch>
                    {
                        props.formJson[props.focusIndex].setting.hasMaxChar ?
                        <input type='number' className='flex w-full bg-white rounded-md p-1 ' onChange={e => props.handleChange('setting.maxChar', e.target.value, props.focusIndex)}/>
                        : props.formJson[props.focusIndex].setting.maxChar = null
                    } 
                </> : null
            } */}
            
            {
                activeIndex === 2 ?
                <>
                </> : null
            }
            
            {/* {
                activeIndex === 3 ?
                <>
                    <ButtonSwitch keyJson='setting.isRandomize' formJson={props.formJson} focusIndex={props.focusIndex} handleChange={props.handleChange}>Pilihan Acak</ButtonSwitch>
                    <ButtonSwitch keyJson='setting.isMultipleSelection' formJson={props.formJson} focusIndex={props.focusIndex} handleChange={props.handleChange}>Multiple Selection</ButtonSwitch>
                    {
                        props.formJson[props.focusIndex].setting.isMultipleSelection ?
                        <Select options= {multiTypeDropdown} 
                            value= {{
                                value: multiTypeDropdownIndex, 
                                label: 
                                <label>                                
                                    {multiTypeDropdown[multiTypeDropdownIndex].label}
                                </label>
                            }}
                            onChange={e => { props.handleChange('setting.multiTypeDropdown', e.value, props.focusIndex); }}
                            isSearchable={false}
                            className='w-60 bg-neutral-50 rounded-lg shadow border border-sky-400 justify-stretch items-center'
                        /> : null
                    }
                    {
                        props.formJson[props.focusIndex].setting.multiTypeDropdown === '1' && props.formJson[props.focusIndex].setting.isMultipleSelection?
                            <input type='number' className='w-[220px] h-[32.91px] p-2.5 bg-neutral-50 rounded-[10px] border border-black' 
                            onChange={e => {
                                props.handleChange('setting.min', e.target.value, props.focusIndex);
                                props.handleChange('setting.max', e.target.value, props.focusIndex);
                        }}></input>
                        : null
                    } 
                    {
                        props.formJson[props.focusIndex].setting.multiTypeDropdown === '2' && props.formJson[props.focusIndex].setting.isMultipleSelection ?
                        <>
                            <div className='flex flex-row gap-2.5 items-center'>
                                <label className=''>Min</label>
                                <input type='number' className='w-[220px] h-[32.91px] p-2.5 bg-neutral-50 rounded-[10px] border border-black'
                                    onChange={e => {
                                        props.handleChange('setting.min', e.target.value, props.focusIndex);
                                    }} />        
                            </div>
                            <div className='flex flex-row gap-2.5 items-center'>
                                <label className=''>Max</label>
                                <input type='number' className='w-[220px] h-[32.91px] p-2.5 bg-neutral-50 rounded-[10px] border border-black'
                                    onChange={e => {
                                        props.handleChange('setting.max', e.target.value, props.focusIndex);
                                    }} />
                            </div>
                        </> : null
                    } 
                    
                    
                </> : null
            } */}
            
            {/* {
                activeIndex === 4 ?
                <>
                    
                </> : null
            } */}

            {
                activeIndex === 5 ?
                <>
                    <Select options= {scaleSizeDropdown} 
                        value= {{
                            value: scaleSizeDropdownIndex, 
                            label: scaleSizeDropdown[scaleSizeDropdownIndex].label
                        }}
                        onChange={e => { props.handleChange('setting.scaleSize', e.value, props.focusIndex); }}
                        isSearchable={false}
                    />
                </> : null
            }
        </>
        
    )
}