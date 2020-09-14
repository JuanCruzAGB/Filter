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
     * @param {string} filterId - Filter ID.
     * @memberof Rule
     */
    constructor(properties = {
        target: undefined,
        comparator: '=',
        value: undefined,
    }, filterId = 'filter-id'){
        this.setProperties(properties);
        this.setStates();
        this.setButton(filterId);
    }

    /**
     * * Set the Rule properties.
     * @param {object} properties - Rule properties.
     * @memberof Rule
     */
    setProperties(properties = {
        target: undefined,
        comparator: '=',
        value: undefined,
    }){
        this.properties = {};
        this.originalProperties = {};
        this.setTarget(properties);
        this.setComparator(properties);
        this.setValue(properties);
    }

    setStates(){
        this.states = {};
        this.setActive();
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

    setActive(){
        this.states.active = [];
    }

    /**
     * * Set the Rule buttons.
     * @memberof Rule
     */
    setButton(filterId = 'filter-id'){
        let htmls = Button.getHTML(this.properties.target);
        this.btns = [];
        for(const html of htmls){
            let btn = new Button({filterId: filterId}, html, this);
            if(btn.properties.regexp){
                this.properties.regexp = true;
            }
            this.btns.push(btn);
        }
    }

    /**
     * * Check if the data to for validates.
     * @param {object} dataToFor - Data to for.
     * @returns
     * @memberof Rule
     */
    check(dataToFor){
        this.data = [];
        this.checkType(dataToFor);
        return this.data;
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
                }else if(rule_value == data_value){
                    return true;
                }else{
                    return false;
                }
            case '>':
                if(this.properties.value > data_value){
                    return true;
                }else if(rule_value > data_value){
                    return true;
                }else{
                    return false;
                }
            case '<':
                if(this.properties.value < data_value){
                    return true;
                }else if(rule_value < data_value){
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
     * * Check the Filter value type.
     * @param {object} dataToFor - Data to for.
     * @memberof Rule
     */
    checkType(dataToFor){
        switch(typeof this.properties.value){
            case 'object':
                this.checkObjectData(dataToFor);
                break;
            default:
                if(this.properties.regexp){
                    this.checkRegExpData(dataToFor);
                }else{   
                    this.checkDefaultData(dataToFor);
                }
                break;
        }
    }

    /**
     * * Check if the data to for validates and push it.
     * @param {object} dataToFor - Data to for.
     * @memberof Rule
     */
    checkDefaultData(dataToFor){
        for(const data of dataToFor){
            if(data.hasOwnProperty(this.properties.target)){
                let value = data[this.properties.target];
                if(this.properties.value != undefined){
                    if(this.comparateValues(value)){
                        this.data.push(data);
                    }
                }else{
                    this.data.push(data);
                }
            }
        }
    }

    /**
     * * Check if the data to for validates like a RegExp and push it.
     * @param {object} dataToFor - Data to for.
     * @memberof Rule
     */
    checkRegExpData(dataToFor){
        for(const data of dataToFor){
            if(data.hasOwnProperty(this.properties.target)){
                const value = data[this.properties.target];
                let regexp = new RegExp(this.properties.value);
                if(regexp.exec(value)){
                    this.data.push(data);
                }
            }
        }
    }

    /**
     * * Check if the data to for validates with a object and push it.
     * @param {object} dataToFor - Data to for.
     * @memberof Rule
     */
    checkObjectData(dataToFor){
        let auxData = [];
        let index = 0;
        for(const rule_element of this.properties.value){
            for(const rule_key in rule_element){
                if(rule_element.hasOwnProperty(rule_key)){
                    index++;
                    const rule_value = rule_element[rule_key];
                    for(const data of dataToFor){
                        if(data.hasOwnProperty(this.properties.target)){
                            let elementByTarget = data[this.properties.target];
                            for(const data_element of elementByTarget){
                                if(data_element.hasOwnProperty(rule_key)){
                                    const data_value = data_element[rule_key];
                                    if(this.comparateValues(data_value, rule_value)){
                                        if(auxData.indexOf(data) === -1 && index == 1){
                                            auxData.push(data);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.data = this.checkCorrectObjectData(rule_element, auxData);
                }
            }
        }
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
    
    checkActive(btnClicked){
        let found = false;
        if(this.states.active.length){
            for(const key in this.states.active){
                if(this.states.active.hasOwnProperty(key)){
                    const active = this.states.active[key];
                    if(btnClicked == active){
                        found = true;
                    }
                }
            }
        }
        return found;
    }
}