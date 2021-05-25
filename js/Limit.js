// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js";

export class Limit extends Class {
    /**
     * * Creates an instance of Limit.
     * @param {object} [props] Limit properties:
     * @param {number} [props.length=false] Limit length.
     * @param {object} [callback] Limit callback:
     * @param {function} [callback.function] Limit callback function.
     * @param {*} [callback.params] Limit callback function params.
     * @memberof Limit
     */
    constructor (props = {
        length: false,
    }, callback = {
        function: function (params) { /* console.log(params.result) */ },
        params: {},
    }) {
        super({  ...Limit.props, ...props });
        this.setCallbacks({ default: { ...Limit.callback, ...callback } });
    }

    /**
     * * Limit the data.
     * @returns {array} Data limited.
     * @memberof Filter
     */
    run (data = []) {
        let result = [];
        if (this.props.length) {
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    const entry = data[key];
                    if (!entry.length) {
                        if (parseInt(key) < this.props.length) {
                            result.push(entry);
                        }
                    }
                }
            }
        }
        if (!this.props.length) {
            result = data; 
        }
        this.execute('default', {
            result: result,
        });
        return result;
    }

    /**
     * * Generate all the Limit.
     * @static
     * @param {Filter} filter Parent Filter.
     * @returns {Limit}
     * @memberof Rule
     */
    static generate (filter) {
        return new this({
            length: filter.props.limit,
        }, { ...filter.callbacks.limit });
    }

    /** 
     * @static
     * @var {object} props Default props
     */
    static props = {
        length: false,
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

// ? Default export
export default Limit;