class SetMin {
    container : HTMLElement;

    slider : HTMLElement;

    constructor() {
        this.container = document.createElement('div');
        this.slider = document.createElement('input');
        this.container.setAttribute('value', '0');
    }
}

export { SetMin };
