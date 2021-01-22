// * FilterJS repository.
import { Rule } from "./Rule.js";
import { Order } from "./Order.js";

/**
 * * Filter makes an excellent filter.
 * @export
 * @class Filter
 */
export class Filter{
    /**
     * * Creates an instance of Filter.
     * @param {Object} properties Filter Properties.
     * @param {String} properties.id ID.
     * @param {Object} properties.order Order properties.
     * @param {String} properties.order.by Element to order by.
     * @param {ASC|DESC} properties.order.type Type of order.
     * @param {*} properties.order.btn If the order has buttons.
     * @param {Number|false} properties.limit Maximum amount of filtered data to display.
     * TODO @param {*} properties.pagination.
     * @param {String|false} properties.resetOnRule Reset the Rules when one is called.
     * @param {Object} properties.event Callback event.
     * @param {function} properties.event.function Callback function.
     * @param {*} properties.event.params Callback function params.
     * @param {Object} states States.
     * @param {Array} rules Array of properties from Rules.
     * @param {*} data Data to filter.
     * @memberof Filter
     */
    constructor(properties = {
        id: 'filter-1',
        order: {
            by: undefined,
            type: 'DESC',
            btn: false,
        }, limit: false,
        pagination: false,
        resetOnRule: false,
        event: {
            function: undefined,
            params: {
                //
            },
        },
    }, states = {},
    rules = [{
        target: undefined,
        comparator: '=',
        value: undefined,
    }], data = []){
        this.setProperties(properties);
        this.setStates(states);
        this.setRules(rules);
        this.setData(data);
    }

    /**
     * * Set the Filter properties.
     * @param {Object} properties Filter Properties.
     * @param {String} properties.id ID.
     * @param {Object} properties.order Order properties.
     * @param {String} properties.order.by Element to order by.
     * @param {ASC|DESC} properties.order.type Type of order.
     * @param {*} properties.order.btn If the order has buttons.
     * @param {Number|false} properties.limit Maximum amount of filtered data to display.
     * TODO @param {*} properties.pagination.
     * @param {String|false} properties.resetOnRule Reset the Rules when one is called.
     * @param {Object} properties.event Callback event.
     * @param {function} properties.event.function Callback function.
     * @param {*} properties.event.params Callback function params.
     * @memberof Filter
     */
    setProperties(properties = {
        id: 'filter-1',
        order: {
            by: undefined,
            type: 'DESC',
            btn: false,
        }, limit: false,
        pagination: false,
        resetOnRule: false,
        event: {
            function: undefined,
            params: {
                //
            },
        },
    }){
        this.properties = {};
        this.setId(properties);
        this.setOrder(properties);
        this.setLimit(properties);
        this.setEvent(properties);
        this.setResetOnRule(properties);
        this.setPagination(properties);
    }

    /**
     * * Returns the Filter properties.
     * @returns {Object} The Filter properties.
     * @memberof Filter
     */
    getProperties(){
        return this.properties;
    }

    /**
     * * Set the Filter states.
     * @param {Object} states States.
     * @memberof Filter
     */
    setStates(states = {
        //
    }){
        this.states = {};
    }

    /**
     * * Returns the Filter states.
     * @returns {Object} The Filter states.
     * @memberof Filter
     */
    getStates(){
        return this.states;
    }

    /**
     * * Set the Filter rules.
     * @param {Array} rules Array of properties from Rules.
     * @memberof Filter
     */
    setRules(rules = [{
        target: undefined,
        comparator: '=',
        value: undefined,
    }]){
        this.rules = [];
        if(rules && rules.length){
            for(const rule of rules){
                this.rules.push(new Rule(rule, this));
            }
        }
    }

    /**
     * * Returns the Filter rules.
     * @returns {Object} The Filter rules.
     * @memberof Filter
     */
    getRules(){
        return this.rules;
    }

    /**
     * * Set the Filter data.
     * @param {*} data Data to filter.
     * @memberof Filter
     */
    setData(data = undefined){
        this.data = data;
    }

    /**
     * * Returns the Filter data.
     * @returns {Object} The Filter data.
     * @memberof Filter
     */
    getData(){
        return this.data;
    }

    /**
     * * Set the Filter ID.
     * @param {Object} properties Filter Properties.
     * @param {String} properties.id ID.
     * @memberof Filter
     */
    setId(properties = {
        id: 'filter-1',
    }){
        if (properties.hasOwnProperty('id')) {
            this.properties.id = properties.id;
        } else {
            this.properties.id = 'filter-1';
            
        }
    }

    /**
     * * Returns the Filter id.
     * @returns {String} The Filter id.
     * @memberof Filter
     */
    getId(){
        return this.properties.id;
    }

    /**
     * * Set the Filter "Reset on execute a Rule" boolean.
     * @param {Object} properties Filter Properties.
     * @param {String|false} properties.resetOnRule Reset the Rules when one is called.
     * @memberof Filter
     */
    setResetOnRule(properties = {
        resetOnRule: false,
    }){
        if (properties.hasOwnProperty('resetOnRule')) {
            this.properties.resetOnRule = properties.resetOnRule;
        } else {
            this.properties.resetOnRule = false;
        }
    }

    /**
     * * Returns the Filter "Reset on execute a Rule" boolean.
     * @returns {String|false} The Filter "Reset on execute a Rule" boolean.
     * @memberof Filter
     */
    getResetOnRule(){
        return this.properties.resetOnRule;
    }

    /**
     * * Set the Filter callback event.
     * @param {Object} properties Filter Properties.
     * @param {Object} properties.event Callback event.
     * @param {function} properties.event.function Callback function.
     * @param {*} properties.event.params Callback function params.
     * @memberof Filter
     */
    setEvent(properties = {
        event: {
            function: undefined,
            params: {
                //
            },
        }
    }){
        if(properties.hasOwnProperty('event')){
            this.properties.event = {
                function: properties.event.function,
                params: properties.event.params,
            };
        }else{
            this.properties.event = {
                function: function(params){ /* console.log(params.data) */ },
                params: {
                    //
                },
            };
        }
    }

    /**
     * * Returns the Filter event.
     * @returns {Object} The Filter event.
     * @memberof Filter
     */
    getEvent(){
        return this.properties.event;
    }

    /**
     * * Set the Filter order.
     * @param {Object} properties Filter Properties.
     * @param {Object} properties.order Order properties.
     * @param {String} properties.order.by Element to order by.
     * @param {ASC|DESC} properties.order.type Type of order.
     * @param {*} properties.order.btn If the order has buttons.
     * @memberof Filter
     */
    setOrder(properties = {
        order: {
            by: undefined,
            type: 'DESC',
            btn: false,
        },
    }){
        this.properties.order = {
            by: undefined,
            type: 'DESC',
            btn: false,
        };
        if (properties.hasOwnProperty('order')) {
            if(properties.order.hasOwnProperty('by')){
                this.properties.order.by = properties.order.by;
            }
            if(properties.order.hasOwnProperty('type')){
                this.properties.order.type = properties.order.type;
            }
            if(properties.order.hasOwnProperty('btn')){
                this.properties.order.buttons = [];
                for(const btn of document.querySelectorAll(`.filter-${this.getId()}.filter-order`)){
                    this.properties.order.buttons.push(new Order(btn, this));
                }
            }
        }
    }

    /**
     * * Returns the Filter order.
     * @returns {Object} The Filter order properties.
     * @memberof Filter
     */
    getOrder(){
        return this.properties.order;
    }

    /**
     * * Set the Filter limit.
     * @param {Object} properties Filter Properties.
     * @param {Number|false} properties.limit Maximum amount of filtered data to display.
     * @memberof Filter
     */
    setLimit(properties = {
        limit: false,
    }){
        if (properties.hasOwnProperty('limit')) {
            this.properties.limit = properties.limit;
        } else {
            this.properties.limit = false;
        }
    }

    /**
     * * Returns the Filter limit.
     * @returns {Number|false} The Filter Maximum amount of filtered data to display.
     * @memberof Filter
     */
    getLimit(){
        return this.properties.limit;
    }

    /**
     * * Set the Filter pagination.
     * @param {Boolean} properties Filter Properties.
     * TODO @param {*} properties.pagination Filter "Is thera pagination?" bolean.
     * @memberof Filter
     */
    setPagination(properties = {
        pagination: false,
    }){
        if (properties.hasOwnProperty('pagination')) {
            this.properties.pagination = properties.pagination;
        } else {
            this.properties.pagination = false;
        }
    }

    /**
     * * Returns the Filter pagination.
     * @returns {Boolean} The Filter "Is thera pagination?" bolean.
     * @memberof Filter
     */
    getPagination(){
        return this.properties.pagination;
    }

    /**
     * * Set the filtered data pages.
     * @memberof Filter
     */
    setPages(){
        if((this.filteredData.length / this.getLimit()) % 1 === 0){
            this.pages = this.filteredData.length / this.getLimit();
        }else{
            this.pages = parseInt(this.filteredData.length / this.getLimit()) + 1;
        }
    }

    /**
     * * Returns the Filter pages.
     * @returns {Number} The Filter number of pages.
     * @memberof Filter
     */
    getPages(){
        return this.properties.pagination;
    }

    /**
     * * Prepare the filter function.
     * @returns {Array} Data filtered.
     * @memberof Filter
     */
    execute(){
        this.order();
        this.filteredData = [];
        this.currentPage = 1;
        if(this.getData().length){
            if(this.getRules().length){
                for (const data of this.getData()) {
                    let status = {
                        data: data,
                        valid: true,
                    };
                    for(const rule of this.getRules()){
                        if(status.valid){
                            status = rule.check(status);
                        }
                    }
                    if(status.valid){
                        this.filteredData.push(data);
                    }
                }
            }else{
                this.filteredData = this.getData();
            }
        }else{
            this.filteredData = [];
        }
        return this.limit();
    }

    /**
     * * Filter the data.
     * @param {String} type Type of filtration.
     * @param {Array} auxData Array to push the data filtered.
     * @memberof Filter
     */
    filter(type = '', auxData = []){
        for(const data of this.getData()){
            if(data.hasOwnProperty(rule.target)){
                let value;
                if(type == 'object'){
                    const element = data[rule.target];
                    for(const iterator of element){
                        if(iterator.hasOwnProperty(rule_key)){
                            value = iterator[rule_key];
                        }
                    }
                }else{
                    value = data[rule.target];
                }
                if(this.checkComparator(rule, rule_value, value)){
                    this.count++;
                    auxData.push(data);
                }
            }
        }
    }

    /**
     * * Order the data.
     * @memberof Filter
     */
    order(){
        switch(this.getOrder().type.toUpperCase()){
            case 'DESC':
                this.orderDesc();
                break;
            case 'ASC':
                this.orderAsc();
                break;
        }
    }

    /**
     * * Execute the Filter callback event.
     * @param {Button|undefined} button Who executes the filter.
     * @memberof Filter
     */
    executeEvent(button = undefined){
        if (this.properties.hasOwnProperty('event')) {
            let params = this.getEvent().params;
            params.executedBy = button;
            this.checkResetOnRule(button);
            params.data = this.execute();
            this.getEvent().function(params);
        }
    }

    /**
     * * Order the data ascendly.
     * @memberof Filter
     */
    orderAsc(){
        this.setData(this.getData().sort(this.orderAscFunction((this.getOrder()))));
    }

    /**
     * * Order the data descendly.
     * @memberof Filter
     */
    orderDesc(){
        this.setData(this.getData().sort(this.orderAscFunction((this.getOrder()))));
        this.setData(this.getData().reverse());
    }

    /**
     * * The order ascending function.
     * @param {Object} order Filter order property.
     * @param {String} order.by Element to order by.
     * @returns {Number} Data position.
     * @memberof Filter
     */
    orderAscFunction(order = {
        by: undefined,
    }){
        return function(a, b) {
            if(/:/.exec(order.by)){
                let elementName = order.by.split(':').shift();
                let by = order.by.split(':').pop();
                if(a.hasOwnProperty(elementName)){
                    let element = a[elementName];
                    if(element.hasOwnProperty(by)){
                        let aValue = a[elementName][by],
                            bValue = b[elementName][by];
                        if(typeof aValue == 'string'){
                            if(aValue){
                                aValue = aValue.toUpperCase();
                            }
                            if(bValue){
                                bValue = bValue.toUpperCase();
                            }
                        }
                        if(aValue < bValue){
                            return -1;
                        }
                        if(aValue > bValue){
                            return 1;
                        }
                    }
                }
                return 0;
            }else{
                if(a.hasOwnProperty(order.by)){
                    let aValue = a[order.by],
                        bValue = b[order.by];
                    if(typeof aValue == 'string'){
                        if(aValue){
                            aValue = aValue.toUpperCase();
                        }
                        if(bValue){
                            bValue = bValue.toUpperCase();
                        }
                    }
                    if(aValue < bValue){
                        return -1;
                    }
                    if(aValue > bValue){
                        return 1;
                    }
                }
                return 0;
            }
        }
    }

    /**
     * * Limit the data.
     * @returns {Array} Data limited.
     * @memberof Filter
     */
    limit(){
        let returnData = [];
        let auxData = [];
        let column = 1;
        let count = 1;
        this.setPages();
        for(const data of this.filteredData){
            if(column <= this.getLimit() || !this.getLimit()){
                auxData.push(data);
                if(count == this.filteredData.length){
                    returnData.push(auxData);
                }
                column++;
                count++;
            }else{
                returnData.push(auxData);
                column = 1;
                auxData = [];
                auxData.push(data);
                column++;
                count++;
            }
            if(!this.getLimit()){
                returnData.push(auxData);
            }
        }
        return returnData[this.currentPage - 1];
    }

    /**
     * * Load the following amount of data.
     * @returns {Boolean} An Error.
     * @memberof Filter
     */
    next(){
        if(this.currentPage < Math.ceil(this.filteredData.length / this.getLimit())){
            this.currentPage++;
            let thereIsNext = true;
            if(this.currentPage >= Math.ceil(this.filteredData.length / this.getLimit())){
                thereIsNext = false;
            }
            return {
                thereIsNext: thereIsNext,
                data: this.limit(),
            };
        }else{
            return false;
        }
    }

    /**
     * * Reset the Filter.
     * @returns {Array} A reset data filtered.
     * @memberof Filter
     */
    reset(){
        for(const rule of this.getRules()){
            rule.reset(this.getId());
        }
        return this.execute();
    }

    /**
     * * Change a Rule value.
     * @param {String} name Button name.
     * @param {*} value Button value.
     * @memberof Rule
     */
    changeValue(name = undefined, value = undefined){
        for(const rule of this.getRules()){
            rule.changeValue(name, value);
        }
    }

    /**
     * * Change the Filter data.
     * @param {Object} newData New data to filter.
     * @memberof Filter
     */
    changeData(newData){
        this.setData(newData);
    }

    /**
     * * Change the Filter order.
     * @param {Object} order Order properties.
     * @param {String} order.by Element to order by.
     * @param {ASC|DESC} order.type Type of order.
     * @memberof Filter
     */
    changeOrder(order = {
        by: undefined,
        type: 'DESC',
    }){
        this.properties.order = {
            by: undefined,
            type: 'DESC'
        };
        if(order.by){
            this.properties.order.by = order.by;
        }
        if(order.type){
            this.properties.order.type = order.type;
        }
    }

    /**
     * * Check if the Filter has the "Reset on execute a Rule" boolean.
     * @param {Button} button Button.
     * @memberof Filter
     */
    checkResetOnRule(button){
        if (this.getResetOnRule()) {
            if (button.properties.target == this.getResetOnRule()) {
                for (const rule of this.getRules()) {
                    if (rule.getTarget() != this.getResetOnRule()) {
                        rule.reset();
                    }
                }
            }
        }
    }

    /**
     * * Check what if the Rule type.
     * @param {Rule} rule Rule.
     * @returns {Array}.
     * @memberof Filter
     */
    checkType(rule){
        let auxData = [];
        switch(typeof rule.value){
            case 'object':
                for(const rule_element of rule.value){
                    for(const rule_key in rule_element){
                        if(rule_element.hasOwnProperty(rule_key)){
                            const rule_value = rule_element[rule_key];
                            for(const data of this.getData()){
                                if(data.hasOwnProperty(rule.target)){
                                    this.filter('object', auxData);
                                }
                            }
                        }
                    }
                }
                break;
            default:
                this.filter('default', auxData);
                break;
        }
        return auxData;
    }
}