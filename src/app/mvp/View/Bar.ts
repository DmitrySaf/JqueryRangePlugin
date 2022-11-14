class Bar {
  public elem: HTMLElement;

  public filler: HTMLElement;

  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('slider__bar', 'js-slider__bar');
    this.filler = document.createElement('div');
    this.filler.classList.add('slider__filler', 'js-slider__filler');
    this.elem.append(this.filler);
  }
}

export default Bar;
