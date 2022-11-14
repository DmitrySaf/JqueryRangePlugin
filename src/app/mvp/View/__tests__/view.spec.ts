import View from '../View';
import { defaultOptions } from '../../../options';

const mockCoords = { from: 2001, to: 6000 };

describe('View', () => {
  const elem = document.createElement('input');
  elem.setAttribute('id', 'range');
  document.body.append(elem);
  const view = new View(elem, defaultOptions);
  const getSliderElems = () => ({
    input: document.body.querySelector('input#range') as HTMLElement,
    slider: document.body.querySelector('.slider') as HTMLElement,
    bar: document.body.querySelector('.slider__bar') as HTMLElement,
    filler: document.body.querySelector('.slider__filler') as HTMLElement,
    firstDot: document.body.querySelector('.slider__dot-wrapper_order_first') as HTMLElement,
    firstValue: document.body.querySelector('.slider__dot-value_order_first') as HTMLElement,
    secondDot: document.body.querySelector('.slider__dot-wrapper_order_second') as HTMLElement,
    secondValue: document.body.querySelector('.slider__dot-value_order_second') as HTMLElement,
    min: document.body.querySelector('.slider__min') as HTMLElement,
    max: document.body.querySelector('.slider__max') as HTMLElement,
    scale: document.body.querySelector('.slider__scale') as HTMLElement,
    scaleItems: document.body.querySelectorAll('.slider__scale-elem')
  });
  jest.spyOn(view, 'updateViewOptions');

  afterEach(() => {
    view.updateViewOptions(defaultOptions, mockCoords);
    view.render();
  });

  it('creates a slider', () => {
    const {
      slider,
      bar,
      filler,
      firstDot,
      firstValue,
      secondDot,
      secondValue,
      scale,
      min,
      max
    } = getSliderElems();

    expect(slider).toBeTruthy();
    expect(bar).toBeTruthy();
    expect(filler).toBeTruthy();
    expect(firstDot).toBeTruthy();
    expect(firstValue).toBeTruthy();
    expect(secondDot).toBeTruthy();
    expect(secondValue).toBeTruthy();
    expect(scale).toBeTruthy();
    expect(min).toBeTruthy();
    expect(max).toBeTruthy();
  });

  it('gives input a class "slider_hidden"', () => {
    const { input } = getSliderElems();

    expect(input.classList.contains('slider_hidden')).toBeTruthy();
  });

  it('checks option "double" to remove or add a hiding class to first dot', () => {
    view.updateViewOptions({ ...defaultOptions, double: false }, mockCoords);
    view.render();
    const { firstDot } = getSliderElems();
    expect(firstDot.classList.contains('slider_hidden')).toBeTruthy();

    view.updateViewOptions({ ...defaultOptions, double: true }, mockCoords);
    view.render();
    expect(firstDot.classList.contains('slider_hidden')).toBeFalsy();
  });

  it('adds verical class if option "vertical" is true', () => {
    view.updateViewOptions({ ...defaultOptions, vertical: true }, mockCoords);
    view.render();
    const { slider } = getSliderElems();

    expect(slider.classList.contains('slider_vertical')).toBeTruthy();
  });

  it('toggles the min-max elements hide class depends on the value', () => {
    const { min, max } = getSliderElems();

    view.updateViewOptions({
      ...defaultOptions, min: 0, to: 0, max: 100
    }, mockCoords);
    view.render();

    expect(min.classList.contains('slider_hidden')).toBeTruthy();

    view.updateViewOptions({
      ...defaultOptions, min: 0, to: 100, max: 100
    }, mockCoords);
    view.render();

    expect(max.classList.contains('slider_hidden')).toBeTruthy();

    view.updateViewOptions({
      ...defaultOptions,
      min: 0,
      to: 100,
      from: 0,
      double: true,
      max: 100
    }, mockCoords);
    view.render();

    expect(min.classList.contains('slider_hidden')).toBeTruthy();
    expect(max.classList.contains('slider_hidden')).toBeTruthy();
  });

  it('shows correct current values above the dot', () => {
    const { firstValue, secondValue } = getSliderElems();

    expect(secondValue.textContent).toBe(String(defaultOptions.to));

    view.updateViewOptions({ ...defaultOptions, double: true }, mockCoords);
    view.render();

    expect(firstValue.textContent).toBe(String(defaultOptions.from));
  });

  it('changes the value textContent when values are close', () => {
    view.updateViewOptions({
      ...defaultOptions, double: true, from: 1000, to: 1000
    }, mockCoords);
    view.render();
    const { firstValue, secondValue } = getSliderElems();

    expect(firstValue.classList.contains('slider_hidden')).toBeTruthy();
    expect(secondValue.textContent).toBe('1000 - 1000');
  });

  it('values change on scale click', () => {
    view.updateViewOptions({ ...defaultOptions, scale: true }, mockCoords);
    view.render();
    const mock = jest.fn();
    const { scaleItems } = getSliderElems();

    view.updateViewOptionsObserver.attach(mock);
    $(scaleItems[0]).trigger('click');
    expect(mock).toHaveBeenCalled();
  });

  it('values change on bar click', () => {
    const mock = jest.fn();
    const { bar } = getSliderElems();

    view.updateViewOptionsObserver.attach(mock);
    $(bar).trigger('click');

    expect(mock).toHaveBeenCalled();
  });

  describe('sets the right styles for dots', () => {
    const { firstDot, secondDot } = getSliderElems();

    describe('orientaion', () => {
      it('horizontal', () => {
        expect(parseFloat(secondDot.style.left)).toBe(70);

        view.updateViewOptions({ ...defaultOptions, double: true }, mockCoords);
        view.render();

        expect(parseFloat(firstDot.style.left)).toBe(30);
      });

      it('vertical', () => {
        view.updateViewOptions({ ...defaultOptions, double: true, vertical: true }, mockCoords);
        view.render();

        expect(parseFloat(firstDot.style.top)).toBe(30);
        expect(parseFloat(secondDot.style.top)).toBe(70);
      });
    });
  });

  describe('sets the right styles for filler', () => {
    const { filler } = getSliderElems();

    describe('orientaion', () => {
      it('horizontal', () => {
        view.updateViewOptions({ ...defaultOptions, from: 0 }, mockCoords);
        view.render();

        expect(parseFloat(filler.style.left)).toBe(0);
        expect(parseFloat(filler.style.width)).toBe(70);

        view.updateViewOptions({ ...defaultOptions, double: true }, mockCoords);
        view.render();

        expect(parseFloat(filler.style.left)).toBe(30);
        expect(parseFloat(filler.style.width)).toBe(40);
      });

      it('vertical', () => {
        view.updateViewOptions({ ...defaultOptions, double: true, vertical: true }, mockCoords);
        view.render();

        expect(parseFloat(filler.style.top)).toBe(30);
        expect(parseFloat(filler.style.height)).toBe(40);
      });
    });
  });
});
