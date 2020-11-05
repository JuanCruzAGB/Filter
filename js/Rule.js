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
     * @param {Object} properties Rules Properties.
     * @param {String} properties.type Type of Rule.
     * @param {String} properties.target Rule target.
     * @param {String} properties.comparator Type of comparation.
     * @param {*} properties.value Rule default Value.
     * @param {Filter} filter Parent Filter.
     * @memberof Rule
     */
    constructor(properties = {
        type: undefined,
        target: undefined,
        comparator: '=',
        value: undefined,
    }, filter = undefined){
        this.setProperties(properties);
        this.setStates();
        this.setButton(filter);
    }

    /**
     * * Set the Rule properties.
     * @param {Object} properties Rules Properties.
     * @param {String} properties.type Type of Rule.
     * @param {String} properties.target Rule target.
     * @param {String} properties.comparator Type of comparation.
     * @param {*} properties.value Rule default Value.
     * @memberof Rule
     */
    setProperties(properties = {
        type: undefined,
        target: undefined,
        comparator: '=',
        value: undefined,
    }){
        this.properties = {};
        this.originalProperties = {};
        this.setType(properties);
        this.setTarget(properties);
        this.setComparator(properties);
        this.setValue(properties);
    }

    /**
     * * Returns the Rule properties.
     * @returns {Object} The Rule properties.
     * @memberof Rule
     */
    getProperties(){
        return this.properties;
    }

    /**
     * * Set the Rule states.
     * @memberof Rule
     */
    setStates(){
        this.states = {};
    }

    /**
     * * Returns the Rule states.
     * @returns {Object} The Rule states.
     * @memberof Rule
     */
    getStates(){
        return this.states;
    }

    /**
     * * Set the Rule type.
     * @param {Object} properties Rules Properties.
     * @param {String} properties.type Type of Rule.
     * @memberof Rule
     */
    setType(properties = {
        type: undefined,
    }){
        if (properties.hasOwnProperty('type')) {
            this.properties.type = properties.type;
        } else {
            this.properties.type = undefined;
        }
    }

    /**
     * * Returns the Rule type.
     * @returns {String} The Rule type.
     * @memberof Rule
     */
    getType(){
        return this.properties.type;
    }

    /**
     * * Set the Rule target.
     * @param {Object} properties Rules Properties.
     * @param {String} properties.target Rule target.
     * @memberof Rule
     */
    setTarget(properties = {
        target: undefined,
    }){
        if (properties.hasOwnProperty('target')) {
            this.properties.target = properties.target;
        } else {
            this.properties.target = undefined;
        }
    }

    /**
     * * Returns the Rule target.
     * @returns {String} The Rule target.
     * @memberof Rule
     */
    getTarget(){
        return this.properties.target;
    }

    /**
     * * Set the Rule comparator.
     * @param {Object} properties Rules Properties.
     * @param {String} properties.comparator Type of comparation.
     * @memberof Rule
     */
    setComparator(properties = {
        comparator: '=',
    }){
        if (properties.hasOwnProperty('comparator')) {
            this.properties.comparator = properties.comparator;
        } else {
            this.properties.comparator = '=';
        }
    }

    /**
     * * Returns the Rule comparator.
     * @returns {String} The Type of comparation.
     * @memberof Rule
     */
    getComparator(){
        return this.properties.comparator;
    }

    /**
     * * Set the Rule value.
     * @param {Object} properties Rules Properties.
     * @param {*} properties.value Rule default Value.
     * @memberof Rule
     */
    setValue(properties = {
        value: undefined,
    }){
        if (properties.hasOwnProperty('value')) {
            this.properties.value = properties.value;
            this.originalProperties.value = properties.value;
        } else {
            this.properties.value = undefined;
            this.originalProperties.value = undefined;
        }
    }

    /**
     * * Returns the Rule value.
     * @returns {*} The Rule value.
     * @memberof Rule
     */
    getValue(){
        return this.properties.value;
    }

    /**
     * * Set the Rule buttons.
     * @param {Filter} filter Parent Filter.
     * @memberof Rule
     */
    setButton(filter = undefined){
        this.btns = Button.getHTML(this.getTarget(), this.getType(), this, filter);
        for(const btn of this.btns){
            if(btn.properties.regexp){
                this.properties.regexp = true;
            }
        }
    }

    /**
     * * Returns the Rule buttons.
     * @returns {Button[]} The Rule buttons.
     * @memberof Rule
     */
    getButton(){
        return this.properties.btns;
    }

    /**
     * * Returns the Rule RegExp.
     * @returns {RegExp} The Rule "Is there a RegExp?" boolean.
     * @memberof Rule
     */
    getRegExp(){
        return this.properties.regexp;
    }

    /**
     * * Check if the data validates.
     * @param {Object} status Filter status.
     * @param {Array} status.data Data filtered.
     * @param {Boolean} status.valid If the filtration is valid or not.
     * @returns {Object} The status.
     * @memberof Rule
     */
    check(status = {
        data: [],
        valid: true,
    }){
        switch(this.getType()){
            case 'checkbox':
                status = this.checkObjectData(status);
                break;
            case 'search':
                status = this.checkSearchData(status);
                break;
            default:
                if(this.getRegExp()){
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
    reset(){
        this.properties.value = this.originalProperties.value;
        for(const btn of this.btns){
            btn.reset(this);
        }
    }

    /**
     * * Comparates the values.
     * @param {*} data_value Data value to comparate.
     * @param {*} rule_value Rule value to comparate.
     * @returns {Boolean} If the comparation is true or false.
     * @memberof Rule
     */
    comparateValues(data_value, rule_value = undefined){
        switch(this.getComparator()){
            case '=':
                if(this.getValue() == data_value){
                    return true;
                }else if(rule_value == data_value && rule_value != undefined){
                    return true;
                }else{
                    return false;
                }
            case '>':
                if(this.getValue() > data_value){
                    return true;
                }else if(rule_value > data_value && rule_value != undefined){
                    return true;
                }else{
                    return false;
                }
            case '<':
                if(this.getValue() < data_value){
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
     * @param {String} name Button name.
     * @param {String} inputName <input> name.
     * @memberof Rule
     */
    changeValue(name = undefined, inputName = undefined){
        for(const btn of this.btns){
            if(btn.getName() == name){
                switch(btn.getType()){
                    case 'search':
                        if(btn.getHTML().value){
                            this.properties.value = btn.getHTML().value;
                        }else{
                            this.properties.value = undefined;
                        }
                        break;
                    case 'checkbox':
                        if(this.getValue() && this.getValue().length){
                            let push = true, index;
                            for(const key in this.properties.value){
                                if(this.getValue().hasOwnProperty(key)){
                                    const element = this.getValue()[key];
                                    const forValue = element[[inputName]];
                                    if(btn.getValue() == forValue){
                                        push = false;
                                        index = key;
                                    }
                                }
                            }
                            if(push){
                                this.properties.value.push({[inputName]: btn.getValue()});
                            }else{ 
                                this.properties.value.splice(index, 1);
                            }
                        }else{
                            this.properties.value = [];
                            this.properties.value.push({[inputName]: btn.getValue()});
                        }
                        if(!this.getValue().length){
                            this.properties.value = undefined;
                        }
                        break;
                    case 'select':
                        if(btn.getHTML().value){
                            this.properties.value = btn.getHTML().value;
                        }else{
                            this.properties.value = undefined;
                        }
                        break;
                    default:
                        if(btn.getHTML().value){
                            this.properties.value = btn.getHTML().value;
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
     * @param {HTMLElement} btnClicked Button clicked HTML Element.
     * @memberof Rule
     */
    setActiveState(btnClicked){
        this.removeActiveState();
        btnClicked.classList.add('active');
        if(!this.states.hasOwnProperty('active')){
            this.states.active = [];
        }
        this.states.active.push(btnClicked);
    }

    /**
     * * Remove the Button active state.
     * @memberof Rule
     */
    removeActiveState(){
        for(const btn of this.btns){
            if(btn.getHTML().classList.contains('active')){
                btn.getHTML().classList.remove('active');
            }
            if(this.states.hasOwnProperty('active') && this.states.active.length){
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
     * @param {Object} status Filter status.
     * @param {Array} status.data Data filtered.
     * @param {Boolean} status.valid If the filtration is valid or not.
     * @returns {Object} The status.
     * @memberof Rule
     */
    checkDefaultData(status = {
        data: {},
        valid: true,
    }){
        if(status.data.hasOwnProperty(this.getTarget())){
            let value = status.data[this.getTarget()];
            if(this.getValue() != undefined){
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
     * * Check if the "Data to for" validates like a RegExp and push it.
     * @param {Object} status Filter status.
     * @param {Array} status.data Data filtered.
     * @param {Boolean} status.valid If the filtration is valid or not.
     * @returns {Object} The status.
     * @memberof Rule
     */
    checkRegExpData(status = {
        data: {},
        valid: true,
    }){
        if(status.data.hasOwnProperty(this.getTarget())){
            const value = status.data[this.getTarget()];
            let regexp = new RegExp(this.getValue());
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

    /**
     * * Check if the data validates and push it.
     * @param {Object} status Filter status.
     * @param {Array} status.data Data filtered.
     * @param {Boolean} status.valid If the filtration is valid or not.
     * @returns {Object} The status.
     * @memberof Rule
     */
    checkSearchData(status = {
        data: {},
        valid: true,
    }){
        let found = false;
        if (this.getValue()) {
            let targetToFor = this.getTarget().split(',');
            for (const target of targetToFor) {
                if(!found){
                    if (status.data.hasOwnProperty(target)) {
                        const value = status.data[target];
                        let regexp = new RegExp(this.getValue().toLowerCase());
                        if (regexp.exec(String(value).toLowerCase())) {
                            status.valid = true;
                            found = true;
                        } else {
                            status.valid = false;
                        }
                    } else if (/:/.exec(target)) {
                        let element = target.split(':')[0];
                        let column = target.split(':')[1];
                        if (status.data.hasOwnProperty(element)) {
                            if (status.data[element].hasOwnProperty(column)) {
                                const value = status.data[element][column];
                                let regexp = new RegExp(this.getValue().toLowerCase());
                                if (regexp.exec(String(value).toLowerCase())) {
                                    status.valid = true;
                                    found = true;
                                } else {
                                    status.valid = false;
                                }
                            } else {
                                status.valid = false;
                            }
                        } else {
                            status.valid = false;
                        }
                    } else {
                        status.valid = false;
                    }
                }
            }
        } else {
            status.valid = true;
        }
        return status;
    }

    /**
     * * Check if the data validates with a object and push it.
     * @param {Object} status Filter status.
     * @param {Array} status.data Data filtered.
     * @param {Boolean} status.valid If the filtration is valid or not.
     * @returns {Object} The status.
     * @memberof Rule
     */
    checkObjectData(status = {
        data: {},
        valid: true,
    }){
        let index = 0;
        let auxArray = [];
        if(typeof this.getValue() == 'object'){
            for(const rule_element of this.getValue()){
                index++;
                auxArray[index] = null;
                if(auxArray[index] || auxArray[index] == null){
                    for(const rule_key in rule_element){
                        if(rule_element.hasOwnProperty(rule_key)){
                            const rule_value = rule_element[rule_key];
                            if(status.data.hasOwnProperty(this.getTarget())){
                                let elementByTarget = status.data[this.getTarget()];
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
}