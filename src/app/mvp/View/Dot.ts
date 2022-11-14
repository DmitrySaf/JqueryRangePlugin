class Dot {
  public elem: HTMLElement;

  public value: HTMLElement;

  private dot: HTMLElement;

  constructor(order: string) {
    this.dot = document.createElement('span');
    this.dot.classList.add('slider__dot');
    this.value = document.createElement('div');
    this.value.classList.add(`slider__dot-value_order_${order}`, `js-slider__dot-value_order_${order}`);
    this.elem = document.createElement('div');
    this.elem.classList.add(
      'slider__dot-wrapper',
      `slider__dot-wrapper_order_${order}`,
      `js-slider__dot-wrapper_order_${order}`
    );
    this.elem.append(this.dot, this.value);
  }
}

export default Dot;
