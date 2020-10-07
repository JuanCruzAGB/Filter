/**
 * * Button controls the Filter buttons.
 * @export
 * @class Button
 */
export class Button{
    /**
     * * Creates an instance of Button.
     * @param {HTMLElement} html - Button HTML Element.
     * @param {Rule} rule - The Rule.
     * @param {Filter} filter - The Filter.
     * @memberof Button
     */
    constructor(properties = {
        id: 'filter-id',
    }, html = null, rule = null, filter = null){
        this.setHTML(html, properties);
        this.setType(rule, filter);
        this.setProperties(properties);
        this.setStates();
        this.checkRegExp();
    }

    /**
     * * Set the Button properties.
     * @memberof Button
     */
    setProperties(properties = {
        id: 'filter-id',
    }){
        this.properties = {};
        this.originalProperties = {};
        this.setId(properties);
        this.setValue();
        this.setName();
    }

    setStates(){
        this.states = {};
        switch(this.type){
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

    setId(properties = {
        id: 'filter-id',
    }){
        this.properties.id = properties.id;
    }

    /**
     * * Set the Button value.
     * @memberof Button
     */
    setValue(){
        this.properties.value = undefined;
        this.originalProperties.value = undefined;
        switch(this.type){
            case 'checkbox':
                if(this.html.value){
                    this.properties.value = this.html.value;
                    this.originalProperties.value = this.html.value;
                }
                break;
            case 'select':
                if(this.html.value){
                    this.properties.value = this.html.value;
                    this.originalProperties.value = this.html.value;
                }
                break;
            default:
                if(this.html.value){
                    this.properties.value = this.html.value;
                    this.originalProperties.value = this.html.value;
                }
                break;
        }
    }

    /**
     * * Set the Button name.
     * @memberof Button
     */
    setName(){
        this.properties.name = this.html.dataset.name;
    }

    setActive(){
        if(this.html.classList.contains('active')){
            this.states.active = true;
        }else{
            this.states.active = false;
        }
    }

    setSelected(){
        this.states.selected = [];
        for(const option of this.html.children){
            if(option.selected){
                this.states.selected.push(option);
            }
        }
    }

    setChecked(){
        if(this.html.checked){
            this.states.checked = true;
        }else{
            this.states.checked = false;
        }
    }

    /**
     * * Set the Button HTML Element.
     * @param {HTMLElement} html - Button HTML Element.
     * @param {object} proeprties - Button properties.
     * @memberof Button
     */
    setHTML(html = null, properties = {
        id: 'filter-id'
    }){
        this.html = html;
        if(!this.html.dataset.filter){
            this.html.dataset.filter = properties.id;
        }else{
            this.html.dataset.filter = this.html.dataset.filter + ',' + properties.id;
        }
    }

    /**
     * * Set the Button type.
     * @param {Rule} rule - The Rule.
     * @param {Filter} filter - The Filter.
     * @memberof Button
     */
    setType(rule = null, filter = null){
        if(this.html.classList.contains('filter-button')){
            this.type = 'button';
            this.setButtonEvent(rule, filter);
        }else if(this.html.classList.contains('filter-select')){
            this.type = 'select';
            this.setSelectEvent(rule, filter);
        }else if(this.html.classList.contains('filter-checkbox')){
            this.type = 'checkbox';
            this.setCheckboxEvent(rule, filter);
        }else if(this.html.classList.contains('filter-search')){
            this.type = 'search';
            this.setSearchEvent(rule, filter);
        }
    }

    /**
     * * Set the Button type = 'button' event.
     * @param {Rule} rule - The Rule.
     * @param {Filter} filter - The Filter.
     * @memberof Button
     */
    setButtonEvent(rule = null, filter = null){
        let btn = this;
        this.html.addEventListener('click', function(e){
            let click = true;
            if(this.dataset.filter && this.dataset.filter.split(',')){
                let filtersId = this.dataset.filter.split(',');
                for(const key in filtersId){
                    if(filtersId.hasOwnProperty(key)){
                        const filterId = filtersId[key];
                        if(filterId == btn.properties.id && (key + 1) == filtersId.length){
                            click = false;
                        }
                    }
                }
            }
            if(!this.classList.contains('active') && click){
                rule.changeValue(this.dataset.name);
                rule.setActiveState(this);
            }
            if(rule.properties.hasOwnProperty('event')){
                let params = rule.properties.event.params;
                params.data = filter.execute();
                rule.properties.event.function(params);
            }
        });
    }

    /**
     * * Set the Button type = 'text' event.
     * @param {Rule} rule - The Rule.
     * @param {Filter} filter - The Filter.
     * @memberof Button
     */
    setSearchEvent(rule = null, filter = null){
        this.html.addEventListener('keyup', function(e){
            rule.changeValue(this.dataset.name);
            if(rule.properties.hasOwnProperty('event')){
                let params = rule.properties.event.params;
                params.data = filter.execute();
                rule.properties.event.function(params);
            }
        });
    }

    /**
     * * Set the Button type = 'select' event.
     * @param {Rule} rule - The Rule.
     * @param {Filter} filter - The Filter.
     * @memberof Button
     */
    setSelectEvent(rule = null, filter = null){
        this.html.addEventListener('change', function(e){
            rule.changeValue(this.dataset.name);
            if(rule.properties.hasOwnProperty('event')){
                let params = rule.properties.event.params;
                params.data = filter.execute();
                rule.properties.event.function(params);
            }
        });
    }

    /**
     * * Set the Button type = 'checkbox' event.
     * @param {Rule} rule - The Rule.
     * @param {Filter} filter - The Filter.
     * @memberof Button
     */
    setCheckboxEvent(rule = null, filter = null){
        this.html.addEventListener('change', function(e){
            rule.changeValue(this.dataset.name, this.name);
            if(rule.properties.hasOwnProperty('event')){
                let params = rule.properties.event.params;
                params.data = filter.execute();
                rule.properties.event.function(params);
            }
        });
    }

    /**
     * * Reset the Button.
     * @param {Rule} rule - The Rule.
     * @memberof Button
     */
    reset(rule = null){
        switch(this.type){
            case 'checkbox':
                this.properties.value = this.originalProperties.value; 
                this.html.value = this.originalProperties.value; 
                if(this.states.checked){
                    this.html.checked = true;
                }else{
                    this.html.checked = false;
                }
                break;
            case 'select':
                this.properties.value = this.originalProperties.value; 
                this.html.value = this.originalProperties.value; 
                if(this.states.selected.length){
                    for(const selected of this.states.selected){
                        let select = false;
                        for(const option of this.html.children){
                            if(option == selected){
                                select = true;
                            }
                        }
                        selected.selected = select;
                    }
                }else{
                    for(const option of this.html.children){
                        option.selected = false;
                    }
                }
                break;
            default:
                this.properties.value = this.originalProperties.value;
                this.html.value = this.originalProperties.value;
                if(this.states.active){
                    rule.setActiveState(this.html);
                }
                break;
        }
    }

    /**
     * * Check if the Button is a RegExp.
     * @memberof Button
     */
    checkRegExp(){
        if(this.html.classList.contains('filter-regexp')){
            this.properties.regexp = true;
        }
    }

    /**
     * * Get the Button HTML Element.
     * @static
     * @param {string} targetWanted - Button target.
     * @param {string} typeWanted - Button type.
     * @returns
     * @memberof Button
     */
    static getHTML(targetWanted = undefined, typeWanted = undefined){
        let filters = [];
        switch (typeWanted) {
            case 'search':
                let html = document.querySelector('.filter-search');
                html.dataset.target = targetWanted;
                filters.push(html);
                break;
            default:
                let htmls = document.querySelectorAll('.filter[data-target]');
                for(const html of htmls){
                    let targets = html.dataset.target.split(',');
                    for(const target of targets){
                        if(target == targetWanted){
                            filters.push(html);
                        }
                    }
                }
                break;
        }
        return filters;
    }
}