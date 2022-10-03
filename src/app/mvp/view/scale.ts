class Scale {
  public $container: JQuery<HTMLElement>;

  public $elem: JQuery<HTMLElement>;

  constructor() {
    this.$container = $('<div class="slider__scale js-slider__scale"></div>');
    this.$elem = $('<div class="slider__scale-elem js-slider__scale-elem"></div>');
  }

  public createElemsArray = (frequency: number, min: number, max: number, step: number): JQuery<HTMLElement>[] => {
    const array = [];

    if (frequency > 1) {
      array.push($(`
        <div class="slider__scale-elem js-slider__scale-elem">${min}</div>
      `));
      for (let i = 1; i < (frequency - 1); i++) {
        array.push($(`
          <div class="slider__scale-elem js-slider__scale-elem">
          ${Math.round((min + i * ((max - min) / (frequency - 1))) / step) * step}
          </div>
        `));
      }
      array.push($(`
        <div class="slider__scale-elem js-slider__scale-elem">${max}</div>
      `));
    } else {
      array.push($(`
        <div class="slider__scale-elem js-slider__scale-elem">
        ${Math.round((min + (max - min) / 2) / step) * step}
        </div>
      `));
    }
    return array;
  };

  public removeScale(): void {
    $(this.$container.children()).remove();
  }
}

export { Scale };
