class Slider {
  public $elem: JQuery<HTMLElement>;

  constructor() {
    this.$elem = $('<div class="slider js-slider"></div>');
  }
}

export default Slider;
