class Dot {
  public $elemFirst: JQuery<HTMLElement>;

  public $valueFirst: JQuery<HTMLElement>;

  public $elemSecond: JQuery<HTMLElement>;

  public $valueSecond: JQuery<HTMLElement>;

  constructor() {
    this.$elemFirst = $(`<div class="slider__dot-wrapper_order_first js-slider__dot-wrapper_order_first">
        <span class="slider__dot"></span>
        <div class="slider__dot-value_order_first js-slider__dot-value_order_first"></div>
      </div>`);
    this.$elemSecond = $(`
      <div class="slider__dot-wrapper_order_second js-slider__dot-wrapper_order_second">
        <span class="slider__dot"></span>
        <div class="slider__dot-value_order_second js-slider__dot-value_order_second"></div>
      </div>`);
    this.$valueFirst = this.$elemFirst.find('.js-slider__dot-value_order_first');
    this.$valueSecond = this.$elemSecond.find('.js-slider__dot-value_order_second');
  }
}

export default Dot;
