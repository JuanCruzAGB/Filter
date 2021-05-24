// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js"

/**
 * * Order controls the Filter Order.
 * @export
 * @class Order
 * @author Juan Cruz Armentia <juancarmentia@gmail.com>
 * @extends Class
 */
export class Order extends Class {
    /**
     * * Creates an instance of Order.
     * @param {object} [props] Order properties:
     * @param {string} [props.id='order-1'] Order primary key.
     * @param {array} [props.rules] Order rules.
     * @param {object} [callbacks] Order callbacks:
     * @param {object} [callback] Order callback:
     * @param {function} [callback.function] Order callback function.
     * @param {*} [callback.params] Order callback function params.
     * @memberof Order
     */
    constructor (props = {
        id: 'order-1',
        rules: [],
    }, callback = {
        function: function (params) { /* console.log(params.result) */ },
        params: {},
    }) {
        super({  ...Order.props, ...props });
        this.setCallbacks({ default: { ...Order.callback, ...callback } });
        this.parseRules();
    }

    /**
     * * Set the Filter Rules.
     * @memberof Filter
     */
    parseRules () {
        let rules = [];
        for (const rule of this.props.rules) {
            rules.push({
                by: (typeof rule === 'object' ? rule[0] : rule),
                type: (typeof rule === 'object' ? rule[1] : 'ASC'),
            });
        }
        this.setProps('rules', rules);
    }

    /**
     * * Order the data.
     * @returns {array} Data ordered.
     * @memberof Filter
     */
    run (data = []) {
        let result = data.sort(this.sort(this));
        this.execute('default', {
            result: result,
        });
        return result;
    }

    /**
     * * The sort order function.
     * @param {Order} order
     * @returns {number} Data position.
     * @memberof Filter
     */
    sort (order) {
        return function (a, b) {
            let index = 0;
            for (const rule of order.props.rules) {
                if (index === 0) {
                    if (/\./.exec(rule.by)) {
                        index = Order.parseLevels(a, b, rule);
                    } else {
                        if (a.hasOwnProperty(rule.by)) {
                            let aValue = a[rule.by];
                            if (b.hasOwnProperty(rule.by)) {
                                let bValue = b[rule.by];
                                if (typeof aValue === 'string') {
                                    aValue = aValue.toUpperCase();
                                    bValue = bValue.toUpperCase();
                                }
                                switch (rule.type.toUpperCase()) {
                                    case 'ASC':
                                        if (aValue < bValue) {
                                            index = -1;
                                        }
                                        if (aValue > bValue) {
                                            index = 1;
                                        }
                                        break;
                                    case 'DESC':
                                        if (aValue > bValue) {
                                            index = -1;
                                        }
                                        if (aValue < bValue) {
                                            index = 1;
                                        }
                                        break;
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
     * * Found a level inside an element.
     * @static
     * @param {object} element
     * @param {array} levels
     * @returns {object}
     * @memberof Order
     */
    static foundLevels (element, levels) {
        for (const name of levels) {
            if (element.hasOwnProperty(name)) {
                element = element[name];
                continue;
            }
            return [false, false];
        }
        return [element, true];
    }

    /**
     * * Generate all the Order.
     * @static
     * @param {Filter} filter Parent Filter.
     * @returns {Order}
     * @memberof Rule
     */
    static generate (filter) {
        return new this({
            rules: filter.props.order,
        }, { ...filter.callbacks.order, ...filter.callbacks.desc });
    }

    /**
     * * Parse the levels of an order and compare the values of 2 objects.
     * @static
     * @param {object} a First element
     * @param {object} b Second element
     * @param {object} rule Order rule
     * @returns {number}
     * @memberof Order
     */
    static parseLevels (a, b, rule) {
        let aValue = a, aFound = true;
        let response = this.foundLevels(aValue, rule.by.split('.'));
        aValue = response[0];
        aFound = response[1];
        if (aFound) {
            let bValue = b, bFound = true;
            response = this.foundLevels(bValue, rule.by.split('.'));
            bValue = response[0];
            bFound = response[1];
            if (bFound) {
                if (typeof aValue === 'string') {
                    aValue = aValue.toUpperCase();
                    bValue = bValue.toUpperCase();
                }
                if (aValue < bValue) {
                    return -1;
                }
                if (aValue > bValue) {
                    return 1;
                }
            }
        }
        return 0;
    }

    /** 
     * @static
     * @var {object} props Default props
     */
    static props = {
        id: 'order-1',
        rules: [],
    }
    
    /** 
     * @static
     * @var {object} callback Default callbacks
     */
    static callback = {
        function: function (params) { /* console.log(params.result) */ },
        params: {},
    }
}

// ? Default export
export default Order;