/**
 * * Order controls the Filter Order.
 * @export
 * @class Order
 */
export class Order{
    /**
     * * Creates an instance of Order.
     * @param {HTMLElement} html Filter Order button HTML Element.
     * @param {Filter} filter Parent Filter.
     * @memberof Order
     */
    constructor(html = undefined, filter = undefined){
        this.setHTML(html);
        this.setProperties();
        this.setEvent(filter);
    }

    /**
     * * Set the Order properties.
     * @memberof Order
     */
    setProperties(){
        this.properties = {};
        this.setBy();
        this.setType();
    }

    /**
     * * Returns the Order properties.
     * @returns {Object} The Order properties.
     * @memberof Order
     */
    getProperties(){
        return this.properties;
    }

    /**
     * * Set the Order by.
     * @memberof Order
     */
    setBy(){
        this.properties.by = undefined;
        if(this.getHTML().dataset.by){
            this.properties.by = this.getHTML().dataset.by;
        }
    }

    /**
     * * Returns the Order by.
     * @returns {String} The Order by.
     * @memberof Order
     */
    getBy(){
        return this.properties.by;
    }

    /**
     * * Set the Order type.
     * @memberof Order
     */
    setType(){
        this.properties.type = 'ASC';
        if(this.getHTML().dataset.type){
            this.properties.type = this.getHTML().dataset.type.toUpperCase();
        }
    }

    /**
     * * Returns the Order type.
     * @returns {String} The Order type.
     * @memberof Order
     */
    getType(){
        return this.properties.type;
    }

    /**
     * * Set the Order HTML Element.
     * @param {HTMLElement} html Filter Order button HTML Element.
     * @memberof Order
     */
    setHTML(html = undefined){
        this.html = html;
        for (const child of this.getHTML().children) {
            if(child.classList.contains('filter-icon')){
                this.icon = child;
            }
        }
    }

    /**
     * * Returns the Order HTML Element.
     * @returns {HTMLElement} The Order HTML Element.
     * @memberof Order
     */
    getHTML(){
        return this.html;
    }

    /**
     * * Set the HTML Element event.
     * @param {Filter} filter Parent Filter.
     * @memberof Order
     */
    setEvent(filter = undefined){
        let instance = this;
        this.getHTML().addEventListener('click', function(e){
            e.preventDefault();
            instance.changeType();
            if(instance.icon){
                instance.changeIcon();
            }
            instance.change(filter);
        });
    }

    /**
     * * Execute the Filter changeOrder function.
     * @param {Filter} filter Parent Filter.
     * @memberof Order
     */
    change(filter = undefined){
        filter.changeOrder({
            by: this.getBy(),
            type: this.getType(),
        });
        filter.executeEvent();
    }

    /**
     * * Change the HTML Element type.
     * @memberof Order
     */
    changeType(){
        if(this.getType() == 'ASC'){
            this.properties.type = 'DESC';
            this.getHTML().dataset.type = 'DESC';
        }else if(this.getType() == 'DESC'){
            this.properties.type = 'ASC';
            this.getHTML().dataset.type = 'ASC';
        }
    }

    /**
     * * Change the Filter icon.
     * @memberof Order
     */
    changeIcon(){
        if(this.icon.classList.contains('fa-chevron-up')){
            this.icon.classList.remove('fa-chevron-up');
            this.icon.classList.add('fa-chevron-down');
        }else if(this.icon.classList.contains('fa-chevron-down')){
            this.icon.classList.remove('fa-chevron-down');
            this.icon.classList.add('fa-chevron-up');
        }
    }
}