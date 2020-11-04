/**
 * * Button controls the Filter buttons.
 * @export
 * @class Button
 */
export class Button{
    /**
     * * Creates an instance of Button.
     * @param {Object} properties Button Properties.
     * @param {String} properties.id Button ID.
     * @param {String} properties.target Button target.
     * @param {HTMLElement} html Button HTML Element.
     * @param {Rule} rule Parent Rule.
     * @param {Filter} filter Parent Filter.
     * @memberof Button
     */
    constructor(properties = {
        id: 'filter-id',
        target: undefined,
    }, html = null, rule = null, filter = null){
        this.setHTML(html, properties);
        this.setProperties(properties, rule, filter);
        this.setStates();
        this.checkRegExp();
    }

    /**
     * * Set the Button properties.
     * @param {Object} properties Button Properties.
     * @param {String} properties.id Button ID.
     * @param {String} properties.target Button target.
     * @param {Rule} rule Parent Rule.
     * @param {Filter} filter Parent Filter.
     * @memberof Button
     */
    setProperties(properties = {
        id: 'filter-id',
        target: undefined,
    }, rule = null, filter = null){
        this.properties = {};
        this.originalProperties = {};
        this.setId(properties);
        this.setTarget(properties);
        this.setType(rule, filter);
        this.setValue();
        this.setName();
    }

    /**
     * * Returns the Button properties.
     * @returns {Object} The Button properties.
     * @memberof Button
     */
    getProperties(){
        return this.properties;
    }

    /**
     * * Set the Button states.
     * @memberof Button
     */
    setStates(){
        this.states = {};
        switch(this.getType()){
            case 'checkbox':
                this.setChecked();
                break;
            case 'select':
                this.setSelected();
                break;
            default:
                this.setActive();
                break;
        }
    }

    /**
     * * Returns the Button states.
     * @returns {Object} The Button states.
     * @memberof Button
     */
    getStates(){
        return this.states;
    }

    /**
     * * Set the Button ID.
     * @param {Object} properties Button Properties.
     * @param {String} properties.id Button ID.
     * @memberof Button
     */
    setId(properties = {
        id: 'filter-id',
    }){
        if (properties.hasOwnProperty('id')) {
            this.properties.id = properties.id;
        } else {
            this.properties.id = 'filter-id';
        }
    }

    /**
     * * Returns the Button ID.
     * @returns {String} The Button ID.
     * @memberof Button
     */
    getId(){
        return this.properties.id;
    }

    /**
     * * Set the Button target.
     * @param {Object} properties Button Properties.
     * @param {String} properties.target Button target.
     * @memberof Button
     */
    setTarget(properties = {
        target: undefined,
    }){
        if (properties.hasOwnProperty('target')) {
            this.properties.target = properties.target;
        } else {
            this.properties.target = undefined;
        }
    }

    /**
     * * Returns the Button target.
     * @returns {String} The Button target.
     * @memberof Button
     */
    getTarget(){
        return this.properties.target;
    }

    /**
     * * Set the Button value.
     * @memberof Button
     */
    setValue(){
        this.properties.value = undefined;
        this.originalProperties.value = undefined;
        switch(this.getType()){
            case 'checkbox':
                if (this.getHTML().value) {
                    this.properties.value = this.getHTML().value;
                    this.originalProperties.value = this.getHTML().value;
                }
                break;
            case 'select':
                if (this.getHTML().value) {
                    this.properties.value = this.getHTML().value;
                    this.originalProperties.value = this.getHTML().value;
                }
                break;
            default:
                if (this.getHTML().value) {
                    this.properties.value = this.getHTML().value;
                    this.originalProperties.value = this.getHTML().value;
                }
                break;
        }
    }

    /**
     * * Returns the Button value.
     * @returns {*} The Button value.
     * @memberof Button
     */
    getValue(){
        return this.properties.value;
    }

    /**
     * * Set the Button name.
     * @memberof Button
     */
    setName(){
        this.properties.name = this.getHTML().dataset.name;
    }

    /**
     * * Returns the Button name.
     * @returns {String} The Button name.
     * @memberof Button
     */
    getName(){
        return this.properties.name;
    }

    /**
     * * Set the Button Active state.
     * @memberof Button
     */
    setActive(){
        if (this.getHTML().classList.contains('active')) {
            this.states.active = true;
        } else {
            this.states.active = false;
        }
    }

    /**
     * * Returns the Button active state.
     * @returns {Boolean} The Button active state.
     * @memberof Button
     */
    getActive(){
        return this.states.active;
    }

    /**
     * * Set the Button selected state.
     * @memberof Button
     */
    setSelected(){
        this.states.selected = [];
        for(const option of this.getHTML().children){
            if (option.selected) {
                this.states.selected.push(option);
            }
        }
    }

    /**
     * * Returns the Button selected state.
     * @returns {Array} The Button selected state.
     * @memberof Button
     */
    getSelected(){
        return this.states.selected;
    }

    /**
     * * Set the Button checked state.
     * @memberof Button
     */
    setChecked(){
        if (this.getHTML().checked) {
            this.states.checked = true;
        } else {
            this.states.checked = false;
        }
    }

    /**
     * * Returns the Button checked state.
     * @returns {Boolean} The Button checked state.
     * @memberof Button
     */
    getChecked(){
        return this.states.checked;
    }

    /**
     * * Set the Button HTML Element.
     * @param {HTMLElement} html Button HTML Element.
     * @memberof Button
     */
    setHTML(html = null){
        this.html = html;
        // if(!this.getHTML().dataset.filter){
        //     this.getHTML().dataset.filter = properties.id;
        // }else{
        //     this.getHTML().dataset.filter = this.getHTML().dataset.filter + ',' + properties.id;
        // }
    }

    /**
     * * Returns the Button HTML Element.
     * @returns {HTMLElement} The Button HTML Element.
     * @memberof Button
     */
    getHTML(){
        return this.html;
    }

    /**
     * * Set the Button type.
     * @param {Rule} rule Parent Rule.
     * @param {Filter} filter Parent Filter.
     * @memberof Button
     */
    setType(rule = null, filter = null){
        if(this.getHTML().classList.contains('filter-button')){
            this.properties.type = 'button';
            this.setButtonEvent(rule, filter);
        }else if(this.getHTML().classList.contains('filter-select')){
            this.properties.type = 'select';
            this.setSelectEvent(rule, filter);
        }else if(this.getHTML().classList.contains('filter-checkbox')){
            this.properties.type = 'checkbox';
            this.setCheckboxEvent(rule, filter);
        }else if(this.getHTML().classList.contains('filter-search')){
            this.properties.type = 'search';
            this.setSearchEvent(rule, filter);
        }
    }

    /**
     * * Returns the Button type.
     * @returns {String} The Button type.
     * @memberof Button
     */
    getType(){
        return this.properties.type;
    }

    /**
     * * Returns the Button RegExp.
     * @returns {RegExp} The Button "Is there a RegExp?" boolean.
     * @memberof Button
     */
    getRegExp(){
        return this.properties.regexp;
    }

    /**
     * * Set the Button type = 'button' event.
     * @param {Rule} rule Parent Rule.
     * @param {Filter} filter Parent Filter.
     * @memberof Button
     */
    setButtonEvent(rule = null, filter = null){
        let btn = this;
        this.getHTML().addEventListener('click', function(e){
            let click = true;
            // if(this.dataset.filter && this.dataset.filter.split(',')){
            //     let filtersId = this.dataset.filter.split(',');
            //     for(const key in filtersId){
            //         if(filtersId.hasOwnProperty(key)){
            //             const filterId = filtersId[key];
            //             if(filterId == btn.getId() && (key + 1) == filtersId.length){
            //                 click = false;
            //             }
            //         }
            //     }
            // }
            if(!this.classList.contains('active') && click){
                rule.changeValue(this.dataset.name);
                rule.setActiveState(this);
            }
            filter.executeEvent(btn);
        });
    }

    /**
     * * Set the Button type = 'text' event.
     * @param {Rule} rule Parent Rule.
     * @param {Filter} filter Parent Filter.
     * @memberof Button
     */
    setSearchEvent(rule = null, filter = null){
        let input = this;
        this.getHTML().addEventListener('keyup', function(e){
            rule.changeValue(this.dataset.name);
            filter.executeEvent(input);
        });
    }

    /**
     * * Set the Button type = 'select' event.
     * @param {Rule} rule Parent Rule.
     * @param {Filter} filter Parent Filter.
     * @memberof Button
     */
    setSelectEvent(rule = null, filter = null){
        let select = this;
        this.getHTML().addEventListener('change', function(e){
            rule.changeValue(this.dataset.name);
            filter.executeEvent(select);
        });
    }

    /**
     * * Set the Button type = 'checkbox' event.
     * @param {Rule} rule Parent Rule.
     * @param {Filter} filter Parent Filter.
     * @memberof Button
     */
    setCheckboxEvent(rule = null, filter = null){
        let btn = this;
        this.getHTML().addEventListener('change', function(e){
            rule.changeValue(this.dataset.name, this.name);
            filter.executeEvent(btn);
        });
    }

    /**
     * * Reset the Button.
     * @param {Rule} rule Parent Rule.
     * @memberof Button
     */
    reset(rule = null){
        switch(this.getType()){
            case 'checkbox':
                this.properties.value = this.originalProperties.value; 
                if (this.originalProperties.value !== undefined) {
                    this.getHTML().value = this.originalProperties.value; 
                }
                if(this.states.checked){
                    this.getHTML().checked = true;
                }else{
                    this.getHTML().checked = false;
                }
                break;
            case 'select':
                this.properties.value = this.originalProperties.value; 
                if (this.originalProperties.value !== undefined) {
                    this.getHTML().value = this.originalProperties.value; 
                }
                if(this.states.selected.length){
                    for(const selected of this.states.selected){
                        let select = false;
                        for(const option of this.getHTML().children){
                            if(option == selected){
                                select = true;
                            }
                        }
                        selected.selected = select;
                    }
                }else{
                    for(const option of this.getHTML().children){
                        option.selected = false;
                    }
                }
                break;
            default:
                this.properties.value = this.originalProperties.value;
                if (this.originalProperties.value !== undefined) {
                    this.getHTML().value = this.originalProperties.value;
                }
                if(this.states.active){
                    rule.setActiveState(this.getHTML());
                }
                break;
        }
    }

    /**
     * * Check if the Button is a RegExp.
     * @memberof Button
     */
    checkRegExp(){
        if(this.getHTML().classList.contains('filter-regexp')){
            this.properties.regexp = true;
        }
    }

    /**
     * * Get the Button HTML Element.
     * @static
     * @param {String} targetWanted Button target wanted.
     * @param {String} typeWanted Button type wanted.
     * @param {Rule} rule Parent Rule.
     * @param {Filter} filter Parent Filter.
     * @returns {Array} Array of Buttons.
     * @memberof Button
     */
    static getHTML(targetWanted = undefined, typeWanted = undefined, rule = undefined, filter = undefined){
        this.btns = [];
        let btns = [];
        switch (typeWanted) {
            case 'search':
                let html = document.querySelector('.filter-search');
                html.dataset.target = targetWanted;
                btns.push(new this({id: filter.getId(), target: targetWanted,}, html, rule, filter));
                break;
            default:
                let htmls = document.querySelectorAll('.filter[data-target]');
                for(const html of htmls){
                    let targets = html.dataset.target.split(',');
                    for(const target of targets){
                        if(target == targetWanted){
                            btns.push(new this({id: filter.getId(), target: targetWanted,}, html, rule, filter));
                        }
                    }
                }
                break;
        }
        return btns;
    }
}