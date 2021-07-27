// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js"

// ? Filter repository.
import Input from "./Input.js";

/**
 * * Rule controls the Filter rules.
 * @export
 * @class Rule
 * @author Juan Cruz Armentia <juancamentia@Gmail.com>
 * @extends Class
 */
export default class Rule extends  Class {
    /**
     * * Creates an instance of Rule. 
     * @param {object} [props]
     * @param {string} [props.id="rule-1"] Primary key.
     * @param {string} [props.target=false]
     * @param {string} [props.comparator="=="] Type of comparation.
     * @param {array} [props.values] Default Values.
     * @param {object} [state]
     * @param {boolean} [state.strict=false] If the comparation should be strict.
     * @param {Filter} filter Parent Filter.
     * @memberof Rule
     */
    constructor (props = {
        id: "rule-1",
        target: false,
        comparator: "==",
        values: [null],
    }, state = {
        strict: false,
    }, filter) {
        super({ ...Rule.props, ...props }, { ...Rule.state, ...state });
        this.setProps("original", { ...this.props });
        this.setInput(filter);
    }

    /**
     * * Set the Rule buttons.
     * @param {Filter} filter Parent Filter.
     * @memberof Rule
     */
    setInput(filter) {
        this.input = Input.generate(this, filter);
    }

    /**
     * * Saves & returns the Rule values.
     * @returns {*}
     * @memberof Rule
     */
    getValues () {
        this.setProps("values", this.input.getValues());
        for (const value of this.props.values) {
            if (value !== null) {
                return value;
            }
        }
        return null;
    }

    /**
     * * Check if the data validates.
     * @param {object[]} [data]
     * @returns {object[]}
     * @memberof Rule
     */
    check (data = []) {
        if (this.getValues() !== null) {
            let removed = 0;
            let aux = [...data];
            for (const key in aux) {
                if (Object.hasOwnProperty.call(aux, key)) {
                    const object = aux[key];
                    if (/\./.exec(this.props.target)) {
                        let [valid, entry] = this.checkLevels(object, this.props.target.split("."));
                        if (!valid) {
                            data.splice((key - removed), 1);
                            removed++;
                        }
                        continue;
                    }
                    if (!/\./.exec(this.props.target)) {
                        if (/\:/.exec(this.props.target)) {
                            let [valid, entry] = this.checkPositions(object, this.props.target.split(":"));
                            if (!valid) {
                                data.splice((key - removed), 1);
                                removed++;
                            }
                            continue;
                        }
                        if (!/\:/.exec(this.props.target)) {
                            if (/\|/.exec(this.props.target)) {
                                let [valid, entry] = this.checkOptions(object, this.props.target.split("|"));
                                if (!valid) {
                                    data.splice((key - removed), 1);
                                    removed++;
                                }
                                continue;
                            }
                            if (!/\|/.exec(this.props.target)) {
                                let [valid, entry] = this.checkProperty(object, this.props.target);
                                if (!valid) {
                                    data.splice((key - removed), 1);
                                    removed++;
                                }
                                continue;
                            }
                        }
                    }
                }
            }
        }
        return data;
    }

    /**
     * * Comparate the levels from an object.
     * @param {object} object
     * @param {array} levels
     * @returns {array}
     * @memberof Order
     */
    checkLevels (object, levels) {
        let valid = false, entry = object, subentry = undefined, aux = [], lastValid = false;
        let index = 1;
        for (const level of levels) {
            if (entry !== undefined) {
                if (/\:/.exec(level)) {
                    if (typeof entry === "object" && entry.length) {
                        aux = [], lastValid = false;
                        for (const key in entry) {
                            if (Object.hasOwnProperty.call(entry, key)) {
                                [valid, subentry] = this.checkPositions(entry[key], level.split(":"));
                                if (index == levels.length && valid) {
                                    lastValid = true;
                                }
                                if (typeof subentry === "object" && subentry.length) {
                                    for (const element of subentry) {
                                        aux.push(element);
                                    }
                                    continue;
                                }
                                aux.push(subentry);
                            }
                        }
                        entry = aux;
                        if (index == levels.length) {
                            valid = lastValid;
                        }
                        index++;
                        continue;
                    }
                    [valid, entry] = this.checkPositions(entry, level.split(":"));
                }
                if (!/\:/.exec(level)) {
                    if (/\|/.exec(level)) {
                        if (typeof entry === "object" && entry.length) {
                            aux = [], lastValid = false;
                            for (const key in entry) {
                                if (Object.hasOwnProperty.call(entry, key)) {
                                    [valid, subentry] = this.checkOptions(entry[key], level.split("|"));
                                    if (index == levels.length && valid) {
                                        lastValid = true;
                                    }
                                    if (typeof subentry === "object" && subentry.length) {
                                        for (const element of subentry) {
                                            aux.push(element);
                                        }
                                        continue;
                                    }
                                    aux.push(subentry);
                                }
                            }
                            entry = aux;
                            if (index == levels.length) {
                                valid = lastValid;
                            }
                            index++;
                            continue;
                        }
                        [valid, entry] = this.checkOptions(entry, level.split("|"));
                    }
                    if (!/\|/.exec(level)) {
                        if (typeof entry === "object" && entry.length) {
                            aux = [], lastValid = false;
                            for (const key in entry) {
                                if (Object.hasOwnProperty.call(entry, key)) {
                                    [valid, subentry] = this.checkProperty(entry[key], level);
                                    if (index == levels.length && valid) {
                                        lastValid = true;
                                    }
                                    if (typeof subentry === "object" && subentry.length) {
                                        for (const element of subentry) {
                                            aux.push(element);
                                        }
                                        continue;
                                    }
                                    aux.push(subentry);
                                }
                            }
                            entry = aux;
                            if (index == levels.length) {
                                valid = lastValid;
                            }
                            index++;
                            continue;
                        }
                        [valid, entry] = this.checkProperty(entry, level);
                    }
                }
            }
            index++;
        }
        return [valid, entry];
    }

    /**
     * * Check the options from an object.
     * @param {object} object
     * @param {array} options
     * @returns {array}
     * @memberof Order
     */
    checkOptions (object, options) {
        let valid = false, entry = undefined, firstEntry = undefined;
        for (const option of options) {
            [valid, entry] = this.checkProperty(object, option);
            if (valid) {
                return [true, entry];
            }
            if (entry !== undefined) {
                firstEntry = entry;
            }
        }
        return [false, firstEntry];
    }

    /**
     * * Check the positions from an object property array.
     * @param {object} object
     * @param {array} [property, positions]
     * @returns {array}
     * @memberof Order
     */
    checkPositions (object, [property, position]) {
        let valid = false, entry = undefined;
        [valid, entry] = this.checkProperty(object, property);
        if (entry !== undefined) {
            if (/\[/.exec(position)) {
                let aux = [];
                for (const key of position.split("[").pop().split("]").shift().splt(",")) {
                    if (entry.hasOwnProperty(key)) {
                        aux.push(entry[key]);
                        valid = true;
                        continue;
                    }
                    aux = [];
                    valid = false;
                    entry = undefined;
                    break;
                }
                if (aux.length) {
                    entry = aux;
                }
            }
        }
        return [valid, entry];
    }

    /**
     * * Check if the object contains a property.
     * @param {object} object
     * @param {string} property
     * @returns {array}
     * @memberof Rule
     */
    checkProperty (object, property) {
        let valid = true;
        let element = undefined;
        if (object.hasOwnProperty(property)) {
            element = object[property];
            if (this.props.comparator === "><") {
                valid = true;
                if (!this.comparate(element, { range: this.props.values })) {
                    valid = false;
                }
            }
            if (this.props.comparator !== "><") {
                for (const value of this.props.values) {
                    if (value === null) {
                        continue;
                    }
                    if (!this.comparate(element, value)) {
                        valid = false;
                        continue;
                    }
                    valid = true;
                    break;
                }
            }
        }
        if (!object.hasOwnProperty(property)) {
            valid = false;
        }
        return [valid, element];
    }

    /**
     * * Comparates the values.
     * @param {*} aValue Value to comparate.
     * @param {*} bValue Value to be comparated.
     * @returns {boolean} If the comparation is true or false.
     * @memberof Rule
     */
    comparate (aValue, bValue) {
        switch (typeof bValue) {
            case "boolean":
                return this.comparateBoolean(aValue, bValue);
            case "number":
                return this.comparateNumber(aValue, bValue);
            case "object":
                return this.comparateObject(aValue, bValue);
            case "string":
                if (!isNaN(parseFloat(bValue))) {
                    bValue = parseFloat(bValue);
                    return this.comparateNumber(aValue, bValue);
                }
                return this.comparateString(aValue, bValue);
            default:
                console.error(`Typeof "${ typeof bValue }": comparation not created`);
                break;
        }
    }

    /**
     * * Comparates two booleans.
     * @param {number} aValue
     * @param {number} bValue
     * @returns {boolean}
     * @memberof Rule
     */
    comparateBoolean (aValue, bValue) {
        if (typeof aValue !== "boolean") {
            return false;
        }
        switch (this.props.comparator) {
            case "!=":
                if (aValue != bValue) {
                    return true;
                }
                return false;
            case "==":
                if (aValue == bValue) {
                    return true;
                }
                return false;
            case ">":
                if (aValue && !bValue) {
                    return true;
                }
                return false;
            case "<":
                if (!aValue && bValue) {
                    return true;
                }
                return false;
            default:
                console.error(`Comparator "${ this.props.comparator }": not created`);
                return false;
        }
    }

    /**
     * * Comparates two numbers.
     * @param {number} aValue
     * @param {number} bValue
     * @returns {boolean}
     * @memberof Rule
     */
    comparateNumber (aValue, bValue) {
        if (typeof aValue !== "number") {
            if (isNaN(parseFloat(aValue))) {
                return false;
            }
            aValue = parseFloat(aValue);
        }
        switch (this.props.comparator) {
            case "!=":
                if (aValue != bValue) {
                    return true;
                }
                return false;
            case "==":
                if (aValue == bValue) {
                    return true;
                }
                return false;
            case ">":
                if (aValue > bValue) {
                    return true;
                }
                return false;
            case ">=":
                if (aValue >= bValue) {
                    return true;
                }
                return false;
            case "<":
                if (aValue < bValue) {
                    return true;
                }
                return false;
            case "<=":
                if (aValue <= bValue) {
                    return true;
                }
                return false;
            case "><":
                let min = null, max = 0;
                for (const value of bValue) {
                    if (min === null || min > value) {
                        min = value;
                    }
                    if (max < value) {
                        max = value;
                    }
                }
                if (aValue >= min && aValue <= max) {
                    return true;
                }
                return false;
                break;
            default:
                console.error(`Comparator "${ this.props.comparator }": not created`);
                return false;
        }
    }

    /**
     * * Comparate two objects.
     * @param {object} aValue
     * @param {object} bValue
     * @returns {boolean}
     * @memberof Rule
     */
    comparateObject (aValue, bValue) {
        if (bValue === null) {
            if (aValue !== null) {
                return false;
            }
            switch (this.props.comparator) {
                case "!=":
                    if (aValue != bValue) {
                        return true;
                    }
                    return false;
                case "==":
                    if (aValue == bValue) {
                        return true;
                    }
                    return false;
                default:
                    console.error(`Comparator "${ this.props.comparator }": not created`);
                    return false;
            }
        }
        if (bValue.hasOwnProperty("length")) {
            if (typeof aValue !== "object" || !aValue.length) {
                return false;
            }
            return this.comparateNumber(aValue.length, bValue.length, this.props.comparator);
        }
        if (bValue.hasOwnProperty("range")) {
            if (typeof aValue !== "number") {
                if (isNaN(parseFloat(aValue))) {
                    return false;
                }
            }
            return this.comparateNumber(aValue, bValue.range, this.props.comparator);
        }
        if (bValue.hasOwnProperty("regex")) {
            if (typeof aValue !== "string") {
                return false;
            }
            return this.comparateRegExp(aValue, bValue.regex, this.props.comparator);
        }
    }

    /**
     * * Comparates one value by the regex.
     * @param {number} aValue
     * @param {number} bValue
     * @returns {boolean}
     * @memberof Rule
     */
    comparateRegExp (aValue, bValue) {
        if (typeof aValue !== "string") {
            return false;
        }
        switch (this.props.comparator) {
            case "!=":
                if (!new RegExp(bValue.toUpperCase()).exec(aValue.toUpperCase())) {
                    return true;
                }
                return false;
            case "==":
                if (new RegExp(bValue.toUpperCase()).exec(aValue.toUpperCase())) {
                    return true;
                }
                return false;
            default:
                console.error(`Comparator "${ this.props.comparator }": not created`);
                return false;
        }
    }

    /**
     * * Comparates two strings.
     * @param {string} aValue
     * @param {string} bValue
     * @returns {boolean}
     * @memberof Rule
     */
    comparateString (aValue, bValue) {
        if (typeof aValue !== "string") {
            return false;
        }
        aValue = this.removeWeirdLetters(aValue);
        bValue = this.removeWeirdLetters(bValue);
        switch (this.props.comparator) {
            case "!=":
                if (aValue != bValue) {
                    return true;
                }
                return false;
            case "==":
                if (aValue == bValue) {
                    return true;
                }
                return false;
            case ">":
                if (aValue > bValue) {
                    return true;
                }
                return false;
            case ">=":
                if (aValue >= bValue) {
                    return true;
                }
                return false;
            case "<":
                if (aValue < bValue) {
                    return true;
                }
                return false;
            case "<=":
                if (aValue <= bValue) {
                    return true;
                }
                return false;
            default:
                console.error(`Comparator "${ this.props.comparator }": not created`);
                return false;
        }
    }

    /**
     * * Removes the vocal accents
     * @param {string} string
     * @returns {string}
     * @memberof Rule
     */
    removeWeirdLetters (string = "") {
        const map = {
            "A": "À|Á|Ã|Â|Ä",
            "E": "É|È|Ê|Ë",
            "I": "Í|Ì|Î|Ï",
            "O": "Ó|Ò|Ô|Õ|Ö",
            "U": "Ú|Ù|Û|Ü",
            "C": "Ç",
            "N": "Ñ"
        };
    
        for (var pattern in map) {
            string = `${ string }`.toUpperCase().replace(new RegExp(map[pattern], "g"), pattern);
        }
    
        return string;
    }

    /**
     * * Reset the Rule.
     * @memberof Rule
     */
    reset () {
        this.setProps("values", this.props.original.values);
        for (const btn of this.input) {
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
        let index = 1;
        for (const key in filter.props.rules) {
            if (Object.hasOwnProperty.call(filter.props.rules, key)) {
                rules.push(new this(this.generateProps(index, key, filter.props.rules[key]), this.generateState(index, key, filter.props.rules[key]), filter));
                index++;
            }
        }
        return rules;
    }

    /**
     * * Generetes the Rule properties.
     * @static
     * @param {string} key
     * @param {string} target
     * @param {string|object} props
     * @returns {object}
     * @memberof Rule
     */
    static generateProps (key, target, props) {
        let properties = {
            id: `rule-${ key }`,
            target: target,
        };
        if (typeof props === "object" && props !== null) {
            if (props.length === undefined) {
                properties = {
                    ...properties,
                    ...props
                };
            }
            if (props.length !== undefined) {
                if (props.hasOwnProperty(0)) {
                    properties.comparator = props[0];
                }
                if (props.hasOwnProperty(1)) {
                    properties.values = [props[1]];
                }
            }
        }
        if (typeof props !== "object" || props === null) {
            properties.values = [props];
        }
        return properties;
    }

    /**
     * * Generetes the Rule state.
     * @static
     * @param {string} key
     * @param {string} target
     * @param {string|object} props
     * @returns {object}
     * @memberof Rule
     */
    static generateState (key, target, props) {
        let state = {
            strict: false,
        };
        if (typeof props === "object" && props !== null) {
            if (props.length === undefined) {
                state = {
                    ...state,
                    ...props
                };
            }
            if (props.length !== undefined) {
                if (props.hasOwnProperty(2)) {
                    state.strict = props[2];
                }
            }
        }
        return state;
    }

    /** 
     * @static
     * @var {object} props Default properties.
     */
    static props = {
        id: "rule-1",
        target: false,
        comparator: "==",
        values: [null],
    }

    /** 
     * @static
     * @var {object} state Default state.
     */
    static state = {
        active: true,
        strict: false,
    }
}