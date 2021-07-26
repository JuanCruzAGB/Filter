// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js"

/**
 * * Input controls the Filter buttons.
 * @export
 * @class Input
 * @author Juan Cruz Armentia <juancarmentia@gmail.com>
 * @extends Class
 */
export default class Input extends Class {
    /**
     * * Creates an instance of Input.
     * @param {object} [props]
     * @param {string} [props.id='input-1'] Primary kety.
     * @param {string} [props.target=false]
     * @param {array} [props.values] Default value.
     * @param {string} [props.type='rule']
     * @param {HTMLElement[]} [htmls] HTML Elements.
     * @param {Order|Rule} parent
     * @param {Filter} Filter
     * @memberof Input
     */
    constructor (props = {
        id: 'input-1',
        target: false,
        values: [null],
        type: 'rule',
    }, state = {
        active: false,
    }, htmls = [], parent, Filter) {
        super({ ...Input.props, ...props }, { ...Input.state, ...state });
        this.setHTMLs(htmls, parent, Filter);
    }

    /**
     * * Set the Input HTML Elements.
     * @param {HTMLElement[]} htmls
     * @param {Order|Rule} parent
     * @param {Filter} Filter
     * @memberof Input
     */
    setHTMLs (htmls = undefined, parent, Filter) {
        if (!this.htmls) {
            this.htmls = [];
        }
        if (htmls) {
            for (const html of htmls) {
                this.htmls.push(html);
            }
            this.setHTMLEvents(Filter);
        }
    }

    /**
     * * Set the Input HTML Elements events.
     * @param {Filter} filter Parent Filter.
     * @memberof Input
     */
    setHTMLEvents (Filter) {
        let instance = this;
        for (const html of this.htmls) {
            switch (html.nodeName) {
                case 'INPUT':
                    switch (html.type.toUpperCase()) {
                        case 'RADIO':
                        case 'CHECKBOX':
                            html.addEventListener('change', function (e) {
                                instance.setValue();
                                Filter.run();
                            })
                            break;
                        case 'RANGE':
                            html.addEventListener('input', function (e) {
                                instance.setValue();
                                Filter.run();
                            })
                            break;
                        case 'NUMBER':
                        case 'SEARCH':
                            html.addEventListener('keyup', function (e) {
                                instance.setValue();
                                Filter.run();
                            })
                            break;
                        default:
                            console.error(`TODO: INPUT TYPE: ${ html.type.toUpperCase() }`);
                            console.error(`Input type: ${ html.type } does not have event`);
                            break;
                    }
                    break;
                default:
                    console.error(`HTML Element: ${ html.type } does not have event`);
                    break;
            }
        }
    }

    /**
     * * Change the Input value.
     * @memberof Input
     */
    setValue () {
        if (typeof this.props.values !== 'null') {
            this.setProps('values', []);
        }
        for (const html of this.htmls) {
            switch (html.nodeName) {
                case 'INPUT':
                    switch (html.type.toUpperCase()) {
                        case 'CHECKBOX':
                        case 'RADIO':
                            if (html.checked) {
                                if (this.props.type === "order") {
                                    this.setState("active", true);
                                }
                                if (this.props.type === "rule") {
                                    this.props.values.push(html.value);
                                }
                            }
                            break;
                        case 'NUMBER':
                        case 'RANGE':
                            this.props.values.push(html.value);
                            break;
                        case 'SEARCH':
                            if (html.value !== '') {
                                this.props.values.push({ regex: html.value });
                            }
                            break;
                        default:
                            console.error(`TODO: INPUT TYPE: ${ html.type.toUpperCase() }`);
                            break;
                    }
                    break;
                default:
                    console.error(`TODO: ${ html.nodeName }`);
                    break;
            }
        }
    }

    /**
     * * Returns the Input active state.
     * @returns {boolean}
     * @memberof Input
     */
    getActiveState () {
        if (this.htmls.length) {
            for (const html of this.htmls) {
                if (html.checked) {
                    this.setState("active", true);
                    return true;
                }
            }
            this.setState("active", false);
            return false;
        }
        return this.state.active;
    }

    /**
     * * Reset the Input.
     * @memberof Input
     */
    reset () {
        console.warn("TODO: RESET CONTROL");
    }

    /**
     * * Get the Input HTML Element.
     * @static
     * @param {string} targetWanted Input target wanted.
     * @param {string} typeWanted Input type wanted.
     * @param {Rule} parent Parent Rule.
     * @param {Filter} Filter Parent Filter.
     * @returns {Input|Input[]}
     * @memberof Input
     */
    static generate (parent, Filter) {
        let target, type, values;
        if (/order-/.exec(parent.props.id)) {
            target = parent.props.by;
            type = 'order';
            values = [parent.props.value];
        }
        if (/rule-/.exec(parent.props.id)) {
            target = parent.props.target;
            type = 'rule';
            values = [...parent.props.values];
        }
        let htmls = [];
        for (const html of Input.querySelector(Filter.props.id)) {
            let name = html.dataset.name;
            if (/\[/.exec(name)) {
                name = name.split('[').pop();
            }
            if (name === target.split(".").shift().split(":").shift()) {
                if (html.classList.contains(type)) {
                    htmls.push(html);
                }
            }
        }
        return new this({
            id: `${ parent.props.id }-input`,
            target: target,
            values: values,
            type: type,
        }, {
            active: parent.state.active,
        }, htmls, parent, Filter);
    }

    /**
     * * Input HTML Element query selector.
     * @static
     * @param {string} id_filter
     * @returns {HTMLElement[]}
     * @memberof Input
     */
    static querySelector (id_filter) {
        return document.querySelectorAll(`.${ id_filter }.filter-input`);
    }

    /** 
     * @static
     * @var {object} props Default props
     */
    static props = {
        id: 'input-1',
        target: false,
        values: [null],
    }

    /** 
     * @static
     * @var {object} state Default state
     */
    static state = {
        active: true,
    }
}