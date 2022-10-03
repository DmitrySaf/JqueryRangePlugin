class Scale {
  public $container: JQuery<HTMLElement>;

  public $elem: JQuery<HTMLElement>;

  constructor() {
    this.$container = $('<div class="slider__scale_container js-slider__scale_container"></div>');
    this.$elem = $('<div class="slider__scale_elem js-slider__scale_elem"></div>');
  }

  public createElemsArray = (frequency: number, min: number, max: number, step: number): JQuery<HTMLElement>[] => {
    const array = [];

    if (frequency > 1) {
      array.push($(`
                <div class="slider__scale_elem js-slider__scale_elem">${min}</div>
            `));
      for (let i = 1; i < (frequency - 1); i++) {
        array.push($(`
                    <div class="slider__scale_elem js-slider__scale_elem">
                    ${Math.round((min + i * ((max - min) / (frequency - 1))) / step) * step}
                    </div>
                `));
      }
      array.push($(`
                <div class="slider__scale_elem js-slider__scale_elem">${max}</div>
            `));
    } else {
      array.push($(`
                <div class="slider__scale_elem js-slider__scale_elem">
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
