// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js"

// ? Filter repository.
import Control from "./Control.js";

/**
 * * Rule controls the Filter rules.
 * @export
 * @class Rule
 * @author Juan Cruz Armentia <juancamentia@Gmail.com>
 * @extends Class
 */
export class Rule extends  Class {
    /**
     * * Creates an instance of Rule. 
     * @param {object} [props] Rules properties:
     * @param {string} [props.id='rule-1'] Rule primary key.
     * @param {string} [props.target=false] Rule target.
     * @param {string} [props.comparator='==='] Type of comparation.
     * @param {*} [props.value=null] Rule default Value.
     * @param {boolean} [props.strict=true] If the comparation should be strict.
     * @param {Filter} filter Parent Filter.
     * @memberof Rule
     */
    constructor (props = {
        id: 'rule-1',
        target: false,
        comparator: '===',
        value: null,
        strict: true,
    }, filter) {
        super({ ...Rule.props, ...props });
        this.setProps('original', { ...this.props });
        this.setControl(filter);
    }

    /**
     * * Set the Rule buttons.
     * @param {Filter} filter Parent Filter.
     * @memberof Rule
     */
    setControl(filter) {
        this.control = Control.generate(this, filter);
    }

    /**
     * * Saves & returns the Rule value.
     * @returns {*}
     * @memberof Rule
     */
    getValue () {
        this.setProps('value', this.control.props.value);
        return this.props.value;
    }

    /**
     * * Check if the data validates.
     * @param {object} [status] Filter status:
     * @param {object} [status.data] Data filtered.
     * @param {boolean} [status.valid=true] If the filtration is valid or not.
     * @returns {object} The status.
     * @memberof Rule
     */
    check (status = {
        data: {},
        valid: true,
    }) {
        if (this.getValue() !== null) {
            for (const value of this.props.value) {
                if (status.valid) {
                    if (/\./.exec(this.props.target)) {
                        status.valid = this.checkLevels(status.data, value);
                    }
                    if (!/\./.exec(this.props.target)) {
                        if (typeof this.props.target === 'object') {
                            status.valid = false;
                            for (const target of this.props.target) {
                                if (status.data.hasOwnProperty(target)) {
                                    let statusValue = status.data[target];
                                    if (this.comparate(statusValue, value)) {
                                        status.valid = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (typeof this.props.target !== 'object') {
                            if (status.data.hasOwnProperty(this.props.target)) {
                                let statusValue = status.data[this.props.target];
                                if (!this.comparate(statusValue, value)) {
                                    status.valid = false;
                                }
                            }
                            if (!status.data.hasOwnProperty(this.props.target)) {
                                status.valid = false;
                            }
                        }
                    }
                }
            }
        }
        return status;
    }

    /**
     * * Check the coincidence from data levels.
     * @param {object} data Original data.
     * @returns {boolean}
     * @memberof Rule
     */
    checkLevels (data, value) {
        let found = true, levels = this.props.target.split('.'), statusValue = data;
        levels: for (const name of levels) {
            if (/\:/.exec(name)) {
                statusValue = this.parseArray(statusValue, name);
                if (statusValue) {
                    continue;
                }
            }
            if (!/\:/.exec(name)) {
                if (statusValue.length) {
                    let array = [];
                    array: for (const element of statusValue) {
                        if (element.hasOwnProperty(name)) {
                            array.push(element[name]);
                        }
                    }
                    statusValue = array;
                    continue;
                }
                if (!statusValue.length) {
                    if (statusValue.hasOwnProperty(name)) {
                        statusValue = statusValue[name];
                        continue;
                    }
                }
            }
            found = false;
            break;
        }
        if (found) {
            if (statusValue.length) {
                for (const element of statusValue) {
                    if (!this.comparate(element, value)) {
                        found = false;
                        continue;
                    }
                    if (!this.props.strict) {
                        found = true;
                    }
                }
                if (found) {
                    return true;
                }
                return false;
            }
            if (!statusValue.length) {
                if (!this.comparate(statusValue, value)) {
                    return false;
                }
            }
            return true;
        }
        if (!found) {
            return false;
        }
    }

    /**
     * * Comparates the values.
     * @param {*} statusValue Value to comparate.
     * @param {*} value Value to be comparated.
     * @returns {boolean} If the comparation is true or false.
     * @memberof Rule
     */
    comparate (statusValue, value) {
        if (typeof statusValue === 'number') {
            statusValue = statusValue + "";
        }
        if (typeof statusValue === 'string') {
            statusValue = statusValue.toUpperCase();
        }
        if (typeof value === 'number') {
            value = value + "";
        }
        if (typeof value === 'string') {
            value = value.toUpperCase();
        }
        if (typeof value === 'object') {
            if (new RegExp(value.regex.toUpperCase()).exec(statusValue)) {
                return true;
            }
            return false;
        }
        switch (this.props.comparator) {
            case '!=':
                if (statusValue != value) {
                    return true;
                }
                return false;
            case '!==':
                if (statusValue !== value) {
                    return true;
                }
                return false;
            case '==':
                if (statusValue == value) {
                    return true;
                }
                return false;
            case '===':
                if (statusValue === value) {
                    return true;
                }
                return false;
            case '>=':
                if (statusValue >= value) {
                    return true;
                }
                return false;
            case '<=':
                if (statusValue <= value) {
                    return true;
                }
                return false;
            default:
                return false;
        }
    }

    /**
     * * Parse & finds an array data.
     * @param {object} data Data to for.
     * @param {string} string Data to search.
     * @returns {*}
     * @memberof Rule
     */
    parseArray (data, string) {
        let name = string.split(':')[0];
        let position = string.split(':')[1];
        let array = [];
        if (data.length) {
            for (const element of data) {
                if (element.hasOwnProperty(name)) {
                    element = element[name];
                    if (/\*/.exec(position)) {
                        for (const key in element) {
                            if (Object.hasOwnProperty.call(element, key)) {
                                array.push(element[key]);
                            }
                        }
                    }
                    if (/\[/.exec(position)) {
                        position = position.split('[')[1].split(']')[0];
                        if (/\,/.exec(position)) {
                            position = position.split(',');
                            for (const index of position) {
                                for (const key in element) {
                                    if (Object.hasOwnProperty.call(element, key)) {
                                        if (parseInt(key) === parseInt(index)) {
                                            array.push(element[key]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (/[0-9]/.exec(position)) {
                        position = parseInt(position);
                        for (const key in element) {
                            if (Object.hasOwnProperty.call(element, key) && parseInt(key) === position) {
                                array = element[key];
                            }
                        }
                    }
                }
            }
            return array;
        }
        if (!data.length) {
            if (data.hasOwnProperty(name)) {
                data = data[name];
                if (/\*/.exec(position)) {
                    for (const key in data) {
                        if (Object.hasOwnProperty.call(data, key)) {
                            array.push(data[key]);
                        }
                    }
                    return array;
                }
                if (/\[/.exec(position)) {
                    position = position.split('[')[1].split(']')[0];
                    if (/\,/.exec(position)) {
                        position = position.split(',');
                        for (const index of position) {
                            for (const key in data) {
                                if (Object.hasOwnProperty.call(data, key)) {
                                    if (parseInt(key) === parseInt(index)) {
                                        array.push(data[key]);
                                    }
                                }
                            }
                        }
                        return array;
                    }
                }
                if (/[0-9]/.exec(position)) {
                    position = parseInt(position);
                    for (const key in data) {
                        if (Object.hasOwnProperty.call(data, key) && parseInt(key) === position) {
                            array = data[key];
                        }
                    }
                    return array;
                }
            }
        }
        return false;
    }

    /**
     * * Reset the Rule.
     * @memberof Rule
     */
    reset () {
        this.setProps('value', this.props.original.value);
        for (const btn of this.control) {
            btn.reset(this);
        }
    }

    /**
     * * Generate all the Rules.
     * @static
     * @param {Filter} filter Parent Filter.
     * @returns {Rules[]}
     * @memberof Rule
     */
    static generate (filter) {
        let rules = [];
        for (const key in filter.props.rules) {
            if (Object.hasOwnProperty.call(filter.props.rules, key)) {
                const props = filter.props.rules[key];
                rules.push(new this(this.generateProps(key, props), filter));
            }
        }
        return rules;
    }

    /**
     * * Generetes the Rule properties.
     * @static
     * @param {number} key Rule key.
     * @param {string|object} props Properties to parse.
     * @returns {object}
     * @memberof Rule
     */
    static generateProps (key, props) {
        if (typeof props === 'object') {
            let properties = {
                target: props[0],
            };
            if (props.hasOwnProperty(1)) {
                properties.comparator = props[1];
            }
            if (props.hasOwnProperty(2)) {
                properties.value = props[2];
            }
            if (props.hasOwnProperty(3)) {
                properties.strict = props[3];
            }
            return {
                id: `rule-${ key }`,
                ...properties,
            };
        }
        if (typeof props === 'boolean' && props) {
            return {
                id: `rule-${ key }`,
                target: key,
            };
        }
        return {
            id: `rule-${ key }`,
            target: props,
        };
    }

    /** 
     * @static
     * @var {object} props Default props
     */
    static props = {
        id: 'rule-1',
        target: false,
        comparator: '===',
        value: null,
        strict: true,
    }
}

// ? Default export
export default Rule;