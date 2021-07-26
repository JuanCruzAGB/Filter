// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js";

export default class Page extends Class {
    /**
     * * Creates an instance of Page.
     * @param {object} [props] Page properties:
     * @param {number} [props.current=1] Current page.
     * @param {number} [props.length=1] Pages length.
     * @param {number} [props.limit=1] Limites data.
     * @param {object} [callback] Page callback:
     * @param {function} [callback.function] Page callback function.
     * @param {*} [callback.params] Page callback function params.
     * @memberof Page
     */
    constructor (props = {
        current: 1,
        length: 1,
        limit: 1,
    }, callback = {
        function: function (params) { /* console.log(params.result) */ },
        params: {},
    }) {
        super({  ...Page.props, ...props });
        this.setCallbacks({ default: { ...Page.callback, ...callback } });
    }

    /**
     * * Returns the next page of data.
     * @param {array} data
     * @returns {array}
     * @memberof Page
     */
    next (data = []) {
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const row = data[key];
                if (parseInt(key) + 1 >= this.props.current) {
                    data = row;
                    this.pages.setProps('current', parseInt(key) + 1);
                    break;
                }
            }
        }
        return data[this.props.current - 1];
    }

    /**
     * * Paginate the data.
     * @returns {array} Data paginated.
     * @memberof Filter
     */
    run (data = []) {
        let result = [], row = [], key = 0, length = 1;
        if (this.props.limit) {
            this.setProps('length', parseInt(data.length / this.props.limit));
            if (this.props.length % 1 > 0) {
                this.setProps('length', this.props.length + 1);
            }
        }
        for (const entry of data) {
            if (this.props.limit) {
                if (key < this.props.limit) {
                    row.push(entry);
                    if (length === data.length) {
                        result.push(row);
                    }
                    key++;
                    length++;
                } else {
                    result.push(row);
                    row = [entry];
                    key = 1;
                    length++;
                }
            }
            if (!this.props.limit) {
                result.push(entry);
            }
        }
        this.execute('default', {
            result: result,
        });
        return result;
    }

    /**
     * * Generate all the Order.
     * @static
     * @param {Filter} filter Parent Filter.
     * @returns {Order[]}
     * @memberof Rule
     */
    static generate (filter) {
        return new this({
            current: 1,
            length: 1,
            limit: filter.props.limit.props.length,
        }, { ...filter.callbacks.paginate });
    }

    /** 
     * @static
     * @var {object} props Default props
     */
    static props = {
        current: 1,
        length: 1,
        limit: 1,
    }

    /** 
     * @static
     * @var {object} callback Default callback
     */
    static callback = {
        function: function (params) { /* console.log(params.result) */ },
        params: {},
    }
}