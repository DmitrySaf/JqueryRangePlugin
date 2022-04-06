class Minmax {
    public elemMax: JQuery<HTMLElement>;

    public elemMin: JQuery<HTMLElement>;

    constructor() {
        this.elemMin = $('<div class="slider__min js-slider__min"></div>');
        this.elemMax = $('<div class="slider__max js-slider__max"></div>');
    }
}

export { Minmax };
