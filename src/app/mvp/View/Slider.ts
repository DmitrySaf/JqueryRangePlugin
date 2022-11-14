class Slider {
  public elem: HTMLElement;

  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('slider', 'js-slider');
  }
}

export default Slider;
