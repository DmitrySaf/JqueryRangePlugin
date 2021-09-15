
class Filler {

    elem: JQuery<HTMLElement>;

    constructor() {
        this.elem = $(`<div class="slider__filler js-slider__filler"></div>`);
    }
}

export { Filler }