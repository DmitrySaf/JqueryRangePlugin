
class Bar {

    elem: JQuery<HTMLElement>;

    width: number;

    constructor() {
        this.elem = $(`<div class="slider__bar js-slider__bar"></div>`);
        this.width = this.elem.width() as number;
    }
}

export { Bar }