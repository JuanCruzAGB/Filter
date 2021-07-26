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
     * @param {boolean} [state.strict=true] If the comparation should be strict.
     * @param {Filter} filter Parent Filter.
     * @memberof Rule
     */
    constructor (props = {
        id: "rule-1",
        target: false,
        comparator: "==",
        values: [null],
    }, state = {
        strict: true,
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
        this.setProps("values", this.input.props.values);
        return this.props.values;
    }

    /**
     * * Check if the data validates.
     * @param {object[]} [data]
     * @returns {object[]}
     * @memberof Rule
     */
    check (data = []) {
        console.log(data);
        console.log(this.props.target);
        if (this.getValues() !== null) {
            let removed = 0;
            let aux = [...data];
            data: for (const key in aux) {
                if (Object.hasOwnProperty.call(aux, key)) {
                    const object = aux[key];
                    console.log(object);
                    for (const value of this.props.values) {
                        if (value === null) {
                            continue;
                        }
                        if (/\./.exec(this.props.target)) {
                            console.log(this.props.target.split("."));
                            // valid = this.checkLevels(status.data, target, value);
                            // if (valid) {
                            //     valid = valid;
                            // }
                            console.log("TODO");
                            continue;
                        }
                        if (!/\./.exec(this.props.target)) {
                            if (/\|/.exec(this.props.target)) {
                                if (!this.checkOptions(object, this.props.target.split("|"), value)) {
                                    console.log("options fail");
                                    console.log(`removed ${ data[key - removed].username }`);
                                    data.splice((key - removed), 1);
                                    removed++;
                                    continue data;
                                }
                            }
                            if (!/\|/.exec(this.props.target)) {
                                if (object.hasOwnProperty(this.props.target)) {
                                    let property = object[this.props.target];
                                    console.log(`${ property } ${ this.props.comparator } ${ value }`);
                                    if (!this.comparate(property, value)) {
                                        console.log("fails");
                                        console.log(`removed ${ data[key - removed].username }`);
                                        data.splice((key - removed), 1);
                                        removed++;
                                        continue data;
                                    }
                                }
                                if (!object.hasOwnProperty(this.props.target)) {
                                    console.log("property not found");
                                    console.log(`removed ${ data[key - removed].username }`);
                                    data.splice((key - removed), 1);
                                    removed++;
                                    continue data;
                                }
                            }
                        }
                    }
                }
            }
            // for (const value of this.props.values) {
            //     let valid = true;
            //     if (((status.valid || status.valid === null) && this.state.strict) || (!this.state.strict)) {
            //         if (typeof this.props.target === "object") {
            //             valid = false;
            //             for (const target of this.props.target) {
                            // if (/\./.exec(target)) {
                            //     valid = this.checkLevels(status.data, target, value);
                            //     if (valid) {
                            //         valid = valid;
                            //     }
                            //     continue;
                            // }
                            // if (!/\./.exec(target)) {
                            //     if (status.data.hasOwnProperty(target)) {
                            //         let statusValue = status.data[target];
                            //         if (this.comparate(statusValue, value)) {
                            //             valid = true;
                            //             continue;
                            //         }
                            //     }
                            // }
            //             }
            //         }
            //         if (typeof this.props.target !== "object") {
            //             if (/\./.exec(this.props.target)) {
            //                 valid = this.checkLevels(status.data, this.props.target, value);
            //             }
            //             if (!/\./.exec(this.props.target)) {
            //                 if (status.data.hasOwnProperty(this.props.target)) {
            //                     let statusValue = status.data[this.props.target];
            //                     if (!this.comparate(statusValue, value)) {
            //                         valid = false;
            //                     }
            //                 }
            //                 if (!status.data.hasOwnProperty(this.props.target)) {
            //                     valid = false;
            //                 }
            //             }
            //         }
            //     }
            //     if (!this.state.strict) {
            //         if (status.valid) {
            //             valid = true;
            //         }
            //     }
            //     status.valid = valid;
            // }
        }
        return data;
    }

    /**
     * * Check the coincidence from data levels.
     * @param {object} data Original data.
     * @param {string} target Target to split.
     * @param {*} value Value to compare.
     * @returns {boolean}
     * @memberof Rule
     */
    checkLevels (data, target, value) {
        let found = true, levels = target.split("."), statusValue = data;
        for (const name of levels) {
            if (/\:/.exec(name)) {
                statusValue = this.parseArray(statusValue, name);
                if (statusValue) {
                    continue;
                }
            }
            if (!/\:/.exec(name)) {
                if (statusValue.length) {
                    let array = [];
                    for (const element of statusValue) {
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
            found = null;
            if (typeof statusValue === "object") {
                for (const element of statusValue) {
                    let valid = true;
                    if (!this.comparate(element, value)) {
                        valid = false;
                    }
                    if (!this.state.strict) {
                        if (found) {
                            valid = true;
                        }
                    }
                    found = valid;
                }
                if (found || found === null) {
                    return true;
                }
                return false;
            }
            if (typeof statusValue !== "object") {
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
     * * Check if the Object property based on the options matchs.
     * @param {object} object
     * @param {array} options
     * @param {*} value Value to compare
     * @returns {boolean}
     * @memberof Rule
     */
    checkOptions (object, options, value) {
        for (const option of options) {
            if (object.hasOwnProperty(option)) {
                if (this.comparate(object[option], value)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * * Comparates the values.
     * @param {*} value1 Value to comparate.
     * @param {*} value2 Value to be comparated.
     * @returns {boolean} If the comparation is true or false.
     * @memberof Rule
     */
    comparate (value1, value2) {
        if (typeof value1 === "number") {
            value1 = value1 + "";
        }
        if (typeof value1 === "string") {
            value1 = this.removeWeirdLetters(value1);
        }
        if (typeof value2 === "number") {
            value2 = value2 + "";
        }
        if (typeof value2 === "string") {
            value2 = this.removeWeirdLetters(value2);
        }
        if (typeof value2 === "object") {
            console.log(`${ value1 } match ${ value2.regex.toUpperCase() }`);
            if (new RegExp(value2.regex.toUpperCase()).exec(value1)) {
                return true;
            }
            return false;
        }
        console.log(`${ value1 } ${ this.props.comparator } ${ value2 }`);
        switch (this.props.comparator) {
            case "!=":
                if (value1 != value2) {
                    return true;
                }
                return false;
            case "!==":
                if (value1 !== value2) {
                    return true;
                }
                return false;
            case "==":
                if (value1 == value2) {
                    return true;
                }
                return false;
            case "===":
                if (value1 === value2) {
                    return true;
                }
                return false;
            case ">=":
                if (parseInt(value1) >= parseInt(value2)) {
                    return true;
                }
                return false;
            case "<=":
                if (parseInt(value1) <= parseInt(value2)) {
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
        let name = string.split(":")[0];
        let position = string.split(":")[1];
        let array = [];
        if (data.length) {
            for (let element of data) {
                if (element.hasOwnProperty(name)) {
                    element = element[name];
                    if (/\*/.exec(position)) {
                        for (const key in element) {
                            if (Object.hasOwnProperty.call(element, key)) {
                                array.push(element[key]);
                            }
                        }
                        continue;
                    }
                    if (/\[/.exec(position)) {
                        position = position.split("[")[1].split("]")[0];
                        if (/\,/.exec(position)) {
                            position = position.split(",");
                            if (/^[0-9]/.exec(position[0])) {
                                for (const index of position) {
                                    for (const key in element) {
                                        if (Object.hasOwnProperty.call(element, key)) {
                                            if (parseInt(key) === parseInt(index)) {
                                                array.push(element[key]);
                                            }
                                        }
                                    }
                                }
                                continue;
                            }
                            for (const index of position) {
                                for (const key of element) {
                                    if (key === index) {
                                        array.push(element[key]);
                                    }
                                }
                            }
                        }
                        continue;
                    }
                    if (/^[0-9]/.exec(position)) {
                        position = parseInt(position);
                        for (const key in element) {
                            if (Object.hasOwnProperty.call(element, key) && parseInt(key) === position) {
                                array = element[key];
                            }
                        }
                        continue;
                    } else {
                        for (const key in element) {
                            if (Object.hasOwnProperty.call(element, key)) {
                                const object = element[key];
                                if (key === position) {
                                    array = object;
                                }
                            }
                        }
                        continue;
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
                    position = position.split("[")[1].split("]")[0];
                    if (/\,/.exec(position)) {
                        position = position.split(",");
                        if (/^[0-9]/.exec(position[0])) {
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
                        for (const index of position) {
                            for (const key of data) {
                                if (key === index) {
                                    array.push(data[key]);
                                }
                            }
                        }
                    }
                    return array;
                }
                if (/^[0-9]/.exec(position)) {
                    position = parseInt(position);
                    for (const key in data) {
                        if (Object.hasOwnProperty.call(data, key) && parseInt(key) === position) {
                            array = data[key];
                        }
                    }
                    return array;
                } else {
                    for (const key in data) {
                        if (Object.hasOwnProperty.call(data, key)) {
                            const element = data[key];
                            if (key === position) {
                                array = element;
                            }
                        }
                    }
                    return array;
                }
            }
        }
        return false;
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
            string = string.toUpperCase().replace(new RegExp(map[pattern], "g"), pattern);
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
            strict: true,
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
        strict: true,
    }
}