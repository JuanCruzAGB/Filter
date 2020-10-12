/**
 * * Order controls the Filter Order.
 * @export
 * @class Order
 */
export class Order{
    /**
     * * Creates an instance of Order.
     * @param {HTMLElement} html - Filter Order HTML Element.
     * @param {Filter} filter - Filter.
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
     * * Set the Order by.
     * @memberof Order
     */
    setBy(){
        this.properties.by = undefined;
        if(this.html.dataset.by){
            this.properties.by = this.html.dataset.by;
        }
    }

    /**
     * * Set the Order type.
     * @memberof Order
     */
    setType(){
        this.properties.type = 'ASC';
        if(this.html.dataset.type){
            this.properties.type = this.html.dataset.type.toUpperCase();
        }
    }

    /**
     * * Set the Order HTML Element.
     * @param {HTMLElement} html - Filter Order HTML Element.
     * @memberof Order
     */
    setHTML(html = undefined){
        this.html = html;
        for (const child of this.html.children) {
            if(child.classList.contains('filter-icon')){
                this.icon = child;
            }
        }
    }

    /**
     * * Set the HTML Element event.
     * @param {Filter} filter - Filter.
     * @memberof Order
     */
    setEvent(filter = undefined){
        let instance = this;
        this.html.addEventListener('click', function(e){
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
     * @param {FIlter} filter - Filter.
     * @memberof Order
     */
    change(filter = undefined){
        filter.changeOrder({
            by: this.properties.by,
            type: this.properties.type,
        });
        filter.executeEvent();
    }

    /**
     * * Change the HTML Element type.
     * @memberof Order
     */
    changeType(){
        if(this.properties.type == 'ASC'){
            this.properties.type = 'DESC';
            this.html.dataset.type = 'DESC';
        }else if(this.properties.type == 'DESC'){
            this.properties.type = 'ASC';
            this.html.dataset.type = 'ASC';
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