import { v4 as uuidv4 } from 'uuid';

const qestionTypeValue = {
    'section': 0,
    'text' : 1,
    'toggle' : 2,
    'multi' : 3,
    'rating': 4,
    'scale' : 5 
}

const questionSettingTemplate = {
    1:  {
            hasMaxChar: false,
            maxChar: null
        },
    2: {},
    3 : { 
            isMultipleSelection: true,
            multiTypeDropdown: 0,
            min: null,
            max: null,
            isRandomize: false
        },
    4: {},
    5:  {
            scaleSize: 0
        }
}

const questionJsonTemplate = {
    id: "",
    name: 'Tuliskan Pertanyaan!',
    type: 'text',
    answerElement: null,
    value: null,
    isRequired: false,
    setting: getQuestionSettingTemplate(1)
}

export function getQuestionJsonTemplate(type = 1) {
    const newQuestionJson = questionJsonTemplate;
    newQuestionJson.id = uuidv4();
    newQuestionJson.type = getQuestionType(type);
    newQuestionJson.setting = getQuestionSettingTemplate(type);
    return newQuestionJson;
}
export function getQuestionSettingTemplate(i) {
    return questionSettingTemplate[i];
}

export function getQuestionTypeValue(type) {
    return qestionTypeValue[type];
}

export function getQuestionType(value) {
    for (let key in qestionTypeValue) {
        if (qestionTypeValue[key] === value) return key;
    }
}