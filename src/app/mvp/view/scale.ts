class Scale {
  public container: HTMLElement;

  public elem: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('slider__scale', 'js-slider__scale');
    this.elem = document.createElement('div');
    this.elem.classList.add('slider__scale-elem', 'js-slider__scale-elem');
  }

  public createElemsArray = (frequency: number, min: number, max: number, step: number): HTMLElement[] => {
    if (frequency > 0) {
      const array = [];
      for (let i = 1; i < frequency; i++) {
        array.push(this.createElement(
          +(Math.round((min + i * ((max - min) / frequency)) / step) * step).toFixed(2)
        ));
      }
      return [this.createElement(min), ...array, this.createElement(max)];
    }
    return [this.createElement(Math.round((min + (max - min) / 2) / step) * step)];
  };

  public removeScale(): void {
    const children = this.container.querySelectorAll('.slider__scale-elem');
    children.forEach((item) => item.remove());
  }

  private createElement = (value: number) => {
    const elem = document.createElement('div');
    elem.classList.add('slider__scale-elem', 'js-slider__scale-elem');
    elem.textContent = String(value);
    elem.setAttribute('data-value', String(value));
    return elem;
  };
}

export default Scale;
