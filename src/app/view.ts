export class SetMin {
    slider : HTMLElement;
    constructor(slider: HTMLElement) {
        this.slider = slider
    }

    setMin() {
        this.slider.setAttribute('min', '100');
    }
}