// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js";

/**
 * * Page controls the filter pagination.
 * @export
 * @class Page
 * @author Juan Cruz Armentia <juan.cruz.armentia@gmail.com>
 * @extends Class
 */
export default class Page extends Class {
    /**
     * * Creates an instance of Page.
     * @param {object} [data.data]
     * @param {object} [data.props]
     * @param {number} [data.props.current=1] Current page.
     * @param {number} [data.props.length=1] Pages length.
     * @param {number} [data.props.limit=1] Limites data.
     * @param {object} [data.s]
     * @param {function} [data.callbacks.function]
     * @param {*} [data.callbacks.params]
     * @memberof Page
     */
    constructor (data = {
        props: {
            current: 1,
            length: 1,
            limit: false,
        }, callbacks: {
            default: {
                function: function (params) { /* console.log(params.result) */ },
                params: {},
            },
        },
    }) {
        super({  ...Page.props, ...((data && data.hasOwnProperty('props')) ? data.props : {}) });
        this.setCallbacks({ ...Page.callbacks, ...((data && data.hasOwnProperty('callbacks')) ? data.callbacks : {}) });
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
     * @param {Filter} Filter Parent Filter.
     * @returns {Order[]}
     * @memberof Rule
     */
    static generate (Filter) {
        return new this({
            props: {
                current: 1,
                length: 1,
                limit: (Filter.props.limit && Filter.props.limit.hasOwnProperty('props') && Filter.props.limit.props.hasOwnProperty('limit')) ? Filter.props.limit.props.limit : false,
            }, callbacks: {
                default: {
                    ...Filter.callbacks.paginate,
                },
            },
        });
    }

    /** 
     * @static
     * @var {object} props Default props
     */
    static props = {
        current: 1,
        length: 1,
        limit: false,
    }

    /** 
     * @static
     * @var {object} callbacks Default callback
     */
    static callbacks = {
        default: {
            function: function (params) { /* console.log(params.result) */ },
            params: {},
        },
    }
}