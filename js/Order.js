// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js"

// ? Filter repository.
import Input from "././Input.js";

/**
 * * Order controls the Filter Order.
 * @export
 * @class Order
 * @author Juan Cruz Armentia <juan.cruz.armentia@gmail.com>
 * @extends Class
 */
export default class Order extends Class {
    /**
     * * Creates an instance of Order.
     * @param {object} [props] Order properties:
     * @param {string} [props.id="order-1"] Order primary key.
     * @param {object} [state] Order state:
     * @param {boolean} [state.active=true] If the Order is active.
     * @param {array} [props.rules] Order rules.
     * @param {object} [callbacks] Order callbacks:
     * @param {object} [callback] Order callback:
     * @param {function} [callback.function] Order callback function.
     * @param {*} [callback.params] Order callback function params.
     * @param {Filter} filter Parent Filter.
     * @memberof Order
     */
    constructor (props = {
        id: "order-1",
        by: null,
        value: null,
    }, state = {
        active: true,
    }, callback = {
        function: function (params) { /* console.log(params.result) */ },
        params: {},
    }, filter) {
        super({  ...Order.props, ...props }, {  ...Order.state, ...state });
        this.setCallbacks({ default: { ...Order.callback, ...callback } });
        this.setInput(filter);
    }

    /**
     * * Set the Rule buttons.
     * @param {Filter} filter Parent Filter.
     * @memberof Order
     */
    setInput(filter) {
        this.input = Input.generate(this, filter);
    }

    /**
     * * Saves & returns the Order active state.
     * @returns {*}
     * @memberof Rule
     */
    getActive () {
        this.setState("active", this.input.getActiveState());
        return this.state.active;
    }

    /**
     * * Order the data.
     * @returns {array} Data ordered.
     * @memberof Filter
     */
    run (data = []) {
        let result = data;
        if (this.state.active) {
            result = data.sort(this.sort(this));
        }
        this.execute("default", {
            result: result,
        });
        return result;
    }

    /**
     * * Comparate values.
     * @static
     * @param {*} aValue
     * @param {*} bValue
     * @param {ASC|DESC} type
     * @returns {array}
     * @memberof Order
     */
    static check (aValue, bValue, type) {
        switch (typeof aValue) {
            case "boolean":
                return this.checkBoolean(aValue, bValue, type);
            case "number":
                return this.checkNumber(aValue, bValue, type);
            case "object":
                return this.checkObject(aValue, bValue, type);
            case "string":
                return this.checkString(aValue, bValue, type);
            default:
                console.error(`Typeof: ${ typeof aValue } checker not created`);
                break;
        }
    }

    /**
     * * Comparate two booleans.
     * @static
     * @param {*} aValue
     * @param {*} bValue
     * @param {ASC|DESC} type
     * @returns {array}
     * @memberof Order
     */
    static checkBoolean (aValue, bValue, type) {
        switch (type.toUpperCase()) {
            case "ASC":
                if (aValue && !bValue) {
                    return [1, aValue, bValue];
                }
                if (!aValue && bValue) {
                    return [-1, aValue, bValue];
                }
                break;
            case "DESC":
                if (aValue && !bValue) {
                    return [-1, aValue, bValue];
                }
                if (!aValue && bValue) {
                    return [1, aValue, bValue];
                }
                break;
        }
        return [0, aValue, bValue];
    }

    /**
     * * Comparate the levels from objects.
     * @static
     * @param {array} [a,b]
     * @param {array} levels
     * @param {string} [type="ASC"]
     * @returns {array}
     * @memberof Order
     */
    static checkLevels ([a, b], levels, type = "ASC") {
        let index = 0, aValue = a, bValue = b, aNew, bNew, aux = [];
        let position = 1;
        for (const level of levels) {
            if (index === 0) {
                if (/\:/.exec(level)) {
                    if (typeof aValue === "object" && aValue.length) {
                        aux = [];
                        for (const key in aValue) {
                            if (index === 0) {
                                if (Object.hasOwnProperty.call(aValue, key)) {
                                    [index, aNew, bNew] = this.checkPositions([aValue[key], bValue[key]], level.split(":"), type);
                                    if (typeof aNew === "object" && aNew.length) {
                                        for (const element of aNew) {
                                            aux.push(element);
                                        }
                                        continue;
                                    }
                                    aux.push(aNew);
                                }
                            }
                        }
                        aValue = aux;
                        position++;
                        continue;
                    }
                    [index, aValue, bValue] = this.checkPositions([aValue, bValue], level.split(":"), type);
                }
                if (!/\:/.exec(level)) {
                    if (/\|/.exec(level)) {
                        if (typeof aValue === "object" && aValue.length) {
                            aux = [];
                            for (const key in aValue) {
                                if (index === 0) {
                                    if (Object.hasOwnProperty.call(aValue, key)) {
                                        [index, aValue, bValue] = this.checkOptions([aValue[key], bValue[key]], level.split("|"), type);
                                        if (typeof aNew === "object" && aNew.length) {
                                            for (const element of aNew) {
                                                aux.push(element);
                                            }
                                            continue;
                                        }
                                        aux.push(aNew);
                                    }
                                }
                            }
                            aValue = aux;
                            position++;
                            continue;
                        }
                        [index, aValue, bValue] = this.checkOptions([aValue, bValue], level.split("|"), type);
                    }
                    if (!/\|/.exec(level)) {
                        if (typeof aValue === "object" && aValue.length) {
                            aux = [];
                            for (const key in aValue) {
                                if (index === 0) {
                                    if (Object.hasOwnProperty.call(aValue, key)) {
                                        [index, aValue, bValue] = this.checkProperty([aValue[key], bValue[key]], level, type);
                                        if (typeof aNew === "object" && aNew.length) {
                                            for (const element of aNew) {
                                                aux.push(element);
                                            }
                                            continue;
                                        }
                                        aux.push(aNew);
                                    }
                                }
                            }
                            aValue = aux;
                            position++;
                            continue;
                        }
                        [index, aValue, bValue] = this.checkProperty([aValue, bValue], level, type);
                    }
                }
                position++;
            }
        }
        return [index, aValue, bValue];
    }

    /**
     * * Comparate two numbers.
     * @static
     * @param {*} aValue
     * @param {*} bValue
     * @param {ASC|DESC} type
     * @returns {array}
     * @memberof Order
     */
    static checkNumber (aValue, bValue, type) {
        switch (type.toUpperCase()) {
            case "ASC":
                if (aValue > bValue) {
                    return [1, aValue, bValue];
                }
                if (aValue < bValue) {
                    return [-1, aValue, bValue];
                }
                break;
            case "DESC":
                if (aValue > bValue) {
                    return [-1, aValue, bValue];
                }
                if (aValue < bValue) {
                    return [1, aValue, bValue];
                }
                break;
        }
        return [0, aValue, bValue];
    }

    /**
     * * Comparate two objects.
     * @static
     * @param {*} aValue
     * @param {*} bValue
     * @param {ASC|DESC} type
     * @returns {array}
     * @memberof Order
     */
    static checkObject (aValue, bValue, type) {
        switch (type.toUpperCase()) {
            case "ASC":
                if (aValue !== null && bValue !== null) {
                    if (aValue.length > bValue.length) {
                        return [1, aValue, bValue];
                    }
                    if (aValue.length < bValue.length) {
                        return [-1, aValue, bValue];
                    }
                }
                if (aValue !== null && bValue === null) {
                    return [1, aValue, bValue];
                }
                if (aValue === null && bValue !== null) {
                    return [-1, aValue, bValue];
                }
                break;
            case "DESC":
                if (aValue !== null && bValue !== null) {
                    if (aValue.length > bValue.length) {
                        return [-1, aValue, bValue];
                    }
                    if (aValue.length < bValue.length) {
                        return [1, aValue, bValue];
                    }
                }
                if (aValue !== null && bValue === null) {
                    return [-1, aValue, bValue];
                }
                if (aValue === null && bValue !== null) {
                    return [1, aValue, bValue];
                }
                break;
        }
        return [0, aValue, bValue];
    }

    /**
     * * Comparate the options from objects.
     * @static
     * @param {array} [a,b]
     * @param {array} options
     * @param {string} [type="ASC"]
     * @returns {array}
     * @memberof Order
     */
    static checkOptions ([a, b], options, type = "ASC") {
        let index = 0, aValue = false, firstAValue = null, bValue = false, firstBValue = null;
        for (const option of options) {
            [index, aValue, bValue] = this.checkProperty([a, b], option, type);
            if (index !== 0) {
                return [index, aValue, bValue];
            }
            if (aValue) {
                firstAValue = aValue;
            }
            if (bValue) {
                firstBValue = bValue;
            }
        }
        return [0, firstAValue, firstBValue];
    }

    /**
     * * Comparate the positions from objects.
     * @static
     * @param {array} [a,b]
     * @param {array} [property, positions]
     * @param {string} [type="ASC"]
     * @returns {array}
     * @memberof Order
     */
    static checkPositions ([a, b], [property, position], type = "ASC") {
        let index = 0, aValue = false, bValue = false;
        [index, aValue, bValue] = this.checkProperty([a, b], property, type);
        if (aValue) {
            if (/\[/.exec(position)) {
                let aAux = [], bAux = [];
                for (const key of position.split("[").pop().split("]").shift().splt(",")) {
                    if (aValue.hasOwnProperty(key)) {
                        aAux.push(aValue[key]);
                        if (bValue.hasOwnProperty(key)) {
                            bAux.push(bValue[key]);
                            continue;
                        }
                        switch (type.toUpperCase()) {
                            case "ASC":
                                index = -1;
                                break;
                            case "DESC":
                                index = 1;
                                break;
                        }
                        bAux = [];
                        bValue = false;
                        break;
                    }
                    aAux = [];
                    bAux = [];
                    aValue = false;
                    bValue = false;
                    break;
                }
                if (aAux.length) {
                    aValue = aAux;
                }
                if (bAux.length) {
                    aValue = aAux;
                }
            }
        }
        return [index, aValue, bValue];
    }

    /**
     * * Comparate the properties from objects.
     * @static
     * @param {array} [a,b]
     * @param {*} property
     * @param {string} [type="ASC"]
     * @returns {array}
     * @memberof Order
     */
    static checkProperty ([a, b], property, type = "ASC") {
        if (a.hasOwnProperty(property)) {
            let aValue = a[property];
            if (b.hasOwnProperty(property)) {
                let bValue = b[property];
                return this.check(aValue, bValue, type);
            }
            switch (type.toUpperCase()) {
                case "ASC":
                    return [-1, aValue, false];
                case "DESC":
                    return [1, aValue, false];
            }
        }
        return [0, false, false];
    }

    /**
     * * Comparate two strings.
     * @static
     * @param {*} aValue
     * @param {*} bValue
     * @param {ASC|DESC} type
     * @returns {array}
     * @memberof Order
     */
    static checkString (aValue, bValue, type) {
        switch (type.toUpperCase()) {
            case "ASC":
                if (aValue.toUpperCase() > `${ bValue }`.toUpperCase()) {
                    return [1, aValue, bValue];
                }
                if (aValue.toUpperCase() < `${ bValue }`.toUpperCase()) {
                    return [-1, aValue, bValue];
                }
                break;
            case "DESC":
                if (aValue.toUpperCase() > `${ bValue }`.toUpperCase()) {
                    return [-1, aValue, bValue];
                }
                if (aValue.toUpperCase() < `${ bValue }`.toUpperCase()) {
                    return [1, aValue, bValue];
                }
                break;
        }
        return [0, aValue, bValue];
    }

    /**
     * * Generate all the Order.
     * @static
     * @param {Filter} filter Parent Filter.
     * @returns {Order}
     * @memberof Order
     */
    static generate (filter) {
        let order = [];
        let index = 1;
        for (const key in filter.props.order) {
            if (Object.hasOwnProperty.call(filter.props.order, key)) {
                order.push(new this(this.generateProps(index, key, filter.props.order[key]), this.generateState(index, key, filter.props.order[key]), { ...filter.callbacks.order }, filter));
                index++;
            }
        }
        return order;
    }

    /**
     * * Generetes the Order properties.
     * @static
     * @param {string} key
     * @param {string} by
     * @param {string|object} props
     * @returns {object}
     * @memberof Order
     */
    static generateProps (key, by, props) {
        let properties = {
            id: `order-${ key }`,
            by: by,
        };
        if (typeof props === "object" && props !== undefined) {
            if (props.length === undefined) {
                properties = {
                    ...properties,
                    ...props
                };
            }
            if (props.length !== undefined) {
                if (props.hasOwnProperty(0)) {
                    properties.value = props[0];
                }
            }
        }
        if (typeof props !== "object" || props === null) {
            properties.value = props;
        }
        return properties;
    }

    /**
     * * Generetes the Order state.
     * @static
     * @param {number} key
     * @param {string} by
     * @param {string|object} props
     * @returns {object}
     * @memberof Order
     */
    static generateState (key, by, props) {
        let state = {
            active: true,
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
                    state.active = props[2];
                }
            }
        }
        return state;
    }

    /**
     * * The sort order function.
     * @static
     * @param {Filter} filter
     * @returns {number} Data position.
     * @memberof Filter
     */
    static sort (filter) {
        return function (a, b) {
            let index = 0, other = false;
            for (const order of filter.props.order) {
                if (index === 0) {
                    if (order.getActive()) {
                        if (/\./.exec(order.props.by)) {
                            [index, ...other] = Order.checkLevels([a, b], order.props.by.split("."), order.props.value);
                            continue;
                        }
                        if (!/\./.exec(order.props.by)) {
                            if (/\:/.exec(order.props.by)) {
                                [index, ...other] = Order.checkPositions([a, b], order.props.by.split(":"), order.props.value);
                                continue;
                            }
                            if (!/\:/.exec(order.props.by)) {
                                if (/\|/.exec(order.props.by)) {
                                    [index, ...other] = Order.checkOptions([a, b], order.props.by.split("|"), order.props.value);
                                    continue;
                                }
                                if (!/\|/.exec(order.props.by)) {
                                    [index, ...other] = Order.checkProperty([a, b], order.props.by, order.props.value);
                                }
                            }
                        }
                    }
                }
            }
            return index;
        }
    }

    /** 
     * @static
     * @var {object} props Default properties.
     */
    static props = {
        id: "order-1",
        by: null,
        value: null,
    }

    /** 
     * @static
     * @var {object} state Default state.
     */
    static state = {
        active: true,
    }
    
    /** 
     * @static
     * @var {object} callback Default callback.
     */
    static callback = {
        function: function (params) { /* console.log(params.result) */ },
        params: {},
    }
}