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
 * @author Juan Cruz Armentia <juan.cruz.armentia@gmail.com>
 * @extends Class
 */
export default class Filter extends Class {
    /**
     * * Creates an instance of Filter.
     * @param {object} [data]
     * @param {object} [data.props]
     * @param {string} [data.props.id='filter-1'] Primary key.
     * @param {array} [data.props.order=[]]
     * @param {number} [data.props.limit=false] Maximum amount of filtered data to display.
     * @param {array} [data.props.rules=[]]
     * @param {object} [data.state]
     * @param {boolean} [data.state.paginate] If should paginate the result.
     * @param {object} [data.callbacks]
     * @param {object} [data.callbacks.limit]
     * @param {function} [data.callbacks.limit.function]
     * @param {*} [data.callbacks.limit.params]
     * @param {object} [data.callbacks.next]
     * @param {function} [data.callbacks.next.function]
     * @param {*} [data.callbacks.next.params]
     * @param {object} [data.callbacks.order]
     * @param {function} [data.callbacks.order.function]
     * @param {*} [data.callbacks.order.params]
     * @param {object} [data.callbacks.paginate]
     * @param {function} [data.callbacks.paginate.function]
     * @param {*} [data.callbacks.paginate.params]
     * @param {object} [data.callbacks.run]
     * @param {function} [data.callbacks.run.function]
     * @param {*} [data.callbacks.run.params]
     * @param {*} [data.data=[]] Data to filter.
     * @memberof Filter
     */
    constructor (data = {
        props: {
            id: 'filter-1',
            limit: false,
            order: [],
            rules: [],
        }, state: {
            paginate: false,
        }, callbacks: {
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
            },
        }, data: [],
    }) {
        super({ ...Filter.props, ...((data && data.hasOwnProperty('props')) ? data.props : {}) }, { ...Filter.state, ...((data && data.hasOwnProperty('state')) ? data.state : {}) });
        this.setCallbacks({ ...Filter.callbacks, ...((data && data.hasOwnProperty('callbacks')) ? data.callbacks : {}) });
        this.setLimit();
        this.setOrder();
        this.setRules();
        this.setData([ ...((data && data.hasOwnProperty('data')) ? data.data : []) ]);
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
     * * Load the following amount of data.
     * @param {object} [params]
     * @returns {array} Next result row data.
     * @memberof Filter
     */
    next (params = {}) {
        let response = {
            current: this.result,
        }
        if (this.state.paginate) {
            response.result = this.result;
            response.current = this.props.page.next(this.result);
        }
        this.execute('next', {
            ...params,
            ...this.callbacks.next.params,
            Filter: this,
            ...response,
        });
        return response;
    }

    /**
     * * Reset the Filter.
     * @param {object} [params]
     * @returns {array} A reset result data.
     * @memberof Filter
     */
    reset (params = {}) {
        for (const rule of this.props.rules) {
            rule.reset();
        }
        result = this.run();
        this.execute('reset', {
            ...params,
            ...this.callbacks.reset.params,
            Filter: this,
        });
        return result;
    }

    /**
     * * Run the filter function.
     * @param {object} [params]
     * @returns {array} Data filtered.
     * @memberof Filter
     */
    run (params = {}) {
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
            ...params,
            ...this.callbacks.run.params,
            Filter: this,
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
        },
    }

    // ? Filter childs
    static Input = Input;
    static Limit = Limit;
    static Order = Order;
    static Page = Page;
    static Rule = Rule;
}