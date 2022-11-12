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
    const array = [];

    if (frequency > 0) {
      const firstElem = document.createElement('div');
      firstElem.classList.add('slider__scale-elem', 'js-slider__scale-elem');
      firstElem.textContent = String(min);
      array.push(firstElem);
      for (let i = 1; i < frequency; i++) {
        const cycleElem = document.createElement('div');
        cycleElem.classList.add('slider__scale-elem', 'js-slider__scale-elem');
        cycleElem.textContent = String(Math.round((min + i * ((max - min) / frequency)) / step) * step);
        array.push(cycleElem);
      }
      const lastElem = document.createElement('div');
      lastElem.classList.add('slider__scale-elem', 'js-slider__scale-elem');
      lastElem.textContent = String(max);
      array.push(lastElem);
    } else {
      const elem = document.createElement('div');
      elem.classList.add('slider__scale-elem', 'js-slider__scale-elem');
      elem.textContent = String(Math.round((min + (max - min) / 2) / step) * step);
      array.push(elem);
    }
    return array;
  };

  public removeScale(): void {
    const children = this.container.querySelectorAll('.slider__scale-elem');
    children.forEach((item) => item.remove());
  }
}

export default Scale;
