// ? JuanCruzAGB repository
import Class from "../../JuanCruzAGB/js/Class.js"

/**
 * * Control controls the Filter buttons.
 * @export
 * @class Control
 * @author Juan Cruz Armentia <juancarmentia@gmail.com>
 * @extends Class
 */
export class Control extends Class {
    /**
     * * Creates an instance of Control.
     * @param {object} [props] Control properties:
     * @param {string} [props.id='control-1'] Control primary kety.
     * @param {string} [props.target=false] Control target.
     * @param {*} [props.value=null] Control default value.
     * @param {string} [props.type='rule'] Control type.
     * @param {Rule} rule Parent Rule.
     * @param {Filter} filter Parent Filter.
     * @memberof Control
     */
    constructor (props = {
        id: 'control-1',
        target: false,
        value: null,
        type: 'rule',
    }, state = {
        active: false,
    }, rule, filter) {
        super({ ...Control.props, ...props }, { ...Control.state, ...state });
        this.setHTMLs(rule, filter);
    }

    /**
     * * Set the Control HTML Elements.
     * @param {Rule} rule Parent Rule.
     * @param {Filter} filter Parent Filter.
     * @memberof Control
     */
    setHTMLs (rule, filter) {
        if (!this.htmls) {
            this.htmls = [];
        }
        for (const html of document.querySelectorAll(`.filter-control.${ filter.props.id }.${ rule.props.id }`)) {
            this.htmls.push(html);
        }
        this.setHTMLEvents(filter);
    }

    /**
     * * Set the Control HTML Elements events.
     * @param {Filter} filter Parent Filter.
     * @memberof Control
     */
     setHTMLEvents (filter) {
        let instance = this;
        for (const html of this.htmls) {
            switch (html.nodeName) {
                case 'INPUT':
                    switch (html.type.toUpperCase()) {
                        case 'CHECKBOX':
                            html.addEventListener('change', function (e) {
                                instance.setValue();
                                filter.run();
                            })
                            break;
                        case 'RANGE':
                            html.addEventListener('input', function (e) {
                                instance.setValue();
                                filter.run();
                            })
                            break;
                        case 'SEARCH':
                            html.addEventListener('keyup', function (e) {
                                instance.setValue();
                                filter.run();
                            })
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
     * * Change the Control value.
     * @memberof Control
     */
    setValue () {
        if (typeof this.props.value !== 'null') {
            this.setProps('value', []);
        }
        for (const html of this.htmls) {
            switch (html.nodeName) {
                case 'INPUT':
                    switch (html.type.toUpperCase()) {
                        case 'CHECKBOX':
                            if (html.checked) {
                                console.log(html.value);
                                this.props.value.push(html.value);
                            }
                            break;
                        case 'RANGE':
                            this.props.value.push(html.value);
                            break;
                        case 'SEARCH':
                            if (html.value !== '') {
                                this.props.value.push({ regex: html.value });
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
     * * Reset the Control.
     * @memberof Control
     */
    reset () {
        console.warn("TODO: RESET CONTROL");
    }

    /**
     * * Get the Control HTML Element.
     * @static
     * @param {string} targetWanted Control target wanted.
     * @param {string} typeWanted Control type wanted.
     * @param {Rule} parent Parent Rule.
     * @param {Filter} filter Parent Filter.
     * @returns {Array} Array of Controls.
     * @memberof Control
     */
    static generate (parent, filter) {
        return new this({
            target: parent.props.target,
            value: parent.props.value,
            type: (/rule-/.exec(parent.props.id) ? 'rule' : 'order'),
        }, {
            active: parent.props.value,
        }, parent, filter);
    }

    /** 
     * @static
     * @var {object} props Default props
     */
    static props = {
        id: 'control-1',
        target: false,
        value: null,
    }

    /** 
     * @static
     * @var {object} state Default state
     */
    static state = {
        active: false,
    }
}

// ? Default export
export default Control;