// * Filter repository.
import { Button } from "./Button.js";

/**
 * * Rule controls the Filter rules.
 * @export
 * @class Rule
 */
export class Rule{
    /**
     * * Creates an instance of Rule.
     * @param {object} properties - Rule properties.
     * @param {Filter} filter - The Filter.
     * @memberof Rule
     */
    constructor(properties = {
        type: undefined,
        target: undefined,
        comparator: '=',
        value: undefined,
        event: {
            function: undefined,
            params: {
                //
            },
        },
    }, filter = 'filter-id'){
        this.setProperties(properties);
        this.setStates();
        this.setButton(filter);
    }

    /**
     * * Set the Rule properties.
     * @param {object} properties - Rule properties.
     * @memberof Rule
     */
    setProperties(properties = {
        type: undefined,
        target: undefined,
        comparator: '=',
        value: undefined,
        event: {
            function: undefined,
            params: {
                //
            },
        },
    }){
        this.properties = {};
        this.originalProperties = {};
        this.setType(properties);
        this.setTarget(properties);
        this.setComparator(properties);
        this.setValue(properties);
        if(properties.hasOwnProperty('event')){
            this.setEvent(properties);
        }
    }

    /**
     * * Set the Rule states.
     * @memberof Rule
     */
    setStates(){
        this.states = {};
    }

    /**
     * * Set the Rule type.
     * @param {object} properties - Rule properties.
     * @memberof Rule
     */
    setType(properties = {
        type: undefined,
    }){
        if(properties.type){
            this.properties.type = properties.type;
        }else{
            this.properties.type = undefined;
        }
    }

    /**
     * * Set the Rule target.
     * @param {object} properties - Rule properties.
     * @memberof Rule
     */
    setTarget(properties = {
        target: undefined,
    }){
        if(properties.target){
            this.properties.target = properties.target;
        }else{
            this.properties.target = undefined;
        }
    }

    /**
     * * Set the Rule comparator.
     * @param {object} properties - Rule properties.
     * @memberof Rule
     */
    setComparator(properties = {
        comparator: '=',
    }){
        if(properties.comparator){
            this.properties.comparator = properties.comparator;
        }else{
            this.properties.comparator = '=';
        }
    }

    /**
     * * Set the Rule value.
     * @param {object} properties - Rule properties.
     * @memberof Rule
     */
    setValue(properties = {
        value: undefined,
    }){
        if(properties.value){
            this.properties.value = properties.value;
            this.originalProperties.value = properties.value;
        }else{
            this.properties.value = undefined;
            this.originalProperties.value = undefined;
        }
    }

    /**
     * * Set the Rule event executed.
     * @param {object} properties - Rule properties.
     * @memberof Rule
     */
    setEvent(properties = {
        event: {
            function: undefined,
            params: {
                //
            },
        },
    }){
        this.properties.event = properties.event;
    }

    /**
     * * Set the Rule buttons.
     * @memberof Rule
     */
    setButton(filter = 'filter-id'){
        let htmls = Button.getHTML(this.properties.target, this.properties.type);
        this.btns = [];
        for(const html of htmls){
            let btn = new Button({filterId: filter.properties.id}, html, this, filter);
            if(btn.properties.regexp){
                this.properties.regexp = true;
            }
            this.btns.push(btn);
        }
    }

    /**
     * * Check if the data validates.
     * @param {object} status - Filter status.
     * @returns
     * @memberof Rule
     */
    check(status = {
        data: [],
        valid: true,
    }){
        switch(this.properties.type){
            case 'checkbox':
                status = this.checkObjectData(status);
                break;
            case 'search':
                status = this.checkSearchData(status);
                break;
            default:
                if(this.properties.regexp){
                    status = this.checkRegExpData(status);
                }else{   
                    status = this.checkDefaultData(status);
                }
                break;
        }
        return status;
    }

    /**
     * * Reset the Rule.
     * @memberof Rule
     */
    reset(id){
        this.properties.value = this.originalProperties.value;
        for(const btn of this.btns){
            btn.reset(this);
        }
    }

    /**
     * * Comparates the values.
     * @param {*} data_value - Data value.
     * @param {*} rule_value - Rule value.
     * @returns
     * @memberof Rule
     */
    comparateValues(data_value, rule_value = undefined){
        switch(this.properties.comparator){
            case '=':
                if(this.properties.value == data_value){
                    return true;
                }else if(rule_value == data_value && rule_value != undefined){
                    return true;
                }else{
                    return false;
                }
            case '>':
                if(this.properties.value > data_value){
                    return true;
                }else if(rule_value > data_value && rule_value != undefined){
                    return true;
                }else{
                    return false;
                }
            case '<':
                if(this.properties.value < data_value){
                    return true;
                }else if(rule_value < data_value && rule_value != undefined){
                    return true;
                }else{
                    return false;
                }
        }
    }

    /**
     * * Change the Rule value.
     * @param {string} name - Button name.
     * @param {string} inputName - <input> name.
     * @memberof Rule
     */
    changeValue(name = undefined, inputName = undefined){
        for(const btn of this.btns){
            if(btn.properties.name == name){
                switch(btn.type){
                    case 'search':
                        if(btn.html.value){
                            this.properties.value = btn.html.value;
                        }else{
                            this.properties.value = undefined;
                        }
                        break;
                    case 'checkbox':
                        if(this.properties.value && this.properties.value.length){
                            let push = true, index;
                            for(const key in this.properties.value){
                                if(this.properties.value.hasOwnProperty(key)){
                                    const element = this.properties.value[key];
                                    const forValue = element[[inputName]];
                                    if(btn.properties.value == forValue){
                                        push = false;
                                        index = key;
                                    }
                                }
                            }
                            if(push){
                                this.properties.value.push({[inputName]: btn.properties.value});
                            }else{ 
                                this.properties.value.splice(index, 1);
                            }
                        }else{
                            this.properties.value = [];
                            this.properties.value.push({[inputName]: btn.properties.value});
                        }
                        if(!this.properties.value.length){
                            this.properties.value = undefined;
                        }
                        break;
                    case 'select':
                        if(btn.html.value){
                            this.properties.value = btn.html.value;
                        }else{
                            this.properties.value = undefined;
                        }
                        break;
                    default:
                        if(btn.html.value){
                            this.properties.value = btn.html.value;
                        }else{
                            this.properties.value = undefined;
                        }
                        break;
                }
            }
        }
    }

    /**
     * * Set the Button active state.
     * @param {*} btnClicked
     * @memberof Rule
     */
    setActiveState(btnClicked){
        this.removeActiveState();
        btnClicked.classList.add('active');
        this.states.active.push(btnClicked);
    }

    /**
     * * Remove the Button active state.
     * @memberof Rule
     */
    removeActiveState(){
        for(const btn of this.btns){
            if(btn.html.classList.contains('active')){
                btn.html.classList.remove('active');
            }
            if(this.states.active.length){
                let index; 
                for(const key in this.states.active){
                    if(this.states.active.hasOwnProperty(key)){
                        const active = this.states.active[key];
                        if(btn == active){
                            index = key;
                        }
                    }
                }
                this.states.active.splice(index, 1);
            }
        }
    }

    /**
     * * Check if the data validates and push it.
     * @param {object} status - Filter status.
     * @returns
     * @memberof Rule
     */
    checkDefaultData(status = {
        data: {},
        valid: true,
    }){
        if(status.data.hasOwnProperty(this.properties.target)){
            let value = status.data[this.properties.target];
            if(this.properties.value != undefined){
                if(this.comparateValues(value)){
                    status.valid = true;
                }else{
                    status.valid = false;
                }
            }else{
                status.valid = true;
            }
        }else{
            status.valid = false;
        }
        return status;
    }

    /**
     * * Check if the data to for validates like a RegExp and push it.
     * @param {object} status - Filter status.
     * @returns
     * @memberof Rule
     */
    checkRegExpData(status = {
        data: {},
        valid: true,
    }){
        if(status.data.hasOwnProperty(this.properties.target)){
            const value = status.data[this.properties.target];
            let regexp = new RegExp(this.properties.value);
            if(regexp.exec(value)){
                status.valid = true;
            }else{
                status.valid = false;
            }
        }else{
            status.valid = false;
        }
        return status;
    }

    checkSearchData(status = {
        data: {},
        valid: true,
    }){
        let found = false;
        if(this.properties.value){
            let targetToFor = this.properties.target.split(',');
            for (const target of targetToFor) {
                if(!found){
                    if(status.data.hasOwnProperty(target)){
                        const value = status.data[target];
                        let regexp = new RegExp(this.properties.value.toLowerCase());
                        if(regexp.exec(String(value).toLowerCase())){
                            status.valid = true;
                            found = true;
                        }else{
                            status.valid = false;
                        }
                    }else{
                        status.valid = false;
                    }
                }
            }
        }else{
            status.valid = true;
        }
        return status;
    }

    /**
     * * Check if the data validates with a object and push it.
     * @param {object} status - Filter status.
     * @memberof Rule
     */
    checkObjectData(status = {
        data: {},
        valid: true,
    }){
        let index = 0;
        let auxArray = [];
        if(typeof this.properties.value == 'object'){
            for(const rule_element of this.properties.value){
                index++;
                auxArray[index] = null;
                if(auxArray[index] || auxArray[index] == null){
                    for(const rule_key in rule_element){
                        if(rule_element.hasOwnProperty(rule_key)){
                            const rule_value = rule_element[rule_key];
                            if(status.data.hasOwnProperty(this.properties.target)){
                                let elementByTarget = status.data[this.properties.target];
                                for(const data_element of elementByTarget){
                                    if(data_element.hasOwnProperty(rule_key)){
                                        const data_value = data_element[rule_key];
                                        if(this.comparateValues(data_value, rule_value)){
                                            auxArray[index] = true;
                                            break;
                                        }else{
                                            auxArray[index] = false;
                                        }
                                    }
                                }
                            }else{
                                auxArray[index] = false;
                            }
                        }
                    }
                }
            }
            status.valid = true;
            for (const aux of auxArray) {
                if(aux != undefined){
                    if(!aux){
                        status.valid = false;
                    }
                }
            }
        }
        return status;
    }
    
    checkCorrectObjectData(rule, dataToFor){
        let spliceElements = [];
        for(const rule_key in rule){
            if(rule.hasOwnProperty(rule_key)){
                const rule_value = rule[rule_key];
                let index = 0;
                for(const data of dataToFor){
                    if(data.hasOwnProperty(this.properties.target)){
                        let splice = true;
                        let elementByTarget = data[this.properties.target];
                        for(const data_element of elementByTarget){
                            if(data_element.hasOwnProperty(rule_key)){
                                const data_value = data_element[rule_key];
                                if(this.comparateValues(data_value, rule_value)){
                                    splice = false;
                                }
                            }
                        }
                        if(splice){
                            spliceElements.push(index);
                        }
                        index++;
                    }
                }
            }
        }
        let auxData = [];
        for(const position in dataToFor){
            if(dataToFor.hasOwnProperty(position)){
                const data = dataToFor[position];
                if(spliceElements.length){
                    let push = true;
                    for(const index of spliceElements){
                        if(index == position){
                            push = false;
                        }
                    }
                    if(push){
                        auxData.push(data);
                    }
                }else{
                    auxData.push(data);
                }
            }
        }
        return auxData;
    }
}