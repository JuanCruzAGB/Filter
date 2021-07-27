// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js"

// ? FilterJS repository.
import Input from "./Input.js";
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
export default class Filter extends Class {
    /**
     * * Creates an instance of Filter.
     * @param {object} [props]
     * @param {string} [props.id='filter-1'] Primary key.
     * @param {array} [props.order=[]]
     * @param {number} [props.limit=false] Maximum amount of filtered data to display.
     * @param {array} [props.rules=[]]
     * @param {object} [state]
     * @param {boolean} [state.paginate] If should paginate the result.
     * @param {object} [callbacks]
     * @param {object} [callbacks.limit]
     * @param {function} [callbacks.limit.function]
     * @param {*} [callbacks.limit.params]
     * @param {object} [callbacks.next]
     * @param {function} [callbacks.next.function]
     * @param {*} [callbacks.next.params]
     * @param {object} [callbacks.order]
     * @param {function} [callbacks.order.function]
     * @param {*} [callbacks.order.params]
     * @param {object} [callbacks.paginate]
     * @param {function} [callbacks.paginate.function]
     * @param {*} [callbacks.paginate.params]
     * @param {object} [callbacks.run]
     * @param {function} [callbacks.run.function]
     * @param {*} [callbacks.run.params]
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
        this.setLimit();
        this.setOrder();
        this.setRules();
        this.setData(data);
        this.setPages();
        // console.log(this);
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
     * * Change the Filter data.
     * @param {*} [data=[]] Data to filter.
     * @memberof Filter
     */
    changeData (data) {
        this.setData(data);
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
    setLimit () {
        this.setProps('limit', Limit.generate(this));
    }

    /**
     * * Set the Filter Order.
     * @memberof Filter
     */
    setOrder () {
        this.setProps('order', Order.generate(this));
    }

    /**
     * * Set the Filter Rules.
     * @memberof Filter
     */
    setRules () {
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
        this.setData(this.data.sort(Order.sort(this)));
        this.result = [];
        if (this.data.length) {
            if (this.props.rules.length) {
                let data = [...this.data];
                for (const rule of this.props.rules) {
                    data = rule.check(data);
                }
                this.result = data;
            } else {
                this.result = [...this.data];
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

    // ? Filter childs
    static Input = Input;
    static Limit = Limit;
    static Order = Order;
    static Page = Page;
    static Rule = Rule;
}