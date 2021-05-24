// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js"

// ? FilterJS repository.
import Control from "./Control.js";
import Limit from "./Limit.js";
import Order from "./Order.js";
import Page from "./Page.js";
import Rule from "./Rule.js";

/**
 * * Filter makes an excellent filter.
 * @export
 * @class Filter
 * @author Juan Cruz Armentia <juancarmentia@gmail.com>
 * @extends Class
 */
export class Filter extends Class {
    /**
     * * Creates an instance of Filter.
     * @param {object} [props] Filter properties:
     * @param {string} [props.id='filter-1'] Filter primary key.
     * @param {object} [props.order] Order properties:
     * @param {string} [props.order.by=false] Element to order by.
     * @param {string} [props.order.type='DESC'] Type of order.
     * @param {HTMLElement} [props.order.btn=false] If the order has buttons.
     * @param {number} [props.limit=false] Maximum amount of filtered data to display.
     * @param {array} [props.rules=[]] Filter rules.
     * @param {object} [state] Filter states.
     * @param {boolean} [state.paginate] If the Filter should paginate the result.
     * @param {object} [callbacks] Callbacks:
     * @param {object} [callbacks.limit] Limit callback:
     * @param {function} [callbacks.limit.function] Limit callback function.
     * @param {*} [callbacks.limit.params] Limit callback function params.
     * @param {object} [callbacks.next] Next callback:
     * @param {function} [callbacks.next.function] Next callback function.
     * @param {*} [callbacks.next.params] Next callback function params.
     * @param {object} [callbacks.order] Order callback:
     * @param {function} [callbacks.order.function] Order callback function.
     * @param {*} [callbacks.order.params] Order callback function params.
     * @param {object} [callbacks.paginate] Paginate callback:
     * @param {function} [callbacks.paginate.function] Paginate callback function.
     * @param {*} [callbacks.paginate.params] Paginate callback function params.
     * @param {object} [callbacks.run] Run callback:
     * @param {function} [callbacks.run.function] Run callback function.
     * @param {*} [callbacks.run.params] Run callback function params.
     * @param {*} [data=[]] Data to filter.
     * @memberof Filter
     */
    constructor (props = {
        id: 'filter-1',
        limit: false,
        order: [],
        rules: [],
    }, state = {
        paginate: false,
    }, callbacks = {
        limit: {
            function: function (params) { /* console.log(params.result) */ },
            params: {},
    }, next: {
            function: function (params) { /* console.log(params.result) */ },
            params: {},
    }, order: {
            function: function (params) { /* console.log(params.result) */ },
            params: {},
    }, paginate: {
            function: function (params) { /* console.log(params.result) */ },
            params: {},
    }, reset: {
            function: function (params) { /* console.log(params.filterJS.result) */ },
            params: {},
    }, run: {
            function: function (params) { /* console.log(params.filterJS.result) */ },
            params: {},
    }}, data = []) {
        super({ ...Filter.props, ...props }, { ...Filter.state, ...state });
        this.setCallbacks({ ...Filter.callbacks, ...callbacks });
        this.parseLimit();
        this.parseOrder();
        this.parseRules();
        this.setData(data);
        this.setPages();
    }

    /**
     * * Set the Filter data.
     * @param {*} data Data to filter.
     * @memberof Filter
     */
    setData (data = []) {
        this.data = data;
    }

    /**
     * * Set the Filtered result pages.
     * @param {object|string} pages Class properties.
     * @param {*} [value=null] Class property value.
     * @memberof Filter
     */
    setPages () {
        this.setProps('page', Page.generate(this));
    }

    /**
     * * Load the following amount of data.
     * @returns {array} Next result row data.
     * @memberof Filter
     */
    next () {
        let response = {
            current: this.result,
        }
        if (this.state.paginate) {
            response.result = this.result;
            response.current = this.props.page.next(this.result);
        }
        this.execute('next', {
            filterJS: this,
            ...response,
        });
        return response;
    }

    /**
     * * Set the Filter Limit.
     * @memberof Filter
     */
    parseLimit () {
        this.setProps('limit', Limit.generate(this));
    }

    /**
     * * Set the Filter Order.
     * @memberof Filter
     */
    parseOrder () {
        this.setProps('order', Order.generate(this));
    }

    /**
     * * Set the Filter Rules.
     * @memberof Filter
     */
    parseRules () {
        this.setProps('rules', Rule.generate(this));
    }

    /**
     * * Reset the Filter.
     * @returns {array} A reset result data.
     * @memberof Filter
     */
    reset () {
        for (const rule of this.props.rules) {
            rule.reset();
        }
        result = this.run();
        this.execute('reset', {
            filterJS: this,
        });
        return result;
    }

    /**
     * * Run the filter function.
     * @returns {array} Data filtered.
     * @memberof Filter
     */
    run () {
        this.setData(this.props.order.run(this.data));
        this.result = [];
        if (this.data.length) {
            if (this.props.rules.length) {
                for (const data of this.data) {
                    let status = {
                        data: data,
                        valid: true,
                    };
                    for (const rule of this.props.rules) {
                        if (status.valid) {
                            status = rule.check(status);
                        }
                    }
                    if (status.valid) {
                        this.result.push(status.data);
                    }
                }
            } else {
                this.result = this.data;
            }
        } else {
            this.result = [];
        }
        let response;
        if (this.state.paginate) {
            this.result = this.props.page.run(this.result);
            response = {
                result: this.result,
                current: this.result[this.props.page.props.current - 1],
            };
        }
        if (!this.state.paginate) {
            this.result = this.props.limit.run(this.result);
            response = {
                current: this.result,
            };
        }
        this.execute('run', {
            filterJS: this,
            ...response,
        });
        return response;
    }

    /** 
     * @static
     * @var {object} props Default props
     */
    static props = {
        id: 'filter-1',
        limit: false,
        order: [],
        rules: [],
    }
    
    /** 
     * @static
     * @var {object} state Default state
     */
    static state = {
        paginate: false,
    }
    
    /** 
     * @static
     * @var {object} callbacks Default callbacks
     */
    static callbacks = {
        limit: {
            function: function (params) { /* console.log(params.result) */ },
            params: {},
    }, next: {
            function: function (params) { /* console.log(params.result) */ },
            params: {},
    }, order: {
            function: function (params) { /* console.log(params.result) */ },
            params: {},
    }, paginate: {
            function: function (params) { /* console.log(params.result) */ },
            params: {},
    }, reset: {
            function: function (params) { /* console.log(params.filterJS.result) */ },
            params: {},
    }, run: {
            function: function (params) { /* console.log(params.filterJS.result) */ },
            params: {},
    }}
}

// ? Filter childs
Filter.Control = Control;
Filter.Limit = Limit;
Filter.Order = Order;
Filter.Page = Page;
Filter.Rule = Rule;

// ? Default export
export default Filter;