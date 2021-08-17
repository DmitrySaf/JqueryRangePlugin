class View {
    bar : HTMLElement;

    slider : HTMLElement;

    minSlider : HTMLElement;

    container : JQuery<HTMLElement>;

    constructor(container: JQuery<HTMLElement>) {
        this.slider = document.createElement('div');
        this.bar = document.createElement('div');
        this.minSlider = document.createElement('span');
        this.container = container;
        this.init();
    }

    init() {
        this.addClasses();
        this.appendSlider();
    }

    addClasses() {
        this.slider.classList.add('slider');
        this.bar.classList.add('bar');
        this.minSlider.classList.add('value-to');
    }

    appendSlider() {
        this.container.append(this.slider);
        this.slider.append(this.bar);
        this.slider.append(this.minSlider);
    }
}

export { View };
