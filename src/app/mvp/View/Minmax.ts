class Minmax {
  public elemMax: HTMLElement;

  public elemMin: HTMLElement;

  constructor() {
    this.elemMin = document.createElement('div');
    this.elemMin.classList.add('slider__min', 'js-slider__min');
    this.elemMax = document.createElement('div');
    this.elemMax.classList.add('slider__max', 'js-slider__max');
  }
}

export default Minmax;
