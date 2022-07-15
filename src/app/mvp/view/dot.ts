class Dot {
    public $elemFirst: JQuery<HTMLElement>;

    public $valueFirst: JQuery<HTMLElement>;

    public $elemSecond: JQuery<HTMLElement>;

    public $valueSecond: JQuery<HTMLElement>;

    constructor() {
        this.$elemFirst = $(`<div class="slider__dot_wrapper_first js-slider__dot_wrapper_first">
                <span class="slider__dot slider__dot_first js-slider__dot_first"></span>
                <div class="slider__dot_first_value js-slider__dot_first_value"></div>
            </div>`);
        this.$elemSecond = $(`<div class="slider__dot_wrapper_second js-slider__dot_wrapper_second">
                <span class="slider__dot slider__dot_second js-slider__dot_second"></span>
                <div class="slider__dot_second_value js-slider__dot_second_value"></div>
            </div>`);
        this.$valueFirst = this.$elemFirst.find('.js-slider__dot_first_value');
        this.$valueSecond = this.$elemSecond.find('.js-slider__dot_second_value');
    }
}

export { Dot };
