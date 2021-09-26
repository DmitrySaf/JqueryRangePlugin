class Bar {

    elem: JQuery<HTMLElement>;

    filler: JQuery<HTMLElement>;

    constructor() {
        this.elem = $(`<div class="slider__bar js-slider__bar"></div>`);
        this.filler = $(`<div class="slider__filler js-slider__filler"></div>`);
        this.elem.append(this.filler);
    }
}

export { Bar }